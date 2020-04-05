<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24" class="funcList">
            <div class="boxFuncBtn" @click="addNewsPostage">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
              <div style="height: calc(100% - 88px)">
                <el-table stripe border :span-method="arraySpanMethod" :data="tablePostage">
                  <el-table-column prop="name" :label="$t('sys.name')"></el-table-column>
                  <el-table-column :label="$t('sys.default')">
                    <template slot-scope="scope">
                      <span>{{scope.row.default ? 'yes' : 'no'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('sys.region')">
                    <template slot-scope="scope">
                      <span>{{scope.row.quote.province.join(',')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('sys.firstWeight')">
                    <template slot-scope="scope">
                      <span>{{scope.row.quote.price_base}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('sys.addWeight')">
                    <template slot-scope="scope">
                      <span>{{scope.row.quote.price_step}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('tools.opt')">
                    <template slot-scope="scope">
                      <el-button @click="editPostage(scope.row, scope.$index)" type="text">{{$t('tools.edit')}}</el-button>
                      <span class="xiexian">/</span>
                      <el-button @click="delPostage(scope.row.id)" type="text">{{$t('tools.delete')}}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
          </el-col>
        </el-row>
        <el-dialog v-if="postageDialog" :title="$t('sys.postageRuleEdit')"  :visible.sync="postageDialog">
      <el-form label-width="100px">
        <el-form-item :label="$t('sys.name')">
          <el-input v-model="postageData.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sys.default')">
          <el-checkbox v-model="postageData.default" :true-label="1" :false-label="0"></el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('sys.postageRule')">
          <el-radio-group v-model="hasRadio" class="postpageBox">
            <el-table :data="postageData.setting">
              <el-table-column :label="$t('sys.region')">
                <template slot-scope="scope">
                  <div style="padding: 20px">
                    <el-popover
                      placement="top-start"
                      width="600"
                      trigger="click">
                      <el-row  style="padding: 10px">
                        <el-col v-for="(item, index) in areas" :key="index">
                          <el-col :span="4">
                            <div>
                              <el-checkbox :label="item.value" @change="selectAll($event, scope.$index, scope.row, item.value)"></el-checkbox>
                            </div>
                          </el-col>
                          <el-col :span="20">
                            <el-col v-for="(i, j) in item.items" :span="4" :key="j">
                              <el-checkbox v-model="i.hasCheck" :disabled="i.disabled !== -1 && i.disabled !== scope.$index" :label="i.value" @change="checkClick(scope.row, i.hasCheck, i.value, scope.$index, i)"></el-checkbox>
                            </el-col>
                          </el-col>
                        </el-col>
                        <el-col>
                          <el-checkbox :label="$t('tools.selectAll')" @change="selectAll($event, scope.$index, scope.row)" ></el-checkbox>
                        </el-col>
                      </el-row>
                      <el-input slot="reference" readonly :value="scope.row.province"></el-input>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('sys.firstWeight')">
                <template slot-scope="scope">
                  <el-input style="width: 80px" v-model="scope.row.price_base"></el-input>/
                  <el-input class="input_weight"  placeholder="" v-model="scope.row.base">
                    <template slot="append" style="padding: 0px 5px">g</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('sys.addWeight')">
                <template slot-scope="scope">
                  <el-input  style="width: 80px" v-model="scope.row.price_step"></el-input>/
                  <el-input class="input_weight" placeholder="" v-model="scope.row.step">
                    <template slot="append" style="width: 25px">g</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('sys.default')" width="50px">
                <template slot-scope="scope">
                  <el-radio :label="scope.$index">&nbsp</el-radio>
                </template>
              </el-table-column>
              <el-table-column :label="$t('tools.opt')" width="80px">
                <template slot-scope="scope">
                  <el-button @click="del(scope.row)" v-if="scope.$index + 1 !== postageData.setting.length">{{$t('tools.delete')}}</el-button>
                  <el-button @click="addPostage" v-else>{{$t('tools.add')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPostageField" style="margin-right: 20px">{{$t('tools.confirm')}}</el-button>
        <el-button @click="postageDialog = false">{{$t('tools.close')}}</el-button>
      </div>
    </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  // 站点信息
  import i18n from '../../utils/i18n'
  import service from '@/utils/request'
  import store from '@/store'
  // 公司设置
  import { postagesAdd, postagesModify, postagesList, postagesDel } from '@/api/system'
  import { mapGetters } from 'vuex'
  import area from '@/utils/area'
  export default {
    components: {
    },
    data() {
      return {
        hasRadio: 0,
        postageData: {
          id: '',
          name: '',
          default: 0,
          settings: '',
          setting: [
            {
              default: false,
              province: '',
              price_base: '',
              price_step: '',
              base: 1000,
              step: 1000
            }
          ]
        },
        postageDialog: false,
        goods_info: [],
        bannerDialogData: {
          image: '',
          type: 0,
          value: '',
          name: '',
          md5: '',
          status: 'add',
          index: ''
        },
        bannerDialog: false,
        bannerList: [],
        currentShow: 1,
        // 管理员
        dialogFormVisible: false,
        title: '新增管理员',
        passShow: true,
        searchForm: {
          key: '',
          skip: '',
          limit: 20
        },
        userData: {
          data: [],
          loading: true
        },
        addForm: {
          id: '',
          name: '',
          mobile: '',
          email: '',
          pass: ''
        },
        currentPage: 0,
        itemCount: 0,
        tabPosition: 'left',
        // 站点信息
        imageUrl: '',
        fileUploadUrl: service.defaults.baseURL + 'file/upload',
        fileUploadHeader: { 'X-Access-Token': store.state.user.token },
        langArr: [],
        defauLang: '',
        defaultTab: '',
        addFormData: {
          language_key: '',
          title: '',
          company: '',
          footer_info: '',
          des_img: '',
          desImgUrl: '',
          bg_color: '',
          logo: '',
          logoUrl: '',
          show_style: 0
        },
        catchData: {},
        // 公司设置
        defaultTabCompany: 'zh',
        langArrCompany: {},
        addFormCompany: {
          title: '',
          logo: '',
          banners: ''
        },
        singleGoods: false,
        areas: this.filterChild(area),
        tablePostage: [],
        spanRows: [0]
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
      eShop: function() {
        return this.permission('e_shop')
      }
    },
    watch: {
      goods_info: {
        handler(val) {
          if (val.length === 1) {
            this.bannerDialogData.value = val[0].id
            this.bannerDialogData.name = val[0].name
            this.singleGoods = true
          }
          if (val.length === 0) {
            this.bannerDialogData.value = ''
            this.bannerDialogData.name = ''
            this.singleGoods = false
          }
        },
        deep: true
      },
      hasRadio: function(val) {
        this.postageData.setting.forEach((item, index) => {
          item.default = false
          if (val === index) {
            item.default = true
          }
        })
      }
    },
    methods: {
      delPostage(data) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          postagesDel(data).then(res => {
            this.$message.success(res.error)
            this.postageList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      resetPostage() {
        this.filterChild(this.areas)
        this.postageData.name = ''
        this.postageData.id = ''
        this.postageData.default = ''
        this.hasRadio = 0
        this.postageData.setting = [
          {
            default: false,
            province: '',
            price_base: '',
            price_step: '',
            base: 1000,
            step: 1000
          }
        ]
      },
      editPostage(data, index) {
        this.resetPostage()
        this.postageDialog = true
        const obj = JSON.parse(JSON.stringify(data))
        this.postageData.name = obj.name
        this.postageData.id = obj.id
        this.postageData.default = obj.default

        obj.settings && obj.settings.forEach((item, index) => {
          this.filterChild(this.areas, index, item)
          item.default ? this.hasRadio = index : ''
          item.province = Array.isArray(item.province) ? item.province.join(',') : item.province
        })
        this.postageData.setting = obj.settings
      },
      addPostageField() {
        this.postageData.settings = JSON.parse(JSON.stringify(this.postageData.setting))
        this.postageData.settings && this.postageData.settings.forEach(item => {
          item.province = item.province ? item.province.split(',') : []
          item.price_base = parseInt(item.price_base)
          item.price_step = parseInt(item.price_step)
          item.base = parseInt(item.base)
          item.step = parseInt(item.step)
        })
        this.postageData.settings = this.postageData.settings.filter(item => {
          return item.province.length > 0
        })
        this.postageData.settings = JSON.stringify(this.postageData.settings)
        if (this.postageData.id !== '') {
          postagesModify(this.postageData.id, this.postageData).then(res => {
            this.postageDialog = false
            this.postageList()
          })
        } else {
          postagesAdd(this.postageData).then(res => {
            this.postageDialog = false
            this.postageList()
          })
        }
      },
      checkClick(row, truth, value, index, source) {
        let data = row.province
        if (!data) {
          data = []
        } else {
          try {
            data = data.split(',')
          } catch (err) {
            data = []
          }
        }
        if (truth) {
          source.disabled = index
          data.push(value)
        } else {
          source.disabled = -1
          data.splice(data.indexOf(value), 1)
        }
        data = data.join(',')
        row.province = data
      },
      selectAll(val, i, row, ca) {
        let data = row.province
        if (!data) {
          data = []
        } else {
          try {
            data = data.split(',')
          } catch (err) {
            data = []
          }
        }
        this.areas.forEach((area) => {
          if (!ca || ca === area.value) {
            area.items.forEach((item) => {
              if (item.disabled === -1 || item.disabled === i) {
                if (val) {
                  if (item.disabled === -1) {
                    data.push(item.value)
                  }
                  this.$set(item, 'hasCheck', true)
                  this.$set(item, 'disabled', i)
                } else {
                  this.$set(item, 'hasCheck', false)
                  this.$set(item, 'disabled', -1)
                  data.splice(data.indexOf(item.value), 1)
                }
              }
            })
          }
        })
        row.province = data.join(',')
      },
      addPostage() {
        const obj = {
          default: false,
          province: '',
          price_base: '',
          price_step: '',
          base: 1000,
          step: 1000
        }
        this.postageData.setting.push(obj)
      },
      del(data) {
        this.postageData.setting.splice(this.postageData.setting.indexOf(data), 1)
        this.hasRadio = 0
        this.filterChild(this.areas)
        this.postageData.setting.forEach((item, index) => {
          this.filterChild(this.areas, index, item)
          item.default ? this.hasRadio = index : ''
          // item.province = Array.isArray(item.province) ? item.province.join(',') : item.province
        })
        console.log(this.areas)
        console.log(this.postageData.setting)
      },
      filterChild(data, index, srouce) {
        if (!data) {
          return
        }
        data.forEach(item => {
          if (srouce) {
            if (srouce && srouce.province.includes(item.value)) {
              this.$set(item, 'disabled', index)
              this.$set(item, 'hasCheck', true)
            } else if (!item.hasCheck) {
              this.$set(item, 'disabled', -1)
              this.$set(item, 'hasCheck', false)
            }
          } else {
            this.$set(item, 'disabled', -1)
            this.$set(item, 'hasCheck', false)
          }
          this.filterChild(item.items, index, srouce)
        })
        return data
      },
      addNewsPostage() {
        this.resetPostage()
        this.postageDialog = true
      },
      editBanner(data, index) {
        const obj = JSON.parse(JSON.stringify(data))
        this.bannerDialogData = obj
        this.bannerDialogData.md5 = this.bannerDialogData.image
        this.bannerDialogData.status = 'edit'
        this.bannerDialogData.index = index
        if (data.type === 0) {
          this.goods_info = []
          this.goods_info.push({
            id: data.value,
            name: data.name
          })
        }
        console.log(this.bannerDialogData)
        this.bannerDialog = true
      },
      delBanner(data) {
        this.alert('确认删除banner', res => {
          this.bannerList.splice(this.bannerList.indexOf(data), 1)
        })
      },
      changeSelect(val) {
        if (val === 1 && this.goods_info.length > 0) {
          this.bannerDialogData.value = ''
        }
        if (val === 0) {
          this.goods_info = []
        }
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex <= 1 || columnIndex === 5) {
          if (this.spanRows.includes(rowIndex)) {
            if (columnIndex === 0) {
              const x = this.spanRows[this.spanRows.indexOf(rowIndex)] + row.settings.length
              if (!this.spanRows.includes(x)) {
                this.spanRows.push(x)
              }
            }
            return {
              rowspan: row.settings.length,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      postageList() {
        postagesList().then(res => {
          this.spanRows = [0]
          for (const i in res.items) {
            const str = JSON.stringify(res.items[i])
            if (res.items[i].settings && res.items[i].settings.length !== 0) {
              res.items[i].settings.forEach((item, index) => {
                const obj = JSON.parse(str)
                obj.quote = item
                obj.index = index
                res.items.push(obj)
              })
            }
          }
          this.tablePostage = res.items.filter(res => {
            return res.quote
          })
          console.log(this.tablePostage)
        })
      }
    },
    mounted() {
      this.postageList()
    },
    created() {
      this.langArr = Object.keys(i18n.messages)
      this.defaultTab = this.langArr[0]
    }
  }
</script>

<style lang="scss" scoped>
  .postpageBox{
    width: 100%;
  }
  .title{
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    padding: 0 140px;
    font-weight: 400;
    & > div{
      border-bottom: 1px solid rgba(231,233,237,1);
      position: relative;
    }
  }
  .interval {
    padding-left: 20px;
  }
  .tableBox{
    height: calc(100vh - 150px);
    & > div{
      height: 100%;
      background: #fff;
      padding: 0 10px;
      border-radius: 4px;
    }
  }
  .sys-body  /deep/ .el-upload{
    position: relative;
    background-color: #182538;
    img{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .avatar-uploader /deep/ .el-upload {
    .delIcon{
      display: none;
    }
  }
  .avatar-uploader  /deep/ .el-upload:hover {
    border-color: #409EFF;
    position: relative;
    .delIcon {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 100;
      opacity: 1;
      background: #ccc;
    }
  }
  .avatar {
    width: 100%;
    height: auto;
    max-height: 100%;
    vertical-align: middle;
    display: block;
  }
  .bannerImg{
    img{
      max-width: 250px;
      height: 96px;
      width: auto;
    }
  }
  .bannerItemImg{
    /deep/ {
      .el-upload{
        width: 100%;
        background: #fff;
      }
    }
  }
</style>
<style lang="scss">
  .avatar-uploader2  .el-upload {
    .delIcon{
      display: none;
    }
  }
  .avatar-uploader2 .el-upload:hover {
    border-color: #409EFF;
    position: relative;
    .delIcon {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 100;
      opacity: 1;
      background: #ccc;
    }
  }
  .sys-body1 .el-upload{
    position: relative;
    background-color: #182538;
    img{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .fontColor1 {
    span{
      color: #34A0CE;
    }
  }
  .mobile-input {
    .el-form-item__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }

  .system_page {
    .system_page_content {
      height: calc(100vh - 150px);
      overflow-y: auto;
      min-width: 440px;
      margin: 0 auto;
      border-radius: 5px;
      padding-top: 40px;
      background-color: #fff;
      position: relative;
      .system_page_content_btn {
        /*position: absolute;*/
        width: 100%;
        box-shadow:0px -1px 0px 0px rgba(242,243,244,1);
        padding-left: 260px;
        padding-top: 20px;
        padding-bottom: 20px;
        /*bottom: 40px;*/
      }
      .system_page_form {
        /*margin: 0 20px;*/
        padding: 0 140px;
        margin-top: 30px;
        .el-input{
          width: 420px;
        }
      }
    }
    .system_page_left {
      background-color: #fff;
      /*text-align: center;*/
      border-radius: 5px;
      height: calc(100vh - 150px);
      overflow-y: auto;
      .func_choose_list {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        line-height: 40px;
      }
    }
    .fontWeight {
      font-size: 14px;
      cursor: pointer;
      flex-grow: 1;
      padding-left: 40px;
      align-self: stretch;
      /*height: 40px;*/
      /*width: 80px;*/
      /*margin: 0 auto;*/
      /*line-height: 40px;*/
    }
    .curentSystemStep {
      color: #34A0CE;
      font-weight: bold;
      border-left: 4px solid #34A0CE;
      background: rgba(244,249,253,1);
      &.fontWeight{
        padding-left: 36px;
      }
    }
    .el-tabs--left .el-tabs__header {
      background-color: #fff;
      width: 15%;
      min-width: 100px;
      border-radius: 5px;
    }
    .el-tabs--left .el-tabs__item {
      text-align: center;
    }
    .el-tabs--left .el-tabs__nav-wrap {
      padding-top: 20px;
    }
  }

  .tel-input {
    .el-form-item__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .avatar-icon{
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar-img{
    position: static !important;
    display: inline-block;
    height: 178px;
    width: auto;
    transform: translate(0, 0) !important;
  }
  .avatar-img-box{
    height: 178px;
    .el-upload{
      border: 1px dashed #d9d9d9;
      background: #fff !important;
    }
  }
  .input_weight {
    width: 90px;
    .el-input-group__append{
      padding: 0px 5px;
    }
  }
</style>
