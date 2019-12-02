<template>
<div class="app-container">
    <!-- 数据统计 -->
    <el-row :gutter="20">
        <el-col :span="5">
            <div class="grid-content bg-purple">
                <p>{{countData.total}}</p>
                <p>累计私聊消息数</p>
            </div>
        </el-col>
        <el-col :span="5">
            <div class="grid-content bg-purple">
                <p>{{countData.itemTotal}}</p>
                <p>累计私聊对数</p>
            </div>
        </el-col>
        <el-col :span="5">
            <div class="grid-content bg-purple">
                <p>{{countData.yestodayTotal}}</p>
                <p>昨日私聊消息数</p>
            </div>
        </el-col>
        <el-col :span="5">
            <div class="grid-content bg-purple">
                <p>{{countData.yestodayItemTotal}}</p>
                <p>昨日私聊对数</p>
            </div>
        </el-col>
    </el-row>

    <!-- 搜索 -->
    <div class="search">
        <el-form :inline="true" class="demo-form-inline"> <!--  :model="formInline" -->
            <el-form-item label="">
                <el-date-picker 
                    v-model="searchData.date" 
                    type="daterange" 
                    unlink-panels 
                    range-separator="至" 
                    start-placeholder="开始日期" 
                    end-placeholder="结束日期" 
                    value-format="yyyy-MM-dd"
                    clearable
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="">
                <el-input v-model="searchData.userId" placeholder="请输入用户ID" style="width:250px;" clearable></el-input>
            </el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
        </el-form>
    </div>

    <!-- 表格 -->
    <el-table v-loading="loading" element-loading-text="正在加载中" :data="tableData" :border="true" v-if="tableData" style="width: 80%;margin-top:8px;">
        <!-- <el-table-column type="selection" width="35" align="center"></el-table-column> -->
        <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
        <el-table-column prop="fromUserId" label="发起人ID" align="center" width="200">
            <template slot-scope="scope">
                <div>{{scope.row.fromUserName}}</div>
                <div>{{scope.row.fromUserId}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="userIds" label="接受者ID" align="center" width="200">
            <template slot-scope="scope">
                <div>{{scope.row.toUserName}}</div>
                <div>{{scope.row.toUserId}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="amount" label="私聊内容" >
            <template slot-scope="scope">
                <el-form  class="demo-form-inline" label-width="150px"> 
                    <div v-for="(item,index) in scope.row.contents.list" :key="index" class="box">
                        <h3 class="heades">{{item.msgExtra.name}}</h3>
                        <div class="news">
                            <div v-if="item.content && item.content !== 'null'" class="maxLength" @click="seeDetail(item.content)">{{item.content}}</div>
                            <audio :src="item.fileUrl" preload controls v-else class="maxLength"></audio>
                            <!-- <div class="maxLength" v-else>音频消息</div> -->
                            <span>{{item.createTime}}</span>
                           
                        </div>
                    </div>
                    <el-button type="text" @click="toDetail(scope.row)" v-if="scope.row.contents.total > 5" class="seeBtn">共{{scope.row.contents.total}}条记录，点击查看完整内容>></el-button>
                </el-form>
            </template>
        </el-table-column>
    </el-table>

    <!-- 私聊详情对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="40%" :before-close="closePrivateChat">
        <div class="elFormBox">
            <el-form class="elForm" label-width="200px">
                <!-- <el-form-item  v-for="(item,index) in detailData" :key="index" :label="item.msgExtra.name" style="margin:0;">
                    <div v-if="item.content && item.content !== 'null'">{{item.content}}</div>
                    <audio :src="item.fileUrl" controls v-else></audio>
                </el-form-item> -->
                <div class="privateDialog" v-for="(item,index) in detailData" :key="index">
                    <h3 class="headers">{{item.msgExtra.name}}</h3>
                    <div v-if="item.content && item.content !== 'null'" class="audio" >{{item.content}}</div>
                    <audio :src="item.fileUrl" class="audio" controls v-else></audio>
                    <span>{{item.createTime}}</span>
                </div>


                <div class="loadMore" v-if="hasNextPage" @click="loadMore">{{loadMoreTxt}}</div>
                
            </el-form>
            
        </div>
        <el-button type="primary" class="closePrivateChat" @click="closePrivateChat">关闭</el-button>
    </el-dialog>

    <!-- 某条内容详情对话框 -->
    <el-dialog title="内容详情" :visible.sync="txtShow" width="30%" >
        <div>{{txtDetail}}</div>
    </el-dialog>

    <!-- 分页 -->
    <div class="block">
        <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle" :current-page="postData.startPage" :page-sizes="[10, 20, 30, 50, 100]" :page-size="postData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            api:{
                list:'/rongMsg/queryRongMsgs',    
                send:'/user/sendPillows',    //送抱枕
                privateChatDetail:'/rongMsg/queryContents', //私聊详情
                count:'/rongMsg/queryRongMsgCount',  //统计
            },
            loading:true,
            tableData:false,
            
            totalNum: 0, // 总数
            small: true, //小屏幕
            hasNextPage:false,  // 下一页是否存在
            countData:{

            },    //统计数据
            searchData:{    //搜索条件
                date:'',
                id:''
            },
            postData:{
                startPage:1,
                pageSize:10,
            },     //私聊列表请求条件
            postDetailData:{},  //私聊详情请求条件
            detailData:false,   //私聊详情
            dialogVisible: false,   //私聊对话框默认隐藏
            loadMoreTxt:'加载更多...', 
            txtShow:false, 
            txtDetail:''
        }
    },
    methods:{
        // 查看某条内容详情
        seeDetail(content){
            this.txtShow = true;
            this.txtDetail = content;
        },
        // 关闭某条内容详情
        // txtClose(){
        //     this.txtDetail = '';
        // },
        //加载更多
        loadMore(){
            ++this.postDetailData.startPage;
            this.loadMoreTxt = '加载中...'
            console.log(this.postDetailData.startPage)
            this.getPrivateChatDetail()

        },
        // 关闭私聊对话框
        closePrivateChat(){
            this.dialogVisible = false;
        },
        // 私聊详情
        toDetail(row){

            this.postDetailData = {
                startPage: 1,
                pageSize: 20,
                fromUserId:row.fromUserId,
                toUserId:row.toUserId
            }
            this.getPrivateChatDetail()
        },
        // 私聊详情
        getPrivateChatDetail(){
            console.log(this.postDetailData)
            this.$http.get({
                isJson: false,
                url: this.api.privateChatDetail,
                params: this.postDetailData,
                success: res=>{ 
                    if(res.code == 0){
                        if(this.postDetailData.startPage > 1){
                            this.detailData = this.detailData.concat(res.data.list)
                        }else{
                            this.detailData = res.data.list;
                        }
                        this.loadMoreTxt = '加载更多...'
                        this.hasNextPage = res.data.hasNextPage;
                        this.dialogVisible = true;
                    }
                }
            })
        },
        // 搜索
        search(){
            // console.log(this.searchData.date)
            this.getData()
        },
        // 获取列表
        getData(){
            this.loading = true;
            const search = this.searchData.date == null ? '' : this.searchData.date;

            this.postData = {
            startPage: this.postData.startPage,
            pageSize: this.postData.pageSize,
            userId:this.searchData.userId,
            startTime:search[0],
            endTime:search[1]
        }

            this.$http.get({
                isJson:false,
                url: this.api.list,
                params:this.postData,
                success: res=>{
                    if(res.code == 0){
                        this.tableData = res.data.list;
                        this.totalNum = res.data.total;
                    }else{
                        this.$message({
                            message:res.msg,
                            type:'error'
                        })
                    }
                    this.loading = false;
                }
            })
        },
        // 获取统计数据
        getCount(){
            this.$http.get({
                isJson: false,
                url:this.api.count,
                success: res=>{
                    if(res.code == 0){
                        this.countData = res.data;
                    }else{
                        this.$message({
                            message:res.msg,
                            type:'error'
                        })
                    }
                }
            })
        },
        //分页大小发生变化
        sizeChangeHandle(size) {
            this.postData.pageSize = size;
            this.getData();
        },
        //页数发生变化
        currentChangeHandle(currentPage) {
            this.postData.startPage = currentPage;
            this.getData();
        },
    },
    activated(){
        this.getCount()
        this.getData()
    }
}
</script>
<style scoped>
    .app-container{
        color: #999;
    }
    .el-row {
        margin-bottom: 20px;
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 80px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    p{
        text-align: center;
        line-height: 40px;
        font-size: 18px;
    }
    .box{
        display: flex;
        justify-content:flex-start;
        align-items: center;
    }
    .news{
        min-width:500px; 
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        margin-left: 20px;
        border-bottom: 1px solid #ccc;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
    }

    .heades{
        font-size: 14px;
        max-width: 220px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    .maxLength{
        max-width: 300px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    .elFormBox{
        width: 100%;
        height: 600px;
        overflow: hidden;
    }
    .elForm{
        width: 105%;
        height: 620px;
        overflow: scroll;
    }
    .closePrivateChat{
        display: block;
        width: 180px;
        margin:20px auto;
    }
    .loadMore{
        color: #00b0f0;
        cursor: pointer; 
        text-align: center;
    }
    .privateDialog{
        display: flex;
        justify-content: flex-start;
        /* padding-right:30px; */
        margin-bottom: 20px;
        font-size: 12px;
    }
    .audio{
        width: 300px;
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        margin-right: 25px;
    }
    .headers{
        min-width: 120px;
        max-width: 220px;
        text-align: right;
        margin-right: 25px;
    }

</style>


