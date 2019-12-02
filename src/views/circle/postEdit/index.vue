<template>
<div class="app">
    
    <!-- 编辑帖子 -->
    <div class="editPost" v-if="editPost">
        <div class="audio">
            <!-- 音频 -->
            <el-row class="demo-autocomplete">
                <el-col :span="2" class="txt_translate">音频封面</el-col>
                <el-col :span="3">
                    <div class="cropperbox">
                        <input type="file" id="uploads" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event)" class="uploadAudio">
                        <div class="sponsor">
                            <img :src="coverUrl" v-if="coverUrl" style="width:118px;height:118px;border-radius:4px;" />
                            <i class="el-icon-plus voteAudio" v-else></i>
                        </div>
                    </div>
                    <!-- <my-upload functionName="upload" :uploadUrls="uploader" :model.sync="coverUrl" type='img'></my-upload> -->
                </el-col>
                <el-col :span="12"  class="txt_hint">*图片尺寸为xxxx，不传则显示默认的灰色背景</el-col>
            </el-row>

            <el-row class="demo-autocomplete uploadFile" v-if="cropper.img">
                <el-col :offset="2">
                    <!-- 图片裁剪 -->
                    <vueCropper 
                        ref="cropper" 
                        :img="cropper.img" 
                        :autoCrop="true" 
                        :fixed="true" 
                        :centerBox="true" 
                        :autoCropWidth="cropper.width" 
                        :autoCropHeight="cropper.width" 
                        :canMove="false" 
                        :canMoveBox="true"   
                        class="vueCropper"
                    >
                    </vueCropper>
                    <el-button @click="down('blob')" type="primary" class="uploadFile">{{cropperTxt}}</el-button> 
                </el-col>
            </el-row>

            <el-row class="demo-autocomplete uploadFile">
                <el-col :span="2" class="txt_translate">音频文件</el-col>
                <el-col :span="6">
                    <input type="file" id="file" @change="uploadFile" style="width:200px;">
                </el-col>
                <span class="txt_translate">最大不能超过15M呢</span>
            </el-row>

            <audio :src="audioUrl" v-if="audioUrl && audioUrl !=''" ref="aduio_cc" controls class="audioControls"></audio>

            <el-row class="demo-autocomplete uploadFile">
                <el-col :span="2" class="txt_translate">音频名称</el-col>
                <el-col :span="5">
                    <el-input v-model="audioName" placeholder="请输入内容"></el-input>
                </el-col>
            </el-row>

            <el-row class="demo-autocomplete uploadFile">
                <el-col :span="2" >插入视频</el-col>
                <el-col :span="3">
                    <my-upload functionName="upload" :model.sync="videoUrl" type='video'></my-upload>
                    <i class="el-icon-circle-close clearVideo" v-if="videoUrl"></i>
                </el-col>
                <span>*最多只能上传一个视频，且大小不能超过20M</span>
            </el-row>

            <el-row class="demo-autocomplete uploadFile">
                <el-col :span="2" >插入投票</el-col>
                <el-col :span="5">
                    <!-- <el-button type="primary" @click="dialogVisible = true">发起投票</el-button> -->
                    <div class="sponsor" @click="dialogVisible = true">
                        <i class="el-icon-plus" v-if="voteImgShow"></i>
                        <img :src="voteImg" class="voteImg" v-else />
                        <i class="el-icon-circle-close clearVote" v-if="!voteImgShow" @click.stop="clearVote"></i>
                    </div>
                </el-col>
            </el-row>


            <!-- 投票对话框 -->
            <el-dialog  :visible.sync="dialogVisible" width="400px" :before-close="closeVote">
                <input v-model="voteTitle" placeholder="编辑标题(最多20个字，可不填)" class="voteInput" />
                <hr style="margin-bottom:15px;">
                <div class="vote">
                    <el-row class="demo-autocomplete" v-for="v in vote" :key="v.indexs" v-if="v.indexs > 2">
                        <el-col :span="20" :offset="2">                          
                            <el-input :placeholder="'选项'+v.indexs+'(最多16个字)'" v-model="v.description" maxlength="16">
                                <i slot="suffix" class="el-input__icon el-icon-error" style="color:red;" @click="clear(v.indexs)"></i>
                            </el-input> 
                        </el-col>
                    </el-row>
                    <el-row class="demo-autocomplete"  v-else>
                        <el-col :span="20" :offset="2">
                            <el-input :placeholder="'选项'+v.indexs+'(最多16个字)'" v-model="v.description" maxlength="16"></el-input>
                        </el-col>
                    </el-row>

                    <el-row class="demo-autocomplete">
                        <el-col :span="20" class="green" :offset="2" @click.native="addOption">+添加选项</el-col>
                    </el-row>
                </div>

                <el-button type="success" @click="voteSure" class="sure">确 定</el-button>
                
            </el-dialog>
        </div>

        <vue-editor v-model="fullContent" id="editor" useCustomImageHandler @imageAdded="handleImageAdded" @blur="onblur" class="editTxt"></vue-editor>
        <el-button type="success" @click="publish(2)" class="next btn_next">立即发布</el-button>
        <!-- <div class="homeEdit">
            <h3 style="margin-bottom:10px;">帖子列表缩略信息</h3>
            <el-row class="demo-autocomplete uploadFile">
                <el-col :span="3" >文本内容</el-col>
                <el-col :span="21">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" maxlength="200"></el-input>
                </el-col>
            </el-row>

            <el-row class="demo-autocomplete ">
                <el-col :span="3" >上传图片</el-col>
                <el-col :span="3">
                    <my-upload functionName="upload" :uploadUrls="uploader" :model.sync="img1" type='img'></my-upload>
                </el-col>
                <el-col :span="3">
                    <my-upload functionName="upload" :uploadUrls="uploader" :model.sync="img2" type='img'></my-upload>
                </el-col>
                <el-col :span="15">
                    <my-upload functionName="upload" :uploadUrls="uploader" :model.sync="img3" type='img'></my-upload>
                </el-col>
            </el-row>

            
        </div> -->
    </div> 

