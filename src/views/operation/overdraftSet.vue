<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <!--添加-->
        <el-row class="topCss">
          <el-col :span="20">
            <el-form :inline="true" :model="searchForm">
              <el-form-item>
                <el-input v-model="searchForm.key" :placeholder="$t('operation.pleaseEnter')+$t('operation.keyWords')" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-switch
                  v-model="searchForm.overdraw"
                  :active-value="1"
                  :inactive-value="0"
                  :active-text="$t('operation.touzhiUser')"
                  :inactive-text="$t('warehouse.all')">
                </el-switch>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="24" style="height: calc(100vh - 235px)">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" height="calc(100% - 46px)" style="width: 100%">
              <el-table-column prop="login_name" :label="$t('operation.loginName')" width="120"></el-table-column>
              <el-table-column :label="$t('operation.img')">
                <template slot-scope="scope">
                  <el-popover v-if="scope.row.avatar" class="pointer"
                              placement="right"
                              title=""
                              trigger="click">
                    <img :src="imgUrl + scope.row.avatar" height="480"/>
                    <img slot="reference" :src="imgUrl + scope.row.avatar" style="margin-right:8px;max-height: 60px;max-width: 120px">
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="nation_code" :label="$t('operation.nationCode')" width="120"></el-table-column>
              <el-table-column prop="mail" :label="$t('operation.email')"></el-table-column>
              <el-table-column prop="mail" :label="$t('operation.touzhiInfo')">
                <template slot-scope="scope">
                  <div>{{$t('operation.whetherEnable')}}：{{scope.row.overdraw.on ? $t('sys.yes') : $t('sys.no')}}</div>
                  <div>{{$t('operation.zhouqi')}}：{{scope.row.overdraw.period}} {{$t('warehouse.day')}}</div>
                  <div>{{$t('operation.touzhiMoney')}}：{{scope.row.overdraw.max_money | price}}</div>
                  <div>{{$t('operation.useDate')}}：{{scope.row.overdraw.start_time_str}}</div>
                  <div>{{$t('operation.usedAmount')}}：{{scope.row.overdraw.use_money | price}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('operation.address')">
                <template slot-scope="scope">
                  {{scope.row.address.province}}{{scope.row.address.city}}{{scope.row.address.district}}{{scope.row.address.addr}}
                </template>
              </el-table-column>
              <el-table-column :label="$t('operation.gender')" width="120">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.sex === 0" type="danger">{{$t('operation.unknown')}}</el-tag>
                  <el-tag v-if="scope.row.sex === 1" type="success">{{$t('operation.male')}}</el-tag>
                  <el-tag v-if="scope.row.sex === 2" type="info">{{$t('operation.female')}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="gen_time" :label="$t('operation.registrationTime')" width="170"></el-table-column>
              <el-table-column :label="$t('tools.opt')" width="150" v-if="permissionCheck('opt')">
                <template slot-scope="scope">
                  <el-button type="text" @click="overdrawSet(scope.row)" size="small">{{$t('operation.overdrawSet')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <template v-if="itemCount !== 0">
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  @size-change="sizeChangeFunc"
                  @current-change="pageChangeFunc"
                  :current-page.sync="currentPage"
                  :page-size="10"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount">
                </el-pagination>
              </div>
            </template>
          </el-col>
        </el-row>
        <!--透支设置-->
        <el-dialog :title="$t('operation.overdrawSet')" :close-on-click-modal="false" :visible.sync="overdrawDialog" center width="500px" style="margin-top: 0vh">
          <el-form label-width="140px">
            <el-form-item :label="$t('operation.whetherEnable')">
              <el-switch
                v-model="overdrawForm.on"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item :label="$t('operation.zhouqi')">
              <el-input v-model.number="overdrawForm.period" clearable>
                <template slot="append">{{$t('warehouse.day')}}</template>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.touzhiMoney')">
              <price-input v-model="overdrawForm.max_money"></price-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="submitOverdraw" :disabled="disabledOverdraw"></confirm-button>
            <el-button @click="overdrawDialog = false" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { usersList, overdrawSet } from '@/api/operation'
  import { imgGetUrl } from '@/utils/serverConfig'
  export default {
    data() {
      return {
        searchForm: {
          skip: 0,
          limit: 10,
          key: '',
          overdraw: '' // 空所有 true 透支用户
        },
        userTime: [],
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        imgUrl: imgGetUrl + '?md5=',
        tableData: {
          loading: true,
          body: []
        },
        overdrawForm: {
          on: false,
          period: 10, // 周期 单位天
          max_money: 0 // 最大透支金额 单位分
        },
        overdrawDialog: false,
        disabledOverdraw: false,
        overdrawId: ''
      }
    },
    mounted() {
      this.getTableData()
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getTableData()
      }
    },
    methods: {
      overdrawSet(data) {
        this.overdrawDialog = true
        this.overdrawId = data.id
        this.overdrawForm = JSON.parse(JSON.stringify(data.overdraw))
      },
      submitOverdraw() {
        this.disabledOverdraw = true
        overdrawSet(this.overdrawId, this.overdrawForm).then(res => {
          if (res.meta === 0) {
            this.disabledOverdraw = false
            this.overdrawDialog = false
            this.$message.success(this.$t('operation.setSuccess'))
            this.getTableData()
          }
        })
      },
      sizeChangeFunc(val) {
        this.pageSize = val
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      getTableData() {
        usersList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      search() {
        this.currentPage = 1
        this.searchForm.skip = 0
        this.getTableData()
      },
      getKuaidi100Url(com, nu) {
        return `https://www.kuaidi100.com/chaxun?com=${com}&nu=${nu}`
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .topCss{
    width: 100%;
    display: flex;
    /*justify-content: space-between;*/
  }
</style>
