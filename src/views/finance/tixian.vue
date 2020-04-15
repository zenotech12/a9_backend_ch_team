<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span ="24">
            <el-card shadow="always" class="balance-info">
              <span>{{$t('finance.balance')}}：<font>{{balanceDetail.balance | price}}</font></span>
              <span>{{$t('finance.balance1')}}：<font>{{balanceDetail.can_withdraw_balance | price}}</font></span>
              <span>{{$t('finance.totalIncome')}}：<font>{{balanceDetail.accumulated_income | price}}</font></span>
              <span>{{$t('finance.toBeIncome')}}：<font>{{balanceDetail.to_be_income | price}}</font></span>
              <span>{{$t('finance.tixianing')}}：<font>{{balanceDetail.withdrawing | price}}</font></span>
              <span>{{$t('finance.tixianed')}}：<font>{{balanceDetail.withdrawed | price}}</font></span>
              <el-button type="primary" size="mini" icon="el-icon-money" @click="addData" class="tx">提现</el-button>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 200px)">
              <el-table stripe border :data="tableData" height="calc(100% - 50px)">
                <el-table-column :label="$t('finance.tixianMoney')">
                  <template  slot-scope="scope">
                    {{scope.row.money | price}}
                  </template>
                </el-table-column>
                <el-table-column   :label="$t('finance.txStatus')">
                  <template  slot-scope="scope">
                    {{txStatus[scope.row.status - 1].name}}
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" :label="$t('finance.genTime')">
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
  import { tixianList, balanceDetail, tixianAdd } from '@/api/finance'
  import { bankCardsList } from '@/api/system'
  export default {
    components: {
    },
    data() {
      const pz = 10
      return {
        txStatus: [{ code: 1, name: this.$t('finance.txStatus1') }, { code: 2, name: this.$t('finance.txStatus2') }, { code: 3, name: this.$t('finance.txStatus3') }],
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        formEditDialog: false,
        submitDisabled: false,
        balanceDetail: {},
        tixianMoney: 0,
        bankCard: [],
        selectCard: ''
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
      }
    },
    methods: {
      getBankCard() {
        bankCardsList({ skip: 0, limit: 100 }).then(res => {
          this.bankCard = res.items
        })
      },
      addData() {
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
        tixianAdd({ money: this.tixianMoney, bank_card_id: this.selectCard }).then(res => {
          this.submitDisabled = false
          this.getBalanceDetail()
          this.getDataListFun()
          this.formEditDialog = false
        }).catch(() => {
          this.submitDisabled = false
        })
      },
      getDataListFun() {
        tixianList(this.searchForm).then(res => {
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
      this.getBankCard()
      this.getBalanceDetail()
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
