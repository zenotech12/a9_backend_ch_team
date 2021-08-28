<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          style="margin: 10px 0"
        >
          <el-col :span="10">
            <el-switch
              v-model="timeValidSwitch"
              :active-text="$t('operation.valid')"
              :inactive-text="$t('operation.all')"
            />
          </el-col>

          <el-col :span="10" style="text-align: right;">
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
                  prop="name"
                  :label="$t('operation.name')"
                  show-overflow-tooltip
                />

                <el-table-column
                  :label="$t('operation.totalMoney')"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{ scope.row.used_money | price }}
                    /
                    {{ scope.row.total_money | price }}
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$t('operation.totalCount')"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{ scope.row.used_count + "/" + scope.row.total_count }}
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$t('operation.splitWay')"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{
                      scope.row.split_way === 1
                        ? $t("operation.splitWayA")
                        : $t("operation.splitWayB")
                    }}
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$t('operation.triggers')"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-tag v-for="(v, k) in scope.row.triggers" :key="k">
                      {{ triggersType[v - 1].name }}
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$t('operation.getTime')"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{
                      scope.row.bt +
                        " " +
                        $t("operation.to") +
                        " " +
                        scope.row.et
                    }}
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$t('tools.opt')"
                  width="180"
                  v-if="permissionCheck('opt')"
                  show-overflow-tooltip
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
          :title="$t('operation.readEnvelopeEdit')"
          width="1000px"
          @close="formEditDialog = false"
          :visible.sync="formEditDialog"
          :close-on-click-modal="false"
          center
        >
          <el-form label-width="100px" :model="form" label-position="top">
            <el-row type="flex" justify="space-between" align="middle">
              <el-col :span="11">
                <el-form-item :label="$t('operation.name')">
                  <el-input v-model="form.name" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item :label="$t('operation.getTime')">
                  <el-date-picker
                    v-model="grantTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    :range-separator="$t('operation.to')"
                    :start-placeholder="$t('tools.startDate')"
                    :end-placeholder="$t('tools.endDate')"
                    align="right"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row type="flex" justify="space-between" align="middle">
              <el-col :span="11">
                <el-form-item :label="$t('operation.totalNum')">
                  <el-input v-model.number="form.total_count" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item :label="$t('operation.totalMoney')">
                  <price-input v-model="form.total_money" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row type="flex" justify="space-between" align="middle">
              <el-col :span="11">
                <el-form-item :label="$t('operation.splitWay')">
                  <el-switch
                    v-model="form.split_way"
                    :active-value="1"
                    :inactive-value="2"
                    :active-text="$t('operation.splitWayA')"
                    :inactive-text="$t('operation.splitWayB')"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item :label="$t('operation.useLimit')">
                  <el-switch
                    v-model="form.limit"
                    :active-value="1"
                    :inactive-value="2"
                    :active-text="$t('operation.useLimitA')"
                    :inactive-text="$t('operation.useLimitB')"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item :label="$t('operation.triggers')">
              <el-select
                multiple
                v-model="form.triggers"
                :placeholder="$t('tools.pleaseSelect')"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in triggersType"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="form.triggers.indexOf(2) >= 0"
              :label="$t('operation.triggersBLable')"
            >
              <el-input v-model.number="form.consume_money">
                <template slot="prepend">
                  {{ $t("operation.triggersBLableA") }}
                </template>

                <template slot="append">
                  {{ $t("operation.triggersBLableB") }}
                </template>
              </el-input>
            </el-form-item>

            <el-form-item
              v-if="form.triggers.indexOf(3) >= 0"
              :label="$t('operation.triggersCLable')"
            >
              <el-input v-model.number="form.recommend_new_user_count">
                <template slot="prepend">
                  {{ $t("operation.triggersCLableA") }}
                </template>

                <template slot="append">
                  {{ $t("operation.triggersCLableB") }}
                </template>
              </el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <confirm-button
              @confirmButton="saveDataFunc()"
              :disabled="submitDisabled"
              :confirmButtonInfor="$t('tools.confirm')"
            />
            <el-button 
            @click="formEditDialog = false" 
            size="small" style="margin-right: 5px; margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  redEnvelopeAdd,
  redEnvelopeModify,
  redEnvelopeList,
  redEnvelopeDelete
} from "@/api/operation";

export default {
  components: {},
  data() {
    const formData = this.setForm();
    const pz = 10;
    return {
      triggersType: [
        { code: 1, name: this.$t("operation.triggersA") },
        { code: 2, name: this.$t("operation.triggersB") },
        { code: 3, name: this.$t("operation.triggersC") }
      ],
      timeValidSwitch: true,
      searchForm: {
        time_valid: 1,
        skip: 0,
        limit: pz
      },
      tableData: [],
      currentPage: 1,
      pageSize: pz,
      itemCount: 0,
      grantTime: [], // 发放时段
      form: formData,
      formEditDialog: false,
      submitDisabled: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    grantTime(val) {
      if (val.length > 0) {
        this.form.bt = val[0];
        this.form.et = val[1];
      }
    },
    currentPage(val) {
      this.searchForm.skip = (val - 1) * this.pageSize;
      this.searchForm.limit = this.pageSize;
      this.getDataListFun();
    }
  },
  methods: {
    setForm(data) {
      if (data) {
        this.grantTime = [data.bt, data.et];
        return data;
      } else {
        this.grantTime = [];
        this.validTime = [];
        return {
          id: "",
          name: "",
          bt: "",
          et: "",
          total_money: 0,
          total_count: 0,
          split_way: 1,
          triggers: [],
          consume_money: 0,
          recommend_new_user_count: 0,
          limit: 1
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
      console.log(this.form);
      this.form.triggers = JSON.stringify(this.form.triggers);
      if (this.form.id !== "") {
        redEnvelopeModify(this.form.id, this.form)
          .then(res => {
            this.getDataListFun();
            this.formEditDialog = false;
            this.submitDisabled = false;
          })
          .catch(() => {
            this.submitDisabled = false;
          });
      } else {
        redEnvelopeAdd(this.form)
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
      redEnvelopeDelete(row.id).then(res => {
        this.getDataListFun();
      });
    },
    getDataListFun() {
      redEnvelopeList(this.searchForm).then(res => {
        this.tableData = res.items;
        this.itemCount = res.total;
      });
    }
  },
  mounted() {
    this.getDataListFun();
  }
};
</script>
