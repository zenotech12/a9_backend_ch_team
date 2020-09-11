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
                        <el-button type="primary" size="mini" style="margin-left: 20px" @click="editLive">修改</el-button>
                      </el-form-item>
                      <el-form-item label="直播状态：">
                        <span v-if="currentLive.status === 1">即将开播</span> <span v-if="currentLive.status === 2">直播中</span>
                        <delete-button :promptInfor="delTip" v-if="currentLive.status === 1" :btnType="primary" style="margin-left: 20px" @delData="delCurrentLive"></delete-button>
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
              <el-col :span="24">
                <div style="height: calc(100vh - 350px)">
                    <el-table stripe border :data="tableData" height="calc(100% - -10px)">
                      <el-table-column  :label="$t('goods.name')">
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
                    <!--<el-row style="margin-top: 10px">-->
                      <!--<el-col :span="24" style="text-align: right;">-->
                        <!--<el-pagination-->
                          <!--:current-page.sync="currentPage"-->
                          <!--:page-size="pageSize"-->
                          <!--layout="total, prev, pager, next, jumper"-->
                          <!--:total="itemCount">-->
                        <!--</el-pagination>-->
                      <!--</el-col>-->
                    <!--</el-row>-->
                  </div>
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
          <el-col :span="24"></el-col>
        </el-row>

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
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import goodsSelector from '@/components/goodsSelector'
  import { liveItemsModify, liveItemsAdd, liveItemsDel, liveItemsList } from '@/api/operation'
  import { spusList } from '@/api/goods'
  export default {
    components: {
      goodsSelector
    },
    data() {
      const pz = 10
      return {
        timeValidSwitch: true,
        searchForm: {
          skip: '',
          limit: pz,
          status: 5 // 0所有 1准备中 2直播中 4结束 5准备中和直播中的单
        },
        tableData: [],
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
        primary: 'primary'
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      showTime(val) {
        if (val.length > 0) {
          this.form.bt = val[0]
          this.form.et = val[1]
        }
      },
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getLiveListFunc()
      },
      timeValidSwitch(val) {
        this.searchForm.time_valid = val ? 1 : 0
        this.getLiveListFunc()
      },
      selectedPosition(val) {
        if (val === this.$t('tools.all')) {
          this.searchForm.code = 0
        } else {
          const result = this.adPosition.find(item => { return item.name === val })
          this.searchForm.code = result.code
        }
        this.getLiveListFunc()
      }
    },
    methods: {
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
          this.tableData = res.items
          this.itemCount = res.total
        })
      }
    },
    mounted() {
      this.getLiveListFunc()
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
