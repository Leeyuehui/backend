<template>
<div class="app-container">
    <el-form :inline="true"  class="demo-form-inline">
        <div style="margin:10px 0;">
            <el-button type="primary" @click="recommend">推荐</el-button>
            <el-button type="danger" @click="notRecommend">不推荐</el-button>
        </div>
        
        <el-table v-loading="loading" element-loading-text="正在加载中" :data="tableData" :border="true" v-if="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="adminName" label="话题主" align="center" width="140px"></el-table-column>
            <el-table-column prop="postId" label="帖子ID" align="center" width="70px"></el-table-column>
            <el-table-column :prop="postStatus.field" :label="postStatus.label" :formatter="postStatus.formatter" align="center" width="100px"></el-table-column>
            
            <el-table-column align="center" prop="firstImg" label="缩略图" width="100px">
                <template slot-scope="scope">
                    <div v-if="scope.row.firstImg">
                        <img :src="scope.row.firstImg" class="header_pic" />
                        <span style="font-size:16px;">{{scope.row.remainImgCount == 0 ? '' : scope.row.remainImgCount}}</span>
                    </div>
                    <span v-else>无图</span>
                </template>
            </el-table-column>

            <el-table-column prop="postContent" label="文本" sortable='custom' align="center" width="250px">
                <template slot-scope="scope">
                    <el-button type="text" @click="text(scope.row)" style="color:#606266">{{scope.row.postContent}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="用户" align="center">
                <template slot-scope="scope">
                    <router-link :to="{name:'userManage',query:{userId:scope.row.userId,userType:scope.row.source == 0 ? 0 : 1}}"><div class="only">{{scope.row.userName}}</div></router-link>
                </template>
            </el-table-column>
            <el-table-column prop="groupName" label="圈子来源" align="center"></el-table-column>
            <el-table-column prop="topicName" label="话题来源" align="center"></el-table-column>
            <el-table-column prop="commentCount" label="评论" sortable='custom' align="center" width="65">
                <template slot-scope="scope">
                    <router-link :to="{name:'searchComment',query:{postId:scope.row.postId}}"><div style="color:#87C3E6;">{{scope.row.commentCount}}</div></router-link>
                </template>
            </el-table-column>
            <el-table-column prop="likeCount" label="抱抱" sortable='custom' align="center" width="65" ></el-table-column>
            <el-table-column prop="pv" label="浏览量" sortable='custom' align="center" width="70"></el-table-column>
            <el-table-column prop="createTime" label="发表时间" align="center" width="152"></el-table-column>
            <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="postDetail(scope.row)">详情</el-button>
                    </el-button-group>
                </template> 
            </el-table-column>
        </el-table>
        
        <!-- 文本详情 -->
        <el-dialog title="文本详情" :visible.sync="textShow" width="800px">
            <div>{{textContent}}</div>
        </el-dialog>

    </el-form>

    <el-row type="flex" class="table-foot">
    <el-col align="right">
        <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle"  :current-page="startPage" :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
    </el-col>
    </el-row>

    
</div>
</template>
<script>
export default {
    data(){
        return{
            loading:true,   //loading
            userId:"",    //用户id
            tableData: false,
            pageSize: 20, //每页大小
            startPage: 1, //当前页
            totalNum: 0, // 总数
            small: true, //小屏幕
            inputData:{       //表格传参数据
                pageSize:20,
                startPage:1,
            },
            groupId:'',           //圈子
            gambitId:'',          //话题
            postId:'',          //帖子id
            postContent:'',     //帖子文本内容
            publishTime:'',     //发表时间
            postStatus:{
                field: "deleteStatus",      //deleteStatus   0：未删除 1:管理员删除 2:用户删除
                label: "帖子状态",
                formatter:(row, column, cellValue)=>{   
                    switch (cellValue) {
                        case 0:
                            return '已发布';
                            break;
                        case 1:
                            return '管理员删除';
                            break;
                        default:
                            return '用户删除 '
                    }
                }
            },
            textShow:false,     //文本弹框
            textContent:false,  //文本弹框内容
            editInfo:[],  
            dataArr:[],//先存全部评论id，之后是审核通过id
            chooseItem:[],//选中的item   
        }
    },
    activated(){
        this.getData();
    },
    methods:{
        //推荐
        recommend(){
            for(let j = 0,len = this.chooseItem.length; j < len; j++) {
                let ind = this.dataArr.indexOf(this.chooseItem[j]);
                this.dataArr.splice(ind,1);
            }
            var params={
                "checkIds": this.chooseItem,
                "noCheckIds": this.dataArr,
                "topicAdminOperateType": 3
            }
            if(this.chooseItem.length > 0){
                this.$http.post({
                    isJson:true,
                    url:'/topicAdmin/auditPass',
                    params:params,
                    success: res=>{
                        if(res.code == 0){
                            this.$message({
                                message:'操作成功',
                                type:'success'
                            })
                            this.editInfo = []
                            this.activeId = false
                            this.getData()
                        }
                    }
                })
            }else{
                this.$message({
                    message:'请先选择一条帖子',
                    type:'warning'
                })
            }
        },
        //不推荐
        notRecommend(){
            for(let j = 0,len = this.chooseItem.length; j < len; j++) {
                let ind = this.dataArr.indexOf(this.chooseItem[j]);
                this.dataArr.splice(ind,1);
            }
            var params={
                "checkIds": this.chooseItem,
                "noCheckIds": this.dataArr,
                "topicAdminOperateType": 3
            }
            if(this.chooseItem.length > 0){
                this.$http.post({
                    isJson:true,
                    url:'/topicAdmin/auditNoPass',
                    params:params,
                    success: res=>{
                        if(res.code == 0){
                            this.$message({
                                message:'操作成功',
                                type:'success'
                            })
                            this.editInfo = []
                            this.activeId = false
                            this.getData()
                        }
                    }
                })
            }else{
                this.$message({
                    message:'请先选择一条帖子',
                    type:'warning'
                })
            }
        },
        //选中的item
        handleSelectionChange(val) {
            this.chooseItem = [];
            for(let j = 0,len = val.length; j < len; j++) {
                let commId = val[j].id;
                this.chooseItem.push(commId);
            }
        },
        // 文本弹框
        text(row){
            this.textShow = true;
            this.textContent = row.postContent;
        },
         // 帖子详情
        postDetail(row){
            this.$router.push({
                path:'/circle/postDetail',
                query:{postId:row.postId}
            })
        },
        
        refreshTable() {
            this.inputData.startPage = 1
            this.getData()
        },

        // 获取表格数据
        getData(){
            this.loading = true
            this.$http.post({
                isJson:true,
                url:'/topicAdmin/recommendPosts',
                params:this.inputData,
                success: res=>{
                    if(res.data.list){
                        let tableData = res.data.list;
                        this.tableData = tableData; 
                        this.totalNum = res.data.total
                        this.loading = false
                        //将所有的帖子id先存起来
                        this.dataArr = [];
                        for(let j = 0,len = tableData.length; j < len; j++) {
                            let commId = tableData[j].id;
                            this.dataArr.push(commId);
                        }
                    }else{
                        this.$message('抱歉暂无数据')
                        this.tableData = false;
                        this.loading = false
                    }
                }
            })
        },

        sizeChangeHandle(size) {
            //分页大小发生变化
            this.inputData.pageSize = size
            this.pageSize = size
            this.getData()
        },

        currentChangeHandle(currentPage) {
            //页数发生变化
            this.inputData.startPage = currentPage
            this.getData()
        },

        handleBan(row,num){
            if(num == 1){
                this.popover(row.id)
            }else{
                this.ban(row.id)
            }
        },

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
        margin-top: 10px;
    }
    .margin-right{
        margin-right: 20px;
        color: #606266;
    }
    .el-input{
        width: 200px;
    }
    .el-form-item{
        margin-right: 1px;
    }
    .only{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color:#87C3E6;
    }
    .el-button{
        white-space: pre-wrap
    }
    .reason{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #eee;
        text-align: center;
    }
    .sucIcon{
        font-size:16px;
        padding:3px;
    }
    .sureIcon{
        margin-top: 15px;
        margin-left: 30px;
    }
</style>
