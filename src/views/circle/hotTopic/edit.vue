<template>

<div class="app-container">
    <div slot="columns">
        <el-button class="publish" type="success" @click.stop="onSubmit" :disabled.sync="submitDisable">发布</el-button>
    </div>

    <my-table style="width:800px;" :api="api"  :cols="cols" :groupId="groupId" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd='true' @handleAdd="handleAdd" @handleEdit="handleEdit" v-on:onSubmitArr="getSubmitArr">

        <!-- 表格 列 -->
        <div slot="columns">
            <el-table-column align="center" v-for="col in cols" :key="col.field" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width"></el-table-column>
        </div>

        <!-- 表单 -->
        <el-dialog title="查看" :visible.sync="imageDialog" width="30%">
            <img :src="imgSrc" width="100%"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="imageDialog = false">确 定</el-button>
            </span>
        </el-dialog>
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
                list:'/topic/list',
                edit: "/topic/update",
                update:"/topic/update",
            },
            // id 字段
            idField: "id",
            groupId:false,
            // 表头字段
            cols: [
                {field: "id",label: "id",},
                {field: "name",label: "话题名称"},
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
            submitDisable:false,
            dataList:[],
        };
    },

    activated(){
        let query=this.$router.currentRoute.query
        console.log('66666666',query)
        this.groupId=query.groupId
    },

    methods: {
        getSubmitArr(data){
            // debugger
            console.log('??????????',data)
            this.dataList = data;
        },
        //  提交发布
        onSubmit(){
            // console.log('2333333333333',this.dataList)
            let that=this;
            let data = {
                ids: that.dataList,
                groupId: Number(that.groupId)
            }
            console.log(typeof data.groupId)
            let url = '/topic/addHot'
            console.log('jdiosjdiosajdsioajdiosa',data)
            this.$http.post({
                isJson:false,
                url:url,
                params:data,
                success:res => {
                    that.$message({
                        message: '操作成功',
                        type: 'success',
                        onClose: () => {
                            that.$router.go(-1);
                        },
                        duration: 2000
                    });

                    that.submitDisable = false;
                }
            });
        },
        // 以下为必备函数
            beforeCommit(param) {

            },
            changeStatus(row){
                console.log('1111111',row.status)
                
                let data = {
                    id:row.id,
                    status:row.status == 1 ? 2 : 1, //0已删除  1正常显示  2待发布--圈子
                }
                this.editType="status";
                let url=this.api[this.editType]
                this.$http.post({
                    isJson:false,
                    url:url,
                    params:data,
                    success:res => {
                        console.log('222222',res)
                            if(res.msg === 'OK'){
                                this.$message({
                                type: "success",
                                message: "操作成功",
                            });
                            row.status = row.status == 1 ? 2 : 1;
                        }
                    }
                });
            },


            handleAdd(param,row) {
                param.needNew = true; //打开新页面
                this.editInfo = {};
                this.$router.push({
                    path: "/circle/hotTopic/edit",
                    query: {
                        type: 'add',
                    }
                });

            },
            handleEdit(param, row) {
                param.needNew = true; //打开新页面
                this.editInfo = row;
                
                // let res=row.data.list
                console.log('2222222',row)
                this.$router.push({
                    path: "/circle/gambit/edit",
                    query: {
                        type: 'edit',
                        id: row.id,
                        name: row.name,
                        description: row.description,
                        groupId:row.groupId
                    }

                });
            },
            handleStatus(param, row){
                var that = this;
                console.log(that.cols)
                let data = {
                    id:row.id,
                    status:row.status == 0?1:0,
                }
                that.editType="update";
                that.$http.post(that.api[that.editType],  data, (data, res) => {
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
                
            }
    }
};
</script>
<style scoped>
    .publish{
        width: 120px;
    }
</style>
