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
.active{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
    transform: translate(-8px,30px);
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
                <el-form-item class="form-item" label="banner位置" prop="indexs">
                    <el-col>    
                        <el-input type="number" v-model="editInfo.indexs" :min="1" :max="3" placeholder="请填写资源位置"></el-input>  <!-- adIndex -->
                    </el-col>     
                </el-form-item>

                <el-form-item class="form-item" label="链接" prop=" ">
                    <el-col>
                        <el-radio v-model="editInfo.pathType" label="1">小程序链接</el-radio>
                        <el-radio v-model="editInfo.pathType" label="2">公众号链接</el-radio>
                    </el-col>
                </el-form-item>

                <el-form-item class="form-item" label="APPID" prop="appId" v-show="editInfo.pathType == 1">
                    <el-col>
                        <el-input v-model="editInfo.appId" placeholder="请填写跳转的小程序APPID"></el-input>
                    </el-col>
                </el-form-item>

                <el-form-item class="form-item" label="跳转链接" prop="path">
                    <el-col>
                        <el-input v-model="editInfo.path" placeholder="请填写跳转的页面URL"></el-input>
                    </el-col>
                </el-form-item>    
                <el-form-item class="form-item" label="上架时间" prop="startTime">
                    <el-col>
                        <el-date-picker v-model="editInfo.startTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item class="form-item" label="下架时间" prop="endTime">
                    <el-col>
                        <el-date-picker v-model="editInfo.endTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-col>
                </el-form-item>            
            </el-col>

            <el-col :span="24">
                <el-form-item class="form-item form-item-noMargin" >
                    <el-col :span="10">
                        <p><span class="res-star">*</span>图片上传：</p>
                        <div class="desc">
                            <p>1.注意:图片仅支持jpg、 jpge、 png格式</p>
                            <p>2.最佳尺寸提示:<br>
                                <span>{{txtHint}}</span><br>
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
                                <my-upload functionName="upload" :uploadUrls="upload" :model.sync="editInfo.url" type='img'></my-upload>
                            </div>
                        </el-card>
                    </el-col>
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <!-- <el-form-item class="form-item form-item-noMargin" align="center" v-if="editType=='add'">
                    <el-button size="medium" type="primary" @click="onSubmit(1)">定时发布</el-button>
                    <el-button size="medium" type="success" @click="onSubmit" >立即发布</el-button>
                </el-form-item>
                <el-form-item class="form-item form-item-noMargin" align="center" v-else>
                    <el-button size="medium" type="primary" @click="onSubmit(1)" v-if="editInfo.status != 1">定时发布</el-button>  
                    <el-button size="medium" type="success" @click="onSubmit">立即发布</el-button>  
                </el-form-item> -->

                <el-form-item class="form-item form-item-noMargin" align="center"> 
                    <el-button size="medium" type="success" @click="onSubmit">发布</el-button>  
                </el-form-item>
            </el-col>
           
        </el-form>
        
        <!-- 文本详情 -->
        <!-- <el-dialog title="请选择发布日期" :visible.sync="textShow" width="800px">
            <el-date-picker v-model="textContent" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <el-button size="medium" type="primary" @click="onSubmit(1)" style="margin-left:15px;">发布</el-button>
        </el-dialog> -->
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
                indexs:'',
                appId:'',
                path:'',
                url:'',
                pathType:'1',  //跳转链接
                groupId:0,
                endTime:'',
                startTime:'',
            },
            editType: '',
            url: null,
            // content:"",
            // editorOption: {},
            inputArr: [],
            value1: true,
            value2: true,
            cardTotal:0,//卡片总数
            changeAdIndex:false,//记录adindex是否被更改
            rules: {
              path: [{ required: true, message: '请填写跳转的链接url', trigger: 'blur' }],
              startTime: [{ required: true, message: '上架时间不能为空', trigger: 'blur' }],
              indexs: [{ required: true, message: 'banner位置必填', trigger: 'blur' }],
            },
            total:0,  //bannerlist   总长度
            txtHint:'请上传1080*460px的图片',
        }
    },
    created(){
        var that=this;
        this.upload='/upload?token='+this.$store.state.user.token;
        console.log('222',this.upload)
    },
    methods: {
        // timePublish(){
        //     this.textShow = true;
        // },

        async onSubmit(num) {
            var that = this;
            var url = '';
            var dataList = this.editInfo;
            
            if(!dataList.indexs){
                this.$message('banner位置不允许为空')
                return
            }else if(!dataList.path){
                this.$message('跳转链接不允许为空')
                return
            }else if(!dataList.url){
                this.$message('图片不允许为空')
                return
            }else if(!dataList.startTime){
                this.$message('上架时间不允许为空')
                return
            }else if(dataList.endTime == null){
                dataList.endTime = ''
            }else if(new Date(dataList.startTime).getTime() > new Date(dataList.endTime).getTime()){
                this.$message('下架时间不能小于上架时间')
                return
            }

            let judge = await this.checkout();
            if(judge !== "confirm"){
                return      
            }
            
            // if(num == 1){
            //     if(this.textContent){
            //         dataList.createTime = this.textContent;
            //         dataList.pushType = 1;      //pushType 1:定时发布 2：立即发布
            //     }else{
            //         this.$message({
            //             message:'选择定时发布则日期不允许为空',
            //             type:'warning'
            //         })
            //         return
            //     } 
            // }else{
            //     dataList.pushType = 2;      //pushType 1:定时发布 2：立即发布
            // }

            var message,isOver=false;//是否超出弹出超出 50 或 卡片数提示
            if (this.editType == 'add') {
                url = '/banner/add';
                delete dataList.id
            } else {
                url = '/banner/update';
            }
            console.log('dataList:',dataList)
            if (hasNullProp(dataList)) {
                if(dataList.indexs > 50 && dataList.groupId != 0){
                    message='请填写资源位置，1-50';
                    isOver=true;
                }else if(dataList.indexs > 5 && dataList.groupId == 0){
                    message='请填写资源位置，1-5';
                    isOver=true;
                }
                
                if(isOver){                    
                    that.$message({
                        message: message,
                        type: 'warning',
                        onClose: () => {
                            // that.$router.go(-1);
                        },
                        duration: 2000
                    }); 
                    return ;
                }


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
                    }
                });

            } else {
                this.$message.error('信息填写不完整！');
            }


        },

        // 校验banner位置
        checkout(){
            return new Promise((resolve, reject) => {
                let data ={
                    indexs: this.editInfo.indexs,
                    groupId:this.editInfo.groupId
                }
                this.$http.post({
                    isJson:false,
                    url:'/banner/checkBannerIndexs',
                    params:data,
                    success: res=>{
                        if(res.code != 0){
                            this.$confirm(res.msg, '提示', {
                                confirmButtonText: '确认替换',
                                cancelButtonText: '取消替换',
                                type: 'warning'
                            }).then((res) => { 
                                resolve(res)        
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消操作'
                                });   
                            });
                        }else{
                            const confirm = 'confirm'
                            resolve(confirm)
                        } 
                    },
                })
            })
        },
        
    },
    activated() {
        // 数据清零
        this.editInfo={
            indexs:'',
            appId:'',
            path:'',
            url:'',
            pathType:'1',  //跳转链接
            // status:0,
            groupId:0,
            startTime:'',
            endTime:''
        },

        this.editType = this.$router.currentRoute.query.type;
        let query = this.$router.currentRoute.query

        console.log('----------------------',this.editInfo,query)

        if (this.editType == 'edit') {
            
            this.editInfo={
                id: query.id,
                indexs: query.indexs,
                path: query.path,
                url: query.url,
                appId: query.appId,
                groupId: query.groupId,
                pathType:query.pathType,
                startTime:query.startTime,
                endTime:query.endTime
                // pushStatus:query.pushStatus,
                // status:query.status,
            }
        }else if(this.editType == 'add'){
            this.editInfo={}
            this.editInfo.groupId = query.groupId
        }

        if(this.editInfo.groupId != 0){
            this.txtHint='圈内banner宽度铺满屏幕，高度自适应'
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