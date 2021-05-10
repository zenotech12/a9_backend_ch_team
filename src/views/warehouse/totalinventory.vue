<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <div class="rightbox">
        <el-table :data="Totaldata" border stripe style="width: 100%">
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="origin" label="产地"></el-table-column>
          <el-table-column prop="date" label="规格信息">
              <template slot-scope="scope">
                  {{textFilter(scope.row.specification)}}
              </template>
          </el-table-column>
          <el-table-column prop="barcode" label="条形码"></el-table-column>
          <el-table-column prop="unit_price" label="单价"></el-table-column>
          <el-table-column prop="count" label="数量"></el-table-column>
          <el-table-column prop="warehouse_name" label="仓库名称"></el-table-column>
        </el-table>
        <div style="text-align: right;margin-top: 10px">
            <el-pagination
                :current-page.sync="currentPage_to"
                :page-size="pageSize_to"
                layout="total, prev, pager, next, jumper"
                :total="itemCount_to">
            </el-pagination>
        </div>
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
        skip: 0,
        limit: 15,
      },
      Totaldata: [],
      currentPage_to: 1,
      pageSize_to: 15,
      itemCount_to: 0,
    };
  },
  watch: {
        currentPage_to(val) {
            this.totalgoodshForm.skip = (val - 1) * this.pageSize_to
            this.totalgoodshForm.limit = this.pageSize_to
            this.gettotaldata()
        },
  },
  methods: {
      textFilter(data) {
      let index = data.indexOf('{')
      if(index != -1){
        let str = ''
        const text = JSON.parse(data)
        Object.keys(text).forEach((v, i) => {
          if (i === 0) {
            str = v + ':' + text[v] + ';'
          } else {
            str = str + v + ':' + text[v] + ';'
          }
        })
        return str
      }else{
        return data
      }
    },
    gettotaldata() {
      warehouseInventories(this.totalgoodshForm).then((res) => {
        this.Totaldata = res.items;
        this.itemCount_to = res.total
        console.log(this.Totaldata);
      });
    },
  },
  mounted() {
    this.gettotaldata();
  },
  created() {},
};
</script>
<style lang="scss" scoped>
</style>