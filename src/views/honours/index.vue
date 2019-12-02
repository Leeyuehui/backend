<template>
<div class="app-container">
    <el-row >
        <el-col align="right">
            <el-button-group>
                <el-button type="primary" @click="add">添加</el-button>
                <el-button type="success" @click="refresh">刷新</el-button>
            </el-button-group>
        </el-col>
    </el-row>

    <el-table :data="tableData" v-loading="loading" element-loading-text="正在加载中" :border="true" v-if="tableData" style="width: 100%">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->

        <el-table-column  v-if="col.field === 'cover'" v-for="col in cols" :key="col.field" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width" align="center">
            <template slot-scope="scope">
                <img :src="scope.row.cover" alt="图片" width="80" height="80" />
            </template>
        </el-table-column>

        <el-table-column  v-else-if="col.field === 'id'"  :formatter="col.formatter" :prop="col.field" :label="col.label" width="120" align="center">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="toSee(scope.row.id)">查看荣誉用户</el-button>
            </template>
        </el-table-column>

        <el-table-column v-else :formatter="col.formatter" :prop="col.field" :label="col.label" align="center" :width="col.width"></el-table-column> 

        <el-table-column label="操作" align="center" width="250">
            <template slot-scope="scope">
                <el-button-group>
                    <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="success" @click="addUser(scope.row.id)">添加用户</el-button>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
        <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle" :current-page="postData.startPage" :page-sizes="[20, 30, 50, 100]" :page-size="postData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
    </div>

    <!-- 添加弹框 -->
    <el-dialog title="新增/编辑荣誉称号资料" :visible.sync="addShow" width="60%">
        <el-form :model="addHonor" :rules="rules" ref="ruleForm" label-width="110px">
            <el-form-item label="荣誉标识" prop="cover">
                <my-upload functionName="upload" :model.sync="addHonor.cover" type='img'></my-upload>
            </el-form-item>
            <el-form-item label="荣誉称号" prop="title">
                <el-input v-model="addHonor.title" placeholder="请输入荣誉称号"></el-input>
            </el-form-item>
            <el-form-item label="称号介绍文案" prop="description">
                <el-input type="textarea" v-model="addHonor.description" placeholder="请输入60字以内的荣誉称号介绍文案" maxlength="60"></el-input>
            </el-form-item>
            <el-form-item label="称号字体色值" prop="fontRgb">
                <el-color-picker v-model="addHonor.fontRgb"></el-color-picker>
            </el-form-item>
            <el-form-item label="背景色色值" prop="bgRgb">
                <el-color-picker v-model="addHonor.bgRgb"></el-color-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="addShow = false">取消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 添加用户弹框 -->
    <el-dialog title="添加获得荣誉称号的用户" :visible.sync="addUserShow" width="30%">
        <el-form label-width="80px">
            <el-form-item label="*荣誉用户">
                <el-input v-model="addHonorUser.id" placeholder="请输入用户ID,多个用户用'-'隔开'" style="width:250px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="clearAddUser">取消</el-button>
                <el-button type="primary" @click="sureAddUser">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 荣誉用户弹框 -->
    <el-dialog title="荣誉用户" :visible.sync="honorShow" width="60%">
        <!-- 荣誉用户详情 -->
        <el-table :data="honorUser" v-loading="loading" element-loading-text="正在加载中" :border="true" style="width: 100%">
            <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
            <el-table-column prop="userHead" label="头像" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.userHead" alt="头像" width="80" height="80" />
                </template>    
            </el-table-column> 
            <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="250">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="danger" @click="untieUser(scope.row.userId)">解绑用户</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <el-button type="text" v-if="hasNextPage" @click="toLoad">{{loadMore}}</el-button>
    </el-dialog>

