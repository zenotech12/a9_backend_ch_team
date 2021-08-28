<template>
  <div class="sys-body">
    <div class="">
      <!-- 搜索 -->
      <div class="">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="16" style="display:flex; align-content:center;">
            <el-form :inline="true" :model="searchForm">
              <el-form-item>
                <el-input
                  v-model="searchForm.key"
                  :placeholder="$t('tools.searchKeyTip')"
                  clearable
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="search"
                  icon="el-icon-search"
                  style="padding: 8px 15px">{{$t('sys.search')}}
                </el-button>
               
              </el-form-item>
            </el-form>
          </el-col>

          <el-col :span="4" style="text-align: right;">
            <el-button
              @click="addData"
              v-if="permissionCheck('opt')"
              type="success"
              size="small"
              icon="el-icon-plus"
            >
              {{ $t("tools.add") }}
            </el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" style="height: calc(100vh - 200px)">
            <el-table
              stripe
              border
              :data="tableData"
              height="calc(100% - 40px)"
              style="width: 100%;"
            >
              <el-table-column label="#" width="60px">
                <template slot-scope="scope">
                  {{ scope.$index + searchForm.skip + 1 }}
                </template>
              </el-table-column>

              <el-table-column :label="$t('goods.name')" min-width="300">
                <template slot-scope="scope">
                  <div class="goods-item">
                    <el-image
                      class="image"
                      style="width: 80px; height: 80px"
                      :src="getImageUrl(scope.row.images[0], 100, 100)"
                      fit="cover"
                    />

                    <div class="g-info">
                      <p>
                        {{ scope.row.name }}

                        <el-tag
                          effect="dark"
                          size="mini"
                          type="danger"
                          v-if="scope.row.type === 2"
                        >
                          {{ $t("goods.cobuy") }}
                        </el-tag>

                        <el-tag
                          effect="dark"
                          size="mini"
                          v-if="scope.row.type === 3"
                        >
                          {{ $t("goods.exp") }}
                        </el-tag>
                      </p>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('operation.tgTimes')" width="350">
                <template slot-scope="scope">
                  {{
                    $moment(scope.row.cobuy.start_time).format(
                      "YYYY-MM-DD hh:MM A"
                    )
                  }}

                  {{ $t("tools.to") }}

                  {{
                    $moment(scope.row.cobuy.end_time).format(
                      "YYYY-MM-DD hh:MM A"
                    )
                  }}
                </template>
              </el-table-column>

              <el-table-column width="150" :label="$t('goods.cobuyuser')">
                <template slot-scope="scope">
                  {{ scope.row.cobuy.person_count }}
                </template>
              </el-table-column>

              <el-table-column :label="$t('goods.price')" width="120">
                <template slot-scope="scope">
                  {{ scope.row.cobuy.price | price }}
                </template>
              </el-table-column>

              <el-table-column
                prop="inventory"
                width="100"
                :label="$t('goods.inventory')"
              />

              <el-table-column width="100" :label="$t('goods.saled')">
                <template slot-scope="scope">
                  {{ scope.row.cobuy.sales }}
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('tools.opt')"
                width="180"
                fixed="right"
                v-if="permissionCheck('opt')"
              >
                <template slot-scope="scope">
                  <el-button
                    @click="showDataEditor(scope.row)"
                    size="small"
                    type="plain"
                  >
                    {{ $t("tools.edit") }}
                  </el-button>

                  <delete-button
                    btnType="danger"
                    :promptInfor="promptInfor"
                    @delData="deleteDataFunc(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>

            <template v-if="itemCount !== 0">
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount"
                />
              </div>
            </template>
          </el-col>
        </el-row>

        <el-dialog
          :title="$t('operation.tgGoodsEdit')"
          width="1000px"
          @close="formEditDialog = false"
          :visible.sync="formEditDialog"
          :close-on-click-modal="false"
          center
        >
          <el-form label-width="220px" label-position="top" :model="form">
            <el-form-item :label="$t('operation.tgGoods')">
              <goods-selector
                v-model="form.spu_id"
                :approve_status="2"
                :shelf_status="2"
              />
            </el-form-item>

            <el-form-item>
              <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="11">
                  <el-form-item :label="$t('operation.tgTimes')">
                    <el-date-picker
                      style="width: 100%"
                      size="small"
                      v-model="grantTime"
                      type="datetimerange"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="-"
                      :start-placeholder="$t('tools.startDate')"
                      :end-placeholder="$t('tools.endDate')"
                      :default-time="['12:00:00']"
                      align="right"
                    />
                  </el-form-item>
                </el-col>

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
              </el-row>
            </el-form-item>

            <el-form-item>
              <el-row type="flex" justify="space-between" align="center">
                <el-col :span="11">
                  <el-form-item :label="$t('goods.cobuyuser')">
                    <el-input v-model.number="form.cobuy_person_count">
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item :label="$t('goods.cobuysec')">
                    <el-select
                      style="width: 100%"
                      v-model="form.cobuy_group_valid_sec"
                    >
                      <el-option
                        v-for="item in secondArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>

                  <!-- {{ $t("goods.hour") }} -->
                </el-col>
              </el-row>
            </el-form-item>

            <el-divider content-position="center">
              {{ $t("operation.tgPrice") }}
            </el-divider>

            <el-table :data="goodsInventoryTable" style="width: 100%">
              <el-table-column prop="title" :label="$t('goods.sp')" />

              <el-table-column :label="$t('goods.inventory')" width="150">
                <template slot-scope="scope">
                  {{ scope.row.inventory }}
                </template>
              </el-table-column>

              <el-table-column :label="$t('operation.tgPrice1')">
                <template slot="header" slot-scope="scope">
                  {{ $t("operation.tgPrice1") }}

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
                  <price-input v-model="scope.row.cobuy_price">
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
             <el-button @click="formEditDialog = false" size="small" style="margin-right: 5px; margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import goodsSelector from "@/components/goodsSelector";
