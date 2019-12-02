<style scoped>



</style>

<template>

<div class="app-container">
    <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="true" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" :showAdd='true'  @beforeCommit="beforeCommit" @handleAdd="handleAdd" @handleEdit="handleEdit">

        <!-- <div slot="searchBox">
            <el-form  :inline="true" :model="searchInfo" class="demo-form-inline">
            <el-form-item >
                <my-area ref="area" @select="selectArea" :model.sync="searchInfo.areaId" ></my-area>
                <el-input  size="small" v-model="searchInfo.user" placeholder="审批人"></el-input>
            </el-form-item>
            </el-form>
        </div> -->


        <!-- 表格 列 -->
            <div slot="columns">
            <el-table-column align="center" v-if="col.type === 'url'"  v-for="col in cols" :key="col.field" :prop="col.field" :label="col.label" :width="col.width">
                <template   slot-scope="scope">
                    <a :href="baseUrl+'/file/'+scope.row[scope.column.property]" width="100%" height="100%"><el-button>点击查看</el-button></a>

                </template>
            </el-table-column>
            <el-table-column align="center" v-else-if="col.type === 'img'"  :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template   slot-scope="scope">

                <a :href="baseUrl+'/file/'+scope.row[scope.column.property]"><img :src="baseUrl+'/file/'+scope.row[scope.column.property]"  class="header_pic"/></a>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else :formatter="col.formatter"  :prop="col.field" :label="col.label" :width="col.width">
            </el-table-column>



        </div>

        <!-- 表单 -->
        <div slot="dialog">

            <el-form :status-icon="true" ref="form" :rules="validRule" :model="editInfo" label-width="80px" size="medium">

                <!-- 自定义表单   -++++++++++++++++++ -->
                <el-form-item hidden>
                    <el-input v-model="editInfo.uid" auto-complete="off"></el-input>
                </el-form-item>

                <!-- 自定义表单   -++++++++++++++++++ -->

                <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="editInfo.username" auto-complete="on"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <my-upload functionName="user" :model.sync="editInfo.avatar" type="img"></my-upload>
                </el-form-item>
                <el-form-item label="显示名" prop="nickname">
                    <el-input type="text" v-model="editInfo.nickname" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="editInfo.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码"  prop="checkPass">
                    <el-input type="password" v-model="editInfo.checkPass" auto-complete="off"></el-input>
                </el-form-item>

                <!-- <el-form-item label="角色" prop="role">
                    <el-radio-group v-model="editInfo.role">
                        <el-radio :label="0">物业</el-radio>
                        <el-radio :label="1">业委会</el-radio>
                        <el-radio :label="2">admin</el-radio>
                    </el-radio-group>
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

        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.editInfo.checkPass !== '') {
                    this.$refs.form.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.editInfo.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        return {
            // 接口路径
            baseUrl:BASE_URL,
            api: {
                list: "f90104",
                delete: "f90102",
                add: "f90101",
                edit: "f90103",
            },
            // id 字段
            idField: "uid",
            // 表头字段
            cols: [{
                    field: "uid",
                    label: "ID",
                    width:125
                },  {
                    field: "username",
                    label: "用户名"
                }, {
                    field: "nickname",
                    label: "显示名"
                }, {
                    field: "avatar",
                    label: "头像",
                    type: 'img'
                },
                // {
                //     field: "role",
                //     label: "角色",
                //     formatter: (row, column, cellValue) => {
                //         switch (cellValue) {
                //             case 0:
                //                 return '物业';
                //             case 1:
                //                 return '业委会';
                //             case 2:
                //                 return 'admin';
                //
                //         }
                //     },
                //     width:125
                // },

            ],
            // 表单对象
            editInfo: {

            },
            searchInfo: {

            },
            // 表单验证
            validRule: {
                username: [{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }],
                nickname: [{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }],
                // role: [{
                //     required: true,
                //     message: '不能为空',
                //     trigger: 'blur'
                // }],
                password: [{
                    required: true,
                    validator: validatePass,
                    trigger: 'blur'
                }],
                checkPass: [{
                    required: true,
                    validator: validatePass2,
                    trigger: 'blur'
                }],
            },
            // ========自定义变量

        };
    },
    methods: {
        // 以下为必备函数
        beforeCommit(param) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        param.ok = true; // 允许提交
                    } else {
                        param.ok = false; // 允许提交
                    }
                });
            },
            handleAdd(param) {
                param.needNew = false; //不打开新页面
                this.editInfo = {};

            },
            handleEdit(param, row) {
                param.needNew = false; //不打开新页面
                this.editInfo = row;

            },
            refresh(){

            },
            // 自定义函数
            selectArea(areaId){

            }
    }
};

</script>
