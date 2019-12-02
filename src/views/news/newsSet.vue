<template>
<div class="app-container">
    <el-row type="flex" class="table-foot">
        <el-col align="right">
            <el-button  type="primary" @click="changeRank">更改排序</el-button>
            <el-button  type="success" @click="refreshTable">刷新</el-button>
        </el-col>
    </el-row>
    <el-form :inline="true"  class="demo-form-inline"> 
        <el-table v-loading="loading" element-loading-text="正在加载中" :data="tableData" :border="true" v-if="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="排序" align="center" width="100"></el-table-column>
            <el-table-column align="center" prop="id" label="ID"></el-table-column>
            <el-table-column align="center" prop="trigger" label="触发条件"></el-table-column>
            <el-table-column align="center" prop="item" label="删除理由"></el-table-column>
            <el-table-column prop="descripition" label="消息文案-可编辑部分" align="center" >
                <template slot-scope="scope">
                    <el-button type="text" @click="text(scope.row)" style="color:#606266">{{scope.row.descripition}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="ccc" label="消息文案-固定部分" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="text(scope.row)" style="color:#606266">{{scope.row.ccc}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="link" label="跳转链接" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
           
            <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="success" @click="postEdit(scope.row)">编辑</el-button>
                    </el-button-group>
                </template> 
            </el-table-column>
        </el-table>

        <!-- 添加编辑消息内容弹框 -->
        <el-dialog title="编辑" :visible.sync="dialogFormVisible" :lock-scroll="false"  @close="handleClose">
            <el-form :model="formLabelAlign" class="demo-ruleForm">
                <el-form-item label="消息内容">
                    <el-input  type="textarea" v-model="formLabelAlign.descripition" placeholder="输入消息文本" clearable style="width:300px;height:80px;"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接">
                    <el-input v-model="formLabelAlign.link" placeholder="跳转URL" clearable style="width:300px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postNews">确定</el-button>
            </div>
        </el-dialog>

        <!-- 更改排序弹框 -->
        <el-dialog title="更改排序" :visible.sync="rankShow">
            <p style="margin-bottom:20px;font-size:16px;">输入后该数据会插入到该位置</p>
            <el-form :model="formLabelAlign" class="demo-ruleForm">
                <el-form-item>
                    <el-input v-model="triggerNum" clearable style="width:300px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitRank">确定</el-button>
            </div>
        </el-dialog>

        <!-- 消息内容弹框 -->
        <el-dialog title="消息内容详情" :visible.sync="textShow">
            <div>{{textContent}}</div>
        </el-dialog>

    </el-form>

    <el-row type="flex" class="table-foot">
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
            loading:true,   //loading
            tableData: false,
            pageSize: 20, //每页大小
            startPage: 1, //当前页
            totalNum: 0, // 总数
            small: true, //小屏幕
            // isShow:false,              //点击添加按钮为true， 编辑为false，默认为false
            dialogFormVisible:false, // 添加弹出框
            formLabelAlign:{},      //消息内容
            textShow:false,         //消息内容弹框
            textContent:'',      //消息内容
            multipleSelection:[], //选中的item
            triggerNum:'',        //更改的排序值
            rankShow:false,       //排序更改弹窗显示
        }
    },
    activated(){
        this.getData()
    },
    methods:{
        // 消息内容弹框
        text(row){
            this.textShow = true;
            this.textContent = row .content
        },
        //更新消息
        postNews(){
            let formData = {
                descripition:this.formLabelAlign.descripition,
                id:this.formLabelAlign.id,
                link:this.formLabelAlign.link,
            }
            this.$confirm('是否确认更新此消息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post({
                    isJson:true,
                    url:'/dealReason/update',
                    params:formData,
                    success: res=>{
                        if(res.code == 0 && res.data == 1){
                            this.$message({
                                message:'更新成功',
                                type:'success'
                            })
                            this.dialogFormVisible = false;
                            this.getData();
                        }
                    }
                })
            }).catch(() => {
                        
            });
        },
        //更改排序确定
        submitRank(){
            let num = this.triggerNum;
            if(num){
                let formData = {
                    id:this.multipleSelection[0].id,
                    num:num,
                }
                this.$confirm('是否确认更改此排序', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post({
                        isJson:true,
                        url:'/dealReason/rank',
                        params:formData,
                        success: res=>{
                            if(res.code == 0 && res.data == 1){
                                this.$message({
                                    message:'更改成功',
                                    type:'success'
                                })
                                this.rankShow = false;
                                this.getData();
                            }
                        }
                    })
                }).catch(() => {
                            
                });
            }else{
                this.$message({
                    message:'请输入更改的排序值',
                    type:'warning'
                })
            }
        },
        //选中的item
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //更改排序
        changeRank(){
            let list = this.multipleSelection;
            let len = list.length;
            if(list && len){
                if(len == 1){
                    this.rankShow = true;
                }else{
                    this.$message({
                        message:'只可选择一条消息设置',
                        type:'warning'
                    })
                }
            }else{
                this.$message({
                    message:'请先选择一条需要更改的消息',
                    type:'warning'
                })
            }
        },
        // 编辑帖子
        postEdit(row){
            this.dialogFormVisible = true;
            this.formLabelAlign = row;
        },
        
        // 获取表格数据
        getData(){
            this.loading = false
            let inputData={       //表格传参数据
                pageSize: this.pageSize,
                startPage: this.startPage,
                type:1    //type 0：模板消息 1：系统消息
            }
            this.$http.post({
                isJson:true,
                url:'/dealReason/list',
                params:inputData,
                success: res=>{
                    console.log(res)
                    if(res.data.list){
                        let list = res.data.list
                        for(let i = 0;i < list.length;i++){
                            list[i].trigger = '管理员删除';
                            list[i].ccc = '删除的内容：#被删除内容的文本前30字#';
                        }
                        this.tableData = res.data.list  
                        this.totalNum = res.data.total
                        this.loading = false
                        // console.log('嘤嘤嘤',this.tableData)
                    }else{
                        this.$message('抱歉暂无数据')
                        this.tableData = false
                        this.loading = false
                    }
                }
            })
        },

        //刷新
        refreshTable() {
          this.startPage = 1
          this.pageSize = 20
          this.getData()
        },

        sizeChangeHandle(size) {
            //分页大小发生变化
            this.pageSize = size
        },

        currentChangeHandle(currentPage) {
            //页数发生变化
            this.startPage = currentPage
            this.getData()
        },

    }
}

</script>
<style  scoped>
    .app-container{
        color: #999;
    }
    .toTop{
        margin-left: 50px;
    }
    .marginTop{
        margin-top: 50px;
    }
    .margin-right{
        margin-right: 20px;
        color: #606266;
    }
    .el-input{
        width: 200px;
    }
    .el-button{
        margin-left: 0px;
        white-space: pre-wrap
    }
    .table-foot,.demo-form-inline{
        margin-top: 10px;
    }
    .el-form-item{
        display: block;
    }
</style>
