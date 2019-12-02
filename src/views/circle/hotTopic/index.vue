<template>
<div class="app-container">
    <div class="groupName">当前所在圈子：{{groupName}}</div>
    <my-table :api="api" :cols="cols" :groupId="groupId" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd='true' @handleAdd="handleAdd" @handleEdit="handleEdit">

        <!-- 表格 列 -->
        <div slot="columns">

            <el-table-column align="center" v-if="col.type === 'url'" v-for="col in cols" :key="col.field" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <audio id="audio1" v-show="scope.row[scope.column.property]" preload="none" :src="getUrl(scope.row[scope.column.property])" style="width:200px" controls="controls"></audio>
                </template>
            </el-table-column>

            <el-table-column align="center" v-else-if="col.type === 'img'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <a @click="setSrc(scope.row[scope.column.property])">
                        <img :src="scope.row[scope.column.property]" class="header_pic" /></a>
                </template>
            </el-table-column>

            <el-table-column :label="col.label" v-else-if="col.type == 'status'" align="center">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-switch :plain="true" :value="scope.row['status']" @change="changeStatus(scope.row)" :active-value="1" :inactive-value="2"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-button-group>
                </div>
            </el-table-column>

            <el-table-column :label="col.label" v-else-if="col.type == 'hot'" align="center">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-switch :plain="true" :value="scope.row['hot']" @change="changeHot(scope.row)" :active-value="1" :inactive-value="0"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-button-group>
                </div>
            </el-table-column>

            <el-table-column align="center" v-else-if="col.type === 'indexs'" type="index" :formatter="col.formatter" :prop="col.field" label="排序" :width="50"></el-table-column>

            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width"></el-table-column>


            <el-table-column label="操作" align="center" width="120">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="cancel(scope.row)">取消热议</el-button>
                    </el-button-group>
                </div>
            </el-table-column>
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
                cancel: "/topic/removeHot",  //取消热议话题
                add: "/topic/list",
                edit: "/topic/update",
                update:"/topic/update",
                status:'/topic/changeStatus', //话题状态改变
                sort:'/topic/rank'
            },
            // id 字段
            idField: "id",
            groupId:false,
            // 表头字段
            cols: [
                {field: "indexs",label: "排序",type:"indexs"},
                {field: "name",label: "话题名称"},
                {field: "id",label: "话题id",},
                {field: "description",label: "简介",},
                {field: "createTime",label: "创建时间",width:"152"},
                {field: "pv",label: "浏览数",},
                {field: "attentionCount",label: "关注人数",},
                {field: "postCount",label: "发帖数",},
                {field: "status",label: "小程序端是否显示",type:'status'},
                {field: "hot",label: "'热门'角标",type:'hot'}
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
            groupName:false,    //当前所在圈子名称
        };
    },

    activated(){
        let query=this.$router.currentRoute.query
        this.groupId = query.groupId
        this.groupName = query.groupName
    },

    methods: {
            // 取消热议
            cancel(row){
                console.log('row',row);
                let params = {
                    ids:[row.id],
                    groupId:row.groupId
                };
                this.$http.post({
                    isJson:false,
                    url:this.api.cancel,
                    params:params,
                    success:res=>{
                        if(res.code == 0){
                            this.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            this.$refs.table.refreshTable();
                        }
                        
                    }
                })
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

            // 热门角标
            changeHot(row){
                console.log('1111111',row.hot)
                
                let data = {
                    id:row.id,
                    hot:row.hot == 1 ? 0 : 1, //0已删除  1正常显示  2待发布--圈子
                }
                this.$http.post({
                    isJson:false,
                    url:'/topic/changeHot',
                    params:data,
                    success:res => {
                        console.log('222222',res)
                            if(res.msg === 'OK'){
                                this.$message({
                                type: "success",
                                message: "操作成功",
                            });

                            row.hot = row.hot == 1 ? 0 : 1;
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
                        groupId:this.groupId,
                        topicType:1,
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
            delete(param,row){

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
.groupName{
    color: #666;
    font-size: 18px;
    line-height: 32px;
}
</style>
