<template>
<div class="app-container">
    <el-form :inline="true"  class="demo-form-inline">
        <div class="left">
            <el-form-item label="">
                <el-input v-model="topicId" type="number" placeholder="请输入话题ID" @keyup.enter="search" clearable></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-input v-model="topicName" placeholder="请输入话题标题内容" @keyup.enter="search" clearable></el-input>
            </el-form-item>
            <el-select v-model="groupId" placeholder="按照圈子来源" clearable>
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option> 
            </el-select>        
            <el-button type="primary" @click.enter="search">查询</el-button>
        </div>
        <div class="right">
            <el-button-group>
                <el-button type="primary" @click="add">添加</el-button>
                <el-button type="success" @click="refreshTable">刷新</el-button>
            </el-button-group>
        </div>
    </el-form>   
    <!-- 表格数据 -->
    <el-table v-loading="loading" element-loading-text="正在加载中" :data="tableData" @sort-change="sort"  :border="true" v-if="tableData" style="width: 100%">
        <el-table-column align="center" v-if="col.type === 'url'" v-for="col in cols" :key="col.field" :prop="col.field" :label="col.label" :width="col.width">
            <template slot-scope="scope">
                <audio id="audio1" v-show="scope.row[scope.column.property]" preload="none" :src="getUrl(scope.row[scope.column.property])" style="width:200px" controls="controls"></audio>
            </template>
        </el-table-column>

        <el-table-column align="center" v-else-if="col.field === 'cover'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
            <template slot-scope="scope">
                <a @click="setSrc(scope.row[scope.column.property])"><img :src="scope.row[scope.column.property]" class="header_pic" /></a>
            </template>
        </el-table-column>

        <el-table-column :label="col.label" v-else-if="col.field === 'description'" align="center" width="270">
            <template slot-scope="scope">
                <div v-if="scope.row.radioUrl && scope.row.description">
                    <audio :src="scope.row.radioUrl" controls style="width:250px;"></audio>
                    <p>{{scope.row.description}}</p>
                </div>
                <audio v-else-if="scope.row.radioUrl" :src="scope.row.radioUrl" controls></audio>
                <div v-else>{{scope.row.description}}</div>
            </template>
        </el-table-column>

        <el-table-column :label="col.label" v-else-if="col.field == 'type'" align="center">
            <template slot-scope="scope">
                <el-button-group>
                    <!-- <el-button size="mini" type="danger" v-if="scope.row['type'] == 1")">普通话题</el-button> -->
                    <div v-if="scope.row['type'] == 1">普通话题</div>
                    <div v-if="scope.row['type'] == 2" class="red">热议话题</div>
                </el-button-group>
            </template>
        </el-table-column>

        <el-table-column :label="col.label" v-else-if="col.field == 'postEnable'" align="center" :width="col.width">
            <template slot-scope="scope">
                <el-button-group>
                    <el-switch :plain="true" :value="scope.row.postEnable" @change="changePostEnable(scope.row)" :active-value="1" :inactive-value="0"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-button-group>
            </template>
        </el-table-column>

        <el-table-column :label="col.label" v-else-if="col.field == 'status'" align="center" :width="col.width">
            <template slot-scope="scope">
                <el-button-group>
                    <el-switch :plain="true" :value="scope.row['status']" @change="changeStatus(scope.row)" :active-value="1" :inactive-value="2"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-button-group>
            </template>
        </el-table-column>

        <el-table-column align="center" v-else-if="col.type === 'indexs'" type="index" :formatter="col.formatter" :prop="col.field" label="排序" :width="50"></el-table-column>

        <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width"></el-table-column>


        <el-table-column label="操作" align="center" width="250">
            <div slot-scope="scope">
                <el-button-group>
                    <el-button size="mini" type="primary" @click="handleTopic(scope.row)">话题帖子</el-button>
                    <el-button size="mini" type="info" @click="handleEdit(scope.row)">编辑资料</el-button>
                    <el-button size="mini" type="warning" @click="handlePosted(scope.row)">发帖</el-button>
                </el-button-group>
            </div>
        </el-table-column>
    </el-table>   

    <!-- 表单 -->
    <el-dialog title="查看" :visible.sync="imageDialog" width="30%">
        <img :src="imgSrc" width="100%"/>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="imageDialog = false">确 定</el-button>
        </span>
    </el-dialog>
    
    <div class="block">
        <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle" :current-page="startPage" :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
    </div>

    
