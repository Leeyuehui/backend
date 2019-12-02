<style lang="scss">
.table-foot {
  margin: 5px;
}

@media only screen and (max-height: 768px) {
  .tableDiv {
    min-height: 668px;
    max-height: 668px;
  }
}

@media only screen and (max-height: 1280px) {
  .tableDiv {
    min-height: 750px;
    max-height: 750px;
  }
}

@media only screen and (max-height: 600px) {
  .tableDiv {
    min-height: 500px;
    max-height: 500px;
  }
}
</style>

<template lang="html">

<div>

    <!-- 顶部操作区 -->
    <el-row type="flex" class="table-foot">
        <el-col :span="20">
            <!-- 搜索框 -->
            <slot name="searchBox"></slot>
            <el-form :inline="true" :model="formList"  class="demo-form-inline" v-if = "api.search">
                <el-form-item label="">
                    <el-input v-model="formList.topicId" placeholder="查询帖子ID"></el-input>
                </el-form-item>            
                <el-form-item label="">
                    <el-button type="primary" @click="searchId">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 右侧按钮区 -->
        <el-col align="right" :span="10">
            
            <el-button-group v-if="showAddBtn">
                <el-button size="small" type="info" v-if="api.only" @click="handleAdd">自定义新增</el-button>
                <el-button size="small" type="primary" v-if="api.only" @click="searchAdd">搜索添加</el-button>
                <!-- <el-button size="small" type="primary" v-if="api.hotTopic" @click="toHotTop">编辑热议话题</el-button> -->
                <el-button size="small" type="primary" v-if="api.add && !api.only" icon="el-icon-plus" @click="handleAdd">添加</el-button>     <!-- v-if="api.add" -->
                <el-button size="small" type="primary" v-if="api.sort" @click="changeSort">更改排序</el-button>
                <el-tooltip  class="item" effect="dark" content="可用于清空搜索结果" placement="top-start" v-if="api.add">
                    <el-button size="small" type="success" icon="el-icon-refresh" @click="refreshTable">刷新</el-button>
                </el-tooltip>
            </el-button-group>


            <!-- <el-button-group v-else>
                <el-tooltip  class="item" effect="dark" content="可用于清空搜索结果" placement="top-start">
                       <el-button size="small" type="success" icon="el-icon-refresh" @click="refreshTable">刷新</el-button>
                </el-tooltip>
            </el-button-group> -->
        </el-col>
    </el-row>
    <!-- 表格区 -->
    <el-table max-height="1000" :data="tableData" :stripe="true" :border="true" class="tableDiv" v-loading="listLoading" element-loading-text="正在加载数据..." v-on:selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" align="center" v-if="diyOpeBtn" width="150">

            <div slot-scope="scope">
                <el-button-group>
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </el-button-group>
            </div>
        </el-table-column>

        <el-table-column width="1" v-if="!diyOpeBtn">

        </el-table-column>
        <slot name="columns"></slot>


    </el-table>

    <!-- 弹窗表单 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :lock-scroll="false" width="60%">
        <el-row>
            <slot name="dialog"></slot>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCancel">取 消</el-button>
            <el-button type="primary" @click="dialogOk">确 定</el-button>
        </div>
    </el-dialog>


    <!-- 底部操作 -->
    <el-row type="flex" class="table-foot">
        <el-col :span="12" align="left" v-if="api.delete">
            <el-button type="danger" size="small" @click="deleteManyHandle" icon="el-icon-delete">批量删除</el-button>
        </el-col>
        <el-col align="right">
            <!-- 分页 -->
            <el-pagination :small="small" background :current-page.sync="curPage" :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
            <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="100" layout="prev, pager, next, jumper" :total="1000"></el-pagination> -->
        </el-col>
    </el-row>
</div>

</template>

