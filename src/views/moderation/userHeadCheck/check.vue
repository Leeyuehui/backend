<style scoped>
.dsinb{
    display: inline-block;
}
.grid_content{
    width: 220px;
    height: 250px;
    cursor: pointer;
    position: relative;
    display: inline-block;
    border-top: 1px solid #eee;
    background-color: #f9f9f9;
    margin-right: 10px;
}
.show_content{
    padding: 6px;
    position: relative;
}

.check_item{
    background:rgba(0, 0, 0, 0.2);
    position: absolute;
    z-index: 999;
    width: 220px;
    height: 220px;
    top: 0;
    left: 0;
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
}
.user_head_img{
    width: 200px;
    height: 200px;
}
.uesr-message{
    font-size: 12px;
    color: #999;
    margin-left: 10px;
}
.user-time{
    margin-top: 4px;
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

    <!-- v-bind:class="[{ check_item: item.hasCheck }, show_content]" -->
        <div style="margin-top:20px;float:left;" v-if="!noList">
            <div class="grid_content" v-for="(item,index) in tableData" :key="item.id" >
                <div class="show_content " @click="checkEdit(item.id,index,item.hasCheck)">
                    <img class="user_head_img " :src="item.headUrl" >
                    <div v-if="item.hasCheck" class="check_item">
                        <i style="position: absolute;font-size: 80px;color: red;left: 70px;top: 70px;z-index:9" class="el-icon-close"></i>
                    </div>
                </div>
                <div class="uesr-message">
                    <div class="user-name" @click="goUserDetail(item.userId)">用户名：{{item.name}}</div>
                    <div class="user-time">上传时间：{{item.createTime}}</div>
                </div>
            </div>
        </div>
        <div v-else>
            <div>
                <el-dialog
                    title="提示"
                    :visible.sync="noList"
                    width="30%"
                    center
                    :show-close="false"
                    :modal="false">
                    <span>当前没有待审核的头像啦！</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="auditComplete">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            baseUrl: BASE_URL,
            api: {
                list: "/user/queryUserAuditList",
                submit:"/user/doUserAudit",
                exit:"/user/exitUserAudit",
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
                        let dataList = data.data.users;
                        if(dataList.length == 0){
                            this.noList = !this.noList;
                        }
                        
                        // this.totalNum = data.total;
                        this.editId = data.data.auditNo;
                        this.listLoading = false;
                        //将所有的评论id先存起来
                        for(let j = 0,len = dataList.length; j < len; j++) {
                            // let artId = dataList[j].artId;
                            // let commId = dataList[j].commId;
                            dataList[j].hasCheck = false;
                            let ids = dataList[j].id;
                            this.dataArr.push(ids);
                        }
                        this.tableData = dataList;
                    });
                }, 300);
            },
            refreshTable() {
                this.curPage = 1;
                this.$emit("refresh")
                this.listType = "list"
                this.getTableData();
            },
            checkEdit(id,index,hasCheck){
                let _this = this;
                _this.tableData[index].hasCheck = !hasCheck;
                if(hasCheck){
                    let idInd = _this.rejectArr.indexOf(id);
                    _this.rejectArr.splice(idInd, 1);
                }else{
                    let ids = id;
                    _this.rejectArr.push(ids);//审核不通过id
                }

                // if(event.currentTarget.className.indexOf("check_item") >= 0){
                //     //dom操作
                //     $(event.currentTarget).removeClass("check_item");
                //     $(event.currentTarget).find("i").remove();
                //     //数据操作
                //     
                // }else{
                //     //dom操作
                //     let html = '<i style="position: absolute;font-size: 80px;color: red;left: 36%;top: 16%;z-index:9" class="el-icon-close"></i>';
                //     $(event.currentTarget).addClass("check_item");
                //     $(event.currentTarget).append(html);
                //     //数据操作
                //     
                // }
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
                                passUserIds: this.dataArr,
                                rejectUserIds: this.rejectArr,
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
                                    path: "/userHeadCheck",
                                });
                            }
                        }
                    });
                }, 300);
            },
            auditComplete(){
                this.$router.push({
                    path: "/userHeadCheck",
                });
            },
            open(msg){
                this.$alert(msg, '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.push({
                            path: "/userHeadCheck",
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
    },
    activated(){
        this.getTableData();
    },
};

</script>
