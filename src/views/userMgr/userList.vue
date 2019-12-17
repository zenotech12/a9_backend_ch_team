<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <!--添加-->
        <el-row>
          <el-col :span="24">
            <el-form :inline="true" :model="searchForm">
              <el-form-item>
                <el-input v-model="searchForm.name" :placeholder="$t('lang.pleaseEnterUserName')" clearable></el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 0">
                <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="24">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" style="width: 100%">
              <el-table-column prop="login_name" :label="$t('lang.loginName')"></el-table-column>
              <el-table-column prop="nick_name" :label="$t('lang.nickname')"></el-table-column>
              <el-table-column prop="balance" :label="$t('lang.balance')"></el-table-column>
              <el-table-column prop="deposit" :label="$t('lang.deposit')"></el-table-column>
              <el-table-column prop="last_login_time" :label="$t('lang.lastLogonTime')"></el-table-column>
              <el-table-column :label="$t('tools.opt')">
                <template slot-scope="scope">
                  <el-button type="text" @click="orderRecord(scope.row)" size="small">{{$t('lang.orderRecord')}}</el-button>
                  <span class="xiexian">|</span>
                  <el-button type="text" @click="balanceRecord(scope.row)" size="small">{{$t('lang.balanceRecord')}}</el-button>
                </template>
              </el-table-column>
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
      </div>
    </div>
  </div>
</template>

<script>
  import { userList } from '@/api/userMgr'
  export default {
    data() {
      return {
        searchForm: {
          skip: 0,
          limit: 10,
          name: ''
        },
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        tableData: {
          loading: true,
          body: []
        },
        dialogFormVisible: false
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
      // 订单列表跳转
      orderRecord(data) {
        this.$router.push({
          name: 'userOrderList',
          params: {
            id: data.id
          }
        })
      },
      // 余额记录列表跳转
      balanceRecord(data) {
        this.$router.push({
          name: 'userBalanceRecord',
          params: {
            id: data.id
          }
        })
      },
      getTableData() {
        userList(this.searchForm).then(response => {
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
</style>
