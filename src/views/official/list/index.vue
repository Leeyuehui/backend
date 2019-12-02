<style scoped>

.hand{
    cursor: pointer;
}
.ban{
    display: inline-block;
    margin-right: 12px;
    margin-bottom: 10px;
    position:relative;
}
.del{
    position: absolute;
    top: -8px;
    right: -8px;
    color: #ccc;
    font-size: 10px;
    cursor: pointer;
}

</style>

<template>

<div class="app-container">
    <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" :showAdd='true'  @beforeCommit="beforeCommit" @handleAdd="handleAdd" @handleEdit="handleEdit">

        <div slot="searchBox" >
            <!-- 文章搜索 -->
            <el-input  id="input-userName" placeholder="官方账号昵称" style="width: 200px;" v-model="searchInfo.keyword"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="searchName">搜索</el-button>
        </div>

        <!-- 表格 列 -->
            <div slot="columns">
            <el-table-column align="center" v-if="col.type === 'url'"  v-for="col in cols" :key="col.field" :prop="col.field" :label="col.label" :width="col.width">
                <template   slot-scope="scope">
                    <a :href="scope.row[scope.column.property]" width="100%" height="100%"><el-button>点击查看</el-button></a>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else-if="col.type === 'img'"  :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template   slot-scope="scope">
                    <a :href="scope.row[scope.column.property]"><img :src="scope.row[scope.column.property]"  class="header_pic"/></a>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else-if="col.field === 'realUserIds'" :formatter="col.formatter"  :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <span class="hand" @click="showAllUserIds(scope.row)">{{scope.row.realUserIds}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else :formatter="col.formatter"  :prop="col.field" :label="col.label" :width="col.width">
            </el-table-column>

            <el-table-column label="操作" align="center" width="300">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button size="mini" type="info" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="primary" @click="addLinkUser(scope.$index, scope.row)">添加绑定用户</el-button>
                    </el-button-group>
                </div>
            </el-table-column>
        </div>

        <!-- 新增 -->
        <div slot="dialog">

            <el-form :status-icon="true" ref="form" :rules="validRule" :model="editInfo" label-width="80px" size="medium">

                <el-form-item label="帐号头像" prop="headUrl">
                    <my-upload functionName="user" :model.sync="editInfo.headUrl" type="img"></my-upload>
                </el-form-item>
                <el-form-item label="帐号昵称" prop="name">
                    <el-input type="text" v-model="editInfo.name" auto-complete="on"></el-input>
                </el-form-item>
                <el-form-item label="个性签名" >
                    <el-input type="text" v-model="editInfo.introduction" auto-complete="on"></el-input>
                </el-form-item>
                
            </el-form>

        </div>

    </my-table>

    <!-- 编辑 -->
        <el-dialog
            title="更新"
            :visible.sync="editDialog"
            width="30%"
            center>
            <el-form :status-icon="true" ref="form" :rules="validRule" :model="editInfo" label-width="80px" size="medium">
                <el-form-item label="帐号头像" prop="headUrl">
                    <my-upload functionName="user" :model.sync="editInfo.headUrl" type="img"></my-upload>
                    <span>建议上传300*300尺寸的图片</span>
                </el-form-item>
                <el-form-item label="帐号昵称" prop="name">
                    <el-input type="text" v-model="editInfo.name" auto-complete="on" clearable></el-input>
                </el-form-item>
                <el-form-item label="个性签名">
                    <el-input type="text" v-model="editInfo.introduction" auto-complete="on" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogClick(false)">取 消</el-button>
                <el-button type="primary" @click="editDialogClick(true)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加绑定用户 -->
        <el-dialog
            title="添加绑定用户"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <el-input type="text" v-model="linkUserId" auto-complete="on" placeholder="请输入绑定用户的id"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogClick(false)">取 消</el-button>
                <el-button type="primary" @click="dialogClick(true)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 绑定用户id -->
        <el-dialog title="已绑定的全部用户id" :visible.sync="userIdsDialogVisible" width="30%">
            <span v-for="item in allUserIds" :key="item" class="ban">
                {{item}}
                <i class="del" @click="unbound(item)">x</i>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="userIdsDialogVisible = false">确 定</el-button>
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
            baseUrl:BASE_URL,
            api: {
                list: "/virtualUser/list?type=2",
                delete: "/virtualUser/remove",
                add: "/virtualUser/add?type=2",
                addAdmin: "/virtualUser/addAdmin",
                edit:"/virtualUser/update",
                only:true
            },
            // id 字段
            idField: "id",
            // 表头字段
            cols: [{
                    field: "id",
                    label: "帐号ID"
                }, {
                    field: "headUrl",
                    label: "头像",
                    type: 'img'
                },{
                    field: "name",
                    label: "昵称"
                }, 
                {
                    field: "createTime",
                    label: "创建时间",
                },
                {
                    field: "realUserIds",
                    label: "已绑定用户id",
                },
            ],
            // 表单对象
            editInfo: {

            },
            searchInfo: {
                keyword:'',  //官方账号昵称
            },
            // 表单验证
            validRule: {
                name: [{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }],
                headUrl: [{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }],
                
            },
            // ========自定义变量
            centerDialogVisible: false,   //控制绑定用户弹窗显示
            editDialog:false,             //控制编辑弹窗显示
            linkUserId:'',                //绑定用户id
            userIdsDialogVisible:false,   //绑定的所有用户弹窗显示
            allUserIds:[],   //绑定的所有用户
            official:false,    //官方id
            bindUserId:''           //解绑用户id
        };
    },
    methods: {
        // 解绑对话框
        unbound(item){
            let data = {
                realUserId:item,
                virtualUserId:this.official
            }
            this.popout(item, data)
            
        },
        popout(item,data){
            this.$confirm(`是否确认解绑${item}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post({
                    isJson:true,
                    url:'/virtualUser/cancelAdmin',
                    params:data,
                    success: res =>{
                        if(res.code == 0 && res.data === true){
                            this.$message({
                                type: 'success',
                                message: '解绑成功'
                            });
                            this.userIdsDialogVisible = false;
                            this.$refs.table.getTableData();
                        }else{
                            this.$message({
                                type: 'info',
                                message: '解绑失败'
                            });
                        }
                    }
                })
            }).catch((err) => {
                console.log('err',err)
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },
        // 以下为必备函数
        beforeCommit(param) {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    param.ok = true; // 允许提交
                } else {
                    param.ok = false; // 不允许提交
                }
            });
        },
        handleAdd(param) {
            param.needNew = false; //不打开新页面
            param.tips = '是否确认新增该官方帐号？'
            this.editInfo = {
                type:2,
            };
        },
        handleEdit(param, row) {
            param.needNew = false; //不打开新页面
            param.tips = '是否确认更新资料？'
            this.editInfo = row;
        },
        refresh(){

        },

        // 自定义函数
        //编辑
        handleUpdate(index,row){
            this.editDialog = true;
            this.editInfo = row;
            // this.
        },
        //删除
        handleDelete(index, row) {
            this.$refs.table.delete(row[this.idField])
        },
        //添加绑定用户
        addLinkUser(index,row){
            this.centerDialogVisible = true;
            this.editInfo = row;
        },
        //绑定用户弹窗
        dialogClick(type){
            let that = this;
            let userId = that.linkUserId;
            if(type){
                if(userId){
                    let param = {
                        realUserId: userId,
                        virtualUserId: that.editInfo.id
                    }
                    let tips = '是否确认添加绑定用户(id:' + userId + ')?';
                    that.$confirm(tips, {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        that.$http.post(that.api['addAdmin'], param, (data, res) => {
                            that.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            that.linkUserId = '';
                            that.centerDialogVisible = false;
                            this.$refs.table.getTableData();
                        });
                    }).catch(() => {
                        
                    });
                }
            }else{
                that.centerDialogVisible = false;
                that.linkUserId = '';
            }
        },
        //编辑弹窗提交
        editDialogClick(type){
            let that = this;
            if(type){
                let param = {
                    headUrl: that.editInfo.headUrl,
                    id:that.editInfo.id,
                    name: that.editInfo.name,
                    introduction:that.editInfo.introduction,
                    type: 2
                }
                let tips = '是否确认更新资料？';
                that.$confirm(tips, {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$http.post(that.api['edit'], param, (data, res) => {
                        that.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        that.editDialog = false;
                        this.$refs.table.getTableData();
                    });
                }).catch(() => {
                            
                });
            }else{
                that.editDialog = false;
            }
        },
        //点击显示全部绑定用户id
        showAllUserIds(row){
            let ids=row.realUserIds;
            this.official = row.id;  //官方id
            if(ids){
                if(ids.includes(',')){
                    this.allUserIds = ids.split(',');
                    console.log(this.allUserIds)
                }else{
                    this.allUserIds.push(ids)
                }
                this.userIdsDialogVisible = true;
            }
            // this.allUserIds = ids;   
            // this.userIdsDialogVisible = true;
        },
        //搜索官方账号
        searchName(){
            this.$router.push({
                path: "/official/list",
                query: {
                    type: '2',
                    keyword: this.searchInfo.keyword,
                }
            });
            this.$refs.table.getTableData();
        },
    }
};

</script>
