<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24">
            <el-tabs style="height: 40px" v-model="tab_status">
              <el-tab-pane style="height: 44px" v-for="(item, k) in orderStatus"  :key="k" v-if="item" :label="item" :name="k + ''"></el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span ="24">
            <el-form :inline="true" :model="searchForm">
              <el-form-item :label="$t('order.returnOrder')">
                <el-input v-model="searchForm.order_no" style="width: 250px" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('order.returnType')">
                <el-select v-model="searchForm.type" clearable>
                  <el-option
                    v-for="(item, k) in returnType"
                    :key="k"
                    :label="item"
                    :value="k">
                  </el-option>
                </el-select>
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
                <el-table-column :label="$t('order.user')" width="110">
                  <template slot-scope="scope">
                    <div class="ui">{{scope.row.user_nick_name}}</div>
                    <div class="ui">{{scope.row.user_mobile}}</div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.returnType')" width="120">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.type === 2 ? 'success': ''">{{returnType[scope.row.type]}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('order.returnGoods')" min-width="350px">
                  <template  slot-scope="scope">
                    <a class="goods-item" target="_blank" :href="goodsPreview(scope.row.goods_item)">
                      <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(scope.row.goods_item.sku_img,100,100)"  fit="cover"></el-image>
                      <div class="g-info">
                        <p><span>{{scope.row.goods_item.spu_name}}</span></p>
                        <p>
                          <span v-for="(v,k) in scope.row.goods_item.specifications"> {{k}}：<font>{{v}}</font></span>
                        </p>
                        <p>{{scope.row.goods_item.price | price}}X {{scope.row.goods_item.count}}</p>
                      </div>
                      <div class="clear"></div>
                    </a>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.returnPrice')" width="80">
                  <template slot-scope="scope">
                    {{scope.row.amount | price}}
                  </template>
                </el-table-column>
                <el-table-column prop="order_no" :label="$t('order.returnOrder')" width="180">
                </el-table-column>
                <el-table-column :label="$t('order.status')" width="100">
                  <template slot-scope="scope" >
                    <el-tag>{{orderStatus[scope.row.status]}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" :label="$t('order.returnTime')" width="180">
                  <template slot-scope="scope" >
                    <el-popover placement="left" width="300" trigger="click">
                      <el-timeline style="margin-top: 10px">
                        <el-timeline-item
                          v-for="(record, index) in scope.row.operations_records"
                          :key="index"
                          :timestamp="record.time">
                          <div class="ui"><span>{{record.operator_name}}</span>{{orderStatus[record.status]}}</div>
                        </el-timeline-item>
                      </el-timeline>
                      <a slot="reference" class="gt"><i class="el-icon-arrow-left"></i>{{scope.row.gen_time}}</a>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "80" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showReturnOrderDetail(scope.row)" size="small">{{$t('tools.detail')}}</el-button>
                  </template>
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
        <el-dialog :title="$t('order.returnTitle')" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px">
            <el-form-item :label="$t('order.no')">
              {{returnOrder.order_no}}
            </el-form-item>
            <el-form-item :label="$t('order.user')">
              {{returnOrder.user_nick_name}}/{{returnOrder.user_mobile}}
            </el-form-item>
            <el-form-item :label="$t('order.returnGoods')">
              <div class="goods-item" v-if="returnOrder.id">
                <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(returnOrder.goods_item.sku_img,100,100)"  fit="cover"></el-image>
                <div class="g-info">
                  <p><el-tag size="mini" :type="returnOrder.type === 2 ? 'success': ''">{{returnType[returnOrder.type]}}</el-tag>&nbsp;&nbsp;<span>{{returnOrder.goods_item.spu_name}}</span></p>
                  <p>
                    <span v-for="(v,k) in returnOrder.goods_item.specifications"> {{k}}：<font>{{v}}</font></span>
                  </p>
                  <p><span>{{$t('order.price3')}}：</span>{{returnOrder.goods_item.price | price}}；<span>{{$t('order.number')}}：</span>{{returnOrder.goods_item.count}}</p>
                </div>
                <div class="clear"></div>
              </div>
            </el-form-item>
            <el-form-item :label="$t('order.returnReason')">
              {{returnOrder.comment}}
            </el-form-item>
            <el-form-item v-if="returnOrder.type===1 || returnOrder.type===3 "  :label="$t('order.returnPrice')" >
              <price-input v-model="amount" clearable></price-input>
            </el-form-item>
            <el-form-item v-if="returnOrder.type===2 && returnOrder.shipping_address"  :label="$t('order.returnUserAddr')" >
              {{returnOrder.shipping_address.address.province + returnOrder.shipping_address.address.city + returnOrder.shipping_address.address.district}}&nbsp;{{returnOrder.shipping_address.address.addr}}
              <br/>
              {{returnOrder.shipping_address.contacter_name}}&nbsp;&nbsp;{{returnOrder.shipping_address.mobile}}
            </el-form-item>
            <el-form-item v-if="returnOrder.status === 1 && returnOrder.type !== 3" :label="$t('order.returnAddr')">
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
            </el-form-item>
            <el-form-item v-if="(returnOrder.status === 3 || returnOrder.status === 5 || returnOrder.status === 6) && returnOrder.type !== 3 && returnOrder.merchant_shipping_address" :label="$t('order.returnAddr')">
              {{returnOrder.merchant_shipping_address.address.province + returnOrder.merchant_shipping_address.address.city + returnOrder.merchant_shipping_address.address.district}}&nbsp;{{returnOrder.merchant_shipping_address.address.addr}}
              <br/>
              {{returnOrder.merchant_shipping_address.contacter_name}}&nbsp;&nbsp;{{returnOrder.merchant_shipping_address.mobile}}
            </el-form-item>
            <el-form-item v-if="returnOrder.status === 5 || returnOrder.status === 6" :label="$t('order.returnExpress')">
              <a target="_blank" :href="getKuaidi100Url(returnOrder.express2merchant.company, returnOrder.express2merchant.novar)">{{expressageList[returnOrder.express2merchant.company]}}&nbsp;&nbsp;{{returnOrder.express2merchant.novar}}<i class="el-icon-arrow-right"></i> </a>
            </el-form-item>
            <el-form-item :label="$t('order.returnExpress1')" v-if="returnOrder.status === 5 && returnOrder.type === 2">
              <a target="_blank" :href="getKuaidi100Url(returnOrder.express2user.company, returnOrder.express2user.novar)">{{expressageList[returnOrder.express2user.company]}}&nbsp;&nbsp;{{returnOrder.express2user.novar}}<i class="el-icon-arrow-right"></i> </a>
            </el-form-item>
            <el-form-item :label="$t('order.returnExpress1')" v-if="returnOrder.status === 6 && returnOrder.type === 2">
              <el-row :gutter="20">
                <el-col :span="8">
                  <express-selector v-model="expressCompany"></express-selector>
                </el-col>
                <el-col :span="14">
                  <el-input v-model="expressNo" clearable :placeholder="$t('order.expressNo')"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="permissionCheck('opt') && (returnOrder.status === 1 || returnOrder.status === 6)">
            <template v-if="returnOrder.status ===1">
              <confirm-button v-if="returnOrder.type === 3" @confirmButton="saveDataFunc(5)" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.agree')"></confirm-button>
              <confirm-button v-else @confirmButton="saveDataFunc(3)" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.agree')"></confirm-button>
              <confirm-button @confirmButton="saveDataFunc(4)" :confirmButtonInfor="$t('tools.refuse')"></confirm-button>
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
  import { orderAfterSales, orderAfterSalesOpt } from '@/api/order'
  import { shippingAddressesList } from '@/api/system'
  import expressage from '@/utils/expressage'
  export default {
    components: {
    },
    data() {
      const pz = 10
      return {
        returnType: [this.$t('tools.all'), this.$t('order.returnType1'), this.$t('order.returnType2'), this.$t('order.returnType3')],
        orderStatus: [this.$t('tools.all'), this.$t('order.returnStatus1'), this.$t('order.returnStatus2'), this.$t('order.returnStatus3'), this.$t('order.returnStatus4'), this.$t('order.returnStatus5'),
          this.$t('order.returnStatus6'), '', this.$t('order.returnStatus8')],
        searchForm: {
          type: 0,
          order_no: '',
          status: 0,
          skip: '',
          limit: pz
        },
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
        expressageList: expressage
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      tab_status(val) {
        this.searchForm.skip = 0
        this.searchForm.limit = this.pageSize
        this.searchForm.status = parseInt(val)
        this.getDataListFun()
      },
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      }
    },
    methods: {
      goodsPreview(row) {
        return 'https://www.a9kh.com/goods/' + row.spu_id + '.html'
        // this.currentGoods = appUrl + '/goods/info?id=' + row.id
        // this.commodityPreviewShow = true
      },
      showReturnOrderDetail(data) {
        this.returnOrder = data
        this.amount = data.amount
        this.addressId = (data.merchant_shipping_address && data.merchant_shipping_address.id) ? data.merchant_shipping_address.id : this.defaultAddr
        this.expressCompany = ''
        this.expressNo = ''
        this.formEditDialog = true
      },
      saveDataFunc(status) {
        this.submitDisabled = true
        orderAfterSalesOpt(this.returnOrder.id, { status: status, address_id: this.addressId, amount: this.amount, express_company: this.expressCompany, express_no: this.expressNo }).then(res => {
          this.$message.success(this.$t('order.returnTip'))
          this.submitDisabled = false
          this.getDataListFun()
          this.formEditDialog = false
        }).catch(() => {
          this.submitDisabled = false
        })
      },
      getDataListFun() {
        orderAfterSales(this.searchForm).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
        })
      },
      getAddressListFunc() {
        shippingAddressesList().then(res => {
          this.addressList = res.items
          const defaultAddr = this.addressList.find(addr => {
            return addr.default === true
          })
          this.defaultAddr = typeof (defaultAddr) !== 'undefined' ? defaultAddr.id : (this.addressList.length > 0 ? this.addressList[0].id : '')
        })
      },
      search() {
        this.getDataListFun()
      },
      getKuaidi100Url(com, nu) {
        return `https://www.kuaidi100.com/chaxun?com=${com}&nu=${nu}`
      }
    },
    mounted() {
      console.log(this.$route.params)
      this.searchForm.order_no = this.$route.params.order_no ? this.$route.params.order_no : ''
      this.getDataListFun()
      this.getAddressListFunc()
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
      padding-left: 110px;
      p{
        margin: 0px;
        padding: 3px 0px;
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

</style>
