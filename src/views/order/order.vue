<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24">
            <el-tabs v-if="showTab" style="height: 40px" v-model="tab_order_status">
              <el-tab-pane style="height: 44px" v-for="(item, k) in orderStatusTab" :key="k" v-if="item" :label="item.label" :name="item.value"></el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span ="24">
            <el-form :inline="true" :model="searchForm">
            <el-form-item :label="$t('order.searchKey')">
              <el-input v-model="searchForm.key" :placeholder="$t('order.searchKeyTip')" style="width: 250px" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('order.no')">
              <el-input v-model="searchForm.no" style="width: 250px" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('order.orderTime')">
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
            <el-form-item>
              <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
              <template v-if="permissionCheck('opt')">
                <el-button type="primary" @click="exportFunc([], false)" size="small" icon="el-icon-download"></el-button>
                <el-upload style="display: inline-block" name="excel" :headers="fileUploadHeader"
                           :action= "importUrl"
                           :show-file-list="false"
                           :on-success="importSuccess" :on-error="importError">
                  <el-button type="primary" size="small" icon="el-icon-upload2"></el-button>
                </el-upload>
              </template>
            </el-form-item>
          </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 225px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)" @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="45">
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
                      <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(gInfo.goods_info.sku_img, 100)"  fit="cover"></el-image>
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
                <!-- 操作 -->
                <el-table-column :label="$t('tools.opt')" width="150" fixed="right"  v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <span v-if="(scope.row.status === 4 || scope.row.status === 5) && scope.row.post_way !== 2">
                      <el-button type="text" v-if="scope.row.status === 4" @click="showExpressEditor(scope.row,5)" size="small">
                      {{$t('order.modifyExpress')}}
                      </el-button>
                      <el-button v-else type="text" @click="showExpressEditor(scope.row,1)" size="small">
                      {{$t('order.express')}}
                      </el-button>
                    </span>
                    <el-button v-if="scope.row.status === 5 && scope.row.pay_way_top === 2 && scope.row.post_way === 2" type="text" @click="orderConfirmFunc(scope.row.id)" size="small">
                      {{$t('order.confirmTransaction')}}
                    </el-button>
                    <el-button v-if="scope.row.status === 4 && scope.row.pay_way_top === 2" type="text" @click="orderConfirmFunc(scope.row.id)" size="small">
                      {{$t('order.confirmTransaction')}}
                    </el-button>
                    <el-button v-if="scope.row.status === 2" type="text" @click="showExpressEditor(scope.row,2)" size="small">
                      {{$t('order.modifyPrice')}}
                    </el-button>
                    <el-button v-if="scope.row.status === 2 || scope.row.status === 5"  type="text" @click="showExpressEditor(scope.row,3)" size="small" style="margin-left: 0">
                      {{$t('order.changeAddress')}}
                    </el-button>
                    <el-button v-if="scope.row.status !== 7 && scope.row.status !== 17"  type="text" @click="showExpressEditor(scope.row,4)" size="small" style="margin-left: 0">
                      {{$t('order.price4Note')}}
                    </el-button>
                     <el-button type="text" @click="deliveryMsg(scope.row)" size="small" style="margin-left: 0">
                      {{$t('order.Delivery')}}
                    </el-button>
                    <el-button v-if="scope.row.status === 17"  type="text" @click="ordeShengheState(scope.row)" size="small" style="margin-left: 0">
                      {{$t('order.purchaseOrderReview')}}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="margin-top: 10px">
                <el-col :span="6">
                  <!-- 导出按钮 -->
                  <el-button  v-if="permissionCheck('opt')" size="mini" @click="batchExportFunc">{{$t('tools.export')}}</el-button>
                  <!-- 导出明细按钮 -->
                  <el-button size="mini" @click="batchDetailExportFunc">{{$t('tools.exportDetails')}}</el-button>
                <span class="allprice">{{$t('order.Totalprice')}} : <span>{{allprice | price}}</span></span>
                </el-col>
                <el-col :span="18" style="text-align: right;">
                  <el-pagination v-if="itemCount > 0"
                    :current-page.sync="currentPage"
                    :page-size.sync="pageSize"
                    :page-sizes="[10, 30, 50, 100, 500]"
                    layout="total, prev, pager, next, jumper,sizes"
                    :total="itemCount">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 修改信息模态框 -->
        <el-dialog :title="dialogTitle" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px">
            <el-form-item :label="$t('order.no')">
              {{expressOrder.no}}
            </el-form-item>
            <el-form-item :label="$t('order.user')">
              {{expressOrder.user_nick_name}}&nbsp;{{expressOrder.user_mobile}}
            </el-form-item>
            <el-form-item :label="$t('order.goods')"  v-if="expressOrder.merchant_item">
              <div><el-checkbox v-model="allGoodsSend" v-if="optType === 1">{{$t('order.allGoods')}}</el-checkbox></div>
              <div class="goods-item" v-for="(gInfo,k) in expressOrder.merchant_item.goods_items" :key="k">
                <div class="chooseCheck" v-if="!allGoodsSend && gInfo.isHaveGoods">
                  <el-checkbox v-model="gInfo.chooseGoods" :key="k"></el-checkbox>
                </div>
                <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(gInfo.goods_info.sku_img, 100)" fit="cover"></el-image>
                <div class="g-info">
                  <p>{{gInfo.goods_info.spu_name}}<el-tag v-if="gInfo.goods_info.gift" size="mini">{{$t('order.gift')}}</el-tag></p>
                  <p>
                    <span v-for="(v,k) in gInfo.goods_info.specifications" :key="k"> {{k}}：<font>{{v}}</font></span>
                  </p>
                  <p><span>{{$t('order.price3')}}：</span>{{gInfo.goods_info.price | price}}；<span>{{$t('order.number')}}：</span>{{gInfo.goods_info.count}}</p>
                </div>
                <div class="clear"></div>
              </div>
            </el-form-item>
            <el-form-item :label="$t('order.price')">
              {{expressOrder.pay_price | price}}（{{$t('order.price1') + '：' }}{{expressOrder.goods_price | price}}；{{$t('order.price2') + '：'}}{{expressOrder.postage | price}}）
            </el-form-item>
            <el-form-item :label="$t('order.address')">
              {{expressOrder.shipping_address.address.province + expressOrder.shipping_address.address.city + expressOrder.shipping_address.address.district}}&nbsp;{{expressOrder.shipping_address.address.addr}}
              <br/>
              {{expressOrder.shipping_address.contacter_name}}&nbsp;&nbsp;{{expressOrder.shipping_address.mobile}}
            </el-form-item>
            <el-form-item :label="$t('order.deliveryMethod')">
              {{deliveryMethod[expressOrder.post_way - 1]}}<span v-if="expressOrder.post_way === 2">({{expressOrder.check_code}})</span>
            </el-form-item>
            <el-form-item :label="$t('order.payMethod')">
              {{payMethod[expressOrder.pay_way_top - 1]}}
            </el-form-item>
            <el-form-item :label="$t('order.deliveryRecord')">
              <el-button type="primary" size="mini" @click="lookSendGoodsRecord" v-if="optType !== 5 && optType !== 4">{{$t('order.lookDeliveryRecord')}}</el-button>
              <el-button type="primary" size="mini" @click="lookSendGoodsRecord" v-else>{{$t('order.modifyWuLiuInfo')}}</el-button>
            </el-form-item>
            <el-form-item :label="$t('order.userBz')">
              {{userComment}}
            </el-form-item>
            <el-form-item :label="$t('order.businessBz')" v-if="expressOrder.merchant_comments && expressOrder.merchant_comments.length > 0">
              <el-timeline style="margin-top: 10px">
                <el-timeline-item
                  v-for="(comments, index) in expressOrder.merchant_comments"
                  :key="index"
                  :timestamp="comments.gen_time">
                  <div class="ui"><span>{{comments.operator_name}}</span>{{comments.comment}}</div>
                </el-timeline-item>
              </el-timeline>
            </el-form-item>
            <template v-if="optType === 1">
              <el-form-item :label="$t('order.note')" >
                <el-input  type="textarea"  :rows="2"  v-model="comment" clearable :placeholder="$t('order.note')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('order.expressInfo')" >
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-select v-model="expressCompany" :disabled="expressOrder.rider_post" :placeholder="$t('order.expressCompany')">
                      <el-option
                        v-for="(item, k) in expressageList"
                        :key="k"
                        v-if="k !== 'rider' || (k === 'rider' && expressOrder.rider_post) "
                        :label="item"
                        :value="k">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="14" v-if="expressCompany !== 'noexpress' && !expressOrder.rider_post">
                    <el-input v-model="expressNo" clearable :placeholder="$t('order.expressNo')"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="$t('warehouse.ware')">
                 <el-select v-model="wareid" :disabled="expressOrder.rider_post" :placeholder="$t('warehouse.name')">
                      <el-option
                        v-for="(item, k) in wareData2"
                        :key="k"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
              </el-form-item>
