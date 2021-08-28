<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column prop="name" width="300" show-overflow-tooltip :label="$t('goods.name')"></el-table-column>
        <el-table-column prop="name" :label="$t('operation.loginaddrs')">
          <template slot-scope="scope" width="300">
           <div>
              {{scope.row.login_addr.country_long}} -
              {{scope.row.login_addr.region}} -
              {{scope.row.login_addr.city}}
            </div>
            <div>
              {{scope.row.login_addr.lat}} - 
              {{scope.row.login_addr.lng}} 
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" width="400" :label="$t('operation.Lastaddress')">
          <template slot-scope="scope">
            <div>
              {{scope.row.old_addr.country_long}} -
              {{scope.row.old_addr.region}} -
              {{scope.row.old_addr.city}}
            </div>
             <div>
              {{scope.row.old_addr.lat}} - 
              {{scope.row.old_addr.lng}} 
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="old_ip" width="150" :label="$t('operation.Lastip')"></el-table-column>
        <el-table-column prop="new_ip" width="150" :label="$t('operation.Thisip')"></el-table-column>
        <el-table-column prop="gen_time" width="200" :label="$t('lang.loginTime')"></el-table-column>
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
