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

        <el-table-column v-if="col.field === 'status'" v-for="col in cols" :key="col.field" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.status == 0">待上架</div>
                <div v-else-if="scope.row.status == 1" style="color:red;">已上架</div>
                <div v-else>已下架</div>
            </template>
        </el-table-column>

        <el-table-column v-else-if="col.field === 'img'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width" align="center">
            <template slot-scope="scope">
                <img :src="scope.row.img" alt="图片" width="80" height="80" />
            </template>
        </el-table-column>

        <el-table-column v-else-if="col.field === 'startTime'" :formatter="col.formatter" :prop="col.field" :label="col.label" align="center">
            <template slot-scope="scope">
                <div>{{scope.row.startTime}}至{{scope.row.endTime}}</div>
            </template>
        </el-table-column>

        <el-table-column v-else :formatter="col.formatter" :prop="col.field" :label="col.label" align="center" :width="col.width"></el-table-column>

        <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
                <el-button-group>
                    <el-button size="mini" type="primary" @click="postEdit(scope.row)">编辑</el-button>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
        <el-pagination :small="small" @size-change="sizeChangeHandle" v-if="tableData" @current-change="currentChangeHandle" :current-page="postData.startPage" :page-sizes="[20, 30, 50, 100]" :page-size="postData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            loading:true,
            tableData:false,
            totalNum: 0, // 总数
            small: true, //小屏幕
            api:{
                list:'/notice/list',
                add:'/notice/add',
                update:'/notice/update',
                delete:'/notice/remove',
            },
            cols:[
                {field: 'id', label:'资源ID',width:'70'},
                {field: 'status', label:'资源状态',width:'80'}, // status--资源状态：0 待上架 1 已上架 2 已下架
                {field: 'img', label:'图片',width:'100' },
                {field: 'type', label:'跳转类型',width:'100',   //1 小程序 2 内链 
                    formatter:(row, column, cellValue)=>{   
                        switch (cellValue) {
                            case 1:
                                return '小程序';
                                break;
                            case 2:
                                return '内链';
                                break;
                            default:
                                return '小程序'
                        }
                    }
                },
                {field: 'path', label:'跳转链接' },
                {field: 'createTime', label:'资源创建时间' },
                {field: 'startTime', label:'生效期' },
            ],
            postData:{  //列表请求条件
                pageSize: 20,
                startPage: 1,
            }, 
        }
    },
    methods:{
        // 添加
        add(){
            this.$router.push({
                path:'/homeAds/edit',
                query:{
                    type:'add'
                }
            })
        },
        // 编辑
        postEdit(row){
            this.$router.push({
                path:'/homeAds/edit',
                query:{
                    type:'edit',
                    form:JSON.stringify(row)
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
            //分页大小发生变化
            this.getData()
        },

        currentChangeHandle(currentPage) {
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
 