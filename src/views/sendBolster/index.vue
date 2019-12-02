<template>
<div class="app-container">
    <el-row >
        <el-col align="right">
            <el-button type="primary" @click="isShow = true" style="width:120px;">发抱枕</el-button>
            
        </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table v-loading="loading" element-loading-text="正在加载中" :data="tableData" :border="true" v-if="tableData" style="width: 100%;margin-top:8px;">
        <!-- <el-table-column type="selection" width="35" align="center"></el-table-column> -->
        <el-table-column prop="createTime" label="发抱枕时间" align="center"></el-table-column>
        <el-table-column prop="userIds" label="收抱枕用户" align="center"></el-table-column>
        <el-table-column prop="amount" label="抱枕数量(每人)" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
    </el-table>

    <el-dialog title="发抱枕" :visible.sync="isShow" width="25%" :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
            <el-form-item label="收抱枕用户" prop="userIds">
                <el-input v-model="form.userIds"></el-input>
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

    <div class="block">
        <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle" :current-page="startPage" :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            api:{
                list:'/user/queryPillowRecords',    
                send:'/user/sendPillows'    //送抱枕
            },
            loading:true,
            tableData:false,
            startPage:1,
            pageSize:20,
            totalNum: 0, // 总数
            small: true, //小屏幕
            isShow:false,   // 对话框默认隐藏
            form:{},    //发抱枕对话框
            rules: {
                userIds: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
                amount: [{ required: true, message: '请输入抱枕数量', trigger: 'blur' }],
            }
        }
    },
    methods:{
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sendBolster()
                    // this.resetForm('form')
                } else {
                    return false;
                }
            });
        },
        // 关闭对话框
        handleClose(){
            this.isShow = false;
            this.clearForm()
        },

        clearForm(){
            this.form = {
                userIds:'',
                amount:'',
                remark:''
            }
        },

        getData(){
            this.loading = true;
            let data ={
                startPage: this.startPage,
                pageSize:this.pageSize
            }

            this.$http.get({
                isJson:false,
                url:this.api.list,
                params:data,
                success: res=>{
                    if(res.data.list){
                        this.tableData = res.data.list;
                        this.totalNum = res.data.total;
                    }

                    this.loading = false;
                }
            })
        },
        // 发抱枕
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

                        this.startPage = 1;
                        this.pageSize = 20;

                        await this.getData();
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
        //分页大小发生变化
        sizeChangeHandle(size) {
            this.pageSize = size;
            this.getData();
        },
        //页数发生变化
        currentChangeHandle(currentPage) {
            this.startPage = currentPage;
            this.getData();
        },
    },
    mounted(){
        this.getData()
    },
    // activated(){

    // }
}
</script>
<style scoped>
    .app-container{
        color: #999;
    }
</style>
