<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" width="85%">
      <span slot="title" style="font-weight: bold; font-size: 15px">{{
        $t("warehouse.Info")
      }}</span>
      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column label="#" width="60px" fixed="left">
          <template slot-scope="scope">{{
            scope.$index + numinfofrom.skip + 1
          }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$t('warehouse.name2')"
          width="350px"
        >
          <template slot-scope="scope">
            <div style="padding: 10px">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="origin"
          :label="$t('warehouse.PlaceofOrigin')"
        ></el-table-column>
        <el-table-column
          prop="barcode"
          :label="$t('warehouse.barCode')"
        ></el-table-column>
        <el-table-column
          prop="specification"
          :label="$t('warehouse.pecifications')"
          width="350"
        >
          <template slot-scope="scope">{{
            textFilter(scope.row.specification)
          }}</template>
        </el-table-column>
        <el-table-column
          prop="count"
          :label="$t('warehouse.num')"
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="position"
          :label="$t('warehouse.position')"
        ></el-table-column>
        <el-table-column
          prop="warehouse_name"
          :label="$t('warehouse.name')"
        ></el-table-column>
      </el-table>
      <div style="text-align: right; margin-top: 10px">
        <el-pagination
          :current-page.sync="currentPage_info"
          :page-size="pageSize_info"
          layout="total, prev, pager, next, jumper"
          :total="itemCount_info"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { warehouseInventories } from "@/api/warehouse";
export default {
  name: "totalData",
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      currentPage_info: 1,
      pageSize_info: 10,
      itemCount_info: 0,
      numinfofrom: {
        sku_uid: "",
        specification: "",
        skip: 0,
        limit: 10,
      },
    };
  },
  props: {
    restFrom: {
      type: String,
      default: function () {
        return "";
      },
    },
    restFromid: {
      type: String,
      default: function () {
        return "";
      },
    },
    istype: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  methods: {
    textFilter(data) {
      let index = data.indexOf("{");
      if (index != -1) {
        let str = "";
        const text = JSON.parse(data);
        Object.keys(text).forEach((v, i) => {
          if (i === 0) {
            str = v + ":" + text[v] + ";";
          } else {
            str = str + v + ":" + text[v] + ";";
          }
        });
        return str;
      } else {
        return data;
      }
    },
    getnuminfo() {
      warehouseInventories(this.numinfofrom).then((res) => {
        this.tableData = res.items;
        this.itemCount_info = res.total;
        console.log(res);
      });
    },
  },
  watch: {
    currentPage_info(val) {
      this.numinfofrom.skip = (val - 1) * this.pageSize_info;
      this.numinfofrom.limit = this.pageSize_info;
      this.getnuminfo();
    },
    istype: {
      handler(val) {
        if (val == true) {
          this.dialogVisible = true;
          this.numinfofrom.sku_uid = this.restFromid;
          this.numinfofrom.specification = this.restFrom;
          this.getnuminfo();
        }
      },
      deep: true,
    },
    dialogVisible: {
      handler(val) {
        if (val == false) {
          this.currentPage_info = 1;
          this.$emit("dalogtype");
        }
      },
      deep: true,
    },
  },
  mounted() {},
};
</script>

<style>
</style>