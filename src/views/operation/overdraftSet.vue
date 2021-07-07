<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <!--添加-->
        <el-row class="topCss">
          <el-col :span="20">
            <el-form :inline="true" :model="searchForm">
              <el-form-item>
                <el-input v-model="searchForm.key" :placeholder="$t('operation.pleaseEnter')+$t('operation.keyWords')" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" align="right">
            <el-button type="primary" size="small" @click="addMobile">{{$t('tools.add')}}</el-button>
          </el-col>
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="24" style="height: calc(100vh - 235px)">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" height="calc(100% - 46px)" style="width: 100%">
              <el-table-column prop="login_name" label="用户信息">
                <template slot-scope="scope">
                  <div>{{$t('operation.loginName')}}：{{scope.row.login_name}}</div>
                  <div>
                    {{$t('operation.img')}}：
                    <el-popover v-if="scope.row.avatar" class="pointer"
                                   placement="right"
                                   title=""
                                   trigger="click">
                    <img :src="imgUrl + scope.row.avatar" height="480"/>
                    <img slot="reference" :src="imgUrl + scope.row.avatar" style="margin-right:8px;max-height: 60px;max-width: 120px">
                  </el-popover></div>
                  <div>{{$t('operation.nationCode')}}：{{scope.row.nation_code}}</div>
                  <div>{{$t('operation.email')}}：{{scope.row.mail}}</div>
                  <div>{{$t('operation.gender')}}：
                    <el-tag v-if="scope.row.sex === 0" type="danger">{{$t('operation.unknown')}}</el-tag>
                    <el-tag v-if="scope.row.sex === 1" type="success">{{$t('operation.male')}}</el-tag>
                    <el-tag v-if="scope.row.sex === 2" type="info">{{$t('operation.female')}}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('operation.zhouqi')">
                <template slot-scope="scope">
                  {{scope.row.overdraw.period}} {{$t('warehouse.day')}}
                </template>
              </el-table-column>
              <el-table-column :label="$t('operation.touzhiMoney')">
                <template slot-scope="scope">
                  {{scope.row.overdraw.max_money | price}}
                </template>
              </el-table-column>
              <el-table-column :label="$t('operation.usedAmount')">
                <template slot-scope="scope">
                  <el-button type="text" @click="clickUseMoney(scope.row)">{{scope.row.overdraw.use_money | price}}</el-button>
                </template>
              </el-table-column>
              <el-table-column :label="$t('operation.address')">
                <template slot-scope="scope">
                  {{scope.row.address.province}}{{scope.row.address.city}}{{scope.row.address.district}}{{scope.row.address.addr}}
                </template>
              </el-table-column>
              <el-table-column prop="gen_time" :label="$t('operation.registrationTime')" width="170"></el-table-column>
              <el-table-column :label="$t('tools.opt')" width="150" v-if="permissionCheck('opt')">
                <template slot-scope="scope">
                  <el-button type="text" @click="overdrawSet(scope.row)" size="small">{{$t('operation.overdrawSet')}}</el-button>
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
        <!--透支设置-->
        <el-dialog :title="$t('operation.overdrawSet')" :close-on-click-modal="false" :visible.sync="overdrawDialog" center width="500px" style="margin-top: 0vh">
          <el-form label-width="140px">
            <el-form-item :label="$t('global.mobile')">
              <el-input v-model="mobile" :disabled="mobileDisabled" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.whetherEnable')">
              <el-switch
                v-model="overdrawForm.on"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item :label="$t('operation.zhouqi')">
              <el-input v-model.number="overdrawForm.period" clearable>
                <template slot="append">{{$t('warehouse.day')}}</template>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.touzhiMoney')">
              <price-input v-model="overdrawForm.max_money"></price-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="submitOverdraw" :disabled="disabledOverdraw"></confirm-button>
            <el-button @click="overdrawDialog = false" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
        <!--订单-->
        <el-dialog :title="$t('finance.type2')" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="85%" center>
          <!--<v-pageSearch style="padding: 0px;">-->
            <!--<el-form :inline="true" :model="orderSearchForm" class="diglog">-->
              <!--<el-form-item :label="$t('order.no')">-->
                <!--<el-input v-model="orderSearchForm.no" style="width: 250px" clearable></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item :label="$t('order.status')">-->
                <!--<el-select v-model="orderSearchForm.order_status" :placeholder="$t('order.commentType')" clearable>-->
                  <!--<el-option-->
                    <!--v-for="(item, k) in orderStatus" v-if="item"-->
                    <!--:key="k"-->
                    <!--:label="item"-->
                    <!--:value="k">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->
              <!--<el-form-item :label="$t('order.orderTime')">-->
                <!--<el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable-->
                                <!--v-model="orderTimes"-->
                                <!--type="daterange"-->
                                <!--align="right"-->
                                <!--unlink-panels-->
                                <!--:range-separator="$t('tools.to')"-->
                                <!--:start-placeholder="$t('tools.startDate')"-->
                                <!--:end-placeholder="$t('tools.endDate')">-->
                <!--</el-date-picker>-->
              <!--</el-form-item>-->
              <!--<el-form-item>-->
                <!--<el-button type="primary" @click="getDataListFun" size="small" icon="el-icon-search"></el-button>-->
              <!--</el-form-item>-->
            <!--</el-form>-->
          <!--</v-pageSearch>-->
          <v-pageTable pagination paginationAlign="center" :pageSize="pageSizeOrder" :paginationTotal="itemCountOrder" :sizeChange="sizeChangeFuncOrder" :pageChange="pageChangeFuncOrder">
            <el-table height="500" ref="productTable" highlight-current-row v-loading="tableDataOrder.loading" :data="tableDataOrder.body" border style="width: 100%">
              <el-table-column label="#" width="60px" fixed="left">
                <template slot-scope="scope">
                  {{scope.$index + orderSearchForm.skip + 1}}
                </template>
              </el-table-column>
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
                  <div @click="jumpGoodsPage(gInfo.goods_info, scope.row.type)" class="goods-item" v-for="(gInfo,k) in scope.row.merchant_item.goods_items" :key="k">
                    <img class="image imagecss" :src="getImageUrl(gInfo.goods_info.sku_img, 100)">
                    <div class="g-info">
                      <p style="display: flex;align-items: center">{{gInfo.goods_info.spu_name}}
                        <img :src="otherLogo(gInfo.goods_info.site_id)" class="otherShopLogo" v-if="scope.row.type === 5 && gInfo.goods_info.site_id" alt="">
                        <el-tag v-if="gInfo.goods_info.gift" size="mini">{{$t('order.gift')}}</el-tag>
                        <el-tag v-if="gInfo.after_saled" style="cursor: pointer" type="danger" size="mini" @click.stop="showReturn(scope.row, gInfo)">{{$t('order.afterSale')}}</el-tag>
                      </p>
                      <p>
                        <span v-for="(v,k) in gInfo.goods_info.specifications" :key="k"> {{k}}：<font>{{v}}</font></span>
                      </p>
                      <p><span>{{$t('order.price3')}}：</span><template v-if="scope.row.type === 3">{{gInfo.goods_info.price}}</template><template v-else>{{gInfo.goods_info.price | price}}</template>；<span>{{$t('order.number')}}：</span>{{gInfo.goods_info.count}}</p>
                    </div>
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
          </v-pageTable>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.close')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { usersList, overdrawSet } from '@/api/operation'
  import { imgGetUrl } from '@/utils/serverConfig'
  import { ordersList } from '@/api/order'
  import expressage from '@/utils/expressage'
  export default {
    data() {
      return {
        searchForm: {
          skip: 0,
          limit: 10,
          key: '',
          overdraw: 1 // 0所有 1 透支用户
        },
        userTime: [],
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        imgUrl: imgGetUrl + '?md5=',
        tableData: {
          loading: true,
          body: []
        },
        overdrawForm: {
          on: false,
          period: 0, // 周期 单位天
          max_money: 0 // 最大透支金额 单位分
        },
        overdrawDialog: false,
        disabledOverdraw: false,
        overdrawId: '',
        mobile: '',
        mobileDisabled: false,
        type: '',
        orderSearchForm: {
          key: '',
          user_id: '',
          order_status: 0,
          no: '',
          skip: 0,
          limit: 10,
          bt: '',
          et: '',
          ownership_status: '',
          pay_way: 0, // 支付方式  0 所有 1 在线支付 2 货到付款 3 透支
          invoice: true,
          type: 0 // 0 所有 5代购
        },
        dialogFormVisible: false,
        pageSizeOrder: 10,
        itemCountOrder: 0,
        currentPageOrder: 1,
        tableDataOrder: {
          loading: true,
          body: []
        },
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
        servicerOptArr: { 1: this.$t('order.servicerOpt1'), 2: this.$t('order.servicerOpt2'), 3: this.$t('order.cancelClaim') },
        optArr: { 2: this.$t('order.opt2'), 4: this.$t('order.opt4'), 5: this.$t('order.opt5'), 6: this.$t('order.opt6'), 7: this.$t('order.opt7'), 8: this.$t('order.opt8'), 9: this.$t('order.opt9') },
        expressageList: expressage,
        payMethod: [this.$t('order.onlinePay'), this.$t('order.cashOnDelivery'), this.$t('order.overdraft')],
        orderStatus: [this.$t('tools.all'), this.$t('order.status1'), this.$t('order.status2'), this.$t('order.status3'), this.$t('order.status4'), this.$t('order.status5'),
          this.$t('order.status6'), this.$t('order.status7'), this.$t('order.status8'), '', this.$t('order.status10')],
        deliveryMethod: [this.$t('order.expressDelivery'), this.$t('order.selfMention'), this.$t('order.rider')],
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
      },
      currentPageOrder(val) {
        this.orderSearchForm.skip = (val - 1) * this.pageSizeOrder
        this.orderSearchForm.limit = this.pageSizeOrder
        this.getDataListFun()
      }
    },
    methods: {
      clickUseMoney(data) {
        if (data.overdraw.use_money > 0) {
          this.dialogFormVisible = true
          this.orderSearchForm.user_id = data.id
          this.orderSearchForm.bt = data.overdraw.start_time_str
          this.orderSearchForm.et = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          this.getDataListFun()
        }
      },
      getDataListFun() {
        ordersList(this.orderSearchForm).then(res => {
          this.tableDataOrder.body = res.items
          this.tableDataOrder.loading = false
          this.itemCountOrder = res.total
        })
      },
      sizeChangeFuncOrder(val) {
        this.pageSizeOrder = val
      },
      pageChangeFuncOrder(val) {
        this.currentPageOrder = val
      },
      jumpGoodsPage(data, type) {
        if (type !== undefined) {
          // console.log(data);
          if (type === 5) { // 代购订单
            // console.log('data.sku_url', data.sku_url)
            if (data.sku_url === '') {
              window.open('https://www.a9kh.com/goods/' + data.spu_id + '.html')
            } else {
              window.open(data.sku_url)
            }
          } else {
            window.open('https://www.a9kh.com/goods/' + data.spu_id + '.html')
          }
        } else {
          if (data.sku_url !== '') {
            window.open(data.sku_url)
          } else {
            window.open('https://www.a9kh.com/goods/' + data.spu_id + '.html')
          }
        }
      },
      // 海外购图标显示
      otherLogo(text) {
        // console.log(text);
        if (text === 'JinDong') {
          return require('../../assets/images/jingdong.png')
        } else if (text === 'Tmal') {
          return require('../../assets/images/tianmao.png')
        } else if (text === 'Taobao') {
          return require('../../assets/images/taobao.png')
        } else if (text === 'Suning') {
          return require('../../assets/images/suning.jpeg')
        } else if (text === 'Kaola') {
          return require('../../assets/images/kaola.jpeg')
        } else if (text === 'Dangdang') {
          return require('../../assets/images/dangdang.jpeg')
        } else if (text === 'Amazon') {
          return require('../../assets/images/yamaxun.png')
        } else if(text === '1688'){
          return require('../../assets/images/1688.png')
        } else if(text === '1689'){
          return require('../../assets/images/1689.png')
        }
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
      addMobile() {
        this.overdrawDialog = true
        this.overdrawForm.on = false
        this.overdrawForm.period = 0
        this.overdrawForm.max_money = 0
        this.mobile = ''
        this.mobileDisabled = false
        this.type = 'add'
      },
      overdrawSet(data) {
        this.overdrawDialog = true
        this.overdrawId = data.id
        this.overdrawForm = JSON.parse(JSON.stringify(data.overdraw))
        this.mobile = data.login_name
        this.mobileDisabled = true
        this.type = 'edit'
      },
      submitOverdraw() {
        this.disabledOverdraw = true
        let id = ''
        if (this.type === 'add') {
          id = this.mobile
        } else if (this.type === 'edit') {
          id = this.overdrawId
        }
        overdrawSet(id, this.overdrawForm).then(res => {
          if (res.meta === 0) {
            this.disabledOverdraw = false
            this.overdrawDialog = false
            this.$message.success(this.$t('operation.setSuccess'))
            this.getTableData()
          }
        }).catch(() => {
          this.disabledOverdraw = false
        })
      },
      sizeChangeFunc(val) {
        this.pageSize = val
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      getTableData() {
        usersList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      search() {
        this.currentPage = 1
        this.searchForm.skip = 0
        this.getTableData()
      },
      getKuaidi100Url(com, nu) {
        return `https://www.kuaidi100.com/chaxun?com=${com}&nu=${nu}`
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .topCss{
    width: 100%;
    display: flex;
    /*justify-content: space-between;*/
  }
  .goods-item{
    border-bottom: 1px solid #e4e4e4;
    margin-bottom: 5px;
    cursor: pointer;
    clear: both;
    display: flex;
    align-items: center;
    // justify-content: space-between;
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
      padding-left: 10px!important;
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
    .kuchunBox {
      font-size: 20px;
    }
  }
  .imagecss{
    width: 100px !important;
    object-fit: cover;
  }
  .otherShopLogo {
    width: 24px;
    height: 24px;
    margin-left: 8px;
    border: none;
  }
</style>
