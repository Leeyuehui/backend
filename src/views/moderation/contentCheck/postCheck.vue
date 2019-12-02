<style scoped>

.grid_content{
    width: 100%;
    cursor: pointer;
    position: relative;
    display: inline-block;
    word-break: break-all;
    border-top: 1px solid #eee;
    background-color: #f9f9f9;
}
.show_content{
    width: 100%;
    padding: 4px;
    color: #000;
    padding-top: 12px;
    height: 260px;
    font-size: 12px;
    margin-top: 2px;
    margin-left: 2px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 8;
}
.show_all{
    top: 0px;
    left: 0px;
    width: 100%;
    /* padding: 5px; */
    z-index: 999;
    font-size: 12px;
    position: absolute;
    border-top: 1px solid #eee;
    background-color: #fff;
}

.check_item{
    background:rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 999;
}
.is_check{
    position: absolute;
    font-size: 80px;
    color: red;
    left: 90px;
    top: 20px;
}

.user_img{
    width: 50px;
    height: 50px;
    float: left;
    cursor: pointer;
}
.user_message{
    float: left;
    margin-top: 8px;
    margin-left: 6px;
    font-size: 12px;
    color: #999;
}
.user_name{
    cursor: pointer;
    margin-bottom: 6px;
    width: 260px;
    display: block;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
}
.comment_message{
    width: 260px;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
}
.comment_message span{
    display: inline-block;
}
.show_check_box{
    margin-top: 2px;
    margin-left: 2px;
    border: 1px solid #eee;
    background-color: #f9f9f9;
}
.show_artInfo{
    cursor: pointer;
    color: cornflowerblue;
}
.show-post-btn{
    cursor: pointer;
    color: #666;
    font-size: 12px;
    float: right;
    margin-top: 30px;
    margin-right: 10px;
}
.check-img{
    width: 100%;
}

</style>

