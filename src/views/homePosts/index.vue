<template>
    <div class="app-container">
        <el-row type="flex" class="table-foot">
            <el-col align="right">
                <el-button-group>
                    <el-button type="primary" @click="postAdd">添加</el-button>
                    <el-button type="success" @click="refreshTable">刷新</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table v-loading="loading" element-loading-text="正在加载中" :data="tableData" :border="true" v-if="tableData"  @selection-change="selectChange" @sort-change="sort" style="width: 100%;margin-top:8px;">
            <el-table-column type="selection" width="35" align="center"></el-table-column>
            <!-- 缩略图 -->
            <el-table-column v-for="col in cols" :key="col.index" v-if="col.field === 'firstImg'" align="center" :prop="col.field" :label="col.label" width="100px">
                <template slot-scope="scope">
                    <div v-if="scope.row.firstImg">
                        <img :src="scope.row.firstImg" class="header_pic" />
                        <span style="font-size:16px;">{{scope.row.remainImgCount == 0 ? '' : scope.row.remainImgCount}}</span>
                    </div>
                    <span v-else>无图</span>
                </template>
            </el-table-column>

            <el-table-column align="center" v-else-if="col.field === 'status'" :prop="col.field" :label="col.label" :width="col.width">
                <template slot-scope="scope">
                    <div v-if="scope.row.status == 1">已置顶</div>
                    <!-- <div v-else-if="scope.row.status == 0 && scope.row.startTime && new Date().getTime() < new Date(scope.row.startTime).getTime()">待上架</div> -->
                    <div v-else-if="scope.row.status == 0 && scope.row.startTime && new Date().getTime() < new Date(scope.row.startTime).getTime()">待置顶</div>
                    <div v-else>未置顶</div>
                </template>
            </el-table-column>

            <!-- 文本 -->
            <el-table-column v-else-if="col.field === 'content'" :prop="col.field" :label="col.label" sortable='custom' align="center" width="250px">
                <template slot-scope="scope">
                    <el-button type="text" @click="text(scope.row)" style="color:#606266">{{scope.row.content}}</el-button>
                </template>
            </el-table-column>

            <!-- 评论 -->
            <el-table-column v-else-if="col.field === 'commentCount'" :prop="col.field" :label="col.label" sortable='custom' align="center" :width="col.width" >
                <template slot-scope="scope">
                    <router-link :to="{name:'searchComment',query:{postId:scope.row.id}}"><div style="color:#87C3E6;">{{scope.row.commentCount}}</div></router-link>
                </template>
            </el-table-column>
            
            <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width"></el-table-column>

            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button-group>
                        <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.row)">设排序分</el-button> -->
                        <!-- <el-button size="mini" type="warning" v-if="scope.row.recommended == 0" @click="handleTop(scope.row)">推荐</el-button> -->
                        <!-- <el-button size="mini" type="warning" v-if="scope.row.recommended == 1" @click="cancleTop(scope.row)">取消推荐</el-button> -->
                        <el-button size="mini" type="primary" @click="postEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" v-if="scope.row.status == 0"  @click="handleStatus(scope.row)">置顶</el-button>
                        <el-button size="mini" type="danger" v-else @click="handleStatus(scope.row)">取消置顶</el-button>
                        <!-- <el-button size="mini" type="primary" @click="postDetail(scope.row)">详情</el-button> -->
                        <!-- <el-button size="mini" type="danger" @click="delTK(scope.row)" :disabled="scope.row.deleteStatus != 0">删除</el-button> -->
                        <!-- <el-button size="mini" type="info" @click="handlerecord(scope.row)">操作记录</el-button> -->
                    </el-button-group>
                </template> 
            </el-table-column>
        </el-table>
        

        <!-- 文本详情 -->
        <el-dialog title="文本详情" :visible.sync="contentShow" width="800px">
            <div>{{textContent}}</div>
        </el-dialog>



    </el-form>

    <el-row type="flex" class="table-foot">
        <el-col :span="12" align="left">
            <el-button type="danger" size="small" @click="delPopout" icon="el-icon-delete">批量删除</el-button>
        </el-col>
        <el-col align="right">
            <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle" :current-page="startPage" :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
        </el-col>
    </el-row>

    
    </div>
