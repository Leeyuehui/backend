<template>
<div class="app-container">
    <el-form :inline="true"  class="demo-form-inline"> <!--  :model="formInline" -->
        <el-select v-model="userType" placeholder="请选择用户类型" clearable>
            <el-option v-for="item in optionsUser" :key="item.id" :label="item.name" :value="item.id"></el-option> 
        </el-select>
        <el-form-item label="">
            <el-input v-model="userId" type="number" placeholder="请输入用户ID" @keyup.enter="search" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-input v-model="mobile" type="number" placeholder="请输入用户手机号" @keyup.enter="search" clearable></el-input>
        </el-form-item>   
        <el-form-item label="">
            <el-input v-model="userName" placeholder="请输入用户昵称" @keyup.enter="search" clearable></el-input>
        </el-form-item>         
        <el-button type="primary" @click.enter="search">查询</el-button>
        <el-button type="primary" @click="clearRefresh">刷新</el-button>
        
        <el-table v-loading="loading" element-loading-text="正在加载中" :data="tableData" @sort-change="sort"  :border="true" v-if="tableData" style="width: 100%">
            <el-table-column prop="id" label="用户ID" align="center"></el-table-column>
            <el-table-column prop="userStatus" label="状态" align="center"></el-table-column>
            <el-table-column prop="name" label="昵称" align="center"></el-table-column>
            <el-table-column prop="headUrl" label="头像" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row[scope.column.property]" class="header_pic" />
                </template>
            </el-table-column>
            <el-table-column prop="unionId" label="unionID" align="center"></el-table-column>
            <el-table-column prop="postCount" label="发帖" sortable="custom" align="center" width="100px">
                <template slot-scope="scope">
                    <router-link target="_blank" :to="{name:'post',query:{userId:scope.row.id}}"><div style="color:#87C3E6;">{{scope.row.postCount}}</div></router-link>
                </template>
            </el-table-column>
            <el-table-column prop="commentCount" label="评论" sortable="custom" align="center" width="100px">
                <template slot-scope="scope">
                    <router-link target="_blank" :to="{name:'searchComment',query:{userId:scope.row.id}}"><div style="color:#87C3E6;">{{scope.row.commentCount}}</div></router-link>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>

            <el-table-column label="操作" align="center" width="200px">
                <template slot-scope="scope" >
                    <el-button-group v-if="scope.row.userType == 0">
                        <el-button size="mini" type="danger" @click="handleBan(scope.row,1)" v-if="scope.row.userStatus == '正常'">禁言</el-button>
                        <el-button size="mini" type="danger" @click="handleBan(scope.row,2)" v-else="scope.row.userStatus == '正常'">解禁</el-button>
                        <el-button size="mini" type="success" @click="handleDetail(scope.row)">详情</el-button>
                        <el-button size="mini" type="primary" @click="openBolster(scope.row)">发抱枕</el-button>
                    </el-button-group>
                    <el-button-group v-if="scope.row.userType == 1">
                        <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="success" @click="handleDetail(scope.row)">详情</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>   

        <!-- 编辑官方账号 -->
        <el-dialog title="更新" :visible.sync="editDialog" width="30%" center>
            <el-form :status-icon="true" ref="form" :rules="validRule" :model="editInfo" label-width="80px" size="medium">
                <el-form-item label="帐号头像" prop="headUrl">
                    <my-upload functionName="user" :model.sync="editInfo.headUrl" type="img"></my-upload>
                    <span>建议上传300*300尺寸的图片</span>
                </el-form-item>
                <el-form-item label="帐号昵称" prop="name">
                    <el-input type="text" v-model="editInfo.name" auto-complete="on"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogClick(false)">取 消</el-button>
                <el-button type="primary" @click="editDialogClick(true)">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 发抱枕 -->
        <el-dialog title="发抱枕" :visible.sync="isShow" width="25%" :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
            <el-form-item label="收抱枕用户" prop="userIds">
                <el-input v-model="form.userIds" disabled></el-input>
            </el-form-item>
            <el-form-item label="抱枕数量" prop="amount">
                <el-input v-model="form.amount"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" maxlength="100"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </span>
    </el-dialog>

    </el-form>
    
    <div class="block">
        <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle" :current-page="startPage" :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
    </div>

    
