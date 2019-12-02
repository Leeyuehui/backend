<template>

    <div class="app-container">
        <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd='true' @handleAdd="handleAdd" @handleEdit="handleEdit">
            <!-- 表格 列 -->
            <div slot="columns">
                <el-table-column align="center" v-if="col.type === 'img'" v-for="col in cols" :key="col.field" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                    <template slot-scope="scope">
                        <a @click="setSrc(scope.row[scope.column.property])">
                            <img :src="scope.row[scope.column.property]" class="header_pic" />
                        </a>
                    </template>
                </el-table-column>
                <el-table-column align="center" v-else-if="col.type == 'content'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width" >
                    <template slot-scope="scope">
                            <el-button type="text" style="color:#606266;" @click="contentDetail(scope.row.content)">{{scope.row.content}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width"></el-table-column>
            </div>

        </my-table>

        <el-dialog title="反馈内容详情" :visible.sync="dialogVisible" width="30%">
            <div>{{content}}</div>
        </el-dialog>
    </div>

</template>

<script>
import MyTable from '@/components/MyTable'
import MyArea from '@/components/MyArea'
export default {
  components: {
    MyTable,
    MyArea
  },
  data() {
    return {
      // 接口路径
      baseUrl: BASE_URL,
      api: {
        list: '/user/queryFeedBackList',
        // add: '/banner/add',
        // edit: '/banner/update',
        // update: '/banner/set',
        // delete:'/banner/remove'
      },
      // id 字段
      idField: 'id',
      // 表头字段
      cols: [
        {field: 'id',label: 'ID'},
        {field: 'userId',label: '用户ID'},
        {field: 'headImage',label: '头像',type:'img'},
        {field: 'name',label: '昵称'},
        {field: 'content',label: '反馈内容',type:'content'},
        {field: 'mobile',label: '手机号码'},
        {field: 'createTime',label: '反馈时间'}
      ],
      // 表单对象
      editInfo: {},

      searchInfo: {},
      // 表单验证
      validRule: {},
      // ========自定义变量
      imgSrc: '',
      imageDialog: false,
      groupId: 0,
      dialogVisible:false, //文本弹框
      content:'',  //反馈内容
    }
  },
  activated() {
    console.log(this.api)
    let groupId = this.$router.currentRoute.query.groupId
    if (groupId) {
      this.groupId = groupId;
      this.api.list = `${this.api.list}?groupId=${groupId}`
    }
  },
  methods: {
    //文本弹框
    contentDetail(content){
      // this.$message('hahhahhah')
      this.dialogVisible = true;
      this.content = content;

    },
    // 以下为必备函数
    beforeCommit(param) {},
    handleAdd(param) {
      param.needNew = true //打开新页面
      this.editInfo = {}
      this.$router.push({
        path: '/banner/edit',
        query: {
          type: 'add',
          groupId: this.groupId
        }
      })
    },
    handleEdit(param, row) {
      console.log(this.$refs.table)
      param.needNew = true //打开新页面
      this.editInfo = row

      // let res=row.data.list
      console.log('2222222', row)
      this.$router.push({
        path: '/banner/edit',
        query: {
          type: 'edit',
          id: row.id,
          indexs: row.indexs,
          appId: row.appId,
          url: row.url,
          path: row.path,
          groupId: row.groupId ? row.groupId : 0,
          pathType: row.pathType ? String(row.pathType) : 1
        }
      })
    },
    handleStatus(param, row) {
      var that = this
      console.log(that.cols)
      let data = {
        id: row.id,
        status: row.status == 0 ? 1 : 0,
        groupId:this.groupId ? this.groupId : 0
      }
      that.editType = 'update'
      that.$http.post(that.api[that.editType], data, (data, res) => {
        that.$message({
          type: 'success',
          message: '操作成功'
        })
        that.dialogFormVisible = false

        that.$refs.table.refreshTable()
      })
    },
    refresh() {},
    // 自定义函数
    setSrc(src) {
      this.imgSrc = src
      this.imageDialog = true
    },
    handleDelete(index, row) {
      this.$refs.table.delete(row[this.idField])
    },

    handleUpdate(index, row) {
      console.log(row)
      this.$refs.table.handleEdit(index, row)
    },
    handleComment(index, row) {
      let artId = row[this.idField]
      this.$router.push({
        path: '/comment/list',
        query: {
          artId: artId,
          type: 'articeId',
          id: row.artId
        }
      })
    },
    getUrl(url) {
      if (url) {
        if (typeof url == 'string' && url.indexOf('http') != -1) {
          return url
        } else {
          return this.baseUrl + '/file/' + url
        }
      }
      return ''
    }
  }
}
</script>