<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="8" :offset="8">
            <el-form>
              <el-form-item :label="$t('order.exportDate')" style="margin-top: 60px">
                <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable style="width: 260px;"
                                v-model="saleTime"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="-"
                                :start-placeholder="$t('tools.startDate')"
                                :end-placeholder="$t('tools.endDate')">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" v-if="permissionCheck('opt')" size="small" @click="exportSale">{{$t('order.saleGoodsReportExport')}}</el-button>
              </el-form-item>
              <el-form-item :label="$t('order.exportDate')">
                <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable style="width: 260px;"
                                v-model="inventoriesTime"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="-"
                                :start-placeholder="$t('tools.startDate')"
                                :end-placeholder="$t('tools.endDate')">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" v-if="permissionCheck('opt')" size="small" @click="exportInventroy">{{$t('order.inventroyGoodsExport')}}</el-button>
              </el-form-item>
              <el-form-item :label="$t('order.exportDate')">
                <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable style="width: 260px;"
                                v-model="purchaseTime"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="-"
                                :start-placeholder="$t('tools.startDate')"
                                :end-placeholder="$t('tools.endDate')">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" v-if="permissionCheck('opt')" size="small" @click="exportPurchase">{{$t('order.purchaseGoodsExport')}}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { orderSaleByGoodsExport, warehouseInventoriesOutinExport, warehousePurchaseExportByExport } from '@/api/reportExport'
  export default {
    data() {
      return {
        saleTime: [],
        formSale: {
          bt: '',
          et: ''
        },
        inventoriesTime: [],
        formInventories: {
          bt: '',
          et: ''
        },
        purchaseTime: [],
        formPurchase: {
          bt: '',
          et: ''
        }
      }
    },
    watch: {
      saleTime(val) {
        if (val && val.length === 2) {
          this.formSale.bt = val[0]
          this.formSale.et = val[1]
        } else {
          this.formSale.bt = ''
          this.formSale.et = ''
        }
      },
      inventoriesTime(val) {
        if (val && val.length === 2) {
          this.formInventories.bt = val[0]
          this.formInventories.et = val[1]
        } else {
          this.formInventories.bt = ''
          this.formInventories.et = ''
        }
      },
      purchaseTime(val) {
        if (val && val.length === 2) {
          this.formPurchase.bt = val[0]
          this.formPurchase.et = val[1]
        } else {
          this.formPurchase.bt = ''
          this.formPurchase.et = ''
        }
      }
    },
    methods: {
      exportSale() {
        if (this.formSale.bt === '') {
          this.$message.error(this.$t('order.pleaseChooseTime'))
          return
        }
        orderSaleByGoodsExport(this.formSale).then(res => {
          var link = document.createElement('a')
          const blod = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blod)
          link.download = 'SaleGoodsInfo.xlsx'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      },
      exportInventroy() {
        if (this.formInventories.bt === '') {
          this.$message.error(this.$t('order.pleaseChooseTime'))
          return
        }
        warehouseInventoriesOutinExport(this.formInventories).then(res => {
          var link = document.createElement('a')
          const blod = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blod)
          link.download = 'InventoriesOutInInfo.xlsx'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      },
      exportPurchase() {
        if (this.formPurchase.bt === '') {
          this.$message.error(this.$t('order.pleaseChooseTime'))
          return
        }
        warehousePurchaseExportByExport(this.formPurchase).then(res => {
          var link = document.createElement('a')
          const blod = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blod)
          link.download = 'PurchasesGoodsInfo.xlsx'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      }
    }
  }
</script>

<style scoped>

</style>
