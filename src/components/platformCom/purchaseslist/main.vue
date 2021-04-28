<template>
  <div>
    <el-input readonly :placeholder="$t('warehouse.TipsMsg2')">
      <el-button slot="append" icon="el-icon-edit-outline" @click="showGoodsTable"></el-button>
    </el-input>
    <el-dialog :title="$t('warehouse.pulist')" width="80%" :visible.sync="dialogFormVisible" center append-to-body>
      <el-table :data="tableData" border stripe>
        <el-table-column prop="supplier_name" :label="$t('warehouse.supplier')" width="100"></el-table-column>
        <el-table-column :label="$t('warehouse.Purchasing')">
          <template slot-scope="scope">
            <table class="tabletitle">
                      <tr>
                        <th v-for="(item,k) in tabletitle" :key="k">{{item}}</th>
                      </tr>
                      <tr v-for="(val,k) in scope.row.skus" :key="k" @click="addpulist(scope.row,val,k)">
                        <td>{{val.name}}</td>
                        <td>{{val.origin}}</td>
                        <td>{{val.specification}}</td>
                        <td>{{val.barcode}}</td>
                        <td>{{val.unit_price | price}}</td>
                        <td>{{val.count}}</td>
                        <td>{{val.total_price | price}}</td>
                      </tr>
            </table>
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
        order_id: "",
        skip: 0,
        limit: 5,
      },
      currentPage: 1,
      pageSize: 5,
      itemCount: 0,
      dialogFormVisible: false,
      tableData: [],
      tabletitle:[
          this.$t('warehouse.name2'),
          this.$t('warehouse.PlaceofOrigin'),
          this.$t('warehouse.pecifications'),
          this.$t('warehouse.barCode'),
          this.$t('warehouse.price'),
          this.$t('warehouse.num'),
          this.$t('warehouse.allprice'),
        //   '操作'
        ]
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
        // console.log(res);
        this.tableData = res.items;
        this.itemCount = res.total
      });
    },
    confirmButton(data) {
      // console.log(data);
    },
    addpulist(data,val,k){
        this.dialogFormVisible = false
        this.$emit("dataid",data)
        this.$emit("getvalue",val)
        this.$emit("key",k)
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
</style>
