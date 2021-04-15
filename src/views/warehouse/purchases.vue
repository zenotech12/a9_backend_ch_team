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
                      {{$t('warehouse.barCode')}}:<span>{{item.barcode}}</span>
                      {{$t('warehouse.price')}}: <span>{{item.unit_price | price}}</span>
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
        <el-dialog :title="$t('warehouse.setUp')" width="1000px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
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
            <el-form-item :label="$t('warehouse.pecifications')">
              <el-button type="primary" @click="addSkus" size="mini">{{$t('warehouse.add2')}}</el-button>
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
        <el-dialog :title="$t('warehouse.SpecificationsSetup')" width="700px" append-to-body @close="skusDialog = false" :visible.sync="skusDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="skus">
            <el-form-item :label="$t('warehouse.name2')">
              <el-input v-model="skus.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.PlaceofOrigin')">
              <el-input v-model="skus.origin"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.pecifications')">
              <el-input v-model="skus.specification"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.barCode')">
              <el-input v-model="skus.barcode"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.price')">
              <price-input v-model="skus.unit_price"></price-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.num')">
              <el-input v-model.number="skus.count"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.allprice')">
              <price-input v-model="skus.total_price"></price-input>
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
  import { purchaseAdd, purchaseModify, suppliersList, purchaseList, paysList, Paymentcomplete ,AddpaysList, modifypaysList} from '@/api/warehouse'
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
        }
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
      'skus.unit_price': function(val) {
        this.skus.total_price = val * this.skus.count
      },
      'skus.count': function(val) {
        this.skus.total_price = val * this.skus.unit_price
      }
    },
    methods: {
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
        if (this.skus.name === '' || this.skus.origin === '') {
          this.$message.error($t('warehoues.Msg'))
          return false
        }
        if (this.skuType === 'add') {
          this.skusArray.push(JSON.parse(JSON.stringify(this.skus)))
        } else if (this.skuType === 'edit') {
          this.$set(this.skusArray, this.skusEidtIndex, JSON.parse(JSON.stringify(this.skus)))
        }
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
      eidtSkus(data, index) {
        this.skusEidtIndex = index
        this.skuType = 'edit'
        this.skusDialog = true
        this.skus.name = data.name
        this.skus.origin = data.origin
        this.skus.specification = data.specification
        this.skus.sku_uid = data.sku_uid
        this.skus.barcode = data.barcode
        this.skus.unit_price = data.unit_price
        this.skus.count = data.count
        this.skus.total_price = data.total_price
      },
      delSkus(index) {
        this.skusArray.splice(index, 1)
      },
      addSkus() {
        this.skusDialog = true
        this.skuType = 'add'
        this.skus.name = ''
        this.skus.origin = ''
        this.skus.specification = ''
        this.skus.sku_uid = ''
        this.skus.barcode = ''
        this.skus.unit_price = 0
        this.skus.count = 0
        this.skus.total_price = 0
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
</style>
