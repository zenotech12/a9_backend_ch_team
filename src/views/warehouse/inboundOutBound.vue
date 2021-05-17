<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <el-row class="rightbox">
        <el-col :span="24">
          <el-tabs v-model="activeChuRuKu">
            <el-tab-pane :label="$t('warehouse.enterlist')" name="1"></el-tab-pane>
            <el-tab-pane :label="$t('warehouse.outlist')" name="2"></el-tab-pane>
          </el-tabs>
          <div v-if="activeChuRuKu === '1'">
            <el-row>
              <el-col :span="24">
                <el-form :inline="true" :model="rukuSearchForm">
                  <el-form-item>
                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm" clearable
                                    v-model="rukuTimes"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    :range-separator="$t('tools.to')"
                                    :start-placeholder="$t('tools.startDate')"
                                    :end-placeholder="$t('tools.endDate')">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="rukuSearchForm.tp" clearable>
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="rukuSearchForm.key" clearable></el-input>
                  </el-form-item>
                  <el-form-item class="searchBtn">
                    <el-button type="primary" @click="dataSearch" size="small" icon="el-icon-search"></el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table stripe border :data="rukuData" height="calc(100vh - 270px)">
              <el-table-column label="#" width="60px">
                <template slot-scope="scope">
                  {{scope.$index + rukuSearchForm.skip + 1}}
                </template>
              </el-table-column>
              <el-table-column prop="no" :label="$t('warehouse.number')" width="120px"></el-table-column>
              <el-table-column prop="pu_no" :label="$t('warehouse.pu_no')" width="120px"></el-table-column>
              <el-table-column prop="comment" :label="$t('warehouse.remarks')" width="150px"></el-table-column>
              <el-table-column prop="warehouse_name" :label="$t('warehouse.name')" width="200px"></el-table-column>
              <el-table-column prop="supplier_name" :label="$t('warehouse.SupplierNmae')" width="150px"></el-table-column>
              <el-table-column >
                <template slot="header" slot-scope="scope">
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
                      <el-col :span="10" class="overOmitted"><span :title="item.name">{{item.name}}</span></el-col>
                      <el-col :span="2" style="text-align: center;min-width: 20px">{{item.position !== '' ? item.position : 'No' }}</el-col>
                      <el-col :span="3" class="overOmitted" style="text-align: center"><span :title="textFilter(item.specification)">{{textFilter(item.specification) !== '' ? textFilter(item.specification) : 'No'}}</span></el-col>
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
          <div v-show="activeChuRuKu === '2'">
            <el-row>
              <el-col :span="24">
                <el-form :inline="true" :model="chuKuSearchForm">
                  <el-form-item>
                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable
                      v-model="orderTimes"
                      type="daterange"
                      align="right"
                      unlink-panels
                      :range-separator="$t('tools.to')"
                      :start-placeholder="$t('tools.startDate')"
                      :end-placeholder="$t('tools.endDate')">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item :label="$t('warehouse.type')">
                    <el-select v-model="chuKuSearchForm.tp" clearable>
                      <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('order.status')">
                    <el-select v-model="chuKuSearchForm.status" clearable>
                      <el-option
                        v-for="item in optionStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="chuKuSearchForm.key" clearable></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table stripe border :data="chukuData" height="calc(100vh - 270px)">
              <el-table-column label="#" width="60px">
                <template slot-scope="scope">
                  {{scope.$index + chuKuSearchForm.skip + 1}}
                </template>
              </el-table-column>
              <el-table-column prop="no" :label="$t('warehouse.number')" width="120px"></el-table-column>
              <el-table-column prop="warehouse_name" :label="$t('warehouse.name')" width="100px"></el-table-column>
              <el-table-column :label="$t('warehouse.type')" width="100px">
                <template slot-scope="scope">
                  <span v-if="scope.row.tp === 1">{{$t('warehouse.order')}}</span>
                  <span v-if="scope.row.tp === 2">{{$t('warehouse.Scrap')}}</span>
                  <span v-if="scope.row.tp === 3">{{$t('warehouse.return')}}</span>
                </template>
              </el-table-column>
              <el-table-column width="800">
                <template slot="header" slot-scope="scope">
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
                      <el-col :span="10" class="overOmitted"><span :title="item.name">{{item.name}}</span></el-col>
                      <el-col :span="2" style="text-align: center;min-width: 20px">{{item.position !== '' ? item.position : 'No' }}</el-col>
                      <el-col :span="3" class="overOmitted" style="text-align: center"><span :title="textFilter(item.specification)">{{textFilter(item.specification)}}</span></el-col>
                      <el-col :span="3" style="text-align: center">{{item.barcode !== '' ? item.barcode : 'No'}}</el-col>
                      <el-col :span="2" style="text-align: center">{{item.unit_price | price}}</el-col>
                      <el-col :span="2" style="text-align: center">{{item.count}}</el-col>
                      <el-col :span="2" style="text-align: center">{{item.total_price | price}}</el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="shipping_address" :label="$t('warehouse.Address')" width="200px">
                <template slot-scope="scope">
                    <span v-if="scope.row.shipping_address != null">
                      {{scope.row.shipping_address.address.province}}-
                      {{scope.row.shipping_address.address.city}}-
                      {{scope.row.shipping_address.address.district}}-
                      {{scope.row.shipping_address.address.addr}}
                      </span>
                  <span v-if="scope.row.shipping_address == null">{{$t('warehouse.noinformation')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="shipping_address" :label="$t('warehouse.Courierinformation')" width="200px">
                <template slot-scope="scope">
                  <span v-if="scope.row.express == null">{{$t('warehouse.noinformation')}}</span>
                  <span v-if="scope.row.express != null">
                      <div>{{$t('warehouse.corporateName')}}: {{scope.row.express.company}}</div>
                      <div>{{$t('warehouse.Singlenumber')}}: {{scope.row.express.novar}}</div>
                    </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('order.status')" width="180px">
                <template slot-scope="scope">
                  <el-tag type="warning" v-if="scope.row.status === 1 || scope.row.status === 0">{{$t('warehouse.pendingProcurementReview')}}</el-tag>
                  <el-tag type="info" v-if="scope.row.status === 2">{{$t('warehouse.daiInvConfirm')}}</el-tag>
                  <el-tag type="success" v-if="scope.row.status === 3">{{$t('warehouse.invConfirmComplete')}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="gen_time" :label="$t('warehouse.time')" width="150px"></el-table-column>
              <el-table-column :label="$t('tools.opt')" width="150px" fixed = "right" v-show="permissionCheck('opt', '8_1') || permissionCheck('opt', '8_3') || permissionCheck('opt', '8_5')">
                <template slot-scope="scope">
                  <el-button type="text" @click="shengheFuncChuku(scope.row.id, 2)" v-if="(scope.row.status === 1 || scope.row.status === 0) && permissionCheck('opt', '8_3')" size="small">{{$t('warehouse.caigoushenghe')}}</el-button>
                  <el-button type="text" @click="shengheFuncChuku(scope.row.id, 3)" v-if="scope.row.status === 2  && permissionCheck('opt', '8_1')" size="small">{{$t('warehouse.invConfirm')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="12" style="display: flex;align-items: center">
                <span class="totlaInv">{{$t('warehouse.goodsChuKuCount')}}：{{chukuGoodsNumber}}</span>
              </el-col>
              <el-col :span="12">
                <div style="text-align: right;margin-top: 10px">
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
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  warehouseReceipts,
  warehouseOutboundReview,
  warehouseOutbounds
} from '@/api/warehouse'
export default {
  data() {
    const pz = 10
    return {
      rukuData: [],
      currentPageruku: 1,
      pageSizeruku: pz,
      itemCountruku: 0,
      activeChuRuKu: '1',
      chuKuSearchForm: {
        key: '',
        tp: '',
        warehouse_id: '',
        status: '', // 1待采购审核 2待仓库确认 3仓库确认完成
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
        tp: '',
        key: '',
        bt: '',
        et: '',
        purchase_id: '',
        warehouse_id: '',
        supplier_id: '',
        skip: 0,
        limit: 10
      },
      options: [
        { value: '1', label: this.$t('warehouse.inpuWarehouse2') },
        { value: '2', label: this.$t('warehouse.Returnexchange') }
      ],
      options2: [
        { value: '1', label: this.$t('warehouse.Orderdelivery2') },
        { value: '2', label: this.$t('warehouse.Scrap') },
        { value: '3', label: this.$t('warehouse.return') }
      ],
      rukuTimes: [],
      optionStatus: [
        {
          label: this.$t('warehouse.all'),
          value: 0
        },
        {
          label: this.$t('warehouse.pendingProcurementReview'),
          value: 1
        },
        {
          label: this.$t('warehouse.daiInvConfirm'),
          value: 2
        },
        {
          label: this.$t('warehouse.invConfirmComplete'),
          value: 3
        }
      ],
      chukuGoodsNumber: 0
    }
  },
  watch: {
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
    rukuTimes(val) {
      if (val && val.length === 2) {
        this.rukuSearchForm.bt = val[0]
        this.rukuSearchForm.et = val[1]
      } else {
        this.rukuSearchForm.bt = ''
        this.rukuSearchForm.et = ''
      }
    }
  },
  methods: {
    shengheFuncChuku(id, number) {
      warehouseOutboundReview(id, { status: number }).then(res => {
        this.getChuKuData()
      })
    },
    textFilter(data) {
      const index = data.indexOf('{')
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
    },
    getRuKuData() {
      warehouseReceipts(this.rukuSearchForm).then(res => {
        if (res.meta === 0) {
          this.rukuData = res.items
          this.itemCountruku = res.total
        }
      })
    },
    getChuKuData() {
      warehouseOutbounds(this.chuKuSearchForm).then(res => {
        if (res.meta === 0) {
          this.chukuData = res.items
          this.itemCountchuku = res.total
          this.chukuGoodsNumber = res.count
        }
      })
    },
    dataSearch(){
      this.getRuKuData()
    },
    search() {
      this.chuKuSearchForm.skip = 0
      this.currentPagechuku = 1
      this.getChuKuData()
    }
  },
  mounted() {
    this.getChuKuData()
    this.getRuKuData()
  },
  created() {}
}
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
.totlaInv {
  height: 48px;
  font-size: 20px;
  display: flex;
  align-items: center;
  margin: 0 20px;
}
</style>
