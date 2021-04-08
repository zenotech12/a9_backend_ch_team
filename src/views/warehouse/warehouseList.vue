<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="10" class="funcList">
            <div class="boxFuncBtn" @click="addData" v-if="permissionCheck('opt')">
              <img src="../../assets/images/icon/icon_add.png" alt class="icon_add" />
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)">
                <el-table-column prop="name" label="仓库名称"></el-table-column>
                <el-table-column label="备注">
                  <template slot-scope="scope">{{scope.row.comment}}</template>
                </el-table-column>
                <el-table-column label="仓库简称">
                  <template slot-scope="scope">{{scope.row.short_name}}</template>
                </el-table-column>
                <el-table-column label="仓库编号">
                  <template slot-scope="scope">{{scope.row.no}}</template>
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width="140" v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="showDataEditor(scope.row)"
                      size="small"
                    >{{$t('tools.edit')}}</el-button>
                    <span class="xiexian">/</span>
                    <delete-button @delData="deleteDataFunc(scope.row)"></delete-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount"
                ></el-pagination>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-dialog
          title="添加仓库"
          width="700px"
          @close="formEditDialog=false"
          :visible.sync="formEditDialog"
          :close-on-click-modal="false"
          center
        >
          <el-form label-width="100px" :model="form">
            <el-form-item label="仓库名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="仓库编号">
              <el-input v-model="form.no"></el-input>
            </el-form-item>
            <el-form-item label="仓库简称">
              <el-input v-model="form.short_name"></el-input>
            </el-form-item>
            <el-form-item label="拼音码">
              <el-input v-model="form.pinyin_code"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.comment"></el-input>
            </el-form-item>
            <el-form-item label="联系人名字">
              <el-input v-model="form.contacter_name"></el-input>
            </el-form-item>
            <el-form-item label="联系人手机">
              <el-input v-model="form.contacter_mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮编">
              <el-input v-model="form.postcode"></el-input>
            </el-form-item>
            <el-form-item class="start" :label="$t('sys.address1')">
              <map-selector v-model="address"></map-selector>
              <div class="distpicker_error" v-if="placeShow">{{$t('sys.selectAddress')}}</div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button
              @confirmButton="saveDataFunc(row)"
              :disabled="submitDisabled"
              :confirmButtonInfor="$t('tools.confirm')"
            ></confirm-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// import { redEnvelopeAdd, redEnvelopeModify, redEnvelopeList, redEnvelopeDelete } from '@/api/operation'
import {
  warehousesAdd,
  warehousesModify,
  warehousesList,
  warehousesDel,
} from "@/api/warehouse";
export default {
  components: {},
  data() {
    const formData = this.setForm();
    const pz = 10;
    return {
      triggersType: [
        { code: 1, name: this.$t("operation.triggersA") },
        { code: 2, name: this.$t("operation.triggersB") },
        { code: 3, name: this.$t("operation.triggersC") },
      ],
      timeValidSwitch: true,
      searchForm: {
        time_valid: 1,
        skip: "",
        limit: pz,
      },
      placeShow: false,
      placeChecked: false,
      tableData: [],
      currentPage: 1,
      pageSize: pz,
      itemCount: 0,
      form: formData,
      formEditDialog: false,
      submitDisabled: false,
      address: {
        province: "",
        city: "",
        district: "",
        addr: "",
        coord: "",
      },
    };
  },

  watch: {
    currentPage(val) {
      this.searchForm.skip = (val - 1) * this.pageSize;
      this.searchForm.limit = this.pageSize;
      this.getDataListFun();
    },
  },
  methods: {
    placeCheck() {
      if (
        this.address.province !== "" &&
        this.address.city !== "" &&
        this.address.area !== "" &&
        this.address.district !== "" &&
        this.address.addr !== "" &&
        this.address.coord !== ""
      ) {
        this.placeShow = false;
        this.placeChecked = true;
      } else {
        this.placeShow = true;
        this.placeChecked = false;
      }
    },
    setForm(data) {
      if (data) {
        return data;
      } else {
        return {
          id: "",
          type: "1",
          name: "",
          no: "",
          short_name: "",
          pinyin_code: "",
          comment: "",
          contacter_name: "",
          contacter_mobile: "",
          address: "",
          postcode: "",
        };
      }
    },
    addData() {
      this.form = this.setForm();
      this.formEditDialog = true;
    },
    showDataEditor(data) {

      this.form = this.setForm(data);
      //  warehousesList(data.id).then((res) => {
      //    console.log(res);
      // });
      this.formEditDialog = true;
    },
    imageUploadSuccess(res) {
      this.form.image = res.md5;
      console.log(res);
    },

    saveDataFunc() {
      this.submitDisabled = true;
      console.log(this.form);
      this.address.coord = [this.address.lon, this.address.lat];
      this.placeCheck();
      this.form.address = JSON.stringify(this.address);
      if (this.form.id !== "") {
        warehousesModify(this.form.id, this.form)
          .then((res) => {
            this.getDataListFun();
            this.formEditDialog = false;
            this.submitDisabled = false;
          })
          .catch(() => {
            this.submitDisabled = false;
          });
      } else {
        warehousesAdd(this.form)
          .then((res) => {
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
      console.log(row.id);
      warehousesDel(row.id).then((res) => {
        this.getDataListFun();
      });
    },
    getDataListFun() {
      warehousesList(this.searchForm).then((res) => {
        this.tableData = res.items;
        console.log(res);
      });
    },
  },
  mounted() {
    this.getDataListFun();
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.funcList {
  width: 100%;
  text-align: right;
}
.address {
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 300px;
  }
}
</style>
