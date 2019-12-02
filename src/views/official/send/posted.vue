<template>
<div class="app">
    <div class="box" v-if="box">
        <el-form :inline="true" class="demo-form-inline" style="margin:20px 0 0 20px;">
            
            <el-autocomplete class="inline-input" v-model="editInfo.userName" :fetch-suggestions="querySearch" value-key="name" placeholder="请输入用户昵称" @select="handleSelect"></el-autocomplete>
                       
            <!-- <el-button type="primary">查询</el-button> -->
            
            <el-button type="success" @click="next(0)" class="next">下一步</el-button>
        </el-form>
        
        <!-- 选择马甲 -->
        <div class="box1">
            <div class="user" @click="changeActive(-1)">
                <div class="img"></div>
                <span class="username">随机帐号</span>
                <i :class="`el-icon-circle-check color ${active == -1 ? 'active' : ''}`"></i>
            </div>
            <div class="user" v-for="item in userList" @click="changeActive(item)">
                <img :src="item.headUrl" class="img" />
                <span class="username">{{item.name}}</span>
                <i :class="`el-icon-circle-check color ${active == item.id ? 'active' : ''}`"></i>
            </div>
        </div>
    </div>
    
    

    <!-- 编辑帖子 -->
    <div class="editPost" v-if="editPost">
        <div class="audio">
            <el-row class="demo-autocomplete">
                <el-col :span="2" class="txt_translate">音频封面</el-col>
                <el-col :span="3">
                    <div class="cropperbox">
                        <input type="file" id="uploads" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event)" class="uploadAudio">
                        <div class="sponsor">
                            <img :src="editInfo.coverUrl" v-if="editInfo.coverUrl" style="width:118px;height:118px;border-radius:4px;" />
                            <i class="el-icon-plus voteAudio" v-else></i>
                        </div>
                    </div>
                    <!-- <my-upload functionName="upload"  :model.sync="editInfo.coverUrl" type='img'></my-upload> -->
                </el-col>
                <span>*图片尺寸为200*200，不传则显示默认的灰色背景</span>
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
                <el-col :span="5">
                    <input type="file" id="file" @change="uploadFile" style="width:200px;">
                </el-col>
                <span>*最大不能超过15M</span>
            </el-row>

            <audio :src="editInfo.audioUrl" v-if="editInfo.audioUrl && editInfo.audioUrl != ''" preload="auto" ref="aduio_cc" controls class="audioControls"></audio>

            <el-row class="demo-autocomplete uploadFile">
                <el-col :span="2" >音频名称</el-col>
                <el-col :span="5">
                    <el-input v-model="editInfo.title" placeholder="请输入内容"></el-input>
                </el-col>
            </el-row>

            <el-row class="demo-autocomplete uploadFile">
                <el-col :span="2" >插入视频</el-col>
                <el-col :span="3">
                    <my-upload functionName="upload" :model.sync="editInfo.videoUrl" type='video'></my-upload>
                    <i class="el-icon-circle-close clearVideo" v-if="editInfo.videoUrl" @click="editInfo.videoUrl = ''"></i>
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
                <input v-model="voteTitle" placeholder="编辑标题(最多20个字，可不填)" maxlength="20" class="voteInput" />
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



        <vue-editor v-model="editInfo.fullContent" id="editor" useCustomImageHandler @imageAdded="handleImageAdded" @blur="onblur" class="editTxt"></vue-editor>

        <el-button type="success" @click="next(1)" class="next btn_next">下一步</el-button>

    </div>
        
    <div class="selectGroup" v-if="selectGroup">
        <h3 class="uploadFile">选择发布圈子，不支持修改归属圈子</h3>
        <el-row class="demo-autocomplete uploadFile">
            <el-col :span="2" class="txt_translate">选择圈子</el-col>
            <el-col :span="22">
                <el-select v-model="editInfo.groupId" clearable placeholder="请选择" @visible-change="selectedGroup">
                    <el-option v-for="ogroup in group" :key="ogroup.id" :label="ogroup.name" :value="ogroup.id"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="demo-autocomplete uploadFile">
            <el-col :span="2" class="txt_translate">圈内话题</el-col>
            <el-col :span="22">
                <el-select v-model="editInfo.topicId" clearable placeholder="请选择" >
                    <el-option v-for="index in topic" :key="index.id" :label="index.name" :value="index.id"></el-option>
                </el-select>
                <!-- <el-select v-model="editInfo.topicId" clearable placeholder="请选择" v-if="editInfo.topicId"></el-select> -->
            </el-col>
        </el-row>
        <el-row class="demo-autocomplete uploadFile">
            <el-col :span="2" class="txt_translate">设置发布时间</el-col>
            <el-col :span="22">
                <el-date-picker v-model="editInfo.publishTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" align="right"></el-date-picker>
            </el-col>
        </el-row>

        <el-button type="primary" @click="publish(1)" class="next" :disabled="isDisabled">定时发布</el-button>
        <el-button type="success" @click="publish(2)" class="next" :disabled="isDisabled">立即发布</el-button>
        <el-button type="success" @click="pre" class="next">上一步</el-button>
    </div>
