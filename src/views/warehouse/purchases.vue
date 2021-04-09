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
                <el-table-column prop="supplier_name" label="供应商" width="240"></el-table-column>
                <el-table-column label="采购商品">
                  <template  slot-scope="scope">
                    <div v-for="(item, k) in scope.row.skus" :key="k" class="goodSkusBox">
                      名称: <span>{{item.name}}</span>
                      产地: <span>{{item.origin}}</span>
                      规格: <span>{{item.specification}}</span>
                      条形码:<span>{{item.barcode}}</span>
                      单价: <span>{{item.unit_price | price}}</span>
                      数量: <span>{{item.count}}</span>
                      总价: <span>{{item.total_price | price}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="是否完成支付" width="120">
                  <template  slot-scope="scope">
                    {{scope.row.paid_complete ? '是' : '否'}}
                  </template>
                </el-table-column>
                <el-table-column label="支付金额" width="100">
                  <template  slot-scope="scope">
                    {{scope.row.paid_money | price}}
                  </template>
                </el-table-column>
                <el-table-column label="采购总金额" width="100">
                  <template  slot-scope="scope">
                    {{scope.row.money | price}}
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" label="下单时间" width="180"></el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "140"  v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showDataEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                    <!--<span class="xiexian">/</span>-->
                    <!--<delete-button  @delData="deleteDataFunc(scope.row)"></delete-button>-->
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
        <el-dialog title="采购单设置" width="1000px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form">
            <el-form-item label="供应商">
              <el-select v-model="form.supplier_id" clearable placeholder="请选择供应商">
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.company_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规格">
              <el-button type="primary" @click="addSkus" size="mini">添加</el-button>
              <el-table :data="skusArray" style="width: 100%">
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="origin" label="产地"></el-table-column>
                <el-table-column prop="specification" label="规格"></el-table-column>
                <el-table-column prop="barcode" label="条形码"></el-table-column>
                <el-table-column prop="unit_price" label="单价">
                  <template slot-scope="scope">
                    {{scope.row.unit_price | price}}
                  </template>
                </el-table-column>
                <el-table-column prop="count" label="数量"></el-table-column>
                <el-table-column prop="total_price" label="总价">
                  <template slot-scope="scope">
                    {{scope.row.total_price | price}}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
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
        <el-dialog title="规格设置" width="700px" append-to-body @close="skusDialog = false" :visible.sync="skusDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="skus">
            <el-form-item label="名称">
              <el-input v-model="skus.name"></el-input>
            </el-form-item>
            <el-form-item label="产地">
              <el-input v-model="skus.origin"></el-input>
            </el-form-item>
            <el-form-item label="规格">
              <el-input v-model="skus.specification"></el-input>
            </el-form-item>
            <el-form-item label="条形码">
              <el-input v-model="skus.barcode"></el-input>
            </el-form-item>
            <el-form-item label="单价">
              <price-input v-model="skus.unit_price"></price-input>
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model.number="skus.count"></el-input>
            </el-form-item>
            <el-form-item label="总价">
              <price-input v-model="skus.total_price"></price-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFuncSkus()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { purchaseAdd, purchaseModify, suppliersList, purchaseList } from '@/api/warehouse'
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
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        form: formData,
        formEditDialog: false,
        submitDisabled: false,
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
        skuType: 'add'
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
      'skus.unit_price': function(val) {
        this.skus.total_price = val * this.skus.count
      },
      'skus.count': function(val) {
        this.skus.total_price = val * this.skus.unit_price
      }
    },
    methods: {
      saveDataFuncSkus() {
        if (this.skus.name === '' || this.skus.origin === '') {
          this.$message.error('请输入完整!')
          return false
        }
        if (this.skuType === 'add') {
          this.skusArray.push(JSON.parse(JSON.stringify(this.skus)))
        } else if (this.skuType === 'edit') {
          this.$set(this.skusArray, this.skusEidtIndex, JSON.parse(JSON.stringify(this.skus)))
        }
        this.skusDialog = false
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
