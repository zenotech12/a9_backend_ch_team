<template>
    <div>
        <el-input readonly placeholder="请选择库存商品" clearable v-model="orderInfo.name" @clear="clearInput">
            <el-button slot="append" icon="el-icon-edit-outline" @click="showGoodsTable"></el-button>
        </el-input>
        <el-dialog title="库存信息列表" width="80%" :visible.sync="dialogFormVisible" center append-to-body>
          <el-row>
            <el-col :span="24">
              <el-table stripe border v-loading="tableData.loading" :data="tableData.body" :row-key="productRowKey" highlight-current-row height="calc(100vh - 390px)" @current-change="selectionChange">
                <el-table-column prop="name" :label="$t('warehouse.name2')"></el-table-column>
                <!--<el-table-column prop="origin" label="产地"></el-table-column>-->
                <el-table-column prop="specification" :label="$t('warehouse.pecifications')">
                  <template slot-scope="scope">
                    {{textFilter(scope.row.specification)}}
                  </template>
                </el-table-column>
                <el-table-column prop="barcode" :label="$t('warehouse.barCode')"></el-table-column>
                <el-table-column prop="unit_price" :label="$t('warehouse.price')">
                  <template slot-scope="scope">{{scope.row.unit_price | price}}</template>
                </el-table-column>
                <el-table-column prop="count" :label="$t('warehouse.num')"></el-table-column>
                <el-table-column prop="total_price" :label="$t('warehouse.allprice')">
                  <template slot-scope="scope">{{scope.row.total_price | price}}</template>
                </el-table-column>
                <el-table-column prop="position" :label="$t('warehouse.position')"></el-table-column>
              </el-table>
              <el-row style="margin-top: 10px">
                <el-col :span="24" style="text-align: right;">
                  <el-pagination v-if="itemCount > 0"
                                 :current-page.sync="currentPage"
                                 :page-size.sync="pageSize"
                                 :page-sizes="[10, 30, 50, 100, 500]"
                                 layout="total, prev, pager, next, jumper,sizes"
                                 :total="itemCount">
                  </el-pagination>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false" size="mini">{{$t('tools.cancel')}}</el-button>
                <el-button type="primary" size="mini" @click="submitSelect">{{$t('tools.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import { warehouseInventories } from '@/api/warehouse'
  export default {
    name: 'stockSelect',
    data() {
      return {
        orderInfo: { name: '' },
        dialogFormVisible: false,
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        selectedProduct: {},
        searchForm: {
          warehouse_id: '',
          position: '',
          sku_uid: '',
          skip: 0,
          limit: 10
        },
        tableData: {
          loading: true,
          body: []
        },
        cesiId: ''
      }
    },
    model: {
      prop: 'goodId',
      event: 'goodSelectedChange'
    },
    props: {
      goodId: {
        type: String,
        default: function() {
          return ''
        }
      },
      warehouseId: {
        type: String,
        default: function() {
          return ''
        }
      }
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      },
      pageSize(val) {
        if (this.currentPage !== 1) {
          this.currentPage = 1
        } else {
          this.searchForm.limit = val
          this.getDataListFun()
        }
      },
      goodId: {
        handler(val) {
          if (val === '') {
            this.orderInfo.name = ''
          }
        },
        deep: true
      }
    },
    mounted() {
      this.searchForm.warehouse_id = this.warehouseId
      this.getDataListFun()
    },
    methods: {
      textFilter(data) {
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
      },
      clearInput() {
        this.$emit('goodSelectedChange', this.cesiId)
      },
      submitSelect() {
        if (this.selectedProduct.sku_uid === undefined) {
          this.$message.error('请选择库存信息')
          return
        }
        this.orderInfo = JSON.parse(JSON.stringify(this.selectedProduct))
        this.$emit('goodSelectedChange', this.orderInfo.id)
        this.$emit('goodSelectedInfo', this.orderInfo)
        this.dialogFormVisible = false
      },
      productRowKey(val) {
        return val.id
      },
      showGoodsTable() {
        this.dialogFormVisible = true
        if (this.$refs.productTable !== undefined) {
          this.$refs.productTable.clearSelection()
        }
      },
      // 获取商品数据
      getDataListFun() {
        warehouseInventories(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      search() {
        this.searchForm.skip = 0
        this.currentPage = 1
        this.getDataListFun()
      },
      selectionChange(val) {
        console.log('val', val)
        this.selectedProduct = val
      }
    }
}

</script>

<style lang="scss" scoped>
  .addButton {
    position: absolute;
    top: 56%;
    left: 46%;
  }
  .f12{
    font-size: 12px;
  }
  .allprice{
    border-radius: 3px;
    padding: 5px;
    border: 1px solid #dcdfe6;
    display: inline-block;
    color: #606266;
    font-size: 14px;
    >span{
      font-size: 18px;
    }
  }
  .rate-item{
    span{
      display: inline-block;
      width: 70px;
      text-align: right;
    }
    .rate{
      display: inline-block !important;
    }
  }
  .goods-item{
    border-bottom: 1px solid #e4e4e4;
    margin-bottom: 5px;
    cursor: pointer;
    clear: both;
    &:last-child {
      border-bottom: none;
      margin-bottom: 0px;
    }
    .image{
      float: left !important;
      margin-right: 5px !important;
    }
    .g-info{
      text-align: left;
      padding-left: 110px;
      p{
        margin: 0px;
        padding: 3px 0px;
        span{
          color: #8c939d;
          font{
            color: #606266;
          }
        }
      }
    }
    .clear{
      clear: both;
    }
  }
  .ui{
    text-align: left;
    line-height: 25px;
    span{
      display: inline-block;
      padding-right: 5px;
      color: #8c939d;
    }
    a{
      color: #1E88E5;
    }
  }
  .gt{
    color: #1E88E5;
  }
  .addressChooseBox {
    /deep/
    .el-cascader {
      width: 100%;
    }
  }
  .otherShopLogo {
    width: 24px;
    height: 24px;
    margin-left: 8px;
    border: none;
  }
  .chooseCheck {
    float: left;
    margin-right: 10px;
    height: 100px;
    line-height: 100px;
  }
</style>
