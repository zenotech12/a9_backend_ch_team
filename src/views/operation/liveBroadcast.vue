<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span ="24">
            <el-tabs v-model="tabStatus">
              <el-tab-pane label="直播中、即将开播" name="live"></el-tab-pane>
              <el-tab-pane label="历史记录" name="history"></el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-row v-if="tabStatus === 'live'">
          <el-col :span="24">
            <el-row v-if="Object.keys(currentLive).length !== 0">
              <el-col :span="24" class="liveBigBoxCurrent">
                <el-form ref="form" :model="form" label-width="120px">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="直播间名称：">
                        {{currentLive.name}}
                      </el-form-item>
                      <el-form-item label="直播状态：">
                        <span v-if="currentLive.status === 1">即将开播</span> <span v-if="currentLive.status === 2">直播中</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="直播封面：">
                        <img :src="getImageUrl(currentLive.cover_imgs, 300, 300)" style="width: 100px;height: 100px;border-radius: 5px" alt="">
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
              <el-col :span="24">
                <el-divider>售卖商品</el-divider>
              </el-col>
              <!--<el-col :span="20">-->
                <!--<el-form :inline="true">-->
                  <!--<el-form-item>-->
                    <!--<el-input v-model="searchKey" :placeholder="$t('tools.searchKeyTip')" clearable @change="search"></el-input>-->
                  <!--</el-form-item>-->
                  <!--&lt;!&ndash;<el-form-item class="searchBtn">&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>&ndash;&gt;-->
                  <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                <!--</el-form>-->
              <!--</el-col>-->
              <el-col :span="24" style="text-align: right;padding: 10px 15px" v-if="permissionCheck('opt')">
                <div class="boxFuncBtn">
                  <el-button type="primary" size="mini" icon="el-icon-plus" @click="addGoods">{{$t('tools.add')}}</el-button>
                </div>
              </el-col>
              <el-col :span="24">
                <div style="height: calc(100vh - 450px)">
                    <el-table stripe border :data="tableData" height="calc(100% - -10px)">
                      <el-table-column prop="code">
                        <template slot="header" slot-scope="scope">
                          <el-input
                            v-model="searchCode"
                            size="mini"
                            clearable
                            placeholder="商品编号"/>
                        </template>
                      </el-table-column>
                      <el-table-column>
                        <template slot="header" slot-scope="scope">
                          <el-input
                            v-model="searchKey"
                            size="mini"
                            clearable
                            :placeholder="$t('goods.name')"/>
                        </template>
                        <template  slot-scope="scope">
                          <a class="goods-item" :href="goodsPreview(scope.row)" target="_blank" style="cursor: pointer">
                            <el-image class="image" style="width: 60px; height: 60px"  :src="getImageUrl(scope.row.images[0], 100,100)"  fit="cover"></el-image>
                            <div class="g-info">
                              <p>{{scope.row.name}}
                                <el-tag size="mini" type="danger" v-if="scope.row.type === 2">{{$t("goods.cobuy")}}</el-tag>
                                <el-tag size="mini" v-if="scope.row.type === 3">{{$t("goods.exp")}}</el-tag>
                                <!--<a class="el-icon-view"></a>-->
                              </p>
                            </div>
                          </a>
                        </template>
                      </el-table-column>
                      <el-table-column :label="$t('goods.price')">
                        <template  slot-scope="scope">
                          <template v-if="scope.row.type === 3">
                            <el-tag size="mini" v-if="scope.row.type === 3">{{$t("goods.exp")}}</el-tag>
                            <span v-if="scope.row.min_price !== scope.row.max_price">{{scope.row.min_price}}-{{scope.row.max_price}}</span>
                            <span v-else>{{scope.row.min_price}}</span>
                          </template>
                          <template v-else>
                            <span v-if="scope.row.min_price !== scope.row.max_price">{{scope.row.min_price | price}}-{{scope.row.max_price | price}}</span>
                            <span v-else>{{scope.row.min_price | price}}</span>
                          </template>
                        </template>
                      </el-table-column>
                      <el-table-column prop="inventory" :label="$t('goods.inventory')">
                      </el-table-column>
                      <el-table-column prop="sales"  :label="$t('goods.saled')">
                      </el-table-column>
                      <el-table-column prop="gen_time"  :label="$t('goods.publishTime')">
                      </el-table-column>
                    </el-table>
                  </div>
              </el-col>
              <el-col :span="24" style="margin-top: 20px">
                <el-button type="primary" size="mini" style="margin-left: 20px" @click="editLive">修改</el-button>
                <delete-button :promptInfor="delTip" v-if="currentLive.status === 1" :btnType="primary" style="margin-left: 20px" @delData="delCurrentLive"></delete-button>
              </el-col>
            </el-row>
            <el-row class="funcList" v-else>
              <el-col :span="24" v-if="permissionCheck('opt')" style="display: flex;align-items: center;justify-content: center;height: calc(100vh - 200px)">
                <el-button type="primary" size="small" @click="addLive">{{$t('tools.add')}}</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row v-if="tabStatus === 'history'">
          <el-col :span="24">
            <div style="height: calc(100vh - 190px)">
              <el-table stripe border :data="historyData" height="calc(100% - 30px)">
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="封面">
                  <template slot-scope="scope">
                    <el-popover class="pointer"
                                placement="right"
                                title=""
                                trigger="click">
                      <img :src="getImageUrl(scope.row.cover_imgs[0], 100,100)" style="max-height: 480px; max-width: 600px"/>
                      <img slot="reference" :src="getImageUrl(scope.row.cover_imgs[0],240)" style="margin-right:8px;max-height: 60px;max-width: 120px">
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="直播时段"></el-table-column>
                <el-table-column label="观看人数"></el-table-column>
                <el-table-column label="留言人次"></el-table-column>
                <el-table-column label="售卖商品数"></el-table-column>
                <el-table-column label="订单数"></el-table-column>
                <el-table-column label="操作"></el-table-column>
              </el-table>
              <el-row style="margin-top: 10px">
                <el-col :span="24" style="text-align: right;">
                  <el-pagination
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!--添加直播间-->
        <el-dialog :title="isBatch ? $t('operation.addLive') : $t('operation.editLive')" width="700px" @close="formEditDialog = false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form">
            <el-form-item :label="$t('operation.liveName')">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.liveFenMian')">
              <single-file-upload v-model="coverImgs" :promptInfo1="promptInfo"></single-file-upload>
            </el-form-item>
            <el-form-item :label="$t('operation.goods')">
              <goods-selector :mulit="true" v-model="form.spu_ids" :approve_status="2" :shelf_status="2"></goods-selector>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveAdFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
            <el-button @click="cancel" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
        <!--新增商品-->
        <el-dialog title="新增商品" width="700px" @close="goodsDialog = false" :visible.sync="goodsDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px">
            <el-form-item :label="$t('operation.goods')">
              <goods-selector :mulit="true" v-model="spu_ids" :notSpuIds="JSON.stringify(currentLive.spu_ids)" :approve_status="2" :shelf_status="2"></goods-selector>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="addGoodsUpdata" :disabled="addGoodsDisable" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
            <el-button @click="goodsDialog = false" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import goodsSelector from '@/components/goodsSelector'
  import { liveItemsModify, liveItemsAdd, liveItemsDel, liveItemsList, liveItemsAddGoods } from '@/api/operation'
  import { spusList } from '@/api/goods'
  export default {
    components: {
      goodsSelector
    },
    data() {
      const pz = 10
      return {
        searchForm: {
          skip: '',
          limit: pz,
          status: 5 // 0所有 1准备中 2直播中 4结束 5准备中和直播中的单
        },
        tableData: [],
        historyData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        showTime: [],
        form: {
          spu_ids: '', // ["xxxx","xxxxxxx"]商品ids
          cover_imgs: '', // ["xxxx"]直播封面
          name: '' // 直播间名称
        },
        formEditDialog: false,
        submitDisabled: false,
        multipleSelection: [],
        isBatch: true,
        batchGoodsParam: [],
        tabStatus: 'live',
        promptInfo: this.$t('operation.uploadTip'),
        type: 'add',
        coverImgs: '',
        currentLive: {},
        delTip: '确定删除当前直播间？',
        primary: 'primary',
        goodsDialog: false,
        addGoodsDisable: false,
        searchKey: '',
        searchCode: '',
        currentDataGoods: [],
        spu_ids: '',
        historySearch: {
          skip: 0,
          limit: pz,
          status: 4
        }
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      currentPage(val) {
        this.historySearch.skip = (val - 1) * this.pageSize
        this.historySearch.limit = this.pageSize
        this.getHistoryList()
      },
      searchKey(val) {
        if (val === '') {
          this.tableData = this.currentDataGoods
        } else {
          const array = []
          this.tableData.forEach(item => {
            const name = item.name.toUpperCase()
            const searchKey = val.toUpperCase()
            if (name.indexOf(searchKey) !== -1) {
              array.push(item)
            }
          })
          this.tableData = array
        }
      },
      searchCode(val) {
        if (val === '') {
          this.tableData = this.currentDataGoods
        } else {
          const array = []
          this.tableData.forEach(item => {
            const code = item.code.toString()
            if (code.indexOf(val) !== -1) {
              array.push(item)
            }
          })
          this.tableData = array
        }
      }
    },
    methods: {
      // 历史记录
      getHistoryList() {
        liveItemsList(this.historySearch).then(res => {
          this.historyData = res.items
          this.itemCount = res.total
        })
      },
      addGoods() {
        this.goodsDialog = true
      },
      addGoodsUpdata() {
        this.addGoodsDisable = true
        liveItemsAddGoods(this.currentLive.id, { 'spu_ids': this.spu_ids }).then(res => {
          this.goodsDialog = false
          this.addGoodsDisable = false
          this.getLiveListFunc()
        })
      },
      goodsPreview(row) {
        return 'https://www.a9kh.com/goods/' + row.id + '.html'
      },
      cancel() {
        this.formEditDialog = false
      },
      handleSelectionChange(val) {
        this.multipleSelection = []
        val.forEach(item => {
          this.multipleSelection.push(item.id)
        })
      },
      getPositionName(code) {
        const result = this.adPosition.find(item => { return item.code === code })
        return result ? result.name : ''
      },
      addLive() {
        this.isBatch = true
        this.form.spu_ids = ''
        this.form.cover_imgs = ''
        this.form.name = ''
        this.coverImgs = ''
        this.type = 'add'
        this.formEditDialog = true
      },
      editLive() {
        this.formEditDialog = true
        this.type = 'edit'
        this.form.name = this.currentLive.name
        this.form.cover_imgs = this.currentLive.cover_imgs ? JSON.stringify(this.currentLive.cover_imgs) : ''
        this.coverImgs = this.currentLive.cover_imgs ? this.currentLive.cover_imgs[0] : ''
        this.form.spu_ids = this.currentLive.spu_ids ? JSON.stringify(this.currentLive.spu_ids) : ''
        // this.form.spu_ids = ''
      },
      delCurrentLive() {
        liveItemsDel(this.currentLive.id).then(res => {
          this.getLiveListFunc()
        })
      },
      imageUploadSuccess(res) {
        this.form.image = res.md5
        console.log(res)
      },
      saveAdFunc() {
        this.form.cover_imgs = JSON.stringify([this.coverImgs])
        console.log('this.form', this.form)
        if (this.form.name === '') {
          this.$message.error('请输入直播间名称')
          return
        }
        if (this.coverImgs === '') {
          this.$message.error('请上传直播间封面')
          return
        }
        this.submitDisabled = true
        if (this.type === 'edit') {
          liveItemsModify(this.currentLive.id, this.form).then(res => {
            this.getLiveListFunc()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else if (this.type === 'add') {
          liveItemsAdd(this.form).then(res => {
            this.getLiveListFunc()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
      },
      getLiveListFunc() {
        liveItemsList(this.searchForm).then(res => {
          this.currentLive = res.items[0] ? res.items[0] : {}
          if (res.items[0]) {
            this.getLiveGoodsList()
          }
        })
      },
      getLiveGoodsList() {
        spusList({ 'spu_ids': JSON.stringify(this.currentLive.spu_ids) }).then(res => {
          // res.items && res.items.forEach((item, k) => {
          //   item['code'] = k + 1
          // })
          const array = []
          this.currentLive.spu_ids.forEach((v, k) => {
            res.items.forEach(z => {
              if (v === z.id) {
                z['code'] = k + 1
                array.push(z)
              }
            })
          })
          console.log('array', array)
          console.log('this.currentLive.spu_ids', this.currentLive.spu_ids)
          this.tableData = array
          this.currentDataGoods = array
        })
      }
    },
    mounted() {
      this.getLiveListFunc()
      this.getHistoryList()
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
.liveBigBoxCurrent {
  /deep/ {
    .el-form-item {
      margin-bottom: 0!important;
    }
  }
}
</style>
