<style scoped>

</style>

<template>
    <div class="app-container">
        <div style="float:left;margin-top:20px;">待人工审核</div>
        <el-table
            :data="newData"
            stripe
            border
            style="width: 80%; margin-top:50px;">
            <el-table-column
                prop="type"
                label="状态"
                width="240">
            </el-table-column>
            <el-table-column
                prop="num"
                label="数量"
                width="240">
            </el-table-column>
            <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.row)">审核</el-button>
                    </template>
            </el-table-column>
        </el-table>

        <!-- <div style="float:left;margin-top:20px;">历史记录</div>
        <el-table
            :data="historyData"
            stripe
            border
            style="width: 80%;margin-top:50px;">
            <el-table-column
                prop="type"
                label="状态">
            </el-table-column>
            <el-table-column
                prop="num"
                label="数量">
            </el-table-column>
        </el-table> -->
    </div>
</template>

<script>

export default {
    data() {
        return {
            baseUrl: BASE_URL,
            api: {
                newList: "/postAudit/getAuditCount",
                // historyList:"/comment/history/statistics",
            },

            newData:[
                {
                    type:"帖子图片审核",
                    num:0,
                    edit:"审核",
                    check:"postImgAuditCount",
                    typeInfo:2
                },
            ],
            // historyData: [{
            //     type:"审核通过",
            //     num:0, 
            //     check:"pass"
            // }, {
            //     type:"管理员删除",
            //     num:0, 
            //     check:"reject"
            // },{
            //     type:"用户删除",
            //     num:0, 
            //     check:"userRejectCount"
            // }],
            
        }
    },

    methods: {
        getTableData() {
                // 获取列表数据
                this.listLoading = true;
                setTimeout(() => {
                    this.$http.get(this.api["newList"], null, (data, res) => {
                        let _this = this;
                        for(let j = 0,len = _this.newData.length; j < len; j++) {
                            _this.newData[j].num = data.data[_this.newData[j].check];
                        }
                        this.listLoading = false;
                    });
                }, 300);

                // setTimeout(() => {
                //     this.$http.get(this.api["historyList"], null, (data, res) => {
                //         let _this = this;
                //         for(let j = 0,len = _this.historyData.length; j < len; j++) {
                //             _this.historyData[j].num = data[_this.historyData[j].check];
                //         }
                //         this.listLoading = false;
                //     });
                // }, 300);
            },
            refreshTable() {
                this.curPage = 1;
                this.$emit("refresh");
                this.getTableData();
            },
            handleEdit(row) {
                let typeInfo = row.typeInfo;
                this.$router.push({
                    path: "/moderation/imageCheck/check",
                    // query: {type: typeInfo}
                }); 
                
            },
    },
    mounted() {
        this.getTableData();  
        
    }
};

</script>
