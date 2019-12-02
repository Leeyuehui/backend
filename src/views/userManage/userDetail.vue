<template>
<div class="app-container" v-if="user">

    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="1">基本资料</el-menu-item>
        <el-menu-item index="2">话题主记录</el-menu-item>
        <el-menu-item index="3">操作记录</el-menu-item>
    </el-menu>

    <div v-show="activeIndex == 1">
        <el-row type="flex" align="center">
            <el-col :span="2" class="right">头像</el-col>
            <el-col :span="6" style="text-align:left;"><img :src="user.headUrl" alt="头像" class="img margin"></el-col>
        </el-row>
        <el-row>
            <el-col :span="2" class="right">状态</el-col>
            <el-col :span="6" class="margin"><div class="grid-content bg-purple">{{user.businessStatus == 1 ? '禁言' : '正常'}}</div></el-col>
            <el-col :span="2" :push="1" class="right">收到抱抱</el-col>
            <el-col :span="2" :push="1" class="margin"><div class="grid-content bg-purple">{{user.receiveLike}}</div></el-col>
        </el-row>
        <el-row>
            <el-col :span="2" class="right">昵称</el-col>
            <el-col :span="6" class="margin"><div class="grid-content bg-purple">{{user.name}}</div></el-col>
            <el-col :span="2" :push="1" class="right">送出抱抱</el-col>
            <el-col :span="2" :push="1" class="margin"><div class="grid-content bg-purple">{{user.sendLike}}</div></el-col>
        </el-row>
        <el-row>
            <el-col :span="2" class="right">手机</el-col>
            <el-col :span="6" class="margin"><div class="grid-content bg-purple">{{user.mobile}}</div></el-col>
            <el-col :span="2" :push="1" class="right">关注TA的人</el-col>
            <el-col :span="2" :push="1" class="margin"><div class="grid-content bg-purple">{{user.beCaredUserCount}}</div></el-col>
        </el-row>
        <el-row>
            <el-col :span="2" class="right">用户ID</el-col>
            <el-col :span="6" class="margin"><div class="grid-content bg-purple">{{user.id}}</div></el-col>
            <el-col :span="2" :push="1" class="right">TA关注的人</el-col>
            <el-col :span="2" :push="1" class="margin"><div class="grid-content bg-purple">{{user.careUserCount}}</div></el-col>
        </el-row>
        <el-row>
            <el-col :span="2" class="right">unionID</el-col>
            <el-col :span="6" class="margin"><div class="grid-content bg-purple">{{user.unionId}}</div></el-col>
            <el-col :span="2" :push="1" class="right">发帖</el-col>
            <el-col :span="2" :push="1" class="margin"><div class="grid-content bg-purple">{{user.postCount}}</div></el-col>
        </el-row>
        <el-row v-if="user.userType == 0"> <!-- 用户类型 0：真实用户 1 ：官方帐号 -->
            <el-col :span="2" class="right" >禁言次数</el-col>    
            <el-col :span="6" class="margin"><div class="grid-content bg-purple">{{user.bannedCount}}</div></el-col>
            <el-col :span="2" :push="1" class="right">评论回复</el-col>
            <el-col :span="2" :push="1" class="margin"><div class="grid-content bg-purple">{{user.commentCount}}</div></el-col>
        </el-row>
        <el-row v-else>
            <el-col :span="2" class="right">评论回复</el-col>
            <el-col :span="6" class="margin"><div class="grid-content bg-purple">{{user.commentCount}}</div></el-col>
        </el-row>
        <el-row>
            <el-col :span="2" class="right">帖子被举报</el-col>
            <el-col :span="6" class="margin"><div class="grid-content bg-purple">{{user.postReportedCount}}</div></el-col>
            <el-col :span="2" :push="1" class="right">评论被举报</el-col>
            <el-col :span="2" :push="1" class="margin"><div class="grid-content bg-purple">{{user.commentReportedCount}}</div></el-col>
        </el-row>
        <el-row>
            <el-col :span="2" class="right">个人被举报</el-col>
            <el-col :span="6" class="margin"><div class="grid-content bg-purple">{{user.userReportedCount}}</div></el-col>
            <el-col :span="2" :push="1" class="right">小抱枕余额</el-col>
            <el-col :span="2" :push="1" class="margin"><div class="grid-content bg-purple">{{user.amount}}</div></el-col>
        </el-row>
    </div>
    <div v-show="activeIndex == 2">
        <el-row>
            <el-col :span="10" :push="1" class="title">话题主记录</el-col>
        </el-row>
        <el-row>
            <el-col :span="10" :push="1">
                <el-table :data="topicUserData" border>
                    <el-table-column prop="operateContent" label="记录内容" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <el-row type="flex" class="table-foot">
            <el-col align="right">
                <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle" :current-page="startPage" :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
            </el-col>
        </el-row>

    </div>
    <div v-show="activeIndex == 3" v-if="user.userType == 0">   <!-- 用户类型 0：真实用户 1 ：官方帐号 -->
        <el-row>
            <el-col :span="10" :push="1" class="title">用户操作记录</el-col>
        </el-row>
        <el-row >  
            <el-col :span="10" :push="1">
                <el-table :data="tableData" border>
                    <el-table-column prop="createTime" label="时间" align="center"></el-table-column>
                    <el-table-column prop="content" label="操作记录" align="center"></el-table-column>
                    <el-table-column prop="userName" label="操作者" align="center"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            pageSize: 20, //每页大小
            startPage: 1, //当前页
            totalNum: 0, // 总数
            small: true, //小屏幕
            activeIndex: '1',
            user:'',
            tableData:[], //用户操作记录数据
            topicUserData:[], //话题主操作记录
            userId:'',  //用户id
        }
    },
    activated(){
        // 用户详情
        // this.user = false;
        this.topicUserData = [];
        this.userId=this.$router.currentRoute.query.userId;
        this.$http.get({
            isJson:false,
            url:`/user/queryUserDetail/${this.userId}`,
            success: res =>{
                console.log(res)
                this.user = res.data
            }
        })

        this.getTopicUser()

        if(this.user.userType != 1){         //用户类型 0：真实用户 1 ：官方帐号
            // 查询用户操作记录
            this.$http.get({
                isJson:false,
                url:`/user/queryUserOperateLogList/${this.userId}`,
                success: res=>{
                    if(res.data && res.code == 0){
                        this.tableData = res.data;
                    }
                }
            })
        }
    },
    methods:{
        //分页大小发生变化
        sizeChangeHandle(size) {
            this.pageSize = size
            this.getTopicUser()
        },
        //页数发生变化
        currentChangeHandle(currentPage) {
            this.startPage = currentPage
            this.getTopicUser()
        },
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);
            this.activeIndex = key
        },
        //获取话题主操作记录
        getTopicUser(){
            const data = {
                startPage:this.startPage,
                pageSize:this.pageSize,
                userId:this.userId
            }
            this.$http.post({
                isJson:true,
                url:`/topicAdmin/operateRecord`,
                params:data,
                success:res=>{
                    this.topicUserData = res.data.list;
                    this.totalNum = res.data.total;
                }
            })
        }
    }
}
</script>
<style scoped>
    .app-container{
        color: #999;
        font-size: 16px;
        line-height: 24px;
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
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .img{
        width: 150px;
        height: 150px;
        border: 1px dashed rgb(238, 238, 238);
        border-radius: 10px;
    }
    .right{
        text-align: right;
    }
    .margin{
        margin-left: 15px;
    }
    div{
        line-height: 36px;
        text-align: center;
    }
    .el-menu-demo{
        max-width: 1000px;
        margin-left: 40px;
        margin-bottom: 10px;
    }
    .title{
        text-align: left;
        font-size: 24px;
        color: #666;
        font-weight: bold;
    }
</style>

