<template>
    <div class="app-container">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm"  >
            <el-form-item label="帖子ID" prop="id">
                <el-col :span="8">
                    <el-input v-model="ruleForm.id"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="位置" prop="indexs">
                <el-col :span="8">
                    <el-input v-model="ruleForm.indexs"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="置顶时间" prop="startTime">
                <el-col :span="8">
                    <el-date-picker v-model="ruleForm.startTime" type="datetime" placeholder="选择发布日期" value-format="yyyy-MM-dd HH:mm:ss" align="right"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="取消置顶时间" prop="endTime">
                <el-col :span="8">
                    <el-date-picker v-model="ruleForm.endTime" type="datetime" placeholder="选择发布日期" value-format="yyyy-MM-dd HH:mm:ss" align="right"></el-date-picker>
                </el-col>
            </el-form-item>

            <el-button size="medium" type="success" @click="onSubmit('ruleForm')">发布</el-button>
        </el-form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            ruleForm:{
            },
            rules:{
                id:[{ required: true, message: '帖子ID不能为空', trigger: 'blur' }],
                indexs:[{required: true,message: '置顶位置不能为空', trigger: 'blur'}],
                startTime:[{required: true,message: '置顶位置不能为空', trigger: 'blur'}],
                endTime:[{required: true,message: '置顶位置不能为空', trigger: 'blur'}],
            },
            type:'' // 类型
        }
    },
    activated(){
        this.ruleForm = {}; //数据清零
        this.$refs['ruleForm'].resetFields();
        let query = this.$router.currentRoute.query;
        this.type = query.type;
        if(query.postDetail){
            this.ruleForm = JSON.parse(query.postDetail);
            console.log(this.ruleForm)
        }
    },
    methods:{
        async onSubmit(formName) {
            let isTrue = false;
            this.$refs[formName].validate(await function(valid){
                if (valid) {
                    isTrue = true;
                } else {
                    isTrue = false;
                }
            });

            if(!isTrue){
                this.$message({
                    message:'请确认数据无误后再进行操作',
                    type:'warning'
                })
                return
            }

            let dataList = this.ruleForm;
            // console.log(Number.isInteger(dataList.indexs),dataList)

            if(dataList.indexs > 3 || dataList.indexs < 1 || !Number.isInteger(Number(dataList.indexs))){
                this.$message({
                    message:'置顶位置应在1~3之间的整数选择',
                    type:'warning'
                })
                return
            }
            
            if(new Date(dataList.startTime).getTime() > new Date(dataList.endTime).getTime()){
                this.$message('下架时间不能小于上架时间')
                return
            }
            let url = this.type === 'add' ? '/postStickIndex/add' : '/postStickIndex/update';

            this.$http.post({
                isJson: true,
                url: url,
                params: dataList,
                success: res => {
                    if(res.code == 0){
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            onClose: () => {
                                this.$router.go(-1);
                            },
                            duration: 2000
                        });
                    }else{
                        this.$message({
                            message:res.msg,
                            type:'error'
                        })
                    }
                }
            });


        },
    }
}
</script>
