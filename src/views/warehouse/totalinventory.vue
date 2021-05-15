<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <el-row>
        <el-col :span="4" class="funcTree" style="margin-left: 0">
          <el-row>
            <el-col :span="24" class="funcBoxTitle">
              <div class="small_title">{{$t('goods.type')}}</div>
            </el-col>
          </el-row>
          <div class="custom-tree-container">
            <div class="block">
              <el-tree style="height: calc(100vh - 185px); overflow-y: auto;"
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
                  <el-col :span="24" style="padding-left: 20px">
                    <el-form :inline="true" :model="totalgoodshForm">
                      <el-form-item>
                        <el-input v-model="totalgoodshForm.key" clearable></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-checkbox v-model="totalgoodshForm.zero_inventory" @change="Searchlist">{{$t('warehouse.onlyLookNoInv')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item class="searchBtn">
                        <el-button type="primary" @click="Searchlist" size="small" icon="el-icon-search"></el-button>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
                <el-table :data="Totaldata"
                          @selection-change="handleSelectionChange"
                          border stripe height="calc(100vh - 229px)" style="width: 100%">
                  <el-table-column type="selection" width="55" v-if="permissionCheck('opt', '8_3')"></el-table-column>
                  <el-table-column label="#" width="60px">
                    <template slot-scope="scope">
                      {{scope.$index + totalgoodshForm.skip + 1}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" :label="$t('warehouse.name2')"></el-table-column>
                  <el-table-column prop="date" :label="$t('warehouse.SpecificationsMsg')">
                    <template slot-scope="scope">{{textFilter(scope.row.specification)}}</template>
                  </el-table-column>
                  <el-table-column prop="barcode" :label="$t('warehouse.barCode')"></el-table-column>
                  <el-table-column prop="unit_price" :label="$t('warehouse.price')">
                    <template slot-scope="scope">
                      {{scope.row.unit_price | price}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="count">
                    <template slot="header" slot-scope="scope">
                      <div class="cellBoxTitle">
                        {{$t('warehouse.num')}}
                        <span class="sortBox">
                         <i class="el-icon-caret-top jiantouC" @click="sortFunc('count')" :class="{jiantouBlue: totalgoodshForm.sort === 'count'}"></i>
                         <i class="el-icon-caret-bottom jiantouC" @click="sortFunc('-count')"  :class="{jiantouBlue: totalgoodshForm.sort === '-count'}"></i>
                        </span>
                      </div>
                    </template>
                    <template slot-scope="scope">
                      <span class="numcss" @click="numinfo(scope.row)">{{scope.row.count}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="origin" :label="$t('warehouse.PlaceofOrigin')"></el-table-column>
                </el-table>
              </div>
            </div>
            <el-row>
              <el-col :span="12" style="display: flex;align-items: center">
                <span class="totlaInv">{{$t('warehouse.totalInv')}}：{{inventory}}</span>
                <el-button type="primary" v-if="permissionCheck('opt', '8_3')" size="small" @click="addData">{{$t('warehouse.purchase')}}</el-button>
              </el-col>
              <el-col :span="12">
                <div style="text-align: right;margin-top: 10px">
                  <el-pagination
                    :current-page.sync="currentPage_to"
                    :page-size="pageSize_to"
                    layout="total, prev, pager, next, jumper"
                    :total="itemCount_to"
                  ></el-pagination>
                </div>
              </el-col>
            </el-row>

            <total-data :restFrom="restFrom" :restFromid="restFromid" :istype="dialogVisible" @dalogtype="dalogtype"></total-data>
            <el-dialog :title="$t('warehouse.setUp')" width="80%" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
              <el-form label-width="100px" :model="form">
                <el-form-item :label="$t('warehouse.supplier')">
                  <el-select v-model="form.supplier_id" filterable clearable :placeholder="$t('warehouse.choice')">
                    <el-option
                      v-for="item in supplierList"
                      :key="item.id"
                      :label="item.company_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-model="form.currency" clearable :placeholder="$t('warehouse.Currency')">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="form.payment_term" clearable :placeholder="$t('warehouse.payment_term')">
                    <el-option
                      v-for="item in paymenttermdata"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="form.delivery_method" clearable :placeholder="$t('warehouse.delivery_method')">
                    <el-option
                      v-for="item in deliverymedata"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
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
                    <el-table-column prop="unit_price" :label="$t('warehouse.pricetype')" width="250">
                      <template slot-scope="scope">
                        <price-input v-model="scope.row.unit_price"><span slot="append">/ {{scope.row.shouJia | price}}</span></price-input>
                      </template>
                    </el-table-column>
                    <!--<el-table-column prop="count" label="库存">-->
                    <!--<template slot-scope="scope">-->
                    <!--{{scope.row.nowCount}}-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column prop="inventory" :label="$t('warehouse.currentInv')"></el-table-column>
                    <el-table-column prop="count" :label="$t('warehouse.Purchasenum')" width="150">
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.count"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="total_price" :label="$t('warehouse.allprice')" width="150">
                      <template slot-scope="scope">
                        <price-input v-model="scope.row.total_price"></price-input>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('tools.opt')" width="100">
                      <template slot-scope="scope">
                        <el-button type="text" @click="deleteRow(scope.$index)" size="small">{{$t('tools.delete')}}</el-button>
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
                <confirm-button @confirmButton="saveDataFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
              </div>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { warehousegroup, purchaseAdd, suppliersList } from "@/api/warehouse";
import { spuTypesList } from '@/api/goods'

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
        sort: 'count' // count 库存升序 -count库存降序
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
        children: 'items',
        label: 'name'
      },
      defaultExpanded: [],
      maxNumber: 0,
      funcTreeWidth: 0,
      funcBoxWidth: 0,
      formEditDialog: false,
      skusArray: [],
      currency: '',
      payment_term: '',
      delivery_method: '',
      options: [
        { value: 'US Dollar', label: 'US Dollar' },
        { value: 'Riel(Cambodia)', label: 'Riel(Cambodia)' },
        { value: 'RBM', label: 'RBM' }
      ],
      paymenttermdata: [
        { value: 'Net 30 days', label: 'Net 30 days' },
        { value: 'Net 60 days', label: 'Net 60 days' }
      ],
      deliverymedata: [
        { value: 'Self-pick up', label: 'Self-pick up' },
        { value: 'Express', label: 'Express' }
      ],
      submitDisabled: false,
      supplierList: [],
      form: {
        order_id: '',
        supplier_id: '',
        skus: '',
        currency: '',
        payment_term: '',
        delivery_method: ''
      },
      inventory: 0
    }
  },
  watch: {
    currentPage_to(val) {
      this.totalgoodshForm.skip = (val - 1) * this.pageSize_to;
      this.totalgoodshForm.limit = this.pageSize_to;
      this.gettotaldata()
    }
  },
  methods: {
    getSupplierList() {
      suppliersList().then(res => {
        if (res.meta === 0) {
          this.supplierList = res.items
        }
      })
    },
    addData() {
      this.form.order_id = ''
      this.form.supplier_id = ''
      this.form.skus = ''
      this.form.currency = ''
      this.form.payment_term = ''
      this.form.delivery_method = ''
      this.formEditDialog = true
    },
    saveDataFunc() {
      if (this.skusArray.length === 0) {
        this.$message.error(this.$t('warehouse.choosePurchaseGoods'))
        return
      }
      this.submitDisabled = true
      this.form.skus = JSON.stringify(this.skusArray)
      // console.log(this.form)
      purchaseAdd(this.form).then(res => {
        this.gettotaldata()
        this.formEditDialog = false
        this.submitDisabled = false
      }).catch(() => {
        this.submitDisabled = false
      })
    },
    deleteRow(index) {
      this.skusArray.splice(index, 1)
    },
    sortFunc(text) {
      this.totalgoodshForm.sort = text
      this.gettotaldata()
    },
    handleSelectionChange(val) {
      // console.log('sssl', val)
      this.skusArray = val
    },
    getTypeList() {
      spuTypesList({ type: 2 }).then(response => {
        if (response.meta === 0) {
          this.typeData = []
          this.goodsTypeData = []
          if (response.items !== null) {
            this.typeData = response.items
            this.goodsTypeData = [{ name: this.$t('tools.all'), code: '', id: '' }, ...response.items]
          }
        }
      })
    },
    typeChangeFunc(data) {
      this.totalgoodshForm.type_id = data.id
      this.currentPage_to = 1
      this.Searchlist()
    },
    nodeOpen(data, node, obj) {
      this.defaultExpanded.push(data.id)
      console.log('node', node)
      if (node.level > this.maxNumber) {
        this.maxNumber = node.level
        const addWidth = 18 * this.maxNumber
        const funcTreeWidth1 = this.funcTreeWidth
        const funcBoxWidth1 = this.funcBoxWidth
        const addClassWidth = funcTreeWidth1 + addWidth
        const reduceWidth = funcBoxWidth1 - addWidth
        $('.funcTree').width(addClassWidth)
        $('.funcBox').width(reduceWidth)
      }
    },
    nodeClose(data, node, obj) {
      this.defaultExpanded.splice(this.defaultExpanded.indexOf(data.id), 1)
    },
    renderContent(h, { node, data, store }) {
      if (this.permissionCheck('opt')) {
        return (
          <span class='custom-tree-node'>
            <span title={node.label}>{node.label}</span>
          </span>)
      } else {
        return (<span class='custom-tree-node'>
          <span title={node.label}>{node.label}</span></span>)
      }
    },
    textFilter(data) {
      if (data instanceof Object) {
        let str = ''
        Object.keys(data).forEach((v, i) => {
          if (i === 0) {
            str = v + ':' + data[v] + ';'
          } else {
            str = str + v + ':' + data[v] + ';'
          }
        })
        return str
      } else if (data instanceof String) {
        let index = data.indexOf('{')
        if (index !== -1) {
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
        } else {
          return data
        }
      }
    },
    gettotaldata() {
      warehousegroup(this.totalgoodshForm).then((res) => {
        this.Totaldata = res.items;
        this.itemCount_to = res.total;
        this.inventory = res.inventory
      });
    },
    Searchlist() {
      this.gettotaldata();
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
      this.totalgoodshForm.skip = 0
      this.currentPage_to = 1
      this.totalgoodshForm.zero_inventory = this.$route.params.zero_inventory
    }
    this.gettotaldata()
    this.getTypeList()
    this.getSupplierList()
    this.funcTreeWidth = $('.funcTree').width()
    this.funcBoxWidth = $('.funcBox').width()
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
      margin-bottom: 0!important;
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
      color: #C0C4CC;
      cursor: pointer;
    }
    .jiantouBlue {
      color: #409EFF;
    }
  }
  .totlaInv {
    height: 48px;
    display: flex;
    align-items: center;
    margin: 0 20px;
  }

</style>
