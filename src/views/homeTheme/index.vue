<template>
<div class="app-container">
    <el-row type="flex" class="table-foot">
        <el-col>
            <el-select v-model="searchInfo.status" placeholder="请输入资源状态" clearable>
                <el-option v-for="item in optionsStatus" :key="item.id" :label="item.name" :value="item.id"></el-option> 
            </el-select>
            <el-input v-model="searchInfo.topicId" type="number" placeholder="请输入话题ID" clearable></el-input>
            <el-button type="primary" @click="getData">搜索</el-button>
        </el-col>
        <el-col align="right">
            <el-button-group>
                <el-button type="primary" @click="newsAdd">添加</el-button>
                <el-button type="primary" @click="changeSort">更改排序</el-button>
                <el-button type="success" @click="refreshTable">刷新</el-button>
            </el-button-group>
        </el-col>
    </el-row>
    <el-form :inline="true"  class="demo-form-inline" label-width="80px"> 
        <el-table :data="tableData" v-loading="loading" element-loading-text="正在加载中" :border="true" v-if="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column v-if="col.field == 'description'" v-for="col in cols" :key="col.field" :formatter="col.formatter" :prop="col.field" :label="col.label" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="text(scope.row)" class="omit">{{scope.row.description}}</el-button>
                </template>
            </el-table-column>

            <el-table-column align="center" v-else-if="col.field === 'cover'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <a @click="setSrc(scope.row[scope.column.property])"><img :src="scope.row[scope.column.property]" class="header_pic" /></a>
                </template>
            </el-table-column>

            <el-table-column align="center" v-else-if="col.field === 'subDescription'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <div v-if="scope.row.subDescription && scope.row.subDescription != 'null'">{{scope.row.subDescription}}</div>
                    <div v-else>显示热度值</div>
                </template>
            </el-table-column>

            <el-table-column v-else-if="col.field === 'tagList'" :formatter="col.formatter" :prop="col.field" :label="col.label" align="center" :width="col.width">
                <template slot-scope="scope">
                    <div class="box">
                    <el-button-group  class="tagList">
                        <el-button v-for="item in scope.row.tagList" :key="item.id" :style="'background:'+item.rgb" class="tagList1" type="mini">{{item.name}}</el-button>
                    </el-button-group>
                </div>
                </template>
            </el-table-column>

            <el-table-column v-else-if="col.field === 'indexs'" type="index" :formatter="col.formatter" :prop="col.field" :label="col.label" align="center" :width="col.width"></el-table-column>

            <el-table-column v-else :formatter="col.formatter" :prop="col.field" :label="col.label" align="center" :width="col.width"></el-table-column>

            <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="postEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" v-if="scope.row['status'] == 1" @click="handleStatus(scope.$index, scope.row)">下架</el-button>
                        <el-button size="mini" type="info" v-if="scope.row['status'] == 0" @click="handleStatus(scope.$index, scope.row)">上架</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
            
        <!-- 添加编辑消息内容弹框 -->
        <el-dialog title="添加" :visible.sync="dialogFormVisible" :lock-scroll="false"  @close="handleClose">
            <el-form :model="formLabelAlign" class="demo-ruleForm">
                <el-form-item label="消息内容">
                    <el-input v-model="formLabelAlign.content" placeholder="输入消息文本" clearable style="max-width:180px;"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接">
                    <el-input v-model="formLabelAlign.link" placeholder="跳转URL" clearable style="max-width:180px;"></el-input>
                </el-form-item>
                <el-form-item label="定时发布">
                    <el-date-picker v-model="formLabelAlign.createTime" type="datetime" clearable placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" style="max-width:180px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input v-model="formLabelAlign.userId" placeholder="若无用户ID,则推送给全部用户" clearable style="max-width:180px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button type="primary" @click="postNews" v-show="timeSend">定时推送</el-button> -->
            </div>
        </el-dialog>

        <!-- 消息内容弹框 -->
        <el-dialog title="消息内容详情" :visible.sync="textShow">
            <div>{{textContent}}</div>
        </el-dialog>

        <el-dialog title="查看" :visible.sync="imageDialog" width="30%">
            <img :src="imgSrc" width="100%"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="imageDialog = false">确 定</el-button>
            </span>
        </el-dialog>

    </el-form>

    <el-row type="flex" class="table-foot">
        <el-col align="right">
            <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle" :current-page="startPage" :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
        </el-col>
    </el-row>

    
