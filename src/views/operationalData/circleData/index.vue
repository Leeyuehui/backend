<template>
<div class="app-container">
    <el-form :inline="true"  class="demo-form-inline"> <!--  :model="formInline" -->
        <el-form-item label="">
            <el-input v-model="id" placeholder="请输入圈子ID" style="width:150px;"></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-date-picker v-model="publishTime" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>    
        <el-button type="primary" @click="search">查询</el-button>
        <!-- 导出 -->
        <el-button type="primary" class="exportBtn" icon="el-icon-download" @click="exportList">导出</el-button>

        <el-table v-loading="loading" element-loading-text="正在加载中" :data="tableData" :border="true" v-if="tableData" style="width: 100%">
            <el-table-column prop="targetId" label="圈子ID" align="center"></el-table-column>
            <el-table-column prop="targetName" label="圈子名称" align="center"></el-table-column>
            <el-table-column prop="postCount" label="发帖量" align="center">
                <template slot-scope="scope">
                    <router-link :to="{name:'postData',query:{groupId:scope.row.targetId}}"><div style="color:#87C3E6;">{{scope.row.postCount}}</div></router-link>
                </template>
            </el-table-column>
            <el-table-column prop="pv" label="浏览量PV" align="center"></el-table-column>
            <!-- <el-table-column prop="uv" label="用户UV" align="center"></el-table-column> -->
            <el-table-column prop="likeCount" label="抱抱数" align="center"></el-table-column>
            <el-table-column prop="commentCount" label="评论数" align="center"></el-table-column>
            <el-table-column prop="replyCount" label="回复数" align="center"></el-table-column>
        </el-table>
        
    </el-form>

    <el-row type="flex" class="table-foot">
    <el-col align="right">
        <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle"  :current-page="startPage" :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
    </el-col>
    </el-row>

    
</div>
</template>
<script>
const baseUrl = BASE_URL
export default {
    data(){
        return{
            loading:true,   //loading
            tableData: false,
            pageSize: 20, //每页大小
            startPage: 1, //当前页
            totalNum: 0, // 总数
            small: true, //小屏幕
            id:'',           //圈子
            publishTime:'',     //发表时间
            inputData:{       //表格传参数据
            },
            postStatus:{
                field: "deleteStatus",      //deleteStatus   0：未删除 1:管理员删除 2:用户删除
                label: "帖子状态",
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

        }
    },
    activated(){
        this.id=''
        this.publishTime=''
        let query = this.$router.currentRoute.query;
        this.getData();
    },
    methods:{
        // 置顶
        handleStatus(row){
            this.$router.push({
                path:'/hot/toTop/addTop',
                query:{
                    postId:row.id
                }
            })
        },
        // 设排序分
        handleEdit(row){
            this.$router.push({
                path: "/hot/setGrade/plus",
                query: {
                    postId: row.id,
                }
            });
        },
         // 帖子详情
        postDetail(row){
            // console.log(row.id)
            this.$router.push({
                path:'/circle/postDetail',
                query:{postId:row.id}
            })
        },


        refreshTable() {
            this.inputData.startPage = 1
            this.getData()
        },

        //搜索
        search(){
            if( !this.publishTime && !this.id){
                this.inputData = {
                    pageSize: 20,
                    startPage: 1,
                }
            }else{
                this.inputData = {
                    id:this.id,
                    startTime:this.publishTime[0],
                    endTime:this.publishTime[1],
                    pageSize: 20,
                    startPage: 1,
                }
            }

            this.pageSize = 20
            this.startPage = 1
            this.getData()
        },
        // 获取表格数据
        getData(){
            this.loading = true
            this.$http.post({
                isJson:true,
                url:'/stat/groupList',
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
                        this.tableData = false;
                        this.loading = false
                    }
                }
            })
        },

        sizeChangeHandle(size) {
            //分页大小发生变化
            console.log(size)
            this.inputData.pageSize = size
            this.pageSize = size
            this.getData()
        },

        currentChangeHandle(currentPage) {
            //页数发生变化
            this.inputData.startPage = currentPage
            this.getData()
        },

        handleBan(row,num){
            if(num == 1){
                this.popover(row.id)
            }else{
                this.ban(row.id)
            }
        },

        // 导出
        exportList(){
            window.location.href = baseUrl+'/stat/exportGroup?pageSize=20&startPage=1&id='+this.id; 
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
    .el-form-item{
        margin-right: 1px;
    }
    .exportBtn{
        float: right;
        margin-right:2%;
    }
</style>