<template>
    <div class="app-container">
        <el-row>
            <el-col align="right" :span="6" :push="18">
                <el-button-group>
                    <el-button type="primary" size="small" @click="submitAudit">提交审核[enter]</el-button>
                    <el-button type="danger" size="small" @click="exitAudit">退出审核</el-button>
                </el-button-group>
            </el-col>
        </el-row>

        <el-row :gutter="8" style="margin-top:20px;" v-if="!noList">
            <el-col :span="6" v-for="(item,index) in tableData" :key="item.id" >
                <div class="show_check_box">
                    <div>
                        <img class="user_img" :src="item.userHead" alt="" @click="goUserDetail(item.userId)">
                        <div class="user_message">
                            <div class="user_name" @click="goUserDetail(item.userId)">{{item.userName}}</div>
                            <div class="comment_message">
                                <span>{{item.createTime}}</span>
                                <span class="show_artInfo">ID:{{item.id}}</span>
                            </div>
                        </div>
                        <div class="show-post-btn" @click="showPostMore(item.postContents)">展开详情</div>
                    </div>
                    <div class="grid_content" @click="checkEdit(item.id,index,$event)" v-on:mouseenter="" v-on:mouseleave="isShowAll = -1">
                        <div class="show_content">
                            <div v-for="(postItem,index) in (item.postContents)" :key="postItem.id">
                                <span v-if="postItem.type == 1" v-html="postItem.contentFilter"></span>
                                <img class="check-img" v-if="postItem.type == 2" :src="postItem.content" >
                            </div>
                        </div>
                        <!-- <span class="show_all" v-show="isShowAll == index">
                            <div v-for="(postItem,index) in (item.postContents)" :key="postItem.id">
                                <span v-if="postItem.type == 1" v-html="postItem.contentFilter"></span>
                                <img class="check-img" v-if="postItem.type == 2" :src="postItem.content" >
                            </div>
                        </span> -->
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row v-else>
            <el-col>
                <el-dialog
                    title="提示"
                    :visible.sync="noList"
                    width="30%"
                    center
                    :show-close="false"
                    :modal="false">
                    <span>当前没有待审核的帖子啦！</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="auditComplete">确 定</el-button>
                    </span>
                </el-dialog>
            </el-col>
        </el-row>
        <!-- 显示全部帖子 -->
        <el-dialog
            title="帖子详情"
            :visible.sync="dialogItem.show"
            width="30%"
            center>
            <div v-for="postHtml in (dialogItem.htmlList)" :key="postHtml.id">
                <span v-if="postHtml.type == 1" v-html="postHtml.contentFilter"></span>
                <img class="check-img" v-if="postHtml.type == 2" :src="postHtml.content" >
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            baseUrl: BASE_URL,
            api: {
                list: '/postAudit/queryPostAuditList?auditType=1',
                submit:"/postAudit/doPostAudit",
                exit:"/postAudit/exitPostAudit",
            },
            editId:"", //操作id
            type :"", //审核类型
            noList:false,//判断是否有数据，是否审核完成
            isShowAll:"-1",
            dataArr:[],//先存全部评论id，之后是审核通过id
            rejectArr:[],//审核不通过id
            tableData: [], // 数据
            listLoading: true, //加载
            listType: "list", // 列表类型search list
            // 分页相关
            curPage: 1, //当前页
            totalNum: 0, // 总数
            small: true, //小屏幕
            dealNum: 100, //每页大小
            dialogItem:{ //帖子详情
                show:false,
                htmlList:[],
            } 
        };
    },
    methods: {
        getTableData() {
                // 获取列表数据
                this.listLoading = true;
                setTimeout(() => {
                    let param = null;
                    param = {
                            dealNum: this.dealNum,
                        };
                    this.$http.get(this.api[this.listType], param, (data, res) => {
                        let dataList = data.data.postQueryDetailVos;
                        if(dataList.length == 0){
                            this.noList = !this.noList;
                        }
                        this.tableData = dataList;
                        // this.totalNum = data.total;
                        this.editId = data.data.auditNo;
                        this.listLoading = false;
                        //将所有的评论id先存起来
                        for(let j = 0,len = dataList.length; j < len; j++) {
                            // let artId = dataList[j].artId;
                            // let commId = dataList[j].commId;
                            let ids = dataList[j].id;
                            this.dataArr.push(ids);
                        }
                    });
                }, 300);
            },
            refreshTable() {
                this.curPage = 1;
                this.$emit("refresh")
                this.listType = "list"
                this.getTableData();
            },
            checkEdit(id,index,event){
                let _this = this;
                if(event.currentTarget.className.indexOf("check_item") >= 0){
                    //dom操作
                    $(event.currentTarget).removeClass("check_item");
                    $(event.currentTarget).find("i").remove();
                    //数据操作
                    let idInd = _this.rejectArr.indexOf(id);
                    _this.rejectArr.splice(idInd, 1);
                }else{
                    //dom操作
                    let html = '<i style="position: absolute;font-size: 80px;color: red;left: 36%;top: 16%;z-index:9" class="el-icon-close"></i>';
                    $(event.currentTarget).addClass("check_item");
                    $(event.currentTarget).append(html);
                    //数据操作
                    let ids = id;
                    _this.rejectArr.push(ids);//审核不通过id
                }
            },
            submitAudit(){  
                for(let j = 0,len = this.rejectArr.length; j < len; j++) {
                    let ind = this.dataArr.indexOf(this.rejectArr[j]);
                    this.dataArr.splice(ind,1);
                }
                if(this.dataArr.length > 0 || this.rejectArr.length > 0){
                    setTimeout(() => {
                        let param = null;
                        param = {
                                auditNo: this.editId,
                                passPostIds: this.dataArr,
                                rejectPostIds: this.rejectArr,
                            };
                        this.$http.post({
                            isJson: true,
                            url: this.api["submit"],
                            params: param,
                            success: res => {
                                if(res.code != 0){
                                    this.open("审核超时，请从新拉取数据！")
                                }else if(res.code == 0){
                                    location.reload();
                                }
                            }
                        });
                    }, 300);
                }
            },
            exitAudit(){
                setTimeout(() => {
                    let param = null;
                    param = {
                            auditNo: this.editId,
                        };
                    this.$http.post({
                        isJson: false,
                        url: this.api["exit"],
                        params: param, 
                        success: res => {
                            if(res.code == 0){
                                this.$router.push({
                                    path: "/contentCheck",
                                });
                            }
                        }
                    });
                }, 300);
            },
            auditComplete(){
                this.$router.push({
                    path: "/contentCheck",
                });
            },
            open(msg){
                this.$alert(msg, '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.push({
                            path: "/contentCheck",
                        });
                    }
                });
            },
            checkLength(item,index){
                if(item.length > 160){
                    this.isShowAll = index;
                }else{
                    this.isShowAll = -1;
                }
            },
            goUserDetail(userId){
                if(userId){
                    let param = null;
                    param = {
                            auditNo: this.editId,
                        };
                    this.$http.post({
                        isJson: false,
                        url: this.api["exit"],
                        params: param,
                        success: res => {
                        if(res.code == 0){
                            this.$router.push({
                                path: "/userManage",
                                query: {
                                    userId: userId,
                                    userType:0,
                                }
                            });
                        }
                    }
                    });
                }
            },
            // 点击展开帖子详情
            showPostMore(item){
                let that = this;
                that.dialogItem.show = true;
                that.dialogItem.htmlList = item;
            },

    },
    activated(){
        this.getTableData();
    },
};

</script>
