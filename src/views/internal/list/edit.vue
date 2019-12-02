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

#audio1{
    float: right;
    margin-right: 20px;
    margin-top: 2px;
}
#audioFile{
    width: 60%;
}

.tips_input{
    color: red;
    position: relative;
    top: 4px;
    margin-right: 6px;
}
.copyBtn{
    margin-left: 10px;
}
</style>

<template>

<el-container style="background-color:rgba(226, 226, 226, .24);">
    <el-main>
        <div v-if="this.editType == 'edit'" class="demo-input-suffix">
            <el-col :span="4">
                <span><i class="tips_input">*</i>文章内链：</span>
            </el-col>
            <el-col :span="12">
                <span >/pages/article/article?feedId={{editId}}</span>
                <!-- <button class="copyBtn" data-clipboard-text="我是可以复制的内容，啦啦啦啦" @click="copy">立即阅读</button> -->
                <!-- <button :data-clipboard-text ="'/pages/article/article?feedId='+{{editId}}" class="copyBtn" type="text">复制</button> -->
            </el-col>
        </div>
        <div class="demo-input-suffix">
            <el-col :span="4">
                <span><i class="tips_input">*</i>文章标题：</span>
            </el-col>
            <el-col :span="12">
                <el-input size="small" v-model="editInfo.title"></el-input>
            </el-col>
        </div>
        <div class="demo-input-suffix">
            <el-col :span="4">
                <span><i class="tips_input">*</i>前言：</span>
            </el-col>
            <el-col :span="12">
                <el-input size="small" v-model="editInfo.preContent"></el-input>
            </el-col>
        </div>
        <div class="demo-input-suffix">
            <el-col :span="4">
                <span><i class="tips_input">*</i>评论区设置：</span>
            </el-col>
            <el-col :span="16">
                <el-switch
                    v-model="editInfo.cententShow"
                    active-color="#13ce66"
                    inactive-color="#C0CCDA"
                    active-text="关闭"
                    inactive-text="不关闭"
                    active-value="notShow"
                    inactive-value="show">
                </el-switch>
            </el-col>
        </div>
        <div class="demo-input-suffix" v-if="editInfo.cententShow == 'show'">
            <el-col :span="4">
                <span><i class="tips_input">*</i>来源：</span>
            </el-col>
            <el-col :span="12">
                <el-input size="small" v-model="editInfo.source"></el-input>
            </el-col>
        </div>
        <div v-if="editInfo.cententShow == 'show'" style="color:#999;margin-left:20px;margin-bottom:-16px;">*图片仅支持jpg、png格式，其余格式出错！</div>
        <div v-if="editInfo.cententShow == 'show'" class="demo-tinymce-suffix">
            <el-col :span="6">
                <el-card class="box-card card">
                    <div slot="header" class="clearfix card-head">
                        <span><i class="tips_input">*</i>文章封面图</span>
                        <i class="el-icon-view" style="float: right;"></i>
                    </div>
                    <div class="img-preview">
                        <my-upload functionName="artice" :model.sync="editInfo.backgroundUrl" type='img'></my-upload>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card card">
                    <div slot="header" class="clearfix card-head">
                        <span><i class="tips_input">*</i>小程序卡片分享图</span>
                        <i class="el-icon-view" style="float: right;"></i>
                    </div>
                    <div class="img-preview">
                        <my-upload functionName="artice" :model.sync="editInfo.microShareUrl" type='img'></my-upload>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card card">
                    <div slot="header" class="clearfix card-head">
                        <span><i class="tips_input">*</i>朋友圈海报背景图</span>
                        <i class="el-icon-view" style="float: right;"></i>
                    </div>
                    <div class="img-preview">
                        <my-upload functionName="artice" :model.sync="editInfo.shareUrl" type='img'></my-upload>
                    </div>
                </el-card>
            </el-col>
        </div>

        <div>
            <el-col :span="20">
                <el-card class="box-card card">
                    <div slot="header" class="clearfix card-head">
                        <span>语音文件</span>
                        <i class="el-icon-upload" style="float: right;"></i>
                    </div>
                    <audio id="audio1" v-show="editInfo.voiceFileId" preload="none" :src="getUrl(url)" controls="controls"></audio>
                    <my-upload id="audioFile" :audioUrl.sync="url" :model.sync="editInfo.voiceFileId" type="file" functionName="artice"></my-upload>

                    <div class="demo-input-suffix" style="margin-top: 28px;">
                        <el-col :span="4">
                            <span>音频描述：</span>
                        </el-col>
                        <el-col :span="8">
                            <el-input size="small" v-model="editInfo.textEditer" :disabled="editInfo.voiceFileId?false:true"></el-input>
                        </el-col>
                    </div>

                </el-card>
            </el-col>
        </div>

        <div>
            <el-col :span="18">
                <el-card class="box-card card">
                    <div slot="header" class="clearfix card-head">
                        <span>图文编辑：</span>
                    </div>
                    
                    <div v-for="(item,index) in inputArr" :ref="'editInput'+index">
                        <!-- 图片输入 -->
                        <div class="img-preview" style="margin-top:20px;" v-if="item.type == 'img'">
                            <my-upload functionName="artice" type="img" :model.sync="item.val"></my-upload>
                            <el-input style="margin-top:10%;" class="input_url" placeholder="请输入图片跳转路径" v-model="item.url"></el-input>
                        </div>
                        <!-- 文本输入 -->
                        <div style="margin-top:20px;" v-if="item.type == 'text'">
                            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="item.val"></el-input>
                        </div>
                    </div>

                    <div style="margin-top:20px;">
                        <el-button icon="el-icon-plus" @click="addType('text')">添加文字</el-button>
                        <span>或</span>
                        <el-button icon="el-icon-plus" @click="addType('img')">添加图片</el-button>

                        <el-button style="margin-left:20px;" type="primary" @click="newType()">重置</el-button>
                    </div>
                    
                </el-card>
            </el-col>
        </div>

        <div>
            <el-col :span="24">
                <el-card class="box-card card">
                    <div slot="header" class="clearfix card-head">
                        <span>发布</span>
                        <i class="el-icon-news" style="float: right;"></i>
                    </div>
                    <div class="card-items">

                        <div  class="demo-input-suffix">
                            <el-col :span="4">
                                <span><i class="tips_input">*</i>展示时间：</span>
                            </el-col>
                            <el-col :span="6">
                                <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" size="small" v-model="editInfo.createTime" type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                            </el-col>
                            <span style="color:#999;margin-left:20px;">*展示在内链上的发布时间，与内链实际发布时间无关</span>
                        </div>

                        <div style="text-align:center">
                            <el-button size="medium" v-if="this.editType == 'add'" @click="handleSubmit('')">立即发布</el-button>
                            <el-button type="success" size="medium" v-if="this.editType == 'edit'" @click="handleSubmit(editId)"> 保存 </el-button>
                        </div>
                    </div>
                </el-card> 
            </el-col>   
        </div>
        
    </el-main>
    
    