<script>
import { mapGetters } from 'vuex'
import { parseQueryString } from '@/utils/objectUtil'
export default {
  props: [
    'api',
    'cols',
    'opeBtn',
    'idArt',
    'idField',
    'editInfo',
    'searchInfo',
    'showAdd'
  ],
  data() {
    return {
      tableData: [], // 数据
      listLoading: true, //加载
      listType: 'list', // 列表类型search list
      // 分页相关
      curPage: 1, //当前页
      totalNum: 0, // 总数
      small: true, //小屏幕
      pageSize: 20, //每页大小

      // 自定义操作按钮
      diyOpeBtn: this.opeBtn && true,
      showAddBtn: this.showAdd && true,
      //所选ids
      checkIds: [],
      // 表单相关
      dialogTitle: '添加', // 弹窗标题
      dialogFormVisible: false, // 弹窗控制
      tips: '', //弹窗提示文案
      formList: {
        topicId: ''
      }
    }
  },
  methods: {
    searchAdd(){
        this.$prompt('请输入用户id', {
          confirmButtonText: '请确认添加',
          showCancelButton:false,
          center:true,
          inputType:'number'
        }).then(({ value }) => {
            this.$confirm(`是否确认将用户(id:${value})添加到官方帐号列表?`, '提示', {
                confirmButtonText: '确认添加',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data={
                    userId: value
                }
                this.$http.post({
                    isJson:false,
                    url:'/virtualUser/change',
                    params:data,
                    success:res=>{
                        if(res.code == 0){
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            }); 
                            this.refreshTable()
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '无法添加真实用户为官方帐号!'
                            });
                        }
                    }
                })
            })
        })    
    },
    searchId() {
      console.log(this.formList.topicId)
      if (this.formList.topicId != '') {
        let data = {
          postId: this.formList.topicId
        }
        this.$http.post({
          isJson: false,
          url: '/queryPostScoreVoList',
          params: data,
          success: res => {
            console.log(res)
            if (res.code == 0 && res.data.list != 0) {
              // this.tableData=[]
              this.tableData = res.data.list
            //   console.log('嘤嘤嘤', this.tableData)
            } else {
              this.$message('抱歉暂无数据')
              this.tableData = false
            }
          }
        })
      }
    },
    // 跳转至热议话题
    toHotTop() {
      console.log('this.groupId--gambit', this.groupId)
      this.$router.push({
        path: '/circle/hotTopic',
        query: {
          groupId: this.$router.currentRoute.query.groupId,
          groupName:this.$router.currentRoute.query.groupName,
          topicType: 2
        }
      })
    },
    // 更改排序
    changeSort() {
      let sort = this.checkIds.join(',')
      console.log(
        typeof this.checkIds,
        '-----',
        sort.length,
        sort,
        this.checkIds
      )
      if (this.checkIds && this.checkIds.length == 1) {
        this.$prompt('输入后该数据会插入到该位置', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[1-9][0-9]{0,}$/,
          inputErrorMessage: '输入格式不正确'
        })
          .then(({ value }) => {
            let data = {
              id: sort,
              num: value
            }
            let url = this.api.sort
            this.$http.post(url, data, res => {
              console.log('好好爱好爱好', res)
              this.$message({
                type: 'success',
                message: '你输入的排序为: ' + value
              })
              var timer = setTimeout(() => {
                this.getTableData()
                clearTimeout(timer)
              }, 1000)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            })
          })  
      } else {
        this.$message('请选择1个你要更改排序的话题')
      }
    },

    // 获取列表数据
    getTableData() {   
      let query = this.$router.currentRoute.query;
    //   console.log('query', query)
      this.listLoading = true;
      let type = query.type
      let id = query.id
      if (type == 'search') {
        this.listType = 'search'
      }
      if (this.$route.path == '/comment/list') {
        let source = query.source
        this.searchList = {
          artId: id,
          row: query.row
        }
        if (source) {
          this.searchList.source = source
        }
        this.listType = 'search'
      } else if (this.$route.path == '/artice/list') {
        let artType = query.artType
        let artId = query.artId
        this.searchList = {
          row: query.row
        }
        if (artType) {
          this.searchList.artType = artType
        }
        if (artId) {
          this.searchList.artId = artId
        }
        this.listType = 'search'
      } else if (this.$route.path == '/manage/userDetail') {
        let unionId = query.unionId
        this.searchList = {
          row: query.row
        }
        if (unionId) {
          this.searchList.unionId = unionId
        }
        this.listType = 'search'
      } else {
        this.searchList = query
      }

      setTimeout(() => {
        let param = {}
        console.log('this.api.list:', this.api.list, this.api[this.listType])
        if (this.listType === 'list') {
        //   if (query.groupId || query.topicType) {
        //     param = {
        //       startPage: this.curPage,
        //       pageSize: this.pageSize,
        //       groupId: Number(query.groupId),
        //       topicType: Number(query.topicType)
        //     }
        //   } else {
            if(JSON.stringify(this.searchList) != "{}"){
              param = this.searchList;
            }else{
              let url = this.api[this.listType]
              let indexNum = url.indexOf('?')
              if (indexNum > 0) {
                param = parseQueryString(url.substring(indexNum + 1))
              }
            }
            param.startPage = this.curPage
            param.pageSize = this.pageSize
        //   }
        } else {
          param = this.searchList
          param['page'] = this.curPage
          param['rows'] = this.pageSize
          if (type == 'search') this.listType = 'search'
        }
        this.$http.post(this.api[this.listType], param, res => {
          console.log('0000', res)
          this.tableData = res.data.list
          this.totalNum = res.data.total
          this.listLoading = false
          // console.log(this.cols)
        })
      }, 300)
    },

    handleSelectionChange(val) {
      //获取选择的id
      // debugger
      this.checkIds = []

      for (var i = 0; i < val.length; i++) {
        let ids = val[i][this.idField]
        // let ids = val[i][this.idArt] + "_" + val[i][this.idField]
        this.checkIds.push(ids)
      }
      console.log(this.checkIds)
      this.$emit('onSubmitArr', this.checkIds)
    },
    refreshTable() {
      this.curPage = 1
      this.$emit('refresh')
      this.listType = 'list'
      this.getTableData()
    },

    dialogCancel() {
      //弹窗关闭
      this.dialogFormVisible = false
    },
    dialogOk() {
      let that = this
      let param = {
        ok: true
      }
      that.$emit('beforeCommit', param)
      if (param.ok) {
        that
          .$confirm(that.tips, {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            that.$http.post(
              that.api[that.editType],
              that.editInfo,
              (data, res) => {
                that.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                that.getTableData()
                that.dialogFormVisible = false
              }
            )
          })
          .catch(() => {})
      }
    },
    sizeChangeHandle(size) {
      //分页大小发生变化
      this.pageSize = size
      this.refreshTable()
    },
    currentChangeHandle(currentPage) {
      //页数发生变化
      this.curPage = currentPage
      this.getTableData()
    },

    handleAdd() {
      let param = {
        needNew: false
      }
      this.$emit('handleAdd', param)
      if (!param.needNew) {
        this.dialogTitle = '添加'
        this.editType = 'add'
        this.dialogFormVisible = true
        this.tips = param.tips
      }
    },
    handleEdit(index, row) {
      // 传递row到父级
      let param = {
        needNew: false
      }

      this.$emit('handleEdit', param, row)
      if (!param.needNew) {
        this.tips = param.tips
        this.dialogTitle = '编辑'
        this.editType = 'edit'
        this.dialogFormVisible = true
      }
    },
    // 删除
    deleteManyHandle() {
      this.delete(this.checkIds)
    },
    handleDelete(index, row) {
      this.delete(row[this.idField])
    },
    delete(id,activeId) {
        // debugger
    console.log('id：',id,'activeId:',activeId)
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          console.log(this.$router.currentRoute.query.groupId, this.api.delete)
          let params = {},isJson = true;
          if (action == 'confirm') {
            if (this.api.delete == '/topic/removeHot' || this.api.delete == '/topic/remove') {    
              params = {
                ids: id,
                groupId: Number(this.$router.currentRoute.query.groupId)
              }
            } else {

            //   if (id.length >= 1) {
            //     params = Object.assign(id)
            //   } else {
                // params.ids = []
                // params.ids.push(id)
                // params.deleteReasonId = activeId
            //     params = {
            //         ids:id,
            //         deleteReasonId:activeId
            //     }
            //   }
                if(activeId){
                    params = {
                        ids:id,
                        deleteReasonId:activeId
                    }
                    isJson = false
                } else{
                    // params.ids = []
                    // params.ids.push(id)
                    if(id.length > 1){
                        params = {
                            ids:id
                        }
                    }else{
                        params = {
                            ids: [id]
                        }
                    }
                    
                    isJson = true
                }
                
            }

            console.log('params', typeof params, params,isJson)
            // params["ids"] = id;
            if (this.api.delete == '/topic/removeHot' || this.api.delete == '/topic/remove') {
                this.$http.post({
                    isJson: false, 
                    url: this.api.delete,
                    params: params,
                    success: res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.refreshTable()
                    }
                })
            } else {
                this.$http.post({
                    isJson: isJson, //提示周五修改为false
                    url: this.api.delete,
                    params: params.ids,
                    success: res => {
                    this.refreshTable()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    }
                })
            }
          }
        }
      })
    },
    search() {
      this.listType = 'search'
      this.getTableData()
    }
  },
  activated() {
    let query = this.$router.currentRoute.query
    console.log('this.api', this.api,'mytable:',query)
    let type = this.$router.currentRoute.query.type
    if (this.$route.path != '/comment/list') {
      this.getTableData()
    } else {
      if (type == 'articeId') {
        this.getTableData()
      } else {
        this.listLoading = false
      }
    }
    let _this = this
    window.onresize = function() {
      // 调整分页样式大小
      _this.small = window.innerWidth < 1124
    }
  },
  watch:{
    $route(to,from){
        console.log('to:',to);
        if(to.query.groupId){
            this.groupId = to.query.groupId
        }
        this.getTableData();
    }
  },
}
</script>
