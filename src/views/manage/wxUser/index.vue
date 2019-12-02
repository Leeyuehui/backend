<style scoped>
.show_comment_num{
    cursor: pointer;
}
.link{
    color: blue;
    text-decoration:underline;
}
</style>

<template>

<div class="app-container">
    <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd="true" @handleAdd="handleAdd" @handleEdit="handleEdit">

       <div slot="searchBox" >
            <el-input  id="input_unionId" placeholder="请输入用户的unionId" style="width: 200px;"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="selectUser">搜索</el-button>
        </div>


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
            
            <el-table-column align="center" v-else-if="col.field === 'commentSize'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="250">
                <div slot-scope="scope">
                    <span @click="goUserDetail(scope.row.userId)" :class="[scope.row.commentSize > 0 ? 'link' : '', 'show_comment_num']" >{{scope.row.commentSize}}</span>
                </div>
            </el-table-column>
            

            <el-table-column align="center" v-else-if="col.field === 'isAdmin'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="250">
                <div slot-scope="scope">
                    <el-button-group v-if="scope.row[scope.column.property]===1">
                        <el-button size="mini" type="danger" @click="setAdmin(scope.row, 0)" >取消管理员</el-button>
                    </el-button-group>
                    <el-button-group v-else>
                        <el-button size="mini" type="primary" @click="setAdmin(scope.row, 1)" >设为管理员</el-button>
                    </el-button-group>
                </div>
            </el-table-column>

            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
            </el-table-column>



        </div>

        <!-- 表单 -->
        <div slot="dialog">

            <el-form :status-icon="true" ref="form" :rules="validRule" :model="editInfo" label-width="80px" size="medium">

                <!-- 自定义表单   -++++++++++++++++++ -->
                <el-form-item hidden>
                    <el-input v-model="editInfo.userId" auto-complete="off"></el-input>
                </el-form-item>

                <!-- 自定义表单   -++++++++++++++++++ -->

                <el-form-item label="微信昵称" prop="nickName">
                    <el-input type="text" v-model="editInfo.nickName" auto-complete="on"></el-input>
                </el-form-item>
                <!-- <el-form-item label="性别">
                    <el-radio-group v-model="editInfo.gender">
                        <el-radio :label="'男'">男</el-radio>
                        <el-radio :label="'女'">女</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item label="微信ID" prop="openId">
                    <el-input type="text" v-model="editInfo.openId" auto-complete="on"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="headImage">
                    <my-upload :model.sync="editInfo.headImage" functionName="wxUser" type="img"></my-upload>
                </el-form-item>
                <!-- <el-form-item label="真实姓名" prop="nickName">
                    <el-input type="text" v-model="editInfo.nickName" auto-complete="off"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="电话">
                    <el-input type="number" v-model="editInfo.phoneNo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否可用">
                    <el-radio-group v-model="editInfo.isDisabled">
                        <el-radio :label="'是'">是</el-radio>
                        <el-radio :label="'否'">否</el-radio>
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

        return {
            // 接口路径
            baseUrl: BASE_URL,
            api: {
                list: "f00604",
                delete: "f00602",   
                add: "f00601",
                edit: "f00603",
                set: "f00607",
                search:"f00606",
            },
            // id 字段
            idField: "userId",
            unionId:null,
            // 表头字段
            cols: [{
                    field: "userId",
                    label: "ID",
                    width: 125
                },  {
                    field: "headImage",
                    label: "头像",
                    type: 'img',
                    width: 125
                }, {
                    field: "nickName",
                    label: "微信昵称",
                }, {
                    field: "createTime",
                    label: "创建时间",
                }, {
                    field: "commentSize",
                    label: "评论内容",
                },{
                    field: "isAdmin",
                    label: "管理员操作",
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
        selectUser() {
            var s = document.getElementById("input_unionId").value;
            this.$router.push({
                path: "/manage/wxUser",
                query: {
                    type: 'search',
                    id: s
                }
            });
            console.log(this.$refs.table)
            this.$refs.table.search();
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
        },
        setAdmin(row, type){
            var unionId = row.unionId;
            
            if(unionId){
                let param = {
                    unionId: unionId,
                    isAdmin:type
                }
                this.$http.post(this.api.set, param, res => {
                    if (res) {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.$refs.table.getTableData();
                        this.dialogVisible = false;
                    }
                });
                }else{
                    var msg = "用户<"+row.nickName+">的unionId为空!";
                    this.$message({
                    type: "error",
                    message: msg
                });
                }
        },
        goUserDetail(userId){
            if(userId){
                this.$router.push({
                    path: "/userManage",
                    query: {
                        userId: userId,
                    }
                });
            }
        },
    },
};

</script>
