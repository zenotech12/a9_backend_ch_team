<template>
    <div>
        <el-row>
          <el-col :span="24">
            <order-selector v-model="orderId" style="width: 400px;"></order-selector>
          </el-col>
        </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="skusArray" style="width: 100%" class="inputNumber">
            <el-table-column prop="name" :label="$t('warehouse.name2')"></el-table-column>
            <el-table-column prop="specification" :label="$t('warehouse.pecifications')">
              <template slot-scope="scope">
                {{textFilter(scope.row.specification)}}
              </template>
            </el-table-column>
            <el-table-column :label="$t('warehouse.barCode')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.barcode"></el-input>
              </template>
            </el-table-column>
            <el-table-column :abel="$t('warehouse.position')">
              <template slot-scope="scope">
                <el-select v-model="scope.row.position" :placeholder="$t('warehouse.Pleaseselect')">
                  <el-option
                    v-for="item in position"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <!--<el-input v-model="scope.row.position"></el-input>-->
              </template>
            </el-table-column>
            <el-table-column prop="unit_price" v-if="permissionCheck('opt', '9_3')" :label="$t('warehouse.price')">
              <template slot-scope="scope">
                {{scope.row.unit_price | price}}
              </template>
            </el-table-column>
            <el-table-column prop="count" :label="$t('warehouse.ordernum')">
              <template slot-scope="scope">
                {{scope.row.nowCount}}
              </template>
            </el-table-column>
            <el-table-column prop="count" :label="$t('warehouse.Returnquantity')">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.count" :min="1" :max="scope.row.count"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="total_price" v-if="permissionCheck('opt', '9_3')" :label="$t('warehouse.allprice')">
              <template slot-scope="scope">
                {{scope.row.total_price | price}}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
</template>
<script>
  import { ordersInfo } from '@/api/order'
  export default {
    name: 'showSkuTable',
    data() {
      return {
        orderId: '',
        skusArray: []
      }
    },
    model: {
      prop: 'skus',
      event: 'onchange'
    },
    props: {
      skusArray1: {
        type: Array,
        default: function() {
          return []
        }
      },
      position: {
        type: Array,
        default: function() {
          return []
        }
      },
      resetForm: {
        type: Boolean,
        default: function() {
          return false
        }
      }
    },
    watch: {
      orderId(val) {
        if (val !== '') {
          this.getOrderInfo(val)
          this.$emit('getOrderId', val)
        }
      },
      skus: {
        handler(val) {
          this.skusArray = val
          if (val.length === 0) {
            this.orderId = ''
            this.skusArray = []
          }
        },
        deep: true
      },
      skusArray: {
        handler(val) {
          this.$emit('onchange', val)
        },
        deep: true
      },
      resetForm: {
        handler(val) {
          console.log('vvvvv', val)
          if (val === true) {
            this.orderId = ''
            this.skusArray = []
          }
        },
        deep: true
      }
    },
    mounted() {
    },
    methods: {
      getOrderInfo(id) {
        ordersInfo(id).then(res => {
          if (res.meta === 0) {
            this.skusArray = []
            const array = res.item.merchant_item.goods_items
            array && array.forEach(value => {
              const goodsinfo = value.goods_info
              const obj = {
                name: goodsinfo.spu_name,
                position: '',
                origin: '',
                specification: JSON.stringify(goodsinfo.specifications),
                sku_uid: goodsinfo.sku_url !== '' ? goodsinfo.sku_url : goodsinfo.sku_id,
                barcode: goodsinfo.barcode,
                unit_price: goodsinfo.unit_pay_price,
                count: goodsinfo.count,
                nowCount: goodsinfo.count,
                total_price: goodsinfo.pay_price
              }
              this.skusArray.push(obj)
            })
          }
        })
      },
      submitSelect() {
        if (this.selectedProduct.id === undefined) {
          this.$message.error('请选择订单')
          return
        }
        this.orderInfo = JSON.parse(JSON.stringify(this.selectedProduct))
        this.$emit('skusChange', this.orderInfo.id)
      }
    }
}

</script>

<style lang="scss" scoped>
  .inputNumber {
    /deep/ {
      .el-input-number {
        line-height: 26px;
        width: 100%;
      }
    }
  }
</style>
