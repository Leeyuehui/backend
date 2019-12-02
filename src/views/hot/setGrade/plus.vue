<template>
<div class="app-container">

    <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="">
            <el-input v-model="formInline.topicId" placeholder="查询帖子ID"></el-input>
        </el-form-item>            
        <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        
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
            <el-table-column prop="currentScore" label="排序分"></el-table-column>
            <!-- <el-table-column label="操作" align="center" width="150">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="handleEdit">设排序分</el-button>
                    </el-button-group>
                </div>
            </el-table-column>  -->
        </el-table>

        <div class="marginTop" v-if="tableData" >
            <el-form-item label="排序分参考分值："  class="marginTop">
                <span class="margin-right">圈子top1分值：{{tableData[0].groupTop1}}</span>                
                <span class="margin-right">圈子top50分值：{{tableData[0].groupTop50}}</span>
                <span class="margin-right">话题top1分值：{{tableData[0].topicTop1}}</span>
                <span class="margin-right">话题top50分值：{{tableData[0].topicTop50}}</span>
            </el-form-item>

            <div>
                <el-form-item>
                    <el-input type="number" v-model="grade" placeholder="请设置帖子排序分数"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="setGrade" >确定改分</el-button>
                </el-form-item>
            </div>   
        </div>
        
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
                isShow:false,
                grade:'',
                postId:'',
            }
        },
        activated(){
            // console.log('query',this.$router.currentRoute.query)
            this.formInline.topicId="";
            this.formInline.topicId = this.$router.currentRoute.query.postId;
            const type = this.$router.currentRoute.query.type;
            if(this.formInline.topicId && type !== 'add'){
                this.search()
            }else{
                this.tableData = false
            }
        },
        methods:{
            handleEdit(){
                this.isShow=true;
            },

            setGrade(){
                console.log(typeof this.grade)
                if(this.grade){
                    let data = {
                        score:this.grade,
                        postId:this.formInline.topicId
                    }

                //    let url = this.formInline.topicId ? '/savePostScore' : '/updatePostScore'
                    let url = '/savePostScore';
                    // let isJson = this.formInline.topicId ? true : false;
                    // console.log('postId',this.postId)
                    this.$http.post({
                        isJson:true,
                        url:url,
                        params:data,
                        success:res=>{
                            // console.log('1111111',res)
                            if(res.code == 0){
                                this.$message({
                                    message:'改分成功',
                                    type:'success'
                                })
                                setTimeout(()=>{
                                    this.$router.push({
                                        path:'/hot/setGrade'
                                    })
                                },800)
                            }else{
                                this.$message({
                                    message:res.msg,
                                    type:'warning'
                                })
                            }
                        }
                    })
                }
            },

            search(){
                console.log(this.formInline.topicId)
                let postId=this.formInline.topicId
                
                if(postId == "" && !postId){
                    this.$message('输入不允许为空の')
                }else{
                    let data={
                        postId:postId,
                    }
                    // console.log(url);
                    this.$http.post({
                        isJson:false,
                        url:'/queryPostScoreDetail',
                        params:data, 
                        success:res=>{
                            console.log(res)
                            if(res.code == 0){
                                this.tableData=[]
                                this.tableData.push(res.data)  
                                // console.log('嘤嘤嘤',this.tableData)                          
                            }else{
                                this.$message('抱歉暂无数据')
                                this.tableData = false
                            }
                        }
                    })
                }
                
            },

            

        }
    }

</script>
<style  scoped>
    .toTop{
        margin-left: 50px;
    }
    .marginTop{
        margin-top: 10px;
    }
    .margin-right{
        margin-right: 20px;
        color: #606266;
    }

</style>
