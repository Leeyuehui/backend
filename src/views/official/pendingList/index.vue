<template>
<div class="app-container">
    <el-form :inline="true"  class="demo-form-inline"> <!--  :model="formInline" -->
        <el-form-item label="">
            <el-input placeholder="官方账号昵称" style="width: 200px;" v-model="searchInfo.keyword" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-date-picker v-model="searchInfo.publishTime" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
        </el-form-item>  

        <el-button-group>
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="primary" @click="clearRefresh">刷新</el-button>
            <el-button type="primary" @click="delTK">一键忽略</el-button>
        </el-button-group>

        <!-- 表格 -->
        <el-table v-loading="loading" element-loading-text="正在加载中" :data="tableData" :border="true" v-if="tableData"  @selection-change="handleSelectionChange" style="width: 100%;margin-top:8px;" >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="replyUserName" label="用户昵称" align="center" width="260px"></el-table-column>
            <el-table-column prop="content" label="互动内容" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="text(scope.row)" style="color:#606266">{{scope.row.content}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="官方账号" align="center" width="260px"></el-table-column>
            <el-table-column prop="createTime" label="时间" align="center" width="260px"></el-table-column>
            <el-table-column label="操作" align="center" width="300">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="postDetail(scope.row)">详情</el-button>
                        <el-button size="mini" type="success" @click="postEdit(scope.row)">回复</el-button>
                        <el-button size="mini" type="danger" @click="delTK(scope.row)" >忽略</el-button>
                    </el-button-group>
                </template> 
            </el-table-column>
        </el-table>

        <!-- 回复评论 -->
        <el-dialog title="回复评论" :visible.sync="showReply">
            <div>
                <el-form-item label="当前官方账号:">
                    {{replyItem.item.name}}
                </el-form-item>
            </div>
            <div>
                <span style="margin-right:20px">更换官方账号</span>
                <el-select filterable v-model="replyItem.admin" placeholder="更换官方账号" @focus="getGambit" style="width:200px;" clearable>
                    <el-option v-for="item in optionsGambit" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </div>
            <div style="margin-top:30px;">
                <el-form-item label="评论回复内容">
                    <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="replyItem.content" style="width:600px"></el-input>
                </el-form-item>
            </div>
            <div>
                <el-button size="medium" type="primary" @click="setGrade">发布</el-button>
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
            // 接口路径
            api: {
                list: "/message/queryMessages",
                update: "/message/updateMessageStatus",
                send:"/comment/sendComment",
                adminList:"/virtualUser/kvs",
            },
            loading:true,   //loading
            tableData: false,
            pageSize: 20, //每页大小
            startPage: 1, //当前页
            totalNum: 0, // 总数
            small: true, //小屏幕
            publishTime:'',     //发表时间
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
            searchInfo:{
                keyword:'',     //官方账号昵称
                publishTime:[], //发表时间
            },
            showReply:false,    //显示回复弹窗
            replyItem:{         //回复信息
                admin:'',       
                item:{},
                content:'',
            },       
            optionsGambit:'',  //官方账号选择器
            checksId:false,     //勾选的数据集合
        }
    },
    async activated(){
        this.getData()
    },
    methods:{
        // 勾选数据
        handleSelectionChange(val){
            // console.log(val)
            let arr = [];
            val.map( (value,key)=>{
                arr.push(value.id)
            })
            this.checksId = arr;
        },
        //发布回复
        setGrade(){
            let that = this;
            let data = that.replyItem;
            if(data.content){
                var params = {
                    commentId:data.item.commentId,
                    content:data.content,
                    postId:data.item.postId,
                    messageId:data.item.id,
                    userId:data.item.userId,
                }
                if(data.admin){
                    params.userId = data.admin;
                }
                this.$http.post({
                    isJson:true,
                    url:this.api.send,
                    params:params,
                    success:res=>{
                        if(res.code == 0){
                            this.$message({
                                message:'发布成功',
                                type:'success'
                            })
                            that.showReply = false;
                            that.getData();
                        }
                    }
                })
            }else{
                this.$message({
                    message:'请先输入回复内容',
                    type:'warning'
                })
            }
        },
        //官方账号列表
        getGambit(){
            this.$http.get({
                url:this.api.adminList,
                success:res=>{
                    // console.log('获取话题数据',res)
                    this.optionsGambit = res.data
                }
            })
        },
        // 忽略消息
        delTK(row = {}){
            // console.log(!this.checksId && !Boolean(row.id),row.id)
            if(!this.checksId && !row.id){
                this.$message({
                    message:'请先选择你要忽略的内容',
                    type:'warning'
                })
                return
            }
            let params = row.id ? [row.id] : this.checksId;
            this.$confirm('是否确认该操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post({
                    isJson:true,
                    url:this.api.update,
                    params:params,
                    success: res=>{
                        if(res.code == 0 && res.msg === 'OK'){
                            this.$message({
                                message:'操作成功',
                                type:'success'
                            })
                            this.getData();
                            this.checksId = false;
                        }
                    }
                })
            }).catch(() => {
                        
            });
        },

         // 帖子详情
        postDetail(row){
            // this.$router.push({
            //     path:'/circle/postDetail',
            //     query:{postId:row.postId,item:row}
            // })
            
            //需要新窗口打开
            let dataL = JSON.stringify(row);
            let { href } = this.$router.resolve({
                path:'/circle/postDetail',
                query:{
                    type:'pendingList',
                    postId:row.postId,
                    item:encodeURI(dataL)
                }
            })
            window.open(href, '_blank')

        },

        // 编辑帖子
        postEdit(row){
            this.showReply = true;
            this.replyItem = {admin:'',item:{},content:'',};
            this.replyItem.item = row;
        },

        refreshTable() {
            this.startPage = 1
            this.getData()
        },
        
        //清空搜索条件
        clearRefresh(){
            this.searchInfo = {
                keyword:'',     //官方账号昵称
                publishTime:[], //发表时间
            };
            this.getData();
        },

        // 获取表格数据
        getData(){
            var params = {
                pageSize: this.pageSize,
                startPage: this.startPage,
            };
            if(this.searchInfo.keyword || this.searchInfo.publishTime.length > 0){
                params = {
                    name:this.searchInfo.keyword,
                    startTime:this.searchInfo.publishTime[0],
                    endTime:this.searchInfo.publishTime[1],
                    pageSize: this.pageSize,
                    startPage: this.startPage,
                }
            }
            this.loading = true
            this.$http.get({
                url:this.api.list,
                params:params,
                success: res=>{
                    console.log(res)
                    if(res.data.list){
                        this.tableData = res.data.list  
                        this.totalNum = res.data.total
                        this.loading = false
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
            this.pageSize = size
            this.pageSize = size
            this.getData()
        },

        currentChangeHandle(currentPage) {
            //页数发生变化
            this.startPage = currentPage
            this.getData()
        },

        handleBan(row,num){
            if(num == 1){
                this.popover(row.id)
            }else{
                this.ban(row.id)
            }
        },

        handleDetail(row){
            console.log(row)
            this.$router.push({
                path:'/userManage/userDetail',
                query:{
                    userId:row.id
                }
            })
        },

    }
}

</script>
<style  scoped>
    .el-button{
        white-space: pre-wrap
    }
</style>
