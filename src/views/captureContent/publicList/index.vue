<template>

<div class="app-container">
    <!-- <div slot="columns">
        <el-button class="publish" type="success" @click.stop="onSubmit" :disabled.sync="submitDisable">发布</el-button>
    </div> -->
    <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd='false' @handleAdd="handleAdd" @handleEdit="handleEdit">

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
            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
            </el-table-column>

            <el-table-column label="操作" align="center" width="250">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="postDetail(scope.row)">详情</el-button>
                        <el-button size="mini" type="success" @click="postEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="postDelete(scope.row)">删除</el-button>
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
                list:'/post/list/prePublish?source=2',
                delete: "/postDraft/removeDraft",
                add: "/post/add",
                edit: "/post/updateFull",
                update:"/post/update",
            },
            // id 字段
            idField: "id",
            // 表头字段
            cols: [{
                    field: "postId",
                    label: "资源ID",
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
                    field: "prePublishTime",
                    label: "预计发表时间",
                },
                {
                    field: "updateTime",
                    label: "更新时间",
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
        };
    },
    methods: {
        //删除帖子
        postDelete(row){
            console.log(11111111111111,row)

            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.$http.post({
                    isJson:true,
                    url:this.api.delete,
                    params:[row.postId],
                    success:res=>{
                        if(res.code == 0){
                            this.$message({
                                message:'删除成功',
                                type:'success'
                            })
                            this.$refs.table.refreshTable();
                        }
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'warning',
                    message: '已取消删除'
                });          
            });
        },
        // 帖子详情
        postDetail(row){
            console.log(row.postId)
            this.$router.push({
                path:'/circle/postDetail',
                query:{
                    postId:row.postId,
                    type:'unpublish'
                }
            })
        },

        //编辑帖子
        postEdit(row){
            console.log(row.postId)
            this.$router.push({
                path:'/official/send/prePublishEdit',
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
                path: "/captureContent/contentPublic",
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
</style>