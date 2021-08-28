<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row type="flex" justify="end">
          <el-col :span="3" style="text-align: right; padding: 8px 0;">
            <el-button
              type="success"
              size="small"
              icon="el-icon-plus"
              @click="addData"
              v-if="permissionCheck('opt')"
            >
              {{ $t("tools.add") }}
            </el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table
                stripe
                border
                :data="tableData"
                height="calc(100% - 40px)"
              >
                <el-table-column label="#" width="60px">
                  <template slot-scope="scope">
                    {{ scope.$index + searchForm.skip + 1 }}
                  </template>
                </el-table-column>

                <el-table-column prop="name" :label="$t('operation.name')" />

                <el-table-column
                  prop="tel"
                  width="240"
                  :label="$t('operation.tel')"
                />

                <el-table-column
                  :label="$t('operation.address')"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{
                      scope.row.addr.province +
                        scope.row.addr.city +
                        scope.row.addr.district +
                        scope.row.addr.addr +
                        "(" +
                        scope.row.addr.coord.join(",") +
                        ")"
                    }}
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$t('operation.finishOrderQuantity')"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-button type="text" @click="showOrder(scope.row, 8)">
                      {{ scope.row.order_complete_count }}
                    </el-button>
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$t('operation.orderStock')"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-button type="text" @click="showOrder(scope.row, 4)">
                      {{ scope.row.order_store_count }}
                    </el-button>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="gen_time"
                  :label="$t('sys.addTime')"
                  width="200"
                />

                <el-table-column
                  :label="$t('tools.opt')"
                  width="180"
                  v-if="permissionCheck('opt')"
                >
                  <template slot-scope="scope">
                    <el-button @click="showDataEditor(scope.row)" size="small">
                      {{ $t("tools.edit") }}
                    </el-button>

                    <delete-button @delData="deleteDataFunc(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>

              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount"
                />
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- Dialog -->
        <el-dialog
          :title="$t('operation.selfPickStationSet')"
          width="600px"
          @close="formEditDialog = false"
          :visible.sync="formEditDialog"
          :close-on-click-modal="false"
          center
        >
          <el-form label-width="200px" label-position="left" :model="form">
            <el-form-item :label="$t('operation.name')">
              <el-input v-model="form.name" />
            </el-form-item>

            <el-form-item :label="$t('operation.tel')">
              <el-input v-model="form.tel" />
            </el-form-item>

            <el-form-item class="start" :label="$t('sys.address1')">
              <map-selector v-model="formAddress" />

              <div class="distpicker_error" v-if="placeShow">
                {{ $t("sys.selectAddress") }}
              </div>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <confirm-button
              @confirmButton="saveDataFunc()"
              :disabled="submitDisabled"
              :confirmButtonInfor="$t('tools.confirm')"
            />
            <el-button 
              @click="formEditDialog = false" 
              size="small" 
              style="margin-right:5px; margin-left:10px;">{{$t('tools.cancel')}}
            </el-button>

          </div>
        </el-dialog>

        <el-dialog
          :title="$t('operation.orderQuantity')"
          width="1400px"
          @close="orderDialog = false"
          :visible.sync="orderDialog"
          :close-on-click-modal="false"
          center
        >
          <div style="height: calc(100vh - 350px)">
            <el-row>
              <el-col :span="24">
                <el-form :inline="true" :model="searchOrder">
                  <el-form-item :label="$t('order.searchKey')">
                    <el-input
                      v-model="searchForm.key"
                      :placeholder="$t('order.searchKeyTip')"
                      style="width: 200px"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item :label="$t('order.no')">
                    <el-input
                      v-model="searchForm.no"
                      style="width: 200px"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item
                    :label="$t('order.orderTime')"
                    class="searchTimeBox"
                  >
                    <el-date-picker
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      clearable
                      style="width: 260px;"
                      v-model="orderTimes"
                      type="daterange"
                      align="right"
                      unlink-panels
                      :range-separator="$t('tools.to')"
                      :start-placeholder="$t('tools.startDate')"
                      :end-placeholder="$t('tools.endDate')"
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="searchOrderFunc"
                      size="mini"
                      icon="el-icon-search"
                    />
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>

            <el-table
              stripe
              border
              :data="tableDataOrder"
              height="calc(100% - 70px)"
            >
              <el-table-column label="#" width="60px" fixed="left">
                <template slot-scope="scope">
                  {{ scope.$index + searchForm.skip + 1 }}
                </template>
              </el-table-column>

              <!-- 单号 -->
              <el-table-column
                :label="$t('order.no')"
                width="200px"
                fixed="left"
              >
                <template slot-scope="scope">
                  <el-tag
                    style="display: block; width: 50px; margin: 0 auto"
                    v-if="scope.row.type === 2"
                    size="mini"
                  >
                    {{ $t("order.orderType2") }}
                  </el-tag>

                  <el-tag
                    style="display: block; width: 60px; margin: 0 auto"
                    v-if="scope.row.type === 3"
                    size="mini"
                  >
                    {{ $t("order.orderType3") }}
                  </el-tag>

                  <el-tag
                    style="display: block; width: 60px; margin: 0 auto"
                    v-if="scope.row.type === 4"
                    size="mini"
                  >
                    {{ $t("order.orderType4") }}
                  </el-tag>

                  No:{{ scope.row.no }}<br />

                  <span class="f12" v-if="scope.row.pay_id">
                    Id:{{ scope.row.pay_id }}
                  </span>

                  <br />

                  <el-popover
                    v-if="
                      scope.row.comment ||
                        (scope.row.merchant_comments &&
                          scope.row.merchant_comments.length > 0)
                    "
                    placement="right"
                    width="300"
                    trigger="click"
                  >
                    <template v-if="scope.row.comment">
                      <el-divider content-position="left">
                        {{ $t("order.userBz") }}
                      </el-divider>

                      <div style="padding: 0px 10px; text-align: left">
                        {{ scope.row.comment }}
                      </div>
                    </template>

                    <template
                      v-if="
                        scope.row.merchant_comments &&
                          scope.row.merchant_comments.length > 0
                      "
                    >
                      <el-divider content-position="left">
                        {{ $t("order.businessBz") }}
                      </el-divider>

                      <el-timeline style="margin-top: 10px">
                        <el-timeline-item
                          v-for="(comments, index) in scope.row
                            .merchant_comments"
                          :key="index"
                          :timestamp="comments.gen_time"
                        >
                          <div class="ui">
                            <span>{{ comments.operator_name }}</span>

                            {{ comments.comment }}
                          </div>
                        </el-timeline-item>
                      </el-timeline>
                    </template>

                    <a slot="reference" class="gt">
                      {{ $t("order.note") }}

                      <i class="el-icon-arrow-right" />
                    </a>
                  </el-popover>
                </template>
              </el-table-column>

              <!-- 下单时间 -->
              <el-table-column :label="$t('order.genTime')" width="170">
                <template slot-scope="scope">
                  <el-popover placement="left" width="300" trigger="click">
                    <el-timeline style="margin-top: 10px">
                      <el-timeline-item
                        v-for="(record, index) in scope.row.operation_records"
                        :key="index"
                        :timestamp="record.time"
                      >
                        <div class="ui">
                          <span>
                            {{ record.operator_name }}
                          </span>

                          {{ optArr[record.status] }}
                        </div>
                      </el-timeline-item>
                    </el-timeline>

                    <a slot="reference" class="gt">
                      <i class="el-icon-arrow-left" />

                      {{ scope.row.gen_time }}
                    </a>
                  </el-popover>
                </template>
              </el-table-column>

              <!-- 所有者 -->
              <el-table-column :label="$t('order.servicer_id')" width="170">
                <template slot-scope="scope">
                  <el-popover
                    v-if="scope.row.servicer_operations"
                    placement="left"
                    width="300"
                    trigger="click"
                  >
                    <el-timeline style="margin-top: 10px">
                      <el-timeline-item
                        v-for="(record, index) in scope.row.servicer_operations"
                        :key="index"
                        :timestamp="record.time"
                      >
                        <div class="ui">
                          <span>{{ record.receiver_name }}</span>

                          {{ servicerOptArr[record.tp] }}
                        </div>
                      </el-timeline-item>
                    </el-timeline>

                    <a slot="reference" class="gt">
                      <i class="el-icon-arrow-left" />
                      {{
                        scope.row.servicer_operations
                          ? scope.row.servicer_operations[
                              scope.row.servicer_operations.length - 1
                            ].receiver_name
                          : ""
                      }}
                    </a>
                  </el-popover>

                  <div>
                    <el-button
                      v-if="scope.row.servicer_status === 1"
                      type="text"
                      size="small"
                    >
                      {{ $t("order.ownerShipGet") }}
                    </el-button>

                    <el-popover
                      v-if="scope.row.servicer_status === 3"
                      placement="left"
                      width="200"
                      trigger="click"
                    >
                      <el-select v-model="ownerShipSelectUserId">
                        <el-option
                          v-for="item in customerMgrList"
                          :key="item.user_nick_name"
                          :label="item.user_nick_name"
                          :value="item.user_id"
                        >
                        </el-option>
                      </el-select>

                      <div style="text-align:center;">
                        <el-button
                          type="text"
                          @click="orderOwnerShipTransFunc(scope.row.id)"
                          size="medium"
                        >
                          {{ $t("tools.confirm") }}
                        </el-button>

                        <el-button
                          type="text"
                          @click="orderOwnerShipTransFunc(scope.row.id, '')"
                          size="medium"
                        >
                          {{ $t("order.cancelClaim") }}
                        </el-button>
                      </div>

                      <a slot="reference" class="gt">
                        <i class="el-icon-arrow-left" />

                        {{ $t("order.transOwnerShip") }}
                      </a>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>

              <!-- 用户 -->
              <el-table-column :label="$t('order.user')" width="130">
                <template slot-scope="scope">
                  <div class="ui">{{ scope.row.user_nick_name }}</div>

                  <div class="ui">{{ scope.row.user_mobile }}</div>
                </template>
              </el-table-column>

              <!-- 商品 -->
              <el-table-column :label="$t('order.goods')" min-width="400">
                <template slot-scope="scope">
                  <div
                    class="goods-item"
                    v-for="(gInfo, k) in scope.row.merchant_item.goods_items"
                    :key="k"
                  >
                    <img
                      class="image imagecss"
                      @click="jumpGoodsPage(gInfo.goods_info, scope.row.type)"
                      :src="getImageUrl(gInfo.goods_info.sku_img, 100)"
                    />

                    <div class="g-info">
                      <p
                        @click="jumpGoodsPage(gInfo.goods_info, scope.row.type)"
                        style="display: flex;align-items: center;line-height: 15px"
                      >
                        {{ gInfo.goods_info.spu_name }}

                        <img
                          :src="otherLogo(gInfo.goods_info.site_id)"
                          class="otherShopLogo"
                          v-if="
                            scope.row.type === 5 && gInfo.goods_info.site_id
                          "
                          alt=""
                        />

                        <el-tag v-if="gInfo.goods_info.gift" size="mini">
                          {{ $t("order.gift") }}
                        </el-tag>

                        <el-tag
                          v-if="gInfo.after_saled"
                          style="cursor: pointer"
                          type="danger"
                          size="mini"
                          @click.stop="showReturn(scope.row, gInfo)"
                        >
                          {{ $t("order.afterSale") }}
                        </el-tag>
                      </p>

                      <p
                        style="line-height: 15px;"
                        @click="jumpGoodsPage(gInfo.goods_info, scope.row.type)"
                      >
                        <span
                          v-for="(v, k) in gInfo.goods_info.specifications"
                          :key="k"
                        >
                          {{ k }}：<font>{{ v }}</font>
                        </span>
                      </p>

                      <div
                        @click="jumpGoodsPage(gInfo.goods_info, scope.row.type)"
                      >
                        <span>{{ $t("order.price3") }}：</span>

                        <template v-if="scope.row.type === 3">
                          {{ gInfo.goods_info.price }}
                        </template>

                        <template v-else>
                          {{ gInfo.goods_info.price | price }} </template
                        >；
                        <span>{{ $t("order.number") }}：</span>
                        {{ gInfo.goods_info.count }}
                      </div>

                      <div
                        v-if="scope.row.type === 5 && gInfo.goods_info.site_id"
                      >
                        <div
                          v-if="goodsOid !== gInfo.goods_info.oid"
                          style="color: #1E88E5"
                        >
                          {{ gInfo.goods_info.comment }}
                          <span v-if="gInfo.goods_info.comment !== ''">
                            --- {{ gInfo.goods_info.comment_time }}</span
                          >
                          <i
                            class="el-icon-edit"
                            style="color: #1E88E5"
                            v-if="goodsOid !== gInfo.goods_info.oid"
                            @click.stop="
                              showCommentGoods(gInfo.goods_info, scope.row.id)
                            "
                          />
                        </div>

                        <el-input
                          v-if="goodsOid === gInfo.goods_info.oid"
                          v-model="gInfo.goods_info.comment"
                          @blur="commentChange(gInfo.goods_info.comment)"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <!-- 金额 -->
              <el-table-column :label="$t('order.price')" width="130">
                <template slot-scope="scope">
                  <span :title="$t('order.price1') + '+' + $t('order.price2')">
                    <template v-if="scope.row.pay_points > 0">
                      *{{ scope.row.pay_points }}+</template
                    >
                    {{ scope.row.pay_price | price }}</span
                  >
                  <span v-if="scope.row.pay_way">
                    ({{ payWay(scope.row.pay_way) }})
                  </span>

                  <br />

                  <span>
                    ({{ $t("order.includePostage") }}：{{
                      scope.row.postage | price
                    }})
                  </span>

                  <div class="ui">
                    <span>{{ $t("order.payMethod") }}：</span>

                    {{ payMethod[scope.row.pay_way_top - 1] }}
                  </div>
                </template>
              </el-table-column>

              <!-- 地址 -->
              <el-table-column
                :label="$t('order.address')"
                style="text-align: left"
                min-width="300"
              >
                <template slot-scope="scope">
                  <div class="ui">
                    <span>{{ $t("order.expressAddr") }}：</span>

                    {{
                      scope.row.shipping_address.address.province +
                        scope.row.shipping_address.address.city +
                        scope.row.shipping_address.address.district
                    }}
                    {{ scope.row.shipping_address.address.addr }}
                  </div>

                  <div class="ui">
                    <span>{{ $t("order.expressUser") }}：</span>

                    {{ scope.row.shipping_address.contacter_name }}&nbsp;&nbsp;
                    {{ scope.row.shipping_address.mobile }}
                  </div>

                  <div class="ui">
                    <span>{{ $t("order.deliveryMethod") }}：</span>

                    {{ deliveryMethod[scope.row.post_way - 1] }}

                    <span v-if="scope.row.post_way === 2">
                      ({{ scope.row.check_code }})&nbsp;&nbsp;{{
                        scope.row.self_pickup_station.name
                      }}
                    </span>
                  </div>
                </template>
              </el-table-column>

              <!-- 状态 -->
              <el-table-column :label="$t('order.status')" width="90">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status !== 17">
                    {{ orderStatus[scope.row.status] }}
                  </el-tag>

                  <el-tag v-else>{{ $t("order.purchasPendReview") }}</el-tag>

                  <span
                    style="font-size: 12px"
                    v-if="
                      (scope.row.status === 4 || scope.row.status === 5) &&
                        scope.row.pay_way_top === 2
                    "
                  >
                    ({{ $t("order.cashOnDelivery") }})
                  </span>
                </template>
              </el-table-column>
            </el-table>

            <el-row style="margin-top: 10px">
              <el-col :span="24" style="text-align: right;">
                <el-pagination
                  v-if="itemCountOrder > 0"
                  :current-page.sync="currentPageOrder"
                  :page-size.sync="pageSizeOrder"
                  :page-sizes="[10, 30, 50, 100, 500]"
                  layout="total, prev, pager, next, jumper,sizes"
                  :total="itemCountOrder"
                />
              </el-col>
            </el-row>
          </div>

          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="orderDialog = false">
              {{ $t("tools.cancel") }}
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ordersList } from "@/api/order";
import {
  selfPickStations,
  selfPickStationsModify,
  selfPickStationsList,
  selfPickStationsDel
} from "@/api/operation";
export default {
  components: {},
  data() {
    const formData = this.setForm();
    const pz = 10;
    return {
      timeValidSwitch: true,
      searchForm: {
        skip: 0,
        limit: pz
      },
      tableData: [],
      currentPage: 1,
      pageSize: pz,
      itemCount: 0,
      form: formData,
      formAddress: {
        province: "",
        city: "",
        area: "",
        address: "",
        lon: 104.917445,
        lat: 11.558831
      },
      placeShow: false,
      placeChecked: false,
      formEditDialog: false,
      submitDisabled: false,
      orderDialog: false,
      deliveryMethod: [
        this.$t("order.expressDelivery"),
        this.$t("order.selfMention"),
        this.$t("order.rider")
      ],
      payMethod: [
        this.$t("order.onlinePay"),
        this.$t("order.cashOnDelivery"),
        this.$t("order.overdraft")
      ],
      orderStatus: [
        this.$t("tools.all"),
        this.$t("order.status1"),
        this.$t("order.status2"),
        this.$t("order.status3"),
        this.$t("order.status4"),
        this.$t("order.status5"),
        this.$t("order.status6"),
        this.$t("order.status7"),
        this.$t("order.status8"),
        "",
        this.$t("order.status10")
      ],
      optArr: {
        2: this.$t("order.opt2"),
        4: this.$t("order.opt4"),
        5: this.$t("order.opt5"),
        6: this.$t("order.opt6"),
        7: this.$t("order.opt7"),
        8: this.$t("order.opt8"),
        9: this.$t("order.opt9")
      },
      servicerOptArr: {
        1: this.$t("order.servicerOpt1"),
        2: this.$t("order.servicerOpt2"),
        3: this.$t("order.cancelClaim")
      },
      searchOrder: {
        self_pickup_station_id: "",
        order_status: "",
        skip: 0,
        limit: 10,
        no: "",
        key: "",
        bt: "",
        et: ""
      },
      tableDataOrder: [],
      currentPageOrder: 1,
      pageSizeOrder: pz,
      itemCountOrder: 0,
      orderTimes: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    currentPage(val) {
      this.searchForm.skip = (val - 1) * this.pageSize;
      this.searchForm.limit = this.pageSize;
      this.getDataListFun();
    },
    // 按时间段查询订单
    orderTimes(val) {
      if (val && val.length === 2) {
        this.searchOrder.bt = val[0];
        this.searchOrder.et = val[1];
      } else {
        this.searchOrder.bt = "";
        this.searchOrder.et = "";
      }
    },
    currentPageOrder(val) {
      this.searchOrder.skip = (val - 1) * this.pageSizeOrder;
      this.searchOrder.limit = this.pageSizeOrder;
      this.getOrder();
    }
  },
  methods: {
    showOrder(data, number) {
      this.orderDialog = true;
      this.searchOrder.self_pickup_station_id = data.id;
      this.searchOrder.order_status = number;
      this.getOrder();
    },
    // 订单列表
    getOrder() {
      ordersList(this.searchOrder).then(res => {
        this.tableDataOrder = res.items ? res.items : [];
        this.itemCountOrder = res.total;
      });
    },
    searchOrderFunc() {
      this.searchOrder.skip = 0;
      this.currentPageOrder = 1;
      this.getOrder();
    },
    otherLogo(text) {
      // console.log(text);
      if (text === "JinDong") {
        return require("../../assets/images/jingdong.png");
      } else if (text === "Tmal") {
        return require("../../assets/images/tianmao.png");
      } else if (text === "Taobao") {
        return require("../../assets/images/taobao.png");
      } else if (text === "Suning") {
        return require("../../assets/images/suning.jpeg");
      } else if (text === "Kaola") {
        return require("../../assets/images/kaola.jpeg");
      } else if (text === "Dangdang") {
        return require("../../assets/images/dangdang.jpeg");
      } else if (text === "Amazon") {
        return require("../../assets/images/yamaxun.png");
      } else if (text === "1688") {
        return require("../../assets/images/1688.png");
      } else if (text === "1689") {
        return require("../../assets/images/1689.png");
      }
    },
    jumpGoodsPage(data, type) {
      if (type !== undefined) {
        // console.log(data);
        if (type === 5) {
          // 代购订单
          // console.log('data.sku_url', data.sku_url)
          if (data.sku_url === "") {
            window.open("https://www.a9kh.com/goods/" + data.spu_id + ".html");
          } else {
            window.open(data.sku_url);
          }
        } else {
          window.open("https://www.a9kh.com/goods/" + data.spu_id + ".html");
        }
      } else {
        if (data.sku_url !== "") {
          window.open(data.sku_url);
        } else {
          window.open("https://www.a9kh.com/goods/" + data.spu_id + ".html");
        }
      }
    },
    showReturn(row, gInfo) {
      // console.log(gInfo);
      if (gInfo.after_sale_type === 1 || gInfo.after_sale_type === 3) {
        this.$router.push({
          name: "orderReturn",
          params: { order_no: row.no }
        });
      } else if (gInfo.after_sale_type === 2) {
        this.$router.push({
          name: "orderExchange",
          params: { order_no: row.no }
        });
      }
    },

    placeCheck() {
      if (
        this.formAddress.province !== "" &&
        this.formAddress.city !== "" &&
        this.formAddress.area !== "" &&
        this.formAddress.address !== "" &&
        this.formAddress.lat !== "" &&
        this.formAddress.lon !== ""
      ) {
        this.placeShow = false;
        this.placeChecked = true;
      } else {
        this.placeShow = true;
        this.placeChecked = false;
      }
    },
    setForm(data) {
      if (data) {
        return data;
      } else {
        return {
          id: "",
          name: "",
          tel: "",
          addr: ""
        };
      }
    },
    addData() {
      this.form = this.setForm();
      this.formAddress = {
        province: "",
        city: "",
        area: "",
        address: "",
        lon: 104.917445,
        lat: 11.558831
      };
      this.formEditDialog = true;
    },
    showDataEditor(data) {
      console.log(data);
      // this.form = this.setForm(data)
      this.form.name = data.name;
      this.form.id = data.id;
      this.form.tel = data.tel;
      this.form.addr = JSON.stringify(data.addr);
      const addr = data.addr;
      const obj = {
        province: addr.province,
        city: addr.city,
        area: addr.district,
        address: addr.addr,
        lon: addr.coord[0],
        lat: addr.coord[1]
      };
      this.formAddress = obj;
      this.formEditDialog = true;
    },
    imageUploadSuccess(res) {
      this.form.image = res.md5;
      console.log(res);
    },
    saveDataFunc() {
      this.submitDisabled = true;
      const addrForm = {
        province: this.formAddress.province,
        city: this.formAddress.city,
        district: this.formAddress.area,
        addr: this.formAddress.address,
        coord: [
          parseFloat(this.formAddress.lon),
          parseFloat(this.formAddress.lat)
        ]
      };
      this.form.addr = JSON.stringify(addrForm);
      this.placeCheck();
      if (this.placeChecked === false) {
        this.$message.error(this.$t("sys.pleaseFillCompleteAddr"));
        this.submitDisabled = false;
        return;
      }
      console.log("addr", this.form);
      if (this.form.id !== "") {
        selfPickStationsModify(this.form.id, this.form)
          .then(res => {
            this.getDataListFun();
            this.formEditDialog = false;
            this.submitDisabled = false;
          })
          .catch(() => {
            this.submitDisabled = false;
          });
      } else {
        selfPickStations(this.form)
          .then(res => {
            this.getDataListFun();
            this.formEditDialog = false;
            this.submitDisabled = false;
          })
          .catch(() => {
            this.submitDisabled = false;
          });
      }
    },
    deleteDataFunc(row) {
      selfPickStationsDel(row.id).then(res => {
        this.getDataListFun();
      });
    },
    getDataListFun() {
      selfPickStationsList(this.searchForm).then(res => {
        this.tableData = res.items;
        this.itemCount = res.total;
      });
    }
  },
  mounted() {
    this.getDataListFun();
  },
  created() {}
};
</script>

<style lang="scss" scoped></style>
