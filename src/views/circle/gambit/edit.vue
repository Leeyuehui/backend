<style scoped lang="scss">
.demo-input-suffix {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  span {
    display: inline-block;
    text-align: center;
  }

}
.demo-tinymce-suffix{
      overflow:hidden;
}
.card {
  margin-top: 20px;
  margin-right: 10px;
}

.card-items {
  .demo-input-suffix {
    margin-bottom: 15px;
  }
}

.img-preview {
  display: flex;
  justify-content: center;
}
.input_url{
    margin-left: 20px;
    width: 40%;
}
p.form-item{
    padding-left:140px;
    margin:10px 0;
    color:#aaa;
}
.res-star{
    color:#f56c6c;
    margin-right:4px;
}

</style>
<style lang="scss">
.form-item-noMargin .el-form-item__content{
    margin-left:0 !important;
    
}   
.form-item-noMargin{
    p{
        color:#606266;
     }
    .desc{
        p{
            color:#aaa;
            font-size:12px;
            span{
                padding-left:20px;
                &:before{
                    content: '·';
                    font-weight:bold;
                    margin-right: 4px;
                }
            }
        }
    }
    .table{
        width:100%;
    }
    .preview-card-head{
        text-align:center;
    }
    .el-icon{
        margin-top:15px;
    }

    .floatL{
        margin-right:20px;
    }
}
</style>
<template>
<el-container style="background-color:rgba(226, 226, 226, .24);">
    <el-main>
    
        <el-form ref="editInfo" :rules="rules" label-position="left" :model="editInfo" label-width="100px">
            <el-form-item label="资源位图片" prop="cover">
                <el-col :span="3">
                    <my-upload functionName="user" :model.sync="editInfo.cover" type="img"></my-upload>
                </el-col>
                <el-col :pull="1" :span="11">
                    <p>1.注意图片仅支持jpg、jpeg、png</p>
                    <p>2.最佳图片尺寸为300*300</p>
                </el-col>
            </el-form-item>
            <el-form-item label="话题名称" prop="name">
                <el-col :span="8">
                    <el-input v-model="editInfo.name" placeholder="最多14个字" maxlength="14"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item class="form-item" label="话题简介" prop="description" >
                <el-col :span="8">
                    <el-input type="textarea" v-model="editInfo.description" maxlength="200" placeholder="最多200个字"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="音频文件">
                <div class="box">
                    <input type="file" id="file" @change="uploadAudio"  class="uploadAudio"/>
                    <div class="sponsor">
                        <i class="el-icon-plus voteAudio"></i>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="音频" v-if="editInfo.radioUrl">
                <audio controls :src="editInfo.radioUrl"  preload="auto" ref="aduioss" ></audio>
            </el-form-item>

            <el-form-item label="音频名称">
                <el-col :span="8">
                    <el-input v-model="editInfo.radioTitle" maxlength="14" placeholder="最多14个字"></el-input>
                </el-col>
            </el-form-item>
            

            <el-form-item class="form-item" label="选择圈子" prop="groupId" >
                <el-select v-model="editInfo.groupId" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
           <el-form-item label="热度值" prop="hotValue">
                <el-col :span="8">
                    <el-input v-model="editInfo.hotValue" placeholder="请输入数字" maxlength="10"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="话题主">
                <el-col :span="8">
                    <el-input v-model="editInfo.admin" type="number" placeholder="请输入用户id" maxlength="14">
                        <el-button slot="append" @click="check" style="background:#67C23A;color:#fff;">查看该用户</el-button>
                    </el-input>
                </el-col>  
            </el-form-item>
            <el-form-item label="">
                <el-button type="success" @click="onSubmit('editInfo')" :disabled.sync="submitDisable">发布</el-button>
            </el-form-item>
        </el-form>
        
    </el-main>

    <!-- 用户详情对话框 -->
    <el-dialog title="该用户详情" :visible.sync="dialogUser" width="60%">
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
        </div>
        <div v-show="activeIndex == 3">
            <el-row>
                <el-col :span="10" :push="1" class="title">用户操作记录</el-col>
            </el-row>
            <el-row v-if="user.userType == 0">  <!-- 用户类型 0：真实用户 1 ：官方帐号 -->
                <el-col :span="10" :push="1">
                    <el-table :data="tableData" border>
                        <el-table-column prop="createTime" label="时间" align="center"></el-table-column>
                        <el-table-column prop="content" label="操作记录" align="center"></el-table-column>
                        <el-table-column prop="userName" label="操作者" align="center"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
    </el-dialog>

