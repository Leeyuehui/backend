<template>
    <div class="app-container">
        <el-form :model="formLabelAlign" label-width="100px" class="demo-ruleForm">
            <el-form-item v-if="type == 0" label="消息内容">
                <el-input v-model="formLabelAlign.content" placeholder="输入消息文本" clearable></el-input>
            </el-form-item>
            <el-form-item v-if="type == 2" label="备注">
                <el-input v-model="formLabelAlign.content" placeholder="输入备注" clearable></el-input>
            </el-form-item>
            <el-form-item v-if="type == 2" label="温馨提示">
                <el-input v-model="formLabelAlign.kindlyReminder" placeholder="输入温馨提示" clearable></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
                <el-input v-model="formLabelAlign.link" placeholder="跳转URL" clearable></el-input>
            </el-form-item>
            <el-form-item label="定时发布">
                <el-date-picker v-model="formLabelAlign.createTime" type="datetime" clearable placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
            isShow:'',
            type:'',
        }
    },
    activated() {
        this.formLabelAlign={}
        const query = this.$router.currentRoute.query;
        this.isShow = query.isShow
        this.type = query.type
        if(!query.isShow){
            this.formLabelAlign = query.formLabelAlign
        }
        console.log(this.formLabelAlign)
    },
    methods:{
        // 定时推送
        postNews(){
            var that = this;
            let data=that.formLabelAlign,url,message;
            if(data.content && data.createTime){
                if(this.isShow){
                    data.type = that.type;            //type 0：模板消息 1：系统消息 2: 新活动模板消息
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
                        let path = that.type == 2 ? '/activeMessage' : '/ytMessage';
                        this.$router.push({
                            path:path,
                        })
                    }
                })
            }else{
                var tips = '';
                if(this.type == 0){
                    tips = '消息文本及发布时间不允许为空';
                }else if(this.type == 2){
                    tips = '备注及发布时间不允许为空';
                }
                this.$message({
                    message:tips,
                    type:'warning'
                })
            }
        },
    }
}
</script>

