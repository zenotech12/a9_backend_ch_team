<template>
    <div>
        <el-input readonly placeholder="请选择商品" clearable v-model="orderInfo.name" @clear="clearInput">
            <el-button slot="append" icon="el-icon-edit-outline" @click="showGoodsTable"></el-button>
        </el-input>
        <el-dialog title="商品列表" width="80%" :visible.sync="dialogFormVisible" center append-to-body>
            <v-pageSearch style="padding: 0px;">
              <el-form :inline="true" :model="searchForm">
                <el-form-item>
                  <el-select v-model="searchForm.approve_status" @change="search" :placeholder="$t('goods.checkSelectorHolder')">
                    <el-option
                      v-for="item in approveStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="searchForm.name" :placeholder="$t('tools.searchKeyTip')" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
                </el-form-item>
              </el-form>
            </v-pageSearch>
          <el-row>
            <el-col :span="24">
              <el-table stripe border v-loading="tableData.loading" :data="tableData.body" :row-key="productRowKey" highlight-current-row height="calc(100vh - 390px)" @current-change="selectionChange">
                <el-table-column  :label="$t('goods.name')" min-width="300">
                  <template  slot-scope="scope">
                    <!--<a class="goods-item" :href="goodsPreview(scope.row)" target="_blank" style="cursor: pointer">-->
                    <div class="goods-item">
                    <el-image class="image" style="width: 60px; height: 60px"  :src="getImageUrl(scope.row.images[0], 100,100)"  fit="cover"></el-image>
                      <div class="g-info">
                        <p>{{scope.row.name}}
                          <el-tag size="mini" type="danger" v-if="scope.row.type === 2">{{$t("goods.cobuy")}}</el-tag>
                          <el-tag size="mini" v-if="scope.row.type === 3">{{$t("goods.exp")}}</el-tag>
                          <!--<a class="el-icon-view"></a>-->
                        </p>
                      </div>
                    </div>
                    <!--</a>-->
                  </template>
                </el-table-column>
                <el-table-column :label="$t('goods.checkStatus')" width="110">
                  <template  slot-scope="scope">
                    <el-tag :type="scope.row.approve_status === 2 ? 'success' : (scope.row.approve_status === 3 ? 'danger' : 'info' )">
                      {{scope.row.approve_status === 2 ? $t('goods.checkStatusB') : (scope.row.approve_status === 3 ?  $t('goods.checkStatusC') :  $t('goods.checkStatusA') )}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('goods.putawayG')" width="90">
                  <template  slot-scope="scope">
                    <el-tag :type="scope.row.shelf_status === 2 ? 'success' :  'danger'">
                      {{scope.row.shelf_status === 2 ?$t('goods.putawayA') : $t('goods.putawayB')}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('goods.price')" width="120">
                  <template  slot-scope="scope">
                    <template v-if="scope.row.type === 3">
                      <el-tag size="mini" v-if="scope.row.type === 3">{{$t("goods.exp")}}</el-tag>
                      <span v-if="scope.row.min_price !== scope.row.max_price">{{scope.row.min_price}}-{{scope.row.max_price}}</span>
                      <span v-else>{{scope.row.min_price}}</span>
                    </template>
                    <template v-else>
                      <span v-if="scope.row.min_price !== scope.row.max_price">{{scope.row.min_price | price}}-{{scope.row.max_price | price}}</span>
                      <span v-else>{{scope.row.min_price | price}}</span>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column prop="inventory" width="75"  :label="$t('goods.inventory')">
                </el-table-column>
                <el-table-column prop="sales" width="75"  :label="$t('goods.saled')">
                </el-table-column>
                <el-table-column prop="gen_time" width="150"  :label="$t('goods.publishTime')">
                </el-table-column>
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
  import { spusList } from '@/api/goods'
  export default {
    name: 'goodsSelector',
    data() {
      return {
        orderInfo: { name: '' },
        dialogFormVisible: false,
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        selectedProduct: {},
        searchForm: {
          name: '',
          skip: 0,
          limit: 10,
          approve_status: 2, // 审批状态 0所有 1待审批 2审批成功 3拒绝
          merchant_id: '', // 商户id，不填所有，自营填000000000000000000000001
          type_id: '',
          shelf_status: 2, // 上架状态 所有0 未上架1 上架2
          deleted: false
        },
        tableData: {
          loading: true,
          body: []
        },
        approveStatus: [
          {
            value: 0,
            label: this.$t('tools.all')
          }, {
            value: 1,
            label: this.$t('goods.checkStatusA')
          }, {
            value: 2,
            label: this.$t('goods.checkStatusB')
          }, {
            value: 3,
            label: this.$t('goods.checkStatusC')
          }],
        shelfStatus: [
          {
            value: 0,
            label: this.$t('tools.all')
          }, {
            value: 1,
            label: this.$t('goods.putawayB')
          }, {
            value: 2,
            label: this.$t('goods.putawayA')
          }, {
            value: 3,
            label: this.$t('goods.putawayF')
          }],
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
      this.getDataListFun()
      // this.getProductInfo()
    },
    methods: {
      clearInput() {
        this.$emit('goodSelectedChange', this.cesiId)
      },
      goodsPreview(row) {
        return 'https://www.a9kh.com/goods/' + row.id + '.html'
      },
      submitSelect() {
        if (this.selectedProduct.id === undefined) {
          this.$message.error('请选择商品')
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
        if (this.searchForm.shelf_status === 3) {
          this.searchForm.deleted = true
        } else {
          this.searchForm.deleted = false
        }
        this.$store.dispatch('SetSearchParam', { key: this.searchParamKey, value: this.searchForm })
        spusList(this.searchForm).then(response => {
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
