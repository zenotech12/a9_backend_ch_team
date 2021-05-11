<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24">
            <el-tabs v-model="tabStatus">
              <el-tab-pane :label="$t('operation.liveComingSoon')" name="live"></el-tab-pane>
              <el-tab-pane :label="$t('operation.historyRecord')" name="history"></el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-row v-if="tabStatus === 'live'" class="liveBox">
          <el-col :span="24">
            <el-row>
              <el-col :span="24" class="liveBigBoxCurrent">
                <el-form ref="form" :model="form" label-width="120px">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="$t('operation.liveName')">
                        <el-input v-model="form.name" :disabled="modifyDisabled"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('operation.liveStatus')" v-if="Object.keys(currentLive).length > 0">
                        <span v-if="currentLive.status === 1">{{$t('operation.comingSoon')}}</span>
                        <span v-if="currentLive.status === 2">{{$t('operation.live')}}</span>
                        <el-button type="primary" v-if="currentLive.status === 2" size="mini" @click="lookLiveVideo">{{$t('tools.check')}}</el-button>
                      </el-form-item>
                      <el-form-item :label="$t('operation.pushStreamAddress')" v-if="pushUrlShow">
                        <span>{{pushurl}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item :label="$t('operation.liveFenMian')">
                        <single-file-upload v-model="coverImgs" :promptInfo1="promptInfo" :disabled="modifyDisabled"></single-file-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
              <el-col :span="24">
                <el-tabs v-model="tabGoods" @tab-click="tabChooseFunc">
                  <el-tab-pane :label="$t('operation.goods')" name="goods"></el-tab-pane>
                  <el-tab-pane :label="$t('operation.liveCoupon')" v-if="currentLive.status === 2" name="coupon"></el-tab-pane>
                </el-tabs>
              </el-col>
              <!--商品表格-->
              <el-col :span="24" v-if="tabGoods === 'goods'">
                <el-row>
                  <!--直播中可添加-->
                  <el-col :span="24" style="text-align: right;padding: 10px 15px" v-if="permissionCheck('opt') && currentLive.status === 2">
                    <div class="boxFuncBtn">
                      <goods-selector :mulit="true" v-if="modifyDisabled" :trigger="false" :haveTime.sync="modifyDisabled" :showTag="!modifyDisabled" v-model="spu_ids" :notSpuIds="JSON.stringify(currentLive.spu_ids)" @selectChanged="addNewGoods" :approve_status="2" :shelf_status="2"></goods-selector>
                      <!--<el-button type="primary" size="mini" icon="el-icon-plus" @click="addGoods">{{$t('tools.add')}}</el-button>-->
                    </div>
                  </el-col>
                  <!--还没直播时-->
                  <el-col :span="24" style="text-align: right;padding: 10px 15px" v-if="permissionCheck('opt') && currentLive.status !== 2">
                    <div class="boxFuncBtn">
                      <goods-selector :mulit="true" :showTag="modifyDisabled" :trigger="false" v-model="form.spu_ids" @selectChanged="selectChanged" :approve_status="2" :notSpuIds="JSON.stringify([])" :shelf_status="2"></goods-selector>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <div style="height: calc(100vh - 530px)">
                      <el-table stripe border :data="tableData" height="calc(100% - -10px)">
                        <el-table-column prop="code">
                          <template slot="header" slot-scope="scope">
                          <el-input
                            v-model="searchCode"
                            size="mini"
                            clearable
                            :placeholder="$t('operation.goodsCode')"/>
                        </template>
                        </el-table-column>
                        <el-table-column>
                          <template slot="header" slot-scope="scope">
                            <el-input
                              v-model="searchKey"
                              size="mini"
                              clearable
                              :placeholder="$t('goods.name')"/>
                          </template>
                          <template  slot-scope="scope">
                            <a class="goods-item" :href="goodsPreview(scope.row)" target="_blank" style="cursor: pointer">
                              <el-image class="image" style="width: 60px; height: 60px"  :src="getImageUrl(scope.row.images[0], 100,100)"  fit="cover"></el-image>
                              <div class="g-info">
                                <p>{{scope.row.name}}
                                  <el-tag size="mini" type="danger" v-if="scope.row.type === 2">{{$t("goods.cobuy")}}</el-tag>
                                  <el-tag size="mini" v-if="scope.row.type === 3">{{$t("goods.exp")}}</el-tag>
                                  <!--<a class="el-icon-view"></a>-->
                                </p>
                              </div>
                            </a>
                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('goods.price')">
                          <template  slot-scope="scope">
                            <template v-if="scope.row.type === 3">
                              <el-tag size="mini" v-if="scope.row.type === 3">{{$t("goods.exp")}}</el-tag>
                              <span v-if="scope.row.min_price !== scope.row.max_price">{{scope.row.min_price}}-{{scope.row.max_price}}</span>
                              <span v-else>{{scope.row.min_price}}</span>
                            </template>
                            <template v-else>
                              <span v-if="scope.row.min_price !== scope.row.max_price">{{scope.row.min_price | price}}-{{scope.row.max_price | price}}</span>
                              <span v-else>{{scope.row.min_price | price}}</span>
                            </template>
                          </template>
                        </el-table-column>
                        <el-table-column prop="inventory" :label="$t('goods.inventory')"></el-table-column>
                        <el-table-column prop="sales" :label="$t('goods.saled')"></el-table-column>
                        <el-table-column :label="$t('operation.recommend')">
                          <template slot-scope="scope">
                            <el-switch
                              v-model="scope.row.recommend"
                              @change="liveIngTuiJian(scope.row.id, scope.row.recommend)"
                              active-color="#13ce66"
                              inactive-color="#ff4949">
                            </el-switch>
                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('operation.explain')" v-if="currentLive.status === 2">
                          <template slot-scope="scope">
                            <el-switch
                              v-model="scope.row.explain"
                              @change="explainFunc(scope.row.id, scope.row.explain)"
                              active-color="#13ce66"
                              inactive-color="#ff4949">
                            </el-switch>
                          </template>
                        </el-table-column>
                        <el-table-column prop="gen_time"  :label="$t('goods.publishTime')"></el-table-column>
                        <el-table-column :label="$t('tools.opt')">
                          <template slot-scope="scope">
                            <i class="el-icon-delete" style="font-size: 18px;cursor: pointer" v-if="!modifyDisabled" @click="delCurrentGoods(scope.row.id)"></i>
                            <el-button type="text" v-if="currentLive.status === 2 && scope.row.recommend === false && scope.row.explain === false" @click="goodsOffShelf(scope.row.id, scope.$index)">{{$t('operation.goodsOffshelf')}}</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="optBtnStyle">
                  <el-col :span="24" style="margin-top: 20px">
                    <confirm-button @confirmButton="saveAdFunc" :disabled="submitDisabled" v-if="type === 'add' && permissionCheck('opt')" :confirmButtonInfor="$t('tools.save')"></confirm-button>
                    <confirm-button @confirmButton="editLive" :disabled="submitDisabled" v-if="type === 'edit' && permissionCheck('opt') && currentLive.status !== 2" :confirmButtonInfor="$t('tools.save')"></confirm-button>
                    <delete-button :promptInfor="delTip" v-if="currentLive.status === 1 && permissionCheck('opt')" :btnType="primary" style="margin-left: 20px" @delData="delCurrentLive"></delete-button>
                    <el-button type="primary" size="small" @click="liveStartFunc" v-if="isShowStart && permissionCheck('opt')">{{$t('operation.startBroadcast')}}</el-button>
                    <el-button type="primary" size="small" @click="liveStopFunc" v-if="currentLive.status === 2 && permissionCheck('opt')">{{$t('operation.endLiveBroadcast')}}</el-button>
                  </el-col>
                </el-row>
              </el-col>
              <!--优惠券表格-->
              <el-col :span="24" v-if="tabGoods === 'coupon'">
                <el-row>
                  <el-col :span="24" style="text-align: right;padding: 10px 15px" v-if="permissionCheck('opt') && currentLive.status === 2">
                    <div class="boxFuncBtn">
                      <el-button type="primary" size="mini" icon="el-icon-plus" @click="chooseCoupon">{{$t('tools.add')}}</el-button>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div style="height: calc(100vh - 490px)">
                      <el-table stripe border :data="liveCouponList" height="calc(100% - -10px)">
                        <el-table-column prop="name" :label="$t('operation.name')"></el-table-column>
                        <el-table-column :label="$t('operation.couponType')">
                          <template  slot-scope="scope">
                            {{couponType[scope.row.type-1].name}}
                            <template v-if="scope.row.type === 1">[{{scope.row.quantity_discount_value | price}}]</template>
                            <template v-else-if="scope.row.type === 2">[{{scope.row.percentage_discount_value}}%]</template>
                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('operation.couponCond')">
                          <template  slot-scope="scope">
                            {{$t('operation.couponCondA')}} {{scope.row.threshold | price}} {{$t('operation.couponCondB')}}
                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('operation.rangeType')">
                          <template  slot-scope="scope">
                            {{rangeType[scope.row.range_type-1].name}}
                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('operation.received')">
                          <template  slot-scope="scope">
                            {{scope.row.used_count}}
                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('operation.totalCount')">
                          <template  slot-scope="scope">
                            {{scope.row.total_count}}
                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('operation.validTime')">
                          <template  slot-scope="scope">
                            <template v-if="scope.row.valid_day_count > 0">
                              {{$t('operation.validTime2Tip1')}}<strong>{{scope.row.valid_day_count}}</strong>{{$t('operation.validTime2Tip2')}}
                            </template>
                            <template v-else >
                              {{scope.row.bt + $t('operation.to') + scope.row.et}}
                            </template>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row v-if="tabStatus === 'history'">
          <el-col :span="24" class="historyBox">
            <div style="height: calc(100vh - 200px)">
              <el-table stripe border :data="historyData" height="calc(100% - 30px)">
                <el-table-column label="#" width="60px">
                  <template slot-scope="scope">
                    {{scope.$index + historySearch.skip + 1}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.name')" prop="name"></el-table-column>
                <el-table-column :label="$t('operation.cover')">
                  <template slot-scope="scope">
                    <el-popover class="pointer"
                                placement="right"
                                title=""
                                trigger="click">
                      <img :src="getImageUrl(scope.row.cover_imgs[0], 100,100)" style="max-height: 480px; max-width: 600px"/>
                      <img slot="reference" :src="getImageUrl(scope.row.cover_imgs[0],240)" style="margin-right:8px;max-height: 60px;max-width: 120px">
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.liveTime')">
                  <template slot-scope="scope">
                    <span>{{scope.row.start_time}}~{{scope.row.end_time}}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.lookNumberPeople')" prop="visiter_count"></el-table-column>
                <el-table-column :label="$t('operation.likes')" prop="thumb_count"></el-table-column>
                <el-table-column :label="$t('operation.numberGoodsSold')" prop="goods_sale_count">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showOrder(scope.row, scope.row.goods_sale_count)">{{scope.row.goods_sale_count}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.orderNumber')" prop="order_count">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showOrder(scope.row, scope.row.order_count)">{{scope.row.order_count}}</el-button>
                  </template>
                </el-table-column>
                <!--<el-table-column :label="$t('tools.opt')" width = "140"  v-if="permissionCheck('opt')">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-button type="text" @click="showLiveVideo(scope.row)" size="small">回看</el-button>-->
                  <!--</template>-->
                <!--</el-table-column>-->
              </el-table>
              <el-row style="margin-top: 10px">
                <el-col :span="24" style="text-align: right;">
                  <el-pagination
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!--订单列表-->
        <el-dialog :title="$t('operation.orderList')" width="80%" @close="orderShowDialog = false" :visible.sync="orderShowDialog" :close-on-click-modal="false" center >
          <el-row>
            <el-col :span="24" style="height: calc(100vh - 320px)">
              <el-table stripe border :data="orderData" height="calc(100% - 18px)" @selection-change="handleSelectionChange">
                <el-table-column label="#" width="60px" fixed="left">
                  <template slot-scope="scope">
                    {{scope.$index + orderSearch.skip + 1}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.no')" width="200px" fixed="left">
                  <template slot-scope="scope">
                    <el-tag style="display: block; width: 50px; margin: 0 auto" v-if="scope.row.type===2" size="mini">{{$t('order.orderType2')}}</el-tag>
                    <el-tag style="display: block; width: 60px; margin: 0 auto" v-if="scope.row.type===3" size="mini">{{$t('order.orderType3')}}</el-tag>
                    <el-tag style="display: block; width: 60px; margin: 0 auto" v-if="scope.row.type===4" size="mini">{{$t('order.orderType4')}}</el-tag>
                    {{scope.row.no}}<br/>
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
                <el-table-column :label="$t('order.user')" width="130">
                  <template slot-scope="scope">
                    <div class="ui">{{scope.row.user_nick_name}}</div>
                    <div class="ui">{{scope.row.user_mobile}}</div>
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('order.goods')" min-width="400">
                  <template  slot-scope="scope">
                    <div class="goods-item" style="min-height: 100px" v-for="(gInfo,k) in scope.row.merchant_item.goods_items" :key="k">
                      <el-image class="image" style="width: 100px; height: 100px;display: inline-block"  :src="getImageUrl(gInfo.goods_info.sku_img, 100)"  fit="cover"></el-image>
                      <div class="g-info">
                        <p>{{gInfo.goods_info.spu_name}}<el-tag v-if="gInfo.goods_info.gift" size="mini">{{$t('order.gift')}}</el-tag>
                          <!--<el-tag v-if="gInfo.after_saled" style="cursor: pointer" type="danger" size="mini" @click.prevent="showReturn(scope.row, gInfo)">{{$t('order.afterSale')}}</el-tag>-->
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
                <el-table-column :label="$t('order.price')" width="130">
                  <template slot-scope="scope" >
                    <span :title="$t('order.price1') + '+' + $t('order.price2')"><template v-if="scope.row.pay_points > 0"> *{{scope.row.pay_points}}+</template> {{scope.row.pay_price | price}}</span><span v-if="scope.row.pay_way">({{payWay(scope.row.pay_way)}})</span><br/>
                    <span>({{$t('order.includePostage')}}：{{scope.row.postage | price}})</span>
                  </template>
                </el-table-column>
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
                <el-table-column :label="$t('order.status')" width="90">
                  <template slot-scope="scope">
                    <el-tag >{{orderStatus[scope.row.status]}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.genTime')" width="180">
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
              </el-table>
              <el-row style="margin-top: 10px" v-if="itemCountOrder !== 0">
                <el-col :span="24" style="text-align: right;">
                  <el-pagination
                    :current-page.sync="currentPageOrder"
                    :page-size.sync="pageSizeOrder"
                    :page-sizes="[10, 30, 50, 100, 500]"
                    layout="total, prev, pager, next, jumper,sizes"
                    :total="itemCountOrder">
                  </el-pagination>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="orderShowDialog = false" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.close')}}</el-button>
          </div>
        </el-dialog>
        <!--直播-->
        <el-dialog :title="$t('operation.liveVideo')" v-if="dialogShow" @close="closeLiveDialog" :close-on-click-modal="false" width="700px" :visible.sync="dialogShow" center style="margin-top: 0vh">
          <el-row class="liveVideo">
            <el-col :span="24" style="min-height: 380px;max-height: 500px">
              <video id="my-video" class="video-js vjs-big-play-centered vjs-fluid" x-webkit-airplay="allow" webkit-playsinline autoplay style="min-height: 500px" controls preload="auto" data-setup="{}">
                <source :src="videoUrl" type="application/x-mpegURL">
              </video>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeLiveDialog" size="small" style="margin-right: 24px;">{{$t('tools.close')}}</el-button>
          </div>
        </el-dialog>
        <!--优惠券-->
        <el-dialog :title="$t('operation.chooseCoupon')" width="40%" @close="couponShowDialog = false" :visible.sync="couponShowDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="couponForm">
            <el-form-item :label="$t('operation.coupon')">
              <el-select v-model="currentCouponId" :placeholder="$t('tools.pleaseSelect')">
                <el-option
                  v-for="item in couponList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('operation.isLimitTime')">
              <el-radio-group v-model="couponForm.send_type">
                <el-radio :label="1">{{$t('operation.unlimitedTime')}}</el-radio>
                <el-radio :label="2">{{$t('operation.limitFives')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('operation.totalCount')">
              <el-input v-model.number="couponForm.count"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="saveCoupon" size="small" type="primary">{{$t('tools.confirm')}}</el-button>
            <el-button @click="couponShowDialog = false" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.close')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import goodsSelector from '@/components/goodsSelector'
  import { liveItemsModify, liveItemsAdd, liveItemsDel, liveItemsList, liveItemsAddGoods, liveStart, liveStop, liveRecommend, liveExplain, liveOffshelf, couponSetLiveSend, couponList, sendedSetCoupons } from '@/api/operation'
  import { spusList } from '@/api/goods'
  import { ordersList } from '@/api/order'
  export default {
    components: {
      goodsSelector
    },
    data() {
      const pz = 10
      return {
        searchForm: {
          skip: '',
          limit: pz,
          status: 5 // 0所有 1准备中 2直播中 4结束 5准备中和直播中的单
        },
        optArr: { 2: this.$t('order.opt2'), 4: this.$t('order.opt4'), 5: this.$t('order.opt5'), 6: this.$t('order.opt6'), 7: this.$t('order.opt7'), 8: this.$t('order.opt8'), 9: this.$t('order.opt9') },
        orderStatus: [this.$t('tools.all'), this.$t('order.status1'), this.$t('order.status2'), this.$t('order.status3'), this.$t('order.status4'), this.$t('order.status5'),
          this.$t('order.status6'), this.$t('order.status7'), this.$t('order.status8'), '', this.$t('order.status10')],
        tableData: [],
        historyData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        showTime: [],
        form: {
          spu_ids: '', // ["xxxx","xxxxxxx"]商品ids
          cover_imgs: '', // ["xxxx"]直播封面
          name: '', // 直播间名称
          recommend_spu_id: '' // 推荐商品
        },
        formEditDialog: false,
        submitDisabled: false,
        multipleSelection: [],
        isBatch: true,
        batchGoodsParam: [],
        tabStatus: 'live',
        promptInfo: this.$t('operation.uploadTip'),
        type: 'add',
        coverImgs: '',
        currentLive: {},
        delTip: this.$t('operation.delTipLive'),
        primary: 'primary',
        // goodsDialog: false,
        // addGoodsDisable: false,
        searchKey: '',
        searchCode: '',
        currentDataGoods: [],
        spu_ids: '',
        historySearch: {
          skip: 0,
          limit: pz,
          status: 4
        },
        orderShowDialog: false,
        orderData: [],
        currentPageOrder: 1,
        pageSizeOrder: pz,
        itemCountOrder: 0,
        orderSearch: {
          skip: 0,
          limit: pz,
          bt: '',
          et: '',
          spu_ids: '',
          order_status: -1
        },
        modifyDisabled: false,
        dialogShow: false,
        videoUrl: '',
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
        pushurl: '',
        isShowStart: false,
        pushUrlShow: false,
        tuiJianId: '',
        explainId: '',
        tabGoods: 'goods',
        couponShowDialog: false,
        couponForm: {
          send_type: 1, // 1不限时 2限时5s
          count: 0 // 数量
        },
        currentCouponId: '',
        couponList: [],
        liveCouponList: [],
        couponType: [{ code: 1, name: this.$t('operation.couponTypeA') }, { code: 2, name: this.$t('operation.couponTypeB') }, { code: 3, name: this.$t('operation.couponTypeC') }],
        rangeType: [{ code: 1, name: this.$t('operation.rangeTypeA') }, { code: 2, name: this.$t('operation.rangeTypeB') }, { code: 3, name: this.$t('operation.rangeTypeC') }]
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      currentPage(val) {
        this.historySearch.skip = (val - 1) * this.pageSize
        this.historySearch.limit = this.pageSize
        this.getHistoryList()
      },
      searchKey(val) {
        if (val === '') {
          this.tableData = this.currentDataGoods
        } else {
          const array = []
          this.tableData.forEach(item => {
            const name = item.name.toUpperCase()
            const searchKey = val.toUpperCase()
            if (name.indexOf(searchKey) !== -1) {
              array.push(item)
            }
          })
          this.tableData = array
        }
      },
      searchCode(val) {
        if (val === '') {
          this.tableData = this.currentDataGoods
        } else {
          const array = []
          this.tableData.forEach(item => {
            const code = item.code.toString()
            if (code.indexOf(val) !== -1) {
              array.push(item)
            }
          })
          this.tableData = array
        }
      },
      currentPageOrder(val) {
        this.orderSearch.skip = (val - 1) * this.pageSizeOrder
        this.orderSearch.limit = this.pageSizeOrder
        this.getOrderList()
      },
      pageSizeOrder(val) {
        this.orderSearch.skip = 0
        this.orderSearch.limit = val
        this.getOrderList()
      }
    },
    methods: {
      // 选择优惠券
      chooseCoupon() {
        this.couponShowDialog = true
        this.currentCouponId = ''
        this.couponForm.send_type = 1
        this.couponForm.count = 0
      },
      saveCoupon() { // 保存优惠券
        couponSetLiveSend(this.currentCouponId, this.couponForm).then(res => {
          if (res.meta === 0) {
            this.$message.success(this.$t('operation.couponSendSuccess'))
            this.couponShowDialog = false
            this.getLiveCouponList()
          }
        })
      },
      // 获取直播优惠券
      getLiveCouponList() {
        sendedSetCoupons(this.currentLive.id).then(res => {
          this.liveCouponList = res.items
          console.log('this.liveCouponList', this.liveCouponList)
        })
      },
      tabChooseFunc(v) {
        if (v.name === 'coupon') {
          this.getLiveCouponList()
        }
      },
      // 获取优惠券模板列表
      getCouponList() {
        const search = {
          type: 0,
          for_live: true,
          live_template: true
        }
        couponList(search).then(res => {
          this.couponList = res.items
        })
      },
      liveStartFunc() {
        this.form.cover_imgs = JSON.stringify([this.coverImgs])
        // console.log('this.form', this.form)
        if (this.form.name === '') {
          this.$message.error(this.$t('operation.enterLiveName'))
          return
        }
        if (this.coverImgs === '') {
          this.$message.error(this.$t('operation.pleaseUploadCover'))
          return
        }
        console.log('formff', this.form)
        liveItemsList(this.searchForm).then(res => {
          const obj = res.items[0] ? JSON.parse(JSON.stringify(res.items[0])) : {}
          if (obj) {
            const item = {
              spu_ids: JSON.stringify(obj.spu_ids),
              cover_imgs: JSON.stringify(obj.cover_imgs),
              name: obj.name
            }
            console.log('item', JSON.stringify(item))
            console.log('form', JSON.stringify(this.form))
            const form = {
              spu_ids: this.form.spu_ids,
              cover_imgs: this.form.cover_imgs,
              name: this.form.name
            }
            if (JSON.stringify(item) !== JSON.stringify(form)) {
              this.$message.error(this.$t('operation.pleaseClickBtnTip'))
            } else {
              liveStart(this.form).then(vRes => {
                this.pushurl = vRes.pushurl
                this.pushUrlShow = true
                this.isShowStart = false
                this.getLiveListFunc()
              })
            }
          }
        })
      },
      liveStopFunc() {
        liveStop().then(res => {
          // this.$message.success('直播结束')
          this.resetForm()
        })
      },
      resetForm() {
        this.form.name = ''
        this.form.cover_imgs = ''
        this.form.spu_ids = ''
        this.tableData = []
        this.modifyDisabled = false
        this.coverImgs = ''
        this.pushUrlShow = false
        this.type = 'add' // 结束直播后要重置保存按钮的类型为添加
        this.currentLive = {}
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
      closeLiveDialog() {
        this.removejscssfile('neplayer.min.css', 'css')
        this.removejscssfile('neplayer.min.js', 'js')
        this.dialogShow = false
      },
      removejscssfile(filename, filetype) {
        var targetelement = (filetype === 'js') ? 'script' : (filetype === 'css') ? 'link' : 'none'
        var targetattr = (filetype === 'js') ? 'src' : (filetype === 'css') ? 'href' : 'none'
        var allsuspects = document.getElementsByTagName(targetelement)
        for (var i = allsuspects.length; i >= 0; i--) {
          if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) !== null && allsuspects[i].getAttribute(targetattr).indexOf(filename) !== -1) {
            allsuspects[i].parentNode.removeChild(allsuspects[i])
          }
        }
      },
      addResources() {
        var oHead = document.getElementsByTagName('HEAD').item(0)
        var link = document.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = '//sys.a9kh.com/neplayer/neplayer.min.css'
        oHead.appendChild(link)
        var oScript = document.createElement('script')
        oScript.type = 'text/javascript'
        oScript.src = '//sys.a9kh.com/neplayer/neplayer.min.js'
        oHead.appendChild(oScript)
      },
      lookLiveVideo() {
        this.addResources()
        this.videoUrl = this.currentLive.channel_info.hlsPullUrl.replace('http:', '')
        this.dialogShow = true
      },
      // 商品下架
      goodsOffShelf(id, index) {
        // this.tableData.splice(index, 1)
        liveOffshelf(this.currentLive.id, { 'spu_ids': id }).then(res => {
          this.$message.success(this.$t('operation.goodsOffShelfSuccess'))
          if (id === this.tuiJianId) {
            this.tuiJianId = ''
          }
          if (id === this.explainId) {
            this.explainId = ''
          }
          this.spu_ids = ''
          this.getLiveListFunc()
        })
      },
      delCurrentGoods(id) {
        const arrayId = JSON.parse(this.form.spu_ids)
        arrayId.splice(arrayId.indexOf(id), 1)
        this.form.spu_ids = JSON.stringify(arrayId)
        const index = this.tableData.findIndex(c => {
          if (c.id === id) {
            return c
          }
        })
        this.tableData.splice(index, 1)
        this.tableData && this.tableData.forEach((v, k) => {
          v['code'] = k + 1
        })
        // 判断删除的商品是否有推荐的商品。如果有推荐的商品，那就把推荐商品id清空
        const tuiIndex = this.tableData.findIndex(res => {
          if (res.id === this.tuiJianId) {
            return res
          }
        })
        if (tuiIndex === -1) {
          this.tuiJianId = ''
        }
        console.log('tableData', this.tableData)
        this.currentDataGoods = this.tableData
      },
      addNewGoods(data) {
        // console.log('data', data)
        console.log('spu_ids', this.spu_ids)
        liveItemsAddGoods(this.currentLive.id, { 'spu_ids': this.spu_ids }).then(res => {
          this.spu_ids = ''
          this.getLiveListFunc()
        })
      },
      // 直播中的推荐
      liveIngTuiJian(id, item) {
        if (id === this.tuiJianId) {
          this.tuiJianId = ''
        } else if (id !== this.tuiJianId) {
          this.tuiJianId = id
        }
        if (this.currentLive.status === 2) {
          const obj = {
            spu_id: id,
            end: !item
          }
          liveRecommend(this.currentLive.id, obj).then(res => {})
        }
        this.tableData.forEach((v, k) => {
          if (v.id !== id) {
            this.tableData[k].recommend = false
          }
        })
      },
      // 讲解商品
      explainFunc(id, item) {
        if (id === this.explainId) {
          this.explainId = ''
        } else if (id !== this.explainId) {
          this.explainId = id
        }
        if (this.currentLive.status === 2) {
          const obj = {
            spu_id: id,
            end: !item
          }
          console.log('obj', obj)
          liveExplain(this.currentLive.id, obj).then(res => {})
        }
        this.tableData.forEach((v, k) => {
          if (v.id !== id) {
            this.tableData[k].explain = false
          }
        })
      },
      selectChanged(data) {
        data && data.forEach((v, k) => {
          v['code'] = k + 1
          if (v.id === this.tuiJianId) {
            v['recommend'] = true
          } else {
            v['recommend'] = false
          }
          v['explain'] = false
        })
        console.log('data', data)
        console.log('this.tuiJianId', this.tuiJianId)
        this.tableData = JSON.parse(JSON.stringify(data))
        this.currentDataGoods = JSON.parse(JSON.stringify(data))
      },
      showOrder(data, number) {
        if (number > 0) {
          this.orderSearch.bt = data.start_time
          this.orderSearch.et = data.end_time
          this.orderSearch.spu_ids = data.spu_ids ? JSON.stringify(data.spu_ids) : ''
          this.getOrderList()
          this.orderShowDialog = true
        }
      },
      getOrderList() {
        ordersList(this.orderSearch).then(res => {
          this.orderData = res.items
          this.itemCountOrder = res.total
        })
      },
      // 历史记录
      getHistoryList() {
        liveItemsList(this.historySearch).then(res => {
          this.historyData = res.items
          this.itemCount = res.total
        })
      },
      goodsPreview(row) {
        // return 'https://www.a9kh.com/goods/' + row.id + '.html'
      },
      cancel() {
        this.formEditDialog = false
      },
      handleSelectionChange(val) {
        this.multipleSelection = []
        val.forEach(item => {
          this.multipleSelection.push(item.id)
        })
      },
      getPositionName(code) {
        const result = this.adPosition.find(item => { return item.code === code })
        return result ? result.name : ''
      },
      editLive() {
        this.type = 'edit'
        // console.log('form', this.form)
        this.saveAdFunc()
      },
      delCurrentLive() {
        liveItemsDel(this.currentLive.id).then(res => {
          this.form.name = ''
          this.form.cover_imgs = ''
          this.coverImgs = ''
          this.form.spu_ids = ''
          this.tableData = []
          this.currentDataGoods = []
          this.getLiveListFunc()
        })
      },
      imageUploadSuccess(res) {
        this.form.image = res.md5
        console.log(res)
      },
      saveAdFunc() {
        this.form.cover_imgs = JSON.stringify([this.coverImgs])
        // console.log('this.form', this.form)
        if (this.form.name === '') {
          this.$message.error(this.$t('operation.enterLiveName'))
          return
        }
        if (this.coverImgs === '') {
          this.$message.error(this.$t('operation.pleaseUploadCover'))
          return
        }
        this.submitDisabled = true
        this.form.recommend_spu_id = this.tuiJianId
        console.log('tu', this.form)
        if (this.type === 'edit') {
          liveItemsModify(this.currentLive.id, this.form).then(res => {
            this.getLiveListFunc()
            this.$message.success(this.$t('operation.saveSuccess'))
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else if (this.type === 'add') {
          liveItemsAdd(this.form).then(res => {
            this.getLiveListFunc()
            this.$message.success(this.$t('operation.saveSuccess'))
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
        this.isShowStart = true
      },
      getLiveListFunc() {
        liveItemsList(this.searchForm).then(res => {
          this.currentLive = res.items[0] ? JSON.parse(JSON.stringify(res.items[0])) : {}
          this.form.name = res.items[0] ? res.items[0].name : ''
          this.coverImgs = res.items[0] ? res.items[0].cover_imgs[0] : ''
          this.form.spu_ids = res.items[0] ? JSON.stringify(res.items[0].spu_ids) : ''
          // this.currentLive.status = 2
          // console.log('this.currentLive', this.currentLive.spu_ids)
          if (res.items[0]) {
            this.tuiJianId = res.items[0].recommend_spu_id
            this.type = 'edit'
            if (res.items[0].status === 2) {
              this.modifyDisabled = true
              this.isShowStart = false
              this.pushUrlShow = true // 直播中就显示推流地址
              this.pushurl = res.items[0].channel_info.pushurl
            } else if (res.items[0].status === 1) {
              this.modifyDisabled = false
              this.isShowStart = true // 还没直播的时候显示可以开播的按钮
            }
            this.getLiveGoodsList()
          } else {
            this.tuiJianId = ''
            this.type = 'add'
          }
        })
      },
      getLiveGoodsList() {
        spusList({ 'spu_ids': JSON.stringify(this.currentLive.spu_ids) }).then(res => {
          // res.items && res.items.forEach((item, k) => {
          //   item['code'] = k + 1
          // })
          console.log('res', res.items)
          const array = []
          this.currentLive.spu_ids && this.currentLive.spu_ids.forEach((v, k) => {
            res.items.forEach(z => {
              if (v === z.id) {
                z['code'] = k + 1
                if (z.id === this.currentLive.recommend_spu_id) {
                  z['recommend'] = true
                } else {
                  z['recommend'] = false
                }
                if (z.id === this.currentLive.explain_spu_id) {
                  z['explain'] = true
                } else {
                  z['explain'] = false
                }
                array.push(z)
              }
            })
          })
          // console.log('array', array)
          // console.log('this.currentLive.spu_ids', this.currentLive.spu_ids)
          this.tableData = JSON.parse(JSON.stringify(array))
          this.currentDataGoods = JSON.parse(JSON.stringify(array))
        })
      }
    },
    mounted() {
      this.getCouponList()
    },
    created() {
      this.getLiveListFunc()
      this.getHistoryList()
    }
  }
</script>

<style lang="scss" scoped>
.liveBigBoxCurrent {
  /deep/ {
    .el-form-item {
      margin-bottom: 0!important;
    }
  }
}
  .liveVideo {
    /deep/
    .my-video-dimensions.vjs-fluid {
      padding-top: 0;
    }
  }
  .liveBox {
    position: relative;
    height: calc(100vh - 236px);
  }
  .optBtnStyle {
    position: absolute;
    bottom: -47px;
  }
  .historyBox {
    /deep/
    .el-table__body-wrapper {
      overflow-y: auto;
    }
  }
</style>
