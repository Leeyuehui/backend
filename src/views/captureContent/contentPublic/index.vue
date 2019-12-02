<template>
  <div class="container">
    <div class="topbar" v-if="sourceData&&topicData">
      内容源:
      <el-select v-model="value1" placeholder="请选择" @change="sourceSelectChange">
        <el-option v-for="item in sourceData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      内容源话题:
      <el-select v-model="value2" placeholder="" @change="topicSelectChange">
        <el-option v-for="item in topicData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="table">
      <el-table :data="listData" height="700" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}"  v-if="listData" border @cell-dblclick="showContent">
        <el-table-column prop="source" label="内容源" width="200">
        </el-table-column>
        <el-table-column prop="topic" label="内容源话题" width="300">
        </el-table-column>
        <el-table-column prop="" class="content" class-name="content" label="正文内容">
          <template slot-scope="scope">
            <div v-html="scope.row.content"></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-row>
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteContent(scope.row.id)"></el-button>
              <el-button type="primary" round @click="editor(scope.row.id)">编辑并发布</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row type="flex" class="table-foot">
        <el-col align="right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20,50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="list.total"></el-pagination>
        </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span v-html="dialogContent"></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
        value1: '',
        value2: '',
        tableData: [],
        sourceId: 1, // 圈子id
        sourceData: null,
        topicId: 1, // 话题id
        topicData: null,
        list: {},
        listData: null,
        currentPage: 1,
        pageSize: 20,
        dialogVisible: false,
        dialogContent: ''
        }
    },
    async created() {
        await this.getSource()

        await this.getTopic()
        // this.topicData = topicData.data

        await this.getList()
    },
    activated(){
        this.getList()
    },

  methods: {
    editor(id) {
      this.$router.push({
        path: `/official/send/posted`,
        query: { id: id }
      })
    },
    showContent(content) {
      // console.log(index)
      this.dialogContent = content.content
      this.dialogVisible = true
    },
    deleteContent(id) {
      this.$confirm('此操作将永久删除这条内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('spider/remove', [id], res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList();
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async sourceSelectChange(id) {
      this.sourceId = id
      await this.getTopic()
      await this.getList()
    },
    topicSelectChange(id) {
      this.topicId = id
      this.getList()
    },
    getSource() {
      return new Promise((resolve, rej) => {
        this.$http.get('/spider/getSource', res => {
          this.sourceData = res.data
          this.value1 = this.sourceData[0].name
          resolve(res)
        })
      })
    },
    handleSizeChange(num) {
      console.log(num)
      this.pageSize = num
      this.getList()
    },
    handleCurrentChange(num) {
      console.log(num)
      this.currentPage = num
      this.getList()
    },
    getTopic() {
      return new Promise((resolve, rej) => {
        this.$http.get('/spider/getTopic', { sourceId: this.sourceId }, res => {
          this.topicData = res.data
          this.topicId = res.data[0].id
          this.value2 = this.topicData[0].name
          resolve(res)
        })
      })
    },
    getList() {
      this.$http.post(
        '/spider/list',
        {
          pageSize: this.pageSize,
          sourceId: this.sourceId,
          startPage: this.currentPage,
          topicId: this.topicId
        },
        res => {
          this.list = res.data
          this.listData = res.data.list
          setTimeout(function() {
            const content_list = document.getElementsByClassName(
              'table_content'
            )
            console.log(content_list)
            for (let i = 0; i < content_list.length; i++) {
              content_list[i].innerHTML = this.listData[i].content
            }
          }, 1000)
        }
      )
    }
  }
}
</script>

<style lang="scss">
.content {
  // color: red;
  // -web-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
.el-table .cell {
  white-space: normal !important;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  padding-left: 20px;
  padding-right: 20px;
}
.topbar {
  margin-top: 10px;
  margin-left: 65px;
}
.pagination {
  position: fixed;
  bottom: 50px;
  right: 200px;
}
.el-tooltip__popper {
  width: 500px;
}
</style>


