<template>
    <div class="app-container">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="图片">
                <el-col>
                    <my-upload functionName="upload" :model.sync="form.img" type='img'></my-upload>
                    <span>建议上传N*N尺寸的图片</span>
                </el-col>
                
            </el-form-item>

            <el-form-item label="类型" prop="type">
                <el-radio v-model="form.type" label="1">跳转小程序</el-radio>
                <el-radio v-model="form.type" label="2">跳转内部页面</el-radio>
            </el-form-item>

            <el-form-item class="form-item" label="APPID" prop="appId" v-show="form.type == 1">
                <el-col>
                    <el-input v-model="form.appId" placeholder="请填写跳转的小程序APPID"></el-input>
                </el-col>
            </el-form-item>   
            
            <el-form-item label="链接" prop="path">
                <el-input v-model="form.path" placeholder="请输入跳转路径"></el-input>
            </el-form-item>

            <el-form-item label="生效期">
                <el-date-picker v-model="effectiveDate" type="datetimerange" range-separator="至" start-placeholder="开始日期"end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                <div>*生效期过去，弹层自动下线。在生效期期内，每个用户可见1次弹层</div>
            </el-form-item>

            <el-form-item>
                <el-button type="success" style="width:180px;" @click="submitForm('form')">立即发布</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import MyUpload from "@/components/MyUpload";

export default {
    components:{
        MyUpload
    },
    data(){
        return{
            api:{
                add:'/notice/add',
                edit:'/notice/update'
            },
            form:{},    //表单数据
            effectiveDate:false,
            rules:{
                type:[{required: true, message: '跳转类型必选', trigger: 'blur'}],
                path:[{required: true, message: '跳转链接不能为空', trigger: 'blur'}],
            }
        }
    },
    methods:{
        // 日期限制
        // dateLimit(){
        //     if(new Date(this.effectiveDate[0]).getTime() < new Date().getTime()){
        //         this.$message('生效日期不能小于当前时间')
        //         this.effectiveDate = [];
        //     }
        // },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.publish()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 检验项重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        publish(){
            let data = this.form,url;

            // 数据处理
            data.startTime = this.effectiveDate[0];
            data.endTime = this.effectiveDate[1];
            
            if(this.type === 'add'){
                delete data.id;
                url = this.api.add;
            }else{
                url = this.api.edit
            }

            this.$http.post({
                isJson:true,
                url:url,
                params:data,
                success: res=>{
                    if(res.code == 0){
                        this.$message({
                            message:'首页弹层配置成功',
                            type:'success'
                        })
                        this.$router.go(-1);
                        this.reset();
                    }else{
                        this.$message({
                            message:res.msg,
                            type:'error'
                        })
                    }
                }
            })
            
        },
        // 重置清零
        reset(){
            this.form = {
                img:'',
                type:'',
                appId:'',
                path:''
            }
            this.effectiveDate = [];
        }
    },
    activated(){
        this.reset();  
        const query = this.$router.currentRoute.query;
        this.type = query.type; // 跳转类型
        if(this.type === 'edit'){
            this.form = JSON.parse(query.form);
            this.form.type = String(this.form.type)
            // this.form.effectiveDate = [this.form.startTime,this.form.endTime];
            this.effectiveDate = [this.form.startTime,this.form.endTime];
            console.log(this.effectiveDate)
        }
        
    }
    
}
</script>
<style scoped>
    .app-container{
        color: #999;
        font-size: 14px;
    }
</style>
