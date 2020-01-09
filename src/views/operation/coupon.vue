<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span ="14">
            <el-radio-group v-model="selectedType" size="small">
              <el-radio-button :label="$t('tools.all')"></el-radio-button>
              <el-radio-button v-for="(v,k) in couponType" :label="v.name" :key="k"></el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="10" class="funcList">
            <div class="boxFuncBtn" @click="addCoupon">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)">
                <el-table-column prop="name" :label="$t('operation.name')"></el-table-column>
                <el-table-column :label="$t('operation.couponType')">
                  <template  slot-scope="scope">
                    {{couponType[scope.row.type-1].name}}
                    <template v-if="scope.row.type === 1">[{{scope.row.quantity_discount_value | price}}]</template>
                    <template v-else-if="scope.row.type === 2">[{{scope.row.percentage_discount_value}}%]</template>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.couponCond')">
                  <template  slot-scope="scope">
                    {{$t('operation.couponCondA')}} {{scope.row.threshold | price}} {{$t('operation.couponCondB')}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.rangeType')">
                  <template  slot-scope="scope">
                    {{rangeType[scope.row.range_type-1].name}}
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('operation.totalCount')">
                  <template  slot-scope="scope">
                    {{scope.row.used_count + '/' + scope.row.total_count}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.getTime')">
                  <template  slot-scope="scope">
                    {{scope.row.grant_bt + $t('operation.to') + scope.row.grant_et}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "140">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showCouponEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                    <span class="xiexian">/</span>
                    <delete-button  @delData="deleteCouponFunc(scope.row)"></delete-button>
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
        <el-dialog :title="$t('operation.couponEdit')" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form">
            <el-form-item :label="$t('operation.name')">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.couponType')">
              <el-select v-model="form.type" :placeholder="$t('tools.pleaseSelect')">
                <el-option
                  v-for="item in couponType"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.type === 1" :label="$t('operation.couponMoney')">
              <price-input v-model="form.quantity_discount_value"></price-input>
            </el-form-item>
            <el-form-item v-else-if="form.type === 2" :label="$t('operation.couponDiscount')">
              <el-input v-model.number="form.percentage_discount_value">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item v-else-if="form.type === 3" :label="$t('operation.exchangeGoods')">
              <goods-selector :mulit="true"  v-model="form.exchange_goods_ids"></goods-selector>
            </el-form-item>
            <el-form-item :label="$t('operation.couponCond')">
              <price-input v-model="form.threshold">
                <template slot="prepend">{{$t('operation.couponCondA')}}$</template>
                <template slot="append">{{$t('operation.couponCondB')}}</template>
              </price-input>
            </el-form-item>
            <el-form-item :label="$t('operation.rangeType')">
              <el-select v-model="form.range_type" :placeholder="$t('tools.pleaseSelect')">
                <el-option
                  v-for="item in rangeType"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.range_type === 2" :label="$t('operation.rangeGoods')">
              <goods-selector :mulit="true" v-model="form.goods_spu_ids"></goods-selector>
            </el-form-item>
            <el-form-item v-else-if="form.range_type === 3" :label="$t('operation.rangeTypes')">
              <el-cascader
                :options="goodsTypeData"
                :props="{ multiple: true, value: 'tree_code', label: 'name', children: 'items' }"
                clearable></el-cascader>
            </el-form-item>
            <el-form-item :label="$t('operation.totalCount')">
              <el-input v-model.number="form.total_count"></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.getTime')">
              <el-date-picker
                v-model="grantTime"
                type="daterange"
                value-format = "yyyy-MM-dd"
                :range-separator="$t('operation.to')"
                :start-placeholder="$t('tools.startDate')"
                :end-placeholder="$t('tools.endDate')"
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('operation.perCount')">
              <el-input v-model.number="form.per_quota_count"><template slot="append">{{$t('operation.perUser')}}</template></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.overlay')">
              <el-switch
                v-model="form.overlay"
                :active-text="$t('operation.overlayB')"
                :inactive-text="$t('operation.overlayA')">
              </el-switch>
            </el-form-item>
            <el-form-item :label="$t('operation.validType')">
              <el-switch
                v-model="validType"
                :active-text="$t('operation.validTypeB')"
                :inactive-text="$t('operation.validTypeA')">
              </el-switch>
            </el-form-item>
            <el-form-item v-if="validType" :label="$t('operation.validTime2')">
              <el-input v-model.number="form.valid_day_count"><template slot="prepend">{{$t('operation.validTime2Tip1')}}</template><template slot="append">{{$t('operation.validTime2Tip2')}}</template></el-input>
            </el-form-item>
            <el-form-item v-else :label="$t('operation.validTime')">
              <el-date-picker
                v-model="validTime"
                type="daterange"
                value-format = "yyyy-MM-dd"
                :range-separator="$t('operation.to')"
                :start-placeholder="$t('tools.startDate')"
                :end-placeholder="$t('tools.endDate')"
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('operation.desc')">
              <el-input type="textarea" maxlength="200" rows="3" v-model="form.desc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveAdFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import goodsSelector from '@/components/goodsSelector'
  import { couponAdd, couponModify, couponList, couponDelete } from '@/api/operation'
  import { spuTypesList } from '@/api/goods'
  export default {
    components: {
      goodsSelector
    },
    data() {
      const formData = this.setForm()
      const pz = 10
      return {
        couponType: [{ code: 1, name: this.$t('operation.couponTypeA') }, { code: 2, name: this.$t('operation.couponTypeB') }, { code: 3, name: this.$t('operation.couponTypeC') }],
        rangeType: [{ code: 1, name: this.$t('operation.rangeTypeA') }, { code: 2, name: this.$t('operation.rangeTypeB') }, { code: 3, name: this.$t('operation.rangeTypeC') }],
        timeValidSwitch: true,
        searchForm: {
          type: 0,
          skip: '',
          limit: pz
        },
        selectedType: this.$t('tools.all'),
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        grantTime: [], // 发放时段
        validTime: [], // 可用时段
        validType: false, // 有效期类型、 固定时段 or 动态时段
        form: formData,
        formEditDialog: false,
        submitDisabled: false,
        goodsTypeData: []
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      validType(val) {
        if (!val) {
          this.form.valid_day_count = 0
        }
      },
      validTime(val) {
        if (val.length > 0) {
          this.form.bt = val[0]
          this.form.et = val[1]
        } else {
          this.form.bt = ''
          this.form.et = ''
        }
      },
      grantTime(val) {
        if (val.length > 0) {
          this.form.grant_bt = val[0]
          this.form.grant_et = val[1]
        }
      },
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getCouponListFun()
      },
      timeValidSwitch(val) {
        this.searchForm.time_valid = val ? 1 : 0
        this.getCouponListFun()
      },
      selectedType(val) {
        if (val === this.$t('tools.all')) {
          this.searchForm.type = 0
        } else {
          const result = this.couponType.find(item => { return item.name === val })
          this.searchForm.type = result.code
        }
        this.getCouponListFun()
      }
    },
    methods: {
      setForm(data) {
        if (data) {
          this.grantTime = [data.grant_bt, data.grant_et]
          const temp = JSON.parse(JSON.stringify(data))
          temp.goods_spu_ids = temp.goods_spu_ids ? JSON.stringify(temp.goods_spu_ids) : ''
          temp.exchange_goods_ids = temp.exchange_goods_ids ? (Array.isArray(temp.exchange_goods_ids) ? JSON.stringify(temp.exchange_goods_ids) : temp.exchange_goods_ids) : ''
          if (temp.valid_day_count > 0) {
            this.validType = true
          } else {
            this.validTime = [data.bt, data.et]
          }
          return temp
        } else {
          this.grantTime = []
          this.validTime = []
          return {
            id: '',
            name: '',
            range_type: 1,
            merchant_goods_type_codes: [],
            goods_spu_ids: '',
            type: 1,
            quantity_discount_value: 0,
            percentage_discount_value: 0,
            exchange_goods_ids: '',
            threshold: 0,
            overlay: false,
            valid_day_count: 0,
            bt: '',
            et: '',
            grant_bt: '',
            grant_et: '',
            total_count: 0,
            per_quota_count: 0,
            desc: ''
          }
        }
      },
      addCoupon() {
        this.form = this.setForm()
        this.formEditDialog = true
      },
      showCouponEditor(data) {
        this.form = this.setForm(data)
        this.formEditDialog = true
      },
      imageUploadSuccess(res) {
        this.form.image = res.md5
        console.log(res)
      },
      saveAdFunc() {
        this.submitDisabled = true
        if (this.form.id !== '') {
          couponModify(this.form.id, this.form).then(res => {
            this.getCouponListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else {
          couponAdd(this.form).then(res => {
            this.getCouponListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
      },
      deleteCouponFunc(row) {
        couponDelete(row.id).then(res => {
          this.getCouponListFun()
        })
      },
      getCouponListFun() {
        couponList(this.searchForm).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
        })
      },
      getTypeList() {
        spuTypesList({ type: 2 }).then(response => {
          if (response.meta === 0) {
            this.goodsTypeData = response.items
          }
        })
      }
    },
    mounted() {
      this.getCouponListFun()
      this.getTypeList()
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>

</style>
