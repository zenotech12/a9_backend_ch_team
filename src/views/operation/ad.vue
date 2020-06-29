<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span ="14">
            <el-radio-group v-model="selectedPosition" size="small">
              <el-radio-button :label="$t('tools.all')"></el-radio-button>
              <el-radio-button v-for="(v,k) in adPosition" :label="v.name" :key="k"></el-radio-button>
            </el-radio-group>
            <el-switch style="margin-top: 2px; margin-left: 10px"
              v-model="timeValidSwitch"
              :active-text="$t('operation.valid')"
              :inactive-text="$t('operation.all')">
            </el-switch>
          </el-col>
          <el-col :span="10" class="funcList" style="text-align: right">
            <template v-if="permissionCheck('opt')">
              <el-button size="mini" @click="showBatchAdd" type="text" style="margin-right: 20px">{{$t('tools.batchAdd')}}</el-button>
              <div class="boxFuncBtn" @click="addAd">
                <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
                <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
              </div>
            </template>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)"  @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column :label="$t('operation.image')">
                  <template  slot-scope="scope">
                    <el-image :src="getImageUrl(scope.row.image,200)" style="height: 130px; width:270px" fit="contain"></el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="name" :label="$t('operation.name')"></el-table-column>
                <el-table-column :label="$t('operation.position')">
                  <template  slot-scope="scope">
                    {{getPositionName(scope.row.code)}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.type')">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.type === 1 ? 'success' : ''">{{scope.row.type === 1 ? $t('operation.goods'): $t('operation.link')}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.showTime')">
                  <template  slot-scope="scope">
                    {{scope.row.bt + $t('operation.to') + scope.row.et}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "140"  v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showAdEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                    <span class="xiexian">/</span>
                    <delete-button  @delData="deleteAdFunc(scope.row)"></delete-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="margin-top: 10px">
                <el-col :span="6">
                  <el-button  v-if="permissionCheck('opt')" size="mini" @click="batchDelete">{{$t('tools.delete')}}</el-button>
                  &nbsp;
                </el-col>
                <el-col :span="18" style="text-align: right;">
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
        <el-dialog :title="isBatch ? $t('operation.adEditBatch') : $t('operation.adEdit')" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form">
            <el-form-item :label="$t('operation.position')">
              <el-select v-model="form.code" :placeholder="$t('tools.pleaseSelect')">
                <el-option
                  v-for="item in adPosition"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('operation.type')">
              <el-select v-model="form.type" :disabled="isBatch" :placeholder="$t('tools.pleaseSelect')">
                <el-option
                  v-for="item in adType"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('operation.showTime')">
              <el-date-picker
                v-model="showTime"
                type="datetimerange"
                value-format = "yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
            </el-form-item>
            <template v-if="isBatch">
              <el-form-item v-if="form.type === 1" :label="$t('operation.goods')">
                <goods-selector :mulit="true" @selectChanged="goodsSelectedChanged" v-model="form.para" :approve_status="2" :shelf_status="2"></goods-selector>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item v-if="form.type === 1" :label="$t('operation.goods')">
                <goods-selector @selectChanged="goodsSelectedChanged" v-model="form.para" :approve_status="2" :shelf_status="2"></goods-selector>
              </el-form-item>
              <el-form-item v-else :label="$t('operation.url')">
                <el-input v-model="form.para"></el-input>
              </el-form-item>
              <el-form-item :label="$t('operation.name')">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item :label="$t('operation.image')">
                <image-upload :drag="false" @uploadSuccess="imageUploadSuccess">
                  <el-image v-if="form.image" :src="getImageUrl(form.image,200)" style="height: 100px; width:400px" fit="contain"></el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </image-upload>
              </el-form-item>

              <el-form-item :label="$t('operation.sortNo')">
                <el-input v-model.number="form.sort_no"></el-input>
              </el-form-item>
              <el-form-item :label="$t('operation.desc')">
                <el-input type="textarea" maxlength="200" rows="3" v-model="form.desc"></el-input>
              </el-form-item>
            </template>
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
      const formData = this.setForm()
      const pz = 10
      return {
        adPosition: [{ code: 10001, name: this.$t('operation.positionA') }, { code: 10002, name: this.$t('operation.positionB') }],
        adType: [{ code: 1, name: this.$t('operation.goods') }, { code: 2, name: this.$t('operation.link') }],
        selectedPosition: this.$t('tools.all'),
        timeValidSwitch: true,
        searchForm: {
          code: 0,
          time_valid: 1,
          skip: '',
          limit: pz
        },
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        showTime: [],
        form: formData,
        formEditDialog: false,
        submitDisabled: false,
        multipleSelection: [],
        isBatch: false,
        batchGoodsParam: []
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
      setForm(data) {
        this.selectedGoodsIds = []
        if (data) {
          this.showTime = [data.bt, data.et]
          return {
            id: data.id,
            code: data.code,
            name: data.name,
            image: data.image,
            bt: data.bt,
            et: data.et,
            type: data.type,
            para: data.para,
            sort_no: data.sort_no,
            desc: data.desc
          }
        } else {
          this.showTime = []
          return {
            id: '',
            code: '',
            name: '',
            image: '',
            bt: '',
            et: '',
            type: 1,
            para: '',
            sort_no: 0,
            desc: ''
          }
        }
      },
      addAd() {
        this.isBatch = false
        this.form = this.setForm()
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