<!--              <el-form-item :label="$t('order.note')" >-->
<!--                <el-input  type="textarea"  :rows="2"  v-model="comment" clearable :placeholder="$t('order.note')"></el-input>-->
<!--              </el-form-item>-->
            </template>
            <template v-if="optType === 2">
              <el-form-item :label="$t('order.price4')" >
                <price-input v-model="payPrice" :placeholder="$t('order.price4')" style="width: 200px"></price-input> <span style="color: #8c939d">{{$t('order.price4Tip')}}</span>
              </el-form-item>
<!--              <el-form-item :label="$t('order.price4Note')" >-->
<!--                <el-input  type="textarea"  :rows="2"  v-model="comment" clearable :placeholder="$t('order.price4Note')"></el-input>-->
<!--              </el-form-item>-->
            </template>
            <template v-if="optType === 3">
              <p>{{$t('order.userChangeAdd')}}</p>
<!--              <div style="display: flex">-->
              <el-form-item :label="$t('order.provinceCityArea')" class="addressChooseBox">
                <el-cascader
                  v-model="addressArray"
                  :options="optionsAddress"
                  :props="typeProp"
                  @change="handleChange"></el-cascader>
              </el-form-item>
                <!--<el-form-item :label="$t('order.province')" style="display: inline-block" >-->
                  <!--<el-input v-model="province" :placeholder="$t('order.province')" style="width: 200px"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item :label="$t('order.city')"  style="display: inline-block">-->
                  <!--<el-input v-model="city" :placeholder="$t('order.city')" style="width: 200px"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item :label="$t('order.area')" style="display: inline-block">-->
                  <!--<el-input v-model="area" :placeholder="$t('order.area')" style="width: 200px"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item :label="$t('order.addr')" style="display: inline-block" >
                  <el-input v-model="addr" :placeholder="$t('order.addr')" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item :label="$t('order.userName')" style="display: inline-block" >
                  <el-input v-model="userName" :placeholder="$t('order.userName')" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item :label="$t('order.userPhone')" style="display: inline-block" >
                  <el-input v-model="userPhone" :placeholder="$t('order.userPhone')" style="width: 200px"></el-input>
                </el-form-item>
                
