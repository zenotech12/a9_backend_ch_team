<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span ="24">
            <el-form :inline="true" :model="searchForm">
              <el-form-item>
                <el-select v-model="searchForm.order_status" :placeholder="$t('order.commentType')">
                  <el-option
                    v-for="(item, k) in orderStatus"
                    :key="k"
                    :label="item"
                    :value="k">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="searchBtn">
                <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)">
                <el-table-column prop="id" :label="$t('order.id')" width="200px"></el-table-column>
                <el-table-column :label="$t('order.user')">
                  <template slot-scope="scope">
                    <div class="ui">{{scope.row.user_nick_name}}</div>
                    <div class="ui">{{scope.row.user_mobile}}</div>
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('order.goods')" width="350px">
                  <template  slot-scope="scope">
                    <div class="goods-item" v-for="(gInfo,k) in scope.row.merchant_item.goods_items" :key="k">
                      <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(gInfo.goods_info.sku_img)"  fit="cover"></el-image>
                      <div class="g-info">
                        <p><span>{{gInfo.goods_info.spu_name}}</span></p>
                        <p>
                          <span v-for="(v,k) in gInfo.goods_info.specifications"> {{k}}：<font>{{v}}</font></span>
                        </p>
                        <p>{{gInfo.goods_info.price}}X {{gInfo.goods_info.count}}</p>
                      </div>
                      <div class="clear"></div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.price')">
                  <template slot-scope="scope" >
                    {{scope.row.goods_price}} + {{scope.row.postage}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.address')">
                  <template slot-scope="scope" >
                    {{scope.row.shipping_address.address.province + scope.row.shipping_address.address.city + scope.row.shipping_address.address.district}}<br/>
                    {{scope.row.shipping_address.address.addr}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.status')">
                  <template slot-scope="scope" >
                    <el-tag>{{orderStatus[scope.row.status]}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" :label="$t('order.genTime')">
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "140">
                  <template slot-scope="scope">
                      <el-button type="text" @click="showExpressEditor(scope.row)" size="small">{{$t('order.express')}}</el-button>
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
            </div>
          </el-col>
        </el-row>
        <el-dialog :title="$t('order.express')" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px">
            <el-form-item :label="$t('order.id')">
              {{expressOrder.id}}
            </el-form-item>
            <el-form-item :label="$t('order.address')">
              {{expressOrder.shipping_address.address.province + expressOrder.shipping_address.address.city + expressOrder.shipping_address.address.district}}<br/>
              {{expressOrder.shipping_address.address.addr}}<br/>
              {{expressOrder.shipping_address.mobile}} {{expressOrder.shipping_address.contacter_name}}
            </el-form-item>
            <el-form-item :label="$t('order.expressCompany')">
              <el-input v-model="expressCompany" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('order.expressNo')">
              <el-input v-model="expressNo" clearable></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { ordersList, ordersExpress } from '@/api/order'
  export default {
    components: {
    },
    data() {
      const pz = 10
      return {
        orderStatus: [this.$t('tools.all'), this.$t('order.status1'), this.$t('order.status2'), this.$t('order.status3'), this.$t('order.status4'), this.$t('order.status5'),
          this.$t('order.status6'), this.$t('order.status7'), this.$t('order.status8')],
        searchForm: {
          user_id: '',
          order_status: 0,
          skip: '',
          limit: pz
        },
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        expressCompany: '',
        expressNo: '',
        expressOrder: { shipping_address: { address: {}}},
        formEditDialog: false,
        submitDisabled: false
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      }
    },
    methods: {
      showExpressEditor(data) {
        this.expressOrder = data
        this.expressCompany = ''
        this.expressNo = ''
        this.formEditDialog = true
      },
      saveDataFunc() {
        this.submitDisabled = true
        ordersExpress(this.expressOrder.id, { express_company: this.expressCompany, express_no: this.expressNo }).then(res => {
          this.$message.success(this.$t('order.expressTip'))
          this.submitDisabled = false
          this.getDataListFun()
          this.formEditDialog = false
        }).catch(() => {
          this.submitDisabled = false
        })
      },
      getDataListFun() {
        ordersList(this.searchForm).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
        })
      },
      search() {
        this.getDataListFun()
      }
    },
    mounted() {
      this.getDataListFun()
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
  .rate-item{
    span{
      display: inline-block;
      width: 70px;
      text-align: right;
    }
    .rate{
      display: inline-block !important;
    }
  }
  .goods-item{
    border-bottom: 1px solid #e4e4e4;
    margin-bottom: 5px;
    clear: both;
    &:last-child {
      border-bottom: none;
      margin-bottom: 0px;
    }
    .image{
      float: left !important;
      margin-right: 5px !important;
    }
    .g-info{
      text-align: left;
      p{
        margin: 0px;
        padding: 3px 0px;
      }
    }
    .clear{
      clear: both;
    }
  }
  .ui{
    text-align: left;
    line-height: 25px;
  }
</style>
