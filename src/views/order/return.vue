<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span ="24">
            <el-form :inline="true" :model="searchForm">
              <el-form-item :label="$t('order.returnOrder')">
                <el-input v-model="searchForm.order_no" style="width: 250px" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('order.returnType')">
                <el-select v-model="searchForm.type" clearable>
                  <el-option
                    v-for="(item, k) in returnType"
                    :key="k"
                    :label="item"
                    :value="k">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('order.returnStatus')">
                <el-select v-model="searchForm.status" :placeholder="$t('order.commentType')" clearable>
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
                <el-table-column :label="$t('order.user')">
                  <template slot-scope="scope">
                    <div class="ui">{{scope.row.user_nick_name}}</div>
                    <div class="ui">{{scope.row.user_mobile}}</div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.returnType')">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.type === 2 ? 'success': ''">{{returnType[scope.row.type]}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('order.returnGoods')" width="350px">
                  <template  slot-scope="scope">
                    <div class="goods-item">
                      <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(scope.row.goods_item.sku_img)"  fit="cover"></el-image>
                      <div class="g-info">
                        <p><span>{{scope.row.goods_item.spu_name}}</span></p>
                        <p>
                          <span v-for="(v,k) in scope.row.goods_item.specifications"> {{k}}：<font>{{v}}</font></span>
                        </p>
                        <p>{{scope.row.goods_item.price}}X {{scope.row.goods_item.count}}</p>
                      </div>
                      <div class="clear"></div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="amount" :label="$t('order.returnPrice')">
                </el-table-column>
                <el-table-column prop="order_no" :label="$t('order.returnOrder')">
                </el-table-column>
                <el-table-column :label="$t('order.status')">
                  <template slot-scope="scope" >
                    <el-tag>{{orderStatus[scope.row.status]}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" :label="$t('order.returnTime')">
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
  import { orderAfterSales, orderAfterSalesOpt } from '@/api/order'
  export default {
    components: {
    },
    data() {
      const pz = 10
      return {
        returnType: [this.$t('tools.all'), this.$t('order.returnType1'), this.$t('order.returnType2')],
        orderStatus: [this.$t('tools.all'), this.$t('order.returnStatus1'), this.$t('order.returnStatus2'), this.$t('order.returnStatus3'), this.$t('order.returnStatus4'), this.$t('order.returnStatus5'),
          this.$t('order.returnStatus6')],
        searchForm: {
          type: 0,
          order_no: '',
          status: 0,
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
        orderAfterSalesOpt(this.expressOrder.id, { express_company: this.expressCompany, express_no: this.expressNo }).then(res => {
          this.$message.success(this.$t('order.expressTip'))
          this.submitDisabled = false
          this.getDataListFun()
          this.formEditDialog = false
        }).catch(() => {
          this.submitDisabled = false
        })
      },
      getDataListFun() {
        orderAfterSales(this.searchForm).then(res => {
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
