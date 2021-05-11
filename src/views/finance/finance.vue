<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span ="24">
            <el-card shadow="always" class="balance-info">
              <span>{{$t('finance.totalTrans')}}：<font>{{balanceDetail.total_trans | price}}</font></span>
              <span>{{$t('finance.balance')}}：<font>{{balanceDetail.balance | price}}</font></span>
              <span>{{$t('finance.balance1')}}：<font>{{balanceDetail.can_withdraw_balance | price}}</font></span>
              <span>{{$t('finance.totalIncome')}}：<font>{{balanceDetail.accumulated_income | price}}</font></span>
              <span>{{$t('finance.toBeIncome')}}：<font>{{balanceDetail.to_be_income | price}}</font></span>
              <span>{{$t('finance.tixianing')}}：<font>{{balanceDetail.withdrawing | price}}</font></span>
              <span>{{$t('finance.tixianed')}}：<font>{{balanceDetail.withdrawed | price}}</font></span>
              <span>{{$t('finance.cashIncome')}}：<font>{{balanceDetail.cash | price}}</font></span>
              <el-button type="primary" v-if="permissionCheck('opt')" size="mini" icon="el-icon-money" @click="addData" class="tx">提现</el-button>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form :inline="true" :model="searchForm">
              <el-form-item :label="$t('finance.timeSpan')">
                <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable
                                v-model="searchTimes"
                                type="daterange"
                                align="right"
                                unlink-panels
                                :range-separator="$t('tools.to')"
                                :start-placeholder="$t('tools.startDate')"
                                :end-placeholder="$t('tools.endDate')">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('finance.moneyChange')">
                <el-row type="flex" >
                  <el-col :span="11" style="padding-top: 4px">
                    <price-input :can-clear="true" style="width: 150px" v-model="searchForm.change_min"></price-input>
                  </el-col>
                  <el-col :span="2" style="text-align: center; width: 20px; height: 40px">-</el-col>
                  <el-col :span="11"  style="padding-top: 4px">
                    <price-input :can-clear="true" style="width: 150px" v-model="searchForm.change_max"></price-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="$t('order.payMethod')">
                <el-select v-model="searchForm.pay_type">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24">
            <div style="height: calc(100vh - 260px)">
              <el-table stripe border :data="tableData" height="calc(100% - 50px)">
                <el-table-column label="#" width="60px">
                  <template slot-scope="scope">
                    {{scope.$index + searchForm.skip + 1}}
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('finance.type')">
                  <template  slot-scope="scope">
                    <span v-if="scope.row.type === 13">{{$t('finance.distributionDeduction')}}</span>
                    <span v-else>{{optType[scope.row.type - 1].name}}</span>
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('finance.change')">
                  <template  slot-scope="scope">
                    {{scope.row.change | price}} <span v-if="scope.row.pay_type === 7">({{$t('finance.cash')}})</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('finance.balance')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.pay_type !== 7">{{scope.row.balance + scope.row.change | price}}</span>
                    <span v-if="scope.row.pay_type === 7">{{scope.row.balance | price}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" :label="$t('finance.genTime')">
                </el-table-column>
                <el-table-column prop="param" :label="$t('finance.param')">
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount">
                </el-pagination>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-dialog :title="$t('finance.tixian')" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px">
            <el-form-item :label="$t('finance.balance1')">
              <span style="color: #f00; font-size: 20px">{{balanceDetail.can_withdraw_balance | price}}</span>
            </el-form-item>
            <el-form-item :label="$t('finance.tixianMoney')">
              <price-input v-model="tixianMoney"></price-input>
            </el-form-item>
            <el-form-item :label="$t('sys.cardNo')">
              <el-select v-model="selectCard" >
                <el-option
                  v-for="item in bankCard"
                  :key="item.id"
                  :label="item.no + '('+ item.card_bank_name_got +')'"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('sys.payPasswordSet')" prop="pay_pass">
              <el-input type="password" v-model="pay_pass" auto-complete="new-password" clearable></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
            <el-button @click="formEditDialog=false" size="small" style="margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { balanceLogs, balanceDetail, tixianAdd } from '@/api/finance'
  import { bankCardsList } from '@/api/system'
  export default {
    components: {
    },
    data() {
      const pz = 10
      return {
        optType: [{ code: 1, name: this.$t('finance.type2') }, { code: 2, name: this.$t('finance.type2') }, { code: 3, name: this.$t('finance.type3') }, { code: 4, name: this.$t('finance.type4') }, { code: 5, name: this.$t('finance.type5') }, { code: 6, name: this.$t('finance.type6') }, { code: 7, name: this.$t('finance.type7') }],
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        formEditDialog: false,
        submitDisabled: false,
        balanceDetail: {},
        tixianMoney: 0,
        bankCard: [],
        selectCard: '',
        searchTimes: [],
        searchForm: {
          bt: '',
          et: '',
          change_min: 0,
          change_max: 0,
          skip: 0,
          limit: pz,
          pay_type: 0 // 7 现金 100 非现金
        },
        pay_pass: '',
        options: [
          {
            label: this.$t('goods.all'),
            value: 0
          },
          {
            label: this.$t('finance.cash'),
            value: 7
          },
          {
            label: this.$t('finance.nonCash'),
            value: 100
          }
        ]
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      },
      searchTimes(val) {
        if (val && val.length >= 2) {
          this.searchForm.bt = val[0]
          this.searchForm.et = val[1]
        } else {
          this.searchForm.bt = ''
          this.searchForm.et = ''
        }
      }
    },
    methods: {
      search() {
        this.getDataListFun()
      },
      getBankCard() {
        bankCardsList({ skip: 0, limit: 100 }).then(res => {
          this.bankCard = res.items
        })
      },
      addData() {
        if (this.bankCard.length < 1) {
          this.$alert(this.$t('finance.tixianTip3'), this.$t('tools.prompt'), {
            confirmButtonText: this.$t('tools.confirm'),
            callback: action => {
              this.$router.push('/system/card')
            }
          })
          return
        }
        this.pay_pass = ''
        this.tixianMoney = this.balanceDetail.can_withdraw_balance
        this.formEditDialog = true
      },
      saveDataFunc() {
        this.submitDisabled = true
        if (this.tixianMoney < 0) {
          this.$message.error(this.$t('finance.tixianTip1'))
          this.submitDisabled = false
          return
        }
        if (this.selectCard === '') {
          this.$message.error(this.$t('finance.tixianTip2'))
          this.submitDisabled = false
          return
        }
        if (this.pay_pass === '') {
          this.$message.error(this.$t('sys.pleaseEnterPayPasswordSet'))
          this.submitDisabled = false
          return
        }
        tixianAdd({ money: this.tixianMoney, bank_card_id: this.selectCard, pay_pass: this.pay_pass }).then(res => {
          this.submitDisabled = false
          this.getBalanceDetail()
          this.getDataListFun()
          this.formEditDialog = false
        }).catch(() => {
          this.submitDisabled = false
        })
      },
      getDataListFun() {
        balanceLogs(this.searchForm).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
        })
      },
      getBalanceDetail() {
        balanceDetail().then(res => {
          this.balanceDetail = res.item
        })
      }
    },
    mounted() {
      this.getDataListFun()
    },
    created() {
      this.getBalanceDetail()
      this.getBankCard()
    }
  }
</script>

<style lang="scss" scoped>
  .balance-info{
    margin-bottom: 10px;
    span{
      display: inline-block;
      margin-right: 10px;
      font{
        color: #ff0000;
      }
    }
    .tx{
      float: right !important;
    }
  }
</style>
