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
    z-index: 9999;
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
    font-size: 12px;
    color: #999;
    cursor: pointer;
    margin-bottom: 6px;
    width: 200px;
    display: block;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
}
.comment_message{
    width: 200px;
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
    margin-bottom: 6px;
    margin-top: 6px;
    margin-right: 6px;
}
.check-img{
    width: 100%;
}
.show_report_message{
    font-size: 12px;
    margin-top: 8px;
    color: #999;
}
.c_bule{
    color: cornflowerblue;
}
.c_black{
    color: #333;
}
.report-message{
    float: right;
    text-align: left;
    margin-left: 10px;
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
                        <div class="user_message">
                            <img class="user_img" :src="item.userHead" alt="" @click="goUserDetail(item.userId,item.userType)">
                            <div class="user_name" @click="goUserDetail(item.userId,item.userType)">
                                {{item.userName}}
                                <span class="show_report_name" v-if="item.userType == 2">官方帐号</span>
                            </div>
                            <div class="comment_message">
                                <span>{{item.createTime}}</span>
                                <span class="show_artInfo">帖子ID：{{item.targetId}}</span>
                            </div>
                        </div>
                        
                        <div class="report-message">
                            <div class="show_report_message">举报人：{{item.reportUserName}}</div>
                            <div class="show_report_message c_bule">举报人ID：{{item.reportUserId}}</div>
                            <div class="show_report_message c_black">举报次数：{{item.times}}</div>
                            <div class="show_report_message c_black">
                                <div v-if="item.reason == 1">举报原因：广告信息</div>
                                <div v-if="item.reason == 2">举报原因：黄色暴力</div>
                                <div v-if="item.reason == 3">举报原因：政治敏感</div>
                                <div v-if="item.reason == 4">举报原因：辱骂他人</div>
                                <div v-if="item.reason == 5">举报原因：其他原因</div>
                            </div>
                            <div class="show-post-btn" @click="showPostMore(item.postContents)">展开详情</div>
                        </div>
                        
                    </div>
                    <div class="grid_content" @click="checkEdit(item.targetId,index,$event)" v-on:mouseenter="" v-on:mouseleave="isShowAll = -1">
                        <div class="show_content">
                            <div v-for="(postItem,index) in (item.postContents)" :key="postItem.id">
                                <span v-if="postItem.type == 1" v-html="postItem.content"></span>
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
                <span v-if="postHtml.type == 1" v-html="postHtml.content"></span>
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
                list: '/report/postAuditList',
                submit:"/report/doReportPostAudit",
                exit:"/report/exitReportPostAudit",
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
                    this.$http.post({
                        isJson:false,
                        url:this.api[this.listType], 
                        params:param,
                        success: data => {
                            let dataList = data.data.detailVos;
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
                                let ids = dataList[j].targetId;
                                this.dataArr.push(ids);
                            }
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
                    let html = '<i style="position: absolute;font-size: 80px;color: red;left: 40%;top: 36%;z-index:9" class="el-icon-close"></i>';
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
                                    path: "/reportCheck",
                                });
                            }
                        }
                    });
                }, 300);
            },
            auditComplete(){
                this.$router.push({
                    path: "/reportCheck",
                });
            },
            open(msg){
                this.$alert(msg, '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.push({
                            path: "/reportCheck",
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
            goUserDetail(userId,userType){
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
                                    userType:userType,
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
    // mounted() {
    //     this.getTableData();
    // },
};

</script>
