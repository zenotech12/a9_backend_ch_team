<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span ="14">
            <el-radio-group v-model="searchType" size="small">
              <el-radio-button :label="$t('tools.all')"></el-radio-button>
              <el-radio-button :label="$t('operation.pbDoing')"></el-radio-button>
              <el-radio-button :label="$t('operation.pbAfter')"></el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="10" class="funcList">
            <div class="boxFuncBtn" @click="addData">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)">
                <el-table-column prop="spu_name" :label="$t('operation.goods')" min-width="260px"></el-table-column>
                <el-table-column  :label="$t('operation.pbGoods1')" min-width="400">
                  <template  slot-scope="scope">
                    <el-row v-for="(v, k) in scope.row.panic_buy_skus" :key="k" :gutter="10">
                      <el-col :span="14">
                        <div class="pi">
                          <el-image class="ei" :src="getImageUrl(v.img,50,50)"></el-image>
                          <p class="info">
                            <span v-for="(sk,sv) in v.specifications" :key="sk">{{sv}}：<font>{{sk}}</font></span>
                          </p>
                        </div>
                      </el-col>
                      <el-col :span="6" :title="$t('operation.pbCount1')">
                        {{v.sales}}/{{v.count}}
                      </el-col>
                      <el-col :span="4">
                        {{v.price | price }}
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.pbTime')" width="220">
                  <template  slot-scope="scope">
                    {{scope.row.bt.substring(0,13) + $t('operation.to') + scope.row.et.substring(0,13)}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "140" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showDataEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                    <span class="xiexian">/</span>
                    <delete-button  @delData="deleteDataFunc(scope.row)"></delete-button>
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
        <el-dialog :title="$t('operation.pbEdit')" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form">
            <el-form-item :label="$t('operation.pbGoods')">
              <goods-selector v-model="form.spu_id" :approve_status="2" :shelf_status="2"></goods-selector>
            </el-form-item>
            <el-form-item :label="$t('operation.pbTime')">
              <el-date-picker
                v-model="grantTime"
                type="daterange"
                format = "yyyy-MM-dd"
                value-format = "yyyy-MM-dd"
                :range-separator="$t('operation.to')"
                :start-placeholder="$t('tools.startDate')"
                :end-placeholder="$t('tools.endDate')"
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('operation.pbTimes')">
              <el-select v-model="selectedTimes">
                <el-option
                  v-for="item in seckillTimes"
                  :key="item.id"
                  :label="item.hour"
                  :value="item.hour">
                </el-option>
              </el-select>
            </el-form-item>
            <el-divider content-position="left">{{$t('operation.pbSkus')}}</el-divider>
            <el-table :data="goodsInventoryTable"  style="width: 100%">
              <el-table-column :label="$t('operation.pbSelected')" width="60">
                <template  slot-scope="scope">
                  <el-checkbox v-model="scope.row.selected"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="title" :label="$t('goods.sp')">
              </el-table-column>
              <el-table-column :label="$t('operation.pbCount')" width="150">
                <template  slot-scope="scope">
                  <el-input v-model.number="scope.row.count">
                    <template slot="append">
                      /{{scope.row.inventory}}
                    </template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('operation.pbPirce')">
                <template  slot-scope="scope">
                  <price-input v-model="scope.row.sale_price">
                    <template slot="append">
                      <span>/{{scope.row.price | price}}</span>
                    </template>
                  </price-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import goodsSelector from '@/components/goodsSelector'
  import { spusSkusList } from '@/api/goods'
  import { panicBuysList, panicBuysDelete, panicBuysAdd, panicBuysModify, panicBuysTimes } from '@/api/operation'
  export default {
    components: {
      goodsSelector
    },
    data() {
      const formData = this.setForm()
      const pz = 10
      return {
        timeValidSwitch: true,
        searchType: this.$t('tools.all'),
        searchForm: {
          bt_after: '',
          doing_time: '',
          skip: '',
          limit: pz
        },
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        grantTime: [], // 秒杀时段
        form: formData,
        goodsInventoryTable: [],
        currentSetSkus: [],
        formEditDialog: false,
        submitDisabled: false,
        seckillTimes: [],
        selectedTimes: 0 // 选择的场次
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      'searchForm.doing_time': function() {
        this.getDataListFun()
      },
      searchType(val) {
        this.skip = 0
        switch (val) {
          case this.$t('tools.all'):
            this.searchForm.bt_after = ''
            this.searchForm.doing_time = ''
            break
          case this.$t('operation.pbDoing'):
            this.searchForm.bt_after = ''
            this.searchForm.doing_time = this.$moment().format('YYYY-MM-DD HH')
            break
          case this.$t('operation.pbAfter'):
            this.searchForm.bt_after = this.$moment().format('YYYY-MM-DD HH')
            this.searchForm.doing_time = ''
            break
        }
        this.getDataListFun()
      },
      grantTime(val) {
        if (val.length > 0) {
          this.form.bt = val[0] + ' ' + (this.selectedTimes < 10 ? ('0' + this.selectedTimes) : this.selectedTimes)
          this.form.et = val[1] + ' 23'
        }
      },
      selectedTimes(val) {
        if (this.grantTime.length > 0) {
          this.form.bt = this.grantTime[0] + ' ' + (val < 10 ? ('0' + val) : val)
        }
      },
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      },
      'form.spu_id': function(val) {
        this.goodsInventoryTable = []
        if (val !== '') {
          spusSkusList(val, { skip: 0, limit: -1 }).then(res => {
            res.items.forEach(item => {
              let title = ''
              for (const pk in item.specifications) {
                title += pk + '：' + item.specifications[pk] + '；'
              }
              const setInfo = { selected: false, count: 0, sale_price: item.price }
              if (this.currentSetSkus.length > 0) {
                const sc = this.currentSetSkus.find(sk => {
                  return sk.sku_id === item.id
                })
                if (sc) {
                  setInfo.selected = true
                  setInfo.count = sc.count
                  setInfo.sale_price = sc.price
                }
              }
              this.goodsInventoryTable.push({ selected: setInfo.selected, id: item.id, title: title, price: item.price, inventory: item.inventory, count: setInfo.count, sale_price: setInfo.sale_price })
            })
          })
        }
      }
    },
    methods: {
      setForm(data) {
        if (data) {
          this.grantTime = [data.bt.substring(0, 10), data.et.substring(0, 10)]
          this.currentSetSkus = data.panic_buy_skus
          this.selectedTimes = parseInt(data.bt.substring(11, 13))
          return {
            id: data.id,
            spu_id: data.spu_id,
            bt: data.bt.substring(0, 10),
            et: data.et.substring(0, 10)
          }
        } else {
          this.grantTime = []
          this.validTime = []
          this.currentSetSkus = []
          return {
            id: '',
            spu_id: '',
            bt: '',
            et: ''
          }
        }
      },
      addData() {
        this.form = this.setForm()
        this.formEditDialog = true
      },
      showDataEditor(data) {
        console.log(data)
        this.form = this.setForm(data)
        this.formEditDialog = true
      },
      imageUploadSuccess(res) {
        this.form.image = res.md5
        console.log(res)
      },
      saveDataFunc() {
        this.submitDisabled = true
        const skuPrice = []
        this.goodsInventoryTable.forEach(res => {
          if (res.selected && res.count > 0) {
            skuPrice.push({ sku_id: res.id, price: res.sale_price, count: res.count })
          }
        })
        if (skuPrice.length <= 0) {
          this.$message.error(this.$t('operation.pbTip'))
          this.submitDisabled = false
          return
        }
        const itemData = { spu_id: this.form.spu_id, sku_prices: JSON.stringify(skuPrice), bt: this.form.bt, et: this.form.et }
        if (this.form.id !== '') {
          panicBuysModify(this.form.id, itemData).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else {
          panicBuysAdd(itemData).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
      },
      deleteDataFunc(row) {
        panicBuysDelete(row.id).then(res => {
          this.getDataListFun()
        })
      },
      getDataListFun() {
        panicBuysList(this.searchForm).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
        })
      },
      getPnicBuysTimes() {
        panicBuysTimes().then(res => {
          this.seckillTimes = res.items
        })
      }
    },
    mounted() {
      // this.searchForm.doing_time = this.$moment().format('YYYY-MM-DD HH')
      this.getPnicBuysTimes()
      this.getDataListFun()
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
  .pi{
    position: relative;
    .ei{
      float: left;
    }
    .info {
      vertical-align: middle;
      padding-left: 60px;
      text-align: left;
      span{
        display: inline-block;
        margin-right: 5px;
        color: #8c939d;
        font: #333333 !important;
      }
    }
  }
</style>
