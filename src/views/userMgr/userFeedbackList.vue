<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <div class="rightbox">
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-col :span="24">
                <el-table stripe border v-loading="tableData.loading" :data="tableData.body" style="width: 100%">
                  <el-table-column prop="user_login_name" :label="$t('lang.loginName')"></el-table-column>
                  <el-table-column prop="user_nick_name" :label="$t('lang.nickname')"></el-table-column>
                  <el-table-column prop="description" :label="$t('lang.describe')">
                    <template slot-scope="scope">
                      <filter-file :filterContent="scope.row.description"></filter-file>
                    </template>
                  </el-table-column>
                  <el-table-column prop="photos" :label="$t('lang.picture')">
                    <template slot-scope="scope">
                      <photos-list :photosArray="scope.row.photos"></photos-list>
                    </template>
                  </el-table-column>
                  <el-table-column prop="gen_time" :label="$t('lang.feedbackTime')"></el-table-column>
                </el-table>
                <template v-if="itemCount !== 0">
                  <div style="text-align: right;margin-top: 10px">
                    <el-pagination
                      @size-change="sizeChangeFunc"
                      @current-change="pageChangeFunc"
                      :current-page.sync="currentPage"
                      :page-size="10"
                      layout="total, prev, pager, next, jumper"
                      :total="itemCount">
                    </el-pagination>
                  </div>
                </template>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!--添加-->
      </div>
    </div>
    <!-- 搜索 -->
  </div>
</template>

<script>
  import { feedbackList } from '@/api/userMgr'
  import { fileUrl } from '@/utils/serverConfig'
  export default {
    data() {
      return {
        // 文章列表
        searchForm: {
          skip: 0,
          limit: 10
        },
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        imgUrl: fileUrl,
        tableData: {
          loading: true,
          body: []
        }
      }
    },
    created() {
      document.title = this.$t('lang.streetTelevisionBackstage')
    },
    mounted() {
      this.getTableData()
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getTableData()
      }
    },
    methods: {
      sizeChangeFunc(val) {
        this.pageSize = val
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      getTableData() {
        feedbackList(this.searchForm).then(res => {
          if (res.meta === 0) {
            // console.log('data', res.items)
            this.tableData.loading = false
            this.itemCount = res.total
            this.tableData.body = res.items
          }
        })
      }
    }
  }
</script>
