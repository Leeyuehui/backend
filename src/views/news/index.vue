<template>
<div class="app-container">
    <el-row type="flex" class="table-foot">
        <el-col align="right">
            <el-button  type="primary" @click="newsAdd">添加</el-button>
            <el-button  type="success" @click="refreshTable">刷新</el-button>
        </el-col>
    </el-row>
    <el-form :inline="true"  class="demo-form-inline"> 
        <el-table :data="tableData" v-loading="loading" element-loading-text="正在加载中" :border="true" v-if="tableData" style="width: 100%">

            <el-table-column v-if="col.field == 'content'" v-for="col in cols" :key="col.field" :formatter="col.formatter" :prop="col.field" :label="col.label" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="text(scope.row)" style="color:#606266" >{{scope.row.content}}</el-button>
                </template>
            </el-table-column>
            <el-table-column v-else :formatter="col.formatter" :prop="col.field" :label="col.label" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="250">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="postDetail(scope.row)" v-if="scope.row.status == 1">查看</el-button>
                        <el-button size="mini" type="primary" @click="postEdit(scope.row)" v-if="scope.row.status == 0">编辑</el-button>
                        <el-button size="mini" type="danger" @click="postDelete(scope.row)">删除</el-button>
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
                <el-button type="primary" @click="postNews" v-show="timeSend">定时推送</el-button>
            </div>
        </el-dialog>

        <!-- 消息内容弹框 -->
        <el-dialog title="消息内容详情" :visible.sync="textShow">
            <div>{{textContent}}</div>
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
              {field: 'id',label: 'ID'},
              {field: 'status',label: '状态',   //推送状态 0：未发布 1：已发布
                formatter:(row, column, cellValue)=>{   
                    switch (cellValue) {
                        case 0:
                            return '待发布';
                            break;
                        case 1:
                            return '已发布';
                            break;
                        default:
                            return '待发布'
                    }
                }
              },
              {field: 'content',label: '消息内容'},
              {field: 'link',label: '跳转链接'},
              {field: 'userId',label: '推送范围',   // -1000 全部用户
                formatter:(row, column, cellValue)=>{   
                    switch (cellValue) {
                        case -1000:
                            return '全部用户';
                            break;
                        default:
                            return row.userId
                    }
                }
              },
              {field: 'createTime',label: '推送时间'},
              {field: 'userCount',label: '送达人数'},
            ],
            // isShow:false,              //点击添加按钮为true， 编辑为false，默认为false
            dialogFormVisible:false, // 添加弹出框
            formLabelAlign:{},      //消息内容
            timeSend:true,          //定时推送按钮显示隐藏
            textShow:false,         //消息内容弹框
            textContent:false,      //消息内容
        }
    },
    activated(){
        this.getData()
    },
    methods:{
        // 消息内容弹框
        text(row){
            this.textShow = true;
            this.textContent = row .content
        },

         // 添加
        newsAdd(row){
            // this.dialogFormVisible = true;
            // this.isShow = true;     //点击添加按钮为true， 编辑为false
            this.$router.push({
                path:'/news/systemEdit',
                query:{
                    isShow:true
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

        // 定时推送
        // postNews(){
        //     let data=this.formLabelAlign,url,message;
        //     if(data.content && data.createTime){
        //         if(this.isShow){
        //             data.type = 1;            //type 0:模板消息，1:站内消息
        //             url = '/message/sendSystemMessage';
        //             message = '添加成功'
        //         }else{
        //             url = '/message/udpateMessagePush';
        //             message = '更新成功'
        //         }

        //         this.$http.post({
        //             isJson:true,
        //             url:url,
        //             params:data,
        //             success:res=>{
        //                 this.$message({
        //                     message:message,
        //                     type:'success'
        //                 })
        //                 this.dialogFormVisible = false;
        //                 this.getData()
        //             }
        //         })
        //     }else{
        //         this.$message({
        //             message:'消息文本及发布时间不允许为空',
        //             type:'warning'
        //         })
        //     }
        // },

        // 编辑帖子
        postEdit(row){
            // this.dialogFormVisible = true;
            // this.isShow = false;
            // this.formLabelAlign=row;

            this.$router.push({
                path:'/news/systemEdit',
                query:{
                    formLabelAlign:row,
                    isShow:false
                }
            })
        },
        
        //删除站内消息
        postDelete(row){
            console.log(row)
            let data = [row.id]
            this.$http.post({
                isJson:true,
                url:'/message/removeMessagePush',
                params:data,
                success: res=>{
                    if(res.code == 0 && res.data == 1){
                        this.$message({
                            message:'删除成功',
                            type:'success'
                        })
                        this.refreshTable()
                    }
                }
            })
        },

        // 获取表格数据
        getData(){
            this.loading = false
            let inputData={       //表格传参数据
                pageSize: this.pageSize,
                startPage: this.startPage,
                type:1    //type 0：模板消息 1：系统消息
            }
            this.$http.post({
                isJson:true,
                url:'/message/queryMessagePushList',
                params:inputData,
                success: res=>{
                    console.log(res)
                    if(res.data.list){
                        this.tableData = res.data.list  
                        this.totalNum = res.data.total
                        this.loading = false
                        // console.log('嘤嘤嘤',this.tableData)
                    }else{
                        this.$message('抱歉暂无数据')
                        this.tableData = false
                        this.loading = false
                    }
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
        },

        currentChangeHandle(currentPage) {
            //页数发生变化
            this.startPage = currentPage
            this.getData()
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
    
</style>
