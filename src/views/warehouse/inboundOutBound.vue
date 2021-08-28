<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <el-row class="rightbox">
        <el-col :span="24">
          <el-tabs v-model="activeChuRuKu">
            <el-tab-pane
              :label="$t('warehouse.enterlist')"
              name="1"
            ></el-tab-pane>
            <el-tab-pane
              :label="$t('warehouse.outlist')"
              name="2"
            ></el-tab-pane>
          </el-tabs>
          <div v-if="activeChuRuKu === '1'">
            <el-row>
              <el-col :span="18" style="margin-bottom: 15px">
                <el-form :inline="true" :model="rukuSearchForm">
                  <el-form-item>
                    <el-date-picker
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd HH:mm"
                      clearable
                      v-model="rukuTimes"
                      type="daterange"
                      align="right"
                      unlink-panels
                      :range-separator="$t('tools.to')"
                      :start-placeholder="$t('tools.startDate')"
                      :end-placeholder="$t('tools.endDate')"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-select
                      v-model="rukuSearchForm.tp"
                      clearable
                      style="width: 300px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input
                      v-model="rukuSearchForm.key"
                      clearable
                      style="width: 300px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item class="searchBtn">
                    <el-button
                      type="primary"
                      @click="dataSearch"
                      size="small"
                      icon="el-icon-search"
                    ></el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="6" align="right" v-if="permissionCheck('opt')">
                <el-button
                  size="small"
                  icon="el-icon-upload2"
                  type="success"
                  style="
                    margin-top: 5px;
                  "
                  @click="exportRuKu"
                  >{{ $t("warehouse.exportData3") }}</el-button
                >
              </el-col>
            </el-row>
            <el-table
              border
              ref="rukuTable"
              :data="rukuData"
              @selection-change="rukuChangeChoose"
              height="calc(100vh - 270px)"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="#" width="60px" fixed="left">
                <template slot-scope="scope">
                  {{ scope.$index + rukuSearchForm.skip + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="no"
                :label="$t('warehouse.number')"
                width="120px"
                fixed="left"
              ></el-table-column>
              <el-table-column
                prop="pu_no"
                :label="$t('warehouse.pu_no')"
                width="140px"
              ></el-table-column>
              <el-table-column
                prop="comment"
                :label="$t('warehouse.remarks')"
                width="150px"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="warehouse_name"
                :label="$t('warehouse.name')"
                show-overflow-tooltip
                width="200px"
              ></el-table-column>
              <el-table-column
                prop="supplier_name"
                :label="$t('warehouse.SupplierNmae')"
                show-overflow-tooltip
                width="200px"
              ></el-table-column>
              <el-table-column width="1200px">
                <template slot-scope="scope" slot="header">
                  <el-row style="width: 100%">
                    <el-col :span="6">{{ $t("warehouse.Tradename") }}</el-col>
                    <el-col :span="3" style="text-align: center">{{
                      $t("warehouse.position")
                    }}</el-col>
                    <el-col :span="6" style="text-align: center">{{
                      $t("warehouse.pecifications")
                    }}</el-col>
                    <el-col :span="3" style="text-align: center">{{
                      $t("warehouse.barCode")
                    }}</el-col>
                    <el-col
                      :span="2"
                      v-if="permissionCheck('opt', '9_3')"
                      style="text-align: center"
                      >{{ $t("warehouse.price") }}</el-col
                    >
                    <el-col :span="2" style="text-align: center">{{
                      $t("warehouse.num")
                    }}</el-col>
                    <el-col
                      :span="2"
                      v-if="permissionCheck('opt', '9_3')"
                      style="text-align: center"
                      >{{ $t("warehouse.allprice") }}</el-col
                    >
                  </el-row>
                </template>
                <template slot-scope="scope">
                  <div class="goods">
                    <el-row
                      v-for="(item, k) in scope.row.skus"
                      :key="k"
                      class="odd"
                      style="width: 100%"
                    >
                      <el-col
                        :span="6"
                        class="overOmitted"
                        style="padding: 20px; word-break: normal"
                        ><span :title="item.name">{{ item.name }}</span></el-col
                      >
                      <el-col
                        :span="3"
                        style="padding: 20px; text-align: center"
                        >{{
                          item.position !== "" ? item.position : "No"
                        }}</el-col
                      >
                      <el-col
                        :span="6"
                        class="overOmitted"
                        style="padding: 20px; word-break: normal"
                        ><span :title="textFilter(item.specification)">{{
                          textFilter(item.specification) !== ""
                            ? textFilter(item.specification)
                            : "No"
                        }}</span></el-col
                      >
                      <el-col
                        :span="3"
                        style="text-align: center; padding: 20px"
                        >{{ item.barcode !== "" ? item.barcode : "No" }}</el-col
                      >
                      <el-col
                        :span="2"
                        v-if="permissionCheck('opt', '9_3')"
                        style="
                          text-align: center;
                          padding: 20px;
                          font-weight: bold;
                          color: black;
                        "
                        >{{ item.unit_price | price }}</el-col
                      >
                      <el-col
                        :span="2"
                        style="text-align: center; padding: 20px"
                        >{{ item.count }}</el-col
                      >
                      <el-col
                        :span="2"
                        v-if="permissionCheck('opt', '9_3')"
                        style="
                          text-align: center;
                          padding: 20px;
                          font-weight: bold;
                          color: black;
                        "
                        >{{ item.total_price | price }}</el-col
                      >
                    </el-row>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="gen_time"
                :label="$t('warehouse.time')"
                width="160px"
              ></el-table-column>
              <el-table-column
                prop="adder_name"
                :label="$t('warehouse.Operator')"
                width="180px"
              ></el-table-column>
            </el-table>
            <div style="text-align: right; margin-top: 10px">
              <el-pagination
                :current-page.sync="currentPageruku"
                :page-size="pageSizeruku"
                layout="total, prev, pager, next, jumper"
                :total="itemCountruku"
              ></el-pagination>
            </div>
          </div>
          <div v-show="activeChuRuKu === '2'">
            <el-row class="container" style="margin-bottom: 15px">
              <el-col :span="16">
                <el-form :inline="true" :model="chuKuSearchForm">
                  <el-form-item>
                    <el-date-picker
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      clearable
                      v-model="orderTimes"
                      type="daterange"
                      align="right"
                      unlink-panels
                      :range-separator="$t('tools.to')"
                      :start-placeholder="$t('tools.startDate')"
                      :end-placeholder="$t('tools.endDate')"
                      style="width: 260px"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item :label="$t('warehouse.type')">
                    <el-select
                      v-model="chuKuSearchForm.tp"
                      clearable
                      style="width: 150px"
                    >
                      <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('order.status')">
                    <el-select v-model="chuKuSearchForm.status" clearable>
                      <el-option
                        v-for="item in optionStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input
                      v-model="chuKuSearchForm.key"
                      :placeholder="$t('sys.search')"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="search"
                      size="small"
                      icon="el-icon-search"
                    ></el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8" align="right" v-if="permissionCheck('opt')">
                <el-button
                  size="small"
                  icon="el-icon-upload2"
                  style="
                    font-size: 12px;
                  "
                  type="success"
                  @click="exportChuKu_ExpressNote"
                  >{{ $t("warehouse.exportData4") }}</el-button
                >
                <el-button
                  size="small"
                  icon="el-icon-upload2"
                  style="
                    font-size: 12px;
                  "
                  type="success"
                  @click="exportChuKu_deliverynote"
                  >{{ $t("warehouse.exportData2") }}</el-button
                >
                <el-button
                  size="small"
                  icon="el-icon-upload2"
                  style="
                    font-size: 12px;
                  "
                  type="success"
                  @click="exportChuKu"
                  >{{ $t("warehouse.exportData") }}</el-button
                >
              </el-col>
            </el-row>
            <el-table
              border
              @selection-change="ChukuChangeChoose"
              :data="chukuData"
              height="calc(100vh - 270px)"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                label="#"
                width="60px"
                align="center"
                fixed="left"
              >
                <template slot-scope="scope">
                  {{ scope.$index + chuKuSearchForm.skip + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="no"
                :label="$t('warehouse.number')"
                width="130px"
                fixed="left"
              ></el-table-column>
              <el-table-column
                prop="warehouse_name"
                :label="$t('warehouse.name')"
                width="200px"
              ></el-table-column>
              <el-table-column :label="$t('warehouse.type')" width="100px">
                <template slot-scope="scope">
                  <span v-if="scope.row.tp === 1">{{
                    $t("warehouse.order")
                  }}</span>
                  <span v-if="scope.row.tp === 2">{{
                    $t("warehouse.Scrap")
                  }}</span>
                  <span v-if="scope.row.tp === 3">{{
                    $t("warehouse.return")
                  }}</span>
                  <span v-if="scope.row.tp === 4">{{
                    $t("warehouse.Internaluse")
                  }}</span>
                </template>
              </el-table-column>
                            <el-table-column
                :label="$t('order.status')"
                width="240px"
              >
                <template slot-scope="scope">
                  <el-tag
                    type="warning"
                    v-if="scope.row.status === 1 || scope.row.status === 0"
                    >{{ $t("warehouse.pendingProcurementReview") }}</el-tag
                  >
                  <el-tag type="info" v-if="scope.row.status === 2">{{
                    $t("warehouse.daiInvConfirm")
                  }}</el-tag>
                  <el-tag type="success" v-if="scope.row.status === 3">{{
                    $t("warehouse.invConfirmComplete")
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="relation_order_no"
                :label="$t('order.Relatedorders')"
                width="200px"
              >
                <template slot-scope="scope">
                  <a
                    class="textcolor"
                    @click="Orderinfo(scope.row.relation_order_no)"
                    v-if="scope.row.tp === 1"
                    >{{ scope.row.relation_order_no }}</a
                  >
                  <a class="textcolor" v-if="scope.row.tp !== 1">/</a>
                </template>
              </el-table-column>
              <el-table-column width="1200px">
                <template slot-scope="scope" slot="header">
                  <el-row style="width: 100%">
                    <el-col :span="6">{{ $t("warehouse.Tradename") }}</el-col>
                    <el-col :span="3" style="text-align: center">{{
                      $t("warehouse.position")
                    }}</el-col>
                    <el-col :span="6" style="text-align: center">{{
                      $t("warehouse.pecifications")
                    }}</el-col>
                    <el-col :span="3" style="text-align: center">{{
                      $t("warehouse.barCode")
                    }}</el-col>
                    <el-col
                      :span="2"
                      v-if="permissionCheck('opt', '9_3')"
                      style="text-align: center"
                      >{{ $t("warehouse.price") }}</el-col
                    >
                    <el-col :span="2" style="text-align: center">{{
                      $t("warehouse.num")
                    }}</el-col>
                    <el-col
                      :span="2"
                      v-if="permissionCheck('opt', '9_3')"
                      style="text-align: center"
                      >{{ $t("warehouse.allprice") }}</el-col
                    >
                  </el-row>
                </template>
                <template slot-scope="scope">
                  <div class="goods">
                    <el-row
                      v-for="(item, k) in scope.row.skus"
                      :key="k"
                      class="odd"
                      style="width: 100%"
                    >
                      <el-col
                        :span="6"
                        class="overOmitted"
                        style="padding: 15px"
                        ><span :title="item.name">{{ item.name }}</span></el-col
                      >
                      <el-col
                        :span="3"
                        style="text-align: center; padding: 15px"
                        >{{
                          item.position !== "" ? item.position : "No"
                        }}</el-col
                      >
                      <el-col
                        :span="6"
                        class="overOmitted"
                        style="text-align: center; padding: 15px"
                        ><span :title="textFilter(item.specification)">{{
                          textFilter(item.specification)
                        }}</span></el-col
                      >
                      <el-col
                        :span="3"
                        style="text-align: center; padding: 15px"
                        >{{ item.barcode !== "" ? item.barcode : "No" }}</el-col
                      >
                      <el-col
                        :span="2"
                        v-if="permissionCheck('opt', '9_3')"
                        style="
                          text-align: center;
                          padding: 15px;
                          font-weight: bold;
                          color: black;
                        "
                        >{{ item.unit_price | price }}</el-col
                      >
                      <el-col
                        :span="2"
                        style="text-align: center; padding: 15px"
                        >{{ item.count }}</el-col
                      >
                      <el-col
                        :span="2"
                        v-if="permissionCheck('opt', '9_3')"
                        style="
                          text-align: center;
                          padding: 15px;
                          font-weight: bold;
                          color: black;
                        "
                        >{{ item.total_price | price }}</el-col
                      >
                    </el-row>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="shipping_address"
                :label="$t('warehouse.Address')"
                width="250px"
                style="word-break: normal"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.shipping_address != null">
                    {{ scope.row.shipping_address.address.province }}-
                    {{ scope.row.shipping_address.address.city }}-
                    {{ scope.row.shipping_address.address.district }}-
                    {{ scope.row.shipping_address.address.addr }}
                  </span>
                  <span v-if="scope.row.shipping_address == null">{{
                    $t("warehouse.noinformation")
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="shipping_address"
                :label="$t('warehouse.Courierinformation')"
                width="260px"
                style="word-break: normal"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.express == null">{{
                    $t("warehouse.noinformation")
                  }}</span>
                  <span v-if="scope.row.express != null">
                    <div style="padding: 5px">
                      <b>{{ $t("warehouse.corporateName") }}</b
                      >: {{ scope.row.express.company }}
                    </div>
                    <div style="padding: 5px">
                      <b>{{ $t("warehouse.Singlenumber") }}</b
                      >: {{ scope.row.express.novar }}
                    </div>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="gen_time"
                :label="$t('warehouse.time')"
                width="180px"
              ></el-table-column>
              <el-table-column
                prop="adder_name"
                :label="$t('warehouse.Operator')"
                width="180px"
              ></el-table-column>
              <el-table-column
                prop="receiver_name"
                :label="$t('order.tiHuoRen')"
                width="180px"
              ></el-table-column>
              <el-table-column
                :label="$t('tools.opt')"
                width="200px"
                fixed="right"
                v-show="
                  permissionCheck('opt', '8_1') ||
                  permissionCheck('opt', '8_3') ||
                  permissionCheck('opt', '8_5')
                "
                align="center"
                header-align="left"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="shengheFuncChuku(scope.row.id, 2, '')"
                    v-if="
                      (scope.row.status === 1 || scope.row.status === 0) &&
                      permissionCheck('opt', '8_3')
                    "
                    size="small"
                    >{{ $t("warehouse.caigoushenghe") }}</el-button
                  >
                  <!--<el-button type="text" @click="shengheFuncChuku(scope.row.id, 3)" v-if="scope.row.status === 2  && permissionCheck('opt', '8_1')" size="small">{{$t('warehouse.invConfirm')}}</el-button>-->
                  <el-button
                    type="text"
                    @click="shengheFunc(scope.row)"
                    v-if="
                      scope.row.status === 2 && permissionCheck('opt', '8_1')
                    "
                    size="small"
                    >{{ $t("warehouse.invConfirm") }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="12" style="display: flex; align-items: center">
                <span class="totlaInv"
                  ><b>{{ $t("warehouse.goodsChuKuCount") }}</b
                  >：<b>{{ chukuGoodsNumber }}</b></span
                >
              </el-col>
              <el-col :span="12">
                <div style="text-align: right; margin-top: 10px">
                  <el-pagination
                    :current-page.sync="currentPagechuku"
                    :page-size="pageSizechuku"
                    layout="total, prev, pager, next, jumper"
                    :total="itemCountchuku"
                  ></el-pagination>
                </div>
              </el-col>
            </el-row>
            <el-dialog
              width="500px"
              :visible.sync="visibleShengHe"
              append-to-body
            >
              <span slot="title" style="font-weight: bold; font-size: 15px">{{
                $t("order.setTiHuoRen") + "-" + titleStr
              }}</span>
              <el-form label-width="120px">
                <el-form-item :label="$t('order.tiHuoRen')">
                  <el-input
                    v-model="receiver_name"
                    clearable
                    :placeholder="$t('order.pleaseEnterTiHuoren')"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button size="small" type="success" @click="submitBtn">{{
                  $t("tools.confirm")
                }}</el-button>
                 <el-button @click="visibleShengHe = false" size="small" style="margin-right: 5px; margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
              </div>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  warehouseReceipts,
  warehouseOutboundReview,
  warehouseReceiptsExport,
  warehouseOutboundsExport,
  warehouseOutbounds,
  warehouseDeliveryNoteExport,
  warehouseExpressNote,
} from "@/api/warehouse";
export default {
  data() {
    const pz = 10;
    return {
      visibleShengHe: false,
      rukuData: [],
      currentPageruku: 1,
      pageSizeruku: pz,
      itemCountruku: 0,
      activeChuRuKu: "1",
      chuKuSearchForm: {
        key: "",
        tp: "",
        warehouse_id: "",
        status: "", // 1待采购审核 2待仓库确认 3仓库确认完成
        bt: "",
        et: "",
        skip: 0,
        limit: pz,
      },
      chukuData: [],
      currentPagechuku: 1,
      pageSizechuku: pz,
      itemCountchuku: 0,
      skusArray: [],
      orderTimes: [],
      // 入库单列表信息
      rukuSearchForm: {
        tp: "",
        key: "",
        bt: "",
        et: "",
        purchase_id: "",
        warehouse_id: "",
        supplier_id: "",
        skip: 0,
        limit: 10,
      },
      options: [
        { value: "1", label: this.$t("warehouse.inpuWarehouse2") },
        { value: "2", label: this.$t("warehouse.Returnexchange") },
      ],
      options2: [
        { value: "1", label: this.$t("warehouse.Orderdelivery2") },
        { value: "2", label: this.$t("warehouse.Scrap") },
        { value: "3", label: this.$t("warehouse.return") },
        { value: "5", label: this.$t("warehouse.specialSale") },
      ],
      rukuTimes: [],
      optionStatus: [
        {
          label: this.$t("warehouse.all"),
          value: 0,
        },
        {
          label: this.$t("warehouse.pendingProcurementReview"),
          value: 1,
        },
        {
          label: this.$t("warehouse.daiInvConfirm"),
          value: 2,
        },
        {
          label: this.$t("warehouse.invConfirmComplete"),
          value: 3,
        },
      ],
      chukuGoodsNumber: 0,
      rukuIdsExport: [],
      chukuIdsExport: [],
      formCang: {
        status: "",
        receiver_name: "",
      },
      receiverId: "",
      receiver_name: "",
      titleStr: "",
    };
  },
  watch: {
    currentPagechuku(val) {
      this.chuKuSearchForm.skip = (val - 1) * this.pageSizechuku;
      this.chuKuSearchForm.limit = this.pageSizechuku;
      this.getChuKuData();
    },
    currentPageruku(val) {
      this.rukuSearchForm.skip = (val - 1) * this.pageSizeruku;
      this.rukuSearchForm.limit = this.pageSizeruku;
      this.getRuKuData();
    },
    orderTimes(val) {
      if (val && val.length === 2) {
        this.chuKuSearchForm.bt = val[0];
        this.chuKuSearchForm.et = val[1];
      } else {
        this.chuKuSearchForm.bt = "";
        this.chuKuSearchForm.et = "";
      }
    },
    rukuTimes(val) {
      if (val && val.length === 2) {
        this.rukuSearchForm.bt = val[0];
        this.rukuSearchForm.et = val[1];
      } else {
        this.rukuSearchForm.bt = "";
        this.rukuSearchForm.et = "";
      }
    },
  },
  methods: {
    rukuChangeChoose(val) {
      if (val.length > 0) {
        this.rukuIdsExport = [];
        val.forEach((item) => {
          this.rukuIdsExport.push(item.id);
        });
      }
    },
    submitBtn() {
      if (this.receiver_name === "") {
        this.$message.error(this.$t("order.pleaseEnterTiHuoren"));
        return;
      }
      this.shengheFuncChuku(this.receiverId, 3, this.receiver_name);
      this.visibleShengHe = false;
    },
    shengheFunc(data) {
      this.receiverId = data.id;
      this.titleStr = data.no;
      this.receiver_name = "";
      this.visibleShengHe = true;
    },
    // 入库单列表导出
    exportRuKu() {
      if (this.rukuIdsExport.length === 0) {
        this.$message.error(this.$t("warehouse.needCheckDataExoprt"));
        return;
      }
      warehouseReceiptsExport({ ids: JSON.stringify(this.rukuIdsExport) }).then(
        (res) => {
          var link = document.createElement("a");
          const blod = new Blob([res], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blod);
          link.download = "WarehousInfo.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      );
    },
    ChukuChangeChoose(val) {
      if (val.length > 0) {
        this.chukuIdsExport = [];
        val.forEach((item) => {
          this.chukuIdsExport.push(item.id);
        });
      }
    },
    exportChuKu() {
      if (this.chukuIdsExport.length === 0) {
        this.$message.error(this.$t("warehouse.needCheckDataExoprt"));
        return;
      }
      warehouseOutboundsExport({
        ids: JSON.stringify(this.chukuIdsExport),
      }).then((res) => {
        var link = document.createElement("a");
        const blod = new Blob([res], { type: "application/vnd.ms-excel" });
        link.style.display = "none";
        link.href = URL.createObjectURL(blod);
        link.download = "IssuenoteInfo.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    exportChuKu_deliverynote() {
      if (this.chukuIdsExport.length === 0) {
        this.$message.error(this.$t("warehouse.needCheckDataExoprt"));
        return;
      }
      warehouseDeliveryNoteExport({
        ids: JSON.stringify(this.chukuIdsExport),
      }).then((res) => {
        var link = document.createElement("a");
        const blod = new Blob([res], { type: "application/vnd.ms-excel" });
        link.style.display = "none";
        link.href = URL.createObjectURL(blod);
        link.download = "deliverynoteInfo.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    exportChuKu_ExpressNote() {
      if (this.chukuIdsExport.length === 0) {
        this.$message.error(this.$t("warehouse.needCheckDataExoprt"));
        return;
      }
      warehouseExpressNote({ ids: JSON.stringify(this.chukuIdsExport) }).then(
        (res) => {
          var link = document.createElement("a");
          const blod = new Blob([res], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blod);
          link.download = "ExpressNote.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      );
    },
    shengheFuncChuku(id, number, name) {
      this.formCang.status = number;
      this.formCang.receiver_name = name;
      // console.log('this.formCang', this.formCang, id)
      warehouseOutboundReview(id, this.formCang).then((res) => {
        this.getChuKuData();
      });
    },
    textFilter(data) {
      const index = data.indexOf("{");
      if (index !== -1) {
        let str = "";
        const text = JSON.parse(data);
        Object.keys(text).forEach((v, i) => {
          if (i === 0) {
            str = v + ":" + text[v] + ";";
          } else {
            str = str + v + ":" + text[v] + ";";
          }
        });
        return str;
      } else {
        return data;
      }
    },
    getRuKuData() {
      warehouseReceipts(this.rukuSearchForm).then((res) => {
        if (res.meta === 0) {
          this.rukuData = res.items;
          this.itemCountruku = res.total;
          console.log("RukuData", this.rukuData);
        }
      });
    },
    getChuKuData() {
      warehouseOutbounds(this.chuKuSearchForm).then((res) => {
        if (res.meta === 0) {
          this.chukuData = res.items;
          this.itemCountchuku = res.total;
          this.chukuGoodsNumber = res.count;
        }
      });
    },
    dataSearch() {
      this.getRuKuData();
    },
    search() {
      this.chuKuSearchForm.skip = 0;
      this.currentPagechuku = 1;
      this.getChuKuData();
    },
    Orderinfo(data) {
      sessionStorage.setItem("orderid", data);
      this.$router.push({
        path: "/order/list",
      });
    },
  },
  mounted() {
    if (this.$route.params.status) {
      if (this.$route.params.status !== this.chuKuSearchForm.status) {
        this.chuKuSearchForm.skip = 0;
        this.currentPagechuku = 1;
        this.activeChuRuKu = "2";
        this.chuKuSearchForm.status = this.$route.params.status;
      }
    }
    this.getChuKuData();
    this.getRuKuData();
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.searchbtn {
  display: flex;
  margin-bottom: 5px;
  align-items: center;
}
.numcss {
  display: inline-block;
  width: 100%;
  cursor: pointer;
  color: #409eff;
}
.bigbox {
  display: flex;
  > div:nth-child(1) {
    width: 15%;
  }
  > div:nth-child(2) {
    width: 85%;
  }
}
/deep/ {
  .el-form-item {
    margin-bottom: 0 !important;
  }
  .el-tree-node {
    margin-left: 0;
  }
}
.totlaInv {
  height: 48px;
  font-size: 20px;
  display: flex;
  align-items: center;
  margin: 0 20px;
}
.textcolor {
  color: #409eff;
}
.container {
  display: flex;
  align-items: center;
}
</style>
