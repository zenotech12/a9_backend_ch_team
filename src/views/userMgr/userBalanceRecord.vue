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
                <el-select v-model="searchForm.order_type" @change="search" :placeholder="$t('lang.pleaseSelectOrderType')">
                  <el-option
                    v-for="item in orderTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="24">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" style="width: 100%">
              <el-table-column prop="user_login_name" :label="$t('lang.loginName')"></el-table-column>
              <el-table-column prop="user_nick_name" :label="$t('lang.nickname')"></el-table-column>
              <el-table-column :label="$t('lang.orderType')">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.order_type === 1">{{$t('lang.depositOrder')}}</el-tag>
                  <el-tag v-if="scope.row.order_type === 2" type="success">{{$t('lang.rechargeOrder')}}</el-tag>
                  <el-tag v-if="scope.row.order_type === 3" type="info">{{$t('lang.consumptionOrder')}}</el-tag>
                  <el-tag v-if="scope.row.order_type === 4" type="warning">{{$t('lang.depositRefundOrder')}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="$t('lang.payType')">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.pay_type === 1">{{$t('lang.balance')}}</el-tag>
                  <el-tag v-if="scope.row.pay_type === 2" type="success">{{$t('lang.alipay')}}</el-tag>
                  <el-tag v-if="scope.row.pay_type === 3" type="warning">{{$t('lang.weChat')}}</el-tag>
                  <el-tag v-if="scope.row.pay_type === 4" type="info">paypal</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="change" :label="$t('lang.amountChange')"></el-table-column>
              <el-table-column prop="balance" :label="$t('lang.balance')"></el-table-column>
              <el-table-column prop="deposit" :label="$t('lang.deposit')"></el-table-column>
              <el-table-column prop="gen_time" :label="$t('lang.generationTime')"></el-table-column>
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
  import { consumptionList } from '@/api/userMgr'
  export default {
    data() {
      return {
        searchForm: {
          skip: 0,
          limit: 10,
          user_id: '',
          order_type: -1 // -1所有 1押金订单2充值订单 3消费订单 4押金退款订单
        },
        orderTypeList: [{
          value: -1,
          label: this.$t('lang.all')
        }, {
          value: 1,
          label: this.$t('lang.depositOrder')
        }, {
          value: 2,
          label: this.$t('lang.rechargeOrder')
        }, {
          value: 3,
          label: this.$t('lang.consumptionOrder')
        }, {
          value: 4,
          label: this.$t('lang.depositRefundOrder')
        }],
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
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
      const paramsId = this.$route.params.id
      // console.log('paramsId', paramsId)
      if (paramsId !== undefined) {
        if (paramsId !== '' && paramsId.length === 24) {
          this.searchForm.user_id = paramsId
        }
      }
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
        consumptionList(this.searchForm).then(response => {
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
