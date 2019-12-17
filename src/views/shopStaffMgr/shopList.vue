<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <!--添加-->
        <el-row>
          <el-col :span="24" class="funcList">
            <div class="boxFuncBtn" @click="addShop">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="24">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" style="width: 100%">
              <el-table-column prop="name" :label="$t('lang.shopName')"></el-table-column>
              <el-table-column prop="contact" :label="$t('lang.contacts')"></el-table-column>
              <el-table-column prop="mobile" :label="$t('lang.contactNumber')"></el-table-column>
              <el-table-column prop="address" :label="$t('lang.storeAddress')"></el-table-column>
              <el-table-column prop="gen_time" :label="$t('lang.creationTime')"></el-table-column>
              <el-table-column :label="$t('tools.opt')">
                <template slot-scope="scope">
                  <el-button type="text" @click="editShop(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                  <span class="xiexian">|</span>
                  <delete-button :promptInfor="promptInfor" @delData="delShop(scope.row)"></delete-button>
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
        <el-dialog :title="editTitle" @close="cancel('form')" :close-on-click-modal="false" :visible.sync="dialogFormVisible" center width="600px" style="margin-top: 0vh">
          <el-form :model="form" :rules="formRule" ref="form" label-width="90px">
            <el-form-item :label="$t('lang.name')" prop="name">
              <el-input v-model="form.name" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.contacts')" prop="contact">
              <el-input v-model="form.contact" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.contactNumber')" prop="mobile">
              <el-input v-model="form.mobile" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.province')" prop="province">
              <el-input v-model="form.province" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.city')" prop="city">
              <el-input v-model="form.city" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.district')" prop="district">
              <el-input v-model="form.district" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.detailedAddress')" prop="addr">
              <el-input v-model="form.addr" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.longitude')" prop="longitude">
              <el-input v-model="form.longitude" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.latitude')" prop="latitude">
              <el-input v-model="form.latitude" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item class="xinghao start" prop="put_adTime" :label="$t('lang.businessHours')">
              <el-time-picker class="timedate"
                              v-model="put_adTime"
                              is-range
                              value-format="HH:mm"
                              :range-separator="$t('lang.to')"
                              :start-placeholder="$t('lang.startTime')"
                              :end-placeholder="$t('lang.endTime')"
                              @blur="timeCheck">
              </el-time-picker>
              <div class="distpicker_error" v-if="timeShow">{{$t('lang.selectTimePeriod')}}</div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="upsertShop('form')" :disabled="disabled"></confirm-button>
            <el-button @click="cancel('form')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { shopUpsert, shopList, shopInfo, shopDel } from '@/api/shopStaffMgr'
  import VDistpicker from 'v-distpicker'
  export default {
    components: { VDistpicker },
    data() {
      const validateLong = (rule, value, callback) => {
        const re = /^\d+$|^\d+\.\d+$/g
        if (!re.test(value)) {
          callback(new Error(this.$t('lang.pleaseEnterNumber')))
        } else {
          callback()
        }
      }
      const validateLat = (rule, value, callback) => {
        const re = /^\d+$|^\d+\.\d+$/g
        if (!re.test(value)) {
          callback(new Error(this.$t('lang.pleaseEnterNumber')))
        } else {
          callback()
        }
      }
      return {
        editTitle: this.$t('lang.addShop'),
        disabled: false,
        promptInfor: this.$t('lang.delShopPrompt'),
        searchForm: {
          skip: 0,
          limit: 10,
          name: ''
        },
        form: {
          id: '',
          name: '', // 名称
          contact: '',
          mobile: '',
          business_bt: '', // 时间开始
          business_et: '', // 时间结束
          coordinate: '',
          province: '',
          city: '',
          district: '',
          addr: '',
          longitude: 0,
          latitude: 0
        },
        formRule: {
          name: [
            { required: true, message: this.$t('lang.pleaseEnterName'), trigger: 'blur' }
          ],
          contact: [
            { required: true, message: this.$t('lang.pleaseEntercontacts'), trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: this.$t('lang.pleaseEntercontactNumber'), trigger: 'blur' }
          ],
          province: [
            { required: true, message: this.$t('lang.pleaseEnterprovince'), trigger: 'blur' }
          ],
          city: [
            { required: true, message: this.$t('lang.pleaseEntercity'), trigger: 'blur' }
          ],
          district: [
            { required: true, message: this.$t('lang.pleaseEnterdistrict'), trigger: 'blur' }
          ],
          addr: [
            { required: true, message: this.$t('lang.pleaseEnterdetailedAddress'), trigger: 'blur' }
          ],
          longitude: [
            { required: true, message: this.$t('lang.enterLong'), trigger: 'blur' },
            { validator: validateLong, trigger: 'blur' }
          ],
          latitude: [
            { required: true, message: this.$t('lang.enterLat'), trigger: 'blur' },
            { validator: validateLat, trigger: 'blur' }
          ]
        },
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        tableData: {
          loading: true,
          body: []
        },
        dialogFormVisible: false,
        put_adTime: '',
        timeShow: false,
        timeChecked: false,
        longitude: 0,
        latitude: 0,
        coordinate: []
      }
    },
    created() {
      document.title = this.$t('lang.streetTelevisionBackstage')
    },
    mounted() {
      this.getTableData()
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getTableData()
      },
      put_adTime(val) {
        // console.log('val', val)
        if (val !== null) {
          if (val.length === 2) {
            this.form.business_bt = val[0]
            this.form.business_et = val[1]
          }
        }
      }
    },
    methods: {
      // 开始时间段本地校验
      timeCheck() {
        if (this.put_adTime.length !== 0) {
          this.timeShow = false
          this.timeChecked = true
          $('.start').removeClass('is-error')
          $('.start').addClass('is-success')
        } else {
          this.timeShow = true
          this.timeChecked = false
          $('.start').addClass('is-error')
        }
      },
      upsertShop(form) {
        this.timeCheck()
        // this.dialogFormVisible = false
        this.$refs[form].validate((valid) => {
          if (valid && this.timeChecked) {
            this.disabled = true
            console.log('this.form', this.form)
            this.upsertData()
          } else {
            this.$alert(this.$t('lang.enterComplete'), this.$t('lang.prompt'), {
              confirmButtonText: '',
              center: true,
              type: 'warning'
            })
            this.dialogFormVisible = true
          }
        })
      },
      cancel(form) {
        this.dialogFormVisible = false
        this.$refs[form].resetFields()
      },
      addShop() {
        this.dialogFormVisible = true
        this.disabled = false
        this.form.id = ''
        this.form.name = ''
        this.form.contact = ''
        this.form.mobile = ''
        this.put_adTime = ''
        this.form.longitude = 0
        this.form.latitude = 0
        this.form.business_bt = ''
        this.form.business_et = ''
        this.form.province = ''
        this.form.city = ''
        this.form.district = ''
        this.form.addr = ''
        this.timeShow = false
        this.timeChecked = false
        $('.start').removeClass('is-error')
        $('.start').removeClass('is-success')
      },
      sizeChangeFunc(val) {
        this.pageSize = val
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      editShop(data) {
        shopInfo(data.id).then(res => {
          if (res.meta === 0) {
            console.log('res', res.item)
            this.disabled = false
            this.editTitle = this.$t('lang.editingShop')
            this.put_adTime = []
            this.dialogFormVisible = true
            this.form.id = res.item.id
            this.form.name = res.item.name
            this.form.contact = res.item.contact
            this.form.mobile = res.item.mobile
            this.put_adTime.push(res.item.business_bt)
            this.put_adTime.push(res.item.business_et)
            this.form.longitude = res.item.coordinate[0]
            this.form.latitude = res.item.coordinate[1]
            this.form.province = res.item.province
            this.form.city = res.item.city
            this.form.district = res.item.district
            this.form.addr = res.item.addr
            $('.start').removeClass('is-error')
          }
        })
      },
      getTableData() {
        shopList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      delShop(data) {
        shopDel(data.id).then(response => {
          if (response.meta === 0) {
            this.$message.success(this.$t('tools.deleteSuccess'))
            this.getTableData()
          }
        })
      },
      upsertData() {
        this.coordinate[0] = parseFloat(this.form.longitude)
        this.coordinate[1] = parseFloat(this.form.latitude)
        this.form.coordinate = JSON.stringify(this.coordinate)
        // console.log('ddd', this.form)
        shopUpsert(this.form).then(response => {
          if (response.meta === 0) {
            this.$message.success(this.$t('tools.addSuccess'))
            this.dialogFormVisible = false
            this.getTableData()
          }
        }).catch(() => {
          this.disabled = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .distpicker_error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
  }
  .xinghao>.el-form-item__label:before{
    content: "*  ";
    color: red;
  }
  .distpicker-address-wrapper select {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    padding: 0 0.75rem;
  }
</style>