<!--              </div>-->
            </template>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFunc()" v-if="optType !== 5 && optType !== 4" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
            <el-button type="primary" v-else size="small" @click="formEditDialog = false"> {{$t('tools.close')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="$t('order.purchaseOrderReview')" width="500px" @close="shengheShow = false" :visible.sync="shengheShow" :close-on-click-modal="false" center >
          <el-form label-width="100px">
            <el-form-item :label="$t('order.isCancelOrder')">
              <el-switch
                v-model="shengheForm.cancel"
                :active-text="$t('order.yes')"
                :inactive-text="$t('order.No')">
              </el-switch>
            </el-form-item>
            <el-form-item :label="$t('order.goodsPaidPrice')">
              <price-input v-model="shengheForm.pay_price"></price-input>
            </el-form-item>
            <el-form-item :label="$t('order.postage')">
              <price-input v-model="shengheForm.postage"></price-input>
            </el-form-item>
            <el-form-item :label="$t('order.note')" >
              <el-input  type="textarea"  :rows="2"  v-model="shengheForm.comment" clearable :placeholder="$t('order.note')"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveShenhe()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
        <el-dialog :title="$t('order.deliveryRecord')" width="1200px" append-to-body @close="sendGoodsRecord = false" :visible.sync="sendGoodsRecord" :close-on-click-modal="false" center >
          <el-table stripe border :data="expressOrder.expresses" height="calc(100vh - 320px)">
            <el-table-column :label="$t('order.goods')" min-width="400">
              <template  slot-scope="scope">
                <div @click="jumpGoodsPage(gInfo, scope.row.type)" class="goods-item" v-for="(gInfo,k) in scope.row.sku_infos" :key="k">
                  <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(gInfo.sku_img, 100)"  fit="cover"></el-image>
                  <div class="g-info">
                    <p style="display: flex;align-items: center">{{gInfo.spu_name}}
                      <img :src="otherLogo(gInfo.site_id)" class="otherShopLogo" alt="" v-if="gInfo.site_id">
                    </p>
                  </div>
                  <div class="clear"></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('order.expressCompany')" width="130">
              <template slot-scope="scope" >
                {{expressageList[scope.row.company]}}
              </template>
            </el-table-column>
            <el-table-column :label="$t('order.expressNo')" width="130">
              <template slot-scope="scope" >
                {{scope.row.novar}}
              </template>
            </el-table-column>
            <el-table-column :label="$t('order.wuLiuRecord')" width="130">
              <template slot-scope="scope" >
                <el-popover placement="left" width="300" trigger="click">
                  <el-timeline style="margin-top: 10px">
                    <el-timeline-item
                      v-for="(record, index) in scope.row.trans_records"
                      :key="index"
                      :timestamp="record.time">
                      <div class="ui">
                        <span>{{record.operator_name}}</span>
                      </div>
                      <div class="ui">
                        <span>{{record.comment}}</span>
                      </div>
                    </el-timeline-item>
                  </el-timeline>
                  <a slot="reference" class="gt" v-if="scope.row.trans_records.length > 0"><i class="el-icon-arrow-left"></i>{{$t('order.wuLiuRecord')}}</a>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column :label="$t('order.deliveryTime')" prop="time" width="180">
            </el-table-column>
            <el-table-column :label="$t('tools.opt')" width="150" fixed="right" v-if="permissionCheck('opt') && (optType === 5 || optType === 4)">
              <template slot-scope="scope">
                  <el-button slot="reference" v-if="optType === 5" @click="modifyCurrentExpress(scope.row, 'wuliu')" type="text" size="small">
                    {{$t('order.modifyExpress')}}
                  </el-button>
                  <el-button slot="reference" type="text" @click="modifyCurrentExpress(scope.row, 'note')" size="small">
                    {{$t('order.price4Note')}}
                  </el-button>
                <el-button slot="reference" type="text" @click="addWuLiuBtn(scope.row)" size="small">
                  {{$t('order.addWuLiuRecord')}}
                </el-button>
                <!--</el-popover>-->
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="sendGoodsRecord = false">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog
          width="30%"
          :title="$t('order.modifyExpress')"
          :visible.sync="innerVisible"
          append-to-body>
          <el-form label-width="100px">
            <el-form-item :label="$t('order.expressCompany')" v-if="optType === 5 && openNoteState === 'wuliu'">
              <el-select v-model="modifyExpressCompany" :disabled="expressOrder.rider_post" :placeholder="$t('order.expressCompany')">
                <el-option
                  v-for="(item, k) in expressageList"
                  :key="k"
                  v-if="k !== 'rider' || (k === 'rider' && expressOrder.rider_post)"
                  :label="item"
                  :value="k">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('order.expressNo')"  v-if="optType === 5 && modifyExpressCompany !== 'noexpress' && !expressOrder.rider_post && openNoteState === 'wuliu'">
              <el-input v-model="modifyExpressNo" clearable :placeholder="$t('order.expressNo')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('order.note')" v-if="optType === 4 || openNoteState === 'note'">
              <el-input type="textarea" :rows="2"  v-model="commentModify" clearable :placeholder="$t('order.note')"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="confirmModifyExpress">{{$t('tools.confirm')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog
          width="30%"
          :title="$t('order.addWuLiuRecord')"
          :visible.sync="addWuLiuShow"
          append-to-body>
          <el-form label-width="100px">
            <el-form-item :label="$t('order.DateTime')">
              <el-date-picker
                v-model="addWuLiuRecordForm.record_t"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                type="datetime"
                :placeholder="$t('order.pleaseChooseTime')">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('order.note')">
              <el-input type="textarea" :rows="2"  v-model="addWuLiuRecordForm.comment" clearable :placeholder="$t('order.note')"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="confirmAddWuliuJiLu">{{$t('tools.confirm')}}</el-button>
          </div>
        </el-dialog>
        <!-- 出库信息 -->
        <el-dialog
          width="50%"
          :title="$t('order.Delivery')"
          :visible.sync="DeliveryMsgDialog"
          append-to-body>
           <div v-if="warehousedata">
             <div v-for="(item,key) in this.warehousedata" :key="key">
               <div class="wtitle">{{$t('warehouse.name')}} : {{item.warehouse_name}}</div>
               <div class="num">{{$t('order.Relatedorders')}} : <span @click="idsearch(item.relation_order_id)">{{item.relation_order_id}}</span></div>
                <div class="witems" v-for="(val,i) in item.skus" :key="i">
                  <div>{{$t('warehouse.name2')}} : {{val.name}}</div>
                  <div>{{$t('warehouse.SpecificationsMsg')}} : {{val.specification}}</div>
                  <div>{{$t('warehouse.num')}} : {{val.count}}</div>
                  <div>{{$t('warehouse.barCode')}} : {{val.barcode}}</div>
                </div>
             </div>
           </div>
           <div v-if="warehousedata == ''" class="msg">{{$t('order.Msg')}}</div>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="DeliveryMsgDialog = false">{{$t('tools.confirm')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { ordersList, ordersCount, ordersExpress, ordersPriceModify, exportOrder, changeMerchantComment, changeShippingAddress, getExpressInfo, orderConfirm, orderPurchaseCheck, orderTransRecords } from '@/api/order'
  import { warehouseOutbounds, warehousesList } from '@/api/warehouse'
  import expressage from '@/utils/expressage'
  import serverConfig from '@/utils/serverConfig'
  import areaInfo from '@/utils/areaInfo'
  import store from '@/store'
  export default {
    components: {
    },
    data() {
      const pz = 10
      return {
        searchParamKey: 'orderList',
        doWatch: true,
        showTab: false,
        optArr: { 2: this.$t('order.opt2'), 4: this.$t('order.opt4'), 5: this.$t('order.opt5'), 6: this.$t('order.opt6'), 7: this.$t('order.opt7'), 8: this.$t('order.opt8'), 9: this.$t('order.opt9') },
        orderStatus: [this.$t('tools.all'), this.$t('order.status1'), this.$t('order.status2'), this.$t('order.status3'), this.$t('order.status4'), this.$t('order.status5'),
          this.$t('order.status6'), this.$t('order.status7'), this.$t('order.status8'), '', this.$t('order.status10')],
        orderStatusTab: [{ value: '0', label: this.$t('tools.all') }, { value: '17', label: this.$t('order.status1') }, { value: '2', label: this.$t('order.status2') }, { value: '5', label: this.$t('order.status5') }, { value: '4', label: this.$t('order.status4') }, { value: '8', label: this.$t('order.status8') },
          { value: '10', label: this.$t('order.status10') }, { value: '7', label: this.$t('order.status7') }],
        orderStatusTabList: [{ value: '0', label: this.$t('tools.all') }, { value: '17', label: this.$t('order.status1') }, { value: '2', label: this.$t('order.status2') }, { value: '5', label: this.$t('order.status5') }, { value: '4', label: this.$t('order.status4') }, { value: '8', label: this.$t('order.status8') },
          { value: '10', label: this.$t('order.status10') }, { value: '7', label: this.$t('order.status7') }],
        searchForm: {
          key: '',
          user_id: '',
          order_status: 0,
          no: '',
          skip: 0,
          limit: pz,
          bt: '',
          et: '',
          invoice: true
        },
        allprice: 0,
        tab_order_status: '0',
        orderTimes: [],
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        expressCompany: '',
        expressNo: '',
        modifyExpressCompany: '',
        modifyExpressNo: '',
        commentModify: '',
        editorTitle: '',
        wareid: '',
        wareForm: {
        skip: '',
        limit: pz
        },
        wareData2:[],
        optType: 1,
        dialogTitle: this.$t('order.express'),
        expressOrder: { shipping_address: { address: {}}},
        formEditDialog: false,
        submitDisabled: false,
        DeliveryMsgDialog: false,
        expressageList: expressage,
        payPrice: 0,
        comment: '',
        importUrl: serverConfig.api_url + '/app/v1/merchant/orders-import',
        fileUploadHeader: { 'X-Access-Token': store.state.user.token },
        multipleSelection: [],
        userComment: '',
        province: '',
        city: '',
        area: '',
        addr: '',
        area_code: '',
        userName: '',
        userPhone: '',
        expressInfo: [],
        pageX: '',
        pageY: '',
        showOrderStatus: false,
        expressRiderInfo: [],
        addressArray: [],
        optionsAddress: [],
        warehousedata: '',
        Waredata : [],
        typeProp: { value: 'name', label: 'name', children: 'children' },
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
        deliveryMethod: [this.$t('order.expressDelivery'), this.$t('order.selfMention'), this.$t('order.rider')],
        payMethod: [this.$t('order.onlinePay'), this.$t('order.cashOnDelivery')],
        shengheShow: false,
        shengheForm: {
          cancel: false, // 是否取消订单true
          pay_price: 0, // 商品需要实际支付总价
          postage: 0, // 邮费
          comment: '' // 备注
        },
        purchaseCheckId: '',
        sku_ids: [],
        sku_specifications:[],
        allGoodsSend: true,
        sendGoodsRecord: false,
        visibleExpress: false,
        express_id: '',
        skuIds: [],
        innerVisible: false,
        openNoteState: '',
        addWuLiuRecordForm: {
          express_id: '',
          record_t: '',
          comment: ''
        },
        addWuLiuShow: false
      }
    },
    computed: {
      ...mapGetters([
        'userInfo', 'searchParam'
      ]),
    },
    watch: {
      tab_order_status(val) {
        if (!this.doWatch) {
          return
        }
        if (this.searchForm.skip !== 0 || this.searchForm.order_status !== parseInt(val)) {
          // console.log(this.searchForm, 'gg', val)
          // console.log(this.searchForm.skip, this.searchForm.skip !== 0, 'gg', this.searchForm.order_status !== parseInt(val))
          this.searchForm.skip = 0
          this.searchForm.limit = this.pageSize
          this.currentPage = 1
          this.searchForm.order_status = parseInt(val)
          this.getDataListFun()
          // console.log(111)
        }
      },
      currentPage(val) {
        if (!this.doWatch) {
          return
        }
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
        console.log(2222, val)
      },
      pageSize(val) {
        this.searchForm.skip = 0
        this.searchForm.limit = val
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
      }
    },
    methods: {
      confirmAddWuliuJiLu() {
        // console.log('form', this.addWuLiuRecordForm)
        orderTransRecords(this.expressOrder.id, this.addWuLiuRecordForm).then(res => {
          this.addWuLiuShow = false
          this.formEditDialog = false
          this.sendGoodsRecord = false
          this.getDataListFun()
        })
      },
      addWuLiuBtn(data) {
        this.addWuLiuShow = true
        this.addWuLiuRecordForm.express_id = data.id
        this.addWuLiuRecordForm.record_t = ''
        this.addWuLiuRecordForm.comment = ''
      },
      // 修改备注
      modifyCurrentExpress(data, text) {
        // console.log(data);
        // console.log(text);
        this.innerVisible = true
        this.openNoteState = text
        this.modifyExpressCompany = data.company
        this.modifyExpressNo = data.novar
        this.commentModify = data.comment
        this.express_id = data.id
        this.skuIds = JSON.stringify(data.sku_ids)
      },
      confirmModifyExpress() { // 修改快递信息确认按钮
        ordersExpress(this.expressOrder.id, { express_id: this.express_id, express_company: this.modifyExpressCompany, express_no: this.modifyExpressNo, comment: this.commentModify, sku_ids: this.skuIds }).then(res => {
          this.$message.success(this.$t('order.courierInfoModifySuccess'))
          this.getDataListFun()
          this.getOrderCount()
          this.innerVisible = false
          this.formEditDialog = false
          this.sendGoodsRecord = false
        }).catch(() => {
        })
      },
      // 查看发货记录
      lookSendGoodsRecord() {
        this.sendGoodsRecord = true
      },
      saveShenhe() {
        orderPurchaseCheck(this.purchaseCheckId, this.shengheForm).then(res => {
          this.getDataListFun()
          this.shengheShow = false
        })
        // console.log('dform', this.shengheForm)
      },
      ordeShengheState(data) {
        this.purchaseCheckId = data.id
        this.shengheShow = true
        this.shengheForm.cancel = false
        this.shengheForm.pay_price = data.pay_price
        this.shengheForm.postage = 0
        this.shengheForm.comment = ''
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
      jumpGoodsPage(data, type) {
        if (type !== undefined) {
          // console.log(data);
          if (type === 5) { // 代购订单
            // console.log('data.sku_url', data.sku_url)
            if(data.sku_url == ''){
              window.open('https://www.a9kh.com/goods/' + data.spu_id + '.html')
            }else{
               window.open(data.sku_url)
            }
          } else{
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
      // 确认交易
      orderConfirmFunc(id) {
        orderConfirm(id).then(res => {
          this.$message.success(this.$t('order.confirmTransactionSuccess'))
          this.getDataListFun()
          this.getOrderCount()
        })
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
      handleChange(val) {
        console.log('val', val)
      },
      getOrderCount() {
        const statuses = [0, 17, 2, 4, 5, 7, 8, 10]
        this.orderStatusTab = JSON.parse(JSON.stringify(this.orderStatusTabList))
        ordersCount({ 'statuses': JSON.stringify(statuses) }).then(res => {
          if (res.meta === 0) {
            console.log(res);
            res.items.forEach(item => {
              this.orderStatusTab.forEach((Z, k) => {
                if (Z.value === item.order_status.toString()) {
                  this.orderStatusTab[k].label = this.orderStatusTab[k].label + '(' + item.order_count + ')'
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
      clickStatus(data) {
        const info = {
          no: data.express.novar,
          company: data.express.company
        }
        if (data.express.company === 'zto') {
          getExpressInfo(info).then(res => {
            this.showOrderStatus = false
            this.expressInfo = res.items
          })
        }
        if (data.express.company === 'rider') {
          this.showOrderStatus = true
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = []
        val.forEach(item => {
          this.multipleSelection.push(item.id)
        })
      },
      // 售后
      showReturn(row, gInfo) {
        console.log(gInfo);
        if (gInfo.after_sale_type === 1 || gInfo.after_sale_type === 3) {
          this.$router.push({ name: 'orderReturn', params: { order_no: row.no }})
        } else if (gInfo.after_sale_type === 2) {
          this.$router.push({ name: 'orderExchange', params: { order_no: row.no }})
        }
      },
      importSuccess(res) {
        this.$message.success(res.error)
        this.getDataListFun()
      },
      importError(res) {
        this.$message.error(res.error)
      },
      // 导出按钮
      batchExportFunc() {
        if (this.multipleSelection.length < 1) {
          this.$message.error(this.$t('order.batchExportTip'))
          return
        }
        this.exportFunc(this.multipleSelection, false)
      },
      // 导出明细按钮
      batchDetailExportFunc(){
        if(this.multipleSelection.length > 20){
           this.$message.error(this.$t('order.batchDetailExportFunc'))
        }else if(this.multipleSelection.length < 1){
           this.$message.error(this.$t('order.batchExportTip'))
        }
        else{
          this.exportFunc(this.multipleSelection, true)
        }
      },
      // 导出
      exportFunc(ids, invoice) {
        const sf = JSON.parse(JSON.stringify(this.searchForm))
        sf.skip = 0
        sf.limit = 20
        sf.invoice=invoice
        sf.ids = JSON.stringify(ids)
        exportOrder(sf).then(res => {
          window.location = res.url
        })
      },
      getKuaidi100Url(com, nu) {
        if (com === 'rider') {
          return 'javascript:void(0)'
        } else {
          return `https://www.kuaidi100.com/chaxun?com=${com}&nu=${nu}`
        }
      },
      // 操作
      showExpressEditor(data, ot) {
        // data为商品数据 ot为一个值根据传过来不同的值做不同的操作
        this.expressOrder = data
        this.optType = ot
        // console.log(data);
        // console.log(ot);
        if (ot === 1) {
          this.wareid = ''
          this.wareData2 = []
          warehousesList(this.wareForm).then(res=>{
            this.wareData2 = res.items
          })
          const sendId = []
          data.expresses && data.expresses.forEach(ex => {
            ex.sku_infos && ex.sku_infos.forEach(v => {
              sendId.push(v.oid)
            })
          })
          this.expressOrder.merchant_item.goods_items.forEach(goods => {
            // goods.chooseGoods = true
            if (sendId.indexOf(goods.goods_info.oid) === -1) {
              this.$set(goods, 'chooseGoods', false)
              this.$set(goods, 'isHaveGoods', true)
            } else {
              this.$set(goods, 'isHaveGoods', false)
            }
          })
          this.dialogTitle = this.$t('order.express')
          this.expressCompany = data.express.company ? data.express.company : (this.expressOrder.rider_post ? 'rider' : '')
          this.expressNo = data.express.novar
          this.comment = data.merchant_comment
          this.userComment = data.comment
        } else if (ot === 2) {
          this.dialogTitle = this.$t('order.modifyPrice')
          this.payPrice = data.pay_price
          this.comment = data.merchant_comment
          this.userComment = data.comment
        } else if (ot === 3) {
          this.dialogTitle = this.$t('order.changeAddress')
          this.userComment = data.comment
          this.comment = data.merchant_comment
          this.addressArray = []
          this.addressArray[0] = data.shipping_address.address.province
          this.addressArray[1] = data.shipping_address.address.city
          this.addressArray[2] = data.shipping_address.address.district
          this.addr = data.shipping_address.address.addr
          this.area_code = data.shipping_address.area_code
          this.userName = data.shipping_address.contacter_name
          this.userPhone = data.shipping_address.mobile
        } else if (ot === 4) {
          this.dialogTitle = this.$t('order.price4Note')
          this.userComment = data.comment
          this.comment = data.merchant_comment
        } else if (ot === 5) {
          this.dialogTitle = this.$t('order.modifyExpress')
          // this.expressCompany = data.express.company ? data.express.company : (this.expressOrder.rider_post ? 'rider' : '')
          // this.expressNo = data.express.novar
          // this.comment = data.merchant_comment
          // this.userComment = data.comment
        }
        this.formEditDialog = true
      },
      // 修改地址确定按钮
      saveDataFunc() {
        this.submitDisabled = true
        console.log(this.optType);
        if (this.optType === 1) {
          this.sku_ids = []
          this.sku_specifications = []
          this.expressOrder.merchant_item.goods_items.forEach(goods => {
            if (!this.allGoodsSend) {
              if (goods.chooseGoods && goods.isHaveGoods === true) {
                if (goods.goods_info.sku_url !== '') {
                  this.sku_ids.push(goods.goods_info.sku_url)
                  // 把规格组装进去
                  this.sku_specifications.push(JSON.stringify(goods.goods_info.specifications))
                } else {
                  // 空也要推进去，占位，避免长度和sku_ids不同
                  this.sku_specifications.push('') 
                  this.sku_ids.push(goods.goods_info.sku_id)
                }
              }
            }
          })
          if (this.allGoodsSend) {
            this.sku_ids = ''
            this.sku_specifications = ''
          } else {
            this.sku_ids = JSON.stringify(this.sku_ids)
            this.sku_specifications = JSON.stringify(this.sku_specifications) 
          }
          // console.log('sku_ids', this.sku_ids)
          ordersExpress(this.expressOrder.id, { express_company: this.expressCompany, express_no: this.expressNo, comment: this.comment, sku_ids: this.sku_ids,sku_specifications:this.sku_specifications, warehouse_id:this.wareid}).then(res => {
            this.$message.success(this.$t('order.expressTip'))
            this.submitDisabled = false
            this.allGoodsSend = true
            this.getDataListFun()
            this.getOrderCount()
            this.formEditDialog = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else if (this.optType === 2) {
          ordersPriceModify(this.expressOrder.id, { pay_price: this.payPrice, comment: this.comment }).then(res => {
            this.$message.success(this.$t('order.price4Tip1'))
            this.submitDisabled = false
            this.getDataListFun()
            this.getOrderCount()
            this.formEditDialog = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else if (this.optType === 3) {
          // 修改地址 确定
          const data = {
            province: this.addressArray[0],
            city: this.addressArray[1],
            district: this.addressArray[2],
            addr: this.addr,
            area_code: this.area_code,
            contacter_name: this.userName,
            mobile: this.userPhone,
            lng: this.expressOrder.shipping_address.lng,
            lat: this.expressOrder.shipping_address.lat
          }
          changeShippingAddress(this.expressOrder.id, data).then(res => {
            this.$message.success(this.$t('order.changeS'))
            this.submitDisabled = false
            this.getDataListFun()
            this.getOrderCount()
            this.formEditDialog = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else if (this.optType === 4) {
          changeMerchantComment(this.expressOrder.id, { merchant_comment: this.comment }).then(res => {
            this.$message.success(this.$t('order.changeS'))
            this.submitDisabled = false
            this.getDataListFun()
            this.getOrderCount()
            this.formEditDialog = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
      },
      // 订单列表
      getDataListFun() {
        // this.getOrderCount()
        this.$store.dispatch('SetSearchParam', { key: this.searchParamKey, value: this.searchForm })
        // console.log('SetSearchParam', this.$store.state.app.searchParam)
        ordersList(this.searchForm).then(res => {
          this.allprice = res.total_money
          this.doWatch = true
          this.tableData = res.items
          this.itemCount = res.total
          // console.log(this.tableData);
        })
      },
      search() {
        this.searchForm.skip = 0
        this.currentPage = 1
        this.getDataListFun()
        this.getOrderCount()
      },
      // 出库信息
      deliveryMsg(data){
        // data.id = ''
        warehouseOutbounds({order_id:data.id}).then(res=>{
          this.warehousedata = res.items
        
        })
        this.DeliveryMsgDialog = true
      },
      idsearch(data){
        this.DeliveryMsgDialog = false
        this.searchForm.no = data
        this. getDataListFun()
      }
    },
    mounted() {
      // console.log(this.$route)
      areaInfo.forEach(item => {
        const obj = {
          name: item.provinceInfo.name,
          children: []
        }
        item.provinceInfo.districtInfos.forEach(dis => {
          const disObj = {
            name: dis.name,
            children: []
          }
          dis.communes.forEach(city => {
            const cityObj = {
              name: city.name,
              children: null
            }
            disObj.children.push(cityObj)
          })
          obj.children.push(disObj)
        })
        this.optionsAddress.push(obj)
      })

      if (this.searchParam[this.searchParamKey]) {
        this.doWatch = false
        this.searchForm = this.searchParam[this.searchParamKey]
        this.currentPage = parseInt((this.searchForm.skip / this.pageSize) + 1)
        this.orderTimes = [this.searchForm.bt, this.searchForm.et]
      }
      if (this.$route.params.order_status) {
        if (this.$route.params.order_status !== this.searchForm.order_status) {
          this.searchForm.skip = 0
          this.currentPage = 1
          this.searchForm.order_status = this.$route.params.order_status
        }
      }
      this.tab_order_status = this.searchForm.order_status + ''
      if (this.$route.params.bt || this.$route.params.et) {
        this.orderTimes = [this.$route.params.bt, this.$route.params.et]
      }
      // console.log('optionsAddress', this.optionsAddress)
      // this.searchForm.order_status = this.$route.params.order_status ? this.$route.params.order_status : 0
      // this.tab_order_status = this.searchForm.order_status + ''
      const key = this.$route.query.k
      if (key !== undefined && key !== '' && key !== null) {
        this.searchForm.key = key
      }
      this.getDataListFun()
      this.getOrderCount()
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
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
  .wtitle{
    font-weight: bold;
    font-size: 18px;
    margin-top: 10px;
    margin-bottom: 5px;
  }
  .msg{
    text-align: center;
  }
  .witems{
    >div{
      font-size: 16px;
      margin-left: 20px;
      margin-bottom: 5px;
    }
  }
  .num{
    margin-bottom: 5px;
    >span{
      color: rgb(53, 123, 226);
      cursor: pointer;
    }
  }
</style>
