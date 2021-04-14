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
              <!-- 表格 -->
              <el-table stripe border :data="tableData" height="calc(100% - 40px)">
                <!-- 仓库名称 -->
                <el-table-column prop="name" :label="$t('warehouse.name')"></el-table-column>
                <!-- 备注 -->
                <el-table-column :label="$t('warehouse.remarks')">
                  <template slot-scope="scope">{{scope.row.comment}}</template>
                </el-table-column>
                <!-- 简称 -->
                <el-table-column :label="$t('warehouse.abbreviation')">
                  <template slot-scope="scope">{{scope.row.short_name}}</template>
                </el-table-column>
                <!-- 数量 -->
                <el-table-column :label="$t('warehouse.num1')">
                  <template slot-scope="scope">{{scope.row.no}}</template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column :label="$t('tools.opt')" width="200" v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="showDataEditor(scope.row)"
                      size="small"
                    >{{$t('tools.edit')}}</el-button>
                    <span class="xiexian">/</span>
                    <delete-button @delData="deleteDataFunc(scope.row)"></delete-button>
                    <span class="xiexian">/</span>
                    <el-button type="text" @click="CargoArea(scope.row)" size="small">货区货位</el-button>
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
        <!-- 模态框 -->
        <el-dialog
          class="dialog"
          :title="$t('warehouse.add')"
          width="700px"
          @close="formEditDialog=false"
          :visible.sync="formEditDialog"
          :close-on-click-modal="false"
          center
        >
          <el-form label-width="100px" :model="form">
            <!-- 仓库名称 -->
            <el-form-item :label="$t('warehouse.name')">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!-- 仓库编号 -->
            <el-form-item :label="$t('warehouse.num1')">
              <el-input v-model="form.no"></el-input>
            </el-form-item>
            <!-- 简称 -->
            <el-form-item :label="$t('warehouse.abbreviation')">
              <el-input v-model="form.short_name"></el-input>
            </el-form-item>
            <!-- 拼音码 -->
            <el-form-item :label="$t('warehouse.Pinyin')">
              <el-input v-model="form.pinyin_code"></el-input>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('warehouse.remarks')">
              <el-input v-model="form.comment"></el-input>
            </el-form-item>
            <!-- 手机联系人 -->
            <el-form-item :label="$t('warehouse.contacts')">
              <el-input v-model="form.contacter_name"></el-input>
            </el-form-item>
            <!-- 联系人手机 -->
            <el-form-item :label="$t('warehouse.tel')">
              <el-input v-model="form.contacter_mobile"></el-input>
            </el-form-item>
            <!-- 邮编 -->
            <el-form-item :label="$t('warehouse.Postcode')">
              <el-input v-model="form.postcode"></el-input>
            </el-form-item>
            <!-- 地址选择 -->
            <el-form-item class="start" :label="$t('sys.address1')">
              <map-selector v-model="formAddress"></map-selector>
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
        <!-- 货区货位 -->
        <el-dialog
          class="dialog"
          title="货区货位"
          width="1200px"
          @close="CargoAreaDialog=false"
          :visible.sync="CargoAreaDialog"
          :close-on-click-modal="false"
          center
        >
        <confirm-button confirmButtonInfor="批量新建货位" @confirmButton="CargoAreaadd()"></confirm-button>
        <el-table
          ref="multipleTable"
          :data="locData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="货位"><template slot-scope="scope">{{ scope.row.date }}</template></el-table-column>
        </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button size='small'>批量删除</el-button>
            <confirm-button :disabled="submitDisabled" @confirmButton="confir()" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
        <!-- 新建货位 -->
        <el-dialog
          class="dialog"
          title="新建货位"
          width="500px"
          @close="CargoAreaDialog2=false"
          :visible.sync="CargoAreaDialog2"
          :close-on-click-modal="false"
          center
        >
            <div class="carg">
              <span>行</span>
              <div><el-input v-model="linestar"></el-input></div>&nbsp;-&nbsp;
              <div><el-input v-model="lineend"></el-input></div>
            </div>
            <div class="carg">
              <span>列</span>
              <div><el-input v-model="columnstar"></el-input></div>&nbsp;-&nbsp;
              <div><el-input v-model="columnend"></el-input></div>
            </div>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="CargoAreafun()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  warehousesAdd, 
  warehousesModify, 
  warehousesList, 
  warehousesDel, 
  CwarehouseAdd, 
  Locationlist, 
  LocationDel
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
        skip: "",
        limit: pz,
      },
      placeShow: false,
      placeChecked: false,
      tableData: [],
      locData: [],
      currentPage: 1,
      pageSize: pz,
      itemCount: 0,
      form: formData,
      CargoAreaDialog: false,
      CargoAreaDialog2: false,
      formEditDialog: false,
      submitDisabled: false,
      formAddress: {
        province: '',
        city: '',
        area: '',
        address: '',
        lon: 104.917445,
        lat: 11.558831,
      },
      positions: [],
      linestar: '',
      lineend: '',
      columnstar: '',
      columnend: '',
      Cid: ''
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
        this.formAddress.province !== "" &&
        this.formAddress.city !== "" &&
        this.formAddress.district !== "" &&
        this.formAddress.addr !== "" &&
        this.formAddress.lat !== "" &&
        this.formAddress.lon !== ""
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
          address: {
            province: "",
            city: "",
            district: "",
            addr: "",
            coord: [],
          },
          postcode: "",
        };
      }
    },
    addData() {
      this.form = this.setForm();
      this.formEditDialog = true;
    },
    showDataEditor(data) {
      // this.form = JSON.parse(JSON.stringify(data))
      this.form.contacter_name = data.contacter.name;
      this.form.contacter_mobile = data.contacter.mobile;
      this.form.id = data.id;
      this.form.name = data.name;
      this.form.no = data.no;
      this.form.short_name = data.short_name;
      this.form.pinyin_code = data.pinyin_code;
      this.form.comment = data.comment;
      this.form.postcode = data.postcode;
      // warehousesInfo(data.id).then((res) => {
      //   //  console.log(res);
      // });
      this.formEditDialog = true;
    },
    imageUploadSuccess(res) {
      this.form.image = res.md5;
      // console.log(res);
    },
    
    saveDataFunc() {
      this.submitDisabled = true;
      // console.log(this.form);
      this.form.address.province = this.formAddress.province;
      this.form.address.city = this.formAddress.city;
      this.form.address.district = this.formAddress.area;
      this.form.address.addr = this.formAddress.address;
      this.form.address.coord.push(this.formAddress.lon, this.formAddress.lat);
      this.placeCheck();
      let arr = this.form.address;
      this.form.address = JSON.stringify(arr);
      console.log(this.form);
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
      // console.log(row.id);
      warehousesDel(row.id).then((res) => {
        this.getDataListFun();
      });
    },
    CargoArea(data) {
      this.Cid = data.id
      console.log(this.Cid)
      this.CargoAreaDialog = true
      this.getLocationlist(data.id)
    },
    CargoAreaadd() {
      this.linestar = ''
      this.lineend = ''
      this.columnstar = ''
      this.columnend = ''
      this.CargoAreaDialog = false;
      this.CargoAreaDialog2 = true;
    },
    getLocationlist(id){
      Locationlist(id).then(res=>{
       console.log(res);
       this.locData = res.items
     })
    },
    CargoAreafun(){
      let positions = []
      for (let i =this.linestar;i <= this.lineend; i++){
        for (let j =this.columnstar;j < this.columnend; j++){
            positions.push(i + "-" + j)
        }
      }
      CwarehouseAdd(this.Cid, {positions: JSON.stringify(positions)}).then(res=>{
        console.log(res);
      })
      this.getDataListFun()  
      this.CargoAreaDialog2 = false
    },
    getDataListFun() {
      warehousesList(this.searchForm).then((res) => {
        this.tableData = res.items
        this.itemCount = res.total
        // console.log(res.items);
      });
    },
    handleSelectionChange(val) {
      console.log(val)
    },
    confir(){
      this.CargoAreaDialog = false
    }
  },
  mounted() {
    this.getDataListFun();
  },
  created() {
  },
};
</script>

<style lang="scss" scoped>
.funcList {
  width: 100%;
  text-align: right;
}
  .carg {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    >span{
      margin-right: 5px;
    }
    >div{
      width: 100px;
    }
}
</style>