</div>
</template>
<script>
import MyUpload from "@/components/MyUpload";
export default {
    components: {
        MyUpload
    },
    data(){
        return{
            api:{
                list:'/user/queryPillowRecords',    
                send:'/user/sendPillows'    //送抱枕
            },
            loading:true,   //loading
            userId:"",    //用户id
            tableData: false,
            pageSize: 20, //每页大小
            startPage: 1, //当前页
            totalNum: 0, // 总数
            small: true, //小屏幕
            inputData:{},      //表格传参数据
            userType:'',       //用户类型
            optionsUser:[        //马甲   0：真实用户 1:官方用户
                {id:0,name:'真实用户'},
                {id:1,name:'官方用户'}
            ],
            editDialog:false,   //对话弹出框
            validRule: {        // 表单验证
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
            
            editInfo: {},   // 表单对象
            userName:'',    //用户昵称
            mobile:'',      // 手机号
            isShow:false,   //抱枕对话框默认隐藏
            form:{},    //发抱枕数据
            rules: {
                userIds: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
                amount: [{ required: true, message: '请输入抱枕数量', trigger: 'blur' }],
            }
        }
    },
    activated(){
        this.clearRefresh();

        let query = this.$router.currentRoute.query;
        if(query.userId && query.userType !== ''){
            this.userId = query.userId;
            this.userType = Number(query.userType);
            // console.log(this.userId,this.userType)
            this.search();
        }
        
    },
    methods:{
        // 打开送抱枕弹框
        openBolster(row){
            this.form.userIds = row.id;
            this.isShow = true;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sendBolster()
                } else {
                    return false;
                }
            });
        },
        //发抱枕数据重置
        clearForm(){
            this.form = {
                userIds:'',
                amount:'',
                remark:''
            }
        },
        // 关闭送抱枕对话框
        handleClose(){
            this.isShow = false;
            this.clearForm();
        },

        // 送抱枕
        sendBolster(){
            this.$http.post({
                isJson:true,
                url:this.api.send,
                params:this.form,
                success: async res=>{
                    if(res.code == 0){
                        this.isShow = false;
                        this.$message({
                            type:'success',
                            message:'送抱枕成功'
                        })

                        // await this.search();
                        this.clearForm();
                    }else{
                        this.$message({
                            type:'error',
                            message:res.msg
                        })
                    }
                }
            })
        },

        // 排序
        sort(options){
            console.log(1111111111,options)
            if(options.order == 'descending'){
                this.orderBy =`${options.prop} desc`;
            }else{
                this.orderBy =`${options.prop} asc`;
            }
            
            this.inputData.order = this.orderBy;
            this.getData()
        },

        //编辑
        handleEdit(row){
            this.editDialog = true;
            this.editInfo = row;
        },

        //编辑弹窗提交
        editDialogClick(type){
            let that = this;
            if(type){
                let param = {
                    headUrl: that.editInfo.headUrl,
                    id:that.editInfo.id,
                    name: that.editInfo.name,
                    type: 2
                }
                let tips = '是否确认更新资料？';
                that.$confirm(tips, {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$http.post('/virtualUser/update', param, (data, res) => {
                        that.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        that.editDialog = false;
                        this.getData();
                    });
                }).catch(() => {
                            
                });
            }else{
                that.editDialog = false;
            }
        },

        //清空搜索条件
        clearRefresh(){
            this.userId = '';
            this.mobile = '';
            this.userType = '';
            this.userName = '';
        },

        //搜索
        search(){
            if(!this.userType && this.userType !== 0){
                this.$message({
                    message:'请先选择用户类型',
                    type:'warning'
                })
                return
            }
            this.pageSize = 20
            this.startPage = 1

            this.inputData = {
                userId:this.userId,
                mobile:this.mobile,
                userType:this.userType,
                userName:this.userName,
                pageSize: 20,
                startPage: 1
            }

            this.getData()
        },
        // 获取表格数据
        getData(){
            this.loading = true
            this.$http.post({
                isJson:true,
                url:'/user/queryUserList',
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
                        this.tableData = false
                        this.loading = false
                    }
                }
            })
        },

        sizeChangeHandle(size) {
            //分页大小发生变化
            this.inputData.pageSize = size
            this.pageSize = size
            this.getData()
        },

        currentChangeHandle(currentPage) {
            //页数发生变化
            this.inputData.startPage = currentPage
            this.getData()
        },

        handleBan(row,num){
            if(num == 1){
                this.popover(row.id)
            }else{
                this.ban(row.id)
            }
        },

        handleDetail(row){
            console.log(row)
            const { href } =  this.$router.resolve({
                path:'/userManage/userDetail',
                query:{
                    userId:row.id
                }
            })
            window.open(href,'href')
        },

        // 禁言弹出框
        popover(userId){
            let message = '禁言后，该用户不能在社区发表任何内容:修改头像昵称、发表帖子、评论回复', hint
            this.$prompt(message,hint, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder:'请输入禁言天数',
                inputType:'number'
            }).then(({ value }) => {

                let reg = /^[1-9][0-9]{0,10}$/
                console.log(value,reg.test(value))
                if(!reg.test(value)){
                    this.$message({
                        message:'只允许输入大于0的整数',
                        type:'warning'
                    })
                    return
                }

                this.$http.post({
                    isJson:true,
                    url:`/user/banUser`,
                    params:{
                        userId:userId,
                        banDay:value
                    },
                    success: res=>{
                        console.log(res)
                        if(res.code != 0){
                            this.$message({
                                message:res.msg,
                                type:'warning'
                            })
                        }else{
                            this.$message({
                                type: 'success',
                                message: `已成功禁言${value}天`
                            });
                            this.getData()
                        }
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消禁言'
                });       
            });
        },

        //弹框解禁
        ban(userId){
            let message = '是否确定解禁', hint='提示'
            this.$confirm(message,hint, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(({ value }) => {
                this.$http.get({
                    isJson:false,
                    url:`/user/liftBanUser/${userId}`,
                    success: res=>{
                        this.$message({
                            type: 'success',
                            message: `已成功解禁`
                        });

                        this.getData()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消解禁'
                });       
            });
        }
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

</style>
