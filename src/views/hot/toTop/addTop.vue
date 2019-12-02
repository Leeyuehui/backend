<template>
<div class="app-container">

    <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="">
            <el-input v-model="formInline.topicId" placeholder="查询帖子ID"></el-input>
        </el-form-item>            
        <el-button type="primary" @click="search">查询</el-button>
        
        <el-table :data="tableData" v-if="tableData" style="width: 100%">
            <el-table-column prop="id" label="ID"></el-table-column>
            <!-- <el-table-column prop="name" label="状态" ></el-table-column> -->
            <el-table-column prop="content" label="文本"></el-table-column>
            <el-table-column prop="userName" label="用户" align="center">
                <template slot-scope="scope">
                    <router-link :to="{name:'userManage',query:{userId:scope.row.userId,userType:scope.row.source == 0 ? 0 : 1}}"><div style="color:#87C3E6;">{{scope.row.userName}}</div></router-link>
                </template>
            </el-table-column>
            <el-table-column prop="groupName" label="圈子来源"></el-table-column>
            <el-table-column prop="topicName" label="话题来源"></el-table-column>
        </el-table>

        <el-form-item label="" v-if="this.tableData" class="marginTop">
            <el-checkbox label="圈子主页" v-model="formInline.group"></el-checkbox>
            <el-checkbox label="话题主页" v-model="formInline.topic"></el-checkbox>

            <el-select class="toTop" v-model="indexs">
                <el-option v-for="item in formInline.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>

            
            <span class="toTop">每人可见次数</span>
            <el-input type="number" placeholder="请输入次数" v-model="seeNum"  clearable></el-input>
            

            <el-button type="success" @click="isSure" class="toTop">确定置顶</el-button>
        </el-form-item> 
    </el-form>

        

    
    
    
</div>
</template>
<script>
    export default {
        data(){
            return{
                formInline:{
                    topicId:"",
                    region:2,
                    group:true,
                    topic:false,
                    options: [{
                        value: 1,
                        label: '置顶在第一位'
                        }, {
                        value: 2,
                        label: '置顶在第二位'
                        }, {
                        value: 3,
                        label: '置顶在第三位'
                    }],
                },        
                tableData: false,
                indexs:1, //置顶位置
                postId:'',
                seeNum:'',
            }
        },
        activated(){
            this.indexs = 1;
            this.seeNum = ""
            this.formInline.topicId = ""
            this.formInline.topicId = this.$router.currentRoute.query.postId;
            
            const type = this.$router.currentRoute.query.type
            if(this.formInline.topicId && type !== 'add'){
                this.search()
            }else{
                this.tableData = false;
            }
            
        },
        methods:{

            search(){
                console.log(this.formInline.topicId)
                let postId=this.formInline.topicId
                
                if(postId == "" && !postId){
                    this.$message('输入不允许为空の')
                }else{
                    var data={
                        postId:postId,
                    }
                    this.$http.post({
                        isJson:false,
                        url:`/queryPostScoreDetail`,
                        params:data,
                        success: res=>{
                            console.log(res)
                            if(res.code == 0){
                                this.tableData=[]
                                this.tableData.push(res.data)  
                                // console.log('嘤嘤嘤',this.tableData)                      
                            }else{
                                this.$message({
                                    message:res.msg,
                                    type:'warning'
                                })
                                this.tableData = false
                            }
                        }
                    })
                }

                
                
            },

            // 确定置顶
            isSure(){
                if(this.seeNum == ''){
                    this.$message({
                        message:'每人可见次数不允许为空',
                        type:'warning'
                    })
                    return;
                }
                console.log('qqqqq',this.indexs)
                let topic=this.formInline
                let data={
                    postId: topic.topicId,
                    indexs:this.indexs,
                    inTopicType: topic.topic ? 1 : 0,
                    inGroupType: topic.group ? 1 : 0,
                    visibleNumber:this.seeNum
                }
                let url = '/checkSomeIndexsStick';
                let saveUrl = '/savePostStick';
                this.$http.post( url, data, res=>{
                    console.log('11111',res)
                    if(res.code == 0){
                        let msg = '是否置顶'
                        this.open4(saveUrl,data,msg)
                    }
                    if(res.code == 200){
                        let msg =`${res.msg},是否强制替换`
                        this.open4(saveUrl,data,msg)
                    }
                },err=>{
                    console.log('2222',res)
                })
            },

            open4(url,data,msg) {
                const h = this.$createElement;
                this.$msgbox({
                    title: '消息',
                    message: h('p', null, [h('span', null, msg)]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        done();
                        if (action === 'confirm') {
                            this.$http.post(url, data , res=>{
                                console.log('999999999',res)
                                if(res.code == 0){
                                    this.$message({
                                        message:'置顶成功',
                                        type:'success'
                                    })
                                    var timer=setTimeout(()=>{
                                        this.$router.push({
                                            path:'/hot/toTop'
                                        })
                                        clearTimeout(timer)
                                    },1000)
                                }
                            },err=>{
                                console.log('9999998',err)
                            })   
                        } else {
                            done();
                        }
                    }
                })
            }

        }
    }

</script>
<style  scoped>
    .app-container{
        color: #999;
    }
    .toTop{
        margin-left: 50px;
    }
    .marginTop{
        margin-top: 50px;
    }
    .margin-right{
        margin-right: 20px;
        color: #606266;
    }
    .el-input{
        width: 200px;
    }
</style>