</template>
<script>
export default {
    data(){
        return{
            api:{
                list:'/postStickIndex/list',  
                add:'/homePosts/edit',
                edit:'/homePosts/edit',
                stick:'/postStickIndex/status', // 置顶/取消置顶
                del:'/postStickIndex/delete'      
            },
            loading:true,   //loading
            pageSize:20,
            startPage:1,
            totalNum:0,
            small: true, //小屏幕
            tableData:false,
            inputData:{},
            cols: [
                {field: "id",label: "帖子ID"},
                {
                    field: "status",      //置顶状态 0：未置顶 1：已置顶
                    label: "置顶状态",
                    // formatter:((row, column, cellValue, index)=>{
                    // switch(cellValue){
                    //     case 0:
                    //         return '未置顶'
                    //         break;
                    //     case 1:
                    //         return '已置顶'
                    //         break;
                    //     default:
                    //         return '未置顶'
                    // }
                //  })
                },
                {field: "indexs",label: "置顶位置",},
                {field: "firstImg",label: "缩略图"},
                {field: "content",label: "文本"},
                {field: "userName",label: "用户"},
                {field: "groupName",label: "圈子来源",},
                {field: "topicName",label: "话题来源"},
                {field: "commentCount",label: "评论",width:'75'},
                {field: "likeCount",label: "抱抱",width:'75'},
                {field: "pv",label: "浏览量",width:'75'},
                {field: "startTime",label: "置顶时间",width:'152'},
                {field: "endTime",label: "取消置顶时间",width:'152'},

            ],
            contentShow:false,  //文本详情对话框是否显示
            textContent:'',     //文本详情
            selection:false,

        }
    },
    async activated(){
        this.getData()
    },
    methods:{
        // 批量删除
        bulkDel(){
            this.$http.post({
                isJson:true,
                url:this.api.del,
                params:this.selection,
                success:res=>{
                    if(res.code == 0){
                        this.$message({
                            message:'删除成功',
                            type:'success'
                        })
                        this.getData()
                        this.selection = false;
                    }else{
                        this.$message({
                            message:res.msg,
                            type:'error'
                        })
                    }
                }
            })
        },
        // 确认是否删除
        delPopout(){
            this.$confirm('请确认是否要进行删除操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.bulkDel()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 置顶
        handleStatus(row){
            this.$http.post({
                isJson: true,
                url:this.api.stick,
                params:{
                    stickRecordId: row.stickRecordId,
                    status: row.status == 0 ? 1 : 0 // 0:未置顶1:已置顶
                },
                success: res=>{
                    if(res.code == 0){
                        if(row.status == 0){
                            this.$message({
                                message:'置顶成功，但是取消置顶时间小于当前时间，请重新编辑时间',
                                type:'success'
                            })
                        }else{
                            this.$message({
                                message:'已成功取消置顶',
                                type:'success'
                            })
                        }

                        // row.status = row.status == 0 ? 1 : 0; 
                        this.getData()
                    }else{
                        this.$message({
                            message:res.msg,
                            type:'error'
                        })
                    }
                }
                
            })
        },

        // 获取表格数据
        getData(){
            this.inputData = {
                pageSize:20,
                startPage:1
            }
            this.loading = true;
            this.$http.get({
                isJson:false,
                url:this.api.list,
                params:this.inputData,
                success: res=>{
                    console.log(res)
                    if(res.data.list){
                        this.tableData = res.data.list  
                        this.totalNum = res.data.total
                        this.loading = false
                        // console.log('嘤嘤嘤',this.tableData)                          
                    }else{
                        this.$message('抱歉暂无数据')
                        this.tableData = false;
                        this.loading = false
                    }
                }
            })
        },

        // 添加
        postAdd(){
            this.$router.push({
                path:this.api.add,
                query:{
                    type:'add'
                }
            })
        },

        // 编辑帖子
        postEdit(row){
            this.$router.push({
                path:this.api.edit,
                query:{
                    type:'edit',
                    postDetail:JSON.stringify(row)
                }
            })
        },

        // 选中数据
        selectChange(selection){
            // this.selection = selection; 
            let arr = [];
            if(selection){
                selection.map( (v,i)=>{
                    arr.push(v.stickRecordId)
                })
            }
            this.selection = arr;
        },

        // 分类排序
        sort(options){
            console.log(1111111111,options)
            if(options.prop !== 'content'){
                if(options.order == 'descending'){
                    this.orderBy =`${options.prop} desc`;
                }else{
                    this.orderBy =`${options.prop} asc`;
                }
            }else{
                if(options.order == 'descending'){
                    this.orderBy =`length desc`;
                }else{
                    this.orderBy =`length asc`;
                }
            }
            
            this.inputData.order = this.orderBy;
            this.getData()
        },

        // 文本弹框
        text(row){
            this.contentShow = true;
            this.textContent = row.content;
        },

        sizeChangeHandle(size) {
            //分页大小发生变化
            console.log(size)
            this.inputData.pageSize = size
            this.pageSize = size
            this.getData()
        },

        currentChangeHandle(currentPage) {
            //页数发生变化
            this.inputData.startPage = currentPage
            this.getData()
        },

        //刷新
        refreshTable() {
          this.startPage = 1
          this.pageSize = 20
          this.inputData = {
              startPage: 1,
              pageSize: 20
          }
          this.getData()
        },

    }
}

</script>
<style  scoped>
    .app-container{
        color: #999;
    }
    
</style>

