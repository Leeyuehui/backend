<style scoped>



</style>

<template>

<div class="app-container">
    <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="true" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd='true' @handleAdd="handleAdd" @handleEdit="handleEdit">

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
                    <audio id="audio1" v-show="scope.row[scope.column.property]"  preload="none" :src="getUrl(scope.row[scope.column.property])" controls="controls"></audio>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else-if="col.type === 'img'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <a @click="setSrc(baseUrl+'/file/'+scope.row[scope.column.property])"> <img :src="baseUrl+'/file/'+scope.row[scope.column.property]" style="width:200px"  class="preview_pic" /></a>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
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
                list: "f10204",
                delete: "f10202",
                add: "f10201",
                edit: "f10203",
            },
            // id 字段
            idField: "artDraftId",
            // 表头字段
            cols: [{
                    field: "artDraftId",
                    label: "ID",
                    width: 125
                }, {
                    field: "title",
                    label: "标题"
                }, {
                    field: "preview",
                    label: "文章预览图",
                    type: 'img',
                    width: 200
                }, {
                    field: "voiceFileId",
                    label: "语音文件",
                    type:"url"
                },
                 {
                    field: "preReleaseTime",
                    label: "预计发布时间",
                },
                 {
                    field: "updatedTime",
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
        // 以下为必备函数
        beforeCommit(param) {

            },
            handleAdd(param) {
                param.needNew = true; //不打开新页面
                this.editInfo = {};
                this.$router.push({
                    path: "/artice/edit",
                    query: {
                        type: 'add'
                    }
                });

            },
            handleEdit(param, row) {
                param.needNew = true; //不打开新页面
                this.editInfo = row;
                this.$router.push({
                    path: "/artice/edit",
                    query: {
                        type: 'draftEdit',
                        id: row.artDraftId
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
