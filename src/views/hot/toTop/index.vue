<template>

<div class="app-container">
    <my-table :api="api" :isShowTop="isShowTop" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd='true' @handleAdd="handleAdd" @handleEdit="handleEdit">

        <!-- <div slot="searchBox">
            <el-form  :inline="true" :model="searchInfo" class="demo-form-inline">
            <el-form-item >
                <my-area ref="area" @select="selectArea" :model.sync="searchInfo.areaId" ></my-area>
            </el-form-item>
            </el-form>
        </div> -->

        <!-- 表格 列 -->
        <div slot="columns">
            <el-table-column align="center" v-if="col.type === 'url'" v-for="col in cols" :key="col.field" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <audio id="audio1" v-show="scope.row[scope.column.property]" preload="none" :src="getUrl(scope.row[scope.column.property])" style="width:200px" controls="controls"></audio>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else-if="col.type === 'img'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <a @click="setSrc(scope.row[scope.column.property])">
                        <img :src="scope.row[scope.column.property]" class="header_pic" /></a>
                </template>
            </el-table-column>

            <el-table-column v-else-if="col.field == 'content'" prop="content" label="文本" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="text(scope.row)" style="color:#606266" >{{scope.row.content}}</el-button>
                </template>
            </el-table-column>

            <el-table-column v-else-if="col.field == 'userName'" prop="userName" label="用户" align="center">
                <template slot-scope="scope">
                    <router-link :to="{name:'userManage',query:{userId:scope.row.userId,userType:scope.row.source == 0 ? 0 : 1}}"><div style="color:#87C3E6;">{{scope.row.userName}}</div></router-link>
                </template>
            </el-table-column>

            <el-table-column :label="col.label" v-else-if="col.label == '置顶位置'" align="center" :width="col.width">
                <div slot-scope="scope">
                        <!-- <el-button size="mini" type="danger" v-if="scope.row['type'] == 1")">普通话题</el-button> -->
                        <div v-if="scope.row['stickType'] == 1">圈子第{{scope.row['indexs']}}</div>
                        <div v-if="scope.row['stickType'] == 2">话题第{{scope.row['indexs']}}</div>
                </div>
            </el-table-column>

            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width"></el-table-column>

            <el-table-column label="操作" align="center" width="120">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="danger" v-if="scope.row['status'] == 1" @click="handleStatus(scope.$index, scope.row)">取消置顶</el-button>
                        <el-button size="mini" type="info" v-if="scope.row['status'] == 0" @click="handleStatus(scope.$index, scope.row)">重新置顶</el-button>
                    </el-button-group>
                </div>
            </el-table-column>
        </div>

        <!-- 表单 -->
    
    </my-table>

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

    <!-- 文本详情 -->
    <el-dialog title="文本详情" :visible.sync="textShow" width="800px">
        <div>{{textContent}}</div>
    </el-dialog>

</div>

</template>

<script>

import MyTable from "@/components/MyTable";
import MyArea from "@/components/MyArea";
export default {
    components: {
        MyTable
    },
    data() {

        return {
            // 接口路径
            baseUrl: BASE_URL,
            api: {
                list:'/queryPostStickVoList',
                isUse:'/checkSomeIndexsStick',   //判断置顶位置是否被占用
                add: "/savePostStick", //置顶保存接口
                // update:"/removePostStick", 
                cancel:'/removePostStick',//取消置顶接口
                delete:'/deletePostStickRecord' //批量删除置顶记录
            },
            // id 字段
            idField: "stickId",
            // 表头字段
            cols: [
                { field: "id", label: "ID",width:'60'},
                { field: "status",label: "置顶状态",width:'80',
                    formatter:(row, column, cellValue)=>{
                        switch (cellValue) {
                            case 0:
                                return '未置顶';
                                break;
                            case 1:
                                return '置顶中';
                                break;
                            default:
                                return '未置顶 '
                        }
                    }
                },
                { field: "indexs", label: "置顶位置",width:"80"},
                { field: "deleteStatus", label: "帖子状态",width:'100',
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
                { field: "content", label: "文本"},
                { field: "userName", label: "用户"},
                { field: "groupName", label: "圈子来源"},
                { field: "topicName", label: "话题来源"},
                { field: "visibleNumber", label: "每人可见次数",width:'110'},
                { field: "commentCount", label: "评论",width:'60'},
                { field: "likeCount", label: "点赞",width:'60'},
                { field: "pv", label: "浏览量",width:'60'},
                { field: "stickTime", label: "置顶时间",width:'152'},
            ],
            // 表单对象
            editInfo: {

            },

            isShowTop:true, //添加置顶是否显示

            searchInfo: {

            },
            // 表单验证
            validRule: {

            },
            // ========自定义变量
            imgSrc:"",
            imageDialog:false,
            textShow:false,     //文本弹框
            textContent:false,  //文本弹框内容
        };
    },
    methods: {
        // 文本弹框
        text(row){
            this.textShow = true;
            this.textContent = row.content;
        },

        // 以下为必备函数
        beforeCommit(param) {

            },
            handleAdd(param) {
                param.needNew = true; //打开新页面
                this.editInfo = {};
                this.$router.push({
                    path: "/hot/toTop/addtop",
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
                console.log(row)
                if(row.status == 0 ){
                    this.$router.push({
                        path:'/hot/toTop/addTop',
                        query:{
                            postId:row.id
                        }
                    })
                    return
                } 

                let data = {
                    postId:row.id,
                    status:row.status == 0 ? 1 : 0,
                    stickType:row.stickType,
                }
                that.$http.post(that.api.cancel,  data, (res) => {
                    console.log('111111111111',res)
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