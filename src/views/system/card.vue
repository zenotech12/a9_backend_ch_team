<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <!--添加-->
        <el-row>
          <el-col :span="24" class="funcList">
            <div class="boxFuncBtn" v-if="permissionCheck('opt')" @click="addData">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
            <div class="boxFuncBtn" v-if="isOwner" @click="setPayPassFunc" style="margin-right: 20px">
              <el-button type="text" icon="el-icon-bank-card" size="small">{{$t('sys.setPayPass')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="24">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" style="width: 100%">
              <el-table-column label="#" width="60px">
                <template slot-scope="scope">
                  {{scope.$index + searchForm.skip + 1}}
                </template>
              </el-table-column>
              <el-table-column prop="no" :label="$t('sys.cardNo')">
              </el-table-column>
              <el-table-column prop="bank_name" :label="$t('sys.bank')"></el-table-column>
              <el-table-column prop="card_bank_name_got"  :label="$t('sys.cardBank')">
              </el-table-column>
              <el-table-column prop="mobile" :label="$t('sys.cardMobile')"></el-table-column>
              <el-table-column :label="$t('tools.opt')" width="80px"  v-if="permissionCheck('opt')">
                <template slot-scope="scope">
                    <delete-button :promptInfor="promptInfor" @delData="delData(scope.row)"></delete-button>
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
        <el-dialog :title="editTitle" @close="cancel('form')" :close-on-click-modal="false" :visible.sync="dialogFormVisible" center width="400px" style="margin-top: 0vh">
          <el-form :model="form" :rules="formRule" ref="form" label-width="80px">
            <el-form-item :label="$t('sys.cardNo')" prop="no">
              <el-input style="width: 200px" v-model="form.no" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.bank')" prop="bank_name">
              <el-input style="width: 200px" v-model="form.bank_name" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.cardBank')" prop="card_bank_name_got">
              <el-input style="width: 200px" v-model="form.card_bank_name_got" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.cardMobile')" prop="mobile">
              <el-input style="width: 200px" v-model="form.mobile" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="upsertDataFunc('form')" :disabled="disabled"></confirm-button>
            <el-button @click="cancel('form')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="setPayPassTitle" @close="cancelSet('setForm')" :close-on-click-modal="false" :visible.sync="setPayPassShow" center width="400px" style="margin-top: 0vh">
          <el-form :model="setForm" :rules="setFormRule" ref="setForm" label-width="120px">
            <el-form-item :label="$t('sys.codePhone')" prop="code">
              <el-input v-model="setForm.code" auto-complete="off" clearable>
                <el-button @click="getVerificationCode" v-if="show" slot="append">获取验证码</el-button>
                <span slot="append" class="show-pwd" v-if="!show">{{$t('login.areadySend')}}({{count}}s)</span>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.payPasswordSet')" prop="pay_pass">
              <el-input type="password" v-model="setForm.pay_pass" auto-complete="new-password" clearable></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="upsertPayPass('setForm')" :disabled="disabled"></confirm-button>
            <el-button @click="cancelSet('setForm')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { bankCardsList, bankCardsAdd, bankCardsDel, resetPayPass, mobileCode } from '@/api/system'
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        editTitle: this.$t('sys.cardEdit'),
        disabled: false,
        promptInfor: this.$t('sys.delCardTip'),
        enterpriseList: [],
        searchForm: {
          skip: 0,
          limit: 10
        },
        form: {
          id: '',
          no: '',
          card_bank_name_got: '',
          bank_name: '',
          mobile: ''
        },
        formRule: {
          no: [
            { required: true, message: this.$t('sys.cardNoTip'), trigger: 'blur' }
          ], card_bank_name_got: [
            { required: true, message: this.$t('sys.cardBankTip'), trigger: 'blur' }
          ], bank_name: [
            { required: true, message: this.$t('sys.bankTip'), trigger: 'blur' }
          ], mobile: [
            { required: true, message: this.$t('sys.cardMobileTip'), trigger: 'blur' }
          ]
        },
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        tableData: {
          loading: true,
          body: []
        },
        dialogFormVisible: false,
        isOwner: false,
        setPayPassTitle: this.$t('sys.setPayPass'),
        setPayPassShow: false,
        setForm: {
          code: '',
          pay_pass: ''
        },
        setFormRule: {
          code: [
            { required: true, message: this.$t('sys.enterCodePhone'), trigger: 'blur' }
          ],
          pay_pass: [
            { required: true, message: this.$t('sys.enterPayPasswordSet'), trigger: 'blur' }
          ]
        },
        timer: null,
        show: true,
        count: 0
      }
    },
    computed: {
      ...mapGetters([
        'shopInfo'
      ])
    },
    mounted() {
      this.getTableData()
      this.isOwner = this.shopInfo.user_info.owner
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getTableData()
      }
    },
    methods: {
      getVerificationCode() {
        const timeCount = 60
        if (!this.timer) {
          this.count = timeCount
          mobileCode({ 'type': 'paypass' }).then(res => {
            if (res.meta === 0) {
              this.show = false
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= timeCount) {
                  this.count--
                } else {
                  this.show = true
                  clearInterval(this.timer)
                  this.timer = null
                }
              }, 1000)
            }
          })
        }
      },
      setPayPassFunc() {
        this.setPayPassShow = true
      },
      cancelSet(setForm) {
        this.setPayPassShow = false
        this.$refs[setForm].resetFields()
      },
      upsertPayPass(setForm) {
        this.$refs[setForm].validate((valid) => {
          if (valid) {
            this.disabled = true
            resetPayPass(this.setForm).then(res => {
              if (res.meta === 0) {
                this.setPayPassShow = false
                this.$message.success(this.$t('sys.setPayPassSuccess'))
              }
            }).catch(() => {
              this.disabled = false
            })
          } else {
            this.setPayPassShow = true
          }
        })
      },
      upsertDataFunc(form) {
        this.dialogFormVisible = false
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.disabled = true
            this.upsertData(this.type)
          } else {
            this.$alert(this.$t('lang.pleaseEnterComplete'), this.$t('lang.tips'), {
              confirmButtonText: '',
              center: true,
              type: 'warning'
            })
            this.dialogFormVisible = true
          }
        })
      },
      cancel(form) {
        this.dialogFormVisible = false
        this.$refs[form].resetFields()
      },
      addData() {
        this.dialogFormVisible = true
        this.disabled = false
        this.form.id = ''
        this.form.no = ''
        this.form.card_bank_name_got = ''
        this.form.bank_name = ''
        this.form.mobild = ''
      },
      sizeChangeFunc(val) {
        this.pageSize = val
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      getTableData() {
        bankCardsList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      delData(data) {
        bankCardsDel(data.id).then(response => {
          if (response.meta === 0) {
            this.$message.success(this.$t('lang.successfulDel'))
            this.getTableData()
          }
        })
      },
      search() {
        this.getTableData()
      },
      upsertData(data) {
        if (!this.form.mobile) {
          this.$message.error(this.$t('sys.mobileTip'))
          return
        }
        if (!this.form.id) {
          bankCardsAdd(this.form).then(response => {
            if (response.meta === 0) {
              this.$message.success(this.$t('lang.successfulPresservation'))
              this.dialogFormVisible = false
              this.getTableData()
            }
          })
        }
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
