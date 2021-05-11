<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span ="24">
            <el-form :inline="true" :model="searchForm">
              <el-form-item>
                <goods-selector v-model="searchForm.spu_id"></goods-selector>
              </el-form-item>
              <el-form-item>
                <el-radio-group v-model="searchForm.comprehensive_lv" size="small">
                  <el-radio-button v-for="(item, k) in commentLevel"
                                   :key="k"
                                   :label="k">
                    {{item}}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-radio-group v-model="searchForm.replied" size="small">
                  <el-radio-button v-for="(item, k) in commentReplied"
                                   :key="k"
                                   :label="k">
                    {{item}}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="searchBtn">
                <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 190px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)" @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column label="#" width="60px" fixed="left">
                  <template slot-scope="scope">
                    {{scope.$index + searchForm.skip + 1}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.user')" align="left" width="100" fixed="left">
                  <template slot-scope="scope">
                    {{scope.row.user_nick_name}}<br/>
                    {{scope.row.user_mobile}}<br/>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.comment')" min-width="400">
                  <template slot-scope="scope">
                    {{scope.row.content}}
                    <div>
                      <el-image v-for="(img, k) in scope.row.imgs" style="width: 80px; height: 80px" :key="scope.row.id + k" fit="contain" :src="getImageUrl(img, 50)" :preview-src-list="previewList(scope.row.imgs)">
                      </el-image>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('order.commentStar')" width="220">
                  <template  slot-scope="scope">
                    <div><el-tag size="mini" :type="scope.row.comprehensive_lv===3 ? '':(scope.row.comprehensive_lv===2? 'success': 'info')">{{commentLevel1[scope.row.comprehensive_lv]}}</el-tag></div>
                    <div class="rate-item"><span>{{$t('order.star1')}}</span><el-rate class="rate" :value="scope.row.discribe_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
                    <div class="rate-item"><span>{{$t('order.star2')}}</span><el-rate class="rate" :value="scope.row.service_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
                    <div class="rate-item"><span>{{$t('order.star3')}}</span><el-rate class="rate" :value="scope.row.express_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('order.goods')" min-width="400">
                  <template  slot-scope="scope">
                    <a class="goods-item" target="_blank" :href="goodsPreview(scope.row.sku_goods_item)">
                      <el-image class="image" style="width: 100px; height: 100px"  :src="getImageUrl(scope.row.sku_goods_item.sku_img)"  fit="cover"></el-image>
                      <div class="g-info">
                        <p>{{scope.row.sku_goods_item.spu_name}}</p>
                        <p>
                          <span v-for="(v,k) in scope.row.sku_goods_item.specifications"> {{k}}：<font>{{v}}</font></span>
                        </p>
                        <p><span>{{$t('order.price3')}}：</span>{{scope.row.sku_goods_item.price | price}}；<span>{{$t('order.number')}}：</span>{{scope.row.sku_goods_item.count}}</p>
                      </div>
                    </a>
                  </template>
                </el-table-column>
                <el-table-column prop="order_no" :label="$t('order.order')" width="200">
                </el-table-column>
                <el-table-column prop="gen_time" :label="$t('order.evaluateTime')" width="160">
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "90" fixed="right">
                  <template slot-scope="scope">
                    <el-badge :value="scope.row.replies.length" v-if="scope.row.replies" class="item" style="margin: 10px 0px !important;">
                      <el-button type="text" @click="showReplyEditor(scope.row)" size="small">{{$t('order.replyReviews')}}</el-button>
                    </el-badge>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="margin-top: 10px">
                <el-col :span="6">
                  <el-button v-if="permissionCheck('opt')" size="mini" @click="showBatchReplyDialog">{{$t('order.reply')}}</el-button>
                </el-col>
                <el-col :span="18" style="text-align: right;">
                  <el-pagination
                    :current-page.sync="currentPage"
                    :page-size.sync="pageSize"
                    :page-sizes="[10, 30, 50, 100, 500]"
                    layout="total, prev, pager, next, jumper, sizes"
                    :total="itemCount">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-dialog :title="$t('order.reply')" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px">
            <el-form-item :label="$t('order.user')">
              {{replyData.user_nick_name}}&nbsp;{{replyData.user_mobile}}
            </el-form-item>
            <el-form-item :label="$t('order.commentLevel')">
              <el-tag size="mini" :type="replyData.comprehensive_lv===3 ? '':(replyData.comprehensive_lv===2? 'success': 'info')">{{commentLevel1[replyData.comprehensive_lv]}}</el-tag>
            </el-form-item>
            <el-form-item :label="$t('order.commentStar')">
              <div class="rate-item"><span>{{$t('order.star1')}}</span><el-rate class="rate" :value="replyData.discribe_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
              <div class="rate-item"><span>{{$t('order.star2')}}</span><el-rate class="rate" :value="replyData.service_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
              <div class="rate-item"><span>{{$t('order.star3')}}</span><el-rate class="rate" :value="replyData.express_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
            </el-form-item>
            <el-form-item :label="$t('order.comment')">
              <div>{{replyData.content}}</div>
              <div>
                <el-image v-for="(img, k) in replyData.imgs" style="width: 80px; height: 80px" :key="k" fit="contain" :src="getImageUrl(img,50)" :preview-src-list="previewList(replyData.imgs)">
                </el-image>
              </div>
            </el-form-item>
            <el-divider content-position="left">{{$t('order.reply1')}}</el-divider>
            <div class="reply-item" v-for="v in replyData.replies">{{v}}</div>
            <el-input  v-if="permissionCheck('opt')" style="margin-top: 10px" type="textarea"  :rows="2" :placeholder="$t('order.reply2')"  v-model="replyContent">   </el-input>
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="permissionCheck('opt')">
            <confirm-button @confirmButton="saveDataFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
        <el-dialog :title="$t('order.batchReply')" width="500px" @close="batchReplyDialog=false" :visible.sync="batchReplyDialog" :close-on-click-modal="false" center >
          <div>
            <el-divider content-position="left">{{$t('order.reply1')}}</el-divider>
            <el-input style="margin-top: 10px" type="textarea"  :rows="5" :placeholder="$t('order.reply2')"  v-model="replyContent">   </el-input>
          </div>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="batchReplyFunc" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { evalutionsList, evalutionsReply, batchEvalutionsReply, evaluationsCount } from '@/api/order'
  import goodsSelector from '@/components/goodsSelector'
  export default {
    components: {
      goodsSelector
    },
    data() {
      const pz = 10
      return {
        commentLevel: [this.$t('tools.all'), this.$t('order.commentStar1'), this.$t('order.commentStar2'), this.$t('order.commentStar3')],
        commentLevel1: [this.$t('tools.all'), this.$t('order.commentStar1'), this.$t('order.commentStar2'), this.$t('order.commentStar3')],
        commentReplied: [this.$t('tools.all'), this.$t('order.repliedResponded'), this.$t('order.notRespondingReviews')],
        searchForm: {
          spu_id: '',
          sku_id: '',
          comprehensive_lv: 0,
          replied: 0,
          skip: 0,
          limit: pz
        },
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        grantTime: [], // 发放时段
        replyContent: '',
        replyData: {},
        formEditDialog: false,
        submitDisabled: false,
        batchReplyDialog: false,
        multipleSelection: []
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
      },
      pageSize(val) {
        this.searchForm.skip = 0
        this.searchForm.limit = val
        this.getDataListFun()
      }
    },
    methods: {
      getEvaluationsCount() {
        evaluationsCount().then(res => {
          console.log(res);
          if (res.meta === 0) {
            this.commentReplied = [this.$t('tools.all'),
              this.$t('order.repliedResponded') + '(' + res.item.replied + ')',
              this.$t('order.notRespondingReviews') + '(' + res.item.noreply + ')']
            // console.log('res', res)
            this.commentLevel = [this.$t('tools.all'),
              this.$t('order.commentStar1') + '(' + res.item.bad + ')',
              this.$t('order.commentStar2') + '(' + res.item.medium + ')',
              this.$t('order.commentStar3') + '(' + res.item.good + ')']
          }
        })
      },
      goodsPreview(row) {
        return 'https://www.a9kh.com/goods/' + row.spu_id + '.html'
        // this.currentGoods = appUrl + '/goods/info?id=' + row.id
        // this.commodityPreviewShow = true
      },
      // 回复按钮
      showBatchReplyDialog() {
        if (this.multipleSelection.length < 1) {
          this.$message.error(this.$t('order.batchReplyTip'))
          return
        }
        this.replyContent = ''
        this.batchReplyDialog = true
      },
      batchReplyFunc() {
        batchEvalutionsReply({ ids: JSON.stringify(this.multipleSelection), reply: this.replyContent }).then(() => {
          this.getDataListFun()
          this.batchReplyDialog = false
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = []
        val.forEach(item => {
          this.multipleSelection.push(item.id)
        })
      },
      previewList(imgs) {
        const result = []
        imgs.forEach(img => {
          result.push(this.getImageUrl(img))
        })
        // console.log(result)
        return result
      },
      // 回复评价
      showReplyEditor(data) {
        this.replyData = data
        this.replyContent = ''
        this.formEditDialog = true
      },
      saveDataFunc() {
        this.submitDisabled = true
        evalutionsReply(this.replyData.id, { reply: this.replyContent }).then(res => {
          this.$message.success(this.$t('order.replyTip'))
          this.submitDisabled = false
          this.getDataListFun()
          this.getEvaluationsCount()
          this.formEditDialog = false
        }).catch(() => {
          this.submitDisabled = false
        })
      },
      // 数据显示
      getDataListFun() {
        evalutionsList(this.searchForm).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
          console.log(res);
        })
      },
      search() {
        this.getDataListFun()
      }
    },
    mounted() {
      this.getEvaluationsCount()
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
  .reply-item{
    margin-top: 10px;
    line-height: 20px;
  }
  .goods-item{
    .image{
      float: left !important;
      margin-right: 5px !important;
    }
    .g-info{
      text-align: left;
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
  }
</style>
