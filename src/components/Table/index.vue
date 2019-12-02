<style lang="scss">

  .table-header {
    display: flex;
    justify-content: flex-start;
  }

  .app-container {
    position: absolute;
    top: 35px;
    bottom: 0;
    right: 0;
    left: 90px;
  }

  .el-header .el-footer {
    height: 40px !important;
  }

  .el-footer {
    margin-top: -5px;
    padding-bottom: 10px;
  }

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-table .cell {
    /*height: 40px;*/
    /*line-height: 40px;*/
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

</style>

<template lang="html">

  <el-container class="app-container">

    <el-header height="40" class="table-header">
      <el-col :span="18">
        <!-- 搜索框 -->
        <slot name="searchBox"></slot>
      </el-col>
      <!-- 右侧按钮区 -->
      <el-col align="right" :span="18">
        <el-button-group>
          <el-button size="small" type="primary" v-if="permInfo.add" icon="el-icon-plus" @click="addItem">添加</el-button>
          <el-button size="small" type="success" icon="el-icon-refresh" @click="refreshTable">刷新</el-button>
        </el-button-group>
      </el-col>
      <el-col align="right" :span="2">
      </el-col>
    </el-header>

    <el-main>
      <!-- 表格 -->
      <el-table height="auto" ref="singleTable" :data="rows" stripe style="width: 100%;height: 100%" border @selection-change="selectRow" v-loading.body="listLoading" element-loading-text="正在加载数据...">

        <el-table-column type="selection" width="55" align="center">
        </el-table-column>

        <template v-for="f in cols" >
          <el-table-column v-if="f.type!='img'"  :type="f.type" 
          :width="f.width" 
          :align="f.align" 
          :sortable="f.sortable" :prop="f.field" :label="f.label" :key="f.field" align="center" :formatter="f.formatter">
          </el-table-column>

          <el-table-column v-if="f.type==='img'" :type="f.type" :width="f.width" :align="f.align" :sortable="f.sortable" :prop="f.field" :label="f.label" :key="f.field" align="center" :formatter="f.formatter">
            <template   slot-scope="scope">
              <img :src="baseUrl+'/upload/'+scope.row.headImage" width="100%" height="100%" class="head_pic"/>
            </template>
          </el-table-column>

        </template>


        <el-table-column label="操作" align="center">
          <div slot-scope="scope">
            <el-button-group>
              <el-button size="mini" v-if="permInfo.detail" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini" type="primary" v-if="permInfo.update" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" v-if="permInfo.delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </el-button-group>
          </div>
        </el-table-column>


      </el-table>
      <!-- 弹窗表单 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :lock-scroll="false" width="40%">
        <el-row>
          <slot name="dialog"></slot>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>


    </el-main>

    <!-- 底部操作 -->
    <el-footer height="40">
      <el-row type="flex" class="row-bg">
        <el-col :span="24" class="row-btn" align="left">
          <el-button type="danger"  size="small" icon="el-icon-delete" @click="delHandle" v-if="permInfo.delete">批量删除</el-button>
        </el-col>
        <el-pagination :page-sizes="[10, 20, 30 , 50]" @size-change="handleSizeChange" :current-page="currentPage" @current-change="handleCurrentChange" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
        </el-pagination>
      </el-row>
    </el-footer>
  </el-container>

</template>

<script>
import {mapGetters} from 'vuex'
  export default {
    props: ['cols', 'api', 'searchInfo', 'idField', 'permInfo'],
    data() {
      return {
        /**
         * /////////////////////////
         *   以下部分一般无需修改
         *   /////////////////////
         */
        listLoading: true,
        tableRows: 20,
        listTotal: null,
        type: 'add',
        dialogFormVisible: false,
        rows: [],
        dialogTitle: '',
        checkIds: [],
        loading: true,
        editRow: {},
        currentPage:1
      }
    },
    components: {},
    computed:{
      ...mapGetters([
        'baseUrl'
      ])
    },
    methods: {

      /**
       * /////////////////////////
       *   以下部分一般无需修改
       *   /////////////////////
       */

      /**
       * 获取列表
       */
      gettableList() {
        this.currentPage = 1;
        this.listLoading = true;
        this.rows = null;

        this.$http.post(this.api.list, {
          rows: this.tableRows
        }, response => {
          this.rows = response.data.rows;
          this.listTotal = response.data.total;
          setTimeout(() => {
            this.listLoading = false;
          }, 500);
        }, response => {
          this.$message({
            type: 'error',
            message: '请求失败！'
          });
          this.listLoading = false;
        })
      },

      /**
       * 选择
       * @param section
       */
      selectRow(section) {
        var arr = [];
        section.map((res, index) => {
          arr.push(res[this.idField]);
        });
        var json = {};
        var res = [];
        for (var i = 0; i < arr.length; i++) {
          if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
          }
        }
        this.checkIds = res;
      },
      /**
       * 添加
       */
      addItem() {
        let prop = {
          newPage: false
        }
        this.$emit("editTypeChange", "add", prop);
        if (!prop.newPage) {
          this.dialogFormVisible = true;
          this.dialogTitle = "添加"
        }
      },
      /**
       * 编辑
       * @param index
       * @param row
       */
      handleEdit(index, row) {
        this.editInfo = JSON.parse(JSON.stringify(row));
        let prop = {
          newPage: false
        }
        this.$emit("editTypeChange", 'edit', prop, this.editInfo);
        this.$emit("editRow", this.editInfo);
        if (!prop.newPage) {
          this.dialogFormVisible = true;
          this.dialogTitle = "编辑"
        }
      },
      /**
       * 删除选择的记录
       */
      delHandle() {
        this.delete(this.checkIds);
      },
      /**
       * 删除单条
       * @param index
       * @param row
       */
      handleDelete(index, row) {
        this.delete(row[this.idField])
      },
      /**
       * 删除
       */
      delete(id) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: action => {
            if (action == 'confirm') {
              var params = {};
              params["ids"] = id;
              this.$http.post(this.api.delete, params, response => {
                if(response.code == 200){
                  this.refreshTable();
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }
              })
            }
          }
        })
      },
      /**
       * 页数改变
       * @param v
       */
      handleCurrentChange(v) {
        this.listLoading = true;
        this.currentPage = v;
        var url = null;
        var param = null;
        if (this.isNullObject(this.searchInfo)) {
          url = this.api.list;
          param = {}
        } else {
          url = this.api.search;
          param = this.searchInfo;
        }
        param['page'] = v;
        param['rows'] = this.tableRows;
        this.$http.post(url, param, res => {
          setTimeout(() => {
            this.listLoading = false;
          }, 500)
          this.rows = res.data.rows;
        }, err => {
          setTimeout(() => {
            this.listLoading = false;
          }, 500)
        })
      },
      /**
       * 表单条数更改
       * @param v
       */
      handleSizeChange(v) {
        this.listLoading = true;
        this.tableRows = v;
        var url = null;
        var param = null;
        if (this.isNullObject(this.searchInfo)) {
          url = this.api.list
          param = {}
        } else {
          url = this.api.search;
          param = this.searchInfo;
        }
        param['page'] = 1;
        param['rows'] = this.tableRows;
        this.$http.post(url, param, res => {
          setTimeout(() => {
            this.listLoading = false;
          }, 500)
          this.rows = res.data.rows;
        }, err => {
          setTimeout(() => {
            this.listLoading = false;
          }, 500)
        })
      },
      /**
       * 刷新表格
       */
      refreshTable() {

        this.rows = null;
        this.listTotal = null;

        setTimeout(() => {
          this.gettableList();
          this.$emit("refresh")

        }, 500)
      },
      /**
       * --------------------------------------
       *   以下部分根据实际修改
       * --------------------------------------
       */


      /**
       *  搜索
       */
      searchHandle(searchInfo) {
        this.listLoading = true;
        var param = searchInfo;
        param['page'] = 1;
        param['rows'] = this.tableRows;

        this.$http.post(this.api.search, param, res => {

          setTimeout(() => {
            this.rows = res.data.rows;
            this.listTotal = res.data.total;
            this.listLoading = false;
          }, 1000);
        }, error => {
          this.$message({
            type: 'error',
            message: '请求失败！'
          });
          this.listLoading = false;
        });
      },

      cancel() {
        this.dialogFormVisible = false;

      },

      submitForm() {
        let dialog = {
          needClose:false
        }
        this.$emit("submitForm",dialog);
        this.dialogFormVisible = !dialog.needClose;
        this.refreshTable();
      },
      handleDetail(index, row) {
        this.editInfo = JSON.parse(JSON.stringify(row));
        let prop = {
          newPage: false
        }
        this.$emit("handleDetail", 'detail', prop, this.editInfo);
        this.$emit("editRow", this.editInfo);
        if (!prop.newPage) {
          this.dialogFormVisible = true;
          this.dialogTitle = "查看详情"
        }
      },
      isNullObject(obj) {
        if (obj == null) {
          return true;
        } else {
          for (var k in obj) {
            if (obj[k] != null && obj[k] != '') {
              return false;
            }
          }
        }
        return true;
      }

    },
    mounted() {
      this.gettableList();
    }
  }

</script>
