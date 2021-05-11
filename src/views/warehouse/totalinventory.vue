<template>
  <div class="sys-body">
    <div class="sys-neiBody bigbox">
      <div></div>
      <div class="rightbox">
        <div>
          <div>
            <div style="width:200px" class="searchbtn">
              <el-input v-model="totalgoodshForm.key"></el-input>
              <el-button type="primary" icon="el-icon-search" size="small" @click="Searchlist"></el-button>
            </div>
            <el-table :data="Totaldata" border stripe style="width: 100%">
              <el-table-column label="#" width="60px">
                <template slot-scope="scope">
                  {{scope.$index + totalgoodshForm.skip + 1}}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="date" label="规格信息">
                <template slot-scope="scope">{{textFilter(scope.row.specification)}}</template>
              </el-table-column>
              <el-table-column prop="barcode" label="条形码"></el-table-column>
              <el-table-column prop="unit_price" label="单价"></el-table-column>
              <el-table-column prop="count" label="数量">
                <template slot-scope="scope">
                  <span class="numcss" @click="numinfo(scope.row)">{{scope.row.count}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="origin" label="产地"></el-table-column>
            </el-table>
          </div>
        </div>
        <div style="text-align: right;margin-top: 10px">
          <el-pagination
            :current-page.sync="currentPage_to"
            :page-size="pageSize_to"
            layout="total, prev, pager, next, jumper"
            :total="itemCount_to"
          ></el-pagination>
        </div>
        <total-data :restFrom="restFrom" :restFromid="restFromid" :istype="dialogVisible" @dalogtype="dalogtype"></total-data>
      </div>
    </div>
  </div>
</template>

<script>
import { warehouseInventories } from "@/api/warehouse";
export default {
  data() {
    return {
      totalgoodshForm: {
        key: "",
        warehouse_id: "",
        position: "",
        sku_uid: "",
        specification: "",
        skip: 0,
        limit: 15,
      },
      numinfoForm: {
        key: "",
        warehouse_id: "",
        position: "",
        sku_uid: "",
        specification: "",
        skip: 0,
        limit: 10,
      },
      Totaldata: [],
      currentPage_to: 1,
      pageSize_to: 15,
      itemCount_to: 0,
      currentPage_info: 1,
      pageSize_info: 10,
      itemCount_info: 0,
      dialogVisible: false,
      numinfoData: [],
      restFrom: "",
      restFromid: "",
    };
  },
  watch: {
    currentPage_to(val) {
      this.totalgoodshForm.skip = (val - 1) * this.pageSize_to;
      this.totalgoodshForm.limit = this.pageSize_to;
      this.gettotaldata();
    },
    currentPage_info(val) {
      this.numinfoForm.skip = (val - 1) * this.pageSize_info;
      this.numinfoForm.limit = this.pageSize_info;
      this.getnuminfodata();
    },
    // dialogVisible(val){
    //   if(val == false){
    //     this.currentPage_info = 1
    //   }
    // }
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
    gettotaldata() {
      warehouseInventories(this.totalgoodshForm).then((res) => {
        this.Totaldata = res.items;
        this.itemCount_to = res.total;
      });
    },
    Searchlist() {
      this.gettotaldata();
    },
    numinfo(data) {
      this.dialogVisible = true;
      this.currentPage_info = 1;
      this.restFrom = data.specification;
      this.restFromid = data.sku_uid;
    },
    // getnuminfodata(){
    //   warehouseInventories(this.numinfoForm).then((res) => {
    //     this.numinfoData = res.items;
    //     this.itemCount_info = res.total
    //     console.log(this.numinfoData);
    //   });
    // }
    dalogtype() {
      this.dialogVisible = false;
    },
  },
  mounted() {
    this.gettotaldata();
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.searchbtn {
  display: flex;
  margin-bottom: 5px;
  align-items: center;
}
.numcss {
  display: inline-block;
  width: 100%;
  cursor: pointer;
  color: #409eff;
}
.bigbox {
  display: flex;
  > div:nth-child(1) {
    width: 15%;
  }
  > div:nth-child(2) {
    width: 85%;
  }
}
</style>