</div>
</template>
<script>
export default {
    data(){
        return{
            loading:true,   //loading
            userId:"",    //用户id
            tableData: false,
            pageSize: 20, //每页大小
            startPage: 1, //当前页
            totalNum: 0, // 总数
            small: true, //小屏幕
            
            cols: [
                {field: 'indexs',label: '排序',width:50},
                {field: 'id',label: '资源ID',width:70},
                {field: 'status',label: '资源状态',width:80,   //推送状态 0下架 1：上架
                    formatter:(row, column, cellValue)=>{   
                        switch (cellValue) {
                            case 0:
                                return '待上架';
                                break;
                            case 1:
                                return '已上架';
                                break;
                            default:
                                return '未下架'
                        }
                    }
                },
                {field: 'publishType',label: '定时状态',       //publishType 发布状态 0：非定时 1：定时发布
                    formatter:(row, column, cellValue)=>{   
                        switch (cellValue) {
                            case 0:
                                return '非定时';
                                break;
                            case 1:
                                return '定时';
                                break;
                            default:
                                return '非定时'
                        }
                    }
                },
              {field: 'topicId',label: '话题ID',width:70},
              {field: 'cover',label: '图片',width:100},
              {field: 'title',label: '标题'},
              {field: 'description',label: '简介1'},
              {field: 'subDescription',label: '简介2'},
              {field: 'tagList',label: '角标'},
              {field: 'publishTime',label: '预发布时间'},
              {field: 'offlineTime',label: '预下架时间'}
            ],
            // isShow:false,              //点击添加按钮为true， 编辑为false，默认为false
            dialogFormVisible:false, // 添加弹出框
            formLabelAlign:{},      //消息内容
            timeSend:true,          //定时推送按钮显示隐藏
            textShow:false,         //消息内容弹框
            textContent:false,      //消息内容
            checkIds:false,         //选择内容
            imgSrc:"",
            imageDialog:false,
            searchInfo:{
                topicId:'',
                status:''
            },  //  搜索条件
            optionsStatus:[       
                {id:0,name:'待上架'},
                {id:1,name:'已上架'}
            ],
            
        }
    },
    activated(){
        this.getData()
    },
    methods:{
        handleStatus(param, row) {
            let data = {
                id: row.id,
                status: row.status == 0 ? 1 : 0,
            }
            this.$http.post({
                isJson:false,
                url:'/topicIndex/changeStatus',
                params:data,
                success:res=>{
                    if(res.code == 0){
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        })

                        this.getData()
                    }else{
                        this.$message({
                            type: 'warning',
                            message: res.msg
                        })
                    }
                }
            })
        },
        // 更改排序
        changeSort() {
        let sort = this.checkIds.join(',')
        console.log('this.checksid',this.checkIds,'sort:',sort)
        if (this.checkIds && this.checkIds.length == 1) {
            
            this.$prompt('输入后该数据会插入到该位置', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[1-9][0-9]{0,}$/,
                inputErrorMessage: '输入格式不正确'
            })
            .then(({ value }) => {
                const data = {
                    id: sort,
                    num: value
                }
                const url = '/topicIndex/rank';
                this.$http.post(url, data, res => {
                this.$message({
                    type: 'success',
                    message: '你输入的排序为: ' + value
                })
                var timer = setTimeout(() => {
                    this.getData()
                    clearTimeout(timer)
                    }, 500)
                })
            })
            .catch((err) => {
                
                this.$message({
                type: 'info',
                message: err
                })
            })  
        } else {
            this.$message('请选择1个你要更改排序的话题')
        }
    },
        // 多选
        handleSelectionChange(val){
            this.checkIds = []

            val.forEach(value => {
                this.checkIds.push(value.id)
            });

            console.log(val,this.checkIds)
        },
        // 消息内容弹框
        text(row){
            this.textShow = true;
            this.textContent = row.description
        },

         // 添加
        newsAdd(){
            // this.dialogFormVisible = true;
            // this.isShow = true;     //点击添加按钮为true， 编辑为false
            this.$router.push({
                path:'/homeTheme/themeEdit',
                query:{
                    type:'add'
                }
            })
        },

        //查看
        postDetail(row){
            this.timeSend = false;
            this.dialogFormVisible = true;
            this.formLabelAlign = row;
        },

        handleClose() {
            this.timeSend = true;
            this.formLabelAlign = {}
        },

        // 编辑
        postEdit(row){
            console.log(row)
            this.$router.push({
                path:'/homeTheme/themeEdit',
                query:{
                    type:'edit',
                    list:JSON.stringify(row)
                }
            })
        },

        //搜索
        search(){
            this.startPage = 1;
            this.pageSize = 20;
            this.getData()
        },

        // 获取表格数据
        getData(){
            this.loading = true;
            let inputData={       //表格传参数据
                pageSize: this.pageSize,
                startPage: this.startPage,
                status:this.searchInfo.status,
                topicId:this.searchInfo.topicId
            }
            this.$http.post({
                isJson:true,
                url:'/topicIndex/list',
                params:inputData,
                success: res=>{
                    if(res.data.list){
                        this.tableData = res.data.list  
                        this.totalNum = res.data.total
                        // console.log('嘤嘤嘤',this.tableData)
                    }else{
                        this.$message('抱歉暂无数据')
                        this.tableData = false;
                        
                    }
                    this.loading = false
                }
            })
        },

        //刷新
        refreshTable() {
          this.startPage = 1
          this.pageSize = 20
          this.getData()
        },

        sizeChangeHandle(size) {
            //分页大小发生变化
            this.pageSize = size
            this.getData()
        },

        currentChangeHandle(currentPage) {
            //页数发生变化
            this.startPage = currentPage
            this.getData()
        },

        setSrc(src){
            this.imgSrc = src;
            this.imageDialog = true;
        },

    }
}

</script>
<style  scoped>
    .app-container{
        color: #999;
    }
    .toTop{
        margin-left: 50px;
    }
    .marginTop{
        margin-top: 50px;
    }
    .margin-right{
        margin-right: 20px;
        color: #606266;
    }
    .el-input{
        width: 200px;
    }
    .el-button{
        margin-left: 0px;
    }
    .table-foot,.demo-form-inline{
        margin-top: 10px;
    }
    .el-form-item{
        display: block;
    }
    .tagList1{
        color: #fff;
    }
    .omit{
        color:#606266;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
    }
    
</style>
