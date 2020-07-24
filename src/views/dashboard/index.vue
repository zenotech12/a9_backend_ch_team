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
    <el-row class="liuliang" v-if="permissionCheck('view', '3_1')">
      <el-col :span="8">
        <el-card shadow="always" class="stat-item">
          <div class="sp cp" @click="gotoUrl('orderList',{ bt: $moment(new Date().getTime()).format('YYYY-MM-DD'), et: $moment(new Date().getTime()).format('YYYY-MM-DD') })">
            <p>{{$t('lang.todayOrder')}}：<span>{{statInfo.today_order}}</span></p>
            <p>{{$t('lang.todayMoney')}}：<span>{{statInfo.today_sales | price}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always"  class="stat-item">
          <div class="sp">
            <p>{{$t('lang.todayUser')}}：<span>{{statInfo.today_visit}}</span></p>
            <p>{{$t('lang.todayPV')}}：<span>{{statInfo.today_traffic}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">
          <div class="sp">
            <p>{{$t('lang.yesterdayUser')}}：<span>{{statInfo.yesterday_visit}}</span></p>
            <p>{{$t('lang.yesterdayPV')}}：<span>{{statInfo.yesterday_traffic}}</span></p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="liuliang" v-if="permissionCheck('view', '3_1')">
      <el-col :span="4">
        <el-card shadow="always">
          <div class="sp cp" @click="gotoUrl('orderList', { order_status: 2})">
            <p>{{$t('lang.orderStat1')}}：<span>{{statInfo.need_pay}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div class="sp cp" @click="gotoUrl('orderList', { order_status: 5})">
            <p>{{$t('lang.orderStat2')}}：<span>{{statInfo.need_ship}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div class="sp cp" @click="gotoUrl('/order/return')">
            <p>{{$t('lang.orderStat3')}}：<span>{{statInfo.refund}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div class="sp">
            <p>{{$t('lang.orderStat4')}}：<span>{{statInfo.need_evaluate}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div class="sp">
            <p>{{$t('lang.orderStat5')}}：<span>{{statInfo.shipping_exception}}</span></p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getDataInfo"
                        v-model="dataTime"
                        type="datetimerange"
                        align="right"
                        unlink-panels
                        :range-separator="$t('tools.to')"
                        :start-placeholder="$t('tools.startDate')"
                        :end-placeholder="$t('tools.endDate')">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row class="liuliang" style="margin-top: 20px">
      <el-col :span="4">
        <el-card shadow="always" class="stat-item">
          <div class="sp cp">
            <p>{{$t('order.orderNumber')}}：<span>{{dataInfo.order_count}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="always"  class="stat-item">
          <div class="sp cp">
            <p>{{$t('order.customerPrice')}}：<span>{{dataInfo.per_order_money | price}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="always" class="stat-item">
          <div class="sp cp">
            <p>{{$t('order.refundAmountSale')}}：<span>{{dataInfo.refunding_money | price}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="always" class="stat-item">
          <div class="sp">
            <p>{{$t('order.paymentAmount')}}：<span>{{dataInfo.sales | price}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="always" class="stat-item">
          <div class="sp cp">
            <p>{{$t('order.pageviews')}}：<span>{{dataInfo.traffic}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div class="sp cp">
            <p>{{$t('order.visitorsNumber')}}：<span>{{dataInfo.visit}}</span></p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider>{{$t('order.leaderboard')}}</el-divider>
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
            <el-table-column prop="name" :label="$t('goods.name')"></el-table-column>
            <el-table-column :label="$t('goods.imgae')">
              <template slot-scope="scope">
                <el-popover v-for="(img, k) in scope.row.images" class="pointer"
                            placement="right"
                            title=""
                            :key="k"
                            trigger="click">
                  <img :src="imgUrl + img" :key="k" height="480"/>
                  <img slot="reference" :src="imgUrl +img" :key="k" style="margin-right:8px;max-height: 40px;max-width: 100px">
                </el-popover>
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
            <el-table-column prop="name" :label="$t('goods.name')"></el-table-column>
            <el-table-column :label="$t('goods.imgae')">
              <template slot-scope="scope">
                <el-popover v-for="(img, k) in scope.row.images" class="pointer"
                            placement="right"
                            title=""
                            :key="k"
                            trigger="click">
                  <img :src="imgUrl + img" :key="k" height="480"/>
                  <img slot="reference" :src="imgUrl +img" :key="k" style="margin-right:8px;max-height: 40px;max-width: 100px">
                </el-popover>
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
        <div>
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
            <el-table-column prop="name" :label="$t('goods.name')"></el-table-column>
            <el-table-column :label="$t('goods.imgae')">
              <template slot-scope="scope">
                <el-popover v-for="(img, k) in scope.row.images" class="pointer"
                            placement="right"
                            title=""
                            :key="k"
                            trigger="click">
                  <img :src="imgUrl + img" :key="k" height="480"/>
                  <img slot="reference" :src="imgUrl +img" :key="k" style="margin-right:8px;max-height: 40px;max-width: 100px">
                </el-popover>
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
        <div>
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
            <el-table-column prop="name" :label="$t('goods.name')"></el-table-column>
            <el-table-column :label="$t('goods.imgae')">
              <template slot-scope="scope">
                <el-popover v-for="(img, k) in scope.row.images" class="pointer"
                            placement="right"
                            title=""
                            :key="k"
                            trigger="click">
                  <img :src="imgUrl + img" :key="k" height="480"/>
                  <img slot="reference" :src="imgUrl +img" :key="k" style="margin-right:8px;max-height: 40px;max-width: 100px">
                </el-popover>
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
        <div>
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
            <el-table-column prop="name" :label="$t('goods.name')"></el-table-column>
            <el-table-column :label="$t('goods.imgae')">
              <template slot-scope="scope">
                <el-popover v-for="(img, k) in scope.row.images" class="pointer"
                            placement="right"
                            title=""
                            :key="k"
                            trigger="click">
                  <img :src="imgUrl + img" :key="k" height="480"/>
                  <img slot="reference" :src="imgUrl +img" :key="k" style="margin-right:8px;max-height: 40px;max-width: 100px">
                </el-popover>
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
            label: '浏览量'
          },
          {
            value: 'visit',
            label: '访客数'
          },
          {
            value: 'paid',
            label: '支付金额'
          },
          {
            value: 'add_cart',
            label: '加购物车'
          },
          {
            value: 'star',
            label: '收藏'
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
        }
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
      }
    },
    methods: {
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
        const items = ['need_pay', 'need_ship', 'refund', 'need_evaluate', 'shipping_exception', 'today_order', 'today_traffic', 'today_visit', 'yesterday_visit', 'yesterday_traffic', 'today_sales']
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
      this.searchForm.bt = year + '-' + mouth + '-' + day + ' 00:00:00'
      this.searchForm.et = year + '-' + mouth + '-' + day + ' 23:59:59'
      this.getDataInfo()
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
</style>
