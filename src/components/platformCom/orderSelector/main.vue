<template>
    <div>
        <el-input readonly :placeholder="$t('warehouse.TipsMsg2')" clearable v-model="orderInfo.no" @clear="clearInput">
            <el-button slot="append" icon="el-icon-edit-outline" @click="showGoodsTable"></el-button>
        </el-input>
        <el-dialog :title="$t('operation.orderList')" width="80%" :visible.sync="dialogFormVisible" center append-to-body>
            <v-pageSearch style="padding: 0px;">
              <el-form :inline="true" :model="searchForm">
                <el-form-item :label="$t('order.searchKey')">
                  <el-input v-model="searchForm.key" :placeholder="$t('order.searchKeyTip')" style="width: 250px" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('order.no')">
                  <el-input v-model="searchForm.no" style="width: 250px" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
                </el-form-item>
              </el-form>
            </v-pageSearch>
          <el-row>
            <el-col :span="24">
              <el-table stripe border :data="tableData" :row-key="productRowKey" highlight-current-row height="calc(100vh - 390px)" @current-change="selectionChange">
                <!-- 单号 -->
                <el-table-column :label="$t('order.no')" width="200px" fixed="left">
                  <template slot-scope="scope">
                    <el-tag style="display: block; width: 50px; margin: 0 auto" v-if="scope.row.type===2" size="mini">{{$t('order.orderType2')}}</el-tag>
                    <el-tag style="display: block; width: 60px; margin: 0 auto" v-if="scope.row.type===3" size="mini">{{$t('order.orderType3')}}</el-tag>
                    <el-tag style="display: block; width: 60px; margin: 0 auto" v-if="scope.row.type===4" size="mini">{{$t('order.orderType4')}}</el-tag>
                    No:{{scope.row.no}}<br/>
                    <span class="f12" v-if="scope.row.pay_id">Id:{{scope.row.pay_id}}</span><br/>
                    <el-popover v-if="scope.row.comment || (scope.row.merchant_comments && scope.row.merchant_comments.length > 0)" placement="right" width="300" trigger="click">
                      <template v-if="scope.row.comment">
                        <el-divider content-position="left">{{$t('order.userBz')}}</el-divider>
                        <div style="padding: 0px 10px; text-align: left">
                          {{scope.row.comment}}
                        </div>
                      </template>
                      <template v-if="scope.row.merchant_comments && scope.row.merchant_comments.length > 0">
                        <el-divider content-position="left">{{$t('order.businessBz')}}</el-divider>
                        <el-timeline style="margin-top: 10px">
                          <el-timeline-item
                            v-for="(comments, index) in scope.row.merchant_comments"
                            :key="index"
                            :timestamp="comments.gen_time">
                            <div class="ui"><span>{{comments.operator_name}}</span>{{comments.comment}}</div>
                          </el-timeline-item>
                        </el-timeline>
                      </template>
                      <a slot="reference" class="gt">{{$t('order.note')}}<i class="el-icon-arrow-right"></i></a>
                    </el-popover>
                  </template>
                </el-table-column>
                <!-- 下单时间 -->
                <el-table-column :label="$t('order.genTime')" width="170">
                  <template slot-scope="scope" >
                    <el-popover placement="left" width="300" trigger="click">
                      <el-timeline style="margin-top: 10px">
                        <el-timeline-item
                          v-for="(record, index) in scope.row.operation_records"
                          :key="index"
                          :timestamp="record.time">
                          <div class="ui"><span>{{record.operator_name}}</span>{{optArr[record.status]}}</div>
                        </el-timeline-item>
                      </el-timeline>
                      <a slot="reference" class="gt"><i class="el-icon-arrow-left"></i>{{scope.row.gen_time}}</a>
                    </el-popover>
                  </template>
                </el-table-column>
                <!-- 用户 -->
                <el-table-column :label="$t('order.user')" width="130">
                  <template slot-scope="scope">
                    <div class="ui">{{scope.row.user_nick_name}}</div>
                    <div class="ui">{{scope.row.user_mobile}}</div>
                  </template>
                </el-table-column>
                <!-- 商品 -->
                <el-table-column  :label="$t('order.goods')" min-width="400">
                  <template  slot-scope="scope">
                    <div class="goods-item" v-for="(gInfo,k) in scope.row.merchant_item.goods_items" :key="k">
                      <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(gInfo.goods_info.sku_img, 100)"  fit="cover"></el-image>
                      <div class="g-info">
                        <p style="display: flex;align-items: center">{{gInfo.goods_info.spu_name}}
                          <img :src="otherLogo(gInfo.goods_info.site_id)" class="otherShopLogo" v-if="scope.row.type === 5 && gInfo.goods_info.site_id" alt="">
                          <el-tag v-if="gInfo.goods_info.gift" size="mini">{{$t('order.gift')}}</el-tag>
                          <el-tag v-if="gInfo.after_saled" style="cursor: pointer" type="danger" size="mini">{{$t('order.afterSale')}}</el-tag>
                        </p>
                        <p>
                          <span v-for="(v,k) in gInfo.goods_info.specifications"> {{k}}：<font>{{v}}</font></span>
                        </p>
                        <p><span>{{$t('order.price3')}}：</span><template v-if="scope.row.type === 3">{{gInfo.goods_info.price}}</template><template v-else>{{gInfo.goods_info.price | price}}</template>；<span>{{$t('order.number')}}：</span>{{gInfo.goods_info.count}}</p>
                      </div>
                      <div class="clear"></div>
                    </div>
                  </template>
                </el-table-column>
                <!-- 金额 -->
                <el-table-column :label="$t('order.price')" width="130">
                  <template slot-scope="scope" >
                    <span :title="$t('order.price1') + '+' + $t('order.price2')"><template v-if="scope.row.pay_points > 0"> *{{scope.row.pay_points}}+</template> {{scope.row.pay_price | price}}</span><span v-if="scope.row.pay_way">({{payWay(scope.row.pay_way)}})</span><br/>
                    <span>({{$t('order.includePostage')}}：{{scope.row.postage | price}})</span>
                    <div class="ui">
                      <span>{{$t('order.payMethod')}}：</span>
                      {{payMethod[scope.row.pay_way_top - 1]}}
                    </div>
                  </template>
                </el-table-column>
                <!-- 地址 -->
                <el-table-column :label="$t('order.address')" style="text-align: left" min-width="300">
                  <template slot-scope="scope" >
                    <div class="ui">
                      <span>{{$t('order.expressAddr')}}：</span>
                      {{scope.row.shipping_address.address.province + scope.row.shipping_address.address.city + scope.row.shipping_address.address.district}}
                      {{scope.row.shipping_address.address.addr}}
                    </div>
                    <div class="ui">
                      <span>{{$t('order.expressUser')}}：</span>
                      {{scope.row.shipping_address.contacter_name}}&nbsp;&nbsp;
                      {{scope.row.shipping_address.mobile}}
                    </div>
                    <div class="ui">
                      <span>{{$t('order.deliveryMethod')}}：</span>
                      {{deliveryMethod[scope.row.post_way - 1]}} <span v-if="scope.row.post_way === 2">({{scope.row.check_code}})</span>
                    </div>
                    <div class="ui" v-if="scope.row.express.novar">
                      <span>{{$t('order.expressNo')}}：</span>
                      <el-popover placement="left" width="300" trigger="click" v-if="scope.row.express.company === 'zto' || scope.row.express.company === 'rider'">
                        <div v-if="expressInfo && !showOrderStatus">
                          <el-timeline style="margin-top: 10px" v-if="expressInfo.length > 0">
                            <el-timeline-item
                              v-for="(record, index) in expressInfo"
                              :key="index"
                              :timestamp="record.time">
                              <div class="ui"><span>{{record.message}}</span></div>
                            </el-timeline-item>
                          </el-timeline>
                          <p v-else style="color: #333; font-size: 14px; text-align: center; font-weight: bold">{{$t('order.zwddwl')}}</p>
                        </div>
                        <div v-if="showOrderStatus">
                          <el-timeline style="margin-top: 10px">
                            <el-timeline-item
                              v-for="(record, index) in scope.row.operation_records"
                              :key="index"
                              :timestamp="record.time">
                              <div class="ui"><span>{{record.operator_name}}</span>{{optArr[record.status]}}</div>
                            </el-timeline-item>
                          </el-timeline>
                        </div>
                        <a @click="clickStatus(scope.row)" slot="reference">
                          {{expressageList[scope.row.express.company]}}&nbsp;&nbsp;{{scope.row.express.novar}}
                          <i class="el-icon-arrow-right"></i>
                        </a>
                      </el-popover>
                      <a v-else target="_blank" :href="getKuaidi100Url(scope.row.express.company, scope.row.express.novar)">
                        {{expressageList[scope.row.express.company]}}&nbsp;&nbsp;{{scope.row.express.novar}}
                        <i class="el-icon-arrow-right"></i>
                      </a>
                    </div>
                  </template>
                </el-table-column>
                <!-- 状态 -->
                <el-table-column :label="$t('order.status')" width="90">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status !== 17">{{orderStatus[scope.row.status]}} </el-tag>
                    <el-tag v-else>{{$t('order.purchasPendReview')}}</el-tag>
                    <span style="font-size: 12px" v-if="(scope.row.status === 4 || scope.row.status === 5) && scope.row.pay_way_top === 2">({{$t('order.cashOnDelivery')}})</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="margin-top: 10px">
                <el-col :span="24" style="text-align: right;">
                  <el-pagination v-if="itemCount > 0"
                                 :current-page.sync="currentPage"
                                 :page-size.sync="pageSize"
                                 :page-sizes="[10, 30, 50, 100, 500]"
                                 layout="total, prev, pager, next, jumper,sizes"
                                 :total="itemCount">
                  </el-pagination>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false" size="mini">{{$t('tools.cancel')}}</el-button>
                <el-button type="primary" size="mini" @click="submitSelect">{{$t('tools.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import { ordersList } from '@/api/order'
  export default {
    name: 'orderSelector',
    data() {
      return {
        orderInfo: { no: '' },
        dialogFormVisible: false,
        productTableData: {
          loading: true,
          body: []
        },
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        selectedProduct: {},
        tableData: [],
        searchForm: {
          key: '',
          user_id: '',
          order_status: 0,
          no: '',
          skip: 0,
          limit: 10,
          bt: '',
          et: '',
          invoice: true
        },
        optArr: { 2: this.$t('order.opt2'), 4: this.$t('order.opt4'), 5: this.$t('order.opt5'), 6: this.$t('order.opt6'), 7: this.$t('order.opt7'), 8: this.$t('order.opt8'), 9: this.$t('order.opt9') },
        orderStatus: [this.$t('tools.all'), this.$t('order.status1'), this.$t('order.status2'), this.$t('order.status3'), this.$t('order.status4'), this.$t('order.status5'),
          this.$t('order.status6'), this.$t('order.status7'), this.$t('order.status8'), '', this.$t('order.status10')],
        orderStatusTab: [{ value: '0', label: this.$t('tools.all') }, { value: '17', label: this.$t('order.status1') }, { value: '2', label: this.$t('order.status2') }, { value: '5', label: this.$t('order.status5') }, { value: '4', label: this.$t('order.status4') }, { value: '8', label: this.$t('order.status8') },
          { value: '10', label: this.$t('order.status10') }, { value: '7', label: this.$t('order.status7') }],
        orderStatusTabList: [{ value: '0', label: this.$t('tools.all') }, { value: '17', label: this.$t('order.status1') }, { value: '2', label: this.$t('order.status2') }, { value: '5', label: this.$t('order.status5') }, { value: '4', label: this.$t('order.status4') }, { value: '8', label: this.$t('order.status8') },
          { value: '10', label: this.$t('order.status10') }, { value: '7', label: this.$t('order.status7') }],
        deliveryMethod: [this.$t('order.expressDelivery'), this.$t('order.selfMention'), this.$t('order.rider')],
        payMethod: [this.$t('order.onlinePay'), this.$t('order.cashOnDelivery')],
        listV: [
          {
            value: 'mpay_ali',
            label: this.$t('lang.alipay')
          },
          {
            value: 'mpay_wx',
            label: this.$t('lang.weChat')
          },
          {
            value: '1',
            label: 'Credit Card'
          },
          {
            value: '15',
            label: 'UnionPay'
          },
          {
            value: '3',
            label: 'Acleda Xpay'
          },
          {
            value: '235',
            label: 'Wing'
          },
          {
            value: '11',
            label: 'PiPay'
          },
          {
            value: 'yue',
            label: this.$t('lang.balance')
          }
        ],
        cesiId: ''
      }
    },
    model: {
      prop: 'goodId',
      event: 'goodSelectedChange'
    },
    props: {
      goodId: {
        type: String,
        default: function() {
          return ''
        }
      }
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      },
      pageSize(val) {
        if (this.currentPage !== 1) {
          this.currentPage = 1
        } else {
          this.searchForm.limit = val
          this.getDataListFun()
        }
      },
      goodId(val) {
        if (val === '') {
          this.orderInfo.no = ''
        }
      }
    },
    mounted() {
      this.getDataListFun()
      // this.getProductInfo()
    },
    methods: {
      clearInput() {
        this.$emit('goodSelectedChange', this.cesiId)
      },
      payWay(data) {
        let str = ''
        this.listV.forEach(v => {
          if (v.value === data) {
            str = v.label
          }
        })
        return str
      },
      // 海外购图标显示
      otherLogo(text) {
        // console.log(text);
        if (text === 'JinDong') {
          return require('../../../assets/images/jingdong.png')
        } else if (text === 'Tmal') {
          return require('../../../assets/images/tianmao.png')
        } else if (text === 'Taobao') {
          return require('../../../assets/images/taobao.png')
        } else if (text === 'Suning') {
          return require('../../../assets/images/suning.jpeg')
        } else if (text === 'Kaola') {
          return require('../../../assets/images/kaola.jpeg')
        } else if (text === 'Dangdang') {
          return require('../../../assets/images/dangdang.jpeg')
        } else if (text === 'Amazon') {
          return require('../../../assets/images/yamaxun.png')
        } else if (text === '1688') {
          return require('../../../assets/images/1688.png')
        } else if (text === '1689') {
          return require('../../../assets/images/1689.png')
        }
      },
      submitSelect() {
        if (this.selectedProduct.id === undefined) {
          this.$message.error('请选择订单')
          return
        }
        this.orderInfo = JSON.parse(JSON.stringify(this.selectedProduct))
        this.$emit('goodSelectedChange', this.orderInfo.id)
        this.$emit('goodSelectedInfo', this.orderInfo)
        this.dialogFormVisible = false
      },
      productRowKey(val) {
        return val.id
      },
      showGoodsTable() {
        this.dialogFormVisible = true
        if (this.$refs.productTable !== undefined) {
          this.$refs.productTable.clearSelection()
        }
      },
      // 新增商品路由跳转
      addNewGoods() {
        this.dialogFormVisible = false
        setTimeout(() => {
          this.$router.push({ path: `/goods/edit/0` })
        }, 0)
      },
      // 获取商品详情
      // getProductInfo() {
      //   if (this.goodId.length !== 24) {
      //     this.orderInfo = { no: '' }
      //   } else {
      //     goodsInfo(this.goodId).then(res => {
      //       if (res.meta === 0) {
      //         this.orderInfo = res.item
      //       } else {
      //         this.$message.error(res.error)
      //       }
      //     })
      //   }
      // },
      // 获取商品数据
      getDataListFun() {
        ordersList(this.searchForm).then(res => {
          this.allprice = res.total_money
          this.tableData = res.items
          this.itemCount = res.total
        })
      },
      search() {
        this.searchForm.skip = 0
        this.currentPage = 1
        this.getDataListFun()
      },
      selectionChange(val) {
        // console.log('val', val)
        this.selectedProduct = val
      }
    }
}

</script>

<style lang="scss" scoped>
  .addButton {
    position: absolute;
    top: 56%;
    left: 46%;
  }
  .f12{
    font-size: 12px;
  }
  .allprice{
    border-radius: 3px;
    padding: 5px;
    border: 1px solid #dcdfe6;
    display: inline-block;
    color: #606266;
    font-size: 14px;
    >span{
      font-size: 18px;
    }
  }
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
    cursor: pointer;
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
        span{
          color: #8c939d;
          font{
            color: #606266;
          }
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
  .gt{
    color: #1E88E5;
  }
  .addressChooseBox {
    /deep/
    .el-cascader {
      width: 100%;
    }
  }
  .otherShopLogo {
    width: 24px;
    height: 24px;
    margin-left: 8px;
    border: none;
  }
  .chooseCheck {
    float: left;
    margin-right: 10px;
    height: 100px;
    line-height: 100px;
  }
</style>
