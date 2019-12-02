<template>
    <div class="app-container">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"  >
            <el-form-item label="资源位图片" prop="cover">
                <el-col :span="4">
                    <my-upload functionName="user" :model.sync="ruleForm.cover" type="img"></my-upload>
                </el-col>
                <el-col :pull="1" :span="11"><span>建议上传300*300尺寸的图片</span></el-col>
            </el-form-item>
            <el-form-item label="话题ID" prop="topicId">
                <el-col :span="5">
                    <el-input v-model="ruleForm.topicId"></el-input>
                </el-col>
                <el-col :span="10">
                    <span>*点击后跳到该话题主页</span>
                </el-col>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-col :span="8">
                    <el-input v-model="ruleForm.title"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="简介1" prop="description">
                <el-col :span="8">
                    <el-input v-model="ruleForm.description"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="简介2" prop="subDescription">
                <el-col :span="8">
                    <el-input v-model="ruleForm.subDescription"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="角标" prop="name">
                <el-button type="text" class="corner" @click="openCorner">添加角标</el-button>
                <div v-if="ruleForm.tagList" class="box"> 
                    <div v-for="item in ruleForm.tagList" class="tagList">
                        <el-button style="background:#A4C828;" v-if="item.rgb == '#A4C828'" class="tagList1">{{item.name}}</el-button>
                        <el-button style="background:#FF527F;" v-if="item.rgb == '#FF527F'" class="tagList1">{{item.name}}</el-button>
                        <el-button style="background:#FFAE00;" v-if="item.rgb == '#FFAE00'" class="tagList1">{{item.name}}</el-button>
                        <span class="close" @click="close(item)">x</span> 
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="发布时间" prop="publishTime">
                <el-col :span="8">
                    <el-date-picker v-model="ruleForm.publishTime" type="datetime" placeholder="选择发布日期" value-format="yyyy-MM-dd HH:mm:ss" align="right"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="下架时间" prop="offlineTime">
                <el-col :span="8">
                    <el-date-picker v-model="ruleForm.offlineTime" type="datetime" placeholder="选择发布日期" value-format="yyyy-MM-dd HH:mm:ss" align="right"></el-date-picker>
                </el-col>
            </el-form-item>

            <el-button type="primary" @click="publish(1)" class="next" >定时发布</el-button>
            <el-button type="success" @click="publish(2)" class="next" >立即发布</el-button>
        </el-form>

        <!-- 角标对话框 -->
        <el-dialog title="提示" :visible.sync="corner" width="30%">
            <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="请输入角标文案" prop="name">
                    <el-input v-model="cornerName" placeholder="最多六个字" maxlength="6"></el-input>
                </el-form-item>
                <el-form-item label="请选择角标颜色" prop="color">
                    <el-button style="background:#A4C828;" :icon="color == 1 ? 'el-icon-check': ''"  @click="selectColor(1)"></el-button>
                    <el-button style="background:#FF527F;"  :icon="color == 2 ? 'el-icon-check': ''"  @click="selectColor(2)"></el-button>
                    <el-button style="background:#FFAE00;" :icon="color == 3 ? 'el-icon-check': ''"  @click="selectColor(3)"></el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getCorner">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import MyUpload from "@/components/MyUpload";
export default {
    components: {
        MyUpload
    },
    data(){
        return{
            ruleForm:{
                tagList:[],   //角标数据
                subDescription:'',  //简介2
            },
            rules:{
                // cover:[{ required: true, message: '资源位图片不能为空', trigger: 'blur' }],
                topicId:[{required: true,message: '话题ID不能为空', trigger: 'blur'}],
                // title:[{required: true, message: '标题不能为空', trigger: 'blur'}],
                // description:[{required: true, message: '简介1不能为空', trigger: 'blur'}],
                // publishTime:[{required: true, message: '资源位图片不能为空', trigger: 'blur'}],
            },
            corner:false,    //角标对话框隐藏
            color:false,    //选择角标显示状态
            cornerName:'',  //角标文案
            type:'',        //判断跳转类型
            
        }
    },
    activated(){
        this.ruleForm = {
            tagList: []
        };
        // this.ruleForm.tagList = [];
        const query = this.$router.currentRoute.query;
        this.type = query.type;
        
        if(query.list){
            this.ruleForm = JSON.parse(query.list)
            // this.ruleForm = {
            //     cover:query.cover,
            //     topicId:query.topicId,
            //     publishTime:query.publishTime,
            //     subDescription:query.subDescription,
            //     description:query.description,
            //     tagList:query.tagList,
            //     title:query.title
            // }
            // console.log(this.ruleForm)
        }
    },
    methods:{
        // 删除角标
        close(corner){
            let tagList = this.ruleForm.tagList
            tagList.forEach( (value,key)=>{
                if(value.name == corner.name && value.color == corner.color){
                    this.ruleForm.tagList.splice(key,1)
                }
            })
            console.log('this.ruleForm.tagList:',this.ruleForm.tagList)    
        },
        // 发布
        publish(value){
            let data
            if(value === 1){    //定时发布
                if(!this.ruleForm.publishTime){
                    this.$message({
                        message:'发布日期不能为空',
                        type:'warning'
                    })
                    return
                }
                data = this.ruleForm
            }else{
                delete this.ruleForm.publishTime;
                data = this.ruleForm
            }

            data.offlineTime = data.offlineTime == null ? '' : data.offlineTime;

            // console.log('data:',data)
            let url = this.type === 'add' ? '/topicIndex/add' : '/topicIndex/update';

            this.$http.post({
                isJson:true,
                url:url,
                params:data,
                success:res=>{
                    if(res.code === 0){
                        this.$message({
                            message:'发布成功',
                            type:'success'
                        })
                        this.$router.go(-1)
                    }else{
                        this.$message({
                            message:'请确认数据无误后再进行操作',
                            type:'warning'
                        })
                    }
                    
                }
            })
        },
        //选择角标
        openCorner(){
            this.corner = true;
        },
        // 选择角标颜色
        selectColor(num){
            this.color = num;
        },
        // 拿到角标数据
        getCorner(){
            if(!this.cornerName){
                this.$message({
                    message:'角标文案不能为空',
                    type:'warning'
                })
                return
            }
            
            if(this.color === 1){
                this.ruleForm.tagList.push({
                    rgb:'#A4C828',
                    name:this.cornerName
                })
            }else if(this.color === 2){
                this.ruleForm.tagList.push({
                    rgb:'#FF527F',
                    name:this.cornerName
                })
            }else if(this.color === 3){
                this.ruleForm.tagList.push({
                    rgb:'#FFAE00',
                    name:this.cornerName
                })
            }
            
            // console.log(this.ruleForm)
            this.color = false;
            this.cornerName = '';
            this.corner = false;
        }

    }
}
</script>
<style scoped>
    .corner{
        text-decoration: underline;
    }
    .box::after{
        content:'';
        height: 0;
        clear: both;
        visibility: hidden;
        overflow: hidden;
    }
    .tagList{
        float: left;
        margin-right: 15px;
        margin-bottom: 15px;
        position: relative;
    }   
    .tagList1{
        color: #fff;
    }
    .close{
        display: block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        border-radius:50%;
        text-align: center; 
        color: #fff;
        font-size: 12px;
        z-index: 9999;
        background: rgba(0, 0, 0, .4);
        position: absolute;
        right: -4px;
        top: -4px;
        z-index: 1;
    }
</style>

