<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24">
            <el-tabs style="height: 40px" v-if="showTab" v-model="tab_status">
              <el-tab-pane style="height: 44px" v-for="(item, k) in orderStatusTab"  :key="k" v-if="item.label" :label="item.label" :name="k + ''"></el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span ="24" style="margin-top: 15px">
            <el-form :inline="true" :model="searchForm">
              <el-form-item :label="$t('order.returnOrder')">
                <el-input v-model="searchForm.order_no" style="width: 250px" clearable @input="handleSearchOrder"></el-input>
              </el-form-item>
              <el-form-item>
                <!-- <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="Sdate"
                  type="daterange"
                  align="right"
                  unlink-panels
                  :range-separator="$t('tools.to')"
                  :start-placeholder="$t('tools.startDate')"
                  :end-placeholder="$t('tools.endDate')">
                </el-date-picker> -->
              </el-form-item>
              <el-form-item v-if="searchForm.type !== 2">
                <el-select v-model="searchForm.type" clearable>
                  <el-option
                    v-for="(item, k) in returnType"
                    :key="k"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('order.DateTime')">
                <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable
                                v-model="orderTimes"
                                type="daterange"
                                align="right"
                                unlink-panels
                                :range-separator="$t('tools.to')"
                                :start-placeholder="$t('tools.startDate')"
                                :end-placeholder="$t('tools.endDate')">
                </el-date-picker>
              </el-form-item>
              <el-form-item class="searchBtn">
                <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 225px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)">
                <el-table-column label="#" width="60px" fixed="left">
                  <template slot-scope="scope">
                    {{scope.$index + searchForm.skip + 1}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.user')" width="150">
                  <template slot-scope="scope">
                    <div class="ui">{{scope.row.user_nick_name}}</div>
                    <div class="ui">{{scope.row.user_mobile}}</div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.returnType')" width="200" align="center">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.type === 2 ? 'success': ''">{{returnType1[scope.row.type]}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('order.returnGoods')" min-width="550">
                  <template  slot-scope="scope">
                    <a class="" target="_blank" v-for="(item, k) in scope.row.goods_items" :key="k" :href="goodsPreview(item)">
                      <div style="padding-bottom: 20px">
                        <el-row type="flex" class="row-bg" justify="space-between">
                          <el-col :span="5">                            
                            <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(item.sku_img,100,100)"  fit="cover"></el-image>
                          </el-col>
                          <el-col :span="19">
                            <div class="g-info">
                              <p style="margin-bottom: 5px"><span class="bold-text">{{item.spu_name}}</span></p>
                              <span>
                                <span v-for="(v,k) in item.specifications" :key="k"> {{k}}：<font class="bold-text">{{v}}</font><br/></span>
                              </span>
                              <span class="bold-text">{{item.price | price}} x {{item.count}}</span>
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="clear"></div>
                    </a>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.returnPrice')" width="130" align="center">
                  <template slot-scope="scope">
                    <span class="bold-text">{{scope.row.amount | price}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="order_no" :label="$t('order.returnOrder')" width="180">
                </el-table-column>
                <el-table-column :label="$t('order.status')" width="150" align="center" header-align="left">
                  <template slot-scope="scope" >
                    <el-tag :type="orderStatusColor[scope.row.status]">{{orderStatus[scope.row.status]}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" :label="$t('order.returnTime')" width="200">
                  <template slot-scope="scope" >
                    <el-popover placement="left" width="350" trigger="click">
                      <el-timeline style="margin-top: 10px">
                        <el-timeline-item
                          v-for="(record, index) in scope.row.operations_records"
                          :key="index"
                          :timestamp="record.time">
                          <div class="ui"><span style="font-weight: bold; color: black; padding-right: 10px">{{record.operator_name}}</span>{{orderStatus[record.status]}}</div>
                        </el-timeline-item>
                      </el-timeline>
                      <a slot="reference" class="gt"><i class="el-icon-arrow-left"></i>{{scope.row.gen_time}}</a>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "100" fixed="right" align="center">
                  <template slot-scope="scope">
                    <el-button type="success" @click="showReturnOrderDetail(scope.row)" size="small">{{$t('tools.detail')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px" v-if="itemCount > 0">
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
        <el-dialog width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <span slot="title" style="font-weight: bold; font-size: 15px">{{$t('order.returnTitle')}}</span>
          <el-form>
            <el-form-item>
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="4" class="label">{{$t('order.no')}}:</el-col>
                <el-col :span="19">
                  {{returnOrder.order_no}}
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="4" class="label">{{$t('order.user')}}:</el-col>
                <el-col :span="19">
                  {{returnOrder.user_nick_name}}&nbsp;&nbsp;{{returnOrder.user_mobile}}
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <span class="label">{{$t('order.returnGoods')}}:</span>
              <div class="" v-if="returnOrder.id" v-for="(goods, i) in returnOrder.goods_items" :key="i" style="margin-top: 15px">
                <el-row type="flex" class="row-bg" justify="space-between">
                  <el-col :span="6">
                    <el-image class="image" style="width: 120px; height: 120px" :src="getImageUrl(goods.sku_img,120,120)" fit="cover"></el-image>
                  </el-col>
                  <el-col :span="19"> 
                    <div class="g-info">
                      <p style="margin-bottom: 7px">
                        <el-tag :type="returnOrder.type === 2 ? 'success': ''">{{returnType1[returnOrder.type]}}</el-tag>&nbsp;&nbsp;
                        <span class="bold-text" style="word-break: normal">{{goods.spu_name}}</span>
                      </p>
                      <span>
                        <span v-for="(v,k) in goods.specifications" :key="k"> {{k}}：<font class="bold-text">{{v}}</font><br/></span>
                      </span>
                      <span>
                        <span>{{$t('order.price3')}}：</span>
                        <span class="bold-text">{{goods.price | price}}</span>；
                        <span>{{$t('order.number')}}：</span>
                        <span class="bold-text">{{goods.count}}</span>
                      </span>
                    </div>
                  </el-col>
                </el-row>
                <!-- <div class="clear"></div> -->
              </div>
            </el-form-item>
            <el-form-item>
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="11" class="label">{{$t('order.returnReason')}}:</el-col>
                <el-col :span="13">
                  {{returnOrder.comment}}
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="returnOrder.type===1 || returnOrder.type===3 ">
              <span class="label">{{$t('order.returnPrice')}}:</span>
              <price-input v-model="amount" :disabled="true" clearable></price-input>
            </el-form-item>
            <el-form-item v-if="returnOrder.type===2 && returnOrder.shipping_address">
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="4" class="label">{{$t('order.returnUserAddr')}}:</el-col>
                <el-col :span="19">
                  {{returnOrder.shipping_address.address.province + returnOrder.shipping_address.address.city + returnOrder.shipping_address.address.district}}&nbsp;{{returnOrder.shipping_address.address.addr}}
                  <br/>
                  {{returnOrder.shipping_address.contacter_name}}&nbsp;&nbsp;{{returnOrder.shipping_address.mobile}}
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="returnOrder.status === 1 && returnOrder.type !== 3">
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="4" class="label">{{$t('order.returnAddr')}}:</el-col>
                <el-col :span="19">
                  <el-select v-model="addressId" style="width: 300px" >
                    <el-option
                      v-for="item in addressList"
                      :key="item.id"
                      :label="item.province + item.city + item.district"
                      :value="item.id">
                      <div class="address-item">
                        <p>{{item.province + item.city + item.district + item.addr}}</p>
                        <p>{{item.contacter_name + item.mobile}}</p>
                      </div>
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="(returnOrder.status === 3 || returnOrder.status === 5 || returnOrder.status === 6) && returnOrder.type !== 3 && returnOrder.merchant_shipping_address">
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="6" class="label">{{$t('order.returnAddr')}}:</el-col>
                <el-col :span="18">
                  {{returnOrder.merchant_shipping_address.address.province + returnOrder.merchant_shipping_address.address.city + returnOrder.merchant_shipping_address.address.district}}&nbsp;{{returnOrder.merchant_shipping_address.address.addr}}
                  <br/>
                  {{returnOrder.merchant_shipping_address.contacter_name}}&nbsp;&nbsp;{{returnOrder.merchant_shipping_address.mobile}}
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="(returnOrder.status === 5 || returnOrder.status === 6|| returnOrder.status === 8) && (returnOrder.type === 1 || returnOrder.type === 2)">
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="6" class="label">{{$t('order.returnExpress')}}:</el-col>
                <el-col :span="18">
                  <a target="_blank" :href="getKuaidi100Url(returnOrder.express2merchant.company, returnOrder.express2merchant.novar)">{{expressageList[returnOrder.express2merchant.company]}}&nbsp;&nbsp;{{returnOrder.express2merchant.novar}}<i class="el-icon-arrow-right"></i> </a>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="(returnOrder.status === 5 || returnOrder.status === 8)  && returnOrder.type === 2">
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="6" class="label">{{$t('order.returnExpress1')}}:</el-col>
                <el-col :span="18">
                  <a target="_blank" :href="getKuaidi100Url(returnOrder.express2user.company, returnOrder.express2user.novar)">{{expressageList[returnOrder.express2user.company]}}&nbsp;&nbsp;{{returnOrder.express2user.novar}}<i class="el-icon-arrow-right"></i> </a>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="returnOrder.status === 6 && returnOrder.type === 2">
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="6" class="label">{{$t('order.returnExpress1')}}:</el-col>
                <el-col :span="18">
                  <el-row :gutter="24">
                    <el-col :span="11">
                      <express-selector v-model="expressCompany"></express-selector>
                    </el-col>
                    <el-col :span="13">
                      <el-input v-model="expressNo" clearable :placeholder="$t('order.expressNo')"></el-input>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="(returnOrder.status === 1 && returnOrder.type === 3) || (returnOrder.type === 1 && returnOrder.status === 6)" prop="pay_pass">
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="6" class="label">{{$t('sys.payPasswordSet')}}:</el-col>
                <el-col :span="18">
                  <el-input type="password" v-model="pay_pass" auto-complete="new-password" clearable></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="permissionCheck('opt') && (returnOrder.status === 1 || returnOrder.status === 6)">
            <template v-if="returnOrder.status ===1">
              <confirm-button v-if="returnOrder.type === 3" @confirmButton="saveDataFunc(5)" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.agree')"></confirm-button>
              <confirm-button v-else @confirmButton="saveDataFunc(3)" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.agree')"></confirm-button>
              <confirm-button @confirmButton="saveDataFunc(4)" :confirmButtonInfor="$t('tools.refuse')" btnType="danger"></confirm-button>
            </template>
            <template v-else>
              <confirm-button @confirmButton="saveDataFunc(5)" :disabled="submitDisabled" :confirmButtonInfor="returnOrder.type === 1 ? $t('order.returnExpress3') : $t('order.returnExpress2')"></confirm-button>
            </template>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { orderAfterSales, orderAfterSalesOpt, afterSalesCount } from '@/api/order'
  import { shippingAddressesList } from '@/api/system'
  import expressage from '@/utils/expressage'
  export default {
    components: {
    },
    data() {
      const pz = 10
      return {
        returnType1: [this.$t('tools.all'), this.$t('order.returnType1'), this.$t('order.returnType2'), this.$t('order.returnType3')],
        returnType: [
          {
            value: 4,
            label: this.$t('tools.all')
          },
          {
            value: 1,
            label: this.$t('order.returnType1')
          },
          {
            value: 3,
            label: this.$t('order.returnType3')
          }
        ],
        orderStatus: [this.$t('tools.all'), this.$t('order.returnStatus1'), this.$t('order.returnStatus2'), this.$t('order.returnStatus3'), this.$t('order.returnStatus4'), this.$t('order.returnStatus5'),
          this.$t('order.returnStatus6'), '', this.$t('order.returnStatus8')],
        orderStatusColor: ['primary', 'warning', 'danger', 'warning', 'danger', 'primary',
          'primary', '', 'success'],
        orderStatusTab: [{ value: '0', label: this.$t('tools.all') }, { value: '1', label: this.$t('order.returnStatus1') }, { value: '2', label: this.$t('order.returnStatus2') }, { value: '3', label: this.$t('order.returnStatus3') }, { value: '4', label: this.$t('order.returnStatus4') },
          { value: '5', label: this.$t('order.returnStatus5') }, { value: '6', label: this.$t('order.returnStatus6') }, { value: '7', label: '' }, { value: '8', label: this.$t('order.returnStatus8') }],
        searchForm: {
          type: 0, // 1退货 2换货 3只退钱 4退货和只退钱
          order_no: '',
          status: 0,
          skip: 0,
          limit: pz,
          bt: '',
          et: ''
        },
        Sdate: [],
        tab_status: '0',
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        amount: 0,
        expressCompany: '',
        expressNo: '',
        addressId: '',
        defaultAddr: '',
        returnOrder: { shipping_address: { address: {}}},
        formEditDialog: false,
        submitDisabled: false,
        addressList: [],
        expressageList: expressage,
        pay_pass: '',
        tabList: [],
        showTab: false,
        searchParamKey: '',
        doWatch: true,
        orderTimes: []
      }
    },
    computed: {
      ...mapGetters([
        'userInfo', 'searchParam'
      ])
    },
    watch: {
      tab_status(val) {
        // console.log('val', val)
        if (!this.doWatch) {
          return
        }
        this.searchForm.skip = 0
        this.searchForm.limit = this.pageSize
        this.searchForm.status = parseInt(val)
        this.currentPage = 1
        this.getDataListFun()
      },
      currentPage(val) {
        if (!this.doWatch) {
          return
        }
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      },
      // 按时间段查询订单
      orderTimes(val) {
        if (val && val.length === 2) {
          this.searchForm.bt = val[0]
          this.searchForm.et = val[1]
        } else {
          this.searchForm.bt = ''
          this.searchForm.et = ''
        }
      },
      '$route.path': {
        handler(newVal) {
          const str = newVal.split('/')[2]
          this.showTab = false
          this.searchParamKey = str
          if (this.searchParam[this.searchParamKey]) {
            this.doWatch = false
            this.searchForm = this.searchParam[this.searchParamKey]
            this.currentPage = parseInt((this.searchForm.skip / this.pageSize) + 1)
            this.tab_status = this.searchForm.status + ''
          }
          if (str === 'orderExchange') { // 换货
            this.searchForm.type = 2
            this.tabList = [{ value: '0', label: this.$t('tools.all') }, { value: '1', label: this.$t('order.returnStatus1') }, { value: '2', label: this.$t('order.returnStatus2') }, { value: '3', label: this.$t('order.returnStatus3') }, { value: '4', label: this.$t('order.returnStatus4') },
              { value: '5', label: this.$t('order.returnStatus5') }, { value: '6', label: this.$t('order.returnStatus6') }, { value: '7', label: '' }, { value: '8', label: this.$t('order.returnStatus8') }]
          } else if (str === 'orderReturn') { // 退货
            this.searchForm.type = 4
            this.tabList = [{ value: '0', label: this.$t('tools.all') }, { value: '1', label: this.$t('order.returnStatus1') }, { value: '2', label: this.$t('order.returnStatus2') }, { value: '3', label: this.$t('order.returnStatus3') }, { value: '4', label: this.$t('order.returnStatus4') },
              { value: '9', label: '' }, { value: '6', label: this.$t('order.returnStatus6') }, { value: '7', label: '' }, { value: '8', label: this.$t('order.returnStatus8') }]
          }
          this.searchForm.order_no = this.$route.params.order_no ? this.$route.params.order_no : ''
          this.getDataListFun()
          this.getAfterSalesCount()
        },
        immediate: true
      }
    },
    methods: {
      handleSearchOrder(value) {
        var newString = "";
        for (var i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) >= 48 && value.charCodeAt(i) <= 57) {
            newString += value[i];
          }
          else {
            break;
          }
        }
        this.searchForm.order_no = newString;
      },
      getAfterSalesCount() {
        this.orderStatusTab = JSON.parse(JSON.stringify(this.tabList))

        afterSalesCount({ type: this.searchForm.type }).then(res => {
          if (res.meta === 0) {
            res.items.forEach(item => {
              this.orderStatusTab.forEach((Z, k) => {
                if (Z.value === item.aftersale_status.toString()) {
                  this.orderStatusTab[k].label = this.orderStatusTab[k].label + '(' + item.aftersale_count + ')'
                }
              })
            })
          }
          this.showTab = true
        })
      },
      goodsPreview(row) {
        return 'https://www.a9kh.com/goods/' + row.spu_id + '.html'
        // this.currentGoods = appUrl + '/goods/info?id=' + row.id
        // this.commodityPreviewShow = true
      },
      // 详情
      showReturnOrderDetail(data) {
        this.returnOrder = data
        this.amount = data.amount
        this.addressId = (data.merchant_shipping_address && data.merchant_shipping_address.id) ? data.merchant_shipping_address.id : this.defaultAddr
        this.expressCompany = ''
        this.expressNo = ''
        this.pay_pass = ''
        this.formEditDialog = true
      },
      saveDataFunc(status) {
        this.submitDisabled = true
        orderAfterSalesOpt(this.returnOrder.id, { status: status, address_id: this.addressId, amount: this.amount, express_company: this.expressCompany, express_no: this.expressNo, pay_pass: this.pay_pass }).then(res => {
          this.$message.success(this.$t('order.returnTip'))
          this.submitDisabled = false
          this.getDataListFun()
          this.formEditDialog = false
        }).catch(() => {
          this.submitDisabled = false
        })
      },
      getDataListFun() {
        this.$store.dispatch('SetSearchParam', { key: this.searchParamKey, value: JSON.parse(JSON.stringify(this.searchForm)) })
        orderAfterSales(this.searchForm).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
          this.doWatch = true
        })
      },
      getAddressListFunc() {
        shippingAddressesList().then(res => {
          console.log(res);
          this.addressList = res.items
          const defaultAddr = this.addressList.find(addr => {
            return addr.default === true
          })
          this.defaultAddr = typeof (defaultAddr) !== 'undefined' ? defaultAddr.id : (this.addressList.length > 0 ? this.addressList[0].id : '')
        })
      },
      // 查询
      search() {
        this.currentPage = 1
        this.searchForm.skip = 0
        this.getDataListFun()
        this.getAfterSalesCount()
        // console.log(JSON.stringify(this.Sdate));
      },
      getKuaidi100Url(com, nu) {
        return `https://www.kuaidi100.com/chaxun?com=${com}&nu=${nu}`
      }
    },
    mounted() {
      // const currentRouter = this.$router.currentRoute.name
      // if (currentRouter === 'orderExchange') {
      //   this.searchForm.type = 2
      // } else if (currentRouter === 'orderReturn') {
      //   this.searchForm.type = 4
      //   this.orderStatusTab = [{ value: '0', label: this.$t('tools.all') }, { value: '1', label: this.$t('order.returnStatus1') }, { value: '2', label: this.$t('order.returnStatus2') }, { value: '3', label: this.$t('order.returnStatus3') }, { value: '4', label: this.$t('order.returnStatus4') },
      //     { value: '9', label: '' }, { value: '6', label: this.$t('order.returnStatus6') }, { value: '7', label: '' }, { value: '8', label: this.$t('order.returnStatus8') }]
      // }
      // this.tabList = JSON.parse(JSON.stringify(this.orderStatusTab))
      // this.searchForm.order_no = this.$route.params.order_no ? this.$route.params.order_no : ''
      // this.getDataListFun()
      // this.getAfterSalesCount()
      if (this.$route.params.bt || this.$route.params.et) {
        this.orderTimes = [this.$route.params.bt, this.$route.params.et]
      }
      this.getAddressListFunc()
      // console.log(1111)
    },
    created() {

    }
  }
</script>

<style lang="scss" scoped>
  .rate-item{
    span{
      display: inline-block;
      width: 70px;
      text-align: right;
    }
    .rate{
      display: inline-block !important;
    }
  }
  .goods-item{
    border-bottom: 1px solid #e4e4e4;
    margin-bottom: 5px;
    clear: both;
    &:last-child {
      border-bottom: none;
      margin-bottom: 0px;
    }
    .image{
      float: left !important;
      margin-right: 5px !important;
    }
    .g-info{
      text-align: left;
      margin: 0px;
      // padding-left: 110px;
      p{
        margin: 0px;
        padding: 3px 0px;
        span {
          color: #606266;
          margin: 0px;
        }
      }
    }
    .clear{
      clear: both;
    }
  }
  .ui{
    text-align: left;
    line-height: 25px;
    span{
      display: inline-block;
      padding-right: 5px;
      color: #8c939d;
    }
    a{
      color: #1E88E5;
    }
  }
  .el-select-dropdown__item{
    height: auto !important;
  }
  .address-item{
    border-bottom: 1px solid #eeeeee;
    p{
      margin: 0px;
      padding: 0px;
    }
  }
  .bold-text {
    color: black !important; 
    font-weight: bold
  }
  .label {
    font-size: 14px;
    font-weight: bold;
    text-align: left;
  }

</style>
