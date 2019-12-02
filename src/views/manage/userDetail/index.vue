<style scoped>

.el-select{
    margin-left: 4%;
}

</style>

<template>

<div class="app-container">
    
    <my-table :api="api" :cols="cols" ref="table" :initLoad="initLoad" :idArt="idArt" :idField="idField" :opeBtn="false" :showAdd="true" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" @handleAdd="handleAdd" @handleEdit="handleEdit">
    
        <div slot="searchBox" >
            <!-- 文章搜索 -->
            <!-- <el-input  id="input_unionId" placeholder="请输入文章ID" style="width: 200px;" v-model="artIdVal"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="searchArtId">搜索</el-button> -->

            <!-- 来源搜索 -->
            <!-- <el-select v-model="sourceVal" clearable placeholder="请选择来源" @clear="clearSource" @change="chooseSource">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select> -->
        </div>
        

       <!-- <div slot="searchBox">
            <el-form  :inline="true" :model="searchInfo" class="demo-form-inline">
            <el-form-item >
                <my-area ref="area" :model.sync="searchInfo.areaId" ></my-area>
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
            <el-table-column align="center" v-else-if="col.type === 'text'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <a @click="setContent(scope.row[scope.column.property])"><p class="cell" v-text="scope.row[scope.column.property]"></p></a>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" v-else-if="col.field === 'top'" :formatter="col.formatter" :prop="col.field" width="190">
                <div slot-scope="scope">
                    <!-- <el-button-group>
                        <el-button size="mini" type="primary" @click="handleReply(scope.$index, scope.row)">回复</el-button>
                        <el-button size="mini" type="info" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </el-button-group> -->

                     <el-button-group v-if="scope.row[scope.column.property]===1">
                        <el-button size="mini" type="danger" @click="setComment(scope.$index, scope.row, 0)" >取消置顶</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </el-button-group>
                     <el-button-group v-else>
                        <el-button size="mini" type="primary" @click="setComment(scope.$index, scope.row, 1)" >置顶</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </el-button-group>
                </div>
            </el-table-column>

            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
            </el-table-column>


        </div>
        <div slot="dialog">

            <el-form :status-icon="true" ref="form" :rules="validRule" :model="editInfo" label-width="120px" size="medium">

                <!-- 自定义表单   -++++++++++++++++++ -->
                <el-form-item hidden>
                    <el-input v-model="editInfo.commId" auto-complete="off"></el-input>
                </el-form-item>

                <!-- 自定义表单   -++++++++++++++++++ -->

                <el-form-item label="评论人昵称" prop="name">
                    <el-input type="text" v-model="editInfo.name" auto-complete="on"></el-input>
                </el-form-item>
                <el-form-item label="是否匿名">
                    <el-radio-group v-model="editInfo.anonymous">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="评论内容" prop="contentPre">
                    <el-input type="text" v-model="editInfo.contentPre" auto-complete="on"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <my-upload functionName="comment" :model.sync="editInfo.avatar" type="img"></my-upload>
                </el-form-item>
                <el-form-item label="点赞数" prop="praiseNum">
                    <el-input type="text" v-model="editInfo.praiseNum" auto-complete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="被回复评论ID">
                    <el-input type="number" v-model="editInfo.originId" auto-complete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="文章id">
                    <el-input type="number" v-model="editInfo.artId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="精度">
                    <el-input type="number" v-model="editInfo.lon" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="纬度">
                    <el-input type="number" v-model="editInfo.lat" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="text" v-model="editInfo.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否精选">
                    <el-radio-group v-model="editInfo.top">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 自定义表单 -->
            </el-form>

        </div>
    </my-table>

    <el-dialog
        title="查看"
        :visible.sync="conDialog"
        width="30%"
        >
        <p v-text="comContent"> </p>
        <span slot="footer" class="dialog-footer">

            <el-button type="primary" @click="conDialog = false">确 定</el-button>
        </span>
    </el-dialog>

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
            url:'/f10106',
            api: {
                list: "/comment/getCommentsByUinonId",
                delete: "f10402",
                // add: "f10401",
                // edit: "f10403",
                search:"/comment/getCommentsByUinonId",
                set:"comment/topHandle"
            },
            options: [{
                value: '1',
                label: '公众号'
            }, {
                value: '2',
                label: '小程序'
            }, {
                value: '3',
                label: '未知'
            }],
            sourceVal: '',
            // id 字段
            idField: "commId",
            idArt:"artId",
            artIdVal:'',
            // 表头字段
            cols: [{
                    field: "commId",
                    label: "ID",
                    width: 125
                }, {
                    field: "name",
                    label: "评论人昵称"
                }, {
                    field: "avatar",
                    label: "头像",
                    type: 'img',
                    width: 125
                }, {
                    field: "contentPre",
                    label: "评论内容",
                    type:"text",
                }, {
                    field: "source",
                    label: "来源",
                    formatter: (row, column, cellValue) => {
                        switch (cellValue) {
                            case 1:
                                return '公众号';
                            case 2:
                                return '小程序';
                            case 3:
                                return '未知';
                        }
                    },
                    width: 160
                },
                // {
                //     field: "artTitle",
                //     label: "文章标题",
                // }, 
                //{
                //     field: "originId",
                //     label: "被回复ID",
                //     width:100,
                // }, 
                {
                    field: "anonymous",
                    label: "是否匿名",
                    formatter: (row, column, cellValue) => {
                        switch (cellValue) {
                            case 0:
                                return '否';
                            case 1:
                                return '是';
                        }
                    },
                    width: 80
                }, {
                    field: "top",
                    label: "是否精选",
                    formatter: (row, column, cellValue) => {
                        switch (cellValue) {
                            case 0:
                                return '否';
                            case 1:
                                return '是';
                        }
                    },
                    width: 80
                },
                {
                    field:"createTime",
                    label:"评论时间",
                    width:180,
                }

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
            dialogVisible: false,
            comContent:"",
            conDialog:false,
            restaurants: [],
            state1: '',
            state2: '',
            initLoad : false
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
            param.needNew = true; //不打开新页面
            this.$message('评论添加请到微信端');
            this.editInfo = {};

        },
        handleEdit(param, row) {
            param.needNew = false; //不打开新页面
            this.editInfo = row;
        },
        refresh() {

        },
        // 自定义函数
        setContent(con){
            this.comContent = con;
            this.conDialog = true;
        },
        handleDelete(index, row) {
            let id = row[this.idArt] + "_" + row[this.idField]
            this.$refs.table.delete(id)
        },
        handleUpdate(index, row) {
            this.$refs.table.handleEdit(index,row)
        },
        handleReply(index, row) {
            this.dialogVisible = true;
            this.editInfo.originId = row.commId;
            this.editInfo.artId = row.artId;
            console.log(this.editInfo);
        },
        handleSubmit() {
            var params = this.editInfo;
            console.log(params);
            this.$http.post(this.api.add, params, res => {
                if (res) {
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                    this.$refs.table.getTableData();
                    this.dialogVisible = false;
                }
            })

        },
        closeDialog() {
            this.dialogVisible = false;
        },
        getPic(url){
            if(url.indexOf("http") != -1){
                return url;
            }else{
                return this.baseUrl+'/file/'+url
            }
        },
            // 自定义函数
        searchArtId() {
            // var s = this.artIdVal;
            this.$router.push({
                path: "/comment/list",
                query: {
                    type: 'search',
                    id: this.artIdVal,
                    // row: 8,
                    page:'comment'
                }
            });
            this.$refs.table.search();
        },
        selectArea(){
            console.log('select')
        },
        chooseSource(){
            this.$router.push({
                path: "/comment/list",
                query: {
                    type: 'search',
                    id: this.artIdVal,
                    source:this.sourceVal,
                    // row: 8,
                    page:'comment'
                }
            });
            this.$refs.table.search();
        },
        clearSource(){
            this.$router.push({
                path: "/comment/list",
                query: {
                    type: 'search',
                    id: this.artIdVal,
                    // row: 8,
                    page:'comment'
                }
            });
            this.$refs.table.search();
        },

        setComment(index, row, type){
            let id = row[this.idArt] + "_" + row[this.idField];
            let param = {
                id: id,
                type: type
            }
            this.$http.post(this.api.set, param, (data,res) => {
                if (res.code==200) {
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                    this.$refs.table.getTableData();
                    this.dialogVisible = false;
                }else{
                    this.$message.error("操作失败!");
                }
            });
        },
    
        handleSelect(item) {
            
        }
    },
    mounted() {
        this.artIdVal = this.$router.currentRoute.query.artId;
    }
   
};

</script>