import { spusSkusList, spusList } from "@/api/goods";
import { cobuySet } from "@/api/operation";

export default {
  components: {
    goodsSelector
  },
  data() {
    const formData = this.setForm();
    const pz = 10;
    return {
      batchPrice: 0,
      xgType: 1,
      timeValidSwitch: true,
      searchForm: {
        cobuy: 2,
        key: "",
        skip: 0,
        shelf_status: 2,
        approve_status: 2,
        limit: pz
      },
      secondArr: [
        { label: 0.5, value: 1800 },
        { label: 1, value: 3600 },
        { label: 2, value: 7200 },
        { label: 5, value: 18000 }
      ],
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
      promptInfor: this.$t("operation.tgTip2")
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    batchPrice(val) {
      this.goodsInventoryTable.forEach(item => {
        this.$set(item, "cobuy_price", val);
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
    grantTime(val) {
      if (val.length > 0) {
        this.form.start_time = val[0];
        this.form.end_time = val[1];
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
            this.goodsInventoryTable.push({
              sku_id: item.id,
              title: title,
              price: item.price,
              inventory: item.inventory,
              cobuy_price: item.cobuy_price
            });
          });
        });
      }
    }
  },
  methods: {
    setForm(data) {
      if (data) {
        this.grantTime = [data.cobuy.start_time, data.cobuy.end_time];
        this.currentSetSkus = data.panic_buy_skus;
        this.xgType = data.buy_limit && data.buy_limit.cobuy > 0 ? 2 : 1;
        return {
          spu_id: data.id,
          cobuy_person_count: data.cobuy.person_count,
          cobuy_group_valid_sec: data.cobuy.cobuy_group_valid_sec,
          start_time: data.cobuy.start_time,
          end_time: data.cobuy.end_time,
          buy_limit:
            data.buy_limit && data.buy_limit.cobuy > 0
              ? data.buy_limit.cobuy
              : 0
        };
      } else {
        this.grantTime = [];
        this.validTime = [];
        this.currentSetSkus = [];
        this.xgType = 1;
        return {
          spu_id: "",
          cobuy_person_count: "",
          cobuy_group_valid_sec: "",
          start_time: "",
          end_time: "",
          buy_limit: 0
        };
      }
    },
    addData() {
      this.form = this.setForm();
      this.formEditDialog = true;
    },
    showDataEditor(data) {
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
      let isErr = "";
      this.goodsInventoryTable.forEach(res => {
        skuPrice.push({ sku_id: res.sku_id, cobuy_price: res.cobuy_price });
        if (res.cobuy_price <= 0) {
          isErr = "true";
        }
      });

      if (isErr) {
        this.$message.error(this.$t("operation.tgTip"));
        this.submitDisabled = false;
        return;
      }
      const itemData = {
        type: 2,
        cobuy_skus: JSON.stringify(skuPrice),
        start_time: this.form.start_time,
        end_time: this.form.end_time,
        cobuy_person_count: this.form.cobuy_person_count,
        cobuy_group_valid_sec: this.form.cobuy_group_valid_sec,
        buy_limit: this.form.buy_limit
      };

      cobuySet(this.form.spu_id, itemData)
        .then(res => {
          this.getDataListFun();
          this.formEditDialog = false;
          this.submitDisabled = false;
        })
        .catch(() => {
          this.submitDisabled = false;
        });
    },
    deleteDataFunc(row) {
      cobuySet(row.id, { type: 1 }).then(res => {
        this.getDataListFun();
      });
    },
    getDataListFun() {
      spusList(this.searchForm).then(res => {
        this.tableData = res.items;
        this.itemCount = res.total;
      });
    },
    search() {
      this.getDataListFun();
    }
  },
  mounted() {
    // this.searchForm.doing_time = this.$moment().format('YYYY-MM-DD HH')
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
