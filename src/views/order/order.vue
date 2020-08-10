<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24">
            <el-tabs style="height: 40px" v-model="tab_order_status">
              <el-tab-pane style="height: 44px" v-for="(item, k) in orderStatusTab" :key="k" v-if="item" :label="item.label" :name="item.value"></el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span ="24">
            <el-form :inline="true" :model="searchForm">
              <el-form-item :label="$t('order.searchKey')">
                <el-input v-model="searchForm.key" :placeholder="$t('order.searchKeyTip')" style="width: 250px" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('order.no')">
                <el-input v-model="searchForm.no" style="width: 250px" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('order.orderTime')">
                <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable
                  v-model="orderTimes"
                  type="daterange"
                  align="right"
                  unlink-panels
                  :range-separator="$t('tools.to')"
                  :start-placeholder="$t('tools.startDate')"
                  :end-placeholder="$t('tools.endDate')">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
                <template v-if="permissionCheck('opt')">
                  <el-button type="primary" @click="exportFunc([])" size="small" icon="el-icon-download"></el-button>
                  <el-upload style="display: inline-block" name="excel" :headers="fileUploadHeader"
                    :action= "importUrl"
                    :show-file-list="false"
                    :on-success="importSuccess" :on-error="importError">
                    <el-button type="primary" size="small" icon="el-icon-upload2"></el-button>
                  </el-upload>
                </template>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 225px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)" @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column :label="$t('order.no')" width="200px" fixed="left">
                  <template slot-scope="scope">
                    <el-tag style="display: block; width: 50px; margin: 0 auto" v-if="scope.row.type===2" size="mini">{{$t('order.orderType2')}}</el-tag>
                    <el-tag style="display: block; width: 60px; margin: 0 auto" v-if="scope.row.type===3" size="mini">{{$t('order.orderType3')}}</el-tag>
                    <el-tag style="display: block; width: 60px; margin: 0 auto" v-if="scope.row.type===4" size="mini">{{$t('order.orderType4')}}</el-tag>
                    {{scope.row.no}}<br/>
                    <el-popover v-if="scope.row.comment || (scope.row.merchant_comments && scope.row.merchant_comments.length > 0)" placement="right" width="300" trigger="click">
                      <template v-if="scope.row.comment">
                        <el-divider content-position="left">{{$t('order.userBz')}}</el-divider>
                        <div style="padding: 0px 10px; text-align: left">
                          {{scope.row.comment}}
                        </div>
                      </template>
                      <template v-if="scope.row.merchant_comments && scope.row.merchant_comments.length > 0">
                        <el-divider content-position="left">{{$t('order.businessBz')}}</el-divider>
                        <el-timeline style="margin-top: 10px">
                          <el-timeline-item
                            v-for="(comments, index) in scope.row.merchant_comments"
                            :key="index"
                            :timestamp="comments.gen_time">
                            <div class="ui"><span>{{comments.operator_name}}</span>{{comments.comment}}</div>
                          </el-timeline-item>
                        </el-timeline>
                      </template>
                      <a slot="reference" class="gt">{{$t('order.note')}}<i class="el-icon-arrow-right"></i></a>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.user')" width="130">
                  <template slot-scope="scope">
                    <div class="ui">{{scope.row.user_nick_name}}</div>
                    <div class="ui">{{scope.row.user_mobile}}</div>
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('order.goods')" min-width="400">
                  <template  slot-scope="scope">
                    <a target="_blank" :href="goodsPreview(gInfo.goods_info)" class="goods-item" v-for="(gInfo,k) in scope.row.merchant_item.goods_items" :key="k">
                      <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(gInfo.goods_info.sku_img, 100)"  fit="cover"></el-image>
                      <div class="g-info">
                        <p>{{gInfo.goods_info.spu_name}}<el-tag v-if="gInfo.goods_info.gift" size="mini">{{$t('order.gift')}}</el-tag>
                          <el-tag v-if="gInfo.after_saled" style="cursor: pointer" type="danger" size="mini" @click.prevent="showReturn(scope.row)">{{$t('order.afterSale')}}</el-tag>
                        </p>
                        <p>
                          <span v-for="(v,k) in gInfo.goods_info.specifications"> {{k}}：<font>{{v}}</font></span>
                        </p>
                        <p><span>{{$t('order.price3')}}：</span><template v-if="scope.row.type === 3">{{gInfo.goods_info.price}}</template><template v-else>{{gInfo.goods_info.price | price}}</template>；<span>{{$t('order.number')}}：</span>{{gInfo.goods_info.count}}</p>
                      </div>
                      <div class="clear"></div>
                    </a>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.price')" width="130">
                  <template slot-scope="scope" >
                    <span :title="$t('order.price1') + '+' + $t('order.price2')"><template v-if="scope.row.pay_points > 0"> *{{scope.row.pay_points}}+</template> {{scope.row.pay_price | price}}</span><span v-if="scope.row.pay_way">({{scope.row.pay_way}})</span><br/>
                    <span>({{$t('order.includePostage')}}：{{scope.row.postage | price}})</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.address')" style="text-align: left" min-width="300">
                  <template slot-scope="scope" >
                    <div class="ui">
                      <span>{{$t('order.expressAddr')}}：</span>
                      {{scope.row.shipping_address.address.province + scope.row.shipping_address.address.city + scope.row.shipping_address.address.district}}
                      {{scope.row.shipping_address.address.addr}}
                    </div>
                    <div class="ui">
                      <span>{{$t('order.expressUser')}}：</span>
                      {{scope.row.shipping_address.contacter_name}}&nbsp;&nbsp;
                      {{scope.row.shipping_address.mobile}}
                    </div>
                    <div class="ui" v-if="scope.row.express.novar">
                      <span>{{$t('order.expressNo')}}：</span>
                      <el-popover placement="left" width="300" trigger="click" v-if="scope.row.express.company === 'zto' || scope.row.express.company === 'rider'">
                        <div v-if="expressInfo && !showOrderStatus">
                          <el-timeline style="margin-top: 10px" v-if="expressInfo.length > 0">
                            <el-timeline-item
                              v-for="(record, index) in expressInfo"
                              :key="index"
                              :timestamp="record.time">
                              <div class="ui"><span>{{record.message}}</span></div>
                            </el-timeline-item>
                          </el-timeline>
                          <p v-else style="color: #333; font-size: 14px; text-align: center; font-weight: bold">{{$t('order.zwddwl')}}</p>
                        </div>
                        <div v-if="showOrderStatus">
                          <el-timeline style="margin-top: 10px">
                            <el-timeline-item
                              v-for="(record, index) in scope.row.operation_records"
                              :key="index"
                              :timestamp="record.time">
                              <div class="ui"><span>{{record.operator_name}}</span>{{optArr[record.status]}}</div>
                            </el-timeline-item>
                          </el-timeline>
                        </div>
                        <a @click="clickStatus(scope.row)" slot="reference">
                          {{expressageList[scope.row.express.company]}}&nbsp;&nbsp;{{scope.row.express.novar}}
                          <i class="el-icon-arrow-right"></i>
                        </a>
                      </el-popover>
                      <a v-else target="_blank" :href="getKuaidi100Url(scope.row.express.company, scope.row.express.novar)">
                        {{expressageList[scope.row.express.company]}}&nbsp;&nbsp;{{scope.row.express.novar}}
                        <i class="el-icon-arrow-right"></i>
                      </a>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.status')" width="90">
                  <template slot-scope="scope">
                    <el-tag >{{orderStatus[scope.row.status]}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.genTime')" width="180">
                  <template slot-scope="scope" >
                    <el-popover placement="left" width="300" trigger="click">
                      <el-timeline style="margin-top: 10px">
                        <el-timeline-item
                          v-for="(record, index) in scope.row.operation_records"
                          :key="index"
                          :timestamp="record.time">
                          <div class="ui"><span>{{record.operator_name}}</span>{{optArr[record.status]}}</div>
                        </el-timeline-item>
                      </el-timeline>
                      <a slot="reference" class="gt"><i class="el-icon-arrow-left"></i>{{scope.row.gen_time}}</a>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "100" fixed="right"  v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.status === 4 || scope.row.status === 5" type="text" @click="showExpressEditor(scope.row,1)" size="small">
                      {{scope.row.status === 4 ? $t('order.modifyExpress') : $t('order.express')}}
                    </el-button>
                    <el-button v-if="scope.row.status === 2" type="text" @click="showExpressEditor(scope.row,2)" size="small">
                      {{$t('order.modifyPrice')}}
                    </el-button>
                    <el-button v-if="scope.row.status === 2 || scope.row.status === 5"  type="text" @click="showExpressEditor(scope.row,3)" size="small" style="margin-left: 0">
                      {{$t('order.changeAddress')}}
                    </el-button>
                    <el-button v-if="scope.row.status !== 7"  type="text" @click="showExpressEditor(scope.row,4)" size="small" style="margin-left: 0">
                      {{$t('order.price4Note')}}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="margin-top: 10px">
                <el-col :span="6">
                  <el-button  v-if="permissionCheck('opt')" size="mini" @click="batchExportFunc">{{$t('tools.export')}}</el-button>
                  &nbsp;
                </el-col>
                <el-col :span="18" style="text-align: right;">
                  <el-pagination
                    :current-page.sync="currentPage"
                    :page-size.sync="pageSize"
                    :page-sizes="[10, 30, 50, 100, 500]"
                    layout="total, prev, pager, next, jumper,sizes"
                    :total="itemCount">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-dialog :title="dialogTitle" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px">
            <el-form-item :label="$t('order.no')">
              {{expressOrder.no}}
            </el-form-item>
            <el-form-item :label="$t('order.user')">
              {{expressOrder.user_nick_name}}&nbsp;{{expressOrder.user_mobile}}
            </el-form-item>
            <el-form-item :label="$t('order.goods')"  v-if="expressOrder.merchant_item">
              <div class="goods-item" v-for="(gInfo,k) in expressOrder.merchant_item.goods_items" :key="k">
                <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(gInfo.goods_info.sku_img, 100)"  fit="cover"></el-image>
                <div class="g-info">
                  <p>{{gInfo.goods_info.spu_name}}<el-tag v-if="gInfo.goods_info.gift" size="mini">{{$t('order.gift')}}</el-tag></p>
                  <p>
                    <span v-for="(v,k) in gInfo.goods_info.specifications"> {{k}}：<font>{{v}}</font></span>
                  </p>
                  <p><span>{{$t('order.price3')}}：</span>{{gInfo.goods_info.price | price}}；<span>{{$t('order.number')}}：</span>{{gInfo.goods_info.count}}</p>
                </div>
                <div class="clear"></div>
              </div>
            </el-form-item>
            <el-form-item :label="$t('order.price')">
              {{expressOrder.pay_price | price}}（{{$t('order.price1') + '：' }}{{expressOrder.goods_price | price}}；{{$t('order.price2') + '：'}}{{expressOrder.postage | price}}）
            </el-form-item>
            <el-form-item :label="$t('order.address')">
              {{expressOrder.shipping_address.address.province + expressOrder.shipping_address.address.city + expressOrder.shipping_address.address.district}}&nbsp;{{expressOrder.shipping_address.address.addr}}
              <br/>
              {{expressOrder.shipping_address.contacter_name}}&nbsp;&nbsp;{{expressOrder.shipping_address.mobile}}
            </el-form-item>
            <el-form-item :label="$t('order.userBz')">
              {{userComment}}
            </el-form-item>
            <el-form-item :label="$t('order.businessBz')" v-if="expressOrder.merchant_comments && expressOrder.merchant_comments.length > 0">
              <el-timeline style="margin-top: 10px">
                <el-timeline-item
                  v-for="(comments, index) in expressOrder.merchant_comments"
                  :key="index"
                  :timestamp="comments.gen_time">
                  <div class="ui"><span>{{comments.operator_name}}</span>{{comments.comment}}</div>
                </el-timeline-item>
              </el-timeline>
            </el-form-item>
            <el-form-item :label="$t('order.note')" >
              <el-input  type="textarea"  :rows="2"  v-model="comment" clearable :placeholder="$t('order.note')"></el-input>
            </el-form-item>
            <template v-if="optType === 1">
              <el-form-item :label="$t('order.expressInfo')" >
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-select v-model="expressCompany" :disabled="expressOrder.rider_post" :placeholder="$t('order.expressCompany')">
                      <el-option
                        v-for="(item, k) in expressageList"
                        :key="k"
                        v-if="k !== 'rider' || (k === 'rider' && expressOrder.rider_post) "
                        :label="item"
                        :value="k">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="14" v-if="expressCompany !== 'noexpress' && !expressOrder.rider_post">
                    <el-input v-model="expressNo" clearable :placeholder="$t('order.expressNo')"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
<!--              <el-form-item :label="$t('order.note')" >-->
<!--                <el-input  type="textarea"  :rows="2"  v-model="comment" clearable :placeholder="$t('order.note')"></el-input>-->
<!--              </el-form-item>-->
            </template>
            <template v-if="optType === 2">
              <el-form-item :label="$t('order.price4')" >
                <price-input v-model="payPrice" :placeholder="$t('order.price4')" style="width: 200px"></price-input> <span style="color: #8c939d">{{$t('order.price4Tip')}}</span>
              </el-form-item>
<!--              <el-form-item :label="$t('order.price4Note')" >-->
<!--                <el-input  type="textarea"  :rows="2"  v-model="comment" clearable :placeholder="$t('order.price4Note')"></el-input>-->
<!--              </el-form-item>-->
            </template>
            <template v-if="optType === 3">
              <p>{{$t('order.userChangeAdd')}}</p>
<!--              <div style="display: flex">-->
                <el-form-item :label="$t('order.province')" style="display: inline-block" >
                  <el-input v-model="province" :placeholder="$t('order.province')" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item :label="$t('order.city')"  style="display: inline-block">
                  <el-input v-model="city" :placeholder="$t('order.city')" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item :label="$t('order.area')" style="display: inline-block">
                  <el-input v-model="area" :placeholder="$t('order.area')" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item :label="$t('order.addr')" style="display: inline-block" >
                  <el-input v-model="addr" :placeholder="$t('order.addr')" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item :label="$t('order.userName')" style="display: inline-block" >
                  <el-input v-model="userName" :placeholder="$t('order.userName')" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item :label="$t('order.userPhone')" style="display: inline-block" >
                  <el-input v-model="userPhone" :placeholder="$t('order.userPhone')" style="width: 200px"></el-input>
                </el-form-item>
<!--              </div>-->
            </template>
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
  import { ordersList, ordersCount, ordersExpress, ordersPriceModify, exportOrder, changeMerchantComment, changeShippingAddress, getExpressInfo } from '@/api/order'
  import expressage from '@/utils/expressage'
  import serverConfig from '@/utils/serverConfig'
  import store from '@/store'
  export default {
    components: {
    },
    data() {
      const pz = 10
      return {
        optArr: { 2: this.$t('order.opt2'), 4: this.$t('order.opt4'), 5: this.$t('order.opt5'), 6: this.$t('order.opt6'), 7: this.$t('order.opt7'), 8: this.$t('order.opt8'), 9: this.$t('order.opt9') },
        orderStatus: [this.$t('tools.all'), this.$t('order.status1'), this.$t('order.status2'), this.$t('order.status3'), this.$t('order.status4'), this.$t('order.status5'),
          this.$t('order.status6'), this.$t('order.status7'), this.$t('order.status8'), '', this.$t('order.status10')],
        orderStatusTab: [{ value: '0', label: this.$t('tools.all') }, { value: '2', label: this.$t('order.status2') }, { value: '5', label: this.$t('order.status5') }, { value: '4', label: this.$t('order.status4') }, { value: '8', label: this.$t('order.status8') },
          { value: '10', label: this.$t('order.status10') }, { value: '7', label: this.$t('order.status7') }],
        searchForm: {
          key: '',
          user_id: '',
          order_status: 0,
          no: '',
          skip: 0,
          limit: pz,
          bt: '',
          et: ''
        },
        tab_order_status: '0',
        orderTimes: [],
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        expressCompany: '',
        expressNo: '',
        editorTitle: '',
        optType: 1,
        dialogTitle: this.$t('order.express'),
        expressOrder: { shipping_address: { address: {}}},
        formEditDialog: false,
        submitDisabled: false,
        expressageList: expressage,
        payPrice: 0,
        comment: '',
        importUrl: serverConfig.api_url + '/app/v1/merchant/orders-import',
        fileUploadHeader: { 'X-Access-Token': store.state.user.token },
        multipleSelection: [],
        userComment: '',
        province: '',
        city: '',
        area: '',
        addr: '',
        area_code: '',
        userName: '',
        userPhone: '',
        expressInfo: [],
        pageX: '',
        pageY: '',
        showOrderStatus: false,
        expressRiderInfo: []
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      tab_order_status(val) {
        if (this.searchForm.skip !== 0 || this.searchForm.order_status !== parseInt(val)) {
          // console.log(this.searchForm, 'gg', val)
          // console.log(this.searchForm.skip, this.searchForm.skip !== 0, 'gg', this.searchForm.order_status !== parseInt(val))
          this.searchForm.skip = 0
          this.searchForm.limit = this.pageSize
          this.searchForm.order_status = parseInt(val)
          this.getDataListFun()
        }
      },
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      },
      pageSize(val) {
        this.searchForm.skip = 0
        this.searchForm.limit = val
        this.getDataListFun()
      },
      orderTimes(val) {
        if (val && val.length === 2) {
          this.searchForm.bt = val[0]
          this.searchForm.et = val[1]
        } else {
          this.searchForm.bt = ''
          this.searchForm.et = ''
        }
      }
    },
    methods: {
      getOrderCount() {
        const statuses = [0, 2, 4, 5, 7, 8, 10]
        ordersCount({ 'statuses': JSON.stringify(statuses) }).then(res => {
          if (res.meta === 0) {
            res.items.forEach(item => {
              this.orderStatusTab.forEach((Z, k) => {
                if (Z.value === item.order_status.toString()) {
                  this.orderStatusTab[k].label = this.orderStatusTab[k].label + '(' + item.order_count + ')'
                }
              })
            })
          }
        })
      },
      goodsPreview(row) {
        return 'https://www.a9kh.com/goods/' + row.spu_id + '.html'
        // this.currentGoods = appUrl + '/goods/info?id=' + row.id
        // this.commodityPreviewShow = true
      },
      clickStatus(data) {
        const info = {
          no: data.express.novar,
          company: data.express.company
        }
        if (data.express.company === 'zto') {
          getExpressInfo(info).then(res => {
            this.showOrderStatus = false
            this.expressInfo = res.items
          })
        }
        if (data.express.company === 'rider') {
          this.showOrderStatus = true
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = []
        val.forEach(item => {
          this.multipleSelection.push(item.id)
        })
      },
      showReturn(row) {
        this.$router.push({ name: 'returnList', params: { order_no: row.no }})
      },
      importSuccess(res) {
        this.$message.success(res.error)
        this.getDataListFun()
      },
      importError(res) {
        this.$message.error(res.error)
      },
      batchExportFunc() {
        if (this.multipleSelection.length < 1) {
          this.$message.error(this.$t('order.batchExportTip'))
          return
        }
        this.exportFunc(this.multipleSelection)
      },
      exportFunc(ids) {
        const sf = JSON.parse(JSON.stringify(this.searchForm))
        sf.skip = 0
        sf.limit = 1000
        sf.ids = JSON.stringify(ids)
        exportOrder(sf).then(res => {
          window.location = res.url
        })
      },
      getKuaidi100Url(com, nu) {
        if (com === 'rider') {
          return 'javascript:void(0)'
        } else {
          return `https://www.kuaidi100.com/chaxun?com=${com}&nu=${nu}`
        }
      },
      showExpressEditor(data, ot) {
        this.expressOrder = data
        this.optType = ot
        if (ot === 1) {
          this.dialogTitle = this.$t('order.express')
          this.expressCompany = data.express.company ? data.express.company : (this.expressOrder.rider_post ? 'rider' : '')
          this.expressNo = data.express.novar
          this.comment = data.merchant_comment
          this.userComment = data.comment
        } else if (ot === 2) {
          this.dialogTitle = this.$t('order.modifyPrice')
          this.payPrice = data.pay_price
          this.comment = data.merchant_comment
          this.userComment = data.comment
        } else if (ot === 3) {
          this.dialogTitle = this.$t('order.changeAddress')
          this.userComment = data.comment
          this.comment = data.merchant_comment
          this.province = data.shipping_address.address.province
          this.city = data.shipping_address.address.city
          this.area = data.shipping_address.address.district
          this.addr = data.shipping_address.address.addr
          this.area_code = data.shipping_address.area_code
          this.userName = data.shipping_address.contacter_name
          this.userPhone = data.shipping_address.mobile
        } else if (ot === 4) {
          this.dialogTitle = this.$t('order.price4Note')
          this.userComment = data.comment
          this.comment = data.merchant_comment
        }
        this.formEditDialog = true
      },
      saveDataFunc() {
        this.submitDisabled = true
        if (this.optType === 1) {
          ordersExpress(this.expressOrder.id, { express_company: this.expressCompany, express_no: this.expressNo, comment: this.comment }).then(res => {
            this.$message.success(this.$t('order.expressTip'))
            this.submitDisabled = false
            this.getDataListFun()
            this.formEditDialog = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else if (this.optType === 2) {
          ordersPriceModify(this.expressOrder.id, { pay_price: this.payPrice, comment: this.comment }).then(res => {
            this.$message.success(this.$t('order.price4Tip1'))
            this.submitDisabled = false
            this.getDataListFun()
            this.formEditDialog = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else if (this.optType === 3) {
          const data = {
            province: this.province,
            city: this.city,
            district: this.area,
            addr: this.addr,
            area_code: this.area_code,
            contacter_name: this.userName,
            mobile: this.userPhone,
            lng: this.expressOrder.shipping_address.lng,
            lat: this.expressOrder.shipping_address.lat
          }
          changeShippingAddress(this.expressOrder.id, data).then(res => {
            this.$message.success(this.$t('order.changeS'))
            this.submitDisabled = false
            this.getDataListFun()
            this.formEditDialog = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else if (this.optType === 4) {
          changeMerchantComment(this.expressOrder.id, { merchant_comment: this.comment }).then(res => {
            this.$message.success(this.$t('order.changeS'))
            this.submitDisabled = false
            this.getDataListFun()
            this.formEditDialog = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
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
      console.log(this.$route)
      this.searchForm.order_status = this.$route.params.order_status ? this.$route.params.order_status : 0
      this.tab_order_status = this.searchForm.order_status + ''
      if (this.$route.params.bt || this.$route.params.et) {
        this.orderTimes = [this.$route.params.bt, this.$route.params.et]
      }
      this.getOrderCount()
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
      padding-left: 110px;
      p{
        margin: 0px;
        padding: 3px 0px;
        span{
          color: #8c939d;
          font{
            color: #606266;
          }
        }
      }
    }
    .clear{
      clear: both;
    }
  }
  .ui{
    text-align: left;
    line-height: 25px;
    span{
      display: inline-block;
      padding-right: 5px;
      color: #8c939d;
    }
    a{
      color: #1E88E5;
    }
  }
  .gt{
    color: #1E88E5;
  }
</style>