</div>
</template>
<script>
import MyUpload from "@/components/MyUpload";
import { VueEditor, Quill } from "vue2-editor";
import axios from 'axios';
import voteImg from '@/assets/images/vote.png';
import { VueCropper } from 'vue-cropper'; 

export default {
    data(){
        return{
            // uploader:"file/uploadPress", //文件上传地址
            userList:[],        //马甲数据
            active:-1,          //选择马甲
            editInfo:{
                userName:'',         // 用户昵称
                groupId:'',          //圈子名称
                topicId:'',          //话题名称
                contentSource:'',   //内容来源 1：官方帐号发帖 2 抓取内容
                fullContent:'',         //富文本内容
                publishTime:'',     //发布时间
                spiderId:'',        //抓取内容传值
                coverUrl:'',          //封面路径
                audioUrl:'',         //音频
                input:'',           //音频时长
                title:'',       //音频名称
            },
            box:true,           //选择马甲显示隐藏
            editPost:false,     //富文本显示隐藏
            uploadAudio:'', //音频文件
            textarea:'',    //首页文本内容
            img1:'',        //首页文本1
            img2:'',        //首页文本2
            img3:'',        //首页文本3
            selectGroup:false, //选择圈子话题
            group:[],        //圈子列表
            topic:[],            //话题列表
            restaurants:[],      //搜索数据
            isDisabled:false,   //按钮是否禁用
            // toolBar:[
            //     ['bold', 'italic', 'underline'],
            //     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            //     ['image', 'code-block']
            // ]
            dialogVisible:false,    //投票框是否显示
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
                            this.editInfo.coverUrl = res.data.data;
                            console.log(this.editInfo.coverUrl)
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
        // 获取官方账号
        querySearch(queryString, cb) {
            // debugger
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // console.log(results)
            // 调用 callback 返回建议列表的数据
            if(results.length < 1){
                this.$message({
                    message:'未找到到你要的数据,请确认输入无误',
                    type:'warning'
                })
                return
            }
            cb(results);
        },
        // 同上
        createFilter(queryString) {
            return (restaurant) => {
                console.log(restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {
            this.active = item.id;
        },

        // 上一步
        pre(){
            this.editPost=true;
            this.selectGroup = false;
        },
        // 下一步按钮
        next(num){
            // console.log('num',num,this.editInfo.fullContent)
            if(num == 0){
                console.log('下一步')
                this.box = false;
                this.editPost = true;
            }else if(num == 1 && this.editInfo.fullContent){
                let reg = /(\s)+/g
                if(this.editInfo.fullContent.replace(reg,"").length <= 7){
                    this.$message({
                        message:'不允许输入内容全为空格',
                        type:'warning'
                    })
                    return
                }
                
                if(this.editInfo.audioUrl != '' && this.editInfo.input == ''){
                    this.$message({
                        message:'音频时长不允许为空',
                        type:'warning'
                    })
                    return
                }

                this.editPost=false;
                this.selectGroup = true;

                            
            }else{
                this.$message({
                    message:'富文本内容不允许为空',
                    type:'warning '
                })
            }
        },
        // 选择马甲
        changeActive(item){
            this.active = item == -1 ? -1 : item.id;
            this.editInfo.userName = item == -1 ? '随机帐号' : item.name;
            
            console.log('this.userName:',this.editInfo.userName,this.active)
        },

        // 插入图片
        handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
            var formData = new FormData();
            formData.append('file', file)
            axios({
              url: BASE_URL + "file/uploadPress",
              method: 'POST',
              data: formData
            }).then((result) => {
            //   console.log('result',result)
              let url = result.data.data // Get url from response
              Editor.insertEmbed(cursorLocation, 'image', url);
              resetUploader();
            }).catch((err) => {
              console.log('err',err)
            })
        },

        onblur(){
            // console.log(this.editInfo.fullContent)
        },

        //上传音频
        uploadFile(e){
            let self = this;
            let formData = new FormData();
            console.log('eeeeeeee',e.target.files[0]);
            formData.append('file',e.target.files[0]);
            console.log(self.$refs,'refs')
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

                this.editInfo.audioUrl = result.data.data;

                await self.$refs.aduio_cc;
                let audio = self.$refs.aduio_cc
                console.log('audio:',audio)
                audio.oncanplay = function () {  
                    let min = Math.floor(audio.duration/60);
                    let sec = Math.floor(audio.duration%60);
                    console.log("audio.duration",audio.duration,min,sec);
                    console.log('audio',audio)
                    self.editInfo.input = `${min}:${sec}`
                }
            //   resetUploader();
            }).catch((err) => {
              console.log('err',err)
            })
        },
        //获取官方账号数据
        getID(){
            this.$http.get({
                isJson:false,
                url:'/virtualUser/kvs',
                success: res=>{
                    if(res.code == 0){
                        this.userList=res.data;
                        this.restaurants = res.data;
                    }
                }
            })
        },
        //获取圈子数据
        async getGroup(){
            this.$http.get({
                isJson:false,
                url:'/group/kvs',
                success:res=>{
                    this.group=res.data
                    this.editInfo.groupId = this.editInfo.groupId ? this.editInfo.groupId : res.data[0].id;
                    this.topic = '';
                    this.editInfo.topicId = "";
                    this.selectedGroup() //获取圈内话题
                    
                }
            })   
        },
        //选择圈子获取圈内话题数据
        selectedGroup(){
            let data = {
                groupId: this.editInfo.groupId,
                topicType: 0   //所有话题
            }
            this.$http.post({
                isJson:true,
                url:'/topic/kvs',
                params:data,
                success:res=>{
                    if(res.data != '' && res.code == 0){
                        this.topic = res.data;
                        this.editInfo.topicId = res.data[0].id;
                        console.log(this.editInfo.topicId,111111)
                    }else{
                        this.editInfo.topicId =''
                        console.log(222222222)
                    }
                    
                }
            })
        },

        // 发布
        publish(num){
            if(num == 1 && this.editInfo.publishTime == ''){
                this.$message('发布日期必填')
                return;
            }
            this.isDisabled = true;
            var content=[];
            if(this.editInfo.audioUrl != '' && this.editInfo.audioUrl){
                content.push({type:3,cover:this.editInfo.coverUrl,content:this.editInfo.audioUrl,time:this.editInfo.input,title:this.editInfo.title,indexs:0});   //type 1 文字 2 图片 3 音频 4 视频
            }

            if(this.editInfo.videoUrl){
                let video = JSON.parse(sessionStorage.getItem('videoWH'));
                content.push({type:4,content:this.editInfo.videoUrl,width:video.videoWidth,height:video.videoHeight});//type 1 文字 2 图片 3 音频 4 视频
            }

            if(!this.voteImgShow){
                 content.push({type:5,title:this.voteTitle});//type 1 文字 2 图片 3 音频 4 视频 5投票
            }

            let data = {
                userType: this.active == -1 ? 1 : 2,
                userId: this.active,  
                userName: this.editInfo.userName,  
                groupId:this.editInfo.groupId,   //圈子id
                topicId:this.editInfo.topicId, //话题id
                publicType: num,   // 1定时发布   2立即发布
                contentSource: this.editInfo.contentSource ? this.editInfo.contentSource : 1,  // 内容来源：0用户 1官方 2抓取
                fullContent:this.editInfo.fullContent, //富文本内容
                content: content,
                prePublicTime: num == 1 ? this.editInfo.publishTime : '',
                spiderId:this.editInfo.spiderId,
                votes: !this.voteImgShow ? this.vote : []
            };
            // console.log('content:',data)
            this.$http.post({
                isJson:true,
                url:'/post/add',
                params:data,
                success:res=>{
                    
                    if(res.code == 0){
                        this.$message({
                            message:'发布成功,小程序端显示略有延迟不超过2分钟',
                            type:'success'
                        })
                        
                        if(this.editInfo.spiderId){
                            if(num == 1){
                                this.$router.push({
                                    path:'/captureContent/publicList'
                                })
                            }else{
                                this.$router.push({
                                    path:'/captureContent/publicedList'
                                })
                            }
                            
                        }else{
                            if(num == 1){
                                this.$router.go(-1)
                            }else{
                                this.$router.push({
                                    path:'/official/send/published'
                                })
                            }
                        }
                        
                        this.isDisabled = false
                   }else{
                        this.$message({
                            message:'服务异常',
                            type:'warning'
                        })

                        this.isDisabled = false
                   }
                }
            })

            
        }   
    },

    async activated(){
        
        //样式清零
        this.box = true;
        this.editPost = false;
        this.selectGroup = false;

        //投票清零
        this.voteTitle = "";
        this.voteImgShow = true;
        this.vote = [                  //投票数据
            {indexs: 1,description:''},
            {indexs: 2,description:''},
        ]; 
        
        this.editInfo={
            userName:'',         // 用户昵称
            groupId:'',          //圈子名称
            topicId:'',          //话题名称
            contentSource:'',   //内容来源 1：官方帐号发帖 2 抓取内容
            fullContent:'',         //富文本内容
            publishTime:'',     //发布时间
            spiderId:'',        //抓取内容传值
            coverUrl:'',          //封面路径
            audioUrl:'',         //音频
            input:'',           //音频时长
            title:'',       //音频名称
            videoUrl:''     //视频
        };
        this.active = -1;
        const query = this.$router.currentRoute.query;
        
        await this.getID()
        await this.getGroup()

        //圈子发帖，话题发帖
        if(query.groupId){
            this.editInfo.groupId = parseInt(query.groupId);
            this.editInfo.topicId = query.topicId ? parseInt(query.topicId) : '';
        }

        if(query.id){ //获取抓取内容数据
            this.editInfo.spiderId = query.id;
            this.editInfo.contentSource = 2;
            this.$http.get({
                isJson:false,
                url:`/spider/detail/${this.editInfo.spiderId}`,
                success:res=>{
                    console.log(res.data.content)
                    this.editInfo.fullContent = res.data.content
                }
            })
        }
        
    },
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
        max-width: 375px;
        min-width: 230px;
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
        line-height: 80px;
    }
    .username{
        height: 80px;
        line-height: 80px;
        margin-left: 10px;
        max-width: 210px;
        min-width: 100px;
        /* font-size: 16px; */
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
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
        border-radius: 6px;
        cursor: pointer;
        line-height: 120px;
        text-align: center;
        font-size: 28px;
        color: #8c939d;
        position: relative;
        border: 1px dashed #d9d9d9;
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
