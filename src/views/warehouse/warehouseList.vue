<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="10" class="funcList">
            <div class="boxFuncBtn" @click="addData" v-if="permissionCheck('opt')">
              <img src="../../assets/images/icon/icon_add.png" alt class="icon_add" />
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <!-- 表格 -->
              <el-table stripe border :data="tableData" height="calc(100% - 40px)">
                <!-- 仓库名称 -->
                <el-table-column prop="name" :label="$t('warehouse.name')"></el-table-column>
                <!-- 备注 -->
                <el-table-column :label="$t('warehouse.remarks')">
                  <template slot-scope="scope">{{scope.row.comment}}</template>
                </el-table-column>
                <!-- 简称 -->
                <el-table-column :label="$t('warehouse.abbreviation')">
                  <template slot-scope="scope">{{scope.row.short_name}}</template>
                </el-table-column>
                <!-- 数量 -->
                <el-table-column :label="$t('warehouse.num1')">
                  <template slot-scope="scope">{{scope.row.no}}</template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column :label="$t('tools.opt')" v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="showDataEditor(scope.row)"
                      size="small"
                    >{{$t('tools.edit')}}</el-button>
                    <span class="xiexian">/</span>
                    <delete-button @delData="deleteDataFunc(scope.row)"></delete-button>
                    <span class="xiexian">/</span>
                    <el-button type="text" @click="showInventories(scope.row)" size="small">{{$t('warehouse.stockmsg')}}</el-button>
                    <span class="xiexian">/</span>
                    <el-button type="text" @click="showOutbounds(scope.row)" size="small">{{$t('warehouse.journal')}}</el-button>
                    <span class="xiexian">/</span>
                    <el-button type="text" @click="loclist(scope.row)" size="small">{{$t('warehouse.location')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
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
        <el-dialog
          class="dialog"
          :title="$t('warehouse.add')"
          width="700px"
          @close="formEditDialog=false"
          :visible.sync="formEditDialog"
          :close-on-click-modal="false"
          center
        >
          <el-form label-width="100px" :model="form">
            <!-- 仓库名称 -->
            <el-form-item :label="$t('warehouse.name')">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!-- 仓库编号 -->
            <el-form-item :label="$t('warehouse.num1')">
              <el-input v-model="form.no"></el-input>
            </el-form-item>
            <!-- 简称 -->
            <el-form-item :label="$t('warehouse.abbreviation')">
              <el-input v-model="form.short_name"></el-input>
            </el-form-item>
            <!-- 拼音码 -->
            <el-form-item :label="$t('warehouse.Pinyin')">
              <el-input v-model="form.pinyin_code"></el-input>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('warehouse.remarks')">
              <el-input v-model="form.comment"></el-input>
            </el-form-item>
            <!-- 手机联系人 -->
            <el-form-item :label="$t('warehouse.contacts')">
              <el-input v-model="form.contacter_name"></el-input>
            </el-form-item>
            <!-- 联系人手机 -->
            <el-form-item :label="$t('warehouse.tel')">
              <el-input v-model="form.contacter_mobile"></el-input>
            </el-form-item>
            <!-- 邮编 -->
            <el-form-item :label="$t('warehouse.Postcode')">
              <el-input v-model="form.postcode"></el-input>
            </el-form-item>
            <!-- 地址选择 -->
            <el-form-item class="start" :label="$t('sys.address1')">
              <map-selector v-model="formAddress"></map-selector>
              <div class="distpicker_error" v-if="placeShow">{{$t('sys.selectAddress')}}</div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button
              @confirmButton="saveDataFunc()"
              :disabled="submitDisabled"
              :confirmButtonInfor="$t('tools.confirm')"
            ></confirm-button>
          </div>
        </el-dialog>
        <!--库存信息列表-->
        <el-dialog class="dialog" :title="$t('warehouse.stockmsg')" width="70%" @close="inventoriesDialog=false" :visible.sync="inventoriesDialog"
          :close-on-click-modal="false" center >
          <el-row>
            <el-col :span="24">
              <el-form :inline="true" :model="inventoriesSearchForm">
              <div class="searchBox">
                <el-form-item>
                  <el-select v-model="inventoriesSearchForm.position" clearable :placeholder="$t('warehouse.Pleaseselect')">
                    <el-option
                      v-for="item in positionList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="inventoriesSearchForm.key"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchInStorckList" size="small" icon="el-icon-search"></el-button>
                </el-form-item>
              </div>
              </el-form>
            </el-col>
          </el-row>
          <el-table stripe border :data="inventoriesList" height="calc(100vh - 400px)">
            <!-- 仓库名称 -->
            <el-table-column prop="name" :label="$t('warehouse.name2')"></el-table-column>
            <el-table-column prop="specification" :label="$t('warehouse.pecifications')">
              <template slot-scope="scope">
                {{textFilter(scope.row.specification)}}
              </template>
            </el-table-column>
            <el-table-column prop="barcode" :label="$t('warehouse.barCode')"></el-table-column>
            <el-table-column prop="count" :label="$t('warehouse.num')"></el-table-column>
            <el-table-column prop="unit_price" :label="$t('warehouse.price')">
              <template slot-scope="scope">{{scope.row.unit_price | price}}</template>
            </el-table-column>
            <el-table-column prop="total_price" :label="$t('warehouse.allprice')">
              <template slot-scope="scope">{{scope.row.total_price | price}}</template>
            </el-table-column>
            <el-table-column prop="position" :label="$t('warehouse.position')"></el-table-column>
          </el-table>
          <div style="text-align: right;margin-top: 10px">
            <el-pagination
              :current-page.sync="currentPageKuCun"
              :page-size="pageSizeKuCun"
              layout="total, prev, pager, next, jumper"
              :total="itemCountKuCun"
            ></el-pagination>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="inventoriesDialog=false" size="small">{{$t('tools.close')}}</el-button>
          </div>
        </el-dialog>
        <!--出入库信息-->
        <el-dialog class="dialog" :title="$t('warehouse.information')" width="85%"
                   @close="chuRuKuDialog=false"
                   :visible.sync="chuRuKuDialog"
                   :close-on-click-modal="false"
                   center
        >
          <el-tabs v-model="activeChuRuKu">
            <el-tab-pane :label="$t('warehouse.enterlist')" name="1"></el-tab-pane>
            <el-tab-pane :label="$t('warehouse.outlist')" name="2"></el-tab-pane>
            <div v-if="activeChuRuKu === '1'">
              <div class="searchBox">
                <div>
                  <el-select v-model="rukuSearchForm.tp" clearable>
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <el-input v-model="rukuSearchForm.key"></el-input>
                </div>
                <div>
                  <el-button type="primary" @click="dataSearch" icon="el-icon-search" size="small"></el-button>
                </div>
              </div>
              <el-row>
                <el-col :span="20">
                  <el-form :inline="true" :model="rukuSearchForm">
                    <el-form-item>
                    </el-form-item>
                    <el-form-item>
                      <!--<el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>-->
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="4" align="right">
                  <div class="boxFuncBtn2" @click="rukuFunc" v-if="permissionCheck('opt')">
                    <img src="../../assets/images/icon/icon_add.png" alt class="icon_add" />
                    <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-table stripe border :data="rukuData" height="calc(100vh - 450px)">
                <el-table-column prop="pu_no" :label="$t('warehouse.pu_no')" width="150px"></el-table-column>
                <el-table-column prop="no" :label="$t('warehouse.number')" width="150px"></el-table-column>
                <el-table-column prop="comment" :label="$t('warehouse.remarks')" width="150px"></el-table-column>
                <el-table-column prop="warehouse_name" :label="$t('warehouse.name')" width="200px"></el-table-column>
                <el-table-column prop="supplier_name" :label="$t('warehouse.SupplierNmae')" width="150px"></el-table-column>
                <el-table-column >
                  <template slot="header">
                    <el-row style="width: 100%">
                      <el-col :span="10">{{$t('warehouse.Tradename')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.position')}}</el-col>
                      <el-col :span="3" style="text-align: center">{{$t('warehouse.pecifications')}}</el-col>
                      <el-col :span="3" style="text-align: center">{{$t('warehouse.barCode')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.price')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.num')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.allprice')}}</el-col>
                    </el-row>
                  </template>
                  <template slot-scope="scope">
                    <div class="goods">
                      <el-row v-for="(item, k) in scope.row.skus" :key="k" class="odd" style="width: 100%">
                        <el-col :span="10">{{item.name}}</el-col>
                        <el-col :span="2" style="text-align: center;min-width: 20px">{{item.position !== '' ? item.position : 'No' }}</el-col>
                        <el-col :span="3" style="text-align: center">{{textFilter(item.specification)}}</el-col>
                        <el-col :span="3" style="text-align: center">{{item.barcode !== '' ? item.barcode : 'No'}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.unit_price | price}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.count}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.total_price | price}}</el-col>
                      </el-row>
                    </div>

                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" :label="$t('warehouse.time')" width="160px"></el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
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
                      <el-form-item>
                        <el-select v-model="chuKuSearchForm.tp" clearable>
                          <el-option
                            v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-input v-model="chuKuSearchForm.key"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
                      </el-form-item>
                    </el-form>
                  </el-col>
              </div>
                 <el-col :span="4" align="right">
                  <div class="boxFuncBtn2" @click="chukuFunc" v-if="permissionCheck('opt')">
                    <img src="../../assets/images/icon/icon_add.png" alt class="icon_add" />
                    <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
                  </div>
                </el-col>
              <el-table stripe border :data="chukuData" height="calc(100% - 40px)">
                <el-table-column prop="no" :label="$t('warehouse.Singlenumber')" width="120px"></el-table-column>
                <el-table-column prop="warehouse_name" :label="$t('warehouse.name')" width="100px"></el-table-column>
                <el-table-column :label="$t('warehouse.type')" width="100px">
                  <template slot-scope="scope">
                      <span v-if="scope.row.tp === 1">{{$t('warehouse.order')}}</span>
                      <span v-if="scope.row.tp === 2">{{$t('warehouse.Scrap')}}</span>
                      <span v-if="scope.row.tp === 3">{{$t('warehouse.return')}}</span>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot="header">
                    <el-row style="width: 100%">
                      <el-col :span="10">{{$t('warehouse.Tradename')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.position')}}</el-col>
                      <el-col :span="3" style="text-align: center">{{$t('warehouse.pecifications')}}</el-col>
                      <el-col :span="3" style="text-align: center">{{$t('warehouse.barCode')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.price')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.num')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.allprice')}}</el-col>
                    </el-row>
                  </template>
                  <template slot-scope="scope">
                    <div class="goods">
                      <el-row v-for="(item, k) in scope.row.skus" :key="k" class="odd" style="width: 100%">
                        <el-col :span="10">{{item.name}}</el-col>
                        <el-col :span="2" style="text-align: center;min-width: 20px">{{item.position !== '' ? item.position : 'No' }}</el-col>
                        <el-col :span="3" style="text-align: center">{{textFilter(item.specification)}}</el-col>
                        <el-col :span="3" style="text-align: center">{{item.barcode !== '' ? item.barcode : 'No'}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.unit_price | price}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.count}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.total_price | price}}</el-col>
                      </el-row>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="shipping_address" :label="$t('warehouse.Address')" width="200px">
                  <template slot-scope="scope" @click="test">
                    <span @click="test" v-if="scope.row.shipping_address != null">
                      {{scope.row.shipping_address.address.province}}-
                      {{scope.row.shipping_address.address.city}}-
                      {{scope.row.shipping_address.address.district}}-
                      {{scope.row.shipping_address.address.addr}}
                      </span>
                    <span @click="test" v-if="scope.row.shipping_address == null">{{$t('warehouse.noinformation')}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="shipping_address" :label="$t('warehouse.Courierinformation')" width="200px">
                  <template slot-scope="scope" @click="test">
                    <span @click="test" v-if="scope.row.express == null">{{$t('warehouse.noinformation')}}</span>
                    <span @click="test" v-if="scope.row.express != null">
                      <div>{{$t('warehouse.corporateName')}}: {{scope.row.express.company}}</div>
                      <div>{{$t('warehouse.Singlenumber')}}: {{scope.row.express.novar}}</div>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" :label="$t('warehouse.time')" width="150px"></el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPagechuku"
                  :page-size="pageSizechuku"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCountchuku"
                ></el-pagination>
              </div>
            </div>
          </el-tabs>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeDialog2" size="small">{{$t('tools.close')}}</el-button>
          </div>
        </el-dialog>
        <!--入库设置-->
        <el-dialog :title="$t('warehouse.StockinorderSet')" @close="resetOrder1" width="80%" append-to-body :visible.sync="rukuDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="rukuForm">
            <el-form-item :label="$t('warehouse.type')">
              <!-- <el-radio-group v-model="rukuForm.tp" @change="tpChange">
                <el-radio :label="1">{{$t('warehouse.inpuWarehouse')}}</el-radio>
                <el-radio :label="2">{{$t('warehouse.Returnexchange')}}</el-radio>
              </el-radio-group> -->
              <el-radio v-model="rukuForm.tp" label="1">{{$t('warehouse.inpuWarehouse')}}</el-radio>
              <el-radio v-model="rukuForm.tp" label="2">{{$t('warehouse.Returnexchange')}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('warehouse.remarks')">
              <el-input v-model="rukuForm.comment" type="textarea"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.order')" v-if="rukuForm.tp == '2'">
              <show-sku-table :resetForm="resetForm" :position="positionList" v-model="rukuForm.skus"></show-sku-table>
            </el-form-item>
            <el-form-item :label="$t('warehouse.Purchaseorder')" v-if="rukuForm.tp == '1'">
               <show-sku-plist :warehouseId2="wareId" :resetForm="resetForm1" @pulist='pulist' @getid='getid' v-model="rukuForm.skus"></show-sku-plist>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="addRuKuForm" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
        <!--出库信息设置-->
        <el-dialog :title="$t('warehouse.DeliverySet')" width="80%" @close="chukuDlalog=false" append-to-body :visible.sync="chukuDlalog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="chukuForm">
            <el-form-item :label="$t('warehouse.type')">
              <el-radio-group v-model="chukuForm.tp" @change="tpChange">
                <el-radio :label="2">{{$t('warehouse.Scrap')}}</el-radio>
                <el-radio :label="3">{{$t('warehouse.return')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('warehouse.stockmsg')">
              <stock-select style="width: 300px;" :warehouseId="cangkuId" @goodSelectedInfo="currentKuncun" v-model="stockId"></stock-select>
              <el-table :data="chukuArrayData" style="width: 100%" class="inputNumber">
                <el-table-column prop="name" :label="$t('warehouse.name2')"></el-table-column>
                <el-table-column prop="specification" :label="$t('warehouse.pecifications')">
                  <template slot-scope="scope">
                    {{textFilter(scope.row.specification)}}
                  </template>
                </el-table-column>
                <el-table-column prop="barcode" :label="$t('warehouse.barCode')"></el-table-column>
                <el-table-column prop="position" :label="$t('warehouse.position')"></el-table-column>
                <el-table-column prop="unit_price" :label="$t('warehouse.price')">
                  <template slot-scope="scope">
                    {{scope.row.unit_price | price}}
                  </template>
                </el-table-column>
                <el-table-column prop="count" :label="$t('warehouse.num')">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count" :min="1" :max="scope.row.count"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="total_price" :label="$t('warehouse.allprice')">
                  <template slot-scope="scope">
                    {{scope.row.total_price | price}}
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="chukuFuncSubmit" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
        <!-- 货位列表 -->
        <el-dialog
          class="dialog"
          :title="$t('warehouse.locationList')"
          width="px"
          @close="locDialog = false"
          :visible.sync="locDialog"
          :close-on-click-modal="false"
          center
        >
          <confirm-button @confirmButton="locallistAdd()" :disabled="submitDisabled" :confirmButtonInfor="$t('warehouse.batchAdd')"></confirm-button>
          <el-table
            ref="multipleTable"
            :data="locData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              :label="$t('warehouse.location2')">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataDel()" :disabled="submitDisabled" :confirmButtonInfor="$t('warehouse.batchDel')"></confirm-button>
            <confirm-button @confirmButton="closeDialog()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
        <!-- 货位添加 -->
        <el-dialog
          class="dialog"
          :title="$t('warehouse.location2Add')"
          width="500px"
          @close="locAddDialog = false"
          :visible.sync="locAddDialog"
          :close-on-click-modal="false"
          center
        >
        <div class="localval">
          <span>{{$t('warehouse.line')}}</span>
          <div><el-input v-model="linestar"></el-input></div>&nbsp;-&nbsp;
          <div><el-input v-model="lineend"></el-input></div>
        </div>
        <div class="localval">
          <span>{{$t('warehouse.column')}}</span>
          <div><el-input v-model="columnstar"></el-input></div>&nbsp;-&nbsp;
          <div><el-input v-model="columnend"></el-input></div>
        </div>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="wareLocaladd()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
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
  warehousesInfo,
  warehouseInventories,
  warehouseReceiptsAdd,
  warehouseReceipts,
  purchaseList,
  warehouseOutbounds,
  warehouseOutboundsAdd,
  warelocalAll,
  waregetlocallist,
  LocationDel
} from '@/api/warehouse'
export default {
  components: {},
  data() {
    const formData = this.setForm()
    const pz = 10
    return {
      triggersType: [
        { code: 1, name: this.$t('operation.triggersA') },
        { code: 2, name: this.$t('operation.triggersB') },
        { code: 3, name: this.$t('operation.triggersC') }
      ],
      timeValidSwitch: true,
      searchForm: {
        skip: '',
        limit: pz
      },
      ids: [],
      wareId:'',
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
      formAddress: {
        province: '',
        city: '',
        area: '',
        address: '',
        lon: 104.917445,
        lat: 11.558831
      },
      // 库存信息
      inventoriesSearchForm: {
        key:'',
        warehouse_id: '',
        position: '',
        sku_uid: '',
        skip: 0,
        limit: pz
      },
      istype: true,
      inventoriesList: [],
      currentPageKuCun: 1,

      pageSizeKuCun: pz,
      itemCountKuCun: 0,
      inventoriesDialog: false,
      rukuDialog: false,
      rukuForm: {
        tp: '1', // 1采购单入库 2退换货
        purchase_id: '',
        warehouse_id: '',
        skus: [],
        comment: ''
      },
      purchaseListData: [],
      chuRuKuDialog: false,
      activeChuRuKu: '1',
      // 出库信息
      chuKuSearchForm: {
        key: '',
        tp: '',
        warehouse_id: '',
        bt: '',
        et: '',
        skip: 0,
        limit: pz
      },
      chukuData: [],
      currentPagechuku: 1,
      pageSizechuku: pz,
      itemCountchuku: 0,
      skusArray: [],
      orderTimes: [],
      // 入库单列表信息
      rukuSearchForm: {
        tp:'',
        key:'',
        purchase_id: '',
        warehouse_id: '',
        supplier_id: '',
        skip: '',
        limit: ''
      },
      locsearchFrom: {
        id: '',
        skip: 0,
        limit: pz
      },
      rukuData: [],
      currentPageruku: 1,
      pageSizeruku: pz,
      itemCountruku: 0,
      itemCountloc: 0,
      orderId: '',
      chukuForm: {
        warehouse_id: '',
        tp: 2, // 2报废 3退回
        skus: ''
      },
      chukuDlalog: false,
      linestar: '',
      lineend: '',
      columnstar: '',
      columnend: '',
      Cid: '',
      positionList: [],
      resetForm: false,
      stockId: '',
      cangkuId: '',
      chukuArrayData: [],
      resetForm1: false,
      flag:'',
      options:[
        {value:'1',label: this.$t('warehouse.inpuWarehouse')},
        {value:'2',label: this.$t('warehouse.Returnexchange')}
        ],
      options2:[
        {value:'1',label: this.$t('warehouse.Orderdelivery')},
        {value:'2',label: this.$t('warehouse.Scrap')},
        {value:'3',label: this.$t('warehouse.return')},
        ]
    }
  },

  watch: {
    currentPage(val) {
      this.searchForm.skip = (val - 1) * this.pageSize
      this.searchForm.limit = this.pageSize
      this.getDataListFun()
    },
    currentPageKuCun(val) {
      this.inventoriesSearchForm.skip = (val - 1) * this.pageSizeKuCun
      this.inventoriesSearchForm.limit = this.pageSizeKuCun
      this.getInventoriesList()
    },
    currentPagechuku(val) {
      this.chuKuSearchForm.skip = (val - 1) * this.pageSizechuku
      this.chuKuSearchForm.limit = this.pageSizechuku
      this.getChuKuData()
    },
    currentPageruku(val) {
      this.rukuSearchForm.skip = (val - 1) * this.pageSizeruku
      this.rukuSearchForm.limit = this.pageSizeruku
      this.getRuKuData()
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
    'rukuForm.tp': function(val) {
      console.log('tpp', val)
    }
  },
  methods: {
    test(){
      console.log(this.chukuData);
    },
    currentKuncun(data) {
      console.log('data', data)
      this.chukuArrayData.push(data)
    },
    searchInStorckList() {
      this.inventoriesSearchForm.skip = 0
      this.currentPageKuCun = 1
      this.getInventoriesList()
    },
    chukuFunc() {
      this.chukuDlalog = true
      this.chukuForm.tp = 2
      this.chukuForm.skus = ''
      this.stockId = '1'
      this.chukuArrayData = []
    },
    chukuFuncSubmit() {
      this.chukuForm.skus = JSON.stringify(this.chukuArrayData)
      warehouseOutboundsAdd(this.chukuForm).then(res => {
        if (res.meta === 0) {
          this.getChuKuData()
          this.chukuDlalog = false
          this.stockId = '1'
        }
      })
    },
    resetOrder() {
      this.rukuForm.comment = ''
      this.rukuForm.skus = []
      this.resetForm = true
      this.resetForm1 = true
    },
    resetOrder1() {
      this.resetOrder()
      this.rukuDialog = false
    },
    textFilter(data) {
      let index = data.indexOf('{')
      if(index != -1){
        let str = ''
        const text = JSON.parse(data)
        Object.keys(text).forEach((v, i) => {
          if (i === 0) {
            str = v + ':' + text[v] + ';'
          } else {
            str = str + v + ':' + text[v] + ';'
          }
        })
        return str
      }else{
        return data
      }
    },
    addRuKuForm() {
          this.flag = this.rukuForm.skus.every(item => {
            return item.position != ''
          });
          console.log(this.flag);
          if(this.flag == true){
            this.rukuForm.skus = JSON.stringify(this.rukuForm.skus)
            warehouseReceiptsAdd(this.rukuForm).then(res => {
              if (res.meta === 0) {
                this.rukuDialog = false
                this.getRuKuData()
                this.resetOrder()
              }
            }).catch(res=>{
              this.rukuForm.skus = JSON.parse(this.rukuForm.skus)
            })
          }else{
             this.$message(this.$t('warehouse.placeLoc'))
          }
    },
    rukuFunc() {
      this.resetForm = false
      this.rukuForm.tp = '1'
      this.resetForm1 = false
      this.rukuDialog = true
      console.log('tp', this.rukuForm.tp)
    },
    showInventories(data) {
      this.inventoriesSearchForm.warehouse_id = data.id
      this.getInventoriesList()
      this.getPositionList(data.id)
      this.inventoriesDialog = true
    },
    getInventoriesList() {
      warehouseInventories(this.inventoriesSearchForm).then(res => {
        if (res.meta === 0) {
          this.inventoriesList = res.items
          this.itemCountKuCun = res.total
        }
      })
    },
    tpChange(e) {
      this.rukuForm.purchase_id = ''
    },
    getPurchaseList() {
      purchaseList().then(res => {
        if (res.meta === 0) {
          this.purchaseListData = res.items
        }
      })
    },
    placeCheck() {
      if (
        this.formAddress.province !== '' &&
        this.formAddress.city !== '' &&
        this.formAddress.district !== '' &&
        this.formAddress.addr !== '' &&
        this.formAddress.lat !== '' &&
        this.formAddress.lon !== ''
      ) {
        this.placeShow = false
        this.placeChecked = true
      } else {
        this.placeShow = true
        this.placeChecked = false
      }
    },
    setForm(data) {
      if (data) {
        return data
      } else {
        return {
          id: '',
          type: '1',
          name: '',
          no: '',
          short_name: '',
          pinyin_code: '',
          comment: '',
          contacter_name: '',
          contacter_mobile: '',
          address: {
            province: '',
            city: '',
            district: '',
            addr: '',
            coord: []
          },
          postcode: ''
        }
      }
    },
    addData() {
      this.form = this.setForm()
      this.formEditDialog = true
    },
    closeDialog2(){
      this.chuRuKuDialog = false
    },
    showDataEditor(data) {
      console.log(data);
      // this.form = JSON.parse(JSON.stringify(data))
      this.form.contacter_name = data.contacter.name
      this.form.contacter_mobile = data.contacter.mobile
      this.form.id = data.id
      this.form.name = data.name
      this.form.no = data.no
      this.form.short_name = data.short_name
      this.form.pinyin_code = data.pinyin_code
      this.form.comment = data.comment
      this.form.postcode = data.postcode
      // warehousesInfo(data.id).then((res) => {
      //   //  console.log(res)
      // })
      this.formEditDialog = true
    },
    imageUploadSuccess(res) {
      this.form.image = res.md5
      // console.log(res)
    },
    closeDialog() {
      this.locDialog = false
    },
    saveDataFunc() {
      this.submitDisabled = true
      // console.log(this.form)
      this.form.address.province = this.formAddress.province
      this.form.address.city = this.formAddress.city
      this.form.address.district = this.formAddress.area
      this.form.address.addr = this.formAddress.address
      this.form.address.coord.push(this.formAddress.lon, this.formAddress.lat)
      this.placeCheck()
      const arr = this.form.address
      this.form.address = JSON.stringify(arr)
      console.log(this.form)
      if (this.form.id !== '') {
        warehousesModify(this.form.id, this.form)
          .then((res) => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          })
          .catch(() => {
            this.submitDisabled = false
          })
      } else {
        warehousesAdd(this.form)
          .then((res) => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          })
          .catch(() => {
            this.submitDisabled = false
          })
      }
    },
    deleteDataFunc(row) {
      // console.log(row.id)
      warehousesDel(row.id).then((res) => {
        this.getDataListFun()
      })
    },
    getDataListFun() {
      warehousesList(this.searchForm).then((res) => {
        this.tableData = res.items
        this.itemCount = res.total
        // console.log(res)
      })
    },
    getChuKuData() {
      warehouseOutbounds(this.chuKuSearchForm).then(res => {
        if (res.meta === 0) {
          this.chukuData = res.items
          this.itemCountchuku = res.total
        }
      })
    },
    search() {
      this.chuKuSearchForm.skip = 0
      this.currentPagechuku = 1
      this.getChuKuData()
    },
    showOutbounds(data) {
      this.wareId = data.id
      console.log(this.wareId);
      this.rukuForm.warehouse_id = data.id
      this.chuKuSearchForm.warehouse_id = data.id
      this.rukuSearchForm.warehouse_id = data.id
      this.cangkuId = data.id
      this.chukuForm.warehouse_id = data.id
      this.getRuKuData()
      this.getChuKuData()
      this.getPositionList(data.id)
      this.chuRuKuDialog = true
    },
    getPositionList(id) {
      waregetlocallist(id).then(res => {
        this.positionList = res.items
      })
    },
    getRuKuData() {
      warehouseReceipts(this.rukuSearchForm).then(res => {
        if (res.meta === 0) {
          this.rukuData = res.items
          this.itemCountruku = res.total
        }
      })
    },
    loclist(data) {
      this.locsearchFrom.id = data.id
      this.getlocalList()
      this.locDialog = true
      this.ids = []
    },
    locallistAdd() {
      this.linestar = ''
      this.lineend = ''
      this.columnstar = ''
      this.columnend = ''
      this.locDialog = false
      this.locAddDialog = true
    },
    getlocalList() {
      waregetlocallist(this.locsearchFrom.id).then(res => {
        this.locData = res.items
        this.itemCountloc = res.total
      })
    },
    handleSelectionChange(val) {
      this.ids = []
      for (const item of val) {
        this.ids.push(item.id)
      }
    },
    wareLocaladd() {
      if (this.linestar < this.lineend && this.columnstar < this.columnend) {
        const positions = []
        for (let i = this.linestar; i <= this.lineend; i++) {
          for (let j = this.columnstar; j <= this.columnend; j++) {
            positions.push(i + '-' + j)
          }
        }
        warelocalAll(this.locsearchFrom.id, { positions: JSON.stringify(positions) }).then(res => {
          this.getlocalList()
        })
        this.locAddDialog = false
        this.locDialog = true
      }else {
        this.$message.error(this.$t('warehouse.parameterMsg'))
        return
      }
    },
    saveDataDel(){
      if(this.ids.length < 1){
        this.$message.error(this.$t('warehouse.Delmsg'))
      }else{
        let position_ids = []
        for(let item of this.ids){
         position_ids.push(item)
        }
        // console.log(position_ids);
        LocationDel(this.locsearchFrom.id, { position_ids: JSON.stringify(position_ids) }).then(res => {
          if (res.meta === 0) {
            this.getlocalList()
            this.ids = []
          }
        })
      }
    },
    pulist(data){
     if(data != undefined){
       this.rukuForm.skus = data
       console.log(data);
     }
    },
    getid(id){
       if(id != undefined){
        this.rukuForm.purchase_id = id
        // this.rukuForm.tp = 1
       }
    },
    dataSearch(){
      this.getRuKuData()
    }
  },
  mounted() {
    this.getDataListFun()
    this.getPurchaseList()
    this.pulist()
    this.getid()
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.funcList {
  width: 100%;
  text-align: right
}
.boxFuncBtn2{
  float: right;
  display: flex;
  align-items: center;
  .el-button--text {
    color: #24303E;
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
.localval{
  display: flex;
  align-items: center;
  >span{
    min-width: 50px;
    margin-right: 5px;
  }
  >div{
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
.goods{
  .odd{
    border-top: 1px solid #ccc;
    &:first-child{
      border: 0 none;
    }
  }
}
.searchBox{
  display: flex;
  align-items: center;
  >div{
    margin-right: 5px;
  }
}
</style>
