<style scoped>



</style>

<template>

<div class="app-container">
    <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="true" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd="true" @handleAdd="handleAdd" @handleEdit="handleEdit">

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
                    <a :href="getPic(scope.row[scope.column.property])"><img :src="getPic(scope.row[scope.column.property])" class="header_pic" /></a>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
            </el-table-column>


        </div>

        <!-- 表单 -->
        <div slot="dialog">

            <el-form :status-icon="true" ref="form" :rules="validRule" :model="editInfo" label-width="120px" size="medium">

                <!-- 自定义表单   -++++++++++++++++++ -->
                <el-form-item hidden>
                    <el-input v-model="editInfo.id" auto-complete="off"></el-input>
                </el-form-item>

                <!-- 自定义表单   -++++++++++++++++++ -->
                <el-form-item label="头像">
                    <my-upload :model.sync="editInfo.headImage" functionName="feedback" type="img"></my-upload>
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input type="text" v-model="editInfo.createOpenId" auto-complete="on"></el-input>
                </el-form-item>
                <el-form-item label="微信昵称" prop="weixinName">
                    <el-input type="text" v-model="editInfo.weixinName" auto-complete="on"></el-input>
                </el-form-item>
                <el-form-item label="反馈内容" prop="content">
                    <el-input type="textarea" v-model="editInfo.content" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input type="number" v-model="editInfo.phone" auto-complete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="纬度">
                    <el-input type="number" v-model="editInfo.lat" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="经度">
                    <el-input type="number" v-model="editInfo.lon" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址信息">
                    <el-input type="text" v-model="editInfo.address" auto-complete="off"></el-input>
                </el-form-item> -->

                <!-- 自定义表单 -->
            </el-form>

        </div>

    </my-table>

</div>

</template>

<script>

import MyTable from "@/components/MyTable";
import MyArea from "@/components/MyArea";
import MyUpload from "@/components/MyUpload";
export default {
    components: {
        MyTable, MyArea, MyUpload
    },
    data() {

        return {
            // 接口路径
            baseUrl: BASE_URL,
            api: {
                list: "f00204",
                delete: "f00202",
                add: "f00201",
                edit: "f00203",
            },
            // id 字段
            idField: "id",
            // 表头字段
            cols: [{
                    field: "id",
                    label: "ID",
                    width: 125
                },
                // {
                //     field: "name",
                //     label: "反馈人昵称",
                //     width: 125
                // },
                {
                    field: "headImage",
                    label: "头像",
                    type: 'img',
                    width: 125
                },
                {
                    field: "weixinName",
                    label: "微信昵称"
                },{
                    field: "content",
                    label: "反馈内容",
                }, {
                    field: "phone",
                    label: "手机号码",
                },{
                    field: "createTime",
                    label: "反馈时间",
                },
                // {
                //     field: "address",
                //     label: "地址信息",
                // },

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
                param.needNew = false; //不打开新页面
                this.editInfo = {};

            },
            handleEdit(param, row) {
                param.needNew = false; //不打开新页面
                this.editInfo = row;
            },
            refresh() {

            },
            // 自定义函数
            selectArea(areaId) {
                if (areaId) {
                    this.$refs.table.search()
                }
            },
            getPic(url){
                if(!url){
                    return ;
                }
                if(typeof(url) == "string" && url.indexOf("http") != -1){
                    return url;
                }else{
                    return this.baseUrl+'file/'+url
                }
            }
    }
};

</script>