</div>
</template>
<script>
import MyUpload from "@/components/MyUpload";
export default {
    components: {
        MyUpload
    },
    data(){
        return{
            loading:true,   //loading
            tableData: false,
            pageSize: 20, //每页大小
            startPage: 1, //当前页
            totalNum: 0, // 总数
            small: true, //小屏幕
            inputData:{
                pageSize:20,
                startPage:1
            }, //表格传参数据
            cols: [
                {field: "indexs",label: "排序",type:"indexs"},
                {field: "id",label: "话题id",width:'70'},
                {field: "cover",label: "封面图",width:'100'},
                {field: "name",label: "话题名称"},
                {field: "groupName",label: "圈子来源"},
                {field: "description",label: "简介",},
                {field: "createTime",label: "创建时间",},
                {field: "pv",label: "浏览数",width:'70'},
                {field: "attentionCount",label: "关注人数",width:'70'},
                {field: "postCount",label: "发帖数",width:'70'},
                {field: "topicAdminName",label: "话题主",},
                {field: "postEnable",label: "显示发帖按钮",width:'80'},
                // {field: "type",label: "状态",type:'type'},              //type1：普通 2：热议
                {field: "status",label: "圈内发帖是否显示",width:'80'}           // 状态：0：下架 1：上架
            ],
            validRule: {        // 表单验证
                name: [{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }],
                headUrl: [{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }],
            },
            topicId:'',     //话题id
            topicName:'',   //  话题内容
            groupId:'',     //圈子id
            options:[],     //圈子数据
            imgSrc:"",
            imageDialog:false,
        }
    },
    activated(){
        this.getGroup();
        // this.tableData = false;

        this.pageSize = 20;
        this.startPage = 1;
        this.getData()
        let query = this.$router.currentRoute.query;
        // if(){
        //     this.search();
        // }
        
    },
    methods:{
        //隐藏发帖按钮隐藏事件
        changePostEnable(row){
            console.log(row)
            let data = {
                id:row.id,
                status:row.postEnable == 0 ? 1 : 0, // 状态：0：不显示 1：显示
            }

            this.$http.post({
                isJson:true,
                url:`/topic/isPostEnable`,
                params:data,
                success: res => {
                    if(res.msg === 'OK' && res.code == 0){
                        this.$message({
                            type: "success",
                            message: "操作成功",
                        });
                        row.postEnable = row.postEnable == 1 ? 0 : 1;
                    }
                }
            });
        },
        //发帖
        handlePosted(row){
            this.$router.push({
                name:'posted',
                query:{
                    groupId:row.groupId,
                    topicId:row.id
                }
            })
        },
        // 修改圈内帖子是否显示
        changeStatus(row){
            let data = {
                id:row.id,
                status:row.status == 2 ? 1 : 2, // 状态：2：下架 1：上架
            }
            this.editType="status";
            let url='/topic/changeStatus'
            this.$http.post({
                isJson:false,
                url:url,
                params:data,
                success: res => {
                    if(res.msg === 'OK'){
                        this.$message({
                            type: "success",
                            message: "操作成功",
                        });
                        row.status = row.status == 1 ? 2 : 1;
                    }
                }
            });
        },
        //获取下拉数据圈子
        getGroup(){
            this.$http.get({    
                isJson:false,
                url:'/group/kvs',
                success:res=>{
                    this.options=res.data;
                }
            })
        },
        // 跳转话题帖子
        handleTopic(row){
            // console.log('1111111111111111',row)
            this.$router.push({
                path:'/circle/topicPost',
                query:{
                    topicId:row.id,
                    groupName:this.groupName
                }
            })
        },
        // 排序
        sort(options){
            console.log(1111111111,options)
            if(options.order == 'descending'){
                this.orderBy =`${options.prop} desc`;
            }else{
                this.orderBy =`${options.prop} asc`;
            }
            
            this.inputData.order = this.orderBy;
            this.getData()
        },
        // 添加
        add(){
            this.$router.push({
                path: "/circle/gambit/edit",
                query: {
                    type: 'add'
                }
            });
        },
        //刷新
        refreshTable() {
          this.startPage = 1
          this.pageSize = 20
          this.getData()
        },
        //编辑
        handleEdit(row){
            this.$router.push({
                path: "/circle/gambit/edit",
                query: {
                    type:'edit',
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    groupId:row.groupId,
                    hotValue:row.hotValue,
                    cover:row.cover,
                    topicAdminId:row.topicAdminId,
                    radioTime:row.radioTime,
                    radioTitle:row.radioTitle,
                    radioUrl:row.radioUrl
                }
            })
        },
        //搜索
        search(){
            this.pageSize = 20
            this.startPage = 1

            this.inputData = {
                topicId:this.topicId,
                topicName:this.topicName,
                groupId:this.groupId,
                pageSize: 20,
                startPage: 1
            }
           
            console.log('this.inputData',this.inputData)
            this.getData()
        },
        // 获取表格数据
        getData(){
            console.log(this.inputData)
            this.loading = true
            this.$http.post({
                isJson:true,
                url:'/topic/list',
                params:this.inputData,
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

        sizeChangeHandle(size) {
            //分页大小发生变化
            this.inputData.pageSize = size
            this.pageSize = size
            this.getData()
        },

        currentChangeHandle(currentPage) {
            //页数发生变化
            this.inputData.startPage = currentPage
            this.getData()
        },

        // 自定义函数
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
    .left{
        float: left;
    }
    .right{
        float: right;
    }

</style>