</div>
</template>
<script>
import MyUpload from "@/components/MyUpload";
import { VueEditor, Quill } from "vue2-editor";
import axios from 'axios';
import voteImg from '@/assets/images/vote.png'; //投票图片资源
import { VueCropper } from 'vue-cropper'; 
let videoData
export default {
    data(){
        return{
            uploader:"file/uploadPress", //文件上传地址
            userList:[],        //马甲数据
            active:-1,          //选择马甲
            box:true,           //选择马甲显示隐藏
            fullContent:'',         //富文本内容
            editPost:true,     //富文本显示隐藏
            input:'',           //音频时长
            coverUrl:'',          //封面路径
            uploadAudio:'', //音频文件
            textarea:'',    //首页文本内容
            audioUrl:'', //音频显示隐藏
            img1:'',        //首页文本1
            img2:'',        //首页文本2
            img3:'',        //首页文本3
            selectGroup:false, //选择圈子话题
            group:[],        //圈子列表
            groupid:'',          //圈子名称
            topic:[],            //话题列表
            topicid:'',          //话题名称
            publishTime:'',     //发布时间
            postId:'',          //帖子id
            audioName:'',       //音频名称
            dialogVisible:false,    //投票框是否显示
            videoUrl:'',    //视频url
            voteTitle:'',           //投票标题
            vote:[                  //投票数据
                {indexs: 1,description:''},
                {indexs: 2,description:''},
            ],
            voteImgShow:true,  //图标展示
            voteImg:voteImg,
            cropper:{
                img:'',
                width:120
            }, //  裁剪
            cropperTxt:'点我裁剪の'   //裁剪提示
        }
    },
    components: {
      VueEditor,MyUpload,VueCropper
    },

    methods:{
        down (type) {
            // event.preventDefault()
            // 输出
            this.cropperTxt = "裁剪ing...";
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob((data) => {
                    // console.log('blob:',data)
                    let formData = new FormData();
                    formData.append('file',data);
                    axios({
                        url: BASE_URL + "file/uploadPress",
                        method: 'POST',
                        data: formData
                    }).then((res) => {
                        if(res.data.code == 0){
                            this.coverUrl = res.data.data;
                            console.log(this.coverUrl)
                            this.cropperTxt = '点我裁剪';
                        }
                        
                    }).catch((err) => {
                        console.log('err',err)
                    })
                })
            } else {
                this.$refs.cropper.getCropData((data) => {
                    console.log('base64:',data)
                    this.downImg = data;
                })
            }
        },

        uploadImg (e) {
				//上传图片
				// this.option.img
				var file = e.target.files[0]
				if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
					 this.$message('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
					 return false
				 }
				var reader = new FileReader()
				reader.onload = (e) => {
					let data
					if (typeof e.target.result === 'object') {
						// 把Array Buffer转化为blob 如果是base64不需要
						data = window.URL.createObjectURL(new Blob([e.target.result]))
					} else {
						data = e.target.result
                    }
                    this.cropper.img = data;
				}
				// 转化为base64
				// reader.readAsDataURL(file)
				// 转化为blob
                reader.readAsArrayBuffer(file)
        },
        // 清除投票数据
        clearVote(){
            this.vote = [                  //投票数据
                {indexs: 1,description:''},
                {indexs: 2,description:''},
            ];
            this.voteImgShow = true;
        },
        // 关闭对话弹出框
        closeVote(){
            if(this.voteImgShow){
                this.dialogVisible = false;
                this.vote = [                 //投票数据
                    {indexs: 1,description:''},
                    {indexs: 2,description:''},
                ];
                this.voteTitle = '';
            }else{
                this.dialogVisible = false;
            }
        },   
        // 清除投票选项
        clear(indexs){
            const arr = this.vote;
            arr.map( (value,index) => {
                if(indexs == value.indexs){
                    this.vote.splice(index,1)
                    return
                }
            })
        },
        // 添加选项
        addOption(){
            if(this.vote.length == 5){
                this.$message({
                    message:'目前最多编辑5个选项',
                    type:'warning'
                })
                return false;
            }
            this.vote.push({indexs: this.vote.length + 1, description:''})
        },
        voteSure(){
            const data = this.vote;
            let result = data.map( (v,k)=>{
                if(!v.description){
                    return false;
                }
            })
            
            if(result.indexOf(false) != -1){
                this.$message({
                    message:'请编辑投票选项',
                    type:'warning'
                })
                return
            }
            
            this.dialogVisible = false;
            this.voteImgShow = false;
            this.$message({
                message:'投票编辑成功',
                type:'success'
            })
        },
        // 下一步按钮
        next(num){
            console.log('num',num)
            if(num == 0){
                console.log('下一步')
                this.box = false;
                this.editPost = true;
            }else if(num == 1 && this.fullContent != ''){
                
                this.editPost=false;
                this.selectGroup = true;

                let data={
                    pageSize: 20,
                    startPage: 1
                }
                this.$http.post({
                    isJson:true,
                    url:'/group/list',
                    params:data,
                    success:res=>{
                        console.log('圈子数据',res)
                        this.group=res.data.list
                        this.groupid =res.data.list[0].id;

                        this.selectedGroup() //获取圈内话题

                    }
                })               
            }else{
                this.$message({
                    message:'富文本内容不允许为空',
                    type:'warning '
                })
            }
        },
        // 选择马甲
        changeActive(id){
            this.active = id;
        },

        // 插入图片
        handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
            var formData = new FormData();

            formData.append('file', file)

            console.log('file', file)
            axios({
              url: BASE_URL + "file/uploadPress",
              method: 'POST',
              data: formData
            }).then((result) => {
              console.log('result',result)
              let url = result.data.data // Get url from response
              Editor.insertEmbed(cursorLocation, 'image', url);
              resetUploader();
            }).catch((err) => {
              console.log('err',err)
            })
        },

        onblur(){
            console.log(this.fullContent)
        },

        //上传音频
        uploadFile(e){
            let sef = this;
            let formData = new FormData();
            console.log('eeeeeeee',e.target.files[0]);
            formData.append('file',e.target.files[0]);
            axios({
              url: BASE_URL + "file/uploadPress",
              method: 'POST',
              data: formData
            }).then(async (result) => {
                console.log('result',result.data.data)
                this.audioUrl = result.data.data;

                // 获取音频时长
                await self.$refs.aduio_cc;
                let audio = self.$refs.aduio_cc
                console.log(audio)
                audio.oncanplay = function () {  
                    let min = Math.floor(audio.duration/60);
                    let sec = Math.floor(audio.duration%60);
                    console.log("audio.duration",audio.duration,min,sec);
                    self.input = `${min}:${sec}`
                }
            }).catch((err) => {
              console.log('err',err)
            })
        },

        selectedGroup(){
            let params = {
                groupId: this.groupid,
                topicType: 0   //获取热议话题
            }
            this.$http.post({
                isJson:true,
                url:'/topic/kvs',
                params:params,
                success:res=>{
                    console.log('圈子数据',res)
                   if(res.data != '' && res.code == 0){
                        this.topic=res.data
                        this.topicid =res.data[0].id
                    }else{
                        console.log(1111111111)
                        this.topicid=''
                    }
                }
            })
        },

        // 发布
        publish(num){
            if(num == 1 && this.publishTime == ''){
                this.$message({
                    message:'发布日期必填'
                })
                return;
            }else if(this.fullContent == "" || !this.fullContent){
                this.$message({
                    message:'富文本内容不允许为空',
                    type:"warning"
                })
                return
             }
            //  else if( !this.textarea && Boolean(!this.img1 || !this.img2 || !this.img3)){
            //     this.$message({
            //         message:'首页帖子编辑不允许为空',
            //         type:"warning"
            //     })
            //     return    
            // }

            var content=[];
            if(this.audioUrl != '' && this.audioUrl){
                content.push(
                    {type:3,cover:this.coverUrl,content:this.audioUrl,time:this.input,indexs:0,postId:this.postId,title: this.audioName},   //type 1 文字 2 图片 3 音频 4 视频
                )
            }

            console.log(this.videoUrl)

            if(this.videoUrl){
                if(videoData && videoData.content == this.videoUrl){
                    content.push(videoData)
                }else{
                    let video = JSON.parse(sessionStorage.getItem('videoWH'));
                    content.push({type:4,content:this.videoUrl,width:video.videoWidth,height:video.videoHeight});//type 1 文字 2 图片 3 音频 4 视频 5 投票
                }
            }

            if(!this.voteImgShow){
                 content.push({type:5,title:this.voteTitle});//type 1 文字 2 图片 3 音频 4 视频 5投票
            }
            
            let data = {  
                fullContent:this.fullContent, //富文本内容
                id:this.postId,
                postContents: content,
                votes:!this.voteImgShow ? this.vote : []
            };

            this.$http.post({
                isJson:true,
                url:'/post/update',
                params:data,
                success:res=>{
                    if(res.code == 0){
                      this.$message({
                        message:'编辑更新成功',
                        type:'success'
                      })
                      console.log(content)
                      this.$router.go(-1)
                    }
                    
                }
            })

            
        }   
    },

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

        //投票清零
        this.voteTitle = "";
        this.voteImgShow = true;
        this.videoUrl = '';
        this.vote = [                  //投票数据
            {indexs: 1,description:''},
            {indexs: 2,description:''},
        ]; 

        this.postId = this.$router.currentRoute.query.postId;
        if(this.postId){
          this.$http.post({
            isJson:false,
            url:`/post/${this.postId}`,
            success:res=>{
              this.fullContent = res.data.fullContent;
              this.postContents = res.data.postContents;
              this.postContents.forEach((value,key)=>{
                if(value.type == 1){                       //type 1 文字 2 图片 3 音频 4 视频           
                  this.textarea =value.content
                }else if(value.type == 2){
                    if(this.img1 == ''){
                      this.img1 = value.content
                    }else if(this.img2 == ''){
                      this.img2 = value.content
                    }else{
                      this.img3 = value.content
                    }
                }else if(value.type == 3){
                  this.audioUrl = value.content;
                  this.coverUrl = value.cover;
                  this.input = value.time;
                  this.audioName = value.title;
                }else if(value.type == 4){
                    this.videoUrl = value.content;
                    videoData = value;
                }else if(value.type == 5){
                    if(res.data.votes){
                        this.vote = res.data.votes;
                        this.voteTitle = value.title;
                        this.voteImgShow = false;
                    }
                    
                }
              })

              
            }
          })
        }
 
    }
}
</script>
<style scoped>
    .app{
        color: #999;
    }
    .box,.box1{
        overflow:hidden;
    }
    .user{
        width: 250px;
        height: 80px;
        border:1px solid #eee;
        border-radius: 10px;
        float: left;
        margin:15px 20px;
        /* position: relative; */
    }
    .img{
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 1px solid #ccc;
        border-radius: 50%;
        margin-left:15px; 
        transform: translateY(15px);
    }
    .color{
        color: transparent;
        font-size: 28px;
    }
    .username{
        display: inline-block;
        height: 80px;
        line-height: 80px;
        margin-left: 10px;
        width: 100px;
    }
    .active{
        color:#67c23a;
    }
    /* .next{
        margin-left:20px; 
    } */
    .btn_next{
        margin: 60px 0; 
    }
    .editPost{
        width: 1000px;
        margin: 0 auto;
    }
    .editTxt{
        width: 100%;
        height: 600px;
        color: #666;
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
        margin-top: 58px;
    }
    /* .audioControls{
        width: 300px;
        height: 40px;
        margin-top: 10px;
    } */
    .selectGroup{
        margin-left:20px; 
    }
    .txt_translate{
        position: relative;
        top: 3px;
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
    .green{
        color: #67c23a;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        border-radius: 4px;
        border: 1px solid #dcdfe6; 
    }
    .sure{
        display: block;
        width: 200px;
        margin: 10px auto;
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
    .sponsor:hover{
        border-color:cornflowerblue;
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
    .clearVideo{
        font-size: 16px;
        color: red;
        position: relative;
        left: 470px;
        top: -286px;
        z-index: 999;
    }
    .clearVote{
        position: absolute;
        font-size: 16px;
        color: red;
        right: -8px;
        top: -8px;
        z-index: 999;
    }
    .vueCropper{
        width: 800px;
        height: 400px;
    }
    .cropperbox{
        width: 120px;
        height: 120px;
        overflow: hidden;
        position: relative;
    }
    .sponsor:hover{
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
