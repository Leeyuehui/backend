<template>
<div class="app-container">
    <div class="groupName" v-if="groupName">当前所在圈子：{{groupName}}</div>
    <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="">
            <el-input v-model="postId" placeholder="帖子ID" style="width:100px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-input v-model="postContent" placeholder="帖子文本内容" clearable></el-input>
        </el-form-item>  
        <el-form-item label="">
            <el-input v-model="userId" placeholder="发表用户ID" style="width:120px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-date-picker v-model="publishTime" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
        </el-form-item>    
        <el-select v-model="groupId" placeholder="选择圈子来源" style="width:150px;" clearable>
            <el-option v-for="item in optionsGroup" :key="item.id" :label="item.name" :value="item.id"></el-option> 
        </el-select>
        <el-select v-model="gambitId" placeholder="选择话题来源" @focus="getGambit" style="width:150px;" clearable>
            <el-option v-for="item in optionsGambit" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="vest" placeholder="选择用户类型" style="width:150px;" clearable>
            <el-option v-for="item in optionsVest" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="recommended" placeholder="是否被推荐" style="width:150px;" clearable>
            <el-option v-for="item in optionsRecommend" :key="item.id" :label="item.name" :value="item.id" ></el-option>
        </el-select>
        <el-select v-model="deleteStatus" placeholder="选择状态" style="width:150px;" clearable>
            <el-option v-for="item in optionsStatus" :key="item.id" :label="item.name" :value="item.id" ></el-option>
        </el-select>

        <el-button-group>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="downPost(0)">一键顶帖</el-button>
            <el-button type="primary" @click="downPost(1)">一键沉帖</el-button>
            <el-button type="primary" @click="clearRefresh">刷新</el-button>
        </el-button-group>

        <!-- 表格 -->
        <el-table v-loading="loading" element-loading-text="正在加载中" :data="tableData" :border="true" v-if="tableData"  @selection-change="selectChange" @sort-change="sort" style="width: 100%;margin-top:8px;">
            <el-table-column type="selection" width="35" align="center"></el-table-column>
            <el-table-column prop="id" label="帖子ID" align="center" width="70px"></el-table-column>
            <el-table-column :prop="postStatus.field" :label="postStatus.label" :formatter="postStatus.formatter" align="center" width="100px"></el-table-column>
            <el-table-column prop="contentTypes" label="帖子附件" align="center" ></el-table-column>
            <el-table-column align="center" prop="firstImg" label="缩略图" width="100px">
                <template slot-scope="scope">
                    <div v-if="scope.row.firstImg">
                        <img :src="scope.row.firstImg" class="header_pic" />
                        <span style="font-size:16px;">{{scope.row.remainImgCount == 0 ? '' : scope.row.remainImgCount}}</span>
                    </div>
                    <span v-else>无图</span>
                </template>
            </el-table-column>

            <el-table-column prop="content" label="文本" sortable='custom' align="center" width="250px">
                <template slot-scope="scope">
                    <el-button type="text" @click="text(scope.row)" style="color:#606266">{{scope.row.content}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="用户" align="center">
                <template slot-scope="scope">
                    <router-link target="_blank" :to="{name:'userManage',query:{userId:scope.row.userId,userType:scope.row.source == 0 ? 0 : 1}}"><div class="only">{{scope.row.userName}}</div></router-link>
                    <div>用户ID:{{scope.row.userId}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="groupName" label="圈子来源" align="center"></el-table-column>
            <el-table-column prop="topicName" label="话题来源" align="center"></el-table-column>
            <el-table-column prop="commentCount" label="评论" sortable='custom' align="center" width="65">
                <template slot-scope="scope">
                    <router-link target="_blank" :to="{name:'searchComment',query:{postId:scope.row.id}}"><div style="color:#87C3E6;">{{scope.row.commentCount}}</div></router-link>
                </template>
            </el-table-column>
            <el-table-column prop="likeCount" label="抱抱" sortable='custom' align="center" width="65" ></el-table-column>
            <el-table-column prop="pv" label="浏览量" sortable='custom' align="center" width="70"></el-table-column>
            <el-table-column prop="postScore" label="排序分" align="center" width="80"></el-table-column>
            <el-table-column prop="createTime" label="发表时间" align="center" width="152"></el-table-column>
            <el-table-column label="操作" align="center" width="300">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" type="primary" @click="handleEdit(scope.row)">设排序分</el-button>
                        <el-button size="mini" type="warning" v-if="scope.row.recommended != 1" @click="handleTop(scope.row)">推荐</el-button>
                        <el-button size="mini" type="warning" v-else @click="cancleTop(scope.row)">取消推荐</el-button>
                        <el-button size="mini" type="info"  @click="handleStatus(scope.row)">置顶</el-button>
                        <el-button size="mini" type="primary" @click="postDetail(scope.row)">详情</el-button>
                        <el-button size="mini" type="success" @click="postEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="delTK(scope.row)" :disabled="scope.row.deleteStatus != 0">删除</el-button>
                        <el-button size="mini" type="info" @click="handlerecord(scope.row)">操作记录</el-button>
                    </el-button-group>
                </template> 
            </el-table-column>
        </el-table>
        
        <!--删除对话框 -->
        <el-dialog title="请选择删除理由" :visible.sync="delReason" width="200px">
            <div>
                <div class="reason" v-for="item in delList" :key="item.id" @click="active(item)">
                    {{item.name}}
                    <el-button type="success" icon="el-icon-check" v-if="activeId == item.id" class="sucIcon" circle></el-button>
                </div>
            </div>
            <el-button type="primary" @click="postDelete" class="sureIcon">确定删除</el-button>
        </el-dialog>

        <!-- 表单 -->
        <el-dialog title="帖子操作记录" :visible.sync="isShow" width="800px">
            <el-table :data="recordData" border>
                <el-table-column property="createTime" label="时间" align="center"></el-table-column>
                <el-table-column property="content" label="对帖子操作了" align="center"></el-table-column>
                <el-table-column property="userName" label="操作者" align="center"></el-table-column>
            </el-table>
        </el-dialog>

        <!-- 文本详情 -->
        <el-dialog title="文本详情" :visible.sync="textShow" width="800px">
            <div>{{textContent}}</div>
        </el-dialog>

        <!-- 设排序分 -->
        <el-dialog title="设排序分" :visible.sync="gradeShow">
            <div>
                <el-form-item label="排序分参考分值："  class="marginTop">
                    <span class="margin-right">圈子top1分值：{{gradeList.groupTop1}}</span>                
                    <span class="margin-right">圈子top50分值：{{gradeList.groupTop50}}</span>
                    <span class="margin-right">话题top1分值：{{gradeList.topicTop1}}</span>
                    <span class="margin-right">话题top50分值：{{gradeList.topicTop50}}</span>
                </el-form-item>
            </div>
            <el-input v-model="grade" placeholder="请输入帖子ID" clearable></el-input>
            <el-button size="medium" type="primary" @click="setGrade">设排序分</el-button>
        </el-dialog>

    </el-form>

    <el-row type="flex" class="table-foot">
        <el-col align="right">
            <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle" :current-page="startPage" :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
        </el-col>
    </el-row>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <textarea v-model="row.content" class="textarea"></textarea>
        <el-row >
            <el-col align="right">
                <el-button type="primary" @click="sureChange" align="right" class="sureChange">确定</el-button>
            </el-col>
        </el-row>
    </el-dialog>

    
</div>
</template>
<script>
export default {
    data(){
        return{
            loading:true,   //loading
            userId:"",    //用户id
            tableData: false,
            pageSize: 20, //每页大小
            startPage: 1, //当前页
            totalNum: 0, // 总数
            small: true, //小屏幕
            inputData:{       //表格传参数据
            },
            groupId:'',           //圈子
            gambitId:'',          //话题
            optionsGroup:'',    //圈子选择器
            optionsGambit:'',  //话题选择器
            postId:'',          //帖子id
            postContent:'',     //帖子文本内容
            publishTime:'',     //发表时间
            postStatus:{
                field: "deleteStatus",      //deleteStatus   0：未删除 1:管理员删除 2:用户删除
                label: "帖子状态",
                formatter:(row, column, cellValue)=>{   
                    switch (cellValue) {
                        case 0:
                            return '已发布';
                            break;
                        case 1:
                            return '管理员删除';
                            break;
                        default:
                            return '用户删除 '
                    }
                }
            },
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            isShow:false,   //操作记录弹框
            recordData:false,   //操作记录数据
            textShow:false,     //文本弹框
            textContent:false,  //文本弹框内容
            vest:'',             //马甲   0：真实用户 1 ：官方用户
            optionsVest:[
                {id:0,name:'真实用户'},
                {id:1,name:'官方用户'},
            ],
            optionsRecommend:[
                {id:1,name:'被推荐'},
                {id:0,name:'未被推荐'},
            ],
            optionsStatus:[
                {id:0,name:'已发布'},
                {id:1,name:'管理员删除'},
                {id:2,name:'用户删除'},
            ],
            orderBy:'',     //排序
            recommended:'',  //推荐
            delReason:false,    // 删除对话框
            delList:[],         //删除数据
            activeId:false,       //选中删除理由
            editInfo:[],       
            gradeShow:false,    //排序分弹框
            grade:'',         //排序分 
            gradeList:[],       //排序分数据
            groupName:'',       //圈内名称
            deleteStatus:0,    //筛选状态
            selection:[], //选中数据
            row:{}, //  小程序端帖子文本
            dialogVisible:false,    //  文本弹框
        }
    },
    async activated(){
        this.userId='';
        this.postId='';
        this.postContent='';
        this.postContent='';
        this.groupId='';
        this.gambitId='';
        this.publishTime='';
        this.vest='';

        await this.getGroup()  

        let query = this.$router.currentRoute.query;
        if(query.userId){
            this.userId = query.userId
        }else if(query.postId){
			this.postId = query.postId;
		}else if(query.groupId || query.topicId){ //圈内帖子，话题帖子
            this.groupId = query.groupId ? Number(query.groupId) : '';
            this.groupName = query.groupName;
            this.gambitId = query.topicId ? Number(query.topicId) : '';
        }
        this.search()
    },
    methods:{
        sureChange(){
            let data={
                id:this.row.id,
                txtContent:this.row.content
            }
            this.$http.post({
                isJson:true,
                url:'/post/updateReal',
                params:data,
                success: res=>{
                    if(res.code == 0){
                        this.$message({
                            message:'修改成功',
                            type:'success'
                        })

                        this.getData()
                    }
                    this.dialogVisible = false;
                }
            })
        },
        handleClose(){
            this.dialogVisible = false;
            this.row = false;
            // console.(this.row.textarea)
        },

        // 一键沉帖 
        downPost(val){
            let arr = [];
            if(this.selection.length > 0){
                this.selection.forEach( (value,key)=>{
                    arr.push(value.id)
                })

                let url = val == 1 ? '/post/downPost' : '/post/upPost';
                let hint = val == 1 ? '沉帖成功' : '顶帖成功';

                console.log(arr)
                this.$http.post({
                    isJson:true,
                    url:url,
                    params:arr,
                    success:res =>{
                        if(res.code == 0){
                            this.$message({
                                message:hint,
                                type:'success'
                            })

                            this.getData()
                        }else{
                            this.$message(res.msg)
                        }
                    }
                })
            }else{
                this.$message('没数据我也很绝望呀')
            }
        },
        // 选中数据
        selectChange(selection){
            this.selection = selection;
            
        },
        // 弹出删除对话框
        delTK(row){
            this.editInfo.push(row.id);
            
            this.$http.get({
                isJson:false,
                url:'/dealReason/kvs',
                success:res=>{
                    if(res.code == 0){
                        this.delList =res.data;
                        this.activeId = res.data[0].id;
                        this.delReason = true;
                    }
                }
            })
        },
        // 选择删除理由
        active(item){
            this.activeId = item.id
        },
        //推荐
        handleTop(row){
            this.$http.post({
                isJson:false,
                url:'/post/recommend/' + row.id,
                params:{},
                success: res=>{
                    if(res.code == 0 && res.data == 1){
                        this.$message({
                            message:'推荐成功',
                            type:'success'
                        })
                        this.getData()
                    }
                }
            })
        },
        //取消推荐
        cancleTop(row){
            this.$http.post({
                isJson:false,
                url:'/post/cancelRecommend/' + row.id,
                params:{},
                success: res=>{
                    if(res.code == 0 && res.data == 1){
                        this.$message({
                            message:'取消推荐成功',
                            type:'success'
                        })
                        this.getData()
                    }
                }
            })
        },
        // 置顶
        handleStatus(row){
            const {href} = this.$router.resolve({
                path:'/hot/toTop/addTop',
                query:{
                    postId:row.id
                }
            })
            window.open(href,'_blank');
        },
        // 弹出排序分对话框
        handleEdit(row){
            this.$http.post({
                isJson:false,
                url:`/queryPostScoreDetail`,
                params:{
                    postId:row.id
                },
                success:res=>{
                    this.grade = row.postScore;
                    this.gradeList = res.data
                    this.gradeShow = true;
                }
            })
        },
        // 设排序分
        setGrade(){
            if(!this.grade){
                this.$message('请输入正确的排序分值')
                return
            }
 
            this.$http.post({
                isJson:true,
                url:'/savePostScore',
                params:{
                    postId:this.gradeList.id,
                    score:this.grade
                },
                success: res=>{
                    if(res.code == 0 && res.msg === 'OK'){
                        this.gradeShow = false;
                        // this.getData()
                        this.grade = '';
                        this.getData()
                    }else{
                        this.$message(res.msg)
                    }
                    
                }
            })
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
            this.textShow = true;
            this.textContent = row.content;
        },
         // 帖子详情
        postDetail(row){
            const {href} = this.$router.resolve({
                path:'/circle/postDetail',
                query:{postId:row.id}
            })
            window.open(href, '_blank');
        },

        // 编辑帖子
        postEdit(row){
            if(row.source == 0){  //source 帖子来源 0用户 1官方 2爬取
                // this.$message({
                //     message:'目前小程序端发布的帖子暂不支持编辑',
                //     type:'info'
                // })
                // return

                this.row = row;
                this.dialogVisible = true;

            }else{
                const {href} = this.$router.resolve({
                    path:'/circle/postEdit',
                    query:{postId:row.id}
                })

                window.open(href, '_blank');
            }
            
        },
        
        //删除帖子
        postDelete(){
            this.delReason = false;
            const params = {
                ids:this.editInfo,
                deleteReasonId:this.activeId
            }
            this.$confirm('是否确认删除此帖子', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post({
                    isJson:false,
                    url:'/post/remove',
                    params:params,
                    success: res=>{
                        if(res.code == 0 && res.data == 1){
                            this.$message({
                                message:'删除成功',
                                type:'success'
                            })
                            this.editInfo = []
                            this.activeId = false
                            this.getData()
                        }
                    }
                })
            }).catch(() => {
                        
            });
        },

        //帖子操作记录
        handlerecord(row){
            this.isShow = true;
            this.$http.get({
                isJson:false,
                url:`/post/list/operateLogList/${row.id}`,
                success:res=>{
                    // console.log('帖子操作记录:',res)
                    this.recordData = res.data
                }

            })
        },

        refreshTable() {
            this.inputData.startPage = 1
            this.getData()
        },
        
        //清空搜索条件
        clearRefresh(){
            this.userId = '';
            this.postId = '';
            this.postContent = '';
            this.postContent = '';
            this.groupId = '';
            this.gambitId = '';
            this.publishTime = '';
            this.vest = '';
            this.recommended = '';
            this.deleteStatus = 0; 
            // this.getData() 
        },

        //搜索
        search(){
            if(!this.userId && !this.postId && !this.postContent && !this.publishTime && !this.groupId && !this.gambitId && !this.vest && this.vest !== 0 && !this.recommended && this.recommended !== 0){
                this.inputData = {
                    pageSize: 20,
                    startPage: 1,
                    deleteStatus:this.deleteStatus,
                }
            }else{
                this.inputData = {
                    userId:this.userId,
                    postId:this.postId,
                    postContent:this.postContent,
                    content:this.postContent,
                    groupId:this.groupId,
                    topicId:this.gambitId,
                    startTime:this.publishTime[0],
                    endTime:this.publishTime[1],
                    userType:this.vest,
                    recommended:this.recommended,
                    deleteStatus:this.deleteStatus,
                    pageSize: 20,
                    startPage: 1,
                }
            }

            this.pageSize = 20
            this.startPage = 1
            this.getData()
        },
        // 获取表格数据
        getData(){
            this.loading = true
            this.$http.post({
                isJson:true,
                url:'/post/list',
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

        // 获取圈子数据
        getGroup(){
            this.$http.get({
                isJson:false,
                url:'/group/kvs',
                success:res=>{
                    // console.log('获取圈子数据',res)
                    this.optionsGroup = res.data
                    // this.groupId = res.data[0].id
                }
            })
        },

        //获取话题数据
        getGambit(){
            console.log(this.groupId)
            if(!this.groupId){
                this.$message({
                    message:'请先选择圈子来源',
                    type:'warning'
                })
                return
            }
            this.$http.post({
                isJson:true,
                url:'/topic/kvs',
                params:{
                    groupId:this.groupId,
                    topicType:0
                },
                success:res=>{
                    // console.log('获取话题数据',res)
                    this.optionsGambit = res.data
                }
            })
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

        handleBan(row,num){
            if(num == 1){
                this.popover(row.id)
            }else{
                this.ban(row.id)
            }
        },

        handleDetail(row){
            const {href} = this.$router.resolve({
                path:'/userManage/userDetail',
                query:{
                    userId:row.id
                }
            })
            window.opener(href,'_blank')
        },

    }
}

</script>
<style  scoped>
    .app-container{
        color: #999;
    }
    .groupName{
        color: #666;
        font-size: 18px;
        line-height: 32px;
    }
    .toTop{
        margin-left: 50px;
    }
    .marginTop{
        margin-top: 10px;
    }
    .margin-right{
        margin-right: 20px;
        color: #606266;
    }
    .el-input{
        width: 200px;
    }
    .el-form-item{
        margin-right: 1px;
        margin-bottom: 5px;
    }
    .only{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color:#87C3E6;
    }
    .el-button{
        white-space: pre-wrap
    }
    .reason{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #eee;
        text-align: center;
    }
    .sucIcon{
        font-size:16px;
        padding:3px;
    }
    .sureIcon{
        margin-top: 15px;
        margin-left: 30px;
    }
    .sureChange{
        display: block;
        margin-top: 15px;
        width: 180px;
    }
    .textarea{
        width: 100%;
        height: 500px;
    }

</style>
