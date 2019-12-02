<template>

<div class="app-container">
    <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd='true' @handleAdd="handleAdd" @handleEdit="handleEdit">

        <!-- 表格 列 -->
        <div slot="columns">

            <el-table-column align="center" v-if="col.type === 'url'" v-for="col in cols" :key="col.field" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <audio id="audio1" v-show="scope.row[scope.column.property]" preload="none" :src="getUrl(scope.row[scope.column.property])" style="width:200px" controls="controls"></audio>
                </template>
            </el-table-column>

            <el-table-column align="center" v-else-if="col.type === 'indexs'" type="index" :formatter="col.formatter" :prop="col.field" label="排序" :width="50">

            </el-table-column>

            <el-table-column align="center" v-else-if="col.type === 'img'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <a @click="setSrc(scope.row[scope.column.property])">
                        <img :src="scope.row[scope.column.property]" class="header_pic" /></a>
                </template>
            </el-table-column>

            <el-table-column :label="col.label" v-else-if="col.field == 'postEnable'" align="center" :width="col.width">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-switch :plain="true" :value="scope.row.postEnable" @change="changePostEnable(scope.row)" :active-value="1" :inactive-value="0"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-button-group>
                </template>
            </el-table-column>

            <!-- <el-table-column label="状态" v-else-if="col.type == 'status'" align="center" :width="col.width">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-switch :plain="true" :value="scope.row['status']" @change="changeStatus(scope.row)" :active-value="1" :inactive-value="2"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-button-group>
                </div>
            </el-table-column>  -->

            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width"></el-table-column>


            <el-table-column label="操作" align="center" width="420">
                <div slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="handleTopic(scope.row)">圈内话题</el-button>
                        <el-button size="mini" type="primary" @click="handlePost(scope.row)">圈内帖子</el-button>
                        <el-button size="mini" type="primary" @click="groupBanner(scope.row)">圈内banner</el-button>
                        <el-button size="mini" type="info" @click="handleUpdate(scope.$index, scope.row)">编辑资料</el-button>
                        <el-button size="mini" type="warning" @click="handlePosted(scope.row)">发帖</el-button>
                        <!-- <el-button size="mini" type="danger" v-if="scope.row['status'] == 1" @click="handleStatus(scope.$index, scope.row)">下架</el-button>
                        <el-button size="mini" type="info" v-if="scope.row['status'] == 0" @click="handleStatus(scope.$index, scope.row)">上架</el-button> -->
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
                list:'/group/list',
                // delete: "/group/remove",
                add: "/group/add",
                edit: "/group/update",
                update:"/group/update",
                status:"/group/changeStatus",  //状态改变
                sort:'/group/rank',  //排序
            },
            // id 字段
            idField: "id",
            // 表头字段
            cols: [
                {field: "indexs",label: "排序",type:"indexs"},
                {field: "id",label: "圈子id",width:"70"},
                {field: "image",label: "封面图",type:'img',width:"100"},
                {field: "name",label: "圈名",width:"220"},
                {field: "description",label: "简介",},
                {field: "createTime",label: "创建时间",width:"152"},
                {field: "pv",label: "浏览数",width:"80"},
                {field: "joinCount",label: "加入人数",width:"80"},
                {field: "postEnable",label: "隐藏发帖按钮",},
                // {field: "status",label: "状态",type:'status',width:"70"},
                // {field: "id",label: "发帖数",}
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
        };
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
                url:`/group/isPostEnable`,
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
        //发帖
        handlePosted(row){
            this.$router.push({
                name:'posted',
                query:{
                    groupId:row.id,
                }
            })
        },
        // 圈内banner
        groupBanner(row){
            this.$router.push({
                path:'/circle/circleBanner',
                query:{
                    groupId:row.id,
                    groupName:row.name
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

        // 跳转至圈内话题
        handleTopic(row){
            // param.needNew = true; //打开新页面
            this.$router.push({
                path: '/circle/gambit',
                query: { 
                    groupId:row.id,
                    groupName:row.name
                }
            });
        },
        // 跳转至圈内帖子
        handlePost(row){
            // console.log('111',row)
            this.$router.push({
                path:'/circle/groupPost',
                query:{
                    groupId:row.id,
                    groupName:row.name
                }
            })
        },

        handleAdd(param) {
            param.needNew = true; //打开新页面
            this.editInfo = {};
            this.$router.push({
                path: "/circle/circleEdit",
                query: {
                    type: 'add'
                }
            });

        },
        handleEdit(param, row) {
            param.needNew = true; //打开新页面
            this.editInfo = row;
            
            // let res=row.data.list
            console.log('2222222',row)
            this.$router.push({
                path: "/circle/circleEdit",
                query: {
                    type: 'edit',
                    id: row.id,
                    image: row.image,
                    name: row.name,
                    description: row.description,
                    bgColor:row.bgColor
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

    