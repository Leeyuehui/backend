<template>
<div class="app"> 
    <!-- 帖子详情 -->
    <div class="editPost">
        <!-- 用户信息 -->
        <div class="user">
            <div style="margin-bottom:10px;" v-if="adminItem.name">当前官方账号：{{adminItem.name}}</div>
            <el-row>
                <el-col :span="2">
                    <img :src="dataDetail.userHead" alt="头像" class="face">
                    <span class="admin-user" v-show="dataDetail.source == 1">官方用户</span>    <!-- source 评论用户是否官方账号 0 普通用户 1官方用户 -->
                </el-col>
                <el-col :span="12">
                    <div class="grid-content">{{dataDetail.userName}}</div>
                    <div class="grid-content">用户ID：{{dataDetail.userId}}</div>
                    <div class="grid-content">贴子ID：{{dataDetail.id}}</div>
                </el-col>
            </el-row>
        </div>

        <!-- 音频  -->
        <div class="audio" v-if="audioUrl" v-show="source != 0">
            <!-- 音频封面 -->
            <el-row class="demo-autocomplete" v-if="coverUrl">
                <el-col :span="2" class="txt_translate">音频封面</el-col>
                <el-col :span="3">
                    <div class="div_avatar">
                        <img :src="coverUrl" alt="图片" class="avatar" >
                    </div>
                </el-col>
            </el-row>
            <!-- 音频 -->
            <el-row class="demo-autocomplete">
                <el-col :span="2" class="txt_translate" style="margin-top:10px;">音频</el-col>
                <el-col :span="5">
                    <audio :src="audioUrl" controls class="audioControls"></audio>
                </el-col>
            </el-row>
            <!-- 音频名称 -->
            <el-row class="demo-autocomplete uploadFile" v-if="input">
                <el-col :span="2" class="txt_translate">音频名称</el-col>
                <el-col :span="5">
                    <el-input v-model="audioName" placeholder="请输入内容" disabled></el-input>
                </el-col>
            </el-row>            
        </div>

        <!-- 视频 -->
        <div class="video" v-if="videoUrl">
            <el-row class="demo-autocomplete uploadFile">
                <el-col :span="2">视频</el-col>
                <el-col :span="3" :offset="2">
                    <video :src="videoUrl" controls class="video"></video>
                </el-col>
            </el-row>
        </div>

        <!-- 投票 -->
        <div class="" v-if="voteImgShow">
            <el-row class="demo-autocomplete uploadFile">
                <el-col :span="2" >投票</el-col>
                <el-col :span="5">
                    <div class="sponsor" @click="dialogVisible = true">
                        <img :src="voteImg" class="voteImg" />
                    </div>
                </el-col>
            </el-row>


            <!-- 投票对话框 -->
            <el-dialog  :visible.sync="dialogVisible" width="400px">
                <input v-model="voteTitle" placeholder="编辑标题(最多20个字，可不填)" class="voteInput" disabled />
                <hr style="margin-bottom:15px;">
                <div class="vote">
                    <el-row class="demo-autocomplete" v-for="v in vote" :key="v.indexs">
                        <el-col :span="20" :offset="2">
                            <el-input :placeholder="'选项'+v.indexs+'(最多16个字)'" v-model="v.description" disabled></el-input>
                        </el-col>
                    </el-row>
                </div>
            </el-dialog>
        </div>
        

        <!-- 富文本内容 -->
        <vue-editor v-model="fullContent" v-if="this.fullContent" disabled id="editor" :editorToolbar="toolBar" useCustomImageHandler  class="editTxt"></vue-editor>

        <!-- 小程序端帖子详情 -->
        <div class="homeEdit" v-show="source == 0">
            <!-- <h3 style="margin-bottom:10px;">小程序端发帖详情</h3> -->
            <el-row class="demo-autocomplete uploadFile" v-if="textarea && textarea !='' ">
                <el-col :span="2" >文本内容</el-col>
                <el-col :span="21">
                    <div>{{textarea}}</div>
                    <!-- <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" maxlength="200" :disabled="true"></el-input> -->
                </el-col>
            </el-row>

            <el-row class="demo-autocomplete" v-if="imgList.length > 0">
                <div class="box_left">图片详情</div>
                <div class="box_right">
                    <div class="div_avatar" v-for="item in imgList" :key="item.id" v-if="item.content">
                        <img :src="item.content" alt="图片" class="avatar" @click="magnify(item.content)">
                    </div>
                </div>
            </el-row>

            <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" >
                <img :src="bigImg" alt="图片详情" class="bigImg">
            </el-dialog>
        </div>

        <!-- 回复列表 -->
        <div class="reply" v-if="dataList">
            <h3 class="hReply">回复列表</h3>
            <el-button class="reply-post" type="warning" @click="replyComment(1)">评论帖子</el-button>
            <div class="userReply" v-for="i in dataList" :key="i.id">
                <el-row v-if="i.commentType == 1">
                    <el-col :span="2">
                        <img :src="i.headUrl" alt="头像" class="face">
                        <span class="admin-user" v-show="i.source == 1">官方用户</span>    <!-- source 评论用户是否官方账号 0 普通用户 1官方用户 -->
                    </el-col>
                    <el-col :span="20">
                        <div>
                            <div class="trigon"></div>
                            <hr/>
                        </div>
                        <div>
                            <p>{{i.userName}}</p>
                            <p>{{i.content}}</p>
                            <el-button type="danger" size="mini" @click="replyComment(2,i)" class="sureIcon">回复</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="comment-reply" v-if="i.commentType == 2">
                    <el-col :span="2">
                        <img :src="i.headUrl" alt="头像" class="face">
                        <span class="admin-user" v-show="i.source == 1">官方用户</span>    <!-- source 评论用户是否官方账号 0 普通用户 1官方用户 -->
                    </el-col>
                    <el-col :span="20">
                        <div>
                            <div class="trigon"></div>
                            <hr/>
                        </div>
                        <div>
                            <p style="">{{i.userName}} <span style="color:#666;">回复</span> {{i.beReplyUserName}}</p>
                            <p>{{i.content}}</p>
                            <el-button type="danger" size="mini" @click="replyComment(2,i)" class="sureIcon-reply">回复</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>

        <div v-if="hasNextPage" class="show-more" @click="getMore">{{tipsMessage}}</div>

        <!-- 回复评论 -->
        <el-dialog title="回复评论" :visible.sync="showReply">
            <div v-if="adminItem.name">
                <span>当前官方账号:</span>
                {{adminItem.name}}
            </div>
            <div style="margin-top:10px;">
                <span style="margin-right:20px;">更换官方账号</span>
                <el-select filterable v-model="replyItem.admin" placeholder="更换官方账号" @focus="getGambit" style="width:200px;" clearable>
                    <el-option v-for="item in optionsGambit" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </div>
            <div style="margin-top:30px;">
                <span style="float: left;margin-right: 20px;">评论回复内容</span>
                <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="replyItem.content" style="width:600px"></el-input>
            </div>
            <div style="margin-top:20px;">
                <el-button size="medium" type="primary" @click="setGrade">发布</el-button>
            </div>
        </el-dialog>

    </div>

