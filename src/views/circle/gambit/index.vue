<template>
<div class="app-container">
    <div class="groupName" v-if="groupId">当前所在圈子：{{groupName}}</div>

    <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd='true' @handleAdd="handleAdd" @handleEdit="handleEdit">

        <!-- 表格 列 -->
        <div slot="columns">
            <el-table-column align="center" v-if="col.type === 'url'" v-for="col in cols" :key="col.field" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <audio id="audio1" v-show="scope.row[scope.column.property]" preload="none" :src="getUrl(scope.row[scope.column.property])" style="width:200px" controls="controls"></audio>
                </template>
            </el-table-column>

            <el-table-column align="center" v-else-if="col.field === 'cover'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <a @click="setSrc(scope.row[scope.column.property])"><img :src="scope.row[scope.column.property]" class="header_pic" /></a>
                </template>
            </el-table-column>

            <el-table-column :label="col.label" v-else-if="col.type == 'type'" align="center">
                <div slot-scope="scope">
                    <el-button-group>
                        <!-- <el-button size="mini" type="danger" v-if="scope.row['type'] == 1")">普通话题</el-button> -->
                        <div v-if="scope.row['type'] == 1">普通话题</div>
                        <div v-if="scope.row['type'] == 2" class="red">热议话题</div>
                    </el-button-group>
                </div>
            </el-table-column>

            <el-table-column :label="col.label" v-else-if="col.field == 'postEnable'" align="center" :width="col.width">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-switch :plain="true" :value="scope.row.postEnable" @change="changePostEnable(scope.row)" :active-value="1" :inactive-value="0"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-button-group>
                </template>
            </el-table-column>

            <el-table-column :label="col.label" v-else-if="col.field == 'status'" align="center" :width="col.width">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-switch :plain="true" :value="scope.row['status']" @change="changeStatus(scope.row)" :active-value="1" :inactive-value="2"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-button-group>
                </template>
            </el-table-column>

            <el-table-column align="center" v-else-if="col.type === 'indexs'" type="index" :formatter="col.formatter" :prop="col.field" label="排序" :width="50"></el-table-column>

            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width"></el-table-column>


            <el-table-column label="操作" align="center" width="200">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="handleTopic(scope.row)">话题帖子</el-button>
                        <el-button size="mini" type="info" @click="handleUpdate(scope.row)">编辑资料</el-button>
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
                // delete:"/topic/remove",
                add: "/topic/add",
                edit: "/topic/update",
                update:"/topic/update",
                sort:'/topic/rank', //话题排序
                hotTopic:true  //显示编辑热议话题按钮
            },
            // id 字段
            idField: "id",
            groupId:false,
            // 表头字段
            cols: [
                {field: "indexs",label: "排序",type:"indexs"},
                {field: "id",label: "话题id",},
                {field: "cover",label: "封面图",},
                {field: "name",label: "话题名称"},
                {field: "description",label: "简介",},
                {field: "createTime",label: "创建时间",},
                {field: "pv",label: "浏览数",},
                {field: "attentionCount",label: "关注人数",},
                {field: "postCount",label: "发帖数",},
                // {field: "type",label: "状态",type:'type'},              //type1：普通 2：热议
                {field: "topicAdminName",label: "话题主",},
                {field: "postEnable",label: "显示发帖按钮",},
                {field: "status",label: "圈内发帖是否显示"}           // 状态：0：下架 1：上架
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
            groupName:false,  //当前所在圈名称
        };
    },

    activated(){
        let query=this.$router.currentRoute.query
        console.log('66666666',query)
        this.groupId = query.groupId
        this.groupName = query.groupName
    },

    methods: {
        //隐藏发帖按钮隐藏事件
        changePostEnable(row){
            console.log(row)
            let data = {
                id:row.id,
                status:row.postEnable == 0 ? 1 : 0, // 状态：0：不显示 1：显示
            }

            this.$http.post({
                isJson:true,
                url:`/topic/isPostEnable`,
                params:data,
                success: res => {
                    if(res.msg === 'OK' && res.code == 0){
                        this.$message({
                            type: "success",
                            message: "操作成功",
                        });
                        row.postEnable = row.postEnable == 1 ? 0 : 1;
                    }
                }
            });
        },
        // 以下为必备函数
        beforeCommit(param) {

        },

        // 跳转话题帖子
        handleTopic(row){
            // console.log('1111111111111111',row)
            this.$router.push({
                path:'/circle/topicPost',
                query:{
                    topicId:row.id,
                    groupName:this.groupName
                }
            })
        },

        changeStatus(row){
            console.log('1111111',row.status)
            
            let data = {
                id:row.id,
                status:row.status == 2 ? 1 : 2, // 状态：2：下架 1：上架
            }
            this.editType="status";
            let url='/topic/changeStatus'
            this.$http.post({
                isJson:false,
                url:url,
                params:data,
                success: res => {
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
                path: "/circle/gambit/edit",
                query: {
                    type: 'add',
                    groupId:this.groupId
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
                    groupId:row.groupId,
                    hotValue:row.hotValue,
                    cover:row.cover,
                    topicAdminId:row.topicAdminId,
                    radioTime:row.radioTime,
                    radioTitle:row.radioTitle,
                    radioUrl:row.radioUrl
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

        handleUpdate(row) {
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
.red{
    color: red
}
.groupName{
    color: #666;
    font-size: 18px;
    line-height: 32px;
}
</style>
