<template>
  <div>
    <el-input readonly :placeholder="$t('warehouse.TipsMsg2')">
      <el-button slot="append" icon="el-icon-edit-outline" @click="showGoodsTable"></el-button>
    </el-input>
    <el-dialog width="90%" :visible.sync="dialogFormVisible" center append-to-body>
      <span slot="title" style="font-weight: bold; font-size: 15px">{{$t('warehouse.pulist')}}</span>
       <div class="searchbtn" style="margin-bottom: 15px">
          <el-input v-model="searchFrom.no" style="margin-right: 10px; width: 400px" clearable></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="Searchlist"></el-button>
        </div>
      <el-table :data="tableData" border stripe ref="singleTable" highlight-current-row height="calc(100vh - 420px)"  @current-change="handleCurrentChange">
          <el-table-column label="#" width="60px" align="center">
            <template slot-scope="scope">
              {{scope.$index + searchFrom.skip + 1}}
            </template>
          </el-table-column>
        <el-table-column prop="no" :label="$t('warehouse.number')" width="150" align="center"></el-table-column>
        <!-- <el-table-column prop="status" :label="$t('warehouse.type')" width="50"></el-table-column> -->
        <el-table-column prop="supplier_name" :label="$t('warehouse.supplier')" width="200"></el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-row style="width: 100%">
              <el-col :span="8">{{$t('warehouse.name2')}}</el-col>
              <el-col :span="3" style="text-align: center">{{$t('warehouse.PlaceofOrigin')}}</el-col>
              <el-col :span="4" style="text-align: center">{{$t('warehouse.pecifications')}}</el-col>
              <el-col :span="3" style="text-align: center">{{$t('warehouse.barCode')}}</el-col>
              <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{$t('warehouse.price')}}</el-col>
              <el-col :span="2" style="text-align: center">{{$t('warehouse.num')}}</el-col>
              <!--<el-col :span="2" style="text-align: center">{{$t('warehouse.arrive_count')}}</el-col>-->
              <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{$t('warehouse.allprice')}}</el-col>
            </el-row>
          </template>
          <template slot-scope="scope">
            <div class="goods">
              <el-row v-for="(item, k) in scope.row.skus" :key="k" class="odd" style="width: 100%; padding: 10px 0">
                <el-col :span="8" class="overOmitted"><span :title="item.name">{{item.name}}</span></el-col>
                <el-col :span="3" style="text-align: center;">{{item.origin !== '' ? item.origin : 'No' }}</el-col>
                <el-col :span="4" style="text-align: center">{{textFilter(item.specification) !== '' ? textFilter(item.specification) : 'No'}}</el-col>
                <el-col :span="3" style="text-align: center">{{item.barcode !== '' ? item.barcode : 'No'}}</el-col>
                <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{item.unit_price | price}}</el-col>
                <el-col :span="2" style="text-align: center">{{item.count}}</el-col>
                <!--<el-col :span="2" style="text-align: center">{{item.arrive_count}}</el-col>-->
                <el-col :span="2" v-if="permissionCheck('opt', '9_3')" style="text-align: center">{{item.total_price | price}}</el-col>
              </el-row>
            </div>
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
      <!-- <div class="conbtn">
        <el-button size="small" @click="confgBtn()" type="success">{{$t('tools.confirm')}}</el-button>
      </div> -->

      <div slot="footer" class="dialog-footer">
        <el-button type="success" size="small" @click="confgBtn()">{{
          $t("tools.confirm")
        }}</el-button>
        <el-button @click="dialogFormVisible = false" size="small">{{
          $t("tools.cancel")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { purchaseList } from "@/api/warehouse";
export default {
  name: "purchasesList",
  data() {
    return {
      searchFrom: {
        order_id: '',
        skip: 0,
        limit: 10,
        no: '',
        status: 3
      },
      currentPage: 1,
      pageSize: 10,
      itemCount: 0,
      dialogFormVisible: false,
      tableData: [],
      data: '',
      val: '',
      key: '',
    };
  },

  watch: {
    currentPage(val) {
        this.searchFrom.skip = (val - 1) * this.pageSize
        this.searchFrom.limit = this.pageSize
        this.getpulidtdata()
      }
  },
  mounted() {
    this.getpulidtdata();
  },
  methods: {
    showGoodsTable() {
      this.dialogFormVisible = true;
    },
    getpulidtdata() {
      purchaseList(this.searchFrom).then((res) => {
        this.tableData = res.items
        this.itemCount = res.total
      });
    },
    confirmButton(data) {

    },
    handleCurrentChange(data, val, k) {
      // this.$emit("dataid", data)
      this.data = data
      // this.$emit("getvalue", val)
      this.val = val
      // this.$emit("key", k)
      this.k = k
    },
    setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
    confgBtn(){
      this.dialogFormVisible = false
      this.$emit("dataid", this.data)
      this.$emit("getvalue", this.val)
      this.$emit("key", this.key)
      this.setCurrent()
    },
    Searchlist(){
      this.getpulidtdata()
    }
  },
};
</script>

<style lang="scss" scoped>
.tabletitle{
  width: 100%;
  border: 1px solid #f2f2f2;
  border-collapse: collapse;
  td{
    width: 100px;
    border: 1px solid #f2f2f2;
  }
  th{
    text-align: center;
  }
}
.goods{
  .odd{
    border-top: 1px solid #ccc;
    &:first-child{
      border: 0 none;
    }
  }
}
.conbtn{
  width: 100%;
  text-align: right;
}
.searchbtn{
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
</style>
