<template>
    <div class="app-container">
        <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" :showAdd='true'  @beforeCommit="beforeCommit" @handleAdd="handleAdd" @handleEdit="handleEdit">
            
            <div slot="searchBox" >
                <!-- 文章搜索 -->
                <el-input  id="input_userId" placeholder="请输入用户ID" style="width: 200px;" v-model="userIdVal"></el-input>
                <el-button type="success" icon="el-icon-search" @click="addAdminId">添加</el-button>
            </div>

            <!-- 表格 列 -->
            <div slot="columns">
                <el-table-column align="center" v-if="col.type === 'url'"  v-for="col in cols" :key="col.field" :prop="col.field" :label="col.label" :width="col.width">
                    <template   slot-scope="scope">
                        <a :href="baseUrl+'/file/'+scope.row[scope.column.property]" width="100%" height="100%"><el-button>点击查看</el-button></a>
                    </template>
                </el-table-column>
                <el-table-column align="center" v-else-if="col.type === 'img'"  :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                    <template   slot-scope="scope">
                        <img :src="scope.row.headUrl"  class="header_pic"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" v-else :formatter="col.formatter"  :prop="col.field" :label="col.label" :width="col.width">
                </el-table-column>

                <el-table-column label="操作" align="center" width="150">
                    <div slot-scope="scope">
                        <el-button-group>
                            <el-button size="mini" type="danger" @click="clickDelete(scope.row)">删除</el-button>
                        </el-button-group>
                    </div>
                </el-table-column>
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
            baseUrl:BASE_URL,
            api: {
                list: "/admin/list",
                delete: "/admin/remove",
                // add: "/admin/add",
                edit: "/admin/setPermission",
            },
            // id 字段
            idField: "id",
            // 表头字段
            cols: [{
                    field: "id",
                    label: "用户id"
                }, {
                    field: "headUrl",
                    label: "头像",
                    type: 'img'
                },{
                    field: "name",
                    label: "昵称"
                }, 
                {
                    field: "updateTime",
                    label: "添加时间",
                },
            ],
            // 表单对象
            editInfo: {

            },
            searchInfo: {

            },
            userIdVal:'',

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
        //添加管理员
        addAdminId(row){
            let that = this;
            let userId = that.userIdVal;
            let params = {
                "userId": userId,
            }
            let tips = '是否确认给该用户(id:'+ userId +')添加管理员权限？'
            if(userId){
                this.$confirm(tips, {
                    confirmButtonText: '确认添加',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$http.post({
                        isJson:false,
                        url:'/admin/add',
                        params:params, 
                        success:res => {
                            if(res.code == 0){
                                 that.$message({
                                    message: '操作成功',
                                    type: 'success',
                                });
                                this.$refs.table.getTableData();
                            }else{
                                that.$message({
                                    message: res.msg,
                                    type: 'warning',
                                });
                            }
                       
                    }})
                }).catch(() => {
                            
                });
            }
        },
        //删除管理员
        clickDelete(row){
            console.log(row);
            let that = this;
            let userId = row.id;
            let params = [];
            params.push(userId);
            let tips = '是否确认取消该用户的管理员权限？'
            if(userId){
                this.$confirm(tips, {
                    confirmButtonText: '取消权限',
                    cancelButtonText: '关闭',
                    type: 'warning'
                }).then(() => {
                    that.$http.post(that.api.delete, params, res => {
                        that.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.$refs.table.getTableData();
                    })
                }).catch(() => {
                            
                });
            }
        },

    }
};

</script>
