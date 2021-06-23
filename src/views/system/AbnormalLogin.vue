<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="name" label="登录地址">
          <template slot-scope="scope">
            {{scope.row.login_addr.country_long}} -
            {{scope.row.login_addr.region}} -
            {{scope.row.login_addr.city}}
          </template>
        </el-table-column>
        <el-table-column prop="gen_time" label="登录时间"></el-table-column>
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
  </div>
</template>

<script>
import { AbnormalLogin } from "@/api/system";
export default {
  data() {
    return {
      searchForm: {
        skip: 0,
        limit: 10,
      },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      itemCount: 0,
    };
  },
  mounted() {
    this.getAbnormalLogin();
  },
  watch: {
    currentPage(val) {
      this.searchForm.skip = (val - 1) * this.pageSize
      this.searchForm.limit = this.pageSize
      this.getAbnormalLogin()
    },
  },
  methods: {
    getAbnormalLogin() {
      AbnormalLogin(this.searchForm).then((res) => {
        this.tableData = res.items;
        this.itemCount = res.total
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
