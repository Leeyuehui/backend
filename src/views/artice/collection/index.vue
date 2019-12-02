<style scoped>



</style>

<template>

<div class="app-container">
    <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd="false" @handleAdd="handleAdd" @handleEdit="handleEdit">

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
                    <a :href="baseUrl+'/file/'+scope.row[scope.column.property]" width="100%" height="100%">
                        <el-button>点击查看</el-button>
                    </a>

                </template>
            </el-table-column>
            <el-table-column align="center" v-else-if="col.type === 'img'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <a :href="baseUrl+'/file/'+scope.row[scope.column.property]"><img :src="baseUrl+'/file/'+scope.row[scope.column.property]" class="header_pic" /></a>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width" >
            </el-table-column>

            <el-table-column label="操作" align="center" width="150">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </el-button-group>
                </div>
            </el-table-column>

        </div>

        <!-- 表单 -->

    </my-table>

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
                list: "f10304",
                delete: "f10302",
                add: "f10301",
                edit: "f10303",
            },
            // id 字段
            idField: "id",
            // 表头字段
            cols: [{
                    field: "id",
                    label: "ID",
                    width: 125,
                    
                },{
                    field: "artTitle",
                    label: "文章",
                    
                    
                },{
                    field: "username",
                    label: "用户",
                    
                },{
                    field: "createTime",
                    label: "收藏时间",
                   
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
                        id: row.artId
                    }
                });
            },
            refresh() {

            },
            // 自定义函数
            selectArea(areaId) {
                if (areaId) {
                    this.$refs.table.search()
                }
            },
            handleDelete(index, row) {
                this.$refs.table.delete(row[this.idField])
            },
    }
};

</script>
