<template>
  <div>
    <el-row style="margin-bottom: 10px">
      <el-col :span="24">
        <purchases-list @dataid="dataid" @getvalue="getvalue" style="width: 400px;"></purchases-list>
      </el-col>
    </el-row>
    <el-row>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="name" :label="$t('warehouse.name2')" width="200px"></el-table-column>
        <el-table-column :label="$t('warehouse.PlaceofOrigin')" width="200px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.origin"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.location')" width="160px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.position" :placeholder="$t('warehouse.Pleaseselect')">
              <el-option
                v-for="item in locationlist"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.pecifications')" width="200px">
          <template slot-scope="scope">
            {{textFilter(scope.row.specification)}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.barCode')" width="200px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.barcode"></el-input>
          </template>
        </el-table-column>
        <el-table-column v-if="permissionCheck('opt', '9_3')" property="unit_price" :label="$t('warehouse.price')" align="center" width="100px">
           <template slot-scope="scope">
                      {{scope.row.unit_price | price}}
                    </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.num')" width="150px">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.count"></el-input>
          </template>
        </el-table-column>
        <el-table-column v-if="permissionCheck('opt', '9_3')" property="total_price" :label="$t('warehouse.allprice')" align="center" width="100px">
           <template slot-scope="scope">
                      {{scope.row.total_price | price}}
                    </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import { purchaseInfo, Locationlist } from "../../../api/warehouse";
export default {
  name: "showSkuPlist",
  data() {
    return {
      value: '',
      puid: '',
      tableData: [],
      bcode: '',
      key: '',
      Ty: false,
      locationlist: [],
    };
  },
  props: {
    warehouseId2: {
      type: String,
      default: function () {
        return '';
      },
    },
     resetForm: {
        type: Boolean,
        default: function() {
          return false
        }
      }
  },
  watch: {
      resetForm: {
        handler(val) {
          console.log('vvvv5v', val)
          if (val === true) {
            this.tableData = []
          }
        },
        deep: true
      }
    },
  methods: {
    dataid(data) {
      this.puid = data.id;
      this.getpuinfo();
    },
    getvalue(val) {},
    getwarelocation() {
      Locationlist(this.warehouseId2).then((res) => {
        this.locationlist = res.items;
      });
    },
    getpuinfo() {
      purchaseInfo(this.puid).then((res) => {
        this.tableData = res.item.skus;
        this.tableData.forEach((item, k) => {
          this.$set(this.tableData[k], 'position', '')
        });
      });
    },
    handleSelectionChange(val) {
      let array = [];
      array.push(val);
      this.$emit("pulist", array[0]);
      this.$emit("getid", this.puid);
    },
  },
  mounted() {
    this.tableData = [];
  },
  created() {
    this.getwarelocation();
  },
};
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
