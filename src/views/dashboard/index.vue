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
                <p @click="gotoUrl('orderList', { daiStatus: 'Seller'})">销售待认领：<span>{{statInfo.order_need_claim}}</span></p>
                <p @click="gotoUrl('orderList', { daiStatus: 'Purchaser'})">采购待认领：<span>{{statInfo.order_purchaser_claim}}</span></p>
                <p @click="gotoUrl('orderList', { daiStatus: 'Warehouse'})">仓库待认领：<span>{{statInfo.order_warehouser_claim}}</span></p>
                <p @click="gotoUrl('orderList', { daiStatus: 'Finance'})">财务待认领：<span>{{statInfo.order_financer_claim}}</span></p>
                <p @click="gotoUrl('orderList', { order_status: 5})">{{$t('order.tobedelivered')}}<span>{{statInfo.need_ship}}</span></p>
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
                <p>&nbsp;</p>
                <p>&nbsp;</p>
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
                <p @click="gotoUrl('inboundOutBound', { status: 2})">{{$t('warehouse.chukuorderMsg')}}：<span>{{statInfo.outbound_warehouser_confirm  }}</span></p>
                <p>&nbsp;</p>
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
                <p @click="gotoUrl('inboundOutBound', { status: 1})">{{$t('warehouse.chukuorderMsg2')}}：<span>{{statInfo.outbound_purchaser_approve }}</span></p>
                <p>&nbsp;</p>
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
      <el-col :span="18" class="timeBoxRow">
        {{$t('order.time')}}：
        <el-radio-group v-model="timeValue" size="medium" style="margin-right: 5px">
          <el-radio-button :label="1">{{$t('order.today')}}</el-radio-button>
          <el-radio-button :label="2">{{$t('order.Thisweek')}}</el-radio-button>
          <el-radio-button :label="3">{{$t('order.thismonth')}}</el-radio-button>
        </el-radio-group>
        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getDataInfo"
                        v-model="dataTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        :range-separator="$t('tools.to')"
                        :start-placeholder="$t('tools.startDate')"
                        :end-placeholder="$t('tools.endDate')">
        </el-date-picker>
      </el-col>
      <el-col :span="6" align="right">
        <el-button size="small" type="primary" @click="exportCurrentData">{{$t('warehouse.exportData3')}}</el-button>
      </el-col>
      <el-col :span="24">
        <el-row>
          <el-col :span="8">
            <el-card shadow="always" class="stat-item">
              <div class="sp cp" @click="gotoUrl('orderList', { status: 0, bt: searchForm.bt, et: searchForm.et})">
                <p>{{$t('order.orderNumber')}}：<span>{{dataInfo.order_count}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="always" class="stat-item">
              <div class="sp cp" @click="gotoUrl('orderList', { order_status: 2, bt: searchForm.bt, et: searchForm.et})">
                <p>{{$t('lang.orderStat1')}}：<span>{{dataInfo.need_pay}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="always">
              <div class="sp cp" @click="gotoUrl('orderList', { status: 16, bt: searchForm.bt, et: searchForm.et})">
                <p>{{$t('order.orderamount')}}：<span>{{dataInfo.sales | price}}</span></p>
                <div class="little_title">
                  <span style="margin-right: 10px" @click.stop="gotoUrl('orderList', { status: 16, bt: searchForm.bt, et: searchForm.et, type: 101})">{{$t('order.localGoodsPrice')}}：{{dataInfo.local_goods_payprice | price}}</span>
                  <span @click.stop="gotoUrl('orderList', { status: 16, bt: searchForm.bt, et: searchForm.et, type: 5})">{{$t('order.overseaGoodsPrice')}}：{{dataInfo.oversea_goods_payprice | price}}</span>
                  <span>{{$t('order.postage')}}：{{dataInfo.postage  | price}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="always" class="stat-item liuliang">
              <div class="sp cp" @click="gotoUrl('orderList', { status: 16, bt: searchForm.bt, et: searchForm.et})">
                <p>{{$t('order.goodsCount')}}：<span>{{dataInfo.allGoodsCount}}</span></p>
                <div class="little_title">
                  <span style="margin-right: 10px" @click.stop="gotoUrl('orderList', { status: 16, bt: searchForm.bt, et: searchForm.et, type: 101})">{{$t('order.localGoodsCount')}}：{{dataInfo.local_goods_count}}</span>
                  <span @click.stop="gotoUrl('orderList', { status: 16, bt: searchForm.bt, et: searchForm.et, type: 5})">{{$t('order.overseaGoodsCount')}}：{{dataInfo.oversea_goods_count}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="always" class="stat-item liuliang">
              <div class="sp cp">
                <p>{{$t('order.visitorsNumber')}}：<span>{{dataInfo.visit}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="always" class=" liuliang">
              <div class="sp cp">
                <p>{{$t('order.pageviews')}}：<span>{{dataInfo.traffic}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="always" class="stat-item liuliang">
              <div class="sp cp">
                <p>{{$t('order.customerPrice')}}：<span>{{dataInfo.per_order_money | price}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="always" class="stat-item liuliang">
              <div class="sp cp" @click="gotoUrl('orderReturn',  { bt: searchForm.bt, et: searchForm.et})">
                <p>{{$t('order.Return')}}：<span>{{dataInfo.refund}}</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="always" class="liuliang">
              <div class="sp cp" @click="gotoUrl('orderExchange',  { bt: searchForm.bt, et: searchForm.et})">
                <p>{{$t('order.Exchange')}}：<span>{{dataInfo.exchange_count}}</span></p>
              </div>
            </el-card>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
    <!--新用户折线图-->
    <el-row class="newStyleBox">
      <el-col :span="24" class="new_style_title">
        {{$t('order.newUserCanvas')}}
      </el-col>
      <el-col :span="24" class="timeBoxRow">
        {{$t('order.time')}}：
        <el-radio-group v-model="lineDayValue" size="medium" style="margin-right: 5px">
          <el-radio-button :label="1">{{$t('order.sevenDay')}}</el-radio-button>
          <el-radio-button :label="2">{{$t('order.day30')}}</el-radio-button>
        </el-radio-group>
        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getNewUser"
                        v-model="lineValueTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        :range-separator="$t('tools.to')"
                        :start-placeholder="$t('tools.startDate')"
                        :end-placeholder="$t('tools.endDate')">
        </el-date-picker>
        <span style="margin-left: 22%; font-size:20px">{{$t('operation.Totalusers')}}：{{totaluser}}</span>
      </el-col>
      <el-col :span="24">
        <el-row>
          <div class="echart">
            <el-col class="xx">
              <IEcharts :option="optionNewUser" :notMerge="true"></IEcharts>
            </el-col>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <!--排行榜-->
    <el-row class="newStyleBox">
      <el-col :span="24" class="new_style_title">
        {{$t('order.Leaderboard')}}
      </el-col>
      <el-col :span="24">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="listPaidStyle">
              <div style="margin-bottom: 10px;">{{$t('order.salesRank')}}</div>
              <el-row>
                <el-col :span ="24">
                  <el-form :inline="true" :model="searchSales">
                    <el-form-item>
                      <el-radio-group v-model="timeValueSales" size="medium" style="margin-right: 5px">
                        <el-radio-button :label="1">{{$t('order.today')}}</el-radio-button>
                        <el-radio-button :label="2">{{$t('order.Thisweek')}}</el-radio-button>
                        <el-radio-button :label="3">{{$t('order.thismonth')}}</el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                      <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListDataSales"
                                      v-model="SalesTime"
                                      type="daterange"
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
              <el-table stripe border :data="listSales" height="400">
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
                <el-table-column :label="$t('order.sales')">
                  <template slot-scope="scope">
                    <span>{{scope.row.statistic_val}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPageSales"
                  :page-size="pageSizeSales"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCountSales">
                </el-pagination>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="listPaidStyle">
              <div style="margin-bottom: 10px;">{{$t('order.purchaseRank')}}</div>
              <el-row>
                <el-col :span ="24">
                  <el-form :inline="true" :model="searchPurchase">
                    <el-form-item>
                      <el-radio-group v-model="timeValuePurchase" size="medium" style="margin-right: 5px">
                        <el-radio-button :label="1">{{$t('order.today')}}</el-radio-button>
                        <el-radio-button :label="2">{{$t('order.Thisweek')}}</el-radio-button>
                        <el-radio-button :label="3">{{$t('order.thismonth')}}</el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                      <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListDataPurchase"
                                      v-model="PurchaseTime"
                                      type="daterange"
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
              <el-table stripe border :data="listPurchase" height="400">
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
                <el-table-column :label="$t('order.Purchasenum')">
                  <template slot-scope="scope">
                    <span>{{scope.row.statistic_val}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPagePurchase"
                  :page-size="pageSizePurchase"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCountPurchase">
                </el-pagination>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <el-collapse v-model="otherPaiHangBang">
              <el-collapse-item :title="$t('order.otherLeaderboard')" name="1">
                <el-col :span="12">
                  <div class="listPaidStyle">
                    <div class="paihangbangTitle">{{$t('order.addShopRanking')}}</div>
                    <el-row>
                      <el-col :span ="24">
                        <el-form :inline="true" :model="searchAddCart">
                          <el-form-item>
                            <el-radio-group v-model="timeValueAddCart" size="medium" style="margin-right: 5px">
                              <el-radio-button :label="1">{{$t('order.today')}}</el-radio-button>
                              <el-radio-button :label="2">{{$t('order.Thisweek')}}</el-radio-button>
                              <el-radio-button :label="3">{{$t('order.thismonth')}}</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                          <el-form-item>
                            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListDataAddCart"
                                            v-model="addCartTime"
                                            type="daterange"
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
                    <div class="paihangbangTitle">{{$t('order.starRanking')}}</div>
                    <el-row>
                      <el-col :span ="24">
                        <el-form :inline="true" :model="searchStar">
                          <el-form-item>
                            <el-radio-group v-model="timeValueStar" size="medium" style="margin-right: 5px">
                              <el-radio-button :label="1">{{$t('order.today')}}</el-radio-button>
                              <el-radio-button :label="2">{{$t('order.Thisweek')}}</el-radio-button>
                              <el-radio-button :label="3">{{$t('order.thismonth')}}</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                          <el-form-item>
                            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListDataStar"
                                            v-model="starTime"
                                            type="daterange"
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
                <el-col :span="8">
                  <div class="listPaidStyle">
                    <div class="paihangbangTitle">{{$t('order.pageviewRanking')}}</div>
                    <el-row>
                      <el-col :span ="24">
                        <el-form :inline="true" :model="searchForm">
                          <el-form-item>
                            <el-radio-group v-model="timeValueList" size="medium" style="margin-right: 5px">
                              <el-radio-button :label="1">{{$t('order.today')}}</el-radio-button>
                              <el-radio-button :label="2">{{$t('order.Thisweek')}}</el-radio-button>
                              <el-radio-button :label="3">{{$t('order.thismonth')}}</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                          <el-form-item>
                            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListData"
                                            v-model="listTime"
                                            type="daterange"
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
                  <div class="listPaidStyle">
                    <div class="paihangbangTitle">{{$t('order.visitorsRanking')}}</div>
                    <el-row>
                      <el-col :span ="24">
                        <el-form :inline="true" :model="searchVisit">
                          <el-form-item>
                            <el-radio-group v-model="timeValueVisit" size="medium" style="margin-right: 5px">
                              <el-radio-button :label="1">{{$t('order.today')}}</el-radio-button>
                              <el-radio-button :label="2">{{$t('order.Thisweek')}}</el-radio-button>
                              <el-radio-button :label="3">{{$t('order.thismonth')}}</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                          <el-form-item>
                            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListDataVisit"
                                            v-model="visitTime"
                                            type="daterange"
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
                    <div class="paihangbangTitle">{{$t('order.paymentRanking')}}</div>
                    <el-row>
                      <el-col :span ="24">
                        <el-form :inline="true" :model="searchPaid">
                          <el-form-item>
                            <el-radio-group v-model="timeValuePaid" size="medium" style="margin-right: 5px">
                              <el-radio-button :label="1">{{$t('order.today')}}</el-radio-button>
                              <el-radio-button :label="2">{{$t('order.Thisweek')}}</el-radio-button>
                              <el-radio-button :label="3">{{$t('order.thismonth')}}</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                          <el-form-item>
                            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable @change="getListDataPaid"
                                            v-model="paidTime"
                                            type="daterange"
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
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { shopStat } from '@/api/operation'
  import { statisticsCountV2, rankingList, statisticsCountExport, daylinenewuser } from '@/api/homePage'
  import { imgGetUrl } from '@/utils/serverConfig'
  import IEcharts from 'vue-echarts-v3'

  export default {
    name: 'dashboard',
    components: {
      IEcharts: IEcharts
    },
    data() {
      const pz = 100
      return {
        totaluser: 0,
        optionNewUser: {},
        lineDaySearch: {
          bt: '',
          et: ''
        },
        lineValueTime: [],
        lineDayValue: 2,
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
        timeValueList: 1,
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
        timeValueVisit: 1,
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
        timeValuePaid: 1,
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
        timeValueAddCart: 1,
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
        timeValueStar: 1,
        timeValue: 1,
        listSales: [], // 销量
        currentPageSales: 1,
        pageSizeSales: pz,
        itemCountSales: 0,
        SalesTime: [],
        searchSales: {
          skip: 0,
          limit: pz,
          type: 'sales', // traffic浏览量 visit访客数 paid支付金额 add_cart加购物车 star收藏 sales销量 purchase采购数量
          bt: '',
          et: ''
        },
        timeValueSales: 1,
        listPurchase: [], // 采购数量
        currentPagePurchase: 1,
        pageSizePurchase: pz,
        itemCountPurchase: 0,
        PurchaseTime: [],
        searchPurchase: {
          skip: 0,
          limit: pz,
          type: 'purchase', // traffic浏览量 visit访客数 paid支付金额 add_cart加购物车 star收藏 sales销量 purchase采购数量
          bt: '',
          et: ''
        },
        timeValuePurchase: 1,
        otherPaiHangBang: []
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
      SalesTime(val) {
        if (val && val.length === 2) {
          this.searchSales.bt = val[0]
          this.searchSales.et = val[1]
        } else {
          this.searchSales.bt = ''
          this.searchSales.et = ''
        }
      },
      PurchaseTime(val) {
        if (val && val.length === 2) {
          this.searchPurchase.bt = val[0]
          this.searchPurchase.et = val[1]
        } else {
          this.searchPurchase.bt = ''
          this.searchPurchase.et = ''
        }
      },
      lineValueTime(val) {
        if (val && val.length === 2) {
          this.lineDaySearch.bt = val[0]
          this.lineDaySearch.et = val[1]
        } else {
          this.lineDaySearch.bt = ''
          this.lineDaySearch.et = ''
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
      currentPageSales(val) {
        this.searchSales.skip = (val - 1) * this.pageSizeSales
        this.searchSales.limit = this.pageSizeSales
        this.getListDataSales()
      },
      currentPagePurchase(val) {
        this.searchPurchase.skip = (val - 1) * this.pageSizePurchase
        this.searchPurchase.limit = this.pageSizePurchase
        this.getListDataPurchase()
      },
      lineDayValue: {
        handler(val) {
          if (val === 1) {
            this.lineDaySearch.bt = this.$moment().subtract(6, 'days').format('YYYY-MM-DD') + ' 00:00:00'
            this.lineDaySearch.et = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
            this.lineValueTime = [this.lineDaySearch.bt, this.lineDaySearch.et]
            this.getNewUser()
          } else if (val === 2) {
            this.lineDaySearch.bt = this.$moment().subtract(29, 'days').format('YYYY-MM-DD') + ' 00:00:00'
            this.lineDaySearch.et = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
            this.lineValueTime = [this.lineDaySearch.bt, this.lineDaySearch.et]
            this.getNewUser()
            // console.log('taimd', this.$moment().subtract(6, 'days').format('YYYY-MM-DD'))
          } else {
            this.lineDaySearch.bt = ''
            this.lineDaySearch.et = ''
            this.lineValueTime = ['', '']
          }
        },
        immediate: true
      },
      timeValue: {
        handler(val) {
          if (val === 1) {
            this.searchForm.bt = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
            this.searchForm.et = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
            this.dataTime = [this.searchForm.bt, this.searchForm.et]
            this.getDataInfo()
          } else if (val === 2) {
            this.searchForm.bt = this.getCurrentWeek(new Date).bt
            this.searchForm.et = this.getCurrentWeek(new Date).et
            this.dataTime = [this.searchForm.bt, this.searchForm.et]
            this.getDataInfo()
          } else if (val === 3) {
            this.searchForm.bt = this.getCurrentMonth(new Date).bt
            this.searchForm.et = this.getCurrentMonth(new Date).et
            this.dataTime = [this.searchForm.bt, this.searchForm.et]
            this.getDataInfo()
          } else {
            this.searchForm.bt = ''
            this.searchForm.et = ''
            this.dataTime = ['', '']
          }
        },
        immediate: true
      },
      timeValueSales: {
        handler(val) {
          if (val === 1) {
            this.searchSales.bt = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
            this.searchSales.et = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
            this.SalesTime = [this.searchSales.bt, this.searchSales.et]
            this.searchFuncSale()
          } else if (val === 2) {
            this.searchSales.bt = this.getCurrentWeek(new Date).bt
            this.searchSales.et = this.getCurrentWeek(new Date).et
            this.SalesTime = [this.searchSales.bt, this.searchSales.et]
            this.searchFuncSale()
          } else if (val === 3) {
            this.searchSales.bt = this.getCurrentMonth(new Date).bt
            this.searchSales.et = this.getCurrentMonth(new Date).et
            this.SalesTime = [this.searchSales.bt, this.searchSales.et]
            this.searchFuncSale()
          } else {
            this.searchSales.bt = ''
            this.searchSales.et = ''
            this.SalesTime = ['', '']
          }
        },
        immediate: true
      },
      timeValuePurchase: {
        handler(val) {
          if (val === 1) {
            this.searchPurchase.bt = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
            this.searchPurchase.et = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
            this.PurchaseTime = [this.searchPurchase.bt, this.searchPurchase.et]
            this.searchFuncPurchase()
          } else if (val === 2) {
            this.searchPurchase.bt = this.getCurrentWeek(new Date).bt
            this.searchPurchase.et = this.getCurrentWeek(new Date).et
            this.PurchaseTime = [this.searchPurchase.bt, this.searchPurchase.et]
            this.searchFuncPurchase()
          } else if (val === 3) {
            this.searchPurchase.bt = this.getCurrentMonth(new Date).bt
            this.searchPurchase.et = this.getCurrentMonth(new Date).et
            this.PurchaseTime = [this.searchPurchase.bt, this.searchPurchase.et]
            this.searchFuncPurchase()
          } else {
            this.searchPurchase.bt = ''
            this.searchPurchase.et = ''
            this.PurchaseTime = ['', '']
          }
        },
        immediate: true
      },
      timeValueAddCart: {
        handler(val) {
          if (val === 1) {
            this.searchAddCart.bt = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
            this.searchAddCart.et = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
            this.addCartTime = [this.searchAddCart.bt, this.searchAddCart.et]
            this.searchFuncAddCart()
          } else if (val === 2) {
            this.searchAddCart.bt = this.getCurrentWeek(new Date).bt
            this.searchAddCart.et = this.getCurrentWeek(new Date).et
            this.addCartTime = [this.searchAddCart.bt, this.searchAddCart.et]
            this.searchFuncAddCart()
          } else if (val === 3) {
            this.searchAddCart.bt = this.getCurrentMonth(new Date).bt
            this.searchAddCart.et = this.getCurrentMonth(new Date).et
            this.addCartTime = [this.searchAddCart.bt, this.searchAddCart.et]
            this.searchFuncAddCart()
          } else {
            this.searchAddCart.bt = ''
            this.searchAddCart.et = ''
            this.addCartTime = ['', '']
          }
        },
        immediate: true
      },
      timeValueStar: {
        handler(val) {
          if (val === 1) {
            this.searchStar.bt = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
            this.searchStar.et = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
            this.starTime = [this.searchStar.bt, this.searchStar.et]
            this.searchFuncStar()
          } else if (val === 2) {
            this.searchStar.bt = this.getCurrentWeek(new Date).bt
            this.searchStar.et = this.getCurrentWeek(new Date).et
            this.starTime = [this.searchStar.bt, this.searchStar.et]
            this.searchFuncStar()
          } else if (val === 3) {
            this.searchStar.bt = this.getCurrentMonth(new Date).bt
            this.searchStar.et = this.getCurrentMonth(new Date).et
            this.starTime = [this.searchStar.bt, this.searchStar.et]
            this.searchFuncStar()
          } else {
            this.searchStar.bt = ''
            this.searchStar.et = ''
            this.starTime = ['', '']
          }
        },
        immediate: true
      },
      timeValueList: {
        handler(val) {
          if (val === 1) {
            this.searchList.bt = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
            this.searchList.et = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
            this.listTime = [this.searchList.bt, this.searchList.et]
            this.searchFuncList()
          } else if (val === 2) {
            this.searchList.bt = this.getCurrentWeek(new Date).bt
            this.searchList.et = this.getCurrentWeek(new Date).et
            this.listTime = [this.searchList.bt, this.searchList.et]
            this.searchFuncList()
          } else if (val === 3) {
            this.searchList.bt = this.getCurrentMonth(new Date).bt
            this.searchList.et = this.getCurrentMonth(new Date).et
            this.listTime = [this.searchList.bt, this.searchList.et]
            this.searchFuncList()
          } else {
            this.searchList.bt = ''
            this.searchList.et = ''
            this.listTime = ['', '']
          }
        },
        immediate: true
      },
      timeValueVisit: {
        handler(val) {
          if (val === 1) {
            this.searchVisit.bt = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
            this.searchVisit.et = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
            this.visitTime = [this.searchVisit.bt, this.searchVisit.et]
            this.searchFuncVisit()
          } else if (val === 2) {
            this.searchVisit.bt = this.getCurrentWeek(new Date).bt
            this.searchVisit.et = this.getCurrentWeek(new Date).et
            this.visitTime = [this.searchVisit.bt, this.searchVisit.et]
            this.searchFuncVisit()
          } else if (val === 3) {
            this.searchVisit.bt = this.getCurrentMonth(new Date).bt
            this.searchVisit.et = this.getCurrentMonth(new Date).et
            this.visitTime = [this.searchVisit.bt, this.searchVisit.et]
            this.searchFuncVisit()
          } else {
            this.searchVisit.bt = ''
            this.searchVisit.et = ''
            this.visitTime = ['', '']
          }
        },
        immediate: true
      },
      timeValuePaid: {
        handler(val) {
          if (val === 1) {
            this.searchPaid.bt = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
            this.searchPaid.et = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
            this.paidTime = [this.searchPaid.bt, this.searchPaid.et]
            this.searchFuncPaid()
          } else if (val === 2) {
            this.searchPaid.bt = this.getCurrentWeek(new Date).bt
            this.searchPaid.et = this.getCurrentWeek(new Date).et
            this.paidTime = [this.searchPaid.bt, this.searchPaid.et]
            this.searchFuncPaid()
          } else if (val === 3) {
            this.searchPaid.bt = this.getCurrentMonth(new Date).bt
            this.searchPaid.et = this.getCurrentMonth(new Date).et
            this.paidTime = [this.searchPaid.bt, this.searchPaid.et]
            this.searchFuncPaid()
          } else {
            this.searchPaid.bt = ''
            this.searchPaid.et = ''
            this.paidTime = ['', '']
          }
        },
        immediate: true
      }
    },
    methods: {
      getNewUser() {
        // console.log('data', this.searchData)
        daylinenewuser(this.lineDaySearch).then(res => {
          // const arrIn = []
          this.totaluser = res.user_count
          const arrCount = []
          const xAxle = []
          res.items.forEach((item, index) => {
            xAxle.push(item.date)
            arrCount.push(item.val)
            // arrOut.push(item.out)
          })
          this.optionNewUser = {
            color: ['#9AC338'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '5%',
              right: '15%',
              bottom: '3%',
              containLabel: true
            },
            // legend: {
            //   data: ['迁入', '迁出']
            // },
            xAxis: {
              name: this.$t('order.date'),
              type: 'category',
              data: xAxle
            },
            yAxis: [
              {
                name: this.$t('order.dailyNewMember'),
                type: 'value'
              }
            ],
            series: [
              {
                name: this.$t('order.userNumber'),
                type: 'line',
                data: arrCount
              }
            ]
          }
        })
      },
      exportCurrentData() {
        statisticsCountExport(this.searchForm).then(res => {
          var link = document.createElement('a')
          const blod = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blod)
          link.download = 'statistics.xlsx'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      },
      // 本周时间
      getCurrentWeek(value) {
        const vTime = this.$moment(value).format('YYYY-MM-DD')
        var currentDate = new Date(vTime)
        var timesStamp = currentDate.getTime()
        var currenDay = currentDate.getDay()
        var dates = []
        for (var i = 0; i < 7; i++) {
          const dataStr = this.$moment(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).format('YYYY-MM-DD')
          dates.push(dataStr)
        }
        const bt = dates[0] + ' 00:00:00'
        const et = dates[6] + ' 23:59:59'
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
          this.dataInfo = JSON.parse(JSON.stringify(res.item))
          this.dataInfo['allGoodsCount'] = this.dataInfo.local_goods_count + this.dataInfo.oversea_goods_count
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
      getListDataSales() {
        rankingList(this.searchSales).then(res => {
          this.listSales = res.items
          this.itemCountSales = res.total
        })
      },
      getListDataPurchase() {
        rankingList(this.searchPurchase).then(res => {
          this.listPurchase = res.items
          this.itemCountPurchase = res.total
        })
      },
      getStatInfo() {
        // const items = ['need_pay', 'need_ship', 'refund', 'need_evaluate', 'shipping_exception', 'today_order', 'today_traffic', 'today_visit', 'yesterday_visit', 'yesterday_traffic', 'today_sales']
        const items = ['order_need_claim', 'order_purchaser_claim', 'order_warehouser_claim', 'order_financer_claim', 'need_ship', 'exchange_need_approve',
          'exchange_need_ship', 'purchase_need_warehouse', 'need_purchase',
          'purchase_finance_approve', 'purchase_leader_approve', 'refund',
          'outbound_purchaser_approve', 'outbound_warehouser_confirm'
        ]
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
      },
      searchFuncSale() {
        this.searchSales.skip = 0
        this.currentPagePurchase = 1
        this.getListDataSales()
      },
      searchFuncPurchase() {
        this.searchPurchase.skip = 0
        this.currentPagePurchase = 1
        this.getListDataPurchase()
      },
      searchFuncAddCart() {
        this.searchAddCart.skip = 0
        this.currentPageAddCart = 1
        this.getListDataAddCart()
      },
      searchFuncStar() {
        this.searchStar.skip = 0
        this.currentPageStar = 1
        this.getListDataStar()
      },
      searchFuncList() {
        this.searchList.skip = 0
        this.currentPage = 1
        this.getListData()
      },
      searchFuncVisit() {
        this.searchVisit.skip = 0
        this.currentPageVisit = 1
        this.getListDataVisit()
      },
      searchFuncPaid() {
        this.searchPaid.skip = 0
        this.currentPagePaid = 1
        this.getListDataPaid()
      }
    },
    created() {
    },
    mounted() {
      // this.getNewUser()
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
        position: relative;
        p {
          margin: 0;
          height: 50px;
          display: flex;
          align-items: center;
        }
        .little_title {
          font-size: 12px;
          position: absolute;
          right: 0px;
        }
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
    margin-top: 10px;
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
  .paihangbangTitle {
    margin-bottom: 10px;
    font-size: 16px;
  }
  /deep/ {
    .el-date-editor .el-range-separator {
      width: 7%;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      color: #000;
      background: #fff;
      border-color: #DCDFE6;
      box-shadow: none;
    }
    .el-date-editor .el-range-separator {
      width: 12%;
    }
    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
      width: 250px;
    }
    .el-collapse-item__header {
      padding-left: 10px;
      font-size: 16px;
    }
    .el-radio-button--medium .el-radio-button__inner {
      padding: 10px;
    }
  }
  .echart{
    height: 500px;
    /*background-color: #99a9bf;*/
  }
  .xx{
    height: calc(100% - 38px);
  }
</style>