</el-container>

</template>

<script>

import MyUpload from "@/components/MyUpload";
// import Clipboard from 'clipboard';
import {
    hasNullProp
}
from '@/utils/objectUtil'
export default {
    components: {
        MyUpload,
    },
    data() {
        return {
            baseUrl: BASE_URL,
            editInfo: {
                "cententShow":"notShow",
                "pageUrl":'',
                "shareUrl":'',
            },
            editType: '',
            editId: '',
            url: null,
            // content:"",
            // editorOption: {},
            inputArr: [],
        }
    },
    methods: {
        handleSubmit(editId) {
                if(this.inputArr.length > 0){
                    this.editInfo.content = JSON.stringify(this.inputArr).replace(/\&/g, "@@");
                }else{
                    this.editInfo.content = '';
                }
                var url = '';
                var dataList = this.editInfo;
                if (this.editType == 'add') {
                    url = '/f10101?type=2';
                } else if (this.editType == 'draftEdit') {
                    url = '/f10101?type=2';
                } else {
                    url = 'f10103?type=2';
                }
                //调用校验方法
                var isChecked = this.checkSubmit(this.editInfo);
                if(!isChecked){
                    return
                }
                
                if(editId){
                    var tips = '确认后，内链会更新到修改后的内容，确认更新？'
                }else{
                    var tips = '确认后，内链会立即发布出去，确认立即发布内链？'
                }
                if (hasNullProp(dataList)) {
                    var that = this;
                    this.$confirm(tips, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        that.$http.post(url, dataList, res => {
                            that.$message({
                                message: '操作成功',
                                type: 'success',
                                onClose: () => {
                                    that.$router.go(-1);
                                },
                                duration: 1000
                            });
                            if (that.editType == 'draftEdit' && that.editId) {
                                that.$http.post('/f10202?type=2', {ids:that.editId}, res => {

                                })
                            }
                        })
                    }).catch(() => {
                                
                    });
                    
                } else {
                    this.$message.error('信息填写不完整！');
                }
                
            },
            getChooseItem() {
                var params = {
                    id: this.editId
                }
                var url = '/f10105?type=2';
                this.$http.post(url, params, res => {
                    if(res.content != '' && res.content != null){
                        this.inputArr = JSON.parse(res.content);
                    }else{
                        this.inputArr = [];
                    }
                    this.editInfo = res;
                    var params2 = {}
                    params2.ids = res.voiceFileId;
                    if (res.voiceFileId && typeof(res.voiceFileId)!=="string") {
                        this.$http.post('/getFiles', params2, res2 => {
                            this.url = BASE_URL + res2[res.voiceFileId].path;
                        })
                    }else{
                        this.url = res.voiceFileId;
                    }

                })

            },
            getUrl(url){
                if(url){
                    if(typeof(url) == "string" && url.indexOf("http")!=-1){
                        return url;
                    }else{
                        return this.baseUrl + "/file/" + url
                    }
                }
                return "";
                
            },
            addType(type){
                if(type == 'text'){
                    this.inputArr.push({
                        "type":"text",
                        "val":''
                    })
                }else{
                    this.inputArr.push({
                        "type":"img",
                        "val":'',
                        "url":''
                    })
                }
                
            },
            newType(){
                this.inputArr = [];
            },
            //非空校验
            checkSubmit(list){
                var isChecked = true;    
                if(list.voiceFileId){
                    if(!list.textEditer){
                        this.$message({
                            message: '请输入"音频描述"',
                            type: 'warning',
                            duration: 1000
                        });
                        isChecked = false
                    }
                }
                if(!list.createTime){
                    this.$message({
                        message: '请输入"展示时间"',
                        type: 'warning',
                        duration: 1000
                    });
                    isChecked = false
                }
                if(list.cententShow == 'show'){
                    if(!list.shareUrl){
                        this.$message({
                            message: '请上传"朋友圈海报背景图"',
                            type: 'warning',
                            duration: 1000
                        });
                        isChecked = false
                    }
                    if(!list.microShareUrl){
                        this.$message({
                            message: '请上传"小程序卡片分享图"',
                            type: 'warning',
                            duration: 1000
                        });
                        isChecked = false
                    }
                    if(!list.backgroundUrl){
                        this.$message({
                            message: '请上传"封面图片"',
                            type: 'warning',
                            duration: 1000
                        });
                        isChecked = false
                    }
                    if(!list.source){
                        this.$message({
                            message: '请输入"来源"',
                            type: 'warning',
                            duration: 1000
                        });
                        isChecked = false
                    }
                }
                if(!list.preContent){
                    this.$message({
                        message: '请输入"前言"',
                        type: 'warning',
                        duration: 1000
                    });
                    isChecked = false
                }
                if(!list.title){
                    this.$message({
                        message: '请输入"标题"',
                        type: 'warning',
                        duration: 1000
                    });
                    isChecked = false
                }
                return isChecked;
            },
            // copy() {  
            //     var clipboard = new Clipboard('.copyBtn')  
            //     clipboard.on('success', e => {  
            //         console.log('复制成功')  
            //         // 释放内存  
            //         clipboard.destroy()  
            //     })  
            //     clipboard.on('error', e => {  
            //         // 不支持复制  
            //         console.log('该浏览器不支持自动复制')  
            //         // 释放内存  
            //         clipboard.destroy()  
            //     })  
            // },
    },
    mounted() {
        this.editType = this.$router.currentRoute.query.type;
        this.editId = this.$router.currentRoute.query.id;
        if (this.editType == 'edit') {
            this.getChooseItem();
        }
    }
}

</script>
