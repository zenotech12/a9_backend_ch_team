<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row style="margin-bottom: 10px">
          <el-col :span="10" class="funcList" style="padding-right: 0">
            <div
              class="boxFuncBtn"
              @click="addData"
              v-if="permissionCheck('opt')"
            >
              <el-button
                size="small"
                type="success"
                icon="el-icon-plus"
                >{{ $t("tools.add") }}</el-button
              >
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <!-- 表格 -->
              <el-table
                border
                :data="tableData"
                height="calc(100% - 40px)"
              >
                <el-table-column label="#" width="60px">
                  <template slot-scope="scope">
                    {{ scope.$index + searchForm.skip + 1 }}
                  </template>
                </el-table-column>
                <!-- 仓库名称 -->
                <el-table-column
                  prop="name"
                  :label="$t('warehouse.name')"
                ></el-table-column>
                <!-- 备注 -->
                <el-table-column :label="$t('warehouse.remarks')">
                  <template slot-scope="scope">{{
                    scope.row.comment
                  }}</template>
                </el-table-column>
                <!-- 简称 -->
                <el-table-column :label="$t('warehouse.abbreviation')">
                  <template slot-scope="scope">{{
                    scope.row.short_name
                  }}</template>
                </el-table-column>
                <!-- 数量 -->
                <el-table-column :label="$t('warehouse.num1')">
                  <template slot-scope="scope">{{ scope.row.no }}</template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column
                  :label="$t('tools.opt')"
                  v-if="permissionCheck('opt')"
                  align="left"
                  width="220px"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="showDataEditor(scope.row)"
                      size="small"
                      >{{ $t("tools.edit") }}</el-button
                    >
                    <br />
                    <!-- <span class="xiexian">/</span> -->
                    <!-- <delete-button
                      @delData="deleteDataFunc(scope.row)"
                    ></delete-button> -->
                    <delete-button-text
                      @delData="deleteDataFunc(scope.row)"
                    ></delete-button-text>
                    <br />
                    <!-- <span class="xiexian">/</span> -->
                    <el-button
                      type="text"
                      @click="showInventories(scope.row)"
                      size="small"
                      >{{ $t("warehouse.stockmsg") }}</el-button
                    >
                    <br />
                    <!-- <span class="xiexian">/</span> -->
                    <el-button
                      type="text"
                      @click="showOutbounds(scope.row)"
                      size="small"
                      >{{ $t("warehouse.journal") }}</el-button
                    >
                    <br />
                    <!-- <span class="xiexian">/</span> -->
                    <el-button
                      type="text"
                      @click="loclist(scope.row)"
                      size="small"
                      >{{ $t("warehouse.location") }}</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right; margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount"
                ></el-pagination>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 模态框 -->
        <!-- FormEdit -->
        <el-dialog
          class="dialog"
          width="800px"
          @close="formEditDialog = false"
          :visible.sync="formEditDialog"
          :close-on-click-modal="false"
          center
        >
          <span slot="title" style="font-weight: bold; font-size: 15px">{{
            $t("warehouse.add")
          }}</span>
          <el-form label-width="120px" label-position="left" :model="form">
            <!-- 仓库名称 -->
            <el-form-item>
              <el-row>
                <el-col :span="6" class="grid-content">
                  <div class="formText">{{ $t("warehouse.name") }}</div>
                </el-col>
                <el-col :span="14" class="grid-content">
                  <el-input v-model="form.name"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item :label="$t('warehouse.name')">
              <el-input v-model="form.name"></el-input>
            </el-form-item> -->
            <!-- 仓库编号 -->
            <el-form-item>
              <el-row>
                <el-col :span="6" class="grid-content">
                  <div class="formText">{{ $t("warehouse.num1") }}</div>
                </el-col>
                <el-col :span="14" class="grid-content">
                  <el-input v-model="form.no"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item :label="$t('warehouse.num1')">
              <el-input v-model="form.no"></el-input>
            </el-form-item> -->
            <!-- 简称 -->
            <el-form-item>
              <el-row>
                <el-col :span="6" class="grid-content">
                  <div class="formText">{{ $t("warehouse.abbreviation") }}</div>
                </el-col>
                <el-col :span="14" class="grid-content">
                  <el-input v-model="form.short_name"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item :label="$t('warehouse.abbreviation')">
              <el-input v-model="form.short_name"></el-input>
            </el-form-item> -->
            <!-- 拼音码 -->
            <el-form-item>
              <el-row>
                <el-col :span="6" class="grid-content">
                  <div class="formText">{{ $t("warehouse.Pinyin") }}</div>
                </el-col>
                <el-col :span="14" class="grid-content">
                  <el-input v-model="form.pinyin_code"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item :label="$t('warehouse.Pinyin')">
              <el-input v-model="form.pinyin_code"></el-input>
            </el-form-item> -->
            <!-- 备注 -->
            <el-form-item>
              <el-row>
                <el-col :span="6" class="grid-content">
                  <div class="formText">{{ $t("warehouse.remarks") }}</div>
                </el-col>
                <el-col :span="14" class="grid-content">
                  <el-input v-model="form.comment"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item :label="$t('warehouse.remarks')">
              <el-input v-model="form.comment"></el-input>
            </el-form-item> -->
            <!-- 手机联系人 -->
            <el-form-item>
              <el-row>
                <el-col :span="6" class="grid-content">
                  <div class="formText">{{ $t("warehouse.contacts") }}</div>
                </el-col>
                <el-col :span="14" class="grid-content">
                  <el-input v-model="form.contacter_name"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item :label="$t('warehouse.contacts')">
              <el-input v-model="form.contacter_name"></el-input>
            </el-form-item> -->
            <!-- 联系人手机 -->
            <el-form-item>
              <el-row>
                <el-col :span="6" class="grid-content">
                  <div class="formText">{{ $t("warehouse.tel") }}</div>
                </el-col>
                <el-col :span="14" class="grid-content">
                  <el-input v-model="form.contacter_mobile"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item :label="$t('warehouse.tel')">
              <el-input v-model="form.contacter_mobile"></el-input>
            </el-form-item> -->
            <!-- 邮编 -->
            <el-form-item>
              <el-row>
                <el-col :span="6" class="grid-content">
                  <div class="formText">{{ $t("warehouse.Postcode") }}</div>
                </el-col>
                <el-col :span="14" class="grid-content">
                  <el-input v-model="form.postcode"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item :label="$t('warehouse.Postcode')">
              <el-input v-model="form.postcode"></el-input>
            </el-form-item> -->
            <!-- 地址选择 -->
            <el-form-item>
              <el-row>
                <el-col :span="6" class="grid-content">
                  <div class="formText">{{ $t("sys.address1") }}</div>
                </el-col>
                <el-col :span="14" class="grid-content">
                  <map-selector v-model="formAddress"></map-selector>
                  <div class="distpicker_error" v-if="placeShow">
                    {{ $t("sys.selectAddress") }}
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item class="start" :label="$t('sys.address1')">
              <map-selector v-model="formAddress"></map-selector>
              <div class="distpicker_error" v-if="placeShow">
                {{ $t("sys.selectAddress") }}
              </div>
            </el-form-item> -->
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
        <!--库存信息列表-->
        <!-- Inventory Information -->
        <el-dialog
          class="dialog"
          width="75%"
          @close="inventoriesDialog = false"
          :visible.sync="inventoriesDialog"
          :close-on-click-modal="false"
          center
        >
          <span slot="title" style="font-weight: bold; font-size: 15px">{{
            $t("warehouse.stockmsg")
          }}</span>
          <el-tabs v-model="activeName">
            <el-tab-pane
              :label="$t('warehouse.goodsviwe')"
              name="1"
            ></el-tab-pane>
            <el-tab-pane
              :label="$t('warehouse.locationviwe')"
              name="2"
            ></el-tab-pane>
            <div v-if="activeName === '1'">
              <div class="searchBox" style="margin-bottom: 15px">
                <div>
                  <el-input
                    v-model="goodsviewfrom.key"
                    size="medium"
                    clearable
                    style="width: 400px"
                  ></el-input>
                </div>
                <div>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="small"
                    @click="goodsviewSearch"
                  ></el-button>
                </div>
              </div>
              <el-table
                :data="goodsviewdata"
                border
                height="calc(100vh - 450px)"
                style="width: 100%"
              >
                <el-table-column label="#" width="60px" align="center">
                  <template slot-scope="scope">
                    {{ scope.$index + goodsviewfrom.skip + 1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  :label="$t('warehouse.goodsname')"
                  width="320px"
                >
                  <template slot-scope="scope">
                    <div
                      style="
                        word-break: normal;
                        padding: 10px;
                        text-align: left;
                        color: black;
                      "
                    >
                      {{ scope.row.name }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="origin"
                  :label="$t('warehouse.PlaceofOrigin')"
                  width="150px"
                  style="text-transform: capitalize"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="specification"
                  :label="$t('warehouse.pecifications')"
                >
                  <template slot-scope="scope">
                    {{ textFilter(scope.row.specification) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sku_uid"
                  :label="$t('warehouse.goodsId')"
                ></el-table-column>
                <el-table-column
                  prop="barcode"
                  :label="$t('warehouse.barCode')"
                  width="180px"
                  align="center"
                ></el-table-column>
                <!--<el-table-column prop="unit_price" :label="$t('warehouse.price')" width="100"></el-table-column>-->
                <el-table-column
                  prop="count"
                  :label="$t('warehouse.num')"
                  width="100"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span class="numcss" @click="goodsnuminfo(scope.row)">{{
                      scope.row.count
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="scrap_count"
                  :label="$t('warehouse.scrap_count')"
                  width="120"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span @click="goodsscrapcount(scope.row)" class="numcss">{{
                      scope.row.scrap_count
                    }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right; margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPage_num"
                  :page-size="pageSize_num"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount_num"
                >
                </el-pagination>
              </div>
            </div>
            <div v-if="activeName === '2'">
              <el-row>
                <el-col :span="24">
                  <el-form :inline="true" :model="inventoriesSearchForm">
                    <div class="exbox">
                      <div class="searchBox">
                        <el-form-item>
                          <el-select
                            v-model="inventoriesSearchForm.position"
                            clearable
                            :placeholder="$t('warehouse.Pleaseselect')"
                            size="medium"
                          >
                            <el-option
                              v-for="item in positionList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.name"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item>
                          <el-input
                            v-model="inventoriesSearchForm.key"
                            clearable
                            size="medium"
                            style="width: 300px; margin-left: 10px"
                          ></el-input>
                        </el-form-item>
                        <el-form-item>
                          <el-button
                            type="primary"
                            @click="searchInStorckList"
                            size="small"
                            icon="el-icon-search"
                          ></el-button>
                        </el-form-item>
                      </div>
                      <div>
                        <el-button
                          @click="wareinfoExport"
                          size="small"
                          icon="el-icon-upload2"
                          type="success"
                          >{{ $t("warehouse.Inventoryinfo") }}</el-button
                        >
                      </div>
                    </div>
                  </el-form>
                </el-col>
              </el-row>
              <el-table
                border
                :data="inventoriesList"
                highlight-current-row
                height="calc(100vh - 460px)"
              >
                <el-table-column label="#" width="60px">
                  <template slot-scope="scope">
                    {{ scope.$index + inventoriesSearchForm.skip + 1 }}
                  </template>
                </el-table-column>
                <!-- 仓库名称 -->
                <el-table-column prop="name" :label="$t('warehouse.name2')">
                  <template slot-scope="scope">
                    <div
                      style="
                        word-break: normal;
                        padding: 10px;
                        text-align: left;
                        color: black;
                      "
                    >
                      {{ scope.row.name }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="specification"
                  :label="$t('warehouse.pecifications')"
                >
                  <template slot-scope="scope">
                    <div style="word-break: normal">
                      {{ textFilter(scope.row.specification) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="barcode"
                  width="180"
                  :label="$t('warehouse.barCode')"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="count"
                  :label="$t('warehouse.num')"
                  width="100"
                  align="center"
                ></el-table-column>
                <el-table-column
                  :label="$t('warehouse.baozhiqiguoqi')"
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    {{ scope.row.shelf_life }}{{ $t("warehouse.day") }} /
                    {{ scope.row.exp }}
                  </template>
                </el-table-column>
                <!--<el-table-column prop="unit_price" :label="$t('warehouse.price')">-->
                <!--<template slot-scope="scope">{{scope.row.unit_price | price}}</template>-->
                <!--</el-table-column>-->
                <!-- <el-table-column prop="total_price" :label="$t('warehouse.allprice')">
              <template slot-scope="scope">{{scope.row.total_price | price}}</template>
            </el-table-column> -->
                <el-table-column
                  prop="position"
                  width="150"
                  :label="$t('warehouse.position')"
                  align="center"
                ></el-table-column>
              </el-table>
              <div style="text-align: right; margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPageKuCun"
                  :page-size="pageSizeKuCun"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCountKuCun"
                ></el-pagination>
              </div>
            </div>
          </el-tabs>
          <div slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              @click="inventoriesDialog = false"
              size="small"
              >{{ $t("tools.close") }}</el-button
            >
          </div>
        </el-dialog>
        <!-- 库存信息点击数量的模态框 -->
        <!-- Inventory Information (Dialog Quantity) -->
        <el-dialog :visible.sync="dialogVisible" width="70%">
          <span slot="title" style="font-weight: bold; font-size: 15px">{{
            $t("warehouse.Info")
          }}</span>
          <el-table stripe border :data="goodsnumdata" style="width: 100%">
            <el-table-column label="#" width="60px">
              <template slot-scope="scope">
                {{ scope.$index + goodsnumfrom.skip + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('warehouse.name2')">
              <template slot-scope="scope">
                <div style="padding: 10px">{{ scope.row.name }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="origin"
              :label="$t('warehouse.PlaceofOrigin')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="barcode"
              :label="$t('warehouse.barCode')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="specification"
              :label="$t('warehouse.pecifications')"
            >
              <template slot-scope="scope">
                {{ textFilter(scope.row.specification) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="count"
              :label="$t('warehouse.num')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="position"
              :label="$t('warehouse.position')"
              align="center"
            ></el-table-column>
            <!-- <el-table-column prop="warehouse_name" :label="$t('warehouse.name')"></el-table-column> -->
          </el-table>
          <div style="text-align: right; margin-top: 10px">
            <el-pagination
              :current-page.sync="currentPage_info"
              :page-size="pageSize_info"
              layout="total, prev, pager, next, jumper"
              :total="itemCount_info"
            >
            </el-pagination>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click="dialogVisible = false"
              >{{ $t("warehouse.close") }}</el-button
            >
          </span>
        </el-dialog>
        <!-- 库存信息点击报废数量的模态框 -->
        <!-- Inventory Information (Dialog Scrap Quantity) -->
        <el-dialog :visible.sync="scrapcountlog" width="80%">
          <span slot="title" style="font-weight: bold; font-size: 15px">{{
            $t("warehouse.Info")
          }}</span>
          <el-table :data="scrapcountdata" stripe border>
            <el-table-column label="#" width="60px" align="center">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="warehouse_name"
              :label="$t('warehouse.name')"
              width="220"
            >
              <template slot-scope="scope">
                <div style="padding: 10px">
                  {{ scope.row.warehouse_name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="warehouse_name">
              <template slot-scope="scope" slot="header">
                <el-row style="width: 100%">
                  <el-col :span="8">{{ $t("warehouse.name2") }}</el-col>
                  <el-col :span="3" style="text-align: center">{{
                    $t("warehouse.PlaceofOrigin")
                  }}</el-col>
                  <el-col :span="6" style="text-align: center">{{
                    $t("warehouse.pecifications")
                  }}</el-col>
                  <el-col :span="3" style="text-align: center">{{
                    $t("warehouse.barCode")
                  }}</el-col>
                  <el-col :span="2" style="text-align: center">{{
                    $t("warehouse.location")
                  }}</el-col>
                  <el-col :span="2" style="text-align: center">{{
                    $t("warehouse.num")
                  }}</el-col>
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
                    <el-col :span="8" class="overOmitted"
                      ><span :title="item.name">{{ item.name }}</span></el-col
                    >
                    <el-col
                      :span="3"
                      style="text-align: center; min-width: 20px"
                      >{{ item.origin !== "" ? item.origin : "No" }}</el-col
                    >
                    <el-col
                      :span="6"
                      class="overOmitted"
                      style="text-align: center"
                    >
                      <span :title="textFilter(item.specification)">
                        {{ textFilter(item.specification) }}
                      </span>
                    </el-col>
                    <el-col :span="3" style="text-align: center">{{
                      item.barcode !== "" ? item.barcode : "No"
                    }}</el-col>
                    <el-col :span="2" style="text-align: center">{{
                      item.position
                    }}</el-col>
                    <el-col :span="2" style="text-align: center">{{
                      item.count
                    }}</el-col>
                  </el-row>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click="scrapcountlog = false"
              >{{ $t("warehouse.close") }}</el-button
            >
          </span>
        </el-dialog>
        <!--出入库信息-->
        <!-- Stock In & Stock Out Log -->
        <el-dialog
          :visible.sync="chuRuKuDialog"
          class="dialog"
          width="90%"
          @close="chuRuKuDialog = false"
          :close-on-click-modal="false"
          center
        >
          <span slot="title" style="font-weight: bold; font-size: 15px">{{
            $t("warehouse.information")
          }}</span>
          <el-tabs v-model="activeChuRuKu">
            <el-tab-pane
              :label="$t('warehouse.enterlist')"
              name="1"
            ></el-tab-pane>
            <el-tab-pane
              :label="$t('warehouse.outlist')"
              name="2"
            ></el-tab-pane>
            <div v-if="activeChuRuKu === '1'">
              <div class="searchBox2">
                <div class="searchBox">
                  <div>
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
                  </div>
                  <div>
                    <el-select
                      v-model="rukuSearchForm.tp"
                      clearable
                      style="width: 250px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div>
                    <el-input
                      v-model="rukuSearchForm.key"
                      clearable
                      style="width: 300px"
                    ></el-input>
                  </div>
                  <div>
                    <el-button
                      type="primary"
                      @click="dataSearch"
                      icon="el-icon-search"
                      size="small"
                    ></el-button>
                  </div>
                </div>
                <el-col :span="4" align="right">
                  <div
                    class="boxFuncBtn2"
                    @click="rukuFunc"
                    v-if="permissionCheck('opt')"
                  >
                    <el-button
                      type="success"
                      icon="el-icon-plus"
                      size="small"
                    >
                      {{ $t("tools.add") }}</el-button
                    >
                  </div>
                </el-col>
              </div>
              <el-row>
                <el-col :span="20">
                  <el-form :inline="true" :model="rukuSearchForm">
                    <el-form-item> </el-form-item>
                    <el-form-item>
                      <!--<el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>-->
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-table border :data="rukuData" height="calc(100vh - 475px)">
                <el-table-column label="#" width="60px" fixed="left">
                  <template slot-scope="scope">
                    {{ scope.$index + rukuSearchForm.skip + 1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="no"
                  fixed="left"
                  :label="$t('warehouse.number')"
                  width="180px"
                >
                  <template slot-scope="scope">
                    <div style="padding: 20px">{{ scope.row.no }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="pu_no"
                  :label="$t('warehouse.pu_no')"
                  width="150px"
                ></el-table-column>
                <!-- <el-table-column prop="pu_no" :label="$t('warehouse.pu_no')" width="150px"></el-table-column> -->
                <el-table-column
                  prop="comment"
                  :label="$t('warehouse.remarks')"
                  width="150px"
                ></el-table-column>
                <el-table-column
                  prop="warehouse_name"
                  :label="$t('warehouse.name')"
                  width="200px"
                ></el-table-column>
                <el-table-column
                  prop="supplier_name"
                  :label="$t('warehouse.SupplierNmae')"
                  width="250px"
                ></el-table-column>
                <el-table-column width="1200px">
                  <template slot-scope="scope" slot="header">
                    <el-row style="width: 100%">
                      <el-col :span="6">
                        {{ $t("warehouse.Tradename") }}
                      </el-col>
                      <el-col :span="3" style="text-align: center">{{
                        $t("warehouse.position")
                      }}</el-col>
                      <el-col :span="6" style="text-align: center">{{
                        $t("warehouse.pecifications")
                      }}</el-col>
                      <el-col :span="2" style="text-align: center">{{
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
                        style="text-align: center; padding: 20px"
                        >{{
                          item.position !== "" ? item.position : "No"
                        }}</el-col
                      >
                      <el-col
                        :span="6"
                        class="overOmitted"
                        style="
                          text-align: center;
                          padding: 20px;
                          word-break: normal;
                        "
                        ><span :title="textFilter(item.specification)">{{
                          textFilter(item.specification)
                        }}</span></el-col
                      >
                      <el-col
                        :span="2"
                        style="text-align: center; padding: 20px"
                        >{{ item.barcode !== "" ? item.barcode : "No" }}</el-col
                      >
                      <el-col
                        :span="2"
                        v-if="permissionCheck('opt', '9_3')"
                        style="text-align: center; padding: 20px"
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
                        style="text-align: center; padding: 20px"
                        >{{ item.total_price | price }}</el-col
                      >
                    </el-row>
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
            <div v-if="activeChuRuKu === '2'">
              <div class="searchBox">
                <el-col :span="20">
                  <el-form :inline="true" :model="chuKuSearchForm">
                    <el-form-item>
                      <el-date-picker
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd HH:mm"
                        clearable
                        v-model="orderTimes"
                        type="daterange"
                        align="right"
                        unlink-panels
                        :range-separator="$t('tools.to')"
                        :start-placeholder="$t('tools.startDate')"
                        :end-placeholder="$t('tools.endDate')"
                      >
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item :label="$t('warehouse.type')">
                      <el-select v-model="chuKuSearchForm.tp" clearable>
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
                      <el-select
                        v-model="chuKuSearchForm.status"
                        clearable
                        style="width: 280px"
                      >
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
                        clearable
                        style="width: 300px"
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
                <el-col :span="4" align="right">
                  <!-- <div
                    class="boxFuncBtn2"
                    @click="chukuFunc"
                    v-if="permissionCheck('opt')"
                  > -->
                  <el-button
                    icon="el-icon-plus"
                    size="small"
                    type="success"
                    @click="chukuFunc"
                    v-if="permissionCheck('opt')"
                  >
                    {{ $t("tools.add") }}
                  </el-button>
                  <!-- </div> -->
                </el-col>
              </div>
              <el-table border :data="chukuData" height="calc(100vh - 410px)">
                <el-table-column label="#" fixed="left" width="80px">
                  <template slot-scope="scope">
                    {{ scope.$index + chuKuSearchForm.skip + 1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="left"
                  :label="$t('warehouse.number')"
                  width="150px"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.no }}</span>
                    <el-popover
                      v-if="scope.row.comment !== ''"
                      placement="top-start"
                      width="600"
                      trigger="hover"
                    >
                      <div style="padding: 10px">
                        {{ scope.row.comment }}
                      </div>
                      <i slot="reference" class="el-icon-tickets"></i>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="warehouse_name"
                  :label="$t('warehouse.name')"
                  width="180px"
                ></el-table-column>
                <el-table-column :label="$t('warehouse.type')" width="90px">
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
                  prop="relation_order_no"
                  :label="$t('order.Relatedorders')"
                  width="200px"
                >
                  <template slot-scope="scope">
                    <a
                      class="textcolor"
                      v-if="scope.row.tp === 1"
                      @click="Orderinfo(scope.row.relation_order_no)"
                      >{{ scope.row.relation_order_no }}</a
                    >
                    <a class="textcolor" v-if="scope.row.tp !== 1">/</a>
                  </template>
                </el-table-column>
                <el-table-column width="1200">
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
                        style="text-align: center; padding: 20px"
                        >{{
                          item.position !== "" ? item.position : "No"
                        }}</el-col
                      >
                      <el-col
                        :span="6"
                        class="overOmitted"
                        style="text-align: center; padding: 20px"
                        ><span :title="textFilter(item.specification)">{{
                          textFilter(item.specification)
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
                        style="text-align: center; padding: 20px; color: black"
                        ><b>{{ item.unit_price | price }}</b></el-col
                      >
                      <el-col
                        :span="2"
                        style="text-align: center; padding: 20px"
                        >{{ item.count }}</el-col
                      >
                      <el-col
                        :span="2"
                        v-if="permissionCheck('opt', '9_3')"
                        style="text-align: center; padding: 20px; color: black"
                        ><b>{{ item.total_price | price }}</b></el-col
                      >
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="shipping_address"
                  :label="$t('warehouse.Address')"
                  width="250px"
                >
                  <template slot-scope="scope" @click="test">
                    <span
                      @click="test"
                      v-if="scope.row.shipping_address != null"
                    >
                      {{ scope.row.shipping_address.address.province }}-
                      {{ scope.row.shipping_address.address.city }}-
                      {{ scope.row.shipping_address.address.district }}-
                      {{ scope.row.shipping_address.address.addr }}
                    </span>
                    <span
                      @click="test"
                      v-if="scope.row.shipping_address == null"
                      >{{ $t("warehouse.noinformation") }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="shipping_address"
                  :label="$t('warehouse.Courierinformation')"
                  width="250px"
                >
                  <template slot-scope="scope" @click="test">
                    <span @click="test" v-if="scope.row.express == null">{{
                      $t("warehouse.noinformation")
                    }}</span>
                    <span @click="test" v-if="scope.row.express != null">
                      <div>
                        {{ $t("warehouse.corporateName") }}:
                        <b style="color: black">{{
                          scope.row.express.company
                        }}</b>
                      </div>
                      <div>
                        {{ $t("warehouse.Singlenumber") }}:
                        <b style="color: black">{{
                          scope.row.express.novar
                        }}</b>
                      </div>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('order.status')"
                  width="240px"
                  align="center"
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
                  prop="gen_time"
                  :label="$t('warehouse.time')"
                  width="160px"
                ></el-table-column>
                <el-table-column
                  prop="adder_name"
                  :label="$t('warehouse.Operator')"
                  width="180px"
                ></el-table-column>
                <el-table-column
                  :label="$t('tools.opt')"
                  width="180px"
                  v-if="
                    permissionCheck('opt', '8_1') ||
                    permissionCheck('opt', '8_3')
                  "
                  fixed="right"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="shengheFuncChuku(scope.row.id, 2)"
                      v-if="
                        (scope.row.status === 1 || scope.row.status === 0) &&
                        permissionCheck('opt', '8_3')
                      "
                      size="small"
                      >{{ $t("warehouse.caigoushenghe") }}</el-button
                    >
                    <el-button
                      type="text"
                      @click="shengheFuncChuku(scope.row.id, 3)"
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
                  <span class="totlaInv" style="color: black">
                    {{ $t("warehouse.goodsChuKuCount") }}：<b>{{
                      chukuGoodsNumber
                    }}</b></span
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
            </div>
          </el-tabs>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeDialog2" size="small">{{
              $t("tools.close")
            }}</el-button>
          </div>
        </el-dialog>
        <!--入库设置-->
        <!-- StockIn Setting -->
        <el-dialog
          @close="resetOrder1"
          width="75%"
          append-to-body
          :visible.sync="rukuDialog"
          :close-on-click-modal="false"
          center
        >
          <span slot="title" style="font-weight: bold; font-size: 15px">{{
            $t("warehouse.StockinorderSet")
          }}</span>
          <el-form :model="rukuForm">
            <el-form-item>
              <!-- <el-radio-group v-model="rukuForm.tp" @change="tpChange">
                <el-radio :label="1">{{$t('warehouse.inpuWarehouse')}}</el-radio>
                <el-radio :label="2">{{$t('warehouse.Returnexchange')}}</el-radio>
              </el-radio-group> -->

              <!-- <el-radio v-model="rukuForm.tp" label="1">{{
                $t("warehouse.inpuWarehouse")
              }}</el-radio>
              <el-radio v-model="rukuForm.tp" label="2">{{
                $t("warehouse.Returnexchange")
              }}</el-radio> -->

              <el-row :gutter="20">
                <el-col :span="2">
                  <div>{{ $t("warehouse.type") }}</div>
                </el-col>
                <el-col :span="4">
                  <el-radio v-model="rukuForm.tp" label="1">{{
                    $t("warehouse.inpuWarehouse")
                  }}</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio v-model="rukuForm.tp" label="2">{{
                    $t("warehouse.Returnexchange")
                  }}</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-row :gutter="20">
                <el-col :span="2">
                  <div>{{ $t("warehouse.remarks") }}</div>
                </el-col>
                <el-col :span="10">
                  <el-input
                    v-model="rukuForm.comment"
                    type="textarea"
                    rows="3"
                  ></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="rukuForm.tp == '2'">
              <el-divider content-position="left"
                ><span style="font-weight: bold">{{
                  $t("warehouse.order")
                }}</span></el-divider
              >
              <!-- <el-row :gutter="20">
                <el-col :span="2">
                  {{ $t("warehouse.order") }}
                </el-col>
                <el-col :span="18"> -->
              <show-sku-table
                :resetForm="resetForm"
                :position="positionList"
                v-model="rukuForm.skus"
              ></show-sku-table>
              <!-- </el-col>
              </el-row> -->
            </el-form-item>
            <el-form-item v-if="rukuForm.tp == '1'">
              <el-divider content-position="left"
                ><span style="font-weight: bold">{{
                  $t("warehouse.Purchaseorder")
                }}</span></el-divider
              >
              <!-- <el-row :gutter="20"> -->
              <!-- <el-col :span="2">
                  {{ $t("warehouse.Purchaseorder") }}
                </el-col> -->
              <!-- <el-col :span="18"> -->
              <!-- <el-col :span="20"> -->
              <show-sku-plist
                :warehouseId2="wareId"
                :resetForm="resetForm1"
                @pulist="pulist"
                @getid="getid"
                v-model="rukuForm.skus"
              ></show-sku-plist>
              <!-- </el-col>
              </el-row> -->
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button
              @confirmButton="addRuKuForm"
              :confirmButtonInfor="$t('tools.confirm')"
            ></confirm-button>
            <el-button @click="rukuDialog = false" size="small">{{
              $t("tools.cancel")
            }}</el-button>
          </div>
        </el-dialog>
        <!--出库信息设置-->
        <!-- StoctOut information Setting -->
        <el-dialog
          width="80%"
          @close="chukuDlalog = false"
          append-to-body
          :visible.sync="chukuDlalog"
          :close-on-click-modal="false"
          center
        >
          <span slot="title" style="font-weight: bold; font-size: 15px">{{
            $t("warehouse.DeliverySet")
          }}</span>
          <el-form :model="chukuForm">
            <el-form-item>
              <el-row>
                <el-col :span="2">
                  <div>{{ $t("warehouse.type") }}</div>
                </el-col>
                <el-col :span="22">
                  <el-radio-group v-model="chukuForm.tp" @change="tpChange">
                    <el-row type="flex" justify="space-between">
                      <el-col>
                        <el-radio :label="2">{{
                          $t("warehouse.Scrap")
                        }}</el-radio>
                      </el-col>
                      <el-col style="margin-left: 60px">
                        <el-radio :label="3">{{
                          $t("warehouse.return")
                        }}</el-radio>
                      </el-col>
                      <el-col style="margin-left: 60px">
                        <el-radio :label="4">{{
                          $t("warehouse.Internaluse")
                        }}</el-radio>
                      </el-col>
                      <el-col style="margin-left: 60px">
                        <el-radio :label="5">{{
                          $t("warehouse.specialSale")
                        }}</el-radio>
                      </el-col>
                    </el-row>
                  </el-radio-group>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item>
              <el-row :gutter="20">
                <el-col :span="2">
                  <div>{{ $t("order.note") }}</div>
                </el-col>
                <el-col :span="22">
                  <el-input
                    type="textarea"
                    :rows="3"
                    v-model="chukuForm.comment"
                    clearable
                    :placeholder="$t('warehouse.Pleasenote')"
                    :autosize="{ minRows: 3, maxRows: 4 }"
                  ></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-divider content-position="center"
                ><span style="font-weight: bold; font-size: 15px">{{
                  $t("warehouse.stockmsg")
                }}</span></el-divider
              >
              <!-- <el-row>
                <el-col :span="23">
                  <div
                    style="
                      font-size: large;
                      font-weight: bold;
                      padding: 20px;
                      display: flex;
                      justify-content: center;
                    "
                  >
                    {{ $t("warehouse.stockmsg") }}
                  </div>
                </el-col>
              </el-row> -->
              <el-table
                :data="chukuArrayData"
                style="width: 100%"
                class="inputNumber"
              >
                <el-table-column
                  prop="name"
                  :label="$t('warehouse.name2')"
                ></el-table-column>
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
                ></el-table-column>
                <el-table-column
                  prop="position"
                  :label="$t('warehouse.position')"
                ></el-table-column>
                <el-table-column
                  prop="unit_price"
                  v-if="permissionCheck('opt', '9_3')"
                  :label="$t('warehouse.price')"
                >
                  <template slot-scope="scope">
                    {{ scope.row.unit_price | price }}
                  </template>
                </el-table-column>
                <el-table-column prop="count" :label="$t('warehouse.num')">
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.count"
                      :min="1"
                      :max="scope.row.count"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="total_price"
                  v-if="permissionCheck('opt', '9_3')"
                  :label="$t('warehouse.allprice')"
                >
                  <template slot-scope="scope">
                    {{ scope.row.total_price | price }}
                  </template>
                </el-table-column>
              </el-table>
              <stock-select
                v-if="chukuDlalog"
                :warehouseId="cangkuId"
                @goodSelectedInfo="currentKuncun"
                v-model="stockId"
              ></stock-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button
              @confirmButton="chukuFuncSubmit"
              :confirmButtonInfor="$t('tools.confirm')"
            ></confirm-button>
            <el-button @click="chukuDlalog = false" size="small">{{
              $t("tools.cancel")
            }}</el-button>
          </div>
        </el-dialog>
        <!-- 货位列表 -->
        <!-- Cargo Space List -->
        <el-dialog
          class="dialog"
          width="px"
          @close="locDialog = false"
          :visible.sync="locDialog"
          :close-on-click-modal="false"
          center
        >
          <span slot="title" style="font-weight: bold; font-size: 15px">{{
            $t("warehouse.locationList")
          }}</span>
          <confirm-button
            @confirmButton="locallistAdd()"
            :disabled="submitDisabled"
            :confirmButtonInfor="$t('warehouse.batchAdd')"
            btnType="success"
          ></confirm-button>
          <el-table
            height="calc(100vh - 450px)"
            ref="multipleTable"
            :data="locData"
            tooltip-effect="dark"
            style="width: 100%; margin-top: 15px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column :label="$t('warehouse.location2')">
              <template slot-scope="scope">
                <div style="padding: 10px">{{ scope.row.name }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: right; margin-top: 10px">
            <el-pagination
              :current-page.sync="currentPageloca"
              :page-size="pageSizeloca"
              layout="total, prev, pager, next, jumper"
              :total="itemCountloca"
            ></el-pagination>
          </div>
          <div slot="footer" class="dialog-footer">
            <confirm-button
              @confirmButton="saveDataDel()"
              :disabled="submitDisabled"
              :confirmButtonInfor="$t('warehouse.batchDel')"
              btnType="danger"
            ></confirm-button>
            <confirm-button
              @confirmButton="closeDialog()"
              :disabled="submitDisabled"
              :confirmButtonInfor="$t('tools.confirm')"
            ></confirm-button>
          </div>
        </el-dialog>
        <!-- 货位添加 -->
        <!-- Add Cargo Space -->
        <el-dialog
          class="dialog"
          width="400px"
          @close="locAddDialog = false"
          :visible.sync="locAddDialog"
          :close-on-click-modal="false"
          center
        >
          <span slot="title" style="font-weight: bold; font-size: 15px">{{
            $t("warehouse.location2Add")
          }}</span>
          <div class="localval" style="padding: 15px">
            <span>{{ $t("warehouse.area") }}</span>
            <div><el-input v-model="areastar"></el-input></div>
          </div>
          <div class="localval" style="padding: 15px">
            <span>{{ $t("warehouse.line") }}</span>
            <div><el-input v-model="linestar" type="number"></el-input></div>
            &nbsp;-&nbsp;
            <div><el-input v-model="lineend" type="number"></el-input></div>
          </div>
          <div class="localval" style="padding: 15px">
            <span>{{ $t("warehouse.column") }}</span>
            <div><el-input v-model="columnstar" type="number"></el-input></div>
            &nbsp;-&nbsp;
            <div><el-input v-model="columnend" type="number"></el-input></div>
          </div>
          <div slot="footer" class="dialog-footer">
            <confirm-button
              @confirmButton="wareLocaladd()"
              :disabled="submitDisabled"
              :confirmButtonInfor="$t('tools.confirm')"
            ></confirm-button>
            <el-button @click="locAddDialog = false" size="small">{{
              $t("tools.cancel")
            }}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
// import { redEnvelopeAdd, redEnvelopeModify, redEnvelopeList, redEnvelopeDelete } from '@/api/operation'
import {
  warehousesAdd,
  warehousesModify,
  warehousesList,
  warehousesDel,
  warehouseInventories,
  warehouseReceiptsAdd,
  warehouseReceipts,
  purchaseList,
  warehouseOutbounds,
  warehouseOutboundsAdd,
  warelocalAll,
  waregetlocallist,
  LocationDel,
  warehouseOutboundReview,
  warehousereport,
  warehousegroup,
} from "@/api/warehouse";
export default {
  components: {},
  data() {
    const formData = this.setForm();
    const pz = 10;
    return {
      triggersType: [
        { code: 1, name: this.$t("operation.triggersA") },
        { code: 2, name: this.$t("operation.triggersB") },
        { code: 3, name: this.$t("operation.triggersC") },
      ],
      timeValidSwitch: true,
      searchForm: {
        skip: 0,
        limit: pz,
      },
      ids: [],
      wareId: "",
      placeShow: false,
      placeChecked: false,
      locDialog: false,
      locAddDialog: false,
      tableData: [],
      locData: [],
      currentPage: 1,
      pageSize: pz,
      itemCount: 0,
      form: formData,
      formEditDialog: false,
      submitDisabled: false,
      dialogVisible: false,
      scrapcountlog: false,
      formAddress: {
        province: "",
        city: "",
        area: "",
        address: "",
        lon: 104.917445,
        lat: 11.558831,
      },
      // 库存信息
      inventoriesSearchForm: {
        key: "",
        warehouse_id: "",
        position: "",
        sku_uid: "",
        skip: 0,
        limit: pz,
      },
      istype: true,
      inventoriesList: [],
      currentPageKuCun: 1,

      pageSizeKuCun: pz,
      itemCountKuCun: 0,
      inventoriesDialog: false,
      rukuDialog: false,
      rukuForm: {
        tp: "1", // 1采购单入库 2退换货
        purchase_id: "",
        warehouse_id: "",
        skus: [],
        comment: "",
      },
      purchaseListData: [],
      chuRuKuDialog: false,
      activeChuRuKu: "1",
      activeName: "1",
      // 出库信息
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
      currentPageloca: 1,
      pageSizeloca: 20,
      itemCountloca: 0,
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
      rukuTimes: [],
      locsearchFrom: {
        id: "",
        skip: 0,
        limit: pz,
      },
      rukuData: [],
      currentPage_num: 1,
      pageSize_num: pz,
      itemCount_num: 0,
      currentPage_info: 1,
      pageSize_info: pz,
      itemCount_info: 0,
      currentPageruku: 1,
      pageSizeruku: pz,
      itemCountruku: 0,
      itemCountloc: 0,
      orderId: "",
      chukuForm: {
        warehouse_id: "",
        tp: 2, // 2报废 3退回
        skus: "",
        comment: "",
      },
      chukuDlalog: false,
      areastar: "",
      linestar: "",
      lineend: "",
      columnstar: "",
      columnend: "",
      Cid: "",
      positionList: [],
      resetForm: false,
      stockId: "",
      cangkuId: "",
      chukuArrayData: [],
      resetForm1: false,
      flag: "",
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
      goodsviewfrom: {
        key: "",
        warehouse_id: "",
        sku_uid: "",
        skip: 0,
        limit: pz,
      },
      goodsviewdata: [],
      goodsnumfrom: {
        warehouse_id: "",
        sku_uid: "",
        specification: "",
        skip: 0,
        limit: pz,
      },
      goodsnumdata: [],
      scrapcountfrom: {
        warehouse_id: "",
        tp: 2,
        sku_uid: "",
        specification: "",
      },
      scrapcountdata: [],
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
      locationfrom: {
        skip: 0,
        limit: 20,
      },
    };
  },

  watch: {
    rukuTimes(val) {
      if (val && val.length === 2) {
        this.rukuSearchForm.bt = val[0];
        this.rukuSearchForm.et = val[1];
      } else {
        this.rukuSearchForm.bt = "";
        this.rukuSearchForm.et = "";
      }
    },
    currentPageloca(val) {
      this.locationfrom.skip = (val - 1) * this.pageSizeloca;
      this.locationfrom.limit = this.pageSizeloca;
      this.getlocalList();
    },
    currentPage_num(val) {
      this.goodsviewfrom.skip = (val - 1) * this.pageSize_num;
      this.goodsviewfrom.limit = this.pageSize_num;
      this.getgrouplist();
    },
    currentPage_info(val) {
      this.goodsnumfrom.skip = (val - 1) * this.pageSize_info;
      this.goodsnumfrom.limit = this.pageSize_info;
      this.getgoodsinfodata();
    },
    currentPage(val) {
      this.searchForm.skip = (val - 1) * this.pageSize;
      this.searchForm.limit = this.pageSize;
      this.getDataListFun();
    },
    currentPageKuCun(val) {
      this.inventoriesSearchForm.skip = (val - 1) * this.pageSizeKuCun;
      this.inventoriesSearchForm.limit = this.pageSizeKuCun;
      this.getInventoriesList();
    },
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
    "rukuForm.tp": function (val) {
      console.log("tpp", val);
    },
  },
  methods: {
    shengheFuncChuku(id, number) {
      warehouseOutboundReview(id, { status: number }).then((res) => {
        this.getChuKuData();
      });
    },
    test() {
      console.log(this.chukuData);
    },
    currentKuncun(data) {
      console.log("data", data);
      data["id"] = data.sku_uid + data.specification;
      const index = this.chukuArrayData.findIndex((v) => {
        if (v.id === data.id) {
          return v;
        }
      });
      if (index === -1) {
        this.chukuArrayData.push(data);
      } else {
        this.$message.error(this.$t("warehouse.invInfohaved"));
      }
    },
    searchInStorckList() {
      this.inventoriesSearchForm.skip = 0;
      this.currentPageKuCun = 1;
      this.getInventoriesList();
    },
    chukuFunc() {
      this.chukuDlalog = true;
      this.chukuForm.tp = 2;
      this.chukuForm.skus = "";
      this.chukuForm.comment = "";
      this.stockId = "1";
      this.chukuArrayData = [];
    },
    chukuFuncSubmit() {
      this.chukuForm.skus = JSON.stringify(this.chukuArrayData);
      warehouseOutboundsAdd(this.chukuForm).then((res) => {
        if (res.meta === 0) {
          this.getChuKuData();
          this.chukuDlalog = false;
          this.stockId = "1";
        }
      });
    },
    resetOrder() {
      this.rukuForm.comment = "";
      this.rukuForm.skus = [];
      this.resetForm = true;
      this.resetForm1 = true;
    },
    resetOrder1() {
      this.resetOrder();
      this.rukuDialog = false;
    },
    addRuKuForm() {
      this.flag = this.rukuForm.skus.every((item) => {
        return item.position != "";
      });
      console.log(this.flag);
      if (this.flag == true) {
        this.rukuForm.skus = JSON.stringify(this.rukuForm.skus);
        warehouseReceiptsAdd(this.rukuForm)
          .then((res) => {
            if (res.meta === 0) {
              this.rukuDialog = false;
              this.getRuKuData();
              this.resetOrder();
            }
          })
          .catch((res) => {
            this.rukuForm.skus = JSON.parse(this.rukuForm.skus);
          });
      } else {
        this.$message(this.$t("warehouse.placeLoc"));
      }
    },
    rukuFunc() {
      this.resetForm = false;
      this.rukuForm.tp = "1";
      this.resetForm1 = false;
      this.rukuDialog = true;
      console.log("tp", this.rukuForm.tp);
    },
    // 库存信息
    showInventories(data) {
      this.currentPage_num = 1;
      this.inventoriesSearchForm.warehouse_id = data.id;
      this.goodsviewfrom.warehouse_id = data.id;
      this.getInventoriesList();
      this.getPositionList(data.id);
      this.inventoriesDialog = true;
      this.getgrouplist();
    },
    getgrouplist() {
      warehousegroup(this.goodsviewfrom).then((res) => {
        this.goodsviewdata = res.items;
        this.itemCount_num = res.total;
        console.log(this.goodsviewdata);
      });
    },
    goodsviewSearch() {
      this.getgrouplist();
    },
    getInventoriesList() {
      warehouseInventories(this.inventoriesSearchForm).then((res) => {
        if (res.meta === 0) {
          this.inventoriesList = res.items;
          this.itemCountKuCun = res.total;
        }
      });
    },
    tpChange(e) {
      this.rukuForm.purchase_id = "";
    },
    getPurchaseList() {
      purchaseList().then((res) => {
        if (res.meta === 0) {
          this.purchaseListData = res.items;
        }
      });
    },
    placeCheck() {
      if (
        this.formAddress.province !== "" &&
        this.formAddress.city !== "" &&
        this.formAddress.district !== "" &&
        this.formAddress.addr !== "" &&
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
          type: "1",
          name: "",
          no: "",
          short_name: "",
          pinyin_code: "",
          comment: "",
          contacter_name: "",
          contacter_mobile: "",
          address: {
            province: "",
            city: "",
            district: "",
            addr: "",
            coord: [],
          },
          postcode: "",
        };
      }
    },
    addData() {
      this.form = this.setForm();
      this.formEditDialog = true;
    },
    closeDialog2() {
      this.chuRuKuDialog = false;
    },
    showDataEditor(data) {
      console.log(data);
      // this.form = JSON.parse(JSON.stringify(data))
      this.form.contacter_name = data.contacter.name;
      this.form.contacter_mobile = data.contacter.mobile;
      this.form.id = data.id;
      this.form.name = data.name;
      this.form.no = data.no;
      this.form.short_name = data.short_name;
      this.form.pinyin_code = data.pinyin_code;
      this.form.comment = data.comment;
      this.form.postcode = data.postcode;
      // warehousesInfo(data.id).then((res) => {
      //   //  console.log(res)
      // })
      this.formEditDialog = true;
    },
    imageUploadSuccess(res) {
      this.form.image = res.md5;
      // console.log(res)
    },
    closeDialog() {
      this.locDialog = false;
    },
    saveDataFunc() {
      this.submitDisabled = true;
      // console.log(this.form)
      this.form.address.province = this.formAddress.province;
      this.form.address.city = this.formAddress.city;
      this.form.address.district = this.formAddress.area;
      this.form.address.addr = this.formAddress.address;
      this.form.address.coord.push(this.formAddress.lon, this.formAddress.lat);
      this.placeCheck();
      const arr = this.form.address;
      this.form.address = JSON.stringify(arr);
      console.log(this.form);
      if (this.form.id !== "") {
        warehousesModify(this.form.id, this.form)
          .then((res) => {
            this.getDataListFun();
            this.formEditDialog = false;
            this.submitDisabled = false;
          })
          .catch(() => {
            this.submitDisabled = false;
          });
      } else {
        warehousesAdd(this.form)
          .then((res) => {
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
      // console.log(row.id)
      warehousesDel(row.id).then((res) => {
        this.getDataListFun();
      });
    },
    getDataListFun() {
      warehousesList(this.searchForm).then((res) => {
        this.tableData = res.items;
        this.itemCount = res.total;
        // console.log(res)
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
    search() {
      this.chuKuSearchForm.skip = 0;
      this.currentPagechuku = 1;
      this.getChuKuData();
    },
    showOutbounds(data) {
      this.wareId = data.id;
      console.log(this.wareId);
      this.rukuForm.warehouse_id = data.id;
      this.chuKuSearchForm.warehouse_id = data.id;
      this.rukuSearchForm.warehouse_id = data.id;
      this.cangkuId = data.id;
      this.chukuForm.warehouse_id = data.id;
      this.getRuKuData();
      this.getChuKuData();
      this.getPositionList(data.id);
      this.chuRuKuDialog = true;
    },
    getPositionList(id) {
      waregetlocallist(id).then((res) => {
        this.positionList = res.items;
      });
    },
    getRuKuData() {
      warehouseReceipts(this.rukuSearchForm).then((res) => {
        if (res.meta === 0) {
          this.rukuData = res.items;
          this.itemCountruku = res.total;
        }
      });
    },
    loclist(data) {
      this.locsearchFrom.id = data.id;
      this.getlocalList();
      this.locDialog = true;
      this.ids = [];
    },
    locallistAdd() {
      this.areastar = "";
      this.linestar = "";
      this.lineend = "";
      this.columnstar = "";
      this.columnend = "";
      this.locDialog = true;
      this.locAddDialog = true;
    },
    getlocalList() {
      waregetlocallist(this.locsearchFrom.id, this.locationfrom).then((res) => {
        this.locData = res.items;
        this.itemCountloca = res.total;
      });
    },
    handleSelectionChange(val) {
      this.ids = [];
      for (const item of val) {
        this.ids.push(item.id);
      }
    },
    wareLocaladd() {
      if (this.linestar <= this.lineend && this.columnstar <= this.columnend) {
        const positions = [];
        for (let i = this.linestar; i <= this.lineend; i++) {
          for (let j = this.columnstar; j <= this.columnend; j++) {
            positions.push(this.areastar + "-" + i + "-" + j);
          }
        }
        console.log(positions);
        warelocalAll(this.locsearchFrom.id, {
          positions: JSON.stringify(positions),
        }).then((res) => {
          this.getlocalList();
        });
        this.locAddDialog = false;
        this.locDialog = true;
      } else {
        this.$message.error(this.$t("warehouse.parameterMsg"));
        return;
      }
    },
    saveDataDel() {
      if (this.ids.length < 1) {
        this.$message.error(this.$t("warehouse.Delmsg"));
      } else {
        let position_ids = [];
        for (let item of this.ids) {
          position_ids.push(item);
        }
        // console.log(position_ids);
        LocationDel(this.locsearchFrom.id, {
          position_ids: JSON.stringify(position_ids),
        }).then((res) => {
          if (res.meta === 0) {
            this.getlocalList();
            this.ids = [];
          }
        });
      }
    },
    pulist(data) {
      if (data != undefined) {
        this.rukuForm.skus = data;
        console.log(data);
      }
    },
    getid(id) {
      if (id != undefined) {
        this.rukuForm.purchase_id = id;
        // this.rukuForm.tp = 1
      }
    },
    dataSearch() {
      this.getRuKuData();
    },
    wareinfoExport() {
      warehousereport({
        warehouse_id: this.inventoriesSearchForm.warehouse_id,
      }).then((res) => {
        var a = document.createElement("a");
        let blod = new Blob([res], { type: "app;ication/vnd.ms-excel" });
        a.href = URL.createObjectURL(blod);
        a.download = "Inventoryinfo.xlsx";
        a.click();
      });
    },
    goodsnuminfo(data) {
      // console.log(data);
      this.goodsnumfrom.sku_uid = data.sku_uid;
      this.goodsnumfrom.warehouse_id = this.inventoriesSearchForm.warehouse_id;
      this.goodsnumfrom.specification = data.specification;
      this.getgoodsinfodata();
    },
    getgoodsinfodata() {
      warehouseInventories(this.goodsnumfrom).then((res) => {
        if (res.meta == 0) {
          this.goodsnumdata = res.items;
          this.itemCount_info = res.total;
          this.dialogVisible = true;
        }
      });
      console.log(this.goodsnumfrom.warehouse_id);
    },
    goodsscrapcount(data) {
      if (data.scrap_count > 0) {
        this.scrapcountfrom.sku_uid = data.sku_uid;
        this.scrapcountfrom.warehouse_id =
          this.inventoriesSearchForm.warehouse_id;
        this.scrapcountfrom.specification = data.specification;
        this.getscrapcountdata();
        this.scrapcountlog = true;
      } else {
        this.$message(this.$t("warehouse.noinformation"));
      }
    },
    getscrapcountdata() {
      warehouseOutbounds(this.scrapcountfrom).then((res) => {
        this.scrapcountdata = res.items;
        console.log(this.scrapcountdata);
      });
    },
    Orderinfo(data) {
      sessionStorage.setItem("orderid", data);
      this.$router.push({
        path: "/order/list",
      });
    },
  },
  mounted() {
    this.getDataListFun();
    this.getPurchaseList();
    this.pulist();
    this.getid();
    console.log(this.chukuArrayData, "5555");
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.funcList {
  width: 100%;
  text-align: right;
}
.boxFuncBtn2 {
  float: right;
  display: flex;
  align-items: center;
  .el-button--text {
    color: #24303e;
  }
  .icon_add {
    padding-right: 5px;
    cursor: pointer;
    display: inline-block;
  }
  .el-upload {
    display: flex;
    align-items: center;
  }
}
.goodsInfo {
  span {
    color: red;
  }
}
.localval {
  display: flex;
  align-items: center;
  > span {
    min-width: 50px;
    margin-right: 5px;
  }
  > div {
    margin-bottom: 5px;
    width: 100px;
  }
}
// .address {
//   display: flex
//   flex-wrap: wrap
//   > div {
//     width: 300px
//   }
// }
.inputNumber {
  /deep/ {
    .el-input-number {
      line-height: 26px;
      width: 100%;
    }
  }
}
.goods {
  .odd {
    border-top: 1px solid #ccc;
    &:first-child {
      border: 0 none;
    }
  }
}
.searchBox {
  display: flex;
  align-items: center;
  > div {
    margin-right: 5px;
  }
}
.searchBox2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  > div {
    > div {
      margin-right: 5px;
    }
  }
}
.exbox {
  display: flex;
  justify-content: space-between;
}
.numcss {
  display: inline-block;
  width: 100%;
  cursor: pointer;
  color: #409eff;
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

.formText {
  font-size: 14px;
  font-weight: bold;
}

.grid-content {
  min-height: 38px;
}
</style>
