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
                    <el-button type="text" @click="showInventories(scope.row)" size="small">库存信息</el-button>
                    <span class="xiexian">/</span>
                    <el-button type="text" @click="showOutbounds(scope.row)" size="small">出入库日志</el-button>
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
              @confirmButton="saveDataFunc(row)"
              :disabled="submitDisabled"
              :confirmButtonInfor="$t('tools.confirm')"
            ></confirm-button>
          </div>
        </el-dialog>
        <!--库存信息列表-->
        <el-dialog class="dialog" title="库存信息" width="70%"
          @close="inventoriesDialog=false"
          :visible.sync="inventoriesDialog"
          :close-on-click-modal="false"
          center
        >
          <el-table stripe border :data="inventoriesList" height="calc(100% - 40px)">
            <!-- 仓库名称 -->
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="origin" label="产地"></el-table-column>
            <el-table-column prop="specification" label="规格"></el-table-column>
            <el-table-column prop="barcode" label="条形码"></el-table-column>
            <el-table-column prop="unit_price" label="单价">
              <template slot-scope="scope">{{scope.row.unit_price | price}}</template>
            </el-table-column>
            <el-table-column prop="count" label="数量"></el-table-column>
            <el-table-column prop="total_price" label="总价">
              <template slot-scope="scope">{{scope.row.total_price | price}}</template>
            </el-table-column>
            <el-table-column prop="position" label="位置"></el-table-column>
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
        <el-dialog class="dialog" title="出入库信息" width="70%"
                   @close="chuRuKuDialog=false"
                   :visible.sync="chuRuKuDialog"
                   :close-on-click-modal="false"
                   center
        >
          <el-tabs v-model="activeChuRuKu">
            <el-tab-pane label="入库列表" name="1"></el-tab-pane>
            <el-tab-pane label="出库列表" name="2"></el-tab-pane>
            <div v-if="activeChuRuKu === '1'">
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
              <el-table stripe border :data="rukuData" height="calc(100% - 40px)">
                <el-table-column prop="unit_price" label="商品信息">
                  <template slot-scope="scope">
                    <div v-for="(item, k) in scope.row.skus" :key="k">
                      商品名：<span>{{item.spu_name}}</span>
                      规格信息：<span>
                              <span v-for="(sk, i) in Object.keys(item.specification)">
                               {{sk}}:{{i}}
                              </span>
                        </span>
                      数量： {{item.count}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" label="时间"></el-table-column>
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
              <el-row>
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
                      <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="4" align="right">
                  <!--<div class="boxFuncBtn2" @click="rukuFunc" v-if="permissionCheck('opt')">-->
                    <!--<img src="../../assets/images/icon/icon_add.png" alt class="icon_add" />-->
                    <!--<el-button type="text" size="small">{{$t('tools.add')}}</el-button>-->
                  <!--</div>-->
                </el-col>
              </el-row>
              <el-table stripe border :data="chukuData" height="calc(100% - 40px)">
                <el-table-column prop="unit_price" label="商品信息">
                  <template slot-scope="scope">
                    <div v-for="(item, k) in scope.row.skus" :key="k">
                      商品名：<span>{{item.spu_name}}</span>
                      规格信息：<span>
                              <span v-for="(sk, i) in Object.keys(item.specification)">
                               {{sk}}:{{i}}
                              </span>
                        </span>
                      数量： {{item.count}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" label="时间"></el-table-column>
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
            <el-button type="primary" @click="inventoriesDialog=false" size="small">{{$t('tools.close')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog title="入库单设置" width="60%" @close="rukuDialog=false" append-to-body :visible.sync="rukuDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="rukuForm">
            <el-form-item label="类型">
              <el-radio-group v-model="rukuForm.tp" @change="tpChange">
                <!--<el-radio :label="1">采购单入库</el-radio>-->
                <el-radio :label="2">退换货</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="订单">
              <order-selector style="width: 400px;"></order-selector>
            </el-form-item>
            <el-form-item :label="$t('warehouse.pecifications')">
              <el-table :data="skusArray" style="width: 100%">
                <el-table-column prop="name" :label="$t('warehouse.name2')"></el-table-column>
                <el-table-column prop="origin" :label="$t('warehouse.PlaceofOrigin')"></el-table-column>
                <el-table-column prop="specification" :label="$t('warehouse.pecifications')"></el-table-column>
                <el-table-column prop="barcode" :label="$t('warehouse.barCode')"></el-table-column>
                <el-table-column prop="unit_price" :label="$t('warehouse.price')">
                  <template slot-scope="scope">
                    {{scope.row.unit_price | price}}
                  </template>
                </el-table-column>
                <el-table-column prop="count" :label="$t('warehouse.num')"></el-table-column>
                <el-table-column prop="total_price" :label="$t('warehouse.allprice')">
                  <template slot-scope="scope">
                    {{scope.row.total_price | price}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.operation')">
                  <template slot-scope="scope">
                    <el-button type="text" @click="eidtSkus(scope.row, scope.$index)" size="small">{{$t('tools.edit')}}</el-button>
                    <span class="xiexian">/</span>
                    <el-button type="text" @click="delSkus(scope.$index)" size="small">{{$t('tools.delete')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
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
  warehouseOutbounds
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
      placeShow: false,
      placeChecked: false,
      tableData: [],
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
        warehouse_id: '',
        skip: 0,
        limit: pz
      },
      inventoriesList: [],
      currentPageKuCun: 1,
      pageSizeKuCun: pz,
      itemCountKuCun: 0,
      inventoriesDialog: false,
      rukuDialog: false,
      rukuForm: {
        tp: 2, // 1采购单入库 2退换货
        purchase_id: '',
        warehouse_id: '',
        skus: '',
        comment: ''
      },
      purchaseListData: [],
      chuRuKuDialog: false,
      activeChuRuKu: '1',
      // 出库信息
      chuKuSearchForm: {
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
        purchase_id: '',
        warehouse_id: '',
        supplier_id: '',
        skip: '',
        limit: ''
      },
      rukuData: [],
      currentPageruku: 1,
      pageSizeruku: pz,
      itemCountruku: 0,
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
    }
  },
  methods: {
    rukuFunc() {
      this.rukuDialog = true
    },
    showInventories(data) {
      this.inventoriesSearchForm.warehouse_id = data.id
      this.getInventoriesList()
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
      console.log(e)
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
    showDataEditor(data) {
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
      this.rukuForm.warehouse_id = data.id
      this.chuKuSearchForm.warehouse_id = data.id
      this.rukuSearchForm.warehouse_id = data.id
      this.getRuKuData()
      this.getChuKuData()
      this.chuRuKuDialog = true
    },
    getRuKuData() {
      warehouseReceipts(this.rukuSearchForm).then(res => {
        if (res.meta === 0) {
          this.rukuData = res.items
          this.itemCountruku = res.total
        }
      })
    },
  },
  mounted() {
    this.getDataListFun()
    this.getPurchaseList()
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
// .address {
//   display: flex
//   flex-wrap: wrap
//   > div {
//     width: 300px
//   }
// }
</style>
