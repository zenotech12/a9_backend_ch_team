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
          <el-col :span="10">
            <el-radio-group v-model="tabPosition" size="small">
              <el-radio-button label="0">
                {{ $t("operation.all") }}
              </el-radio-button>

              <el-radio-button label="1">
                {{ $t("operation.notstarted") }}
              </el-radio-button>

              <el-radio-button label="2">
                {{ $t("operation.pbDoing") }}
              </el-radio-button>

              <el-radio-button label="3">
                {{ $t("operation.expired") }}
              </el-radio-button>
            </el-radio-group>
          </el-col>

          <el-col :span="10" style="text-align: right;">
            <el-button
              icon="el-icon-plus"
              type="success"
              size="small"
              v-if="permissionCheck('opt')"
              @click="addData"
            >
              {{ $t("tools.add") }}
            </el-button>
          </el-col>
        </el-row>

        <el-table :data="tableData" style="width: 100%" border stripe>
          <el-table-column
            :label="$t('sys.title')"
            prop="title"
            width="250px"
            show-overflow-tooltip
          />

          <el-table-column
            prop="content"
            :label="$t('lang.content')"
            show-overflow-tooltip
          />

          <el-table-column :label="$t('goods.cobuysec')" width="300">
            <template slot-scope="scope">
              <span>{{ scope.row.bt }} - {{ scope.row.et }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('tools.opt')" width="200">
            <template slot-scope="scope">
              <el-button size="small" @click="modifybtn(scope.row)">
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

        <el-dialog
          :title="$t('operation.Addmemorandum')"
          :visible.sync="dialogVisible"
          width="40%"
        >
          <el-form
            ref="form"
            :model="dataForm"
            label-width="150px"
            label-position="left"
          >
            <el-form-item :label="$t('sys.title')">
              <el-input v-model="dataForm.title" style="width: 100%" />
            </el-form-item>

            <el-form-item :label="$t('goods.cobuysec')">
              <div class="block">
                <el-date-picker
                  v-model="timeArr"
                  type="datetimerange"
                  range-separator="-"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  :start-placeholder="$t('lang.startDate')"
                  :end-placeholder="$t('lang.endDate')"
                  style="width: 100%"
                />
              </div>
            </el-form-item>

            <el-form-item :label="$t('lang.content')">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 10 }"
                v-model="dataForm.content"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
             <el-button type="success" @click="comformBtn" size="small">
              {{ $t("tools.confirm") }}
            </el-button>
            <el-button @click="dialogVisible = false" size="small">
              {{ $t("tools.cancel") }}
            </el-button>

            
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  memorandumsadd,
  getmemorandums,
  Delmemorandums,
  modifymemorandums
} from "@/api/operation";

export default {
  components: {},
  data() {
    return {
      tabPosition: 0,
      type: "",
      dataid: "",
      tableData: [],
      dialogVisible: false,
      timeArr: [],
      dataForm: {
        bt: "",
        et: "",
        content: "",
        title: ""
      },
      serachform: {
        status: 0,
        skip: 0,
        limit: 10
      },
      currentPage: 1,
      pageSize: 10,
      itemCount: 0
    };
  },
  computed: {},
  watch: {
    tabPosition(val) {
      this.serachform.status = val;
      this.Getmemorandumslist();
    },
    currentPage(val) {
      this.serachform.skip = (val - 1) * this.pageSize;
      this.serachform.limit = this.pageSize;
      this.Getmemorandumslist();
    }
  },
  mounted() {
    this.Getmemorandumslist();
  },
  methods: {
    addData() {
      this.type = "1";
      this.timeArr = [];
      this.dataForm.bt = "";
      this.dataForm.et = "";
      this.dataForm.content = "";
      this.dialogVisible = true;
    },
    modifybtn(data) {
      this.timeArr = [];
      this.timeArr[0] = data.bt;
      this.timeArr[1] = data.et;
      this.dataForm.content = data.content;
      this.dataForm.title = data.title;
      // console.log(data);
      this.dataid = data.id;
      this.type = "2";
      this.dialogVisible = true;
    },
    comformBtn() {
      this.dataForm.bt = this.timeArr[0];
      this.dataForm.et = this.timeArr[1];

      if (!this.dataForm.title && !this.dataForm.content) {
        this.$message("Please enter title and content");
        return;
      }

      if (this.type == 1) {
        memorandumsadd(this.dataForm).then(res => {
          this.dialogVisible = false;
          this.Getmemorandumslist();
        });
      } else if (this.type == 2) {
        modifymemorandums(this.dataForm, this.dataid).then(res => {
          this.dialogVisible = false;
          this.Getmemorandumslist();
        });
      }
    },
    Getmemorandumslist() {
      getmemorandums(this.serachform).then(res => {
        this.tableData = res.items;
        this.itemCount = res.total;
      });
    },
    deleteDataFunc(data) {
      Delmemorandums(data.id).then(res => {
        this.Getmemorandumslist();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.funcList {
  width: 100%;
  text-align: right;
}
.container {
  display: flex;
  align-items: center;
}
</style>
