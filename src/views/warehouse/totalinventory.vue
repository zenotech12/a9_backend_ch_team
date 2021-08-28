<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <el-row>
        <el-col :span="4" class="funcTree" style="margin-left: 0">
          <el-row>
            <el-col :span="24" class="funcBoxTitle">
              <div
                style="font-weight: bold; font-size: 18px"
                class="small_title"
              >
                {{ $t("goods.type") }}
              </div>
            </el-col>
          </el-row>
          <div class="custom-tree-container">
            <div class="block">
              <el-tree
                style="height: calc(100vh - 145px); overflow-y: auto"
                :data="goodsTypeData"
                node-key="id"
                :show-checkbox="false"
                :props="defaultProps"
                :highlight-current="true"
                @node-click="typeChangeFunc"
                @node-expand="nodeOpen"
                @node-collapse="nodeClose"
                :default-expanded-keys="defaultExpanded"
                :expand-on-click-node="false"
                :render-content="renderContent"
              >
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="20" class="funcBox">
          <div class="rightbox">
            <div>
              <div>
                <el-row>
                  <el-col
                    :span="24"
                    style="padding: 15px 0px; padding-left: 20px"
                  >
                    <el-form :inline="true" :model="totalgoodshForm">
                      <el-form-item>
                        <el-input
                          v-model="totalgoodshForm.key"
                          clearable
                          :placeholder="$t('sys.search')"
                        ></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-checkbox
                          v-model="totalgoodshForm.zero_inventory"
                          @change="Searchlist"
                          >{{ $t("warehouse.onlyLookNoInv") }}</el-checkbox
                        >
                      </el-form-item>
                      <el-form-item class="searchBtn">
                        <el-button
                          type="primary"
                          @click="Searchlist"
                          size="small"
                          icon="el-icon-search"
                        ></el-button>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
                <el-table
                  :data="Totaldata"
                  @selection-change="handleSelectionChange"
                  border
                  height="calc(100vh - 229px)"
                  style="width: 100%"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                    v-if="permissionCheck('opt', '8_3')"
                  ></el-table-column>
                  <el-table-column label="#" width="60px">
                    <template slot-scope="scope">
                      {{ scope.$index + totalgoodshForm.skip + 1 }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    :label="$t('warehouse.name2')"
                  >
                    <template slot-scope="scope">
                      <div style="padding: 10px">{{scope.row.name}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    width="300px"
                    :label="$t('warehouse.SpecificationsMsg')"
                  >
                    <template slot-scope="scope">{{
                      textFilter(scope.row.specification)
                    }}</template>
                  </el-table-column>
                  <el-table-column
                    prop="barcode"
                    width="150"
                    :label="$t('warehouse.barCode')"
                  ></el-table-column>
                  <!--<el-table-column prop="unit_price" width="100" :label="$t('warehouse.price')">-->
                  <!--<template slot-scope="scope">-->
                  <!--{{scope.row.unit_price | price}}-->
                  <!--</template>-->
                  <!--</el-table-column>-->
                  <el-table-column prop="count" width="100" align="center">
                    <template slot="header">
                      <div class="cellBoxTitle">
                        {{ $t("warehouse.num") }}
                        <span class="sortBox">
                          <i
                            class="el-icon-caret-top jiantouC"
                            @click="sortFunc('count')"
                            :class="{
                              jiantouBlue: totalgoodshForm.sort === 'count',
                            }"
                          ></i>
                          <i
                            class="el-icon-caret-bottom jiantouC"
                            @click="sortFunc('-count')"
                            :class="{
                              jiantouBlue: totalgoodshForm.sort === '-count',
                            }"
                          ></i>
                        </span>
                      </div>
                    </template>
                    <template slot-scope="scope">
                      <span class="numcss" @click="numinfo(scope.row)">{{
                        scope.row.count
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="origin"
                    width="180"
                    :label="$t('warehouse.PlaceofOrigin')"
                  ></el-table-column>
                  <el-table-column
                    :label="$t('tools.opt')"
                    v-if="permissionCheck('opt', '8_4')"
                    align="center"
                    width="190"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        plain
                        @click="inventoryMerge(scope.row)"
                        size="small"
                      >
                        {{ $t("warehouse.merge") }}
                      </el-button>
                      <el-button
                        type="success"
                        plain
                        v-if="scope.row.spu_id !== ''"
                        @click="bindFunc(scope.row)"
                        size="small"
                        >{{ $t("warehouse.bind") }}</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <el-row style="margin: 10px 0px">
              <el-col :span="11" style="margin-left: 10px">
                <span
                  style="padding: 7px 15px; font-weight: bold"
                  class="allprice"
                  >{{ $t("warehouse.totalInv") }}：<span style="">{{
                    inventory
                  }}</span></span
                >
                <el-button
                  style="
                    margin-left: 10px;
                    padding: 10px 15px;
                  "
                  type="success"
                  v-if="permissionCheck('opt', '8_3')"
                  size="medium"
                  @click="addData"
                  >{{ $t("warehouse.purchase") }}</el-button
                >
              </el-col>
              <el-col :span="12">
                <div style="text-align: right">
                  <el-pagination
                    :current-page.sync="currentPage_to"
                    :page-size="pageSize_to"
                    layout="total, prev, pager, next, jumper"
                    :total="itemCount_to"
                  ></el-pagination>
                </div>
              </el-col>
            </el-row>
            <total-data
              :restFrom="restFrom"
              :restFromid="restFromid"
              :istype="dialogVisible"
              @dalogtype="dalogtype"
            ></total-data>
            <el-dialog
              width="90%"
              @close="formEditDialog = false"
              :visible.sync="formEditDialog"
              :close-on-click-modal="false"
              center
            >
              <span slot="title" style="font-weight: bold; font-size: 15px">{{
                $t("warehouse.setUp")
              }}</span>
              <el-form :model="form" label-position="top">
                <el-row type="flex" justify="space-between" align="center">
                  <el-col :span="6">
                    <el-form-item :label="$t('warehouse.supplier')">
                      <el-select
                        v-model="form.supplier_id"
                        filterable
                        clearable
                        :placeholder="$t('warehouse.choice')"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in supplierList"
                          :key="item.id"
                          :label="item.company_name"
                          :value="item.id"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="5">
                    <el-form-item :label="$t('warehouse.Currency')">
                      <el-select
                        v-model="form.currency"
                        clearable
                        :placeholder="$t('warehouse.Currency')"
                        style="width: 100%"
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
                  </el-col>

                  <el-col :span="5">
                    <el-form-item :label="$t('warehouse.payment_term')">
                      <el-select
                        v-model="form.payment_term"
                        clearable
                        :placeholder="$t('warehouse.payment_term')"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in paymenttermdata"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item :label="$t('warehouse.delivery_method')">
                      <el-select
                        v-model="form.delivery_method"
                        clearable
                        :placeholder="$t('warehouse.delivery_method')"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in deliverymedata"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item style="margin-top: 20px">
                  <!--  :label="$t('warehouse.Purchaselist')" -->
                  <!--<el-button type="primary" @click="addSkus" size="mini">{{$t('warehouse.add2')}}</el-button>-->
                  <el-table
                    :data="skusArray"
                    height="calc(100vh - 440px)"
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="name"
                      :label="$t('warehouse.name2')"
                      width="300px"
                    ></el-table-column>
                    <el-table-column
                      prop="origin"
                      :label="$t('warehouse.PlaceofOrigin')"
                    >
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.origin"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="specification"
                      :label="$t('warehouse.pecifications')"
                    >
                      <template slot-scope="scope">
                        {{ textFilter(scope.row.specification) }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="barcode"
                      :label="$t('warehouse.barCode')"
                    >
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.barcode"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="unit_price"
                      :label="$t('warehouse.pricetype')"
                      width="250"
                    >
                      <template slot-scope="scope">
                        <price-input v-model="scope.row.unit_price"
                          ><span slot="append"
                            >/ {{ scope.row.shouJia | price }}</span
                          ></price-input
                        >
                      </template>
                    </el-table-column>
                    <!--<el-table-column prop="count" label="库存">-->
                    <!--<template slot-scope="scope">-->
                    <!--{{scope.row.nowCount}}-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                      prop="inventory"
                      :label="$t('warehouse.currentInv')"
                      width="130px"
                    ></el-table-column>
                    <el-table-column
                      prop="count"
                      :label="$t('warehouse.Purchasenum')"
                      width="180"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.count"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="total_price"
                      :label="$t('warehouse.allprice')"
                      width="150"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <price-input
                          v-model="scope.row.total_price"
                        ></price-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('tools.opt')"
                      width="100"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <!-- <el-button
                          type="text"
                          @click="deleteRow(scope.$index)"
                          size="small"
                          >{{ $t("tools.delete") }}</el-button
                        > -->
                        <i class="el-icon-delete-solid" style="color: red; font-size: 18px" @click="deleteRow(scope.$index)"></i>
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
                </el-form-item>
              </el-form>

              <div slot="footer" class="dialog-footer">
                <confirm-button
                  @confirmButton="saveDataFunc()"
                  :disabled="submitDisabled"
                  :confirmButtonInfor="$t('tools.confirm')"
                ></confirm-button>
                <el-button @click="formEditDialog = false" size="small">{{
                  $t("tools.cancel")
                }}</el-button>
              </div>
            </el-dialog>
            <!--合并库存-->
            <!-- Dialog Merge Inventory -->
            <el-dialog
              width="80%"
              @close="mergeDialog = false"
              :visible.sync="mergeDialog"
              :close-on-click-modal="false"
              center
            >
              <span slot="title" style="font-weight: bold; font-size: 15px">{{
                titleDialog
              }}</span>
              <el-row>
                <el-col :span="24" style="padding-bottom: 20px">
                  <el-form :model="mergeSearchForm">
                    <el-row type="flex" class="row-bg" justify="space-between">
                      <el-col :span="23">
                        <el-form-item>
                          <el-input
                            v-model="mergeSearchForm.key"
                            :placeholder="$t('sys.search')"
                            clearable
                            style="width: 100%"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="1">
                        <el-form-item class="searchBtn" style="float: right">
                          <el-button
                            type="primary"
                            @click="searchMerge"
                            size="small"
                            icon="el-icon-search"
                          ></el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-col>
              </el-row>
              <el-table
                :data="mergeTable"
                @row-click="chooseCurrent"
                highlight-current-row
                border
                stripe
                height="calc(100vh - 400px)"
                style="width: 100%"
              >
                <el-table-column label="#" width="60px">
                  <template slot-scope="scope">
                    {{ scope.$index + mergeSearchForm.skip + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="name" :label="$t('warehouse.name2')">
                  <template slot-scope="scope">
                    <div style="padding: 10px">{{ scope.row.name }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="date"
                  width="350"
                  :label="$t('warehouse.SpecificationsMsg')"
                >
                  <template slot-scope="scope">{{
                    textFilter(scope.row.specification)
                  }}</template>
                </el-table-column>
                <el-table-column
                  prop="barcode"
                  width="200"
                  :label="$t('warehouse.barCode')"
                ></el-table-column>
                <el-table-column prop="count" width="100" align="center">
                  <template slot="header">
                    <div class="cellBoxTitle">
                      {{ $t("warehouse.num") }}
                      <span class="sortBox">
                        <i
                          class="el-icon-caret-top jiantouC"
                          @click="sortFunc('count')"
                          :class="{
                            jiantouBlue: totalgoodshForm.sort === 'count',
                          }"
                        ></i>
                        <i
                          class="el-icon-caret-bottom jiantouC"
                          @click="sortFunc('-count')"
                          :class="{
                            jiantouBlue: totalgoodshForm.sort === '-count',
                          }"
                        ></i>
                      </span>
                    </div>
                  </template>
                  <template slot-scope="scope">
                    <span class="numcss" @click="numinfo(scope.row)">{{
                      scope.row.count
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="origin"
                  width="200"
                  :label="$t('warehouse.PlaceofOrigin')"
                ></el-table-column>
              </el-table>
              <el-row>
                <el-col :span="24">
                  <div style="text-align: right; margin-top: 10px">
                    <el-pagination
                      :current-page.sync="currentPage_merge"
                      :page-size="pageSize_merge"
                      layout="total, prev, pager, next, jumper"
                      :total="itemCount_merge"
                    ></el-pagination>
                  </div>
                </el-col>
              </el-row>
              <div slot="footer" class="dialog-footer">
                <confirm-button
                  @confirmButton="submitMerge"
                  :disabled="submitDisabled"
                  :confirmButtonInfor="$t('tools.confirm')"
                ></confirm-button>
                <el-button @click="mergeDialog = false" size="small">{{
                  $t("tools.cancel")
                }}</el-button>
              </div>
            </el-dialog>
            <!--绑定-->
            <!-- Dialog Bind -->
            <el-dialog
              width="80%"
              @close="bindDialog = false"
              :visible.sync="bindDialog"
              :close-on-click-modal="false"
              center
            >
              <span slot="title" style="font-weight: bold; font-size: 15px">{{
                bindTitleDialog
              }}</span>
              <el-table
                :data="guigeData"
                @row-click="chooseCurrentBind"
                highlight-current-row
                border
                stripe
                height="calc(100vh - 400px)"
                style="width: 100%"
              >
                <el-table-column label="#" width="60px">
                  <template slot-scope="scope">
                    {{ scope.$index + bindSearchForm.skip + 1 }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.SpecificationsMsg')">
                  <template slot-scope="scope">
                    <div style="padding: 10px">
                      {{ textFilter1(scope.row.specifications) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('goods.originalPrice')">
                  <template slot-scope="scope">
                    {{ scope.row.original_price | price }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="barcode"
                  :label="$t('warehouse.barCode')"
                ></el-table-column>
                <el-table-column
                  prop="inventory"
                  :label="$t('tools.inventory')"
                ></el-table-column>
              </el-table>
              <el-row>
                <el-col :span="24">
                  <div style="text-align: right; margin-top: 10px">
                    <el-pagination
                      :current-page.sync="currentPage_bind"
                      :page-size="pageSize_bind"
                      layout="total, prev, pager, next, jumper"
                      :total="itemCount_bind"
                    ></el-pagination>
                  </div>
                </el-col>
              </el-row>
              <div slot="footer" class="dialog-footer">
                <confirm-button
                  @confirmButton="submitBind"
                  :disabled="submitDisabledBind"
                  :confirmButtonInfor="$t('tools.confirm')"
                ></confirm-button>
                <el-button @click="bindDialog = false" size="small">{{
                  $t("tools.cancel")
                }}</el-button>
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
  warehousegroup,
  purchaseAdd,
  suppliersList,
  warehouseInventMerge,
} from "@/api/warehouse";
import { spuTypesList, spusSkusList } from "@/api/goods";

export default {
  data() {
    return {
      totalgoodshForm: {
        key: "",
        warehouse_id: "",
        sku_uid: "",
        // specification: "",
        // type_id: '',
        skip: 0,
        limit: 15,
        zero_inventory: false,
        sort: "count", // count 库存升序 -count库存降序
      },
      numinfoForm: {
        key: "",
        warehouse_id: "",
        position: "",
        sku_uid: "",
        specification: "",
        skip: 0,
        limit: 10,
      },
      Totaldata: [],
      currentPage_to: 1,
      pageSize_to: 15,
      itemCount_to: 0,
      currentPage_info: 1,
      pageSize_info: 10,
      itemCount_info: 0,
      dialogVisible: false,
      numinfoData: [],
      restFrom: "",
      restFromid: "",
      goodsTypeData: [],
      defaultProps: {
        children: "items",
        label: "name",
      },
      defaultExpanded: [],
      maxNumber: 0,
      funcTreeWidth: 0,
      funcBoxWidth: 0,
      formEditDialog: false,
      skusArray: [],
      currency: "",
      payment_term: "",
      delivery_method: "",
      options: [
        { value: "US Dollar", label: "US Dollar" },
        { value: "Riel(Cambodia)", label: "Riel(Cambodia)" },
        { value: "RBM", label: "RBM" },
      ],
      paymenttermdata: [
        { value: "Net 30 days", label: "Net 30 days" },
        { value: "Net 60 days", label: "Net 60 days" },
      ],
      deliverymedata: [
        { value: "Self-pick up", label: "Self-pick up" },
        { value: "Express", label: "Express" },
      ],
      submitDisabled: false,
      supplierList: [],
      form: {
        order_id: "",
        supplier_id: "",
        skus: "",
        currency: "",
        payment_term: "",
        delivery_method: "",
      },
      inventory: 0,
      mergeForm: {
        self_skuuid: "",
        merge_skuuid: "",
      },
      mergeDialog: false,
      mergeTable: [],
      mergeTotal: 0,
      currentPage_merge: 1,
      pageSize_merge: 15,
      itemCount_merge: 0,
      mergeSearchForm: {
        key: "",
        warehouse_id: "",
        skip: 0,
        limit: 15,
        zero_inventory: false,
        sort: "count", // count 库存升序 -count库存降序
      },
      submitDisabledMerge: false,
      titleDialog: "",
      bindDialog: false,
      bindTitleDialog: "",
      bindForm: {
        self_skuuid: "",
        merge_skuuid: "",
      },
      guigeData: [],
      currentPage_bind: 1,
      pageSize_bind: 15,
      itemCount_bind: 0,
      bindSearchForm: {
        skip: 0,
        limit: 10,
      },
      bindSpuid: "",
      submitDisabledBind: false,
    };
  },
  watch: {
    currentPage_to(val) {
      this.totalgoodshForm.skip = (val - 1) * this.pageSize_to;
      this.totalgoodshForm.limit = this.pageSize_to;
      this.gettotaldata();
    },
    currentPage_merge(val) {
      this.mergeSearchForm.skip = (val - 1) * this.pageSize_merge;
      this.mergeSearchForm.limit = this.pageSize_merge;
      this.getShowTable();
    },
    currentPage_bind(val) {
      this.bindSearchForm.skip = (val - 1) * this.pageSize_bind;
      this.bindSearchForm.limit = this.pageSize_bind;
      this.getGuigeInfo();
    },
  },
  methods: {
    textFilter1(data) {
      try {
        var obj = data;
        var specArr = [];
        Object.keys(obj).forEach((k) => {
          specArr.push(k + ":" + obj[k]);
        });
        return specArr.join(";");
      } catch (e) {
        return data;
      }
    },
    chooseCurrent(data) {
      // console.log('data', data)
      this.mergeForm.merge_skuuid = data.sku_uid;
    },
    chooseCurrentBind(data) {
      this.bindForm.merge_skuuid = data.id;
    },
    submitMerge() {
      if (this.mergeForm.merge_skuuid === "") {
        this.$message.error(this.$t("warehouse.pleaseChooseInv"));
        return;
      }
      this.submitDisabled = true;
      warehouseInventMerge(this.mergeForm)
        .then((res) => {
          if (res.meta === 0) {
            this.submitDisabled = false;
            this.mergeDialog = false;
            this.gettotaldata();
          } else {
            this.submitDisabled = false;
          }
        })
        .catch(() => {
          this.submitDisabled = false;
        });
    },
    inventoryMerge(data) {
      this.mergeForm.self_skuuid = data.sku_uid;
      this.mergeDialog = true;
      this.titleDialog =
        this.$t("warehouse.mergeInv") +
        "--" +
        this.textFilter(data.specification);
      this.mergeSearchForm.key = data.name;
      this.getShowTable();
    },
    getShowTable() {
      warehousegroup(this.mergeSearchForm).then((res) => {
        this.mergeTable = res.items;
        this.itemCount_merge = res.total;
      });
    },
    submitBind() {
      if (this.bindForm.merge_skuuid === "") {
        this.$message.error(
          this.$t("warehouse.Pleaseselect") + this.$t("warehouse.pecifications")
        );
        return;
      }
      this.submitDisabledBind = true;
      console.log("bindForm", this.bindForm);
      warehouseInventMerge(this.bindForm)
        .then((res) => {
          if (res.meta === 0) {
            this.submitDisabledBind = false;
            this.bindDialog = false;
            this.gettotaldata();
          } else {
            this.submitDisabledBind = false;
          }
        })
        .catch(() => {
          this.submitDisabledBind = false;
        });
    },
    bindFunc(data) {
      this.bindForm.self_skuuid = data.sku_uid;
      this.bindDialog = true;
      this.bindSpuid = data.spu_id;
      this.bindTitleDialog =
        this.$t("warehouse.bind") + "--" + this.textFilter(data.specification);
      this.getGuigeInfo();
    },
    getGuigeInfo() {
      spusSkusList(this.bindSpuid, this.bindSearchForm).then((res) => {
        this.guigeData = res.items;
        this.itemCount_bind = res.total;
      });
    },
    getSupplierList() {
      suppliersList().then((res) => {
        if (res.meta === 0) {
          this.supplierList = res.items;
        }
      });
    },
    addData() {
      this.form.order_id = "";
      this.form.supplier_id = "";
      this.form.skus = "";
      this.form.currency = "";
      this.form.payment_term = "";
      this.form.delivery_method = "";
      this.formEditDialog = true;
    },
    saveDataFunc() {
      if (this.skusArray.length === 0) {
        this.$message.error(this.$t("warehouse.choosePurchaseGoods"));
        return;
      }
      this.submitDisabled = true;
      this.form.skus = JSON.stringify(this.skusArray);
      // console.log(this.form)
      purchaseAdd(this.form)
        .then((res) => {
          this.gettotaldata();
          this.formEditDialog = false;
          this.submitDisabled = false;
        })
        .catch(() => {
          this.submitDisabled = false;
        });
    },
    deleteRow(index) {
      this.skusArray.splice(index, 1);
    },
    sortFunc(text) {
      this.totalgoodshForm.sort = text;
      this.gettotaldata();
    },
    handleSelectionChange(val) {
      // console.log('sssl', val)
      val.forEach((v) => {
        v["shouJia"] = v.unit_price;
      });
      this.skusArray = JSON.parse(JSON.stringify(val));
    },
    getTypeList() {
      spuTypesList({ type: 2 }).then((response) => {
        if (response.meta === 0) {
          this.typeData = [];
          this.goodsTypeData = [];
          if (response.items !== null) {
            this.typeData = response.items;
            this.goodsTypeData = [
              { name: this.$t("tools.all"), code: "", id: "" },
              ...response.items,
            ];
          }
        }
      });
    },
    typeChangeFunc(data) {
      this.totalgoodshForm.type_id = data.id;
      this.currentPage_to = 1;
      this.Searchlist();
    },
    nodeOpen(data, node, obj) {
      this.defaultExpanded.push(data.id);
      console.log("node", node);
      if (node.level > this.maxNumber) {
        this.maxNumber = node.level;
        const addWidth = 18 * this.maxNumber;
        const funcTreeWidth1 = this.funcTreeWidth;
        const funcBoxWidth1 = this.funcBoxWidth;
        const addClassWidth = funcTreeWidth1 + addWidth;
        const reduceWidth = funcBoxWidth1 - addWidth;
        $(".funcTree").width(addClassWidth);
        $(".funcBox").width(reduceWidth);
      }
    },
    nodeClose(data, node, obj) {
      this.defaultExpanded.splice(this.defaultExpanded.indexOf(data.id), 1);
    },
    renderContent(h, { node, data, store }) {
      if (this.permissionCheck("opt")) {
        return (
          <span class="custom-tree-node">
            <span title={node.label}>{node.label}</span>
          </span>
        );
      } else {
        return (
          <span class="custom-tree-node">
            <span title={node.label}>{node.label}</span>
          </span>
        );
      }
    },
    gettotaldata() {
      warehousegroup(this.totalgoodshForm).then((res) => {
        this.Totaldata = res.items;
        this.itemCount_to = res.total;
        this.inventory = res.inventory;
      });
    },
    Searchlist() {
      this.totalgoodshForm.skip = 0;
      this.currentPage_to = 1;
      this.gettotaldata();
    },
    searchMerge() {
      this.mergeSearchForm.skip = 0;
      this.currentPage_merge = 1;
      this.getShowTable();
    },
    numinfo(data) {
      this.dialogVisible = true;
      this.restFrom = data.specification;
      this.restFromid = data.sku_uid;
    },
    dalogtype() {
      this.dialogVisible = false;
    },
  },
  mounted() {
    if (this.$route.params.zero_inventory) {
      this.totalgoodshForm.skip = 0;
      this.currentPage_to = 1;
      this.totalgoodshForm.zero_inventory = this.$route.params.zero_inventory;
    }
    this.gettotaldata();
    this.getTypeList();
    this.getSupplierList();
    this.funcTreeWidth = $(".funcTree").width();
    this.funcBoxWidth = $(".funcBox").width();
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
.cellBoxTitle {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sortBox {
  display: flex;
  flex-direction: column;
  margin-left: 4px;
  .jiantouC {
    color: #c0c4cc;
    cursor: pointer;
  }
  .jiantouBlue {
    color: #409eff;
  }
}
.totlaInv {
  // height: 48px;
  display: flex;
  align-items: center;
  margin: 0 20px;
  margin-top: 15px;
}
.allprice {
  border-radius: 3px;
  padding: 5px;
  border: 1px solid #dcdfe6;
  display: inline-block;
  color: #606266;
  font-size: 14px;
  > span {
    font-size: 16px;
    font-weight: bold;
    color: black;
  }
}
</style>
