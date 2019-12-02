<template>
    <div class="app-container">
        <el-form :model="formLabelAlign" label-width="100px" class="demo-ruleForm">
            <el-form-item label="消息内容">
                <el-input v-model="formLabelAlign.content" placeholder="输入消息文本" clearable></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
                <el-input v-model="formLabelAlign.link" placeholder="跳转URL" clearable></el-input>
            </el-form-item>
            <el-form-item label="定时发布">
                <el-date-picker v-model="formLabelAlign.createTime" type="datetime" clearable placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <el-form-item label="用户ID">
                <el-input v-model="formLabelAlign.userId" placeholder="若无用户ID,则推送给全部用户" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="postNews">定时推送</el-button>
            </el-form-item>
        </el-form>
            
    </div>
</template>
<script>
export default{
    data(){
        return{
            formLabelAlign:{},
        }
    },
    activated() {
        this.formLabelAlign={}
        const query = this.$router.currentRoute.query;
        this.isShow = query.isShow
        if(!query.isShow){
            this.formLabelAlign = query.formLabelAlign
        }
        
        console.log(this.formLabelAlign)
        

    },
    methods:{
        // 定时推送
        postNews(){
            let data=this.formLabelAlign,url,message;
            if(data.content && data.createTime){
                if(this.isShow){
                    data.type = 1;            //type 0:模板消息，1:站内消息
                    url = '/message/sendSystemMessage';
                    message = '添加成功'
                }else{
                    url = '/message/udpateMessagePush';
                    message = '更新成功'
                }

                this.$http.post({
                    isJson:true,
                    url:url,
                    params:data,
                    success:res=>{
                        this.$message({
                            message:message,
                            type:'success'
                        })
                        this.$router.go(-1)
                    }
                })
            }else{
                this.$message({
                    message:'消息文本及发布时间不允许为空',
                    type:'warning'
                })
            }
        },
    }
}
</script>

