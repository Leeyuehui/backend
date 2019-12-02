<template>
    <div class="app-container">
        <div class="groupName" v-if="groupName">当前所在圈子：{{groupName}}</div>
        <my-table :api="api" :cols="cols" ref="table" :idField="idField" :opeBtn="false" @refresh="refresh" :searchInfo="searchInfo" :editInfo="editInfo" @beforeCommit="beforeCommit" :showAdd='true' @handleAdd="handleAdd" @handleEdit="handleEdit">

            <!-- <div slot="searchBox">
            <el-form  :inline="true" :model="searchInfo" class="demo-form-inline">
            <el-form-item >
                <my-area ref="area" @select="selectArea" :model.sync="searchInfo.areaId" ></my-area>
            </el-form-item>
            </el-form>
        </div> -->

            <!-- 表格 列 -->
            <div slot="columns">
                <el-table-column align="center" v-if="col.type === 'url'" v-for="col in cols" :key="col.field" :prop="col.field" :label="col.label" :width="col.width">
                    <template slot-scope="scope">
                        <audio id="audio1" v-show="scope.row[scope.column.property]" preload="none" :src="getUrl(scope.row[scope.column.property])" style="width:200px" controls="controls"></audio>
                    </template>
                </el-table-column>

                <el-table-column align="center" v-else-if="col.field === 'status'" :prop="col.field" :label="col.label" :width="col.width">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 1">已上架</div>
                        <!-- <div v-else-if="scope.row.status == 0 && scope.row.startTime && new Date().getTime() < new Date(scope.row.startTime).getTime()">待上架</div> -->
                        <div v-else-if="scope.row.status == 0 && scope.row.endTime && new Date().getTime() > new Date(scope.row.endTime).getTime()">已下架</div>
                        <div v-else>待上架</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" v-else-if="col.type === 'img'" :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                    <template slot-scope="scope">
                        <a @click="setSrc(scope.row[scope.column.property])">
                            <img :src="scope.row[scope.column.property]" class="header_pic" />
                        </a>
                    </template>
                </el-table-column>
                <el-table-column align="center" v-else :formatter="col.formatter" :prop="col.field" :label="col.label" :width="col.width">
                </el-table-column>

                <el-table-column label="操作" align="center" width="150">
                    <div slot-scope="scope">
                        <el-button-group>
                            <el-button size="mini" type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                            <!-- <el-button size="mini" type="danger" v-if="scope.row['status'] == 1" @click="handleStatus(scope.$index, scope.row)">下架</el-button> -->
                            <!-- <el-button size="mini" type="info" v-if="scope.row['status'] == 0" @click="handleStatus(scope.$index, scope.row)">上架</el-button> -->
                        </el-button-group>
                    </div>
                </el-table-column>
            </div>

        </my-table>

        <el-dialog title="查看" :visible.sync="imageDialog" width="30%">
            <img :src="imgSrc" width="100%" />
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="imageDialog = false">确 定</el-button>
            </span>
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
        list: '/banner/page',
        add: '/banner/add',
        edit: '/banner/update',
        update: '/banner/set',
        delete:'/banner/remove'
      },
      // id 字段
      idField: 'id',
      // 表头字段
      cols: [
        {
          field: 'id',
          label: '资源ID'
        },
        {
          field: 'status',  //status 0.未上架  1.已上架
          label: 'banner状态',
        //   formatter: (row, column, cellValue) => {
        //     switch (cellValue) {
        //         case 0:
        //             return '未上架'
        //             break
        //         case 1:
        //             return '待上架'
        //             break
        //       default:
        //         return '已上架'
        //     }
        //   }
        },
        {
          field: 'indexs',
          label: 'banner位置'
        },
        {
          field: 'url',
          label: '预览图',
          type: 'img'
        },
        {
          field: 'appId',
          label: 'APPID'
        },
        {
          field: 'path',
          label: 'URL'
        },
        {
          field: 'startTime',
          label: '上架时间',
          width:'152'
        },
        {
          field: 'endTime',
          label: '下架时间',
          width:'152'
        }
      ],
      // 表单对象
      editInfo: {},

      searchInfo: {},
      // 表单验证
      validRule: {},
      // ========自定义变量
      imgSrc: '',
      imageDialog: false,
      groupId: 0,           //当前所在 圈子id
      groupName:false,    //当前所在圈子名称
    }
  },
  activated() {
    
    let groupId = this.$router.currentRoute.query.groupId;
    console.log('groupId:',groupId)
    if (groupId) {
      this.groupId = groupId;
      this.api.list = `${this.api.list}?groupId=${groupId}`
      this.groupName = this.$router.currentRoute.query.groupName
    }
  },
  
  methods: {
    // 以下为必备函数
    beforeCommit(param) {},

    handleAdd(param) {
        
      param.needNew = true //打开新页面
      this.editInfo = {}
      this.$router.push({
        path: '/banner/edit',
        query: {
          type: 'add',
          groupId: this.groupId ? this.groupId : 0
        }
      })
    },

    handleEdit(param, row) {
      console.log(this.$refs.table)
      param.needNew = true //打开新页面
      this.editInfo = row;

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
          pathType: row.pathType ? String(row.pathType) : 1,
          status:row.status,
          endTime:row.endTime,
          startTime:row.startTime
        }
      })
    },
    async handleStatus(param, row) {
      var that = this;
      if(row.status == 0){
            let judge = await this.checkout(row)
            if(judge !== "confirm"){
                    return      
            }
      }
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

    // 校验banner位置
    checkout(row){
        return new Promise((resolve, reject) => {
            let data ={
                indexs: row.indexs,
                groupId:row.groupId
            }
            this.$http.post({
                isJson:false,
                url:'/banner/checkBannerIndexs',
                params:data,
                success: res=>{
                    if(res.code != 0){
                        this.$confirm(res.msg, '提示', {
                            confirmButtonText: '确认替换',
                            cancelButtonText: '取消替换',
                            type: 'warning'
                        }).then((res) => { 
                            resolve(res)        
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消操作'
                            });   
                        });
                    }else{
                        const confirm = 'confirm'
                        resolve(confirm)
                    } 
                },
            })
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
  },
  
}
</script>
<style scoped>
.groupName{
    color: #666;
    font-size: 18px;
    line-height: 32px;
}
</style>
