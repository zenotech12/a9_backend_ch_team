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
        <el-row class="funcList">
          <el-col :span="24" v-if="permissionCheck('opt')" style="display: flex;align-items: center;justify-content: center;height: calc(100vh - 200px)">
            <el-button type="primary" size="small" @click="addLive">{{$t('tools.add')}}</el-button>
          </el-col>
        </el-row>
        <!--<el-row>-->
          <!--<el-col :span="24">-->
            <!--<div style="height: calc(100vh - 185px)">-->
              <!--<el-table stripe border :data="tableData" height="calc(100% - 40px)"  @selection-change="handleSelectionChange">-->
                <!--<el-table-column-->
                  <!--type="selection"-->
                  <!--width="55">-->
                <!--</el-table-column>-->
                <!--<el-table-column :label="$t('operation.image')">-->
                  <!--<template  slot-scope="scope">-->
                    <!--<el-image :src="getImageUrl(scope.row.image,200)" style="height: 130px; width:270px" fit="contain"></el-image>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="name" :label="$t('operation.name')"></el-table-column>-->
                <!--<el-table-column :label="$t('operation.position')">-->
                  <!--<template  slot-scope="scope">-->
                    <!--{{getPositionName(scope.row.code)}}-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column :label="$t('operation.type')">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-tag :type="scope.row.type === 1 ? 'success' : ''">{{scope.row.type === 1 ? $t('operation.goods'): $t('operation.link')}}</el-tag>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column :label="$t('operation.showTime')">-->
                  <!--<template  slot-scope="scope">-->
                    <!--{{scope.row.bt + $t('operation.to') + scope.row.et}}-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column :label="$t('tools.opt')" width = "140"  v-if="permissionCheck('opt')">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-button type="text" @click="showAdEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>-->
                    <!--<span class="xiexian">/</span>-->
                    <!--<delete-button  @delData="deleteAdFunc(scope.row)"></delete-button>-->
                  <!--</template>-->
                <!--</el-table-column>-->
              <!--</el-table>-->
              <!--<el-row style="margin-top: 10px">-->
                <!--<el-col :span="6">-->
                  <!--<el-button  v-if="permissionCheck('opt')" size="mini" @click="batchDelete">{{$t('tools.delete')}}</el-button>-->
                  <!--&nbsp;-->
                <!--</el-col>-->
                <!--<el-col :span="18" style="text-align: right;">-->
                <!--<el-pagination-->
                  <!--:current-page.sync="currentPage"-->
                  <!--:page-size="pageSize"-->
                  <!--layout="total, prev, pager, next, jumper"-->
                  <!--:total="itemCount">-->
                <!--</el-pagination>-->
                <!--</el-col>-->
              <!--</el-row>-->
            <!--</div>-->
          <!--</el-col>-->
        <!--</el-row>-->
        <el-dialog :title="isBatch ? $t('operation.addLive') : $t('operation.editLive')" width="700px" @close="formEditDialog = false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form">
            <el-form-item :label="$t('operation.name')">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.image')">
              <image-upload :drag="false" @uploadSuccess="imageUploadSuccess">
                <el-image v-if="form.image" :src="getImageUrl(form.image,200)" style="height: 100px; width:400px" fit="contain"></el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </image-upload>
            </el-form-item>
            <el-form-item :label="$t('operation.goods')">
              <goods-selector :mulit="true" @selectChanged="goodsSelectedChanged" v-model="form.para" :approve_status="2" :shelf_status="2"></goods-selector>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveAdFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import goodsSelector from '@/components/goodsSelector'
  import { adModify, adAdd, adDelete, adList, adBatchDelete, adBatchAdd } from '@/api/operation'
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
          limit: pz
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
        tabStatus: 'live'
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
        this.getAdListFunc()
      },
      timeValidSwitch(val) {
        this.searchForm.time_valid = val ? 1 : 0
        this.getAdListFunc()
      },
      selectedPosition(val) {
        if (val === this.$t('tools.all')) {
          this.searchForm.code = 0
        } else {
          const result = this.adPosition.find(item => { return item.name === val })
          this.searchForm.code = result.code
        }
        this.getAdListFunc()
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = []
        val.forEach(item => {
          this.multipleSelection.push(item.id)
        })
      },
      batchDelete() {
        if (this.multipleSelection.length < 1) {
          this.$message.error(this.$t('operation.adBatchDelTip'))
          return
        }
        adBatchDelete(this.multipleSelection).then(res => {
          this.getAdListFunc()
          this.multipleSelection = []
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
        this.formEditDialog = true
      },
      showBatchAdd() {
        this.batchGoodsParam = []
        this.isBatch = true
        this.form = this.setForm()
        this.formEditDialog = true
      },
      showAdEditor(data) {
        this.isBatch = false
        this.form = this.setForm(data)
        this.formEditDialog = true
      },
      imageUploadSuccess(res) {
        this.form.image = res.md5
        console.log(res)
      },
      goodsSelectedChanged(val) {
        if (this.isBatch) {
          this.batchGoodsParam = []
          val.forEach(res => {
            this.batchGoodsParam.push({ name: res.name, image: res.images[0], para: res.id })
          })
        } else {
          if (this.form.name === '') {
            this.form.name = val.name
          }
          if (this.form.image === '' && val.images.length > 0) {
            this.form.image = val.images[0]
          }
        }
      },
      saveAdFunc() {
        this.submitDisabled = true
        if (this.form.id !== '') {
          adModify(this.form.id, this.form).then(res => {
            this.getAdListFunc()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else {
          if (this.isBatch) {
            adBatchAdd({ code: this.form.code, bt: this.form.bt, et: this.form.et, desc: this.form.desc, multi_paras: JSON.stringify(this.batchGoodsParam) }).then(res => {
              this.getAdListFunc()
              this.formEditDialog = false
              this.submitDisabled = false
            }).catch(() => {
              this.submitDisabled = false
            })
          } else {
            adAdd(this.form).then(res => {
              this.getAdListFunc()
              this.formEditDialog = false
              this.submitDisabled = false
            }).catch(() => {
              this.submitDisabled = false
            })
          }
        }
      },
      deleteAdFunc(row) {
        adDelete(row.id).then(res => {
          this.getAdListFunc()
        })
      },
      getAdListFunc() {
        adList(this.searchForm).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
        })
      }
    },
    mounted() {
      this.getAdListFunc()
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>

</style>
