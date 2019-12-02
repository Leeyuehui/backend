<style scoped>

.el-select{
    margin-left: 4%;
}

</style>

<template>

<div class="app-container">
    <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd='true' @handleAdd="handleAdd" @handleEdit="handleEdit">

        <div slot="searchBox" >
            <!-- 文章搜索 -->
            <!-- <el-input  id="input_unionId" placeholder="请输入文章ID" style="width: 200px;" v-model="artIdVal"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="searchArtId">搜索</el-button> -->

            <!-- 类型搜索 -->
            <!-- <el-select v-model="artType" clearable placeholder="请选择类型" @clear="clearType" @change="chooseType">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select> -->
        </div>

        <!-- 表格 列 -->
        <div slot="columns">
            <el-table-column align="center" v-if="col.type === 'url'" v-for="col in cols" :key="col.field" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <audio id="audio1" v-show="scope.row[scope.column.property]" preload="none" :src="getUrl(scope.row[scope.column.property])" style="width:200px" controls="controls"></audio>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else-if="col.type === 'img'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <a @click="setSrc(baseUrl+'/file/'+scope.row[scope.column.property])"> <img :src="baseUrl+'/file/'+scope.row[scope.column.property]" class="preview_pic" /></a>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
            </el-table-column>

            <el-table-column label="操作" align="center" width="250">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="handleComment(scope.$index, scope.row)">查看评论</el-button>
                        <el-button size="mini" type="info" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                list: "f10104?type=2",
                delete: "f10102?type=2",
                add: "f10101?type=2",
                edit: "f10103?type=2",
                search: "f10104?type=2",
            },
            // id 字段
            idField: "artId",
            artIdVal:'',
            // 表头字段
            cols: [{
                    field: "artId",
                    label: "ID",
                    width: 125
                }, {
                    field: "title",
                    label: "标题"
                },{
                    field: "cententShow",
                    label: "评论区",
                    formatter: (row, column, cellValue) => {
                        switch (cellValue) {
                            case 'show':
                                return '不关闭';
                            case 'notShow':
                                return '关闭';
                        }
                    },
                },{
                    field: "voiceFileId",
                    label: "语音文件",
                    type:"url"
                },
                 {
                    field: "createTime",
                    label: "发布时间",
                },

            ],
            options: [{
                value: '',
                label: '全部'
            }, {
                value: '0',
                label: '头条'
            }, {
                value: '1',
                label: '次条'
            }],
            artType: '',
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
        // 以下为必备函数
        beforeCommit(param) {

            },
            handleAdd(param) {
                param.needNew = true; //不打开新页面
                this.editInfo = {};
                this.$router.push({
                    path: "/internal/edit",
                    query: {
                        type: 'add'
                    }
                });

            },
            handleEdit(param, row) {
                param.needNew = true; //不打开新页面
                this.editInfo = row;
                this.$router.push({
                    path: "/internal/edit",
                    query: {
                        type: 'edit',
                        id: row.artId
                    }
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
                
            },
            clearType(){
                this.$router.push({
                    path: "/internal/list",
                    query: {
                        type: 'search',
                        // artType: this.artType,
                        // row: 8,
                        // page:'artice'
                    }
                });
                this.$refs.table.search();
            },
            chooseType(){
                this.$router.push({
                    path: "/internal/list",
                    query: {
                        type: 'search',
                        artType: this.artType,
                        // row: 8,
                        // page:'artice'
                    }
                });
                this.$refs.table.search();
            },
            searchArtId() {
            // var s = this.artIdVal;
            this.$router.push({
                path: "/internal/list",
                query: {
                    type: 'search',
                    artId: this.artIdVal,
                    // row: 8,
                    // page:'artice'
                }
            });
            this.$refs.table.search();
        },
    },
    mounted() {
        this.artIdVal = this.$router.currentRoute.query.artId;
    }
};

</script>
