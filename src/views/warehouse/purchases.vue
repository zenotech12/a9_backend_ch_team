<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24" class="funcList">
            <div class="box">
               <div style="width:200px" class="searchbtn">
                 <el-input v-model="searchForm.no"></el-input>
                 <el-button type="primary" icon="el-icon-search" size="small" @click="Searchlist"></el-button>
               </div>
              <div class="boxFuncBtn" @click="addData"  v-if="permissionCheck('opt')">
                <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
                <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)">
                <el-table-column prop="no" :label="$t('warehouse.Singlenumber')" width="120"></el-table-column>
                <el-table-column prop="supplier_name" :label="$t('warehouse.supplier')" width="130"></el-table-column>
                <el-table-column>
                  <!--<template  slot-scope="scope">-->
                    <!--<div v-if="scope.row.skus.length < 0"></div>-->
                    <!--<table class="tabletitle" v-if="scope.row.skus.length > 0">-->
                      <!--<tr>-->
                        <!--<th v-for="(item,k) in tabletitle" :key="k">{{item}}</th>-->
                      <!--</tr>-->
                      <!--<tr v-for="(val,k) in scope.row.skus" :key="k">-->
                        <!--<td>{{val.name}}</td>-->
                        <!--<td>{{val.origin}}</td>-->
                        <!--<td>{{val.specification}}</td>-->
                        <!--<td>{{val.barcode}}</td>-->
                        <!--<td>{{val.unit_price | price}}</td>-->
                        <!--<td>{{val.count}}</td>-->
                        <!--<td>{{val.arrive_count}}</td>-->
                        <!--<td>{{val.total_price | price}}</td>-->
                      <!--</tr>-->
                    <!--</table>-->
                  <!--</template>-->

                  <template slot="header" slot-scope="scope">
                    <el-row style="width: 100%">
                      <el-col :span="8">{{$t('warehouse.name2')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.PlaceofOrigin')}}</el-col>
                      <el-col :span="3" style="text-align: center">{{$t('warehouse.pecifications')}}</el-col>
                      <el-col :span="3" style="text-align: center">{{$t('warehouse.barCode')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.price')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.num')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.arrive_count')}}</el-col>
                      <el-col :span="2" style="text-align: center">{{$t('warehouse.allprice')}}</el-col>
                    </el-row>
                  </template>
                  <template slot-scope="scope">
                    <div class="goods">
                      <el-row v-for="(item, k) in scope.row.skus" :key="k" class="odd" style="width: 100%">
                        <el-col :span="8">{{item.name}}</el-col>
                        <el-col :span="2" style="text-align: center;min-width: 20px">{{item.origin !== '' ? item.origin : 'No' }}</el-col>
                        <el-col :span="3" style="text-align: center">{{item.specification}}</el-col>
                        <el-col :span="3" style="text-align: center">{{item.barcode !== '' ? item.barcode : 'No'}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.unit_price | price}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.count}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.arrive_count}}</el-col>
                        <el-col :span="2" style="text-align: center">{{item.total_price | price}}</el-col>
                      </el-row>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.payment')" width="100">
                  <template  slot-scope="scope">
                    {{scope.row.paid_complete ? $t('warehouse.yes') : $t('warehouse.no')}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.PaymentAmount')" width="100">
                  <template  slot-scope="scope">
                    {{scope.row.paid_money | price}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.Pallprice')" width="100">
                  <template  slot-scope="scope">
                    {{scope.row.money | price}}
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" :label="$t('warehouse.OrderTime')" width="160"></el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "140"  v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showDataEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                    <span class="xiexian">/</span>
                    <el-button type="text" @click="paidListFunc(scope.row)" size="small">{{$t('warehouse.payment2')}}</el-button>
                    <span class="xiexian">/</span>
                    <el-button type="text" @click="warehousing(scope.row)" size="small">{{$t('warehouse.Warehousing')}}</el-button>
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
        <el-dialog :title="$t('warehouse.setUp')" width="70%" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form">
            <el-form-item :label="$t('warehouse.supplier')">
              <el-select v-model="form.supplier_id" clearable :placeholder="$t('warehouse.choice')">
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.company_name"
                  :value="item.id">
                </el-option>
              </el-select>
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
                    {{scope.row.specification}}
                  </template>
                </el-table-column>
                <el-table-column prop="barcode" :label="$t('warehouse.barCode')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.barcode"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="unit_price" :label="$t('warehouse.price')">
                  <template slot-scope="scope">
                    <price-input v-model="scope.row.unit_price"></price-input>
                  </template>
                </el-table-column>
                <el-table-column prop="count" :label="$t('warehouse.num')">
                  <template slot-scope="scope">
                    {{scope.row.nowCount}}
                  </template>
                </el-table-column>
                <el-table-column prop="count" :label="$t('warehouse.Purchasenum')">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.count"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="total_price" :label="$t('warehouse.allprice')">
                  <template slot-scope="scope">
                    <price-input v-model="scope.row.total_price"></price-input>
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
            <el-form-item :label="$t('warehouse.commodityspe')" v-if="source === 1">
              <el-table :data="goodsInventoryTable" row-key="id"  @selection-change="handleSelectionChange" style="width: 100%">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column prop="name" :label="$t('warehouse.commodity')"></el-table-column>
                <el-table-column :label="$t('goods.sp')">
                  <template  slot-scope="scope">
                    {{scope.row.title}}
                  </template>
                </el-table-column>
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
                <el-table-column :label="$t('warehouse.num')">
                  <template slot="header">
                    {{$t('warehouse.num')}}
                    <el-popover placement="bottom"
                                width="200"
                                trigger="click">
                      <el-input v-model.number="batchCount">
                      </el-input>
                      <i slot="reference" :title="$t('goods.batchSet')" class="el-icon-setting"></i>
                    </el-popover>
                  </template>
                  <template  slot-scope="scope">
                    <el-input v-model.number="scope.row.count"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.price')">
                  <template slot="header">
                    {{$t('goods.price')}}
                    <el-popover placement="bottom"
                                width="200"
                                trigger="click">
                      <price-input v-model="batchPrice"></price-input>
                      <i slot="reference" :title="$t('goods.batchSet')" class="el-icon-setting"></i>
                    </el-popover>
                  </template>
                  <template  slot-scope="scope">
                    <price-input v-model="scope.row.unit_price"></price-input>
                    <!--<el-input v-model.number="scope.row.price"></el-input>-->
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.allprice')">
                  <template slot="header">
                    {{$t('goods.originalPrice')}}
                    <el-popover placement="bottom"
                                width="200"
                                trigger="click">
                      <price-input v-model="batchTotalPrice"></price-input>
                      <i slot="reference" :title="$t('goods.batchSet')" class="el-icon-setting"></i>
                    </el-popover>
                  </template>
                  <template  slot-scope="scope">
                    <price-input v-model="scope.row.total_price"></price-input>
                    <!--<el-input v-model.number="scope.row.price"></el-input>-->
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFuncSkus()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
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
          <el-table stripe border :data="paidList" height="calc(100vh - 350px)">
                <!-- <el-table-column prop="purchase_id" label="id"></el-table-column> -->
                <el-table-column :label="$t('warehouse.money')">
                  <template  slot-scope="scope">
                    {{scope.row.paid | price}}
                  </template>
                </el-table-column>
                <el-table-column prop="pay_time" :label="$t('warehouse.OrderTime')" width="180"></el-table-column>
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
            <confirm-button @confirmButton="Paycomplete(1)" :disabled="submitDisabled" v-if="!this.paytype" :confirmButtonInfor="$t('warehouse.Cpayment')" ></confirm-button>
            <confirm-button @confirmButton="Paycomplete(2)" :disabled="submitDisabled" :confirmButtonInfor="$t('warehouse.close')"></confirm-button>
          </div>
        </el-dialog>
        <!-- 付款单设置 -->
        <el-dialog :title="$t('warehouse.payset')" width="700px" append-to-body @close="payaddDialog = false" :visible.sync="payaddDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="skus">
            <el-form-item :label="$t('warehouse.price')">
              <price-input v-model="paiForm.paid"></price-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.OrderTime')">
            <el-date-picker
              format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"
              v-model="paiForm.pay_time"
              type="datetime"
              :placeholder="$t('order.pleaseChooseTime')">
            </el-date-picker>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton=" toAdd()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
        <!-- 入库 -->
        <el-dialog :title="$t('warehouse.Warehousing')" width="70%" @close="inwarehouselog=false" :visible.sync="inwarehouselog" :close-on-click-modal="false" center >
         <el-table ref="singleTable" :data="inwarehouseData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
             <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column property="name" :label="$t('warehouse.name2')"></el-table-column>
            <el-table-column :label="$t('warehouse.PlaceofOrigin')">
              <template slot-scope="scope">
                  <el-input v-model="scope.row.origin"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="specification" :label="$t('warehouse.pecifications')"></el-table-column>
            <el-table-column :label="$t('warehouse.barCode')">
              <template  slot-scope="scope">
                  <el-input v-model="scope.row.barcode"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="unit_price" :label="$t('warehouse.price')"></el-table-column>
            <el-table-column :label="$t('warehouse.num')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.count"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="total_price" :label="$t('warehouse.allprice')"></el-table-column>
          </el-table>
           <div style="margin-top: 10px;">
           <el-input :placeholder="$t('warehouse.remarks')" type="textarea" :rows="2" v-model="inwarehouseFrom.comment"></el-input>
             <div style="margin-top: 10px;">
               <el-select v-model="wareId" @change="onchange" :placeholder="$t('warehouse.Pleaseselect')">
              <el-option
                v-for="item in warelist"
                :key="item.value"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled">
              </el-option>
            </el-select>
            -
             <el-select v-model="posttion" :placeholder="$t('warehouse.Pleaseselect')">
              <el-option
                v-for="item in locas"
                :key="item.value"
                :label="item.name"
                :value="item.name"
                :disabled="item.disabled">
              </el-option>
            </el-select>
             </div>
          </div>
          <div style="display:" slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="inwarehouseAdd" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>

        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { purchaseAdd, Locationlist, warehouseReceiptsAdd, purchaseModify, suppliersList, purchaseList, paysList, Paymentcomplete, AddpaysList, modifypaysList, warehousesList } from '@/api/warehouse'
  import { ordersInfo } from '@/api/order'
  import { spusSkusList, spusInfo } from '@/api/goods'
  export default {
    components: {
    },
    data() {
      const formData = this.setForm()
      const pz = 10
      return {
        triggersType: [{ code: 1, name: this.$t('operation.triggersA') }, { code: 2, name: this.$t('operation.triggersB') }, { code: 3, name: this.$t('operation.triggersC') }],
        timeValidSwitch: true,
        searchForm: {
          skip: '',
          limit: pz,
          no : ''
        },
        warelist: [],
        inwarehouseFrom:{
          tp: 1,
          purchase_id: '',
          warehouse_id: '',
          skus:[],
          comment: ''

        },
        posttion: '',
        searchForm: {
        skip: '',
        limit: pz,
        no : ''
        },
        locas:[],
        wareId: '',
        inwarehouseData:[],
        inwarehouselog :false,
        paytype: false,
        test: [],
        commentlog: false,
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        form: formData,
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
        paidList: [],
        currentPagePay: 1,
        pageSizePay: pz,
        itemCountPay: 0,
        paiForm: {
          id: '',
          purchase_id: '',
          paid: 0,
          pay_time: ''
        },
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
        tabletitle:[
          this.$t('warehouse.name2'),
          this.$t('warehouse.PlaceofOrigin'),
          this.$t('warehouse.pecifications'),
          this.$t('warehouse.barCode'),
          this.$t('warehouse.price'),
          this.$t('warehouse.num'),
          this.$t('warehouse.arrive_count'),
          this.$t('warehouse.allprice')
        ]
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
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
        this.goodsInventoryTable.forEach(item => {
          this.$set(item, 'unit_price', val)
          this.$set(item, 'total_price', item.count * item.unit_price)
        })
      },
      batchTotalPrice(val) {
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
            const tableItem = { id: '', name: val[0].goodsName, origin: '', sku_uid: '', specification: this.textFilter(item), unit_price: 0, total_price: 0, count: 0, barcode: '', no: 0 }
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
                tableItem.count = this.goodsInventoryData[i].inventory
                tableItem.unit_price = this.goodsInventoryData[i].price
                tableItem.barcode = this.goodsInventoryData[i].barcode
                tableItem.total_price = this.goodsInventoryData[i].inventory * this.goodsInventoryData[i].price
              }
            }
            this.goodsInventoryTable.push(tableItem)
          })
        },
        deep: true
      },
      goodsInventoryTable: {
        handler(val) {
          if (val.length > 0) {
            val.forEach(item => {
              this.$set(item, 'total_price', item.count * item.unit_price)
            })
          }
        },
        deep: true
      },
      skusArray: {
        handler(val) {
          if (val.length > 0) {
            val.forEach(item => {
              this.$set(item, 'total_price', item.count * item.unit_price)
            })
          }
        },
        deep: true
      },
      goodsId(val) {
        if (val !== '') {
          this.getGoodsSkus(val)
        }
      }
    },
    methods: {
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
      handleSelectionChange(val) {
        // console.log('er', val)
        this.multipleSelection = []
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
      textFilter(data) {
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
            const array = res.item.merchant_item.goods_items
            array && array.forEach(value => {
              const goodsinfo = value.goods_info
              const obj = {
                id: (goodsinfo.sku_url !== '' ? goodsinfo.sku_url : goodsinfo.sku_id) + this.textFilter(goodsinfo.specifications),
                name: goodsinfo.spu_name,
                origin: '',
                specification: this.textFilter(goodsinfo.specifications),
                sku_uid: goodsinfo.sku_url !== '' ? goodsinfo.sku_url : goodsinfo.sku_id,
                barcode: goodsinfo.barcode,
                unit_price: goodsinfo.unit_pay_price,
                count: goodsinfo.count,
                nowCount: goodsinfo.count,
                total_price: goodsinfo.pay_price
              }
              const index = this.skusArray.findIndex(z => {
                if (z.id === obj.id) {
                  return z
                }
              })
              if (index === -1) {
                this.skusArray.push(obj)
              }
            })
          }
        })
      },
      paidListFunc(data) {
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
        // console.log('data', this.paiForm)
        if (this.paiForm.id !== '') {
          modifypaysList(this.paiForm.id, this.paiForm).then(res => {
            this.getPayListFunc()
          })
        } else {
          AddpaysList(this.paiForm).then(res => {
            this.getPayListFunc()
          })
        }
        this.payaddDialog = false
      },
      PaymentEit(data) {
        // console.log(this.paiForm);
        this.paiForm.paid = data.paid
        this.paiForm.id = data.id
        this.paiForm.pay_time = data.pay_time
        this.payaddDialog = true
      },
      Paycomplete(val) {
        if (val === 2) {
          this.paidListDialog = false
        } else if (val === 1) {
          Paymentcomplete(this.paiForm.purchase_id).then(res => {
            this.getDataListFun()
            this.paidListDialog = false
          })
        }
      },
      addSkus() {
        this.skusDialog = true
        this.source = 1
        this.orderId = ''
        this.goodsId = ''
        this.goodsInventoryTable = []
      },
      setForm(data) {
        if (data) {
          return data
        } else {
          return {
            id: '',
            order_id: '',
            supplier_id: '',
            skus: ''
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
        this.form = this.setForm()
        this.skusArray = []
        this.formEditDialog = true
      },
      payaddData() {
        this.paiForm.id = ''
        this.paiForm.paid = 0
        this.paiForm.pay_time = ''
        this.payaddDialog = true
      },
      showDataEditor(data) {
        console.log(data)
        this.form = this.setForm(data)
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
        if (this.form.id !== '') {
          purchaseModify(this.form.id, this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else {
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
        warehousesList(this.searchForm).then(res=>{
          this.warelist = res.items
          console.log(this.warelist);
        })
        this.inwarehouselog = true
        console.log(data);
        this.inwarehouseData = data.skus
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
        this.inwarehouseFrom.skus.push(val)
        this.inwarehouseFrom.skus = this.inwarehouseFrom.skus[0]
        console.log(this.inwarehouseFrom);
      },
      // 确定入库
      inwarehouseAdd(){
        this.inwarehouseFrom.warehouse_id = this.wareId
        this.inwarehouseFrom.skus.forEach(item => {
          item.position = this.posttion
         console.log(item);
        });
        this.inwarehouseFrom.skus = JSON.stringify(this.inwarehouseFrom.skus)
        warehouseReceiptsAdd(this.inwarehouseFrom).then(res=>{
          console.log(res);
        })
        this.commentlog = false
        this.inwarehouselog = false
        this.$message(this.$t('tools.addSuccess'));
      },
      Searchlist(){
        this.getDataListFun()
      }
    },
    mounted() {
      this.getDataListFun()
      this.getSupplierList()
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
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
</style>
