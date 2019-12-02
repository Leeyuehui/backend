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

        <el-form ref="form" :rules="rules" label-position="left" :model="editInfo" label-width="140px">
            <el-col :span="24">
                <el-form-item class="form-item form-item-noMargin" >
                    <el-col :span="10">
                        <p><span class="res-star">*</span>图片上传：</p>
                        <div class="desc">
                            <p>1.注意:图片仅支持jpg、 jpge、 png格式</p>
                            <p>2.最佳尺寸提示:<br>
                                <span>请上传为300*300尺寸的图片</span><br>
                                <!-- <span>卡片样式：690*400px</span><br>
                                <span>壁纸样式：640*200px</span> -->
                            </p>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <el-card class="box-card card">
                            <div slot="header" class="clearfix card-head">
                                <span>图片上传</span>
                                <i class="el-icon-view" style="float: right;"></i>
                            </div>
                            <div class="img-preview">
                                <my-upload functionName="upload" :uploadUrls="upload" :model.sync="editInfo.image" type='img'></my-upload>
                            </div>
                        </el-card>
                    </el-col>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item class="form-item" label="圈名称" prop="name">
                    <el-col>    
                        <el-input v-model="editInfo.name" placeholder="最多14个字" maxlength="14">  <!-- adIndex -->
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item class="form-item" label="圈简介" prop="description" >
                    <el-col>
                        <el-input type="textarea" v-model="editInfo.description" maxlength="200" placeholder="最多200个字"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item class="form-item" label="色值" prop="description" >
                    <el-col>
                        <el-color-picker v-model="editInfo.bgColor"></el-color-picker>
                    </el-col>
                </el-form-item>
                
            </el-col>
            <el-col :span="4" style="height:10px"></el-col>
            
           <!--  <el-col :span="4" style="height:100px"></el-col>
            <el-col :span="8">
                <el-form-item class="form-item form-item-noMargin">
                    <el-col>
                        <p>资源预览：</p>
                            <Preview :previewInfo="editInfo"></Preview>
                        </el-card>
                    </el-col>
                </el-form-item>
            </el-col> -->
            <el-col :span="24">
                <el-form-item class="form-item form-item-noMargin" align="center">
                        <!-- <el-button class="bottomBtn" type="success" @click="onPreview">预览</el-button> -->
                    <el-button class="bottomBtn" type="success" @click="onSubmit" :disabled.sync="submitDisable">发布</el-button>
                </el-form-item>
            </el-col>
           
        </el-form>
        
    </el-main>
    
    
</el-container>

</template>

<script>

import MyUpload from "@/components/MyUpload";
// import Preview from "@/components/Preview";
import {
    hasNullProp
}
from '@/utils/objectUtil'
export default {
    components: {
        MyUpload,
        // Preview
    },
    data() {
        return {
            baseUrl: BASE_URL,
            checkUrl:'/queryCardAdDetail',//查重
            cardTotalUrl:'/queryCardList',
            editInfo: {
                id: '',
                image: '',
                name: '',
                description: '',
                bgColor:'', //色值
            },
            editType: '',
            editId: '',
            url: null,
            // content:"",
            // editorOption: {},
            inputArr: [],
            value1: true,
            value2: true,
            cardTotal:0,//卡片总数
            changeAdIndex:false,//记录adindex是否被更改
            rules: {
              adIndex: [
                { required: true, message: '请填写资源位置', trigger: 'blur', placeholder:'请填写图片文本'}
              ],
              cardUrl: [
                { required: true, message: '请选择语录卡片', trigger: '' }
              ],
              miniCardUrl: [
                { required: true, message: '请选择缩略图', trigger: '' }
              ],
              showTime: [
                { required: true, message: '请选择发布时间', trigger: 'blur' },
              ],
              path: [
                { required: true, message: '请填写跳转的链接url', trigger: 'blur' },
              ],
              title: [
                { required: true, message: '请输入文案', trigger: 'blur' },
              ],
              appId: [
                { required: true, message: '请填写跳转的小程序的APPID', trigger: 'blur' }
              ],
              date1: [
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
              ],
              date2: [
                { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
              ],
              type: [
                { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
              ],
            },
            submitDisable:false,
            
        }
    },
    created(){
        var that=this;
        this.upload='/upload?token='+this.$store.state.user.token;
    },
    methods: {
        onSubmit() {
            var that = this;
            var url = '';
            var dataList = this.editInfo;
            var message,txt,isOver=false;//是否超出弹出超出 50 或 卡片数提示
            if (this.editType == 'add') {
                url = '/group/add';
                delete dataList.id
            } else if (this.editType == 'draftEdit') {
                url = '/group/update';
            } else {
                url = '/group/update';
            }

            console.log(dataList)
            if(dataList.id){
                message = "是否确认更新该圈资料";
                txt="确认更新";
            }else{
                message = "是否确认添加该圈";
                txt="确认添加"
            }
            if (hasNullProp(dataList)) {
                this.$confirm(message, '提示', {
                confirmButtonText: txt,
                cancelButtonText: '取消',
            }).then(() => {
                if(url != ''){
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
                                duration: 2000
                            });
                            that.submitDisable = false;
                        }
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });

            } else {
                this.$message.error('信息填写不完整！');
            }


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
        onPreview(){
            this.previewInfo=this.editInfo
        },
        newType(){
            this.inputArr = [];
        },
        adSourceIdTrans(row, column, cellValue){
            switch(cellValue){
                case 0:
                    return 0;
                    break;
                case 1:
                    return 1;
                    break;
                case null:
                    return '无';
                    break;
                default:
                    return 0;

            }
        },
    },
    activated() {
        console.log(this.editInfo)
        this.editType = this.$router.currentRoute.query.type;
        this.editId = this.$router.currentRoute.query.id;
        let query = this.$router.currentRoute.query
        if (this.editType == 'edit' || this.editType == 'draftEdit') {
            // this.getChooseItem();
            this.editInfo={
                id: query.id,
                image: query.image,
                name: query.name,
                description: query.description,
                bgColor:query.bgColor
            }
        }
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