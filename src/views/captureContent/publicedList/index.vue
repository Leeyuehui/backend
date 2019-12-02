<template>

<div class="app-container">
    <!-- <div slot="columns">
        <el-button class="publish" type="success" @click.stop="onSubmit" :disabled.sync="submitDisable">发布</el-button>
    </div> -->
    <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd='true' @handleAdd="handleAdd" @handleEdit="handleEdit">

        <div slot="searchBox">
            <el-form  :inline="true" :model="searchInfo" class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="searchInfo.postId" placeholder="请输入帖子ID" style="width:150px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="searchInfo.content" placeholder="请输入帖子文本内容" clearable></el-input>
                </el-form-item>  
                <el-form-item label="">
                    <el-input v-model="searchInfo.userId" placeholder="请输入发表用户的ID" clearable></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker v-model="publishTime" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
                </el-form-item>    
                <el-select v-model="searchInfo.groupId" placeholder="选择圈子来源" style="width:150px;">
                    <el-option v-for="item in optionsGroup" :key="item.id" :label="item.name" :value="item.id" clearable></el-option> 
                </el-select>
                <el-select v-model="searchInfo.topicId" placeholder="选择话题来源" @focus="getGambit" style="width:150px;">
                    <el-option v-for="item in optionsGambit" :key="item.id" :label="item.name" :value="item.id" clearable></el-option>
                </el-select>
                <el-select v-model="searchInfo.recommended" placeholder="是否被推荐" style="width:150px;">
                    <el-option v-for="item in optionsRecommend" :key="item.id" :label="item.name" :value="item.id" clearable></el-option>
                </el-select>
                <el-button-group>
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="primary" @click="empty">刷新</el-button>
                </el-button-group>
            </el-form>
        </div>


        <!-- 表格 列 -->
        <div slot="columns">
            <el-table-column align="center" v-if="col.type === 'url'" v-for="col in cols" :key="col.field" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <audio id="audio1" v-show="scope.row[scope.column.property]" preload="none" :src="getUrl(scope.row[scope.column.property])" style="width:200px" controls="controls"></audio>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else-if="col.type === 'img'" v-for="col in cols" :key="col.field" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <a @click="setSrc(scope.row[scope.column.property])">
                        <img :src="scope.row[scope.column.property]" class="header_pic" /></a>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else-if="col.field === 'userName'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <router-link :to="{name:'userManage',query:{userId:scope.row.userId,userType:1}}"><div style="color:#87C3E6;">{{scope.row.userName}}</div></router-link>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else-if="col.field === 'commentCount'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <router-link :to="{name:'searchComment',query:{postId:scope.row.postId}}"><div style="color:#87C3E6;">{{scope.row.commentCount}}</div></router-link>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
            </el-table-column>

            <el-table-column label="操作" align="center" width="250">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="postDetail(scope.row)">详情</el-button>
                        <el-button size="mini" type="success" @click="postEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="delTK(scope.row)">删除</el-button>
                    </el-button-group>
                </div>
            </el-table-column>
        </div>

        <!-- 表单 -->
    
    </my-table>

    <!--删除对话框 -->
    <el-dialog title="请选择删除理由" :visible.sync="delReason" width="200px">
        <div>
            <div class="reason" v-for="item in delList" :key="item.id" @click="active(item)">
                {{item.name}}
                <el-button type="success" icon="el-icon-check" v-if="activeId == item.id" class="sucIcon" circle></el-button>
            </div>
        </div>
        <el-button type="primary" @click="postDelete" class="sureIcon">确定删除</el-button>
    </el-dialog>

    <el-dialog
        title="查看"
        :visible.sync="imageDialog"
        width="30%"
        >
        <img :src="imgSrc" width="100%"/>
        <span slot="footer" class="dialog-footer">

            <el-button type="primary" @click="imageDialog = false">确 定</el-button>
        </span>
    </el-dialog>

</div>

</template>

<script>

import MyTable from "@/components/MyTable";
import MyArea from "@/components/MyArea";
export default {
    components: {
        MyTable, MyArea
    },
    data() {

        return {
            // 接口路径
            baseUrl: BASE_URL,
            api: {
                list:'/post/list/published?source=2',
                delete: "/post/remove",
                edit: "/post/updateFull",
                update:"/post/update",
            },
            // id 字段
            idField: "id",
            // 表头字段
            cols: [{
                    field: "postId",
                    label: "帖子ID",
                },
                {field: "status",label: "状态",           // 状态：0：已删除 1：正常显示 2：待发布
                    formatter:(row, column, cellValue)=>{
                        switch (cellValue) {
                            case 0:
                                return '已发布';
                                break;
                            case 1:
                                return '管理员删除';
                                break;
                            default:
                                return '用户删除'
                        }
                    }
                },    
                {
                    field: "content",
                    label: "文本",
                },
                {
                    field: "userName",
                    label: "用户",
                },
                 {
                    field: "groupName",
                    label: "圈子来源",
                },
                 {
                    field: "topicName",
                    label: "话题来源",
                },
                 {
                    field: "commentCount",
                    label: "评论",
                },
                {
                    field: "likeCount",
                    label: "抱抱",
                },
                {
                    field: "pv",
                    label: "浏览量",
                },
                {
                    field: "createTime",
                    label: "发表时间",
                },
            ],
            // 表单对象
            editInfo: {

            },

            searchInfo: {

            },
            // 表单验证
            validRule: {

            },
            // ========自定义变量
            imgSrc:"",
            imageDialog:false,
            delReason:false,    // 删除对话框
            delList:[],         //删除数据
            activeId:false,       //选中删除理由
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },         
            optionsGroup:[],    //圈子选择器
            optionsGambit:[],  //话题选择器
            optionsRecommend:[
                {id:1,name:'被推荐'},
                {id:0,name:'未被推荐'},
            ],
            publishTime:[], //发布日期
        };
    },
    activated(){
        this.getGroup()
    },
    methods: {
        // 刷新
        empty(){
            this.publishTime = [];
            this.searchInfo = {
                postId:'',
                content:'',
                userId:'',
                groupId:'',
                topicId:'',
                recommended:''
            }
        },
        //搜索
        search(){
            if(this.publishTime){
               this.searchInfo.startTime =  this.publishTime[0]
               this.searchInfo.endTime =  this.publishTime[1]
            }
            this.searchInfo.source = 2
            this.$router.push({
                path:'/captureContent/publicedList',
                query:this.searchInfo
            })
            this.$refs.table.getTableData();
            
        },
        // 获取圈子数据
        getGroup(){
            this.$http.get({
                isJson:false,
                url:'/group/kvs',
                success:res=>{
                    this.optionsGroup = res.data
                    // this.groupId = res.data[0].id
                }
            })
        },
        //获取话题数据
        getGambit(){
            console.log(this.groupId)
            if(!this.searchInfo.groupId){
                this.$message({
                    message:'请先选择圈子来源',
                    type:'warning'
                })
                return
            }
            this.$http.post({
                isJson:true,
                url:'/topic/kvs',
                params:{
                    groupId:this.searchInfo.groupId,
                    topicType:0
                },
                success:res=>{
                    // console.log('获取话题数据',res)
                    this.optionsGambit = res.data
                }
            })
        },
        // 弹出删除对话框
        delTK(row){
            this.editInfo = [];
            this.editInfo.push(row.postId);
            
            this.$http.get({
                isJson:false,
                url:'/dealReason/kvs',
                success:res=>{
                    if(res.code == 0){
                        this.delList =res.data;
                        this.activeId = res.data[0].id;
                        this.delReason = true;
                    }
                }
            })
        },
        // 选择删除理由
        active(item){
            this.activeId = item.id
        },
        //删除帖子
        postDelete(){
            this.delReason = false;
            const params = {
                ids:this.editInfo,
                deleteReasonId:this.activeId
            }

            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post({
                    isJson:false,
                    url:this.api.delete,
                    params:params,
                    success:res=>{
                        if(res.code == 0){
                            this.$message({
                                message:'删除成功',
                                type:'success'
                            })
                            this.editInfo = {};
                            this.activeId = false;
                            this.$refs.table.refreshTable();
                        }
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });

        },
        // 帖子详情
        postDetail(row){
            console.log(row.postId)
            this.$router.push({
                path:'/circle/postDetail',
                query:{postId:row.postId}
            })
        },

        //编辑帖子
        postEdit(row){
            console.log(row.postId)
            this.$router.push({
                path:'/circle/PostEdit',
                query:{postId:row.postId}
            })
        },
        // 以下为必备函数
        beforeCommit(param) {

        },
        handleAdd(param) {
            param.needNew = true; //打开新页面
            this.editInfo = {};
            this.$router.push({
                path: "/official/send/posted",
                query: {
                    type: 'add'
                }
            });

        },
        handleEdit(param, row) {
            console.log(this.$refs.table)
            param.needNew = true; //打开新页面
            this.editInfo = row;
            
            // let res=row.data.list
            console.log('2222222',row)
            this.$router.push({
                path: "/banner/edit",
                query: {
                    type: 'edit',
                    id: row.id,
                    indexs: row.indexs,
                    appId: row.appId,
                    url: row.url,
                    path: row.path
                }

            });
        },
        handleStatus(param, row){
            var that = this;
            console.log(that.cols)
            let data = {
                id:row.id,
                status:row.status == 0?1:0,
            }
            that.editType="update";
            that.$http.post(that.api[that.editType],  data, (data, res) => {
                that.$message({
                    type: "success",
                    message: "操作成功",
                });
                that.dialogFormVisible = false;
                
                that.$refs.table.refreshTable();
            });
        },
        refresh() {

        },
        // 自定义函数
        setSrc(src){
            this.imgSrc = src;
            this.imageDialog = true;
        },
        handleDelete(index, row) {
            this.$refs.table.delete(row[this.idField])
        },

        handleUpdate(index, row) {
            console.log(this.$refs.table)
            this.$refs.table.handleEdit(index,row)
        },
        handleComment(index, row) {
            let artId = row[this.idField]
            this.$router.push({
                path: "/comment/list",
                query: {
                    artId:artId,
                    type: 'articeId',
                    id: row.artId
                }
            });
        },
        getUrl(url){
            if(url){
                if(typeof(url) == "string" && url.indexOf("http")!=-1){
                    return url;
                }else{
                    return this.baseUrl + "/file/" + url
                }
            }
            return "";
            
        }
    }
};

</script>
<style scoped>
    .app-container{
        position: relative;
    }
    .publish{
        position: absolute;
        left: 20px;
        top: 5px;
        z-index: 999;
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