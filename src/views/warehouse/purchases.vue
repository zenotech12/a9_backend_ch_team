<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24" class="funcList">
            <div class="boxFuncBtn" @click="addData"  v-if="permissionCheck('opt')">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)">
                <el-table-column prop="supplier_name" :label="$t('warehouse.supplier')" width="240"></el-table-column>
                <el-table-column :label="$t('warehouse.Purchasing')">
                  <template  slot-scope="scope">
                    <div v-for="(item, k) in scope.row.skus" :key="k" class="goodSkusBox">
                      {{$t('warehouse.name2')}}:<span>{{item.name}}</span>
                      {{$t('warehouse.PlaceofOrigin')}}:<span>{{item.origin}}</span>
                      {{$t('warehouse.pecifications')}}:<span>{{item.specification}}</span>
                      {{$t('warehouse.barCode')}}:<span>{{item.barcode}}</span> {{$t('warehouse.price')}}: <span>{{item.unit_price | price}}</span>
                      {{$t('warehouse.num')}}: <span>{{item.count}}</span>
                      {{$t('warehouse.allprice')}}: <span>{{item.total_price | price}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.payment')" width="120">
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
                <el-table-column prop="gen_time" :label="$t('warehouse.OrderTime')" width="180"></el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "140"  v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showDataEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                    <span class="xiexian">/</span>
                    <el-button type="text" @click="paidListFunc(scope.row)" size="small">{{$t('warehouse.payment2')}}</el-button>
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
                    <el-input v-model.number="scope.row.barcode"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.PlaceofOrigin')">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.origin"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="no"  :label="$t('goods.skuNo')"></el-table-column>
                <el-table-column :label="$t('warehouse.num')">
                  <template slot="header" slot-scope="scope">
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
                  <template slot="header" slot-scope="scope">
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
                  <template slot="header" slot-scope="scope">
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
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { purchaseAdd, purchaseModify, suppliersList, purchaseList, paysList, Paymentcomplete, AddpaysList, modifypaysList } from '@/api/warehouse'
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
          limit: pz
        },
        paytype: false,
        test: [],
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
        multipleSelection: []
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
</style>