</div>
</template>
<script>
import MyUpload from "@/components/MyUpload";
export default {
    components:{
        MyUpload
    },
    data(){
        return{
            loading:true,
            tableData:false,
            totalNum: 0, // 总数
            small: true, //小屏幕
            api:{
                list:'/honor/list',
                toSee:'/honor/queryRefByHonor', //查看荣誉用户
                add:'/honor/add',
                addU:'/honor/addRef',    //添加用户
                edit:'/honor/update',      
                untieUser:'/honor/removeRef',  //解绑用户
            },
            cols:[
                {field: 'cover', label:'荣誉标识',width:''},
                {field: 'title', label:'荣誉称号',width:''}, 
                {field: 'description', label:'介绍文案',width:'' },
                {field: 'bgRgb', label:'横条色值',width:'',},
                {field: 'fontRgb', label:'字体色值' },
                {field: 'id', label:'荣誉用户' },
                {field: 'createTime', label:'荣誉标识创建时间' },
                {field: 'updateTime', label:'荣誉标识更新时间' },
            ],
            postData:{  //列表请求条件
                pageSize: 20,
                startPage: 1,
            }, 
            addShow: false, //  添加弹框，默认隐藏
            honorShow: false,   // 荣誉用户弹框，默认隐藏
            addUserShow: false, //添加荣誉用户弹框，默认隐藏
            honorUser:false,    //荣誉用户list
            honorPost:{     //荣誉用户请求条件
                startPage:1,
                pageSize:10
            },
            loadMore:'加载更多...',
            hasNextPage:false,  //荣誉用户下一页
            addHonorUser:{},    //荣誉用户
            addHonor:{},    // 荣誉称号添加list

            rules: {
                cover: [{ required: true, message: '请输入荣誉标识', trigger: 'blur' }],
                title: [{ required: true, message: '请输入荣誉名称', trigger: 'blur' }],
                description: [{ required: true, message: '请输入称号介绍文案', trigger: 'blur' }],
                fontRgb: [{ required: true, message: '请输入称号字体色值', trigger: 'blur' }],
                bgRgb: [{ required: true, message: '请输入背景色色值', trigger: 'blur' }],
            }
        }
    },
    methods:{
        // 添加荣誉称号
        add(){
            this.clearHonor();
            this.addShow = true;
        },
        // 编辑荣誉称号
        edit(row){
            this.clearHonor();
            // console.log(row)
            this.addShow = true;
            this.addHonor = row;
        },
        // 点击确定(新增/编辑荣誉称号)
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.addHonor.id){
                        this.postHornor(this.api.edit);
                    }else{
                        this.postHornor();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 添加荣誉称号
        postHornor(type){
            type = type ? type : this.api.add;
            this.$http.post({
                isJson:true,
                url:type,
                params: this.addHonor,
                success: res=>{
                    if(res.code == 0){
                        this.$message({
                            message:'新增/编辑荣誉称号资料成功',
                            type:'success'
                        })
                        this.addShow = false;
                        this.clearHonor();
                        this.getData();
                    }else{
                        this.$message({
                            message: res.msg,
                            type:'error'
                        })
                    }
                }
            })
        },
        // 重置荣誉称号数据
        clearHonor(){
            this.addHonor = {
                fontRgb:'',
                cover:'',
                title:'',
                bgRgb:'',
                description:''
            }
        },
        // 添加用户
        addUser(honorId){
            this.addUserShow = true;
            this.addHonorUser.honorId = honorId;
        },
        //点击取消(添加用户)
        clearAddUser(){
            this.addUserShow = false;
            this.addHonorUser.id = '';
        },
        // 点击确定(添加用户)
        sureAddUser(){
            let userIds = this.addHonorUser.id.split('-');
            console.log(userIds)
            // return
            const data ={
                honorId: this.addHonorUser.honorId,
                userIds:userIds
            }
            this.$http.post({
                isJson: true,
                url: this.api.addU,
                params:data,
                success: res=>{
                    if(res.code == 0){
                        this.$message({
                            message:'添加用户成功',
                            type:'success'
                        })
                        this.clearAddUser()
                    }else{
                        this.$message({
                            message:res.msg,
                            type:'error'
                        })
                    }
                }
            })
        },
        //加载更多
        toLoad(){
            ++this.honorPost.startPage;
            this.toSee();
        },
        // 解绑用户
        untieUser(userId){
            const data = {
                userIds:[userId],
                honorId:this.honorPost.honorId
            }
            this.$http.post({
                isJson:true,
                url:this.api.untieUser,
                params:data,
                success: res=>{
                    if(res.code == 0){
                        this.$message({
                            message:'解绑用户成功',
                            type:'success'
                        })
                        this.toSee(this.honorPost.honorId)
                    }else{
                        this.$message({
                            message:res.msg,
                            type:'error'
                        })
                    }
                }
            })
        },
        // 查看荣誉用户详情
        toSee(honorId){
            if(honorId){
                this.honorPost.startPage = 1;
            }

            this.loadMore = '加载ing...'
            this.honorPost.honorId = honorId ? honorId : this.honorPost.honorId;
            this.$http.post({
                isJson:true,
                url:this.api.toSee,
                params:this.honorPost,
                success: res=>{
                    if(res.code == 0){
                        if(this.honorPost.startPage > 1){
                            this.honorUser = this.honorUser.concat(res.data.list)
                        }else{
                            this.honorUser = res.data.list;
                        }
                        
                        this.hasNextPage = res.data.hasNextPage;
                        this.loadMore = '更多加载...'
                        this.honorShow = true;
                    }else{
                        this.$message({
                            message:res.msg,
                            type:'error'
                        })
                    }
                }
            })
            

        },

        // 刷新
        refresh(){
            this.postData = {
                pageSize: 20,
                startPage: 1
            }
            this.getData()
        },
        // 获取列表数据
        getData(){
            this.loading = true;
            this.$http.post({
                isJson: true,
                url:this.api.list,
                params:this.postData,
                success: res=>{
                    if(res.code == 0){
                        this.tableData = res.data.list;
                        this.totalNum =res.data.total;
                        this.loading = false;
                    }
                }
            })
        },
        sizeChangeHandle(size) {
            this.postData.pageSize = size;
            //分页大小发生变化
            this.getData()
        },

        currentChangeHandle(currentPage) {
            this.postData.startPage = currentPage;
            //页数发生变化
            this.getData()
        },

    },
    activated(){
        this.getData();
    }
}
</script>
<style scoped>
    .app-container{
        color: #999;
    }
</style>
 