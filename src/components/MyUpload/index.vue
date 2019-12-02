<style scope>

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}

.avatar {
    width: 120px;
    height: 120px;
    display: block;
}

.fileUpload .el-upload {
    width: 100%;
}

.fileUpload .el-input-group__append {
    width: 25%;
}

.myBtn {
    color: #ffffff;
    background-color: #409EFF;
    border-color: #409EFF;
    padding: 12px 20px;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    text-align: center;
    font-weight: 500;
    font-size: 14px;
}
.video{
    width: 480px;
    height: 270px;
}

</style>

<template>

<el-upload 
    v-if="type=='img'" 
    class="avatar-uploader" 
    :with-credentials="true" 
    name="file" 
    :action="uploadUrl" 
    :show-file-list="false" 
    :data="uploadData" 
    v-loading.body="loading" 
    element-loading-text="正在上传数据..." 
    :on-success="handleAvatarSuccess" 
    :on-change="onUploadChange"
    :on-progress="onProgress">
    <img v-if="model && !uploading" :src="getPic(model)" class="avatar">
    <el-progress v-else-if="uploading" type="circle" :percentage="uploadingNum" :status="status"></el-progress>
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>

<el-upload 
    v-else-if="type == 'video'" 
    class="avatar-uploader" 
    :with-credentials="true" 
    name="file" 
    :action="uploadUrl" 
    :show-file-list="false" 
    :data="uploadData" 
    v-loading.body="loading" 
    element-loading-text="正在上传数据..." 
    :on-success="handleAvatarSuccess" 
    :on-change="onUploadChange"
    :on-progress="onProgress">
    <video v-show="model && !uploading" preload="auto" :src="getPic(model)" class="video" autoplay controls  ref="videos"></video>
    <el-progress v-if="uploading" type="circle" :percentage="uploadingNum" :status="status"></el-progress>
    <i v-if="!model && !uploading" class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>

<el-upload 
    v-else-if="type == 'audio'" 
    class="avatar-uploader" 
    :with-credentials="true" 
    name="file" 
    :action="uploadUrl" 
    :show-file-list="false" 
    :data="uploadData" 
    v-loading.body="loading" 
    element-loading-text="正在上传数据..." 
    :on-success="handleAvatarSuccess" 
    :on-change="onUploadChange"
    :on-progress="onProgress">
    <audio v-if="model && !uploading" :src="getPic(model)" class="avatar" controls ></audio>
    <el-progress v-else-if="uploading" type="circle" :percentage="uploadingNum" :status="status"></el-progress>
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>

<div v-else>
    <el-input class="fileUpload" placeholder="请输入内容" v-model="fileName" @change="change">
        <template slot="append">
            <el-upload :with-credentials="true" name="file" :action="uploadUrl" :show-file-list="false" :data="uploadData" :on-success="handleAvatarSuccess" :on-change="onUploadChange" :on-progress="onProgress">
                <el-progress v-if="uploading" :text-inside="true" :stroke-width="18" :percentage="uploadingNum" status="success"></el-progress>
                <el-tooltip v-else class="item" effect="dark" content="如果是链接请直接填写,格式类似于http://xxxxx.xxx/xxx" placement="top-start">
                    <div>
                        <el-button>选择文件</el-button>

                    </div>
                </el-tooltip>
            </el-upload>
        </template>

    </el-input>
    <el-button v-if="false" style="float:right;width:25%" @click="downFile" type="primary">下载查看</el-button>
    <a :href="url" target="_blank" ref="down"></a>
</div>

</template>

<script>
let video;
export default {
    props: ['type', "model", "functionName", "audioUrl"],
    data() {
        return {
            uploadUrl: BASE_URL + "file/uploadPress",
            imageUrl: BASE_URL + "/",
            uploadData: {
                functionName: this.functionName,
            },
            fileName: "",
            loading: false,
            uploading: false,
            uploadingNum: 0,
            status: "",
            fid: "",
            url: ""
        };
    },
    methods: {
        onClick(val) {
                if (isNaN(this.model) && this.model != undefined && this.model.indexOf("://")) {
                    this.fileName = this.model
                    alert(0)
                } else {
                    this.fileName = "";
                    alert(1)
                }

            },
            handleAvatarSuccess(res, file) {  
                let self = this;
                console.log('??????????',res,file)
                if(this.type === 'video'){
                    
                    var timer =setInterval(()=>{
                        console.log(this.$refs.videos)
                        if(this.$refs.videos){
                            clearInterval(timer)

                            video = this.$refs.videos;
                            // console.log(video)

                            video.onplay = function(){
                                console.log(video.videoWidth,video.videoHeight);
                                
                                // self.$emit('videowh',video);
                                if(video.videoWidth){
                                    let videoWH = {
                                        videoWidth:video.videoWidth,
                                        videoHeight:video.videoHeight
                                    };
                                    videoWH = JSON.stringify(videoWH)
                                    sessionStorage.setItem('videoWH',videoWH);
                                }
                                
                            }
                            

                            video.src = this.getPic(this.model)
                        }
                    },500)

                    

                    // let video = await this.$refs.videos;
                    // console.log(video);
                }
                this.status = "success";
                setTimeout(() => {
                    this.fid = res.data.fid;
                    this.fileName = res.data.name;
                    this.$emit('update:model', res.data)
                    // this.$emit('update:audioUrl', BASE_URL + res.data.url)
                    this.uploading = false;
                }, 500)

                // this.imageUrl = URL.createObjectURL(file.raw);
            },
            change(val) {
                if (!isNaN(this.model)) {
                    this.getFileName(this.fid)
                } else {
                    this.fileName = this.model;
                }
                this.$emit('update:model', val)
            },
            onProgress(event, file, fileList) {
                this.uploadingNum = parseFloat(event.percent.toFixed(2));

            },
            beforeAvatarUpload(file) {
                // const isJPG = file.type === 'image/jpeg';
                // const isLt2M = file.size / 1024 / 1024 < 2;

                // if (!isJPG) {
                //   this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                // if (!isLt2M) {
                //   this.$message.error('上传头像图片大小不能超过 2MB!');
                // }
                // return isJPG && isLt2M;
                // let param = {
                //   file:file
                // }
                // var formdata = new FormData();
                // formdata.append("file", file);

                // this.$http.post("/json/fileUpload",formdata,(data)=>{
                //      this.$emit('update:model', data.url)
                // })
                return true;
            },
            onUploadChange(file, fileList) {
                // this.loading = true;
                this.uploading = true;
            },
            getFileName(id) {
                console.log(777777)
                if (id) {
                    this.$http.post("/getFiles", {
                        ids: id
                    }, (data) => {
                        this.fileName = data[id].filename;
                    })
                }

            },
            downFile() {
                let id = this.fid;
                this.url = BASE_URL + "/file/" + id;
                console.log(this.url)
                setTimeout(() => {
                    this.$refs.down.click()
                }, 100)
            },
            getPic(url){
                console.log('11111',url)
                if(typeof url == "string" && url.indexOf("http") != -1){
                    return url;
                }else{
                    return this.imageUrl+'file/'+url
                }
            }
    },
    watch: {
        model(newVal) {
            this.fid = ""
            if (isNaN(newVal)) {
                this.fileName = this.model;
            } else {
                this.getFileName(newVal);
                this.fid = newVal
            }
        }
    },
    created() {
        
        if (!this.model || isNaN(this.model)) {
            this.fileName = this.model;
        } else {
            this.getFileName(this.model);
            this.fid = this.model
        }
    }
}

</script>
