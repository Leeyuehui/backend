<style lang="css" scoped>
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
    .hand{
        cursor: pointer;
        color:#606266;
    }
    .el-button{
        white-space: pre-wrap
    }
    .reason{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #eee;
        text-align: center;
    }
    .sucIcon{
        font-size:16px;
        padding:3px;
    }
    .sureIcon{
        margin-top: 15px;
        margin-left: 30px;
    }
    .el-table >>> tr.first-row{
        background: #f9f9f9;
    }
</style>
<template>
<div class="app-container">
    <el-form :inline="true"  class="demo-form-inline"> <!--  :model="formInline" -->
        <el-form-item label="">
            <el-input v-model="comId" placeholder="请输入评论ID" style="width:150px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-input v-model="comContent" placeholder="请输入评论文本内容" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-input v-model="postId" placeholder="请输入从属的帖子ID" style="width:150px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-input v-model="parentId" placeholder="请输入从属的评论ID" style="width:150px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-input v-model="userId" placeholder="请输入用户的ID" style="width:150px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-date-picker v-model="publishTime" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
        </el-form-item>
        <el-select v-model="deleteStatus" placeholder="选择状态" style="width:150px;" clearable>
            <el-option v-for="item in optionsStatus" :key="item.id" :label="item.name" :value="item.id" ></el-option>
        </el-select>
        <el-select v-model="userType" placeholder="请选择用户类型" style="width:150px;" clearable>
            <el-option v-for="item in optionsUser" :key="item.id" :label="item.name" :value="item.id"></el-option> 
        </el-select>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="clearRefresh">刷新</el-button>
        
        <el-table v-loading="loading" element-loading-text="正在加载中" :data="tableData" :border="true" v-if="tableData" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column prop="id" label="评论ID" align="center" width="80"></el-table-column>
            <el-table-column :prop="postStatus.field" :label="postStatus.label" :formatter="postStatus.formatter" align="center" width="100"></el-table-column>
            <el-table-column prop="content" label="文本" align="center">
                <template slot-scope="scope">
                    <el-button type="text" class="hand" @click="showComment(scope.row.content)">{{scope.row.content}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="用户" align="center">
                <template slot-scope="scope">
                    <router-link target="_blank" :to="{name:'userManage',query:{userId:scope.row.userId,userType:scope.row.source == 0 ? 0 : 1}}"><div style="color:#87C3E6;">{{scope.row.userName}}</div></router-link>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="从属于帖子" align="center">
                <template slot-scope="scope">
                    <router-link target="_blank" :to="{name:'post',query:{postId:scope.row.postId}}"><div style="color:#87C3E6;">{{scope.row.postId}}</div></router-link>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="从属于评论" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="gotoComment(scope.row.parentId)"><div style="color:#87C3E6;">{{scope.row.parentId}}</div></el-button>
                </template>
            </el-table-column>
            <el-table-column prop="likeCount" label="抱抱" align="center" width="80"></el-table-column>
            <el-table-column prop="replyCount" label="回复数量" align="center" width="80"></el-table-column>
            <el-table-column prop="createTime" label="发表时间" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="320">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="delTK(scope.row)" :disabled="scope.row.deleteStatus != 0">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <!--删除对话框 -->
        <el-dialog title="请选择删除理由" :visible.sync="delReason" width="200px">
            <div>
                <div class="reason" v-for="item in delList" :key="item.id" @click="active(item)">
                    {{item.name}}
                    <el-button type="success" icon="el-icon-check" v-if="activeId == item.id" class="sucIcon" circle></el-button>
                </div>
            </div>
            <el-button type="primary" @click="postDelete" class="sureIcon">确定删除</el-button>
        </el-dialog>

        <!-- 表单 -->
        <el-dialog title="评论详情" :visible.sync="isShow" width="800px">
            <div >
                {{allComment}}
            </div>
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
            loading:true,
            userId:"",    //用户id
            tableData: false,
            pageSize: 20, //每页大小
            startPage: 1, //当前页
            totalNum: 0, // 总数
            small: true, //小屏幕
            inputData:{       //表格传参数据
            },
            comId:'',          //评论id
            postId:'',         //从属的帖子id
            comContent:'',     //帖子文本内容
            parentId:'',       //从属的评论id
            publishTime:'',     //发表时间
            allComment:'',    //显示评论详情
            postStatus:{
                field: "deleteStatus",      //deleteStatus   0：未删除 1:管理员删除 2:用户删除
                label: "评论状态",
                formatter:(row, column, cellValue)=>{   
                    switch (cellValue) {
                        case 0:
                            return '已发布';
                            break;
                        case 1:
                            return '管理员删除';
                            break;
                        default:
                            return '用户删除 '
                    }
                }
            },
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            optionsStatus:[
                {id:0,name:'已发布'},
                {id:1,name:'管理员删除'},
                {id:2,name:'用户删除'},
            ],
            optionsUser:[        //马甲   0：真实用户 1:官方用户
                {id:0,name:'真实用户'},
                {id:1,name:'官方用户'}
            ],
            isShow:false,   //操作记录弹框
            delReason:false,    // 删除对话框
            delList:[],         //删除数据
            activeId:false,       //选中删除理由
            editInfo:[],   
            deleteStatus:0,    //筛选状态  
            userType:'',        //用户类型   
        }
    },
    activated(){
        this.clearRefresh();

        let query = this.$router.currentRoute.query
        if(query.userId){
            this.userId = query.userId
            this.search()
        }
        if(query.postId){
            this.postId = query.postId
            this.search()
        }
        if(query.comId){
            this.comId = query.comId
            this.search()
        }
    },
    methods:{
        //处理每行的背景色
        tableRowClassName({row, rowIndex}) {
            if (row.commentType === 1) {
                return 'first-row';
            }
            return '';
        },
        // 弹出删除对话框
        delTK(row){
            this.editInfo.push(row.id);
            
            this.$http.get({
                isJson:false,
                url:'/dealReason/kvs',
                success:res=>{
                    if(res.code == 0){
                        this.delList =res.data;
                        this.activeId = res.data[0].id;
                        this.delReason = true;
                    }
                }
            })
        },
        // 选择删除理由
        active(item){
            this.activeId = item.id
        },
        //删除帖子
        postDelete(){
            this.delReason = false;
            const params = {
                ids:this.editInfo,
                deleteReasonId:this.activeId
            }
            this.$confirm('是否确认删除此评论', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                
            }).then(() => {
                this.$http.post({
                    isJson:false,
                    url:'/comment/remove',
                    params:params,
                    success: res=>{
                        if(res.code == 0 && res.data == 1){
                            this.$message({
                                message:'删除成功',
                                type:'success'
                            })
                            this.editInfo = []
                            this.activeId = false
                            this.getData()
                        }
                    }
                })
            }).catch(() => {
                        
            });
            
        },
        //显示评论内容
        showComment(com){
            this.isShow = true;
            this.allComment = com;
        },
        //查询评论
        gotoComment(commentId){
            this.userId = '';
            this.comId = '';
            this.postId = '';
            this.comContent = '';
            this.parentId = '';
            this.publishTime = '';
            if (commentId) {
                this.comId = commentId;
                this.search();
            }
        },

        //清空搜索条件
        clearRefresh(){
            this.userId = '';
            this.comId = '';
            this.parentId = '';
            this.postId = '';
            this.comContent = '';
            this.publishTime = '';
            this.deleteStatus = 0; 
            this.userType = '';
        },

        //搜索
        search(){
            if(!this.userId && !this.comId && !this.comContent && !this.publishTime && !this.parentId && !this.postId && !this.userType && this.userType !== 0){
                this.inputData = {
                    pageSize: 20,
                    startPage: 1,
                    deleteStatus:this.deleteStatus,
                }
            }else{
                this.inputData = {
                    userId:this.userId,
                    commentId:this.comId,
                    parentId:this.parentId,
                    postId:this.postId,
                    content:this.comContent,
                    startTime:this.publishTime[0],
                    endTime:this.publishTime[1],
                    deleteStatus:this.deleteStatus,
                    userType:this.userType,
                    pageSize: 20,
                    startPage: 1,
                }
            }
            this.pageSize = 20;
            this.startPage = 1;
            this.getData();
        },
        // 获取表格数据
        getData(){
            this.loading = true
            this.$http.post({
                isJson:true,
                url:'/comment/list',
                params:this.inputData,
                success: res=>{
                    console.log(res)
                    if(res.data.list){
                        this.tableData = res.data.list  
                        this.totalNum = res.data.total
                        this.loading = false
                    }else{
                        this.$message('抱歉暂无数据')
                        this.tableData = false
                        this.loading = false
                    }
                    // this.refreshTable();
                }
            })
        },

        sizeChangeHandle(size) {
            //分页大小发生变化
            this.inputData.pageSize = size;
            this.pageSize = size
            this.getData()
        },

        currentChangeHandle(currentPage) {
            //页数发生变化
            this.inputData.startPage = currentPage
            this.getData()
        },

        handleDetail(row){
            console.log(row)
            const {href} = this.$router.resolve({
                path:'/userManage/userDetail',
                query:{
                    userId:row.id
                }
            })
            window.open(href,'_blank')
        },

    }
}

</script>

