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

            <el-table-column :label="col.label" v-else-if="col.label == '置顶位置'" align="center">
                <div slot-scope="scope">
                    <el-button-group>
                        <!-- <el-button size="mini" type="danger" v-if="scope.row['type'] == 1")">普通话题</el-button> -->
                        <div>{{scope.row['groupName']}}{{scope.row['stickType']}}</div>
                    </el-button-group>
                </div>
            </el-table-column>

            <el-table-column v-else-if="col.field == 'userName'" prop="userName" label="用户" align="center">
                <template slot-scope="scope">
                    <router-link :to="{name:'userManage',query:{userId:scope.row.userId,userType:scope.row.source == 0 ? 0 : 1}}"><div style="color:#87C3E6;">{{scope.row.userName}}</div></router-link>
                </template>
            </el-table-column>

            <el-table-column v-else-if="col.field == 'content'" prop="content" label="文本" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="text(scope.row)" style="color:#606266" >{{scope.row.content}}</el-button>
                </template>
            </el-table-column>

            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width"></el-table-column>

            <el-table-column label="操作" align="center" width="100">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">改分</el-button>
                    </el-button-group>
                </div>
            </el-table-column>
        </div>

        
    
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
            baseUrl: BASE_URL,// 接口路径
            api: {
                list:'/queryPostScoreVoList',
                isUse:'/checkSomeIndexsStick',   //判断置顶位置是否被占用
                add: "/savePostStick", //置顶保存接口
                // update:"/removePostStick", //取消置顶接口
                update:'/updatePostScore',
                search:'/queryPostScoreVoList'
            },
            // id 字段
            idField: "id",
            // 表头字段
            cols: [
                { field: "id", label: "帖子ID",width:'100'},
                { field: "score",label: "排序分值"},
                // { field: "status", label: "帖子状态"},
                { field: "content", label: "文本"},
                { field: "userName", label: "用户"},
                { field: "groupName", label: "圈子来源"},
                { field: "topicName", label: "话题来源"},
                { field: "commentCount", label: "评论",width:'70'},
                { field: "likeCount", label: "点赞",width:'70'},
                { field: "pv", label: "浏览量",width:'70'},
                { field: "changeScoreTime", label: "改分时间",width:'152'},
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
                path: "/hot/setGrade/plus",
                query: {
                    type: 'add'
                }
            });

        },
        handleEdit(param, row) {
            // let res=row.data.list
            console.log('2222222',row)
            this.$router.push({
                path: "/hot/setGrade/plus",
                query: {
                    postId: row.id,
                }

            });
        },
        handleStatus(param, row){
            var that = this;
            console.log(row)
            let data = {
                postId:row.id,
                status:row.status == 0 ? 1 : 0,
                stickType:row.stickType,
            }
            that.editType="delete";
            that.$http.post(that.api[that.editType],  data, (res) => {
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