</el-container>
</template>

<script>

import MyUpload from "@/components/MyUpload";
// import Preview from "@/components/Preview";
import { hasNullProp } from '@/utils/objectUtil';
import axios from 'axios';
export default {
    components: {
        MyUpload,
        // Preview
    },
    data() {
        return {
            baseUrl: BASE_URL,
            editInfo: {}, 
            editType: '',   //话题操作类型 
            changeAdIndex:false,//记录adindex是否被更改
            rules:{
                cover:[{ required: true, message: '话题图片不能为空', trigger: 'blur' }],
                name:[{required: true,message: '话题名称不能为空', trigger: 'blur'}],
                // description:[{required: true, message: '话题简介不能为空', trigger: 'blur'}],
                hotValue:[{required: true, message: '热度值不能为空', trigger: 'blur'}],
            },
            submitDisable:false,
            options:[],     //圈子

            dialogUser:false,   //用户详情对话框
            activeIndex: '1',   //用户详情导航栏
            user:'',            
            tableData:[], //用户操作记录数据
            topicUserData:[], //话题主操作记录
            checkData:false ,        //发布话题主判断
        }
    },
    methods: {
        // 上传音频
        uploadAudio(e){
            let self = this;
            let formData = new FormData();
            console.log('eeeeeeee',e.target.files[0]);
            formData.append('file',e.target.files[0]);
            console.log(self.$refs,'ref')
            axios({
              url: BASE_URL + "file/uploadPress",
              method: 'POST',
              data: formData
            }).then( async (result) => {
                console.log('result',result.data.data)

                if(result.data.msg.toLocaleUpperCase()  !== 'OK'){
                    this.$message({
                        message:'文件超过15M',
                        type:'warning'
                    })
                    return
                }
                this.editInfo.radioUrl = result.data.data;

                await self.$refs.aduioss;
                let audio = self.$refs.aduioss;
                console.log('audio:',audio)
                audio.oncanplay = function () {  
                    let min = Math.floor(audio.duration/60);
                    let sec = Math.floor(audio.duration%60);
                    console.log("audio.duration",audio.duration,min,sec);
                    self.editInfo.radioTime = `${min}:${sec}`
                }
            //   resetUploader();
            }).catch((err) => {
              console.log('err',err)
            })
        },
        // 查看用户
        check(){
            if(this.editInfo.admin > 0){
                this.topicUserData = [];
                let userId=this.editInfo.admin;
                this.$http.get({
                    isJson:false,
                    url:`/user/queryUserDetail/${userId}`,
                    success: res =>{
                        if(res.code == 0 && res.msg === 'OK'){
                            this.user = res.data;
                            this.dialogUser = true;
                            this.getTopicUser(userId);
                            if(this.user.userType != 1){    //用户类型 0：真实用户 1 ：官方帐号
                                // 查询用户操作记录
                                this.$http.get({
                                    isJson:false,
                                    url:`/user/queryUserOperateLogList/${userId}`,
                                    success: res=>{
                                        if(res.data && res.code == 0){
                                            this.tableData = res.data;
                                        }
                                    }
                                })
                            }
                        }else{
                            this.$message(res.msg)
                            return 
                        }
                    }
                })
            }
        },
        //用户详情导航栏切换
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);
            this.activeIndex = key
        },
        //获取话题主操作记录
        getTopicUser(userId){
            const data = {
                userId:userId
            }
            this.$http.post({
                isJson:true,
                url:`/topicAdmin/operateRecord`,
                params:data,
                success:res=>{
                    console.log(res)
                    this.topicUserData = res.data.list
                }
            })
        },
        getUserDetail(){
            return new Promise((resolve,rej)=>{
                this.$http.get({
                    isJson:false,
                    url:`/user/queryUserDetail/${this.editInfo.admin}`,
                    success: res =>{
                        if(res.code == 0 && res.msg ==="OK"){
                            resolve(true)
                        }else{
                            this.$message(res.msg)
                            resolve(false)
                        }
                    }
                })
            })
        },
        // 发布
        async onSubmit(formName) {
            let isEmpty = true,topicAdmin; //判断数据是否已正确输入
            this.$refs[formName].validate((valid) => {
                // console.log(valid)
                if (!valid){
                    this.$message({
                        message:'输入数据有误或有数据缺失',
                        type:'warning',
                    })

                    isEmpty = false;    
                }
            });
            if(!isEmpty){
                return;
            }

            if(!(this.editInfo.description || this.editInfo.radioUrl)){
                this.$message('话题简介以及音频必须有其一')
                return
            }
            
            if(this.editInfo.admin && this.editInfo.admin <0){
                this.$message({
                    message:'话题主id有误',
                    type:'warning'
                })
                return
            }else if(this.editInfo.admin > 0){
                const topicAdmin = await this.getUserDetail()
                // console.log(topicAdmin)
                if(!topicAdmin){
                    return
                }
            }


            var that = this;
            var url = '';
            var dataList = this.editInfo;
            // console.log('2147398473894789374',this.editInfo)
            var message,txt;

            if (this.editType == 'add') {
                url = '/topic/add';
                delete dataList.id 
                message = '是否确认将该话题添加到圈内';
                txt="确认添加"
            } else {
                url = '/topic/update';
                message ="是否确认更新该话题资料";
                txt="确认更新";
            }
            
            this.$confirm(message, '提示', {
                confirmButtonText: txt,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$http.post({
                isJson: true,
                url: url,
                params: dataList,
                success: res => {
                    that.$message({
                        message: '操作成功',
                        type: 'success',
                        onClose: () => {
                            that.$router.go(-1);
                        },
                        duration: 1000
                    });
                    that.submitDisable = false;
                }
            });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            }); 

        },
        
        //获取圈子
        getGroup(){
            this.$http.get({    
                isJson:false,
                url:'/group/kvs',
                success:res=>{
                    this.options=res.data;
                    this.editInfo.groupId = this.editInfo.groupId ? parseInt(this.editInfo.groupId) : ''; 
                }
            })
        },
    },

    

    activated(){
        
        this.editType = this.$router.currentRoute.query.type;
        let query = this.$router.currentRoute.query;
        
        if(query){
            this.editInfo={
                id: query.id,
                name: query.name,
                groupId:query.groupId,
                description: query.description,
                hotValue:query.hotValue,
                cover:query.cover,
                admin:query.topicAdminId,
                radioTime:query.radioTime,
                radioTitle:query.radioTitle,
                radioUrl:query.radioUrl
            }
        }
        this.getGroup()
        console.log(this.editInfo,query)
    },
    watch:{
        'editInfo.indexs':{
            handler(curVal,oldVal){
                if(oldVal==""&&this.editType=="edit"){
                    console.log(curVal);
                    this.initAdIndex=curVal;
                }
                this.changeAdIndex=curVal==this.initAdIndex?true:false;
            },
            deep: true
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
    .el-dialog div{
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
    .box{
        width: 120px;
        height: 120px;
        border: 1px dashed #d9d9d9;
        overflow: hidden;
        position: relative;
    }
    .sponsor{
        width: 120px;
        height: 120px;
        border-radius: 6px;
        cursor: pointer;
        line-height: 120px;
        text-align: center;
        font-size: 28px;
        color: #8c939d;
        position: absolute;
        left: 0;
        top: 0;
    }
    .box:hover{
        /* border-color:dodgerblue; */
        border: 1px dashed #409EFF;
    }
    .uploadAudio{
        position: absolute;
        width: 120px;
        height: 120px;
        opacity: 0;
        z-index: 10;
    }
    .voteAudio{
        width: 28px;
        height: 28px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 1
    }
</style>