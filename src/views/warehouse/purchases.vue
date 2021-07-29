<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24">
            <el-tabs style="height: 40px" v-if="showTab" v-model="tab_status">
              <el-tab-pane style="height: 44px" v-for="(item, k) in statusTab" :key="k" v-if="item" :label="item.label" :name="item.value"></el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" style="padding: 0px 15px ">
            <el-form :inline="true" :model="searchForm">
              <el-form-item :label="$t('warehouse.supplier')">
                <el-select v-model="searchForm.supplier_id" filterable clearable :placeholder="$t('warehouse.choice')">
                  <el-option
                    v-for="item in supplierList"
                    :key="item.id"
                    :label="item.company_name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="searchForm.pay_status" :placeholder="$t('warehouse.pleaseChoose')">
                  <el-option
                    v-for="item in payStatusOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="searchForm.no" :placeholder="$t('warehouse.pleaseEnterNo')" clearable></el-input>
              </el-form-item>
              <el-form-item class="searchBtn">
                <el-button type="primary" @click="Searchlist" size="small" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6" style="display: flex;align-items: center;height: 48px;justify-content: flex-end;padding-right: 20px;" v-if="permissionCheck('opt')">
            <el-button type="primary" size="small" style="margin-right: 20px" @click="exportExcel">{{$t('warehouse.exportData3')}}</el-button>
            <div style="display: flex;align-items: center;justify-content: flex-end;" @click="addData"  v-if="permissionCheck('opt')">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 226px)">
              <el-table stripe border :data="tableData" @selection-change="exportChangeChoose" height="calc(100% - 40px)">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="#" width="60px" fixed = "left">
                  <template slot-scope="scope">
                    {{scope.$index + searchForm.skip + 1}}
                  </template>
                </el-table-column>
                <el-table-column prop="no" :label="$t('warehouse.Singlenumber')" width="120" fixed = "left"></el-table-column>
                <el-table-column :label="$t('warehouse.type2')" width="100">
                  <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status === 1 || scope.row.status === 0">{{$t('warehouse.pendFinancialApproval')}}</el-tag>
                    <el-tag type="info" v-if="scope.row.status === 2">{{$t('warehouse.leaderBeApproved')}}</el-tag>
                    <el-tag type="warning" v-if="scope.row.status === 3">{{$t('warehouse.tobeStored')}}</el-tag>
                    <el-tag v-if="scope.row.status === 4">{{$t('warehouse.compleateStorage')}}</el-tag>
                    <el-tag type="danger" v-if="scope.row.status === 100">{{$t('tools.cancel')}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column width="800">
                  <template slot="header" slot-scope="scope">
                    <el-row style="width: 100%">
                      <el-col :span="8">{{$t('warehouse.name2')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.PlaceofOrigin')}}</el-col>
                      <el-col :span="3" style="text-align: center">{{$t('warehouse.pecifications')}}</el-col>
                      <el-col :span="3" style="text-align: center">{{$t('warehouse.barCode')}}</el-col>
                      <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{$t('warehouse.price')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.num')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.arrive_count')}}</el-col>
                      <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{$t('warehouse.allprice')}}</el-col>
                    </el-row>
                  </template>
                  <template slot-scope="scope">
                    <div class="goods">
                      <el-row v-for="(item, k) in scope.row.skus" :key="k" class="odd" style="width: 100%">
                        <el-col :span="8" class="overOmitted"><span :title="item.name">{{item.name}}</span></el-col>
                        <el-col :span="2" style="text-align: center;min-width: 20px">{{item.origin !== '' ? item.origin : 'No' }}</el-col>
                        <el-col :span="3" class="overOmitted"  style="text-align: center">{{textFilter(item.specification) !== '' ? textFilter(item.specification) : 'No' }}</el-col>
                        <el-col :span="3" style="text-align: center">{{item.barcode !== '' ? item.barcode : 'No'}}</el-col>
                        <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{item.unit_price | price}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.count}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.arrive_count}}</el-col>
                        <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{item.total_price | price}}</el-col>
                      </el-row>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.Approvalrecord')" width="100">
                  <template slot-scope="scope">
                    <el-popover placement="left" width="300" trigger="click">
                        <el-timeline style="margin-top: 10px">
                          <el-timeline-item
                            v-for="(record, index) in scope.row.opts"
                            :key="index"
                            :timestamp="record.gen_time">
                            <div class="ui">
                              <div>
                                <span>{{record.user_name}}</span>
                                <span v-if="record.status === 1">{{$t('warehouse.create')}}</span>
                                <span v-if="record.status === 2">{{$t('global.financialApproval')}}</span>
                                <span v-if="record.status === 3">{{$t('global.leadershipApproval')}}</span>
                                <span v-if="record.status === 4">{{$t('warehouse.Completereceipt')}}</span>
                                <span v-if="record.status === 100">{{$t('tools.cancel')}}</span>
                              </div>
                              <div>
                                {{record.comment}}
                              </div>
                            </div>
                          </el-timeline-item>
                        </el-timeline>
                      <el-button type="text" slot="reference">
                        {{$t('warehouse.Approvalrecord')}}
                        <i class="el-icon-arrow-right"></i>
                      </el-button>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="supplier_name" :label="$t('warehouse.supplier')" width="150"></el-table-column>
                <el-table-column prop="currency" v-if="permissionCheck('opt', '9_3')" :label="$t('warehouse.Currency')" width="85"></el-table-column>
                <el-table-column prop="payment_term" v-if="permissionCheck('opt', '9_3')" :label="$t('warehouse.payment_term')" width="100"></el-table-column>
                <el-table-column prop="delivery_method" :label="$t('warehouse.delivery_method')" width="100"></el-table-column>
                <el-table-column :label="$t('warehouse.payment')" v-if="permissionCheck('opt', '9_3')" width="120">
                  <template  slot-scope="scope">
                    {{scope.row.paid_complete ? $t('warehouse.yes') : $t('warehouse.no')}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.PaymentAmount')" v-if="permissionCheck('opt', '9_3')" width="100">
                  <template  slot-scope="scope">
                    {{scope.row.paid_money | price}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.Pallprice')" v-if="permissionCheck('opt', '9_3')" width="100">
                  <template  slot-scope="scope">
                    {{scope.row.money | price}}
                  </template>
                </el-table-column>
                <el-table-column prop="estimate_remain_days" :label="$t('warehouse.estimate_remain_days')" width="85"></el-table-column>
                <el-table-column prop="estimate_arrival_time" :label="$t('warehouse.estimate_arrival_time')" width="160"></el-table-column>
                <el-table-column prop="gen_time" :label="$t('warehouse.OrderTime')" width="160"></el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "160" v-if="permissionCheck('opt', '8_3') || permissionCheck('opt', '8_1') || permissionCheck('opt', '9_1') || permissionCheck('opt', '9_2')" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showDataEditor(scope.row, true)" v-if="permissionCheck('opt', '8_3') && scope.row.status === 100 " size="small">{{$t('warehouse.repurchase')}}</el-button>
                    <!--<el-button type="text" @click="showDataEditor(scope.row, false)" v-if="permissionCheck('opt', '8_3') && (scope.row.status === 1 || scope.row.status === 0 )" size="small">{{$t('tools.edit')}}</el-button>-->
                    <el-button type="text" @click="showDataEditor(scope.row, false)" v-if="(permissionCheck('opt', '8_3') && scope.row.status <= 1) || (permissionCheck('opt', '9_1') && scope.row.status <= 2) || (permissionCheck('opt', '9_2') && (scope.row.status === 2 || scope.row.status === 3))" size="small">{{$t('tools.edit')}}</el-button>
                    <el-button type="text" @click="shengheFunc(scope.row.id,2)" v-if="permissionCheck('opt', '9_1') && (scope.row.status === 1 || scope.row.status === 0 )" size="small">{{$t('global.financialApproval')}}</el-button>
                    <el-button type="text" @click="shengheFunc(scope.row.id,3)" v-if="permissionCheck('opt', '9_2') && scope.row.status === 2" size="small">{{$t('global.leadershipApproval')}}</el-button>
                    <el-button type="text" @click="shengheFunc(scope.row.id,100)" v-if="(permissionCheck('opt', '8_3') && scope.row.status <= 1) || (permissionCheck('opt', '9_1') && scope.row.status <= 2) || (permissionCheck('opt', '9_2') && (scope.row.status === 2 || scope.row.status === 3))" size="small">{{$t('tools.cancel')}}</el-button>
                    <!--<span class="xiexian">/</span>-->
                    <el-button type="text" @click="paidListFunc(scope.row)" v-if="scope.row.status === 3 && permissionCheck('opt', '9_1')" size="small">{{$t('warehouse.payment2')}}</el-button>
                    <!--<span class="xiexian">/</span>-->
                    <el-button type="text" @click="warehousing(scope.row)" v-if="scope.row.status >= 3 && scope.row.status !== 100" size="small">{{$t('warehouse.Warehousing')}}</el-button>
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
        <el-dialog :title="$t('warehouse.setUp')" width="80%" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form">
              <el-form-item :label="$t('warehouse.supplier')">
                  <el-select v-model="form.supplier_id" filterable clearable :placeholder="$t('warehouse.choice')">
                    <el-option
                      v-for="item in supplierList"
                      :key="item.id"
                      :label="item.company_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <!--<el-select v-model="form.currency" clearable :placeholder="$t('warehouse.Currency')">-->
                    <!--<el-option-->
                      <!--v-for="item in options"-->
                      <!--:key="item.value"-->
                      <!--:label="item.label"-->
                      <!--:value="item.value">-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                  <!--<el-select v-model="form.payment_term" clearable :placeholder="$t('warehouse.payment_term')">-->
                    <!--<el-option-->
                      <!--v-for="item in paymenttermdata"-->
                      <!--:key="item.value"-->
                      <!--:label="item.label"-->
                      <!--:value="item.value">-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                  <!--<el-select v-model="form.delivery_method" clearable :placeholder="$t('warehouse.delivery_method')">-->
                    <!--<el-option-->
                      <!--v-for="item in deliverymedata"-->
                      <!--:key="item.value"-->
                      <!--:label="item.label"-->
                      <!--:value="item.value">-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                  <base-data-select v-model="form.currency" treeCode="008" :placeString="$t('warehouse.Currency')"></base-data-select>
                  <base-data-select v-model="form.payment_term" treeCode="009" :placeString="$t('warehouse.payment_term')"></base-data-select>
                  <base-data-select v-model="form.delivery_method" treeCode="010" :placeString="$t('warehouse.delivery_method')"></base-data-select>
                  <el-date-picker v-model="form.estimate_arrival_time" treeCode="011" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :placeholder="$t('warehouse.estimate_arrival_time')"></el-date-picker>
              </el-form-item>
            <el-form-item :label="$t('goods.note')">
              <el-input
                type="textarea"
                :rows="2"
                placeholder=""
                v-model="form.comment">
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.Purchaselist')">
              <!--<el-button type="primary" @click="addSkus" size="mini">{{$t('warehouse.add2')}}</el-button>-->
              <el-table :data="skusArray" height="calc(100vh - 440px)" style="width: 100%">
                <el-table-column prop="name" :label="$t('warehouse.name2')"></el-table-column>
                <el-table-column prop="origin" :label="$t('warehouse.PlaceofOrigin')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.origin"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="specification" :label="$t('warehouse.pecifications')">
                  <template slot-scope="scope">
                    {{textFilter(scope.row.specification)}}
                  </template>
                </el-table-column>
                <el-table-column prop="barcode" :label="$t('warehouse.barCode')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.barcode"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="unit_price" :label="$t('warehouse.pricetype')" width="250">
                  <template slot-scope="scope">
                    <price-input v-model="scope.row.unit_price" @inputBlurFunc="currentIputCount(scope.$index)"><span slot="append">/ {{scope.row.shouJia | price}}</span></price-input>
                  </template>
                </el-table-column>
                <!--<el-table-column prop="count" label="库存">-->
                  <!--<template slot-scope="scope">-->
                    <!--{{scope.row.nowCount}}-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="inventory" :label="$t('warehouse.currentInv')"></el-table-column>

                <el-table-column prop="count" :label="$t('warehouse.Purchasenum')" width="150">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.count" @blur="currentIputCount(scope.$index)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="total_price" :label="$t('warehouse.allprice')" width="150">
                  <template slot-scope="scope">
                    <price-input v-model="scope.row.total_price"></price-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width="100">
                  <template slot-scope="scope">
                    <el-button type="text" @click="deleteRow(scope.$index)" size="small">{{$t('tools.delete')}}</el-button>
                  </template>
                </el-table-column>
                <!--<el-table-column :label="$t('warehouse.operation')">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-button type="text" @click="eidtSkus(scope.row, scope.$index)" size="small">{{$t('tools.edit')}}</el-button>-->
                    <!--<span class="xiexian">/</span>-->
                    <!--<el-button type="text" @click="delSkus(scope.$index)" size="small">{{$t('tools.delete')}}</el-button>-->
                  <!--</template>-->
                <!--</el-table-column>-->
              </el-table>
              <a class="add-btn" @click="addSkus">{{$t('warehouse.Newadd')}}</a>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
        <el-dialog :title="$t('warehouse.PurchaseSet')" width="80%" append-to-body @close="skusDialog = false" :visible.sync="skusDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px">
            <el-form-item :label="$t('warehouse.source')">
              <el-radio-group v-model="source" @change="laiyuanChange">
                <el-radio :label="1">{{$t('warehouse.commodity')}}</el-radio>
                <el-radio :label="2">{{$t('warehouse.order')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('warehouse.commodity')" v-if="source === 1">
              <goods-selector style="width: 300px" v-model="goodsId"></goods-selector>
            </el-form-item>
            <el-form-item :label="$t('warehouse.order')" v-if="source === 2">
              <order-selector v-model="orderId" style="width: 300px;"></order-selector>
            </el-form-item>
            <el-form-item :label="$t('warehouse.orderinformation')" v-show="source === 2">
              <el-table stripe border :data="orderInfoData" ref="orderInfoDataTable" key="1">
                <el-table-column :label="$t('order.no')" width="200px">
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
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item :label="$t('warehouse.commodityspe')" v-if="source === 1">
              <el-table ref="multipleTable" :data="goodsInventoryTable" row-key="id" key="1" @selection-change="handleSelectionChange1" style="width: 100%">
                <el-table-column v-if="source === 1"
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column prop="name" :label="$t('warehouse.commodity')"></el-table-column>
                <el-table-column :label="$t('goods.sp')">
                  <template  slot-scope="scope">
                    {{scope.row.title}}
                  </template>
                </el-table-column>
                <el-table-column prop="inventory" :label="$t('warehouse.currentInv')"></el-table-column>
                <el-table-column prop="barcode" :label="$t('goods.barcode')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.barcode"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.PlaceofOrigin')">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.origin"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="no"  :label="$t('goods.skuNo')"></el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFuncSkus()" :disabled="submitDisabled" :confirmButtonInfor="$t('warehouse.save')"></confirm-button>
          </div>
        </el-dialog>
        <!-- 付款单列表 -->
        <el-dialog :title="$t('warehouse.paymentslist')" width="80%" @close="paidListDialog = false" :visible.sync="paidListDialog" :close-on-click-modal="false" center >
          <el-row>
            <el-col :span="24" class="funcList">
              <div class="boxFuncBtn" @click="payaddData"  v-if="permissionCheck('opt')">
                <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
                <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
              </div>
            </el-col>
          </el-row>
          <el-table stripe border :data="paidList" height="calc(100vh - 400px)">
                <!-- <el-table-column prop="purchase_id" label="id"></el-table-column> -->
                <el-table-column :label="$t('warehouse.money')">
                  <template  slot-scope="scope">
                    {{scope.row.paid | price}}
                  </template>
                </el-table-column>
                <el-table-column prop="comment" :label="$t('goods.note')"></el-table-column>
                <el-table-column prop="pay_time" :label="$t('warehouse.payTime')" width="180"></el-table-column>
                <el-table-column :label="$t('tools.opt')" v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <el-button type="text" @click="PaymentEit(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPagePay"
                  :page-size="pageSizePay"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCountPay">
                </el-pagination>
              </div>
          <div slot="footer" class="dialog-footer">
            <!-- <confirm-button @confirmButton="Paycomplete(1)" :disabled="submitDisabled" v-if="!this.paytype" :confirmButtonInfor="$t('warehouse.Cpayment')" ></confirm-button> -->
            <confirm-button @confirmButton="Paycomplete(2)" :disabled="submitDisabled" :confirmButtonInfor="$t('warehouse.close')"></confirm-button>
          </div>
        </el-dialog>
        <!-- 付款单设置 -->
        <el-dialog :title="$t('warehouse.payset')" width="700px" append-to-body @close="payaddDialog = false" :visible.sync="payaddDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="skus">
            <el-form-item :label="$t('warehouse.PaymentAmount')">
              <price-input v-model="paiForm.paid"></price-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.payTime')">
              <el-date-picker
                format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"
                v-model="paiForm.pay_time"
                type="datetime"
                :placeholder="$t('order.pleaseChooseTime')">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('warehouse.Isitdone')" label-width="145px" v-if="!this.paytype">
              <el-switch v-model="switchvalue" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('goods.note')">
              <el-input type="textarea"
                :rows="2"
                v-model="paiForm.comment">
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.annex')">
              <el-upload
                name="image"
                :headers="fileUploadHeader"
                :action="fileUploadUrl"
                :on-success="uploadSuccess"
                :on-remove="removeFile"
                multiple
                :limit="1"
                :file-list="fileList">
                <el-button size="small" type="primary">{{$t('warehouse.clickUpload')}}</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton=" toAdd()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
        <!-- 入库 -->
        <el-dialog :title="$t('warehouse.Warehousing')" width="90%" @close="inwarehouselog=false" :visible.sync="inwarehouselog" :close-on-click-modal="false" center >
            <el-select v-model="wareId" @change="onchange" :placeholder="$t('warehouse.Pleaseselect')">
              <el-option
                v-for="item in warelist"
                :key="item.value"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled">
              </el-option>
            </el-select>
            <div v-if="wareId">
              <div class="switchbox">
                <span>{{$t('warehouse.Tobetested')}}</span>
                <el-switch v-model="switchtype" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </div>
              <el-table ref="singleTable" :data="inwarehouseData" tooltip-effect="dark" style="width: 100%" height="calc(100vh - 420px)" @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column property="name" :label="$t('warehouse.name2')"></el-table-column>
                  <el-table-column property="origin" :label="$t('warehouse.PlaceofOrigin')"></el-table-column>
                  <el-table-column property="specification" :label="$t('warehouse.pecifications')">
                    <template  slot-scope="scope">
                      {{textFilter(scope.row.specification)}}
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('warehouse.barCode')">
                    <template  slot-scope="scope">
                        <el-input v-model="scope.row.barcode"></el-input>
                    </template>
                  </el-table-column>
                    <el-table-column :label="$t('warehouse.location')">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.position" :placeholder="$t('warehouse.Pleaseselect')">
                          <el-option
                           v-for="(item, k) in locas"
                           :key="k"
                           :label="item.name"
                           :value="item.name">
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                  <el-table-column property="specification" :label="$t('warehouse.Categories')">
                    <template  slot-scope="scope">
                      <!-- <div v-if="scope.row.merchant_type_code.length == 0 || scope.row.merchant_type_code == null"> -->
                        <el-cascader
                          v-model="scope.row.merchant_type_code"
                          :options="goodsTypeData"
                          :props="{label: 'name', value :'tree_code' ,children : 'items'}"
                          @change="handleChange">
                        </el-cascader>
                      <!-- </div> -->
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('warehouse.baozhiqi')">
                    <template  slot-scope="scope">
                      <el-input v-model.number="scope.row.shelf_life" clearable>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('warehouse.guoqiTime')">
                    <template  slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.exp"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :placeholder="$t('warehouse.chooseDate')">
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column property="unit_price" v-if="permissionCheck('opt', '9_3')" :label="$t('warehouse.price')">
                     <template slot-scope="scope">
                      {{scope.row.unit_price | price}}
                    </template>
                  </el-table-column>
                  <!-- 本次到货 已到货 采购数量 -->
                  <el-table-column :label="$t('warehouse.thearrivalarr')" width="200px">
                    <template slot-scope="scope">
                      <div class="numclass">
                        <span><el-input v-model="scope.row.count"></el-input></span>
                        <span>{{scope.row.arrive_count}}</span>
                        <span>{{scope.row.count}}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column property="total_price" v-if="permissionCheck('opt', '9_3')" :label="$t('warehouse.allprice')">
                    <template slot-scope="scope">
                      {{scope.row.total_price | price}}
                    </template>
                  </el-table-column>
              </el-table>
              <div style="margin-top: 10px;">
                <el-input :placeholder="$t('warehouse.remarks')" type="textarea" :rows="2" v-model="inwarehouseFrom.comment"></el-input>
              </div>
            </div>
            <div v-if="!wareId" class="Msg">
              {{$t('warehouse.placewarehouse')}}
            </div>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="inwarehouseAdd" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
        <!-- 入库列表 -->
        <el-dialog
          :title="$t('warehouse.rukuInfo')"
          :visible.sync="dialogVisible"
          width="80%">
          <el-tabs v-model="activeChuRuKu" @tab-click="tabChange">
            <el-tab-pane :label="$t('warehouse.enterlist')" name="1"></el-tab-pane>
            <el-tab-pane :label="$t('warehouse.Returntolist')" name="2"></el-tab-pane>
          </el-tabs>
          <div v-if="activeChuRuKu === '1'">
            <el-row>
              <div class="searchbox">
                <el-input v-model="stockfrom.key" style="margin-right: 10px" clearable></el-input>
                <el-button type="primary" icon="el-icon-search" @click="Searchrukudata" size="small"></el-button>
              </div>
              <!-- && showRukuBtn === 3-->
              <el-col :span="24" class="funcList localcss" v-if="permissionCheck('opt', '8_1')">
                <el-button type="primary" class="overbtn" @click="overBtn" size="mini">{{$t('warehouse.Completereceipt')}}</el-button>
                <div class="boxFuncBtn mt" @click="addrukudata">
                  <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
                  <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
                </div>
              </el-col>
            </el-row>
            <el-table :data="totaldata" border stripe highlight-current-row height="calc(100vh - 420px)" style="width: 100%">
              <el-table-column prop="no" :label="$t('warehouse.number')" width="150"></el-table-column>
              <el-table-column prop="warehouse_name" :label="$t('warehouse.name')" width="150"></el-table-column>
              <!-- <el-table-column prop="supplier_name" :label="$t('warehouse.SupplierNmae')" width="150"></el-table-column> -->
              <el-table-column prop="warehouse_name" label="">
                <template slot="header" slot-scope="scope">
                  <div>
                    <el-row style="width: 100%">
                      <el-col :span="6">{{$t('warehouse.name2')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.PlaceofOrigin')}}</el-col>
                      <el-col :span="3" style="text-align: center">{{$t('warehouse.pecifications')}}</el-col>
                      <el-col :span="3" style="text-align: center">{{$t('warehouse.barCode')}}</el-col>
                      <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{$t('warehouse.price')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.num')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.returnednum')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.baozhiqiguoqi')}}</el-col>
                    </el-row>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div class="goods">
                    <el-row v-for="(item, k) in scope.row.skus" :key="k" class="odd" style="width: 100%">
                      <el-col :span="6" class="overOmitted"><span :title="item.name">{{item.name}}</span></el-col>
                      <el-col :span="2" style="text-align: center;min-width: 20px">{{item.origin !== '' ? item.origin : 'No' }}</el-col>
                      <el-col :span="3" class="overOmitted" style="text-align: center">
                        <span :title="textFilter(item.specification)">{{textFilter(item.specification) !== '' ? textFilter(item.specification) : 'No' }}</span>
                      </el-col>
                      <el-col :span="3" style="text-align: center">{{item.barcode !== '' ? item.barcode : 'No'}}</el-col>
                      <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{item.unit_price | price}}</el-col>
                      <el-col :span="2" style="text-align: center">{{item.count}}</el-col>
                      <el-col :span="2" style="text-align: center">{{item.refund_count}}</el-col>
                      <el-col :span="2" style="text-align: center">{{item.shelf_life}}{{$t('warehouse.day')}} / {{item.exp}}</el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('tools.opt')" width = "140" v-if="permissionCheck('opt', '8_1')">
                <template slot-scope="scope">
                  <el-button type="text" @click="Rukubtn(scope.row)" v-if="scope.row.status === 1" size="small">{{$t('warehouse.Warehousing')}}</el-button>
                  <el-button type="text" @click="Returndata(scope.row)" v-if="scope.row.status === 1" size="small">{{$t('warehouse.return3')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: right;margin-top: 10px">
              <el-pagination
                :current-page.sync="currentPage_to"
                :page-size="pageSize_to"
                layout="total, prev, pager, next, jumper"
                :total="itemCount_to">
              </el-pagination>
            </div>
          </div>
          <div v-if="activeChuRuKu === '2'">
            <el-row>
              <el-col :span="24">
                <el-form :inline="true" :model="chuKuSearchForm">
                  <el-form-item>
                    <el-date-picker format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" clearable
                                    v-model="orderTimes"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    :range-separator="$t('tools.to')"
                                    :start-placeholder="$t('tools.startDate')"
                                    :end-placeholder="$t('tools.endDate')">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item :label="$t('order.status')">
                    <el-select v-model="chuKuSearchForm.status" clearable>
                      <el-option
                        v-for="item in optionStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="chuKuSearchForm.key" clearable></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table stripe border :data="chukuData" height="calc(100vh - 440px)">
              <el-table-column label="#" width="60px">
                <template slot-scope="scope">
                  {{scope.$index + chuKuSearchForm.skip + 1}}
                </template>
              </el-table-column>
              <el-table-column prop="no" :label="$t('warehouse.number')" width="120px"></el-table-column>
              <el-table-column prop="warehouse_name" :label="$t('warehouse.name')" width="100px"></el-table-column>
              <el-table-column :label="$t('warehouse.type')" width="100px">
                <template slot-scope="scope">
                  <span v-if="scope.row.tp === 1">{{$t('warehouse.order')}}</span>
                  <span v-if="scope.row.tp === 2">{{$t('warehouse.Scrap')}}</span>
                  <span v-if="scope.row.tp === 3">{{$t('warehouse.return')}}</span>
                </template>
              </el-table-column>
              <el-table-column width="800">
                <template slot="header" slot-scope="scope">
                  <el-row style="width: 100%">
                    <el-col :span="10">{{$t('warehouse.Tradename')}}</el-col>
                    <el-col :span="2" style="text-align: center">{{$t('warehouse.position')}}</el-col>
                    <el-col :span="3" style="text-align: center">{{$t('warehouse.pecifications')}}</el-col>
                    <el-col :span="3" style="text-align: center">{{$t('warehouse.barCode')}}</el-col>
                    <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{$t('warehouse.price')}}</el-col>
                    <el-col :span="2" style="text-align: center">{{$t('warehouse.num')}}</el-col>
                    <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{$t('warehouse.allprice')}}</el-col>
                  </el-row>
                </template>
                <template slot-scope="scope">
                  <div class="goods">
                    <el-row v-for="(item, k) in scope.row.skus" :key="k" class="odd" style="width: 100%">
                      <el-col :span="10" class="overOmitted"><span :title="item.name">{{item.name}}</span></el-col>
                      <el-col :span="2" style="text-align: center;min-width: 20px">{{item.position !== '' ? item.position : 'No' }}</el-col>
                      <el-col :span="3" class="overOmitted" style="text-align: center"><span :title="textFilter(item.specification)">{{textFilter(item.specification)}}</span></el-col>
                      <el-col :span="3" style="text-align: center">{{item.barcode !== '' ? item.barcode : 'No'}}</el-col>
                      <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{item.unit_price | price}}</el-col>
                      <el-col :span="2" style="text-align: center">{{item.count}}</el-col>
                      <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{item.total_price | price}}</el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="shipping_address" :label="$t('warehouse.Address')" width="200px">
                <template slot-scope="scope">
                    <span v-if="scope.row.shipping_address != null">
                      {{scope.row.shipping_address.address.province}}-
                      {{scope.row.shipping_address.address.city}}-
                      {{scope.row.shipping_address.address.district}}-
                      {{scope.row.shipping_address.address.addr}}
                      </span>
                  <span v-if="scope.row.shipping_address == null">{{$t('warehouse.noinformation')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="shipping_address" :label="$t('warehouse.Courierinformation')" width="200px">
                <template slot-scope="scope">
                  <span v-if="scope.row.express == null">{{$t('warehouse.noinformation')}}</span>
                  <span v-if="scope.row.express != null">
                      <div>{{$t('warehouse.corporateName')}}: {{scope.row.express.company}}</div>
                      <div>{{$t('warehouse.Singlenumber')}}: {{scope.row.express.novar}}</div>
                    </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('order.status')" width="180px">
                <template slot-scope="scope">
                  <el-tag type="warning" v-if="scope.row.status === 1 || scope.row.status === 0">{{$t('warehouse.pendingProcurementReview')}}</el-tag>
                  <el-tag type="info" v-if="scope.row.status === 2">{{$t('warehouse.daiInvConfirm')}}</el-tag>
                  <el-tag type="success" v-if="scope.row.status === 3">{{$t('warehouse.invConfirmComplete')}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="gen_time" :label="$t('warehouse.time')" width="150px"></el-table-column>
              <el-table-column :label="$t('tools.opt')" width="150px" fixed = "right" v-if="permissionCheck('opt', '8_1') || permissionCheck('opt', '8_3')">
                <template slot-scope="scope">
                  <el-button type="text" @click="shengheFuncChuku(scope.row.id, 2)" v-if="(scope.row.status === 1 || scope.row.status === 0) && permissionCheck('opt', '8_3')" size="small">{{$t('warehouse.caigoushenghe')}}</el-button>
                  <el-button type="text" @click="shengheFuncChuku(scope.row.id, 3)" v-if="scope.row.status === 2  && permissionCheck('opt', '8_1')" size="small">{{$t('warehouse.invConfirm')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="12" style="display: flex;align-items: center">
                <span class="totlaInv">{{$t('warehouse.goodsChuKuCount')}}：{{chukuGoodsNumber}}</span>
              </el-col>
              <el-col :span="12">
                <div style="text-align: right;margin-top: 10px">
                  <el-pagination
                    :current-page.sync="currentPagechuku"
                    :page-size="pageSizechuku"
                    layout="total, prev, pager, next, jumper"
                    :total="itemCountchuku"
                  ></el-pagination>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-dialog>
        <el-dialog
          :title="$t('warehouse.Warehousing')"
          :visible.sync="Rudalog"
          width="70%">
            <el-table :data="RukufromSkus" border stripe style="width: 100%">
              <el-table-column prop="name" :label="$t('warehouse.name2')"></el-table-column>
              <el-table-column prop="origin" :label="$t('warehouse.PlaceofOrigin')"></el-table-column>
              <el-table-column prop="specification" :label="$t('warehouse.pecifications')">
				        <template slot-scope="scope">
                  {{textFilter(scope.row.specification)}}
                </template>
				      </el-table-column>
              <el-table-column prop="barcode" :label="$t('warehouse.barCode')"></el-table-column>
              <el-table-column prop="name" :label="$t('warehouse.location')">                <template slot-scope="scope">
                  <el-select v-model="scope.row.position" :placeholder="$t('warehouse.Pleaseselect')">
                    <el-option
                      v-for="(item, k) in locas"
                      :key="k"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="unit_price" v-if="permissionCheck('opt', '9_3')" :label="$t('warehouse.price')">
                <template slot-scope="scope">
                  {{scope.row.unit_price | price}}
                </template>
              </el-table-column>
            </el-table><br>
            <el-input type="textarea" :rows="2" v-model="Rukufrom.comment" :placeholder="$t('warehouse.remarks')"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="Rukuadd">{{$t('warehouse.confirmmsg')}}</el-button>
          </span>
        </el-dialog>
        <!-- 退还 -->
        <el-dialog :title="$t('warehouse.Info')" :visible.sync="returndalog" width="70%">
          <el-table :data="testfrom" style="width: 100%" border stripe ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange3">
            <el-table-column type="selection" width="55"></el-table-column>
           <el-table-column prop="name" :label="$t('warehouse.name2')"></el-table-column>
            <el-table-column prop="origin" :label="$t('warehouse.PlaceofOrigin')"></el-table-column>
            <el-table-column prop="specification" :label="$t('warehouse.pecifications')">
              <template slot-scope="scope">
                {{textFilter(scope.row.specification)}}
              </template>
				    </el-table-column>
            <el-table-column prop="barcode" :label="$t('warehouse.barCode')"></el-table-column>
            <el-table-column prop="count" :label="$t('warehouse.num')">               <template slot-scope="scope">
                 <el-input v-model="scope.row.count"></el-input>
                </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="returnbtn">{{$t('warehouse.confirmmsg')}}</el-button>
          </span>
        </el-dialog>
        <!--审批备注-->
        <el-dialog :title="$t('warehouse.Approve')" :visible.sync="shengpiNoteDialog" width="40%">
          <el-form label-width="100px" :model="shengheForm">
            <el-form-item :label="$t('order.note')">
              <el-input
                type="textarea"
                :rows="2"
                :placeholder="$t('warehouse.Pleasenote')"
                v-model="shengheForm.comment">
              </el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="shengheSubmit">{{$t('warehouse.confirmmsg')}}</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import store from '@/store'
  import { purchaseover, warehousePurchasesExport, warehouseOutboundReview, warehouseOutbounds, receiptsinventory, warehouseOutboundsAdd, purchaseAdd, warehousePurchasesCount, warehousePurchasesReview, Locationlist, warehouseReceiptsAdd, warehouseReceipts, purchaseModify, suppliersList, purchaseList, paysList, Paymentcomplete, AddpaysList, modifypaysList, warehousesList, warehouseInventories } from '@/api/warehouse'
  import { ordersInfo } from '@/api/order'
  import { spusSkusList, spusInfo, spuTypesList, spuTypesInfo } from '@/api/goods'
  import { fileUploadUrl } from '@/utils/serverConfig'
  export default {
    components: {
    },
    data() {
      const formData = this.setForm()
      const pz = 10
      return {
        triggersType: [{code: 1, name: this.$t('operation.triggersA')}, {
          code: 2,
          name: this.$t('operation.triggersB')
        }, {code: 3, name: this.$t('operation.triggersC')}],
        timeValidSwitch: true,
        searchForm: {
          skip: 0,
          limit: pz,
          no: '',
          supplier_id: '', // 供应商
          pay_status: '', // 0 所有 1未付完 2已付完
          status: 0 // 0所有 1申请 2财务审批 3管理层审批（已完成）4完成收货
        },
        payStatusOption: [
          {
            label: this.$t('warehouse.all'),
            value: 0
          },
          {
            label: this.$t('warehouse.unpaid'),
            value: 1
          },
          {
            label: this.$t('warehouse.Paid'),
            value: 2
          }
        ],
        warelist: [],
        inwarehouseFrom: {
          tp: 1,
          purchase_id: '',
          warehouse_id: '',
          skus: [],
          comment: '',
          status: '',
        },
        stockfrom: {
          key: '',
          warehouse_id: '',
          purchase_id: '',
          supplier_id: '',
          skip: 0,
          limit: 10,
        },
        dialogVisible: false,
        switchvalue: false,
        Rudalog: false,
        position: '',
        locas: [],
        wareId: '',
        inwarehouseData: [],
        inwarehouselog: false,
        paytype: false,
        test: [],
        commentlog: false,
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        currentPage_to: 1,
        pageSize_to: 10,
        itemCount_to: 0,
        form: formData,
        returndalog: false,
        formEditDialog: false,
        formEditDialogpay: false,
        submitDisabled: false,
        payaddDialog: false,
        skus: {
          name: '',
          origin: '',
          specification: '',
          sku_uid: '',
          barcode: '',
          unit_price: 0,
          count: 0,
          total_price: 0
        },
        supplierList: [],
        skusArray: [],
        skusDialog: false,
        skusEidtIndex: 0,
        skuType: 'add',
        paidListDialog: false,
        searchFormpay: {
          purchase_id: '',
          skip: '',
          limit: pz
        },
        ispaid_complete: '',
        paidList: [],
        currentPagePay: 1,
        pageSizePay: pz,
        itemCountPay: 0,
        paiForm: {
          id: '',
          purchase_id: '',
          paid: 0,
          pay_time: '',
          comment: '',
          attach_file: ''
        },
        currency: '',
        payment_term: '',
        delivery_method: '',
        source: 1,
        orderId: '',
        goodsId: '',
        goodsInventoryTable: [],
        goodsInventoryData: [],
        goodsProps: [],
        batchCount: 0,
        batchPrice: 0,
        batchTotalPrice: 0,
        multipleSelection: [],
        tabletitle: [
          this.$t('warehouse.name2'),
          this.$t('warehouse.PlaceofOrigin'),
          this.$t('warehouse.pecifications'),
          this.$t('warehouse.barCode'),
          this.$t('warehouse.price'),
          this.$t('warehouse.num'),
          this.$t('warehouse.arrive_count'),
          this.$t('warehouse.allprice')
        ],
        Rukufrom: {
          warehouse_id: '',
          comment: '',
          skus: ''
        },
        flag: '',
        flag2: '',
        flag3: '',
        totaldata: [],
        searchForm2:{},
        options: [
          {value: 'US Dollar', label: 'US Dollar'},
          {value: 'Riel(Cambodia)', label: 'Riel(Cambodia)'},
          {value: 'RBM', label: 'RBM'},
        ],
        paymenttermdata: [
          {value: 'Net 30 days', label: 'Net 30 days'},
          {value: 'Net 60 days', label: 'Net 60 days'}
        ],
        deliverymedata: [
          {value: 'Self-pick up', label: 'Self-pick up'},
          {value: 'Express', label: 'Express'}
        ],
        orderInfoData: [],
        payMethod: [this.$t('order.onlinePay'), this.$t('order.cashOnDelivery')],
        deliveryMethod: [this.$t('order.expressDelivery'), this.$t('order.selfMention'), this.$t('order.rider')],
        optArr: {
          2: this.$t('order.opt2'),
          4: this.$t('order.opt4'),
          5: this.$t('order.opt5'),
          6: this.$t('order.opt6'),
          7: this.$t('order.opt7'),
          8: this.$t('order.opt8'),
          9: this.$t('order.opt9')
        },
        statusTab: [{ value: '0', label: this.$t('tools.all') },
          { value: '1', label: this.$t('warehouse.pendFinancialApproval') },
          { value: '2', label: this.$t('warehouse.leaderBeApproved') },
          { value: '3', label: this.$t('warehouse.tobeStored') },
          { value: '4', label: this.$t('warehouse.compleateStorage') },
          { value: '100', label: this.$t('order.status7') }],
        statusTabList: [{ value: '0', label: this.$t('tools.all') },
          { value: '1', label: this.$t('warehouse.pendFinancialApproval') },
          { value: '2', label: this.$t('warehouse.leaderBeApproved') },
          { value: '3', label: this.$t('warehouse.tobeStored') },
          { value: '4', label: this.$t('warehouse.compleateStorage') },
          { value: '100', label: this.$t('order.status7') }],
        tab_status: '0',
        showTab: false,
        fileList: [],
        fileUploadUrl: fileUploadUrl,
        fileUploadHeader: {'X-Access-Token': store.state.user.token},
        switchtype: false,
        rukuid: '',
        returnFrom: {
          warehouse_id: '',
          tp: 3,
          skus: [],
          receipt_id: '',
        },
        // selecttypedalog: false,
        selectdata: '',
        goodsTypeData:'',
        testfrom:[],
        activeChuRuKu: '1',
        chukuData: [],
        currentPagechuku: 1,
        pageSizechuku: pz,
        itemCountchuku: 0,
        chuKuSearchForm: {
          key: '',
          tp: 3,
          warehouse_id: '',
          purchase_id: '', // 采购单id
          status: '', // 1待采购审核 2待仓库确认 3仓库确认完成
          bt: '',
          et: '',
          skip: 0,
          limit: pz
        },
        optionStatus: [
          {
            label: this.$t('warehouse.all'),
            value: 0
          },
          {
            label: this.$t('warehouse.pendingProcurementReview'),
            value: 1
          },
          {
            label: this.$t('warehouse.daiInvConfirm'),
            value: 2
          },
          {
            label: this.$t('warehouse.invConfirmComplete'),
            value: 3
          }
        ],
        orderTimes: [],
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
        chukuGoodsNumber: 0,
        showRukuBtn: '',
        RukufromSkus: [],
        shengpiNoteDialog: false,
        shengheForm: {
          status: 2,
          comment: ''
        },
        purchasesIds: []
      }
    },
    computed: {
      ...mapGetters([
        'shopInfo'
      ])
    },
    watch: {
      // Rudalog(val){

      // },
      currentPagechuku(val) {
        this.chuKuSearchForm.skip = (val - 1) * this.pageSizechuku
        this.chuKuSearchForm.limit = this.pageSizechuku
        this.getChuKuData()
      },
      orderTimes(val) {
        if (val && val.length === 2) {
          this.chuKuSearchForm.bt = val[0]
          this.chuKuSearchForm.et = val[1]
        } else {
          this.chuKuSearchForm.bt = ''
          this.chuKuSearchForm.et = ''
        }
      },
      tab_status(val) {
        if (this.searchForm.skip !== 0 || this.searchForm.status !== parseInt(val)) {
          this.searchForm.skip = 0
          this.searchForm.limit = this.pageSize
          this.currentPage = 1
          this.searchForm.status = parseInt(val)
          this.getDataListFun()
          // console.log(111)
        }
      },
      currentPage_to(val) {
        this.stockfrom.skip = (val - 1) * this.pageSize_to
        this.stockfrom.limit = this.pageSize_to
        this.getstockinfo()
      },
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      },
      currentPagePay(val) {
        this.searchFormpay.skip = (val - 1) * this.pageSizePay
        this.searchFormpay.limit = this.pageSizePay
        this.getPayListFunc()
      },
      batchCount(val) {
        this.goodsInventoryTable.forEach(item => {
          this.$set(item, 'count', val)
          this.$set(item, 'total_price', item.count * item.unit_price)
        })
      },
      batchPrice(val) {
        console.log('dd')
        this.goodsInventoryTable.forEach(item => {
          this.$set(item, 'unit_price', val)
          // this.$set(item, 'total_price', item.count * item.unit_price)
        })
      },
      batchTotalPrice(val) {
        console.log('333')
        this.goodsInventoryTable.forEach(item => {
          this.$set(item, 'total_price', val)
        })
      },
      goodsProps: {
        handler(val) {
          // val.forEach((item) => {
          //   this.goodsInventoryTable.push()
          // })
          this.goodsInventoryTable = []
          const skus = this.getTreePath(0)
          skus.forEach(item => {
            console.log('item', item)
            const tableItem = { id: '', name: val[0].goodsName, inventory: 0, origin: '', sku_uid: '', specification: JSON.stringify(item), shouJia: 0, unit_price: 0, total_price: 0, count: 0, barcode: '', no: 0 }
            let str = ''
            val.forEach(gi => {
              if (gi.name !== '' && gi.items.length > 0) {
                str += gi.name + ':' + item[gi.name] + ';'
              }
            })
            tableItem['title'] = str
            for (let i = 0; i < this.goodsInventoryData.length; i++) {
              const keys = Object.keys(item)
              let isEque = true
              for (let j = 0; j < keys.length; j++) {
                if (this.goodsInventoryData[i].specifications[keys[j]] !== item[keys[j]]) {
                  isEque = false
                  break
                }
              }
              if (isEque) {
                tableItem.sku_uid = this.goodsInventoryData[i].id
                tableItem.id = this.goodsInventoryData[i].id + str
                tableItem.barcode = this.goodsInventoryData[i].barcode
                tableItem.no = this.goodsInventoryData[i].no
                tableItem.inventory = this.goodsInventoryData[i].inventory
                tableItem.unit_price = this.goodsInventoryData[i].price
                tableItem.shouJia = this.goodsInventoryData[i].price
                tableItem.barcode = this.goodsInventoryData[i].barcode
                tableItem.total_price = this.goodsInventoryData[i].inventory * this.goodsInventoryData[i].price
              }
            }
            this.goodsInventoryTable.push(tableItem)
          })
          this.$refs.multipleTable.toggleAllSelection()
          // this.goodsInventoryTable.forEach(row => {
          //   this.$refs.multipleTable.toggleRowSelection(row, true)
          // })
        },
        deep: true
      },
      orderId(val) {
        if (val !== '') {
          ordersInfo(val).then(res => {
            if (res.meta === 0) {
              this.orderInfoData = []
              this.orderInfoData.push(res.item)
            }
          })
        }
      },
      goodsId(val) {
        if (val !== '') {
          this.getGoodsSkus(val)
        }
      }
    },
    methods: {
      currentIputCount(index) {
        // console.log('index', index)
        this.$set(this.skusArray[index], 'total_price', this.skusArray[index].count * this.skusArray[index].unit_price)
        // console.log('this.skusArray[index]', this.skusArray[index])
      },
      exportChangeChoose(val) {
        if (val.length > 0) {
          this.purchasesIds = []
          val.forEach(item => {
            this.purchasesIds.push(item.id)
          })
        }
      },
      exportExcel() {
        if (this.purchasesIds.length === 0) {
          this.$message.error(this.$t('warehouse.needCheckDataExoprt'))
          return
        }
        warehousePurchasesExport({ ids: JSON.stringify(this.purchasesIds) }).then(res => {
          var link = document.createElement('a')
          const blod = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blod)
          link.download = 'PurchasesInfo.xlsx'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      },
      tabChange(number) {
        if (number.name === '2') {
          this.getChuKuData()
        }
        // console.log('num', number)
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
      search() {
        this.chuKuSearchForm.skip = 0
        this.currentPagechuku = 1
        this.getChuKuData()
      },
      shengheFuncChuku(id, number) {
        warehouseOutboundReview(id, { status: number }).then(res => {
          this.getChuKuData()
        })
      },
      getChuKuData() {
        warehouseOutbounds(this.chuKuSearchForm).then(res => {
          if (res.meta === 0) {
            this.chukuData = res.items
            this.itemCountchuku = res.total
            this.chukuGoodsNumber = res.count
          }
        })
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
      uploadSuccess(response, file, fileList) {
        console.log('rs', response)
        this.paiForm.attach_file = response.md5
      },
      removeFile(file, fileList) {
        console.log('file', file)
        this.paiForm.attach_file = ''
      },
      getCount() {
        this.statusTab = JSON.parse(JSON.stringify(this.statusTabList))
        warehousePurchasesCount().then(res => {
          if (res.meta === 0) {
            console.log(res)
            res.items.forEach(item => {
              this.statusTab.forEach((Z, k) => {
                if (Z.value === item.status.toString()) {
                  this.statusTab[k].label = this.statusTab[k].label + '(' + item.count + ')'
                }
              })
            })
          }
          this.showTab = true
        })
      },
      shengheFunc(id, number) {
        this.shengpiNoteDialog = true
        this.shengheForm.status = number
        this.shengheForm.id = id
        this.shengheForm.comment = ''
      },
      shengheSubmit() {
        warehousePurchasesReview(this.shengheForm.id, this.shengheForm).then(res => {
          this.shengpiNoteDialog = false
          this.getDataListFun()
          this.getCount()
        })
      },
      deleteRow(index) {
        this.skusArray.splice(index, 1)
      },
      laiyuanChange() {
        this.goodsInventoryTable = []
      },
      getGoodsSkus(id) {
        spusSkusList(id, { skip: 0, limit: -1 }).then(res => {
          this.goodsInventoryData = res.items
          this.getGoodsInfo(id)
        })
      },
      getGoodsInfo(id) {
        spusInfo(id).then(res => {
          this.goodsProps = []
          if (res.meta === 0) {
            res.item.specification_options && res.item.specification_options.forEach((op) => {
              this.goodsProps.push({ name: op.name, items: op.items, goodsName: res.item.name })
            })
          }
        })
      },
      handleSelectionChange1(val) {
        console.log('er', val)
        // this.multipleSelection = []
        this.multipleSelection = val
        // val.forEach((item) => {
        //   this.multipleSelection.push(item.id)
        // })
      },
      getTreePath(k) {
        const path = []
        if (k > this.goodsProps.length - 1 || !this.goodsProps[k] || !this.goodsProps[k].items || this.goodsProps[k].items < 1) {
          return path
        }
        for (let i = 0; i < this.goodsProps[k].items.length; i++) {
          const child = this.getTreePath(k + 1)
          if (child.length < 1) {
            const item = {}
            item[this.goodsProps[k].name] = this.goodsProps[k].items[i]
            path.push(item)
            // this.getTreePath(k++)
          } else {
            for (let j = 0; j < child.length; j++) {
              const ni = JSON.parse(JSON.stringify(child[j]))
              ni[this.goodsProps[k].name] = this.goodsProps[k].items[i]
              path.push(ni)
            }
          }
        }
        return path
      },
      textFilter1(data) {
        let str = ''
        const text = data
        Object.keys(text).forEach((v, i) => {
          if (i === 0) {
            str = v + ':' + text[v] + ';'
          } else {
            str = str + v + ':' + text[v] + ';'
          }
        })
        return str
      },
      getOrderInfo(id) {
        ordersInfo(id).then(res => {
          if (res.meta === 0) {
            // this.skusArray = []
            // console.log('res.item.merchant_item.goods_items', res.item.merchant_item.goods_items)
            const array = res.item.merchant_item.goods_items
            array && array.forEach(value => {
              const goodsinfo = value.goods_info
              const obj = {
                id: (goodsinfo.sku_url !== '' ? goodsinfo.sku_url : goodsinfo.sku_id) + this.textFilter1(goodsinfo.specifications),
                name: goodsinfo.spu_name,
                origin: '',
                specification: JSON.stringify(goodsinfo.specifications),
                sku_uid: goodsinfo.sku_url !== '' ? goodsinfo.sku_url : goodsinfo.sku_id,
                barcode: goodsinfo.barcode,
                unit_price: goodsinfo.unit_pay_price,
                shouJia: goodsinfo.unit_pay_price,
                count: goodsinfo.count,
                // nowCount: goodsinfo.count,
                total_price: goodsinfo.pay_price
              }
              const index = this.skusArray.findIndex(z => {
                if (z.id === obj.id) {
                  return z
                }
              })
              // console.log('obj.id', obj.id)
              if (index === -1) {
                this.skusArray.push(obj)
              }
            })
          }
        })
      },
      paidListFunc(data) {
        this.ispaid_complete = data.paid_complete
        // console.log(this.ispaid_complete);
        // console.log(data);
        this.paidListDialog = true
        this.searchFormpay.purchase_id = data.id
        this.paiForm.purchase_id = data.id
        this.paytype = data.paid_complete
        this.getPayListFunc()
      },
      getPayListFunc() {
        paysList(this.searchFormpay).then(res => {
          this.paidList = res.items
          // console.log(res.items);
          this.itemCountPay = res.total
        })
      },
      saveDataFuncSkus() {
        if (this.source === 1) {
          if (this.goodsId === '') {
            this.$message.error(this.$t('warehouse.TipsMsg'))
            return
          }
          this.multipleSelection.forEach((item, k) => {
            const index = this.skusArray.findIndex(v => {
              if (v.id === item.id) {
                return v
              }
            })
            if (index === -1) {
              this.skusArray.push(this.multipleSelection[k])
            }
          })
          console.log('this.skusArray', this.skusArray)
        } else if (this.source === 2) {
          if (this.orderId === '') {
            this.$message.error(this.$t('warehouse.TipsMsg2'))
            return
          }
          this.getOrderInfo(this.orderId)
        }
        // console.log('array', this.skusArray)
        this.skusDialog = false
      },
      toAdd() {
        console.log('data', this.paiForm)
        if (this.paiForm.id !== '') {
          modifypaysList(this.paiForm.id, this.paiForm).then(res => {
            this.getPayListFunc()
          })
        } else {
          AddpaysList(this.paiForm).then(res => {
            this.getPayListFunc()
          })
        }
        if (this.switchvalue === true) {
          Paymentcomplete(this.paiForm.purchase_id).then(res => {
            this.getDataListFun()
            this.paidListDialog = false
          })
        }
        this.payaddDialog = false
      },
      PaymentEit(data) {
        // console.log(data);
        // console.log(this.ispaid_complete);
        // if(this.ispaid_complete == false){
        this.paytype = false
        // }
        // console.log(this.paiForm);
        this.paiForm.paid = data.paid
        this.paiForm.id = data.id
        this.paiForm.pay_time = data.pay_time
        this.paiForm.comment = data.comment
        this.paiForm.attach_file = data.attach_file
        if (data.attach_file !== '') {
          const obj = {
            name: data.attach_file,
            url: data.attach_file_conv
          }
          this.fileList[0] = obj
        } else {
          this.fileList = []
        }
        this.payaddDialog = true
      },
      Paycomplete(val) {
        if (val === 2) {
          this.paidListDialog = false
        }
      },
      addSkus() {
        this.skusDialog = true
        this.source = 1
        this.orderId = ''
        this.goodsId = ''
        this.goodsInventoryTable = []
        this.orderInfoData = []
      },
      setForm(data) {
        if (data) {
          return data
        } else {
          return {
            id: '',
            order_id: '',
            supplier_id: '',
            skus: '',
            currency: '',
            payment_term: '',
            delivery_method: '',
            comment: ''
          }
        }
      },
      getSupplierList() {
        suppliersList().then(res => {
          if (res.meta === 0) {
            this.supplierList = res.items
          }
        })
      },
      addData() {
        // this.currency = ''
        // this.payment_term = ''
        // this.delivery_method = ''
        this.form = this.setForm()
        this.skusArray = []
        this.formEditDialog = true
      },
      payaddData() {
        this.paytype = false
        this.paiForm.id = ''
        this.paiForm.paid = 0
        this.paiForm.pay_time = ''
        this.paiForm.comment = ''
        this.paiForm.attach_file = ''
        this.fileList = []
        this.payaddDialog = true
      },
      showDataEditor(data, show) {
        // console.log(data)
        this.form = this.setForm(data)
        if (show) {
          this.form.id = ''
        }
        // console.log('this.form', this.form)
        data.skus && data.skus.forEach(value => {
          value['id'] = value.sku_uid + value.specification
        })
        this.skusArray = data.skus
        this.formEditDialog = true
      },
      imageUploadSuccess(res) {
        this.form.image = res.md5
        console.log(res)
      },
      saveDataFunc() {
        this.submitDisabled = true
        this.form.skus = JSON.stringify(this.skusArray)
        // console.log(this.form)
        // console.log('this.skusArray', this.skusArray)
        if (this.form.id !== '') {
          purchaseModify(this.form.id, this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else {
          console.log(this.form);
          // this.form.currency = this.currency
          // this.form.payment_term = this.payment_term
          // this.form.delivery_method = this.delivery_method
          purchaseAdd(this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
      },
      getDataListFun() {
        purchaseList(this.searchForm).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
          // console.log(res.items);
        })
      },
      warehousing(data){
        this.switchtype = false
        console.log(data);
        this.showRukuBtn = data.status
        this.chuKuSearchForm.purchase_id = data.id
        this.stockfrom.purchase_id = data.id
        this.getstockinfo()
        this.getChuKuData()
        this.inwarehouseFrom.purchase_id = ''
        this.wareId = ''
        this.inwarehouseFrom.comment = ''
        this.inwarehouseFrom.purchase_id = data.id
        warehousesList(this.searchForm2).then(res=>{
          this.warelist = res.items
          console.log(res.items,'5555555');
        })
        this.dialogVisible = true
        this.inwarehouseData = data.skus
        console.log('this.inwarehouseData', this.inwarehouseData)
        // this.inwarehouseData.forEach(item => {
        //   item.count = 1
        // });
        this.inwarehouseData.forEach((item, k) => {
          this.$set(this.inwarehouseData[k], 'position', '')
        })
      },
      getstockinfo(){
        warehouseReceipts(this.stockfrom).then(res=>{
        this.totaldata = res.items
        this.itemCount_to = res.total
        })
      },
      addrukudata(){
        this.wareId = ''
        this.switchtype = false
        this.inwarehouselog = true
        this.inwarehouseFrom.status = ''
      },
      onchange(e){
        this.getlocationList()
      },
      // 仓库位置
      getlocationList(){
         if(this.wareId != ''){
            Locationlist(this.wareId).then(res=>{
            this.locas = res.items
          })
         }
      },
      handleSelectionChange(val) {
        this.inwarehouseFrom.skus = []
        this.inwarehouseFrom.skus = val
        console.log(this.inwarehouseFrom.skus);
      },
      // 确定入库
      inwarehouseAdd(){
        if(this.switchtype){
          this.inwarehouseFrom.status = 1
        }
        this.inwarehouseFrom.warehouse_id = this.wareId
        this.inwarehouseFrom.skus && this.inwarehouseFrom.skus.map(item => {
          item.count = Number(item.count)
        });
        this.flag = this.inwarehouseFrom.skus.every(item => {
          return item.position != ''
        });
        this.flag3 = this.inwarehouseFrom.skus.every(item => {
          return item.count != 0
        });
        if(this.switchtype == true){
          this.flag = true
        }
        if(this.flag == true){
          this.flag2 = this.inwarehouseFrom.skus.some(item => {
            return item.merchant_type_code.length == 0 || item.merchant_type_code == null

          });
            if(this.flag3){
             if(this.flag2 == false){
              this.inwarehouseFrom.skus.forEach(item => {
                const array = []
                array[0] = item.merchant_type_code[item.merchant_type_code.length -1]
                item.merchant_type_code = array
              });
              this.inwarehouseFrom.skus = JSON.stringify(this.inwarehouseFrom.skus)
              warehouseReceiptsAdd(this.inwarehouseFrom).then(res=>{
                if(res.meta == 0){
                  this.commentlog = false
                  this.inwarehouselog = false
                  this.$message(this.$t('warehouse.addsuccess'))
                  this.getstockinfo()
                }
              }).catch(res=>{
                this.inwarehouseFrom.skus = JSON.parse(this.inwarehouseFrom.skus)
              })
             }else{
              this.$message(this.$t('warehouse.goodstype'))
          }
           }else{
             this.$message(this.$t('warehouse.Msgt'))
           }
        }else{
          this.$message(this.$t('warehouse.placeLoc'))
        }
      },
      Searchlist(){
        this.getDataListFun()
      },
      Searchrukudata(){
        this.getstockinfo()
      },
      overBtn(){
        purchaseover(this.stockfrom.purchase_id).then(res=>{
          this.dialogVisible = false
          this.getDataListFun()
        })

      },
      Rukubtn(data){
        this.Rukufrom.skus = []
        this.RukufromSkus = []
        this.Rudalog = true
        console.log(data);
        this.rukuid = data.id
        this.Rukufrom.warehouse_id = data.warehouse_id
        this.RukufromSkus = data.skus
        this.Rukufrom.skus = data.skus
        console.log(this.Rukufrom.skus);
        Locationlist(data.warehouse_id).then(res=>{
          this.locas = res.items
        })
      },
      Rukuadd(){
         this.flag = this.RukufromSkus.every(item => {
          return item.position != ''
        });
        console.log(this.Rukufrom);
        if(this.flag == true){
          this.Rukufrom.skus = JSON.stringify(this.RukufromSkus)
          receiptsinventory(this.rukuid, this.Rukufrom).then(res=>{
            this.Rudalog = false
            // this.dialogVisible = false
            this.getstockinfo()
            this.$message(this.$t('warehouse.addsuccess'))
          }).catch(res=>{

          })
        }else{
          this.$message(this.$t('warehouse.placeLoc'))
        }
      },
      Returndata(data){
        this.returndalog = true
        this.returnFrom.warehouse_id = data.warehouse_id
        this.returnFrom.skus = []
        this.testfrom = data.skus
        this.returnFrom.receipt_id = data.id
        this.returnFrom.skus = JSON.stringify(this.returnFrom.skus)
      },
      getGoodstype(){
        spuTypesList({type:2}).then(response=>{
         if (response.meta === 0) {
          this.goodsTypeData = []
          if (response.items !== null) {
          this.goodsTypeData = response.items
          console.log(this.goodsTypeData,'55555556666666');
          }
        }
        })
      },
      handleChange(val){
        console.log(val);
      },
      handleSelectionChange3(val){
        this.returnFrom.skus = val
      },
      returnbtn(){
        this.returnFrom.skus.map(item => {
          item.count = Number(item.count)
        });
        this.returnFrom.skus = JSON.stringify(this.returnFrom.skus)
        warehouseOutboundsAdd(this.returnFrom).then(res=>{
          this.getstockinfo()
          this.Rudalog = false
          this.returndalog = false
        })
      }
    },
    mounted() {
      if (this.$route.params.status) {
        if (this.$route.params.status !== this.searchForm.status) {
          this.searchForm.skip = 0
          this.currentPage = 1
          this.tab_status = this.$route.params.status.toString()
          this.searchForm.status = this.$route.params.status
        }
      }
      this.getCount()
      this.getDataListFun()
      this.getSupplierList()
      this.getGoodstype()
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
  .totlaInv {
    height: 48px;
    font-size: 20px;
    display: flex;
    align-items: center;
    margin: 0 20px;
  }
.goodSkusBox {
  cursor: pointer;
  span {
    color: red;
  }
}
.add-btn{
  display: block;
  width: 100%;
  background-color: #f6f7f9;
  line-height: 50px;
  text-align: center;
  font-size: 14px;
  color: #88898a;
  &:hover{
    color: rgb(30, 66, 121);
  }
}
.tabletitle{
  width: 100%;
  border: 1px solid #f2f2f2;
  border-collapse: collapse;
  td{
    width: 100px;
    border: 1px solid #f2f2f2;
  }
  th{
    text-align: center;
  }
}
.goods{
  .odd{
    border-top: 1px solid #ccc;
    &:first-child{
      border: 0 none;
    }
  }
}
.box{
  display: flex;
  justify-content: space-between;
}
.searchbtn{
  display: flex;
  align-items: center;
}
.Msg{
  width: 100%;
  line-height: 100px;
  font-size: 17px;
  text-align: center;
  color: #909399;
}
.mar10{
  margin-top: 10px;
}
.mt{
  margin-top: -40px;
}
.searchbox{
  width: 200px;
  display: flex;
  align-items: center;
}
.numclass{
  display: flex;
  align-items: center;
  >span:nth-child(1){
    width: 70px;
  }
  >span{
    margin-right: 16px;
  }
}
.localcss{
  position: relative;
}
.overbtn{
  position: absolute;
  right: 100px;
  top: -38px;
}
.switchbox{
  width: 100%;
  text-align: right;
}
.otherShopLogo {
  width: 24px;
  height: 24px;
  margin-left: 8px;
  border: none;
}
</style>
