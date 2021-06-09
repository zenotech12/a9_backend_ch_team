<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
          <el-row>
            <el-col>
              <el-form :inline="true" :model="searchForm" @submit.native.prevent>
                <el-form-item :label="$t('order.searchKey')">
                  <el-input v-model="searchForm.key" style="width: 250px" @keyup.native.enter="search" clearable></el-input>
                </el-form-item>
                <el-form-item class="searchBtn">
                    <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-col :span="24" >
            <div style="">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" style="width: 100%;" height="calc(100vh - 175px)" >
              <el-table-column label="#" width="60px">
                <template slot-scope="scope">
                  {{scope.$index + searchForm.skip + 1}}
                </template>
              </el-table-column>
              <el-table-column prop="user_nick_name"  width="200px" :label="$t('sys.optUser')">
                <template slot-scope="scope">
                  {{scope.row.user_nick_name}}/{{scope.row.user_login_name}}
                </template>
              </el-table-column>
              <el-table-column prop="gen_time" width="160px" :label="$t('sys.optTime')"></el-table-column>
              <el-table-column prop="opt_module" width="200px" :label="$t('sys.optModule')"></el-table-column>
              <el-table-column prop="opt_content" :label="$t('sys.optContent')"></el-table-column>
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
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
  import { adminOptLog } from '@/api/system'
  export default {
    data() {
      return {
        pageSize: 20,
        itemCount: 0,
        currentPage: 1,
        tableData: {
          loading: true,
          body: []
        },
        searchForm: {
          skip: 0,
          limit: 20
        }
      }
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
        adminOptLog(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      search() {
        this.getTableData()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .sys-page {
    .distpicker_error {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }
</style>
