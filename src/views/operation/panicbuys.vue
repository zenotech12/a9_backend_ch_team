<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          style="padding: 8px 0;"
        >
          <el-col :span="14">
            <el-radio-group v-model="searchType" size="small">
              <el-radio-button :label="$t('tools.all')" />

              <el-radio-button :label="$t('operation.pbDoing')" />

              <el-radio-button :label="$t('operation.pbAfter')" />
            </el-radio-group>
          </el-col>

          <el-col :span="3" style="text-align: right">
            <el-button
              type="success"
              size="small"
              icon="el-icon-plus"
              @click="addData"
              v-if="permissionCheck('opt')"
            >
              {{ $t("tools.add") }}
            </el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table
                stripe
                border
                :data="tableData"
                height="calc(100% - 40px)"
              >
                <el-table-column label="#" width="60px">
                  <template slot-scope="scope">
                    {{ scope.$index + searchForm.skip + 1 }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="spu_name"
                  :label="$t('operation.goods')"
                  min-width="260px"
                />

                <el-table-column
                  :label="$t('operation.pbGoods1')"
                  min-width="400"
                >
                  <template slot-scope="scope">
                    <el-row
                      v-for="(v, k) in scope.row.panic_buy_skus"
                      :key="k"
                      :gutter="10"
                      type="flex"
                      align="middle"
                    >
                      <el-col :span="4">
                        <el-image
                          :src="getImageUrl(v.img, 50, 50)"
                          style="width: 100%; height: 100%; object-fit: contain"
                        />
                      </el-col>

                      <el-col :span="9">
                        <span v-for="(sk, sv) in v.specifications" :key="sk">
                          {{ sv }}：<font>{{ sk }}</font>
                        </span>
                      </el-col>

                      <el-col :span="6" :title="$t('operation.pbCount1')">
                        {{ v.sales }}/{{ v.count }}
                      </el-col>

                      <el-col :span="5">
                        {{ v.price | price }}
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>

                <el-table-column :label="$t('operation.pbTime')" width="220">
                  <template slot-scope="scope">
                    {{ scope.row.bt.substring(0, 13) }}
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$t('tools.opt')"
                  v-if="permissionCheck('opt')"
                  width="180"
                >
                  <template slot-scope="scope">
                    <el-button @click="showDataEditor(scope.row)" size="small">
                      {{ $t("tools.edit") }}
                    </el-button>

                    <delete-button @delData="deleteDataFunc(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>

              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount"
                />
              </div>
            </div>
          </el-col>
        </el-row>

        <el-dialog
          :title="$t('operation.pbEdit')"
          width="1000px"
          @close="formEditDialog = false"
          :visible.sync="formEditDialog"
          :close-on-click-modal="false"
          center
        >
          <el-form label-position="top" :model="form">
            <el-row type="flex" justify="space-between" align="middle">
              <el-col :span="12">
                <el-form-item :label="$t('operation.pbGoods')">
                  <goods-selector
                    v-model="form.spu_id"
                    :approve_status="2"
                    :shelf_status="2"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="11">
                <el-form-item :label="$t('operation.pbTime')">
                  <el-date-picker
                    v-model="beginDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    align="right"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row type="flex" justify="space-between" align="middle">
              <el-col :span="12">
                <el-form-item :label="$t('goods.xgLabel')" prop="xg">
                  <el-radio v-model="xgType" :label="1">
                    {{ $t("goods.xgLabel1") }}
                  </el-radio>

                  <el-radio v-model="xgType" :label="2">
                    {{ $t("goods.xgLabel2") }}
                  </el-radio>

                  <el-input
                    style="width: 100px; display: inline-block"
                    v-if="xgType == 2"
                    size="small"
                    placeholder=""
                    v-model.number="form.buy_limit"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="11">
                <el-form-item :label="$t('operation.pbTimes')">
                  <el-select v-model="selectedTimes" style="width: 100%">
                    <el-option
                      v-for="item in seckillTimes"
                      :key="item.id"
                      :label="item.hour + ':00'"
                      :value="item.hour"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">
              {{ $t("operation.pbSkus") }}
            </el-divider>

            <el-table :data="goodsInventoryTable" style="width: 100%">
              <el-table-column :label="$t('operation.pbSelected')" width="60">
                <template slot="header" slot-scope="scope">
                  <el-checkbox v-model="batchSelect" />
                </template>

                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.selected" />
                </template>
              </el-table-column>

              <el-table-column prop="title" :label="$t('goods.sp')" />

              <el-table-column :label="$t('operation.pbCount')" width="300">
                <template slot="header" slot-scope="scope">
                  {{ $t("operation.pbCount") }}

                  <el-popover placement="bottom" width="200" trigger="click">
                    <el-input v-model.number="batchCount" />

                    <i
                      slot="reference"
                      :title="$t('goods.batchSet')"
                      class="el-icon-setting"
                    />
                  </el-popover>
                </template>

                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.count">
                    <template slot="append">
                      /{{ scope.row.inventory }}
                    </template>
                  </el-input>
                </template>
              </el-table-column>

              <el-table-column :label="$t('operation.pbPirce')">
                <template slot="header" slot-scope="scope">
                  {{ $t("operation.pbPirce") }}

                  <el-popover placement="bottom" width="200" trigger="click">
                    <price-input v-model="batchPrice" />

                    <i
                      slot="reference"
                      :title="$t('goods.batchSet')"
                      class="el-icon-setting"
                    />
                  </el-popover>
                </template>

                <template slot-scope="scope">
                  <price-input v-model="scope.row.sale_price">
                    <template slot="append">
                      <span>/{{ scope.row.price | price }}</span>
                    </template>
                  </price-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <confirm-button
              @confirmButton="saveDataFunc()"
              :disabled="submitDisabled"
              :confirmButtonInfor="$t('tools.confirm')"
            />
              <el-button 
              @click="formEditDialog = false" 
              size="small" 
              style="margin-right:5px; margin-left:10px;">{{$t('tools.cancel')}}
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import goodsSelector from "@/components/goodsSelector";
import { spusSkusList } from "@/api/goods";
import {
  panicBuysList,
  panicBuysDelete,
  panicBuysAdd,
  panicBuysModify,
  panicBuysTimes
} from "@/api/operation";

export default {
  components: {
    goodsSelector
  },
  data() {
    const formData = this.setForm();
    const pz = 10;
    return {
      batchPrice: 0,
      batchCount: 0,
      batchSelect: false,
      timeValidSwitch: true,
      searchType: this.$t("tools.all"),
      searchForm: {
        bt_after: "",
        doing_time: "",
        skip: 0,
        limit: pz
      },
      tableData: [],
      currentPage: 1,
      pageSize: pz,
      itemCount: 0,
      grantTime: [], // 秒杀时段
      beginDate: "",
      form: formData,
      goodsInventoryTable: [],
      currentSetSkus: [],
      formEditDialog: false,
      submitDisabled: false,
      seckillTimes: [],
      selectedTimes: 0, // 选择的场次
      xgType: 1
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    batchPrice(val) {
      this.goodsInventoryTable.forEach(item => {
        if (item.selected) {
          this.$set(item, "sale_price", val);
        }
      });
    },
    batchCount(val) {
      this.goodsInventoryTable.forEach(item => {
        if (item.selected) {
          this.$set(
            item,
            "count",
            val <= item.inventory ? val : item.inventory
          );
        }
      });
    },
    batchSelect(val) {
      this.goodsInventoryTable.forEach(item => {
        this.$set(item, "selected", val);
      });
    },
    "searchForm.doing_time": function() {
      this.getDataListFun();
    },
    xgType(val) {
      if (val === 1) {
        this.form.buy_limit = 0;
      }
    },
    searchType(val) {
      this.skip = 0;
      switch (val) {
        case this.$t("tools.all"):
          this.searchForm.bt_after = "";
          this.searchForm.doing_time = "";
          break;
        case this.$t("operation.pbDoing"):
          this.searchForm.bt_after = "";
          this.searchForm.doing_time = this.$moment().format("YYYY-MM-DD HH");
          break;
        case this.$t("operation.pbAfter"):
          this.searchForm.bt_after = this.$moment().format("YYYY-MM-DD HH");
          this.searchForm.doing_time = "";
          break;
      }
      this.getDataListFun();
    },
    beginDate(val) {
      if (val.length > 0) {
        this.form.bt =
          val +
          " " +
          (this.selectedTimes < 10
            ? "0" + this.selectedTimes
            : this.selectedTimes);
      }
    },
    selectedTimes(val) {
      if (this.beginDate) {
        this.form.bt = this.beginDate + " " + (val < 10 ? "0" + val : val);
      }
    },
    currentPage(val) {
      this.searchForm.skip = (val - 1) * this.pageSize;
      this.searchForm.limit = this.pageSize;
      this.getDataListFun();
    },
    "form.spu_id": function(val) {
      this.goodsInventoryTable = [];
      if (val !== "") {
        spusSkusList(val, { skip: 0, limit: -1 }).then(res => {
          res.items.forEach(item => {
            let title = "";
            for (const pk in item.specifications) {
              title += pk + "：" + item.specifications[pk] + "；";
            }
            const setInfo = {
              selected: false,
              count: 0,
              sale_price: item.price
            };
            if (this.currentSetSkus.length > 0) {
              const sc = this.currentSetSkus.find(sk => {
                return sk.sku_id === item.id;
              });
              if (sc) {
                setInfo.selected = true;
                setInfo.count = sc.count;
                setInfo.sale_price = sc.price;
              }
            }
            this.goodsInventoryTable.push({
              selected: setInfo.selected,
              id: item.id,
              title: title,
              price: item.price,
              inventory: item.inventory,
              count: setInfo.count,
              sale_price: setInfo.sale_price
            });
          });
        });
      }
    }
  },
  methods: {
    setForm(data) {
      if (data) {
        this.beginDate = data.bt.substring(0, 10);
        this.currentSetSkus = data.panic_buy_skus;
        this.selectedTimes = parseInt(data.bt.substring(11, 13));
        this.xgType = data.buy_limit > 0 ? 2 : 1;
        return {
          id: data.id,
          spu_id: data.spu_id,
          bt: data.bt.substring(0, 13),
          et: data.et.substring(0, 10),
          buy_limit: data.buy_limit
        };
      } else {
        this.beginDate = "";
        this.validTime = [];
        this.currentSetSkus = [];
        this.xgType = 1;
        return {
          id: "",
          spu_id: "",
          bt: "",
          et: "",
          buy_limit: 0
        };
      }
    },
    addData() {
      this.form = this.setForm();
      this.formEditDialog = true;
    },
    showDataEditor(data) {
      console.log(data);
      this.form = this.setForm(data);
      this.formEditDialog = true;
    },
    imageUploadSuccess(res) {
      this.form.image = res.md5;
      console.log(res);
    },
    saveDataFunc() {
      this.submitDisabled = true;
      const skuPrice = [];
      this.goodsInventoryTable.forEach(res => {
        if (res.selected && res.count > 0) {
          skuPrice.push({
            sku_id: res.id,
            price: res.sale_price,
            count: res.count
          });
        }
      });
      if (skuPrice.length <= 0) {
        this.$message.error(this.$t("operation.pbTip"));
        this.submitDisabled = false;
        return;
      }
      const itemData = {
        spu_id: this.form.spu_id,
        sku_prices: JSON.stringify(skuPrice),
        bt: this.form.bt,
        et: this.form.et,
        buy_limit: this.form.buy_limit
      };
      if (this.form.id !== "") {
        panicBuysModify(this.form.id, itemData)
          .then(res => {
            this.getDataListFun();
            this.formEditDialog = false;
            this.submitDisabled = false;
          })
          .catch(() => {
            this.submitDisabled = false;
          });
      } else {
        panicBuysAdd(itemData)
          .then(res => {
            this.getDataListFun();
            this.formEditDialog = false;
            this.submitDisabled = false;
          })
          .catch(() => {
            this.submitDisabled = false;
          });
      }
    },
    deleteDataFunc(row) {
      panicBuysDelete(row.id).then(res => {
        this.getDataListFun();
      });
    },
    getDataListFun() {
      panicBuysList(this.searchForm).then(res => {
        this.tableData = res.items;
        this.itemCount = res.total;
      });
    },
    getPnicBuysTimes() {
      panicBuysTimes().then(res => {
        this.seckillTimes = res.items;
      });
    }
  },
  mounted() {
    // this.searchForm.doing_time = this.$moment().format('YYYY-MM-DD HH')
    this.getPnicBuysTimes();
    this.getDataListFun();
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.pi {
  position: relative;
  .ei {
    float: left;
  }
  .info {
    vertical-align: middle;
    padding-left: 60px;
    text-align: left;
    span {
      display: inline-block;
      margin-right: 5px;
      color: #8c939d;
      font: #333333 !important;
    }
  }
}
</style>