</div>
</template>
<script>
import { VueEditor, Quill } from "vue2-editor";
import axios from 'axios';
import voteImg from '@/assets/images/vote.png'; //投票图片资源

export default {
    data(){
        return{
            // 接口路径
            api: {
                update: "/message/updateMessageStatus",
                send:"/comment/sendComment",
                adminList:"/virtualUser/kvs",
            },
            pageSize:20,
            startPage:1,
            dataDetail:'',      //帖子详情数据
            fullContent:'',         //富文本内容
            input:'',           //音频时长
            coverUrl:'',          //封面路径
            textarea:'',    //首页文本内容
            audioUrl:'', //音频显示隐藏
            postId:'',          //帖子id
            toolBar:[['bold', 'italic', 'underline']],         //富文本自定义菜单
            audioName:'',       //音频名称
            imgList:[],         //图片集合
            bigImg:'',          //方大版图片
            dialogVisible:false,//图片对话框
            source:'',          // 帖子来源 0用户 1官方 2爬取
            postContents:[],    //小程序端发帖
            dataList:[],   //评论列表
            adminItem:{},   //官方账号信息
            showReply:false,    //显示回复弹窗
            replyItem:{         //回复信息
                admin:'',       
                item:{},
                content:'',
                type:1,
            },       
            optionsGambit:[],  //官方账号选择器
            hasNextPage:false, //评论是否有下一页
            tipsMessage:'点击查看更多...',   //加载更多评论时的提示文案
            videoUrl:'',    //视频url
            voteTitle:'',           //投票标题
            vote:[                  //投票数据
                {indexs: 1,description:''},
                {indexs: 2,description:''},
            ],
            voteImgShow:false,  //图标展示
            voteImg:voteImg,
        }
    },
    components: {
      VueEditor
    },

    methods:{
        //点击回复
        replyComment(type,row){
            this.showReply = true;
            this.replyItem = {admin:'',item:{},content:'',};
            this.replyItem.type = type;
            this.replyItem.item = row;
        },
        //发布回复
        setGrade(){
            let that = this;
            let data = that.replyItem;
            if(data.content){
                if(!that.adminItem.userId && !data.admin){
                    this.$message({
                        message:'请先选择官方账号',
                        type:'warning'
                    })
                    return
                }
                var params = {
                    content:data.content,
                    postId:that.postId,
                    userId:that.adminItem.userId,
                }
                if(data.admin){
                    params.userId = data.admin;
                }
                if(data.type == 2){
                    params.commentId = data.item.id;
                }
                if(data.item){
                    params.messageId = data.item.messageId
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
                            that.getReply();
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
        // 图片放大
        magnify(content){
            this.dialogVisible = true;
            this.bigImg = content;
        },
        // get帖子详情
        getPostDetail(url){
            this.$http.post({
                isJson:false,
                url:url,
                success:res=>{
                    this.dataDetail = res.data
                    this.fullContent = res.data.fullContent;
                    this.postContents = res.data.postContents;
                    this.source = res.data.source;
                    this.postContents.forEach((value,key)=>{
                        if(value.type == 1){                       //type 1 文字 2 图片 3 音频 4 视频           
                            this.textarea =value.content
                        }else if(value.type == 2){
                            this.imgList.push(value)
                        }else if(value.type == 3){
                            this.audioUrl = value.content;
                            this.coverUrl = value.cover;
                            this.input = value.time;
                            this.audioName = value.title;
                        }else if(value.type == 4){
                            this.videoUrl = value.content;
                        }else if(value.type == 5){
                            if(res.data.votes){
                                this.vote = res.data.votes;
                                this.voteTitle = value.title;
                                this.voteImgShow = true;
                            }
                            
                        }
                    })
                    // console.log(this.imgList) 
                
                }
            })
        },
        //get评论列表
        getReply(){
            const that = this;
            const data = {
                startPage:this.startPage,
                pageSize:this.pageSize,
                postId:this.postId
            }
            this.$http.get({
                isJson:false,
                url:'/comment/commentList',
                params:data,
                success:res=>{
                    that.tipsMessage = '点击查看更多...';
                    that.hasNextPage = res.data.hasNextPage;

                    if(this.startPage == 1){
                        that.dataList = res.data.list
                    }else if(this.startPage > 1 && res.data.list){
                        that.dataList = [...that.dataList, ...res.data.list];
                    }else{
                        this.$message({
                            message:'抱歉暂无更多数据',
                            type:'success'
                        })
                    }

                    console.log(that.dataList)
                }
            })
        },
        //获取更多评论
        getMore(){
            this.tipsMessage = '加载中...'
            this.startPage = ++this.startPage;
            this.getReply();
        },
    },

    //type 1 文字 2 图片 3 音频 4 视频
    activated(){
        this.fullContent = '';
        this.postContents = [];
        this.source = '';
        this.textarea = '';
        this.imgList = [];
        this.audioUrl = '';
        this.coverUrl = '';
        this.input = '';
        this.audioName = '';
        this.postId = '';
        // this.type = false;

        //投票清零
        this.voteTitle = "";
        this.voteImgShow = false;
        this.videoUrl = '';
        this.vote = [                  //投票数据
            {indexs: 1,description:''},
            {indexs: 2,description:''},
        ];  
        
        let query = this.$router.currentRoute.query,url;
        // if(query.type){
        //     this.type = query.type;
        // }
        this.postId = this.$router.currentRoute.query.postId;
        if(this.postId){
            if(query.type == 'unpublish'){
                url=`/postDraft/${this.postId}`;
            }else{
                url=`/post/${this.postId}`;
            }  

            this.getPostDetail(url);
            this.getReply();
        }
        if(query.item){
            let dataItem = decodeURI(query.item)
            this.adminItem = JSON.parse(dataItem);
        }else{
            this.adminItem = {};
        }
    }
}

</script>
<style scoped>
    .app{
        margin-top: 50px;
        color: #999;
    }
    .user,.editPost{
        width: 1000px;
        margin: 0 auto;
    }
    .face{
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    .admin-user{
        font-size: 14px;
        float: left;
        margin-top: -20px;
        margin-left: 5px;
    }
    .editTxt{
        width: 100%;
        height: 600px;
        color: #666;
        margin-top: 10px;
        margin-bottom: 80px;
    }
    .txt_hint{
        height: 120px;
        line-height: 200px;
        overflow: hidden;
    }
    .audio,.uploadFile{
        margin: 10px 0;
    }
    .homeEdit{
        overflow: hidden;
        margin-top: 20px;
    }
    .audioControls{
        width: 300px;
        height: 40px;
        margin: 10px 0;
    }
    .selectGroup{
        margin-left:20px; 
    }
    .avatar{
        width: 120px;
        height: 120px;
        border: 1px dashed #d9d9d9; 
    }
    .txt_translate{
        position: relative;
        top: 3px;
    }
    .box_left{
        width: 100px;
        /* display: inline-block; */
        float: left;
    }
    .box_right{
        width: 400px;
        float: left;
        /* display: inline-block; */
    }
    .div_avatar{
        width: 120px;
        height: 120px;
        border-radius: 6px;
        position: relative;
        overflow: hidden;
        float: left;
    }
    .bigImg{
        display: block;
        margin: 0 auto;
        max-width: 100%;
    }


    /* el布局样式 */
    .el-row {
        margin-bottom: 20px;
    }
    .el-col {
        border-radius: 4px;
        line-height: 36px;
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
        height: 28px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .reply-post{
        position: relative;
        left: 82%;
    }
    .sureIcon{
        margin-left: 92%;
    }
    .sureIcon-reply{
        margin-left: 90%;
    }
    .reply-list{
        margin-left:20%;
        width: 80%;
    }
    .comment-reply{
        margin-left: 10%;
    }
    .show-more{
        cursor: pointer;
        margin: auto;
        text-align: center;
        margin-bottom: 30px;
        color: #00b0f0;
    }
    .voteInput{
        display: block;
        outline: none;
        border: 0;
        width: 100%;
        height: 35px;
        line-height: 35px;
        font-size: 16px;
        color: #999;
        text-align: center;
    }
    .sponsor{
        width: 120px;
        height: 120px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        line-height: 120px;
        text-align: center;
        font-size: 28px;
        color: #8c939d;
        position: relative;
    }
    .voteImg{
        width: 28px;
        height: 28px;
        position: relative;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
    .video{
    width: 480px;
    height: 270px;
}
</style>