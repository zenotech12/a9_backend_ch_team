<template>
  <div class="dashboard-container">
    <el-row>
      <el-card shadow="always">
        <div class="star-info cp" @click="gotoUrl('/order/evaluate')">
          <span class="title">{{shopInfo.name}}</span>
          <div class="rate-item"><span>{{$t('order.star')}}</span><el-rate class="rate" :value="shopInfo.star_score" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
          <div class="rate-item"><span>{{$t('order.star1')}}</span><el-rate class="rate" :value="shopInfo.description_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
          <div class="rate-item"><span>{{$t('order.star2')}}</span><el-rate class="rate" :value="shopInfo.service_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
          <div class="rate-item"><span>{{$t('order.star3')}}</span><el-rate class="rate" :value="shopInfo.express_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
        </div>
      </el-card>
    </el-row>
    <!--待办事项-->
    <el-row class="newStyleBox">
      <el-col :span="24" class="new_style_title">
          {{$t('order.Pending')}}
      </el-col>
      <el-col :span="24">
        <el-row>
          <el-col :span="6" v-if="permissionCheck('view', '3_1')">
            <el-card shadow="always" class="stat-item">
              <div slot="header" class="clearfix">
                <span>{{$t('order.order')}}</span>
              </div>
              <div class="sp cp">
                <p @click="gotoUrl('orderList', { ownership_status: 2})">{{$t('order.Tobeclaimed')}}<span>{{statInfo.order_need_claim}}</span></p>
                <p @click="gotoUrl('orderList', { order_status: 5})">{{$t('order.tobedelivered')}}<span>{{statInfo.need_ship}}</span></p>
                <p>&nbsp;</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" v-if="permissionCheck('view', '3_2') || permissionCheck('view', '3_4')">
            <el-card shadow="always" class="stat-item">
              <div slot="header" class="clearfix">
                <span>{{$t('warehouse.Returnexchange')}}</span>
              </div>
              <div class="sp cp">
                <p @click="gotoUrl('/order/orderReturn')">{{$t('order.Returnpending')}}<span>{{statInfo.refund}}</span></p>
                <p @click="gotoUrl('/order/orderExchange')">{{$t('order.Replacement')}}<span>{{statInfo.exchange_need_approve}}</span></p>
                <p @click="gotoUrl('/order/orderExchange')">{{$t('order.Replacement2')}}<span>{{statInfo.exchange_need_ship}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" v-if="permissionCheck('view', '8_1')">
            <el-card shadow="always" class="stat-item">
              <div slot="header" class="clearfix">
                <span>{{$t('warehouse.ware')}}</span>
              </div>
              <div class="sp cp">
                <p @click="gotoUrl('orderList', { order_status: 5})">{{$t('order.tobedelivered')}}<span>{{statInfo.need_ship}}</span></p>
                <p @click="gotoUrl('purchases', { status: 3})">{{$t('order.Tobestored')}}<span>{{statInfo.purchase_need_warehouse}}</span></p>
                <p>&nbsp;</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" v-if="permissionCheck('view', '8_3')">
            <el-card shadow="always">
              <div slot="header" class="clearfix">
                <span>{{$t('order.purchase2')}}</span>
              </div>
              <div class="sp cp" >
                <p @click="gotoUrl('totalinventory', { zero_inventory: true})">{{$t('order.Tobepurchased')}}<span>{{statInfo.need_purchase}}</span></p>
                <p @click="gotoUrl('purchases', { status: 1})">{{$t('order.Pendingapproval')}}<span>{{statInfo.purchase_finance_approve}}</span></p>
                <p @click="gotoUrl('purchases', { status: 2})">{{$t('order.Tobeleadership')}}<span>{{statInfo.purchase_leader_approve}}</span></p>
              </div>
            </el-card>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
    <!--概况统计-->
    <el-row class="newStyleBox">
      <el-col :span="24" class="new_style_title">
        {{$t('order.Overviewstatistics')}}
      </el-col>
      <el-col :span="24" class="timeBoxRow">
        {{$t('order.time')}}：
        <el-radio-group v-model="timeValue" size="medium" style="margin-right: 5px">
          <el-radio-button :label="1">{{$t('order.today')}}</el-radio-button>
          <el-radio-button :label="2">{{$t('order.Thisweek')}}</el-radio-button>
          <el-radio-button :label="3">{{$t('order.thismonth')}}</el-radio-button>
          <el-radio-button :label="4">{{$t('order.customize')}}</el-radio-button>
        </el-radio-group>
        <el-date-picker v-if="timeValue === 4" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getDataInfo"
                        v-model="dataTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        :range-separator="$t('tools.to')"
                        :start-placeholder="$t('tools.startDate')"
                        :end-placeholder="$t('tools.endDate')">
        </el-date-picker>
      </el-col>
      <el-col :span="24">
        <el-row>
          <el-col :span="6">
            <el-card shadow="always" class="stat-item">
              <div class="sp cp">
                <p>{{$t('order.orderNumber')}}：<span>{{dataInfo.order_count}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always" class="stat-item">
              <div class="sp cp" @click="gotoUrl('orderList', { order_status: 2})">
                <p>{{$t('lang.orderStat1')}}：<span>{{dataInfo.need_pay}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always" class="stat-item">
              <div class="sp cp">
                <p>{{$t('order.orderamount')}}：<span>{{dataInfo.sales | price}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              <div class="sp cp">
                <p>{{$t('order.visitorsNumber')}}：<span>{{dataInfo.visit}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always" class="stat-item liuliang">
              <div class="sp cp">
                <p>{{$t('order.pageviews')}}：<span>{{dataInfo.traffic}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always"  class="stat-item liuliang">
              <div class="sp cp">
                <p>{{$t('order.customerPrice')}}：<span>{{dataInfo.per_order_money | price}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always" class="stat-item liuliang">
              <div class="sp cp" @click="gotoUrl('/order/orderReturn')">
                <p>{{$t('order.Return')}}：<span>{{dataInfo.refund}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always" class="liuliang">
              <div class="sp cp" @click="gotoUrl('/order/orderExchange')">
                <p>{{$t('order.Exchange')}}：<span>{{dataInfo.exchange_count}}</span></p>
              </div>
            </el-card>
          </el-col>
        </el-row>

      </el-col>
    </el-row>

    <!--排行榜-->
    <el-row class="newStyleBox" v-if="shopInfo.user_info.owner">
      <el-col :span="24" class="new_style_title">
        {{$t('order.Leaderboard')}}
      </el-col>
      <el-col :span="24">
        <el-row :gutter="20">
          <el-col :span="8">
            <div>
              <div style="margin-bottom: 10px;">{{$t('order.pageviewRanking')}}</div>
              <el-row>
                <el-col :span ="24">
                  <el-form :inline="true" :model="searchForm">
                    <el-form-item>
                      <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListData"
                                      v-model="listTime"
                                      type="datetimerange"
                                      align="right"
                                      unlink-panels
                                      :range-separator="$t('tools.to')"
                                      :start-placeholder="$t('tools.startDate')"
                                      :end-placeholder="$t('tools.endDate')">
                      </el-date-picker>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-table stripe border :data="tableData" height="400">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column :label="$t('order.goods')">
                  <template slot-scope="scope">
                    <div>
                      <a :href="'https://www.a9kh.com/goods/' + scope.row.id + '.html'" target="_blank" class="styleImgShow">
                        <img :src="imgUrl + scope.row.images[0]" height="80" alt="">
                        <div style="margin-left: 20px">
                          {{scope.row.name}}
                        </div>
                      </a>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.pageviews')">
                  <template slot-scope="scope">
                    <span>{{scope.row.statistic_val}}</span>
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
          <el-col :span="8">
            <div>
              <div style="margin-bottom: 10px;">{{$t('order.visitorsRanking')}}</div>
              <el-row>
                <el-col :span ="24">
                  <el-form :inline="true" :model="searchVisit">
                    <el-form-item>
                      <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListDataVisit"
                                      v-model="visitTime"
                                      type="datetimerange"
                                      align="right"
                                      unlink-panels
                                      :range-separator="$t('tools.to')"
                                      :start-placeholder="$t('tools.startDate')"
                                      :end-placeholder="$t('tools.endDate')">
                      </el-date-picker>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-table stripe border :data="listVisit" height="400">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column :label="$t('order.goods')">
                  <template slot-scope="scope">
                    <div>
                      <a :href="'https://www.a9kh.com/goods/' + scope.row.id + '.html'" target="_blank" class="styleImgShow">
                        <img :src="imgUrl + scope.row.images[0]" height="80" alt="">
                        <div style="margin-left: 20px">
                          {{scope.row.name}}
                        </div>
                      </a>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.visitorsNumber')">
                  <template slot-scope="scope">
                    <span>{{scope.row.statistic_val}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPageVisit"
                  :page-size="pageSizeVisit"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCountVisit">
                </el-pagination>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="listPaidStyle">
              <div style="margin-bottom: 10px;">{{$t('order.paymentRanking')}}</div>
              <el-row>
                <el-col :span ="24">
                  <el-form :inline="true" :model="searchPaid">
                    <el-form-item>
                      <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListDataPaid"
                                      v-model="paidTime"
                                      type="datetimerange"
                                      align="right"
                                      unlink-panels
                                      :range-separator="$t('tools.to')"
                                      :start-placeholder="$t('tools.startDate')"
                                      :end-placeholder="$t('tools.endDate')">
                      </el-date-picker>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-table stripe border :data="listPaid" height="400">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column :label="$t('order.goods')">
                  <template slot-scope="scope">
                    <div>
                      <a :href="'https://www.a9kh.com/goods/' + scope.row.id + '.html'" target="_blank" class="styleImgShow">
                        <img :src="imgUrl + scope.row.images[0]" height="80" alt="">
                        <div style="margin-left: 20px">
                          {{scope.row.name}}
                        </div>
                      </a>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.paymentAmount')">
                  <template slot-scope="scope">
                    <span>{{scope.row.statistic_val | price}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPagePaid"
                  :page-size="pageSizePaid"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCountPaid">
                </el-pagination>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="listPaidStyle">
              <div style="margin-bottom: 10px;">{{$t('order.addShopRanking')}}</div>
              <el-row>
                <el-col :span ="24">
                  <el-form :inline="true" :model="searchAddCart">
                    <el-form-item>
                      <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListDataAddCart"
                                      v-model="addCartTime"
                                      type="datetimerange"
                                      align="right"
                                      unlink-panels
                                      :range-separator="$t('tools.to')"
                                      :start-placeholder="$t('tools.startDate')"
                                      :end-placeholder="$t('tools.endDate')">
                      </el-date-picker>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-table stripe border :data="listAddCart" height="400">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column :label="$t('order.goods')">
                  <template slot-scope="scope">
                    <div>
                      <a :href="'https://www.a9kh.com/goods/' + scope.row.id + '.html'" target="_blank" class="styleImgShow">
                        <img :src="imgUrl + scope.row.images[0]" height="80" alt="">
                        <div style="margin-left: 20px">
                          {{scope.row.name}}
                        </div>
                      </a>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.addShopCart')">
                  <template slot-scope="scope">
                    <span>{{scope.row.statistic_val}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPageAddCart"
                  :page-size="pageSizeAddCart"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCountAddCart">
                </el-pagination>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="listPaidStyle">
              <div style="margin-bottom: 10px;">{{$t('order.starRanking')}}</div>
              <el-row>
                <el-col :span ="24">
                  <el-form :inline="true" :model="searchStar">
                    <el-form-item>
                      <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListDataStar"
                                      v-model="starTime"
                                      type="datetimerange"
                                      align="right"
                                      unlink-panels
                                      :range-separator="$t('tools.to')"
                                      :start-placeholder="$t('tools.startDate')"
                                      :end-placeholder="$t('tools.endDate')">
                      </el-date-picker>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-table stripe border :data="listStar" height="400">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column :label="$t('order.goods')">
                  <template slot-scope="scope">
                    <div>
                      <a :href="'https://www.a9kh.com/goods/' + scope.row.id + '.html'" target="_blank" class="styleImgShow">
                        <img :src="imgUrl + scope.row.images[0]" height="80" alt="">
                        <div style="margin-left: 20px">
                          {{scope.row.name}}
                        </div>
                      </a>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.favorites')">
                  <template slot-scope="scope">
                    <span>{{scope.row.statistic_val}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPageStar"
                  :page-size="pageSizeStar"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCountStar">
                </el-pagination>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { shopStat } from '@/api/operation'
  import { statisticsCountV2, rankingList } from '@/api/homePage'
  import { imgGetUrl } from '@/utils/serverConfig'

  export default {
    name: 'dashboard',
    data() {
      const pz = 100
      return {
        name: '',
        statInfo: {},
        dataInfo: {},
        searchForm: {
          bt: '',
          et: ''
        },
        dataTime: [],
        searchList: {
          skip: 0,
          limit: pz,
          type: 'traffic', // traffic浏览量 visit访客数 paid支付金额 add_cart加购物车 star收藏
          bt: '',
          et: ''
        },
        listTime: [],
        listType: [
          {
            value: 'traffic',
            label: this.$t('order.pageviews')
          },
          {
            value: 'visit',
            label: this.$t('order.visitorsNumber')
          },
          {
            value: 'paid',
            label: this.$t('order.paymentAmount')
          },
          {
            value: 'add_cart',
            label: this.$t('order.addShopCart')
          },
          {
            value: 'star',
            label: this.$t('order.favorites')
          }
        ],
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        imgUrl: imgGetUrl + '?md5=',
        listVisit: [], // 访客数
        currentPageVisit: 1,
        pageSizeVisit: pz,
        itemCountVisit: 0,
        visitTime: [],
        searchVisit: {
          skip: 0,
          limit: pz,
          type: 'visit', // traffic浏览量 visit访客数 paid支付金额 add_cart加购物车 star收藏
          bt: '',
          et: ''
        },
        listPaid: [], // 支付金额
        currentPagePaid: 1,
        pageSizePaid: pz,
        itemCountPaid: 0,
        paidTime: [],
        searchPaid: {
          skip: 0,
          limit: pz,
          type: 'paid', // traffic浏览量 visit访客数 paid支付金额 add_cart加购物车 star收藏
          bt: '',
          et: ''
        },
        listAddCart: [], // 加购物车
        currentPageAddCart: 1,
        pageSizeAddCart: pz,
        itemCountAddCart: 0,
        addCartTime: [],
        searchAddCart: {
          skip: 0,
          limit: pz,
          type: 'add_cart', // traffic浏览量 visit访客数 paid支付金额 add_cart加购物车 star收藏
          bt: '',
          et: ''
        },
        listStar: [], // 收藏
        currentPageStar: 1,
        pageSizeStar: pz,
        itemCountStar: 0,
        starTime: [],
        searchStar: {
          skip: 0,
          limit: pz,
          type: 'star', // traffic浏览量 visit访客数 paid支付金额 add_cart加购物车 star收藏
          bt: '',
          et: ''
        },
        timeValue: 1
      }
    },
    computed: {
      ...mapGetters([
        'shopInfo'
      ])
    },
    watch: {
      dataTime(val) {
        if (val && val.length === 2) {
          this.searchForm.bt = val[0]
          this.searchForm.et = val[1]
        } else {
          this.searchForm.bt = ''
          this.searchForm.et = ''
        }
      },
      listTime(val) {
        if (val && val.length === 2) {
          this.searchList.bt = val[0]
          this.searchList.et = val[1]
        } else {
          this.searchList.bt = ''
          this.searchList.et = ''
        }
      },
      visitTime(val) {
        if (val && val.length === 2) {
          this.searchVisit.bt = val[0]
          this.searchVisit.et = val[1]
        } else {
          this.searchVisit.bt = ''
          this.searchVisit.et = ''
        }
      },
      paidTime(val) {
        if (val && val.length === 2) {
          this.searchPaid.bt = val[0]
          this.searchPaid.et = val[1]
        } else {
          this.searchPaid.bt = ''
          this.searchPaid.et = ''
        }
      },
      addCartTime(val) {
        if (val && val.length === 2) {
          this.searchAddCart.bt = val[0]
          this.searchAddCart.et = val[1]
        } else {
          this.searchAddCart.bt = ''
          this.searchAddCart.et = ''
        }
      },
      starTime(val) {
        if (val && val.length === 2) {
          this.searchStar.bt = val[0]
          this.searchStar.et = val[1]
        } else {
          this.searchStar.bt = ''
          this.searchStar.et = ''
        }
      },
      currentPage(val) {
        this.searchList.skip = (val - 1) * this.pageSize
        this.searchList.limit = this.pageSize
        this.getListData()
      },
      currentPageVisit(val) {
        this.searchVisit.skip = (val - 1) * this.pageSizeVisit
        this.searchVisit.limit = this.pageSizeVisit
        this.getListDataVisit()
      },
      currentPagePaid(val) {
        this.searchPaid.skip = (val - 1) * this.pageSizePaid
        this.searchPaid.limit = this.pageSizePaid
        this.getListDataPaid()
      },
      currentPageAddCart(val) {
        this.searchAddCart.skip = (val - 1) * this.pageSizeAddCart
        this.searchAddCart.limit = this.pageSizeAddCart
        this.getListDataAddCart()
      },
      currentPageStar(val) {
        this.searchStar.skip = (val - 1) * this.pageSizeStar
        this.searchStar.limit = this.pageSizeStar
        this.getListDataStar()
      },
      timeValue: {
        handler(val) {
          if (val === 1) {
            this.searchForm.bt = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
            this.searchForm.et = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
            this.getDataInfo()
          } else if (val === 2) {
            this.searchForm.bt = this.getCurrentWeek(new Date).bt
            this.searchForm.et = this.getCurrentWeek(new Date).et
            this.getDataInfo()
          } else if (val === 3) {
            this.searchForm.bt = this.getCurrentMonth(new Date).bt
            this.searchForm.et = this.getCurrentMonth(new Date).et
            this.getDataInfo()
          } else if (val === 4) {
            this.searchForm.bt = ''
            this.searchForm.et = ''
          }
        },
        immediate: true
      }
    },
    methods: {
      // 本周时间
      getCurrentWeek(value) {
        if (value === '' || value === undefined) {
          return value
        }
        if (value.length === 10) {
          value = value * 1000
        }
        const myDate = new Date(value)
        const day = myDate.getDay() // 回退7天后是星期几？
        const time = myDate.getDate() - day + (day === 0 ? -6 : 1)
        const startTime = new Date(myDate.setDate(time))
        console.log('startTime', startTime.getMonth())
        let monthD = startTime.getMonth() + 1
        if (monthD < 10) {
          monthD = '0' + monthD
        }
        let dayD = startTime.getDate()
        if (dayD < 10) {
          dayD = '0' + dayD
        }
        const bt = startTime.getFullYear() + '-' + monthD + '-' + dayD + ' 00:00:00'
        const endTime = new Date(myDate.setDate(time + 6))
        let monthE = endTime.getMonth() + 1
        if (monthE < 10) {
          monthE = '0' + monthE
        }
        let dayE = endTime.getDate()
        if (dayE < 10) {
          dayE = '0' + dayE
        }
        const et = endTime.getFullYear() + '-' + monthE + '-' + dayE + ' 23:59:59'
        return {
          bt: bt,
          et: et
        }
      },
      // 本月时间
      getCurrentMonth(value) {
        if (value === '' || value === undefined) {
          return value
        }
        if (value.length === 10) {
          value = value * 1000
        }
        const nowdays = new Date(value)
        const year = nowdays.getFullYear()
        let month = nowdays.getMonth() + 1

        if (month < 10) {
          month = '0' + month
        }

        const yDate = new Date(year, month, 0)

        const bt = year + '-' + month + '-01 00:00:00' // 上个月第一天
        const et = year + '-' + month + '-' + yDate.getDate() + ' 23:59:59' // 上个月最后一天

        return {
          bt: bt,
          et: et
        }
      },
      getDataInfo() {
        statisticsCountV2(this.searchForm).then(res => {
          this.dataInfo = res.item
        })
      },
      getListData() {
        rankingList(this.searchList).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
        })
      },
      getListDataVisit() {
        rankingList(this.searchVisit).then(res => {
          this.listVisit = res.items
          this.itemCountVisit = res.total
        })
      },
      getListDataPaid() {
        rankingList(this.searchPaid).then(res => {
          this.listPaid = res.items
          this.itemCountPaid = res.total
        })
      },
      getListDataAddCart() {
        rankingList(this.searchAddCart).then(res => {
          this.listAddCart = res.items
          this.itemCountAddCart = res.total
        })
      },
      getListDataStar() {
        rankingList(this.searchStar).then(res => {
          this.listStar = res.items
          this.itemCountStar = res.total
        })
      },
      getStatInfo() {
        // const items = ['need_pay', 'need_ship', 'refund', 'need_evaluate', 'shipping_exception', 'today_order', 'today_traffic', 'today_visit', 'yesterday_visit', 'yesterday_traffic', 'today_sales']
        const items = ['order_need_claim', 'need_ship', 'exchange_need_approve', 'exchange_need_ship', 'purchase_need_warehouse', 'need_purchase', 'purchase_finance_approve', 'purchase_leader_approve', 'refund']
        shopStat({ categories: JSON.stringify(items) }).then(res => {
          this.statInfo = res.item
        })
      },
      gotoUrl(url, params) {
        if (url === '/order/evaluate' && !this.permissionCheck('view', '3_3')) {
          return
        }
        let pushUrl = {}
        if (params) {
          pushUrl = { name: url, params: params }
        } else {
          pushUrl = { path: url }
        }
        this.$router.push(pushUrl)
      }
    },
    created() {
      const data = new Date()
      const year = data.getFullYear()
      let mouth = data.getMonth() + 1
      let day = data.getDate()
      if (mouth < 10) {
        mouth = '0' + mouth
      }
      if (day < 10) {
        day = '0' + day
      }
      // this.searchForm.bt = year + '-' + mouth + '-' + day + ' 00:00:00'
      // this.searchForm.et = year + '-' + mouth + '-' + day + ' 23:59:59'
      this.searchList.bt = year + '-' + mouth + '-' + day + ' 00:00:00'
      this.searchList.et = year + '-' + mouth + '-' + day + ' 23:59:59'
      this.searchVisit.bt = year + '-' + mouth + '-' + day + ' 00:00:00'
      this.searchVisit.et = year + '-' + mouth + '-' + day + ' 23:59:59'
      this.searchPaid.bt = year + '-' + mouth + '-' + day + ' 00:00:00'
      this.searchPaid.et = year + '-' + mouth + '-' + day + ' 23:59:59'
      this.searchAddCart.bt = year + '-' + mouth + '-' + day + ' 00:00:00'
      this.searchAddCart.et = year + '-' + mouth + '-' + day + ' 23:59:59'
      this.searchStar.bt = year + '-' + mouth + '-' + day + ' 00:00:00'
      this.searchStar.et = year + '-' + mouth + '-' + day + ' 23:59:59'
    },
    mounted() {
      this.getListData()
      this.getListDataVisit()
      this.getListDataPaid()
      this.getListDataAddCart()
      this.getListDataStar()
      this.getStatInfo()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
      .cp{
        cursor: pointer;
      }
      .star-info{
        .title{
          font-size: 20px;
          color: #333333;
        }
        display: flex;
        align-items: center;
        .rate-item{
          display: flex;
          padding: 0px 20px;
          span{
            display: inline-block;
            padding-right: 5px;
            color: #8d8d8d;
          }
        }
      }
      .liuliang{
        margin-top: 20px;
      }
      .stat-item{
        margin-right: 20px;
      }
      .sp{
        p{
          color: #8d8d8d;
          span{
            font-size:25px;
            color: #333333
          }
          line-height: 15px;
        }
      }
    }
  }
  .styleImgShow {
    display: flex;
    cursor: pointer;
  }
  .listPaidStyle {
    /deep/
    .el-table__body-wrapper {
      overflow-y: auto;
    }
  }
  .newStyleBox {
    border: 1px solid #E7E9F4;
    background: #F8F8FC;
    border-radius: 4px;
    padding: 20px 30px;
    margin-top: 20px;
  }
  .new_style_title {
    font-size: 16px;
    color: #3C74F6;
    margin-bottom: 20px;
  }
  .timeBoxRow {
    margin-bottom: 20px;
    height: 40px;
    display: flex;
    align-items: center;
  }
  /deep/ {
    .el-date-editor .el-range-separator {
      width: 7%;
    }
  }
</style>
