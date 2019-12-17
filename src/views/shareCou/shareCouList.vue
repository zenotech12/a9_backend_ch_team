<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <!--添加-->
        <el-row>
          <el-col :span="24" class="funcList">
            <div class="boxFuncBtn" @click="addCoupon">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="24">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" style="width: 100%">
              <el-table-column :label="$t('lang.type')" width="120">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.type === 1 ? 'primary' : 'success'"
                          close-transition>{{scope.row.type === 1 ? $t('lang.registration') : $t('lang.commonShare')}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="rate" :label="$t('lang.getProbability')" width="100"></el-table-column>
              <el-table-column :label="$t('lang.strategyTime')">
                <template slot-scope="scope">
                  {{scope.row.start_time}}--{{scope.row.end_time}}
                </template>
              </el-table-column>
              <el-table-column :label="$t('lang.couponTypes')">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.coupon_send_type === 1 ? 'primary' : 'success'"
                          close-transition>{{scope.row.coupon_send_type === 1 ? $t('lang.multipleChoices') : $t('lang.all1')}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="$t('lang.couponsList')">
                <template slot-scope="scope">
                  <div v-for="(item, k) in scope.row.coupons" :key="k">
                    {{$t('lang.type')}}:<span style="color: red;">{{item.type === 1 ? $t('lang.freeMinute') : $t('lang.discount')}}</span>
                    <span v-if="item.type === 1">
                      {{$t('lang.minute')}}:<span style="color: red;">{{item.value}}</span>
                    </span>
                    <span v-else>
                      {{$t('lang.discount')}}:<span style="color: red;">{{item.value}}</span>
                    </span>
                    {{$t('lang.effectiveDays')}}:<span style="color: red;">{{item.duaration_day}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('lang.couponProbability')">
                <template slot-scope="scope">
                  {{scope.row.coupons_rate}}
                </template>
              </el-table-column>
              <el-table-column prop="gen_time" :label="$t('lang.addTime')"></el-table-column>
              <el-table-column :label="$t('tools.opt')">
                <template slot-scope="scope">
                  <el-button type="text" @click="editCoupons(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                  <span class="xiexian">|</span>
                  <delete-button :promptInfor="promptInfor" @delData="deleteCoupons(scope.row)"></delete-button>
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
        <el-dialog :title="editTitle" @close="cancel('form')" :close-on-click-modal="false" :visible.sync="dialogFormVisible" center width="650px" style="margin-top: 0vh">
          <el-form :model="form" :rules="formRule" ref="form" label-width="100px">
            <el-form-item :label="$t('lang.type')" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio :label="1">{{$t('lang.registration')}}</el-radio>
                <el-radio :label="2">{{$t('lang.commonShare')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('lang.getProbability')" class="ratebox" prop="rate">
              <el-input-number v-model="form.rate" :min="0" :max="100"></el-input-number> (%)
              <!--<el-input v-model.number="form.rate" auto-complete="off" clearable></el-input>-->
            </el-form-item>
            <el-form-item :label="$t('lang.strategyTime')" prop="timeData">
              <!--<el-date-picker v-model="searchFormTime"-->
                              <!--type="datetimerange"-->
                              <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                              <!--range-separator="至"-->
                              <!--start-placeholder="开始日期"-->
                              <!--end-placeholder="结束日期">-->
              <!--</el-date-picker>-->
              <el-date-picker v-model="form.timeData"
                              type="datetimerange"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :range-separator="$t('lang.to')"
                              :start-placeholder="$t('lang.startDate')"
                              :end-placeholder="$t('lang.endDate')">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('lang.typesOfIssuance')">
              <el-radio-group v-model="form.coupon_send_type">
                <el-radio :label="0">{{$t('lang.all1')}}</el-radio>
                <el-radio :label="1">{{$t('lang.multipleChoices')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('lang.couponsList')" class="start">
              <el-button @click="openCouponDialog" type="primary" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('lang.addCoupons')}}</el-button>
              <el-table :data="couponsListData" style="width: 100%">
                <el-table-column prop="type" :label="$t('lang.type')">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.type === 1 ? 'primary' : 'success'"
                            close-transition>{{scope.row.type === 1 ? $t('lang.freeMinute') : $t('lang.discount')}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="value" :label="$t('lang.minuteDiscount')"></el-table-column>
                <el-table-column prop="duaration_day" :label="$t('lang.effectiveDays')"></el-table-column>
                <el-table-column :label="$t('tools.opt')">
                  <template slot-scope="scope">
                    <el-button type="text" @click="delCouponCurrent(scope.row, scope.$index)" size="small">{{$t('tools.delete')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="distpicker_error" v-if="showAddCoupon">{{$t('lang.pleaseAddCoupon')}}</div>
            </el-form-item>
            <el-form-item class="tagBox" :label="$t('lang.couponProbability')" v-if="form.coupon_send_type === 1 && couponsListData.length >0">
              <el-input style="width: 50px;" v-for="(item, k) in couponsListData.length" :key="k" v-model.number="couponsRate[k]"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="upsertCoupons('form')" :disabled="disabled"></confirm-button>
            <el-button @click="cancel('form')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="$t('lang.addCoupons')" @close="cancelCoupon('couponForm')" :close-on-click-modal="false" append-to-body :visible.sync="dialogcouponForm" center width="450px" style="margin-top: 0vh">
          <el-form :model="couponForm" :rules="couponFormRule" ref="couponForm" label-width="100px">
            <el-form-item :label="$t('lang.type')">
              <el-radio-group v-model="couponForm.type">
                <el-radio :label="1">{{$t('lang.freeMinute')}}</el-radio>
                <el-radio :label="2">{{$t('lang.discount')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="couponForm.type === 1" :label="$t('lang.minute')" prop="value">
              <el-input v-model.number="couponForm.value" clearable></el-input>
            </el-form-item>
            <el-form-item v-if="couponForm.type === 2" :label="$t('lang.discount')" prop="value">
              <el-input v-model.number="couponForm.value" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.effectiveDays')" prop="duaration_day">
              <el-input v-model.number="couponForm.duaration_day" clearable></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="addCouponArray('couponForm')" :disabled="disabledCoupon"></confirm-button>
            <el-button @click="cancelCoupon('couponForm')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { couponUpsert, couponList, couponDel } from '@/api/shareCou'
  export default {
    data() {
      return {
        editTitle: this.$t('lang.addCoupons'),
        promptInfor: this.$t('lang.deleteCurrentCoupon'),
        disabled: false,
        disabledCoupon: false,
        searchForm: {
          skip: 0,
          limit: 10
        },
        form: {
          type: 1, // 配置类型 1新用户注册 2普通分享
          rate: null, // 获取概率,
          start_time: '', // 开始时间
          end_time: '', // 结束时间
          coupons: '', // 优惠券
          coupons_rate: '', // 优惠券概率
          coupon_send_type: 0, // 优惠券发放类型 0全部 1多选一
          timeData: []
        },
        couponsListData: [],
        couponsRate: [],
        formRule: {
          rate: [
            { required: true, message: this.$t('lang.enterAcquisitionPro'), trigger: 'blur' }
          ],
          timeData: [
            { required: true, message: this.$t('lang.chooseTimeDate'), trigger: 'change' }
          ]
        },
        couponForm: {
          type: 1, // 1时间免费分钟； 2折扣
          value: '', //  type时间表示分钟 type折扣表示折扣，75表示75折
          duaration_day: '' // 有效天数
        },
        couponFormRule: {
          value: [
            { required: true, message: this.$t('lang.fillMinuteDiscount'), trigger: 'blur' }
          ],
          duaration_day: [
            { required: true, message: this.$t('lang.enterValidNumberDay'), trigger: 'blur' }
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
        searchFormTime: [],
        dialogcouponForm: false,
        countNumber: 0,
        probabChecked: true,
        successCheck: false,
        checkCoupon: false,
        showAddCoupon: false
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
      },
      searchFormTime(val) {
        if (val !== null) {
          if (val.length === 2) {
            this.form.start_time = val[0]
            this.form.end_time = val[1]
          }
        }
        if (val === null) {
          this.form.start_time = ''
          this.form.end_time = ''
        }
      }
    },
    methods: {
      openCouponDialog() {
        this.dialogcouponForm = true
        this.resetCouponForm()
        this.disabledCoupon = false
      },
      addCouponArray(couponForm) {
        this.$refs[couponForm].validate((valid) => {
          if (valid) {
            this.disabledCoupon = true
            this.couponsListData.push(JSON.parse(JSON.stringify(this.couponForm)))
            this.dialogcouponForm = false
            this.showAddCoupon = false
          } else {
            this.$alert(this.$t('tools.enterComplete'), this.$t('tools.prompt'), {
              confirmButtonText: '',
              center: true,
              type: 'warning'
            })
            this.dialogcouponForm = true
          }
        })
      },
      delCouponCurrent(data, index) {
        this.couponsListData.splice(index, 1)
        this.couponsRate.splice(index, 1)
        if (this.couponsListData.length === 0) {
          this.showAddCoupon = true
        } else {
          this.showAddCoupon = false
        }
      },
      checkProbab() {
        this.countNumber = 0
        this.probabChecked = true
        if (this.form.coupon_send_type === 1) {
          this.couponsRate.forEach(item => {
            this.countNumber++
          })
          if (this.countNumber !== this.couponsListData.length) {
            this.$message.error(this.$t('lang.completePro'))
            this.checkProbab = false
          } else {
            this.couponsRate.forEach(item => {
              if (item === '') {
                this.probabChecked = false
                this.checkProbab = false
              }
            })
            if (this.probabChecked === false) {
              this.$message.error(this.$t('lang.completePro'))
            } else {
              this.successCheck = true
              this.form.coupons_rate = JSON.stringify(this.couponsRate)
            }
          }
        } else {
          this.form.coupons_rate = ''
        }
      },
      checkAddCoupon() {
        if (this.couponsListData.length !== 0) {
          this.checkCoupon = true
          this.showAddCoupon = false
        } else {
          this.checkCoupon = false
          this.showAddCoupon = true
        }
      },
      deleteCoupons(data) {
        couponDel(data.id).then(response => {
          if (response.meta === 0) {
            this.$message.success(this.$t('tools.deleteSuccess'))
            this.getTableData()
          }
        })
      },
      upsertCoupons(form) {
        this.checkProbab()
        this.checkAddCoupon()
        this.$refs[form].validate((valid) => {
          if (valid && this.checkProbab && this.checkCoupon) {
            this.disabled = true
            this.upsertData()
          } else {
            this.$alert(this.$t('tools.enterComplete'), this.$t('tools.prompt'), {
              confirmButtonText: '',
              center: true,
              type: 'warning'
            })
            this.dialogFormVisible = true
          }
        })
      },
      resetCouponForm() {
        this.couponForm.type = 1
        this.couponForm.value = ''
        this.couponForm.duaration_day = ''
      },
      cancel(form) {
        this.dialogFormVisible = false
        this.$refs[form].resetFields()
      },
      cancelCoupon(couponForm) {
        this.dialogcouponForm = false
        this.$refs[couponForm].resetFields()
      },
      addCoupon() {
        this.editTitle = this.$t('lang.addCoupons')
        this.dialogFormVisible = true
        this.disabled = false
        this.form.type = 1
        this.form.rate = null
        this.form.start_time = ''
        this.form.end_time = ''
        this.form.coupons = ''
        this.form.coupons_rate = []
        this.form.coupon_send_type = 0
        this.couponsListData = []
        this.searchFormTime = []
        this.form.timeData = []
      },
      sizeChangeFunc(val) {
        this.pageSize = val
        // this.searchForm.skip = (this.currentPage - 1) * val
        // this.searchForm.limit = val
        // this.getTableData()
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      editCoupons(data) {
        this.disabled = false
        this.form.timeData = []
        this.editTitle = this.$t('lang.editCoupons')
        this.dialogFormVisible = true
        this.form.type = data.type
        this.form.rate = data.rate
        this.form.coupon_send_type = data.coupon_send_type
        console.log('ddd', data)
        // this.form.timeData[0] = data.start_time
        // this.form.timeData[1] = data.end_time
        this.form.timeData.push(data.start_time)
        this.form.timeData.push(data.end_time)
        console.log('this.form.timeData', this.form.timeData)
        this.couponsListData = data.coupons
        if (data.coupons_rate.length !== 0) {
          this.couponsRate = data.coupons_rate
        }
      },
      getTableData() {
        couponList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      search() {
        this.getTableData()
      },
      upsertData() {
        this.form.coupons = JSON.stringify(this.couponsListData)
        this.form.start_time = JSON.parse(JSON.stringify(this.form.timeData[0]))
        this.form.end_time = JSON.parse(JSON.stringify(this.form.timeData[1]))
        console.log('form', this.form)
        couponUpsert(this.form).then(response => {
          if (response.meta === 0) {
            this.$message.success(this.$t('tools.addSuccess'))
            this.dialogFormVisible = false
            this.getTableData()
          }
        }).catch(() => {
          this.disabled = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .ratebox {
    .el-input-number {
      line-height: 28px;
    }
    .el-input-number__decrease, .el-input-number__increase {
      height: 26px;
      top: 1px;
      line-height: 28px;
    }
  }
  .tagBox{
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
  .distpicker_error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
  }
  .xinghao>.el-form-item__label:before{
    content: "*  ";
    color: red;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .dialogOutPop {
    .el-radio-button__inner, .el-radio-group {
      line-height: 40px;
    }
  }
</style>
