<template>
  <span>
    <span>
      <!--<el-button type="text" @click="showLog = true">查看日志</el-button>-->
      <span @click="showLog = true" style="color: #1E88E5;cursor: pointer;">查看日志</span>
      <slot></slot>
    </span>
    <el-dialog :visible.sync="showLog" title="日志" :append-to-body="true">
      <el-table :data="tableData">
        <el-table-column label="操作人" prop="opt_user.user_name">
          <template slot-scope="scope">
            <span  v-if="scope.row.opt_user.type === 1">{{scope.row.opt_user.admin_name}}(后台)</span>
            <span  v-if="scope.row.opt_user.type === 2">{{scope.row.opt_user.user_name}}(APP)</span>
            <span  v-if="scope.row.opt_user === {}"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作类型" prop="opt_type">
          <template slot-scope="scope">
            <el-tag :type="stateType(scope.row.opt_type,0)"
                    close-transition>{{stateType(scope.row.opt_type,1)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="销毁视频" width="200">
          <template slot-scope="scope">
            <span v-for="(video, k) in scope.row.video">
              <video :src="video"  width="200" height="150" :key="k" controls v-if="video !== ''"></video>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="note"></el-table-column>
        <el-table-column label="修改时间" prop="GenTime"></el-table-column>
      </el-table>
      <div class="fanye" style="text-align: right;margin-top: 10px;">
        <el-pagination
          @current-change="pageChangeFunc"
          :current-page.sync="currentPage"
          :page-size="searchData.limit"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <div slot="footer">
        <el-button @click="showLog = false" style="margin-right: 30px;" size="small">关闭</el-button>
      </div>
    </el-dialog>
  </span>
</template>
<script>
  // import { archivelogList } from '@/api/archives'
  export default {
    name: 'fileLog',
    data() {
      return {
        currentPage: 1,
        showLog: false,
        searchData: {
          archive_id: '',
          opt_type: '',
          skip: 0,
          limit: 10
        },
        tableData: [],
        total: 0
      }
    },
    props: {
      archive_id: '',
      opt_type: ''
    },
    watch: {
      showLog: function(val) {
        if (val) {
          this.searchData.archive_id = this.archive_id
          this.searchData.opt_type = this.opt_type
          this.getList()
        }
      }
    },
    methods: {
      pageChangeFunc(e) {
        this.searchData.skip = (e - 1) * this.searchData.limit
        this.getList()
      },
      getList() {
        // archivelogList(this.searchData).then(res => {
        //   this.tableData = res.items
        //   this.total = res.total
        // })
      },
      stateType(val, t) {
        var tStr = ''
        switch (val) {
          case 1:
            tStr = t === 1 ? '档案添加' : ''
            break
          case 2:
            tStr = t === 1 ? '档案修改' : 'danger'
            break
          case 3:
            tStr = t === 1 ? '档案下架' : 'success'
            break
          case 4:
            tStr = t === 1 ? '档案上架' : 'info'
            break
          case 5:
            tStr = t === 1 ? '销毁' : 'info'
            break
        }
        return tStr
      }
    },
    mounted() {
      // console.log(this)
    }
  }
</script>
<style lang="scss" scoped></style>
