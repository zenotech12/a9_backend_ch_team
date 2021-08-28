<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <!--添加-->
        <el-row>
          <el-col :span="24" class="funcList" style="padding: 10px 15px; padding-right: 0">
            <div class="boxFuncBtn" @click="addAdmin" v-if="permissionCheck('opt')">
              <!-- <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add"> -->
              <el-button type="success" size="small" icon="el-icon-plus">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="24">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" style="width: 100%">
              <el-table-column label="#" width="60px">
                <template slot-scope="scope">
                  {{scope.$index + searchForm.skip + 1}}
                </template>
              </el-table-column>
              <el-table-column prop="user_nick_name" :label="$t('sys.user')">
              </el-table-column>
              <el-table-column prop="user_login_name" :label="$t('sys.mobile')"></el-table-column>
              <el-table-column prop="gen_time" :label="$t('sys.genTime')"></el-table-column>
              <el-table-column :label="$t('sys.isService')" width="200" align="center">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.customer_servicer ? 'primary' : 'danger'"
                          close-transition>{{scope.row.customer_servicer?$t('tools.yes'):$t('tools.no')}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="$t('tools.opt')" width="180" v-if="permissionCheck('opt')" align="center">
                <template slot-scope="scope">
                   <template v-if="!scope.row.default">
                  <el-button @click="editAdmin(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
            
                  <!-- <span class="xiexian">/</span> -->
                  <delete-button :promptInfor="promptInfor" @delData="delAdmin(scope.row)"></delete-button>
                  </template>
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
        <el-dialog @close="cancel('form')" :close-on-click-modal="false" :visible.sync="dialogFormVisible" center width="1000px" style="margin-top: 0vh">
          <span slot="title" style="font-weight: bold; font-size: 15px">{{editTitle}}</span>
          <el-form :model="form" :rules="formRule" ref="form" label-width="200px" label-position="left">
            <el-form-item :label="$t('sys.loginMobile')" prop="login_name">
              <el-input style="width: 200px" :disabled="form.id !== ''" v-model="form.mobile" auto-complete="off" clearable></el-input>
              <el-tooltip class="item" effect="dark" :content="$t('sys.loginMobileTip')" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('sys.user')">
              <el-input style="width: 200px" v-model="form.nick_name" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.position')">
              <el-input style="width: 200px" v-model="form.title" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('global.password')">
              <el-input style="width: 200px" type="password" v-model="form.password" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.isService')"  prop="status">
              <el-checkbox v-model="form.customer_servicer">{{$t('tools.yes')}}</el-checkbox>
              <el-tooltip class="item" effect="dark" :content="$t('sys.serviceTip')" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('sys.isNoAllowLogin')"  prop="status">
              <el-checkbox v-model="merchant_allow_login.allow">{{$t('tools.yes')}}</el-checkbox>
              <div v-if="merchant_allow_login.allow === true">
                <el-checkbox v-model="setTimeLine">{{$t('sys.setTimeDuan')}}</el-checkbox>
                <el-time-picker v-if="setTimeLine === true"
                                is-range
                                format="HH:mm" value-format="HH:mm"
                                v-model="lineTimeData"
                                :range-separator="$t('tools.to')"
                                :start-placeholder="$t('lang.startTime')"
                                :end-placeholder="$t('lang.endTime')"
                                >
                </el-time-picker>
              </div>

            </el-form-item>
            <el-form-item :label="$t('sys.permission')"  prop="status" v-if="!isOwner">
              <div v-for="(v, k) in permissionList" :key="k">
                <div>
                  <el-checkbox :indeterminate="permissionStatus[v.code]['indeterminate']" v-model="permissionStatus[v.code]['all']"  @change="menuChangeFunc($event, v)" >{{$t('global.' + v.lk)}}</el-checkbox>
                </div>
                <el-row style="padding-left: 40px" v-for="(son, sk) in v.son" :key="sk">
                  <el-col :span="12"><el-checkbox :indeterminate="permissionStatus[son.code]['indeterminate']" v-model="permissionStatus[son.code]['all']" @change="functionChangeFunc($event, son)" >{{$t('global.' + son.lk)}}</el-checkbox></el-col>
                  <el-col :span="6" v-for="(per, i) in son.permissions" :key="i"><el-checkbox  v-model="permissionStatus[son.code][per]" :label="per" :key="per" @change="permissionChangeFunc($event, son.code, per)">{{$t('sys.permission_' + per)}}</el-checkbox></el-col>
                  <!--<el-checkbox-group >-->
                    <!--<el-checkbox v-for="per in son.permissions" :label="per" :key="per">{{$t('sys.permission_' + per)}}</el-checkbox>-->
                  <!--</el-checkbox-group>-->
                </el-row>
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="upsertAdmin('form')" :disabled="disabled"></confirm-button>
            <el-button @click="cancel('form')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { customerServicesList, customerServicesDel, customerServicesModify, customerServicesAdd } from '@/api/system'
  import permission from '@/utils/permission'
  export default {
    data() {
      const ps = this.initPermissionStatus()
      return {
        editTitle: this.$t('lang.addAdmin'),
        disabled: false,
        promptInfor: this.$t('lang.delAdminTips'),
        enterpriseList: [],
        searchForm: {
          skip: 0,
          limit: 10
        },
        form: {
          id: '',
          mobile: '',
          nick_name: '',
          customer_servicer: true,
          title: '',
          merchant_allow_login: '',
          password: ''
        },
        merchant_allow_login: {
          start_t: '',
          end_t: '', // 允许登录时间段
          allow: true // 是否允许登录
        },
        setTimeLine: false,
        // lineTimeData: [new Date(2021, 9, 10, 0, 0), new Date(2021, 9, 10, 0, 0)],
        lineTimeData: ['00:00', '00:00'],
        formRule: {
          mobile: [
            // { validator: checkMobile, trigger: 'blur' },
            { required: true, message: this.$t('lang.pleaseEnterPhoneNumber'), trigger: 'blur' }
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
        permissionList: permission,
        permissionSelect: {},
        permissionStatus: ps,
        isOwner: false
      }
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
      lineTimeData(val) {
        if (val && val.length === 2) {
          console.log('vvv', val)
          this.merchant_allow_login.start_t = val[0]
          this.merchant_allow_login.end_t = val[1]
        } else {
          this.merchant_allow_login.start_t = ''
          this.merchant_allow_login.end_t = ''
        }
      },
      permissionSelect: {
        handler(val) {
          permission.forEach(item => {
            let childrenAllNum = 0
            let isSet = 0
            item.son.forEach(son => {
              if (val[son.code]) {
                isSet++
                if (val[son.code].length === son.permissions.length) {
                  this.$set(this.permissionStatus[son.code], 'indeterminate', false)
                  this.$set(this.permissionStatus[son.code], 'all', true)
                  childrenAllNum++
                } else {
                  this.$set(this.permissionStatus[son.code], 'indeterminate', true)
                  this.$set(this.permissionStatus[son.code], 'all', false)
                }
                son.permissions.forEach(p => {
                  this.$set(this.permissionStatus[son.code], p, val[son.code].indexOf(p) >= 0)
                })
              } else {
                this.$set(this.permissionStatus[son.code], 'indeterminate', false)
                this.$set(this.permissionStatus[son.code], 'all', false)
                son.permissions.forEach(p => {
                  this.$set(this.permissionStatus[son.code], p, false)
                })
              }
            })
            if (childrenAllNum >= item.son.length) {
              this.$set(this.permissionStatus[item.code], 'indeterminate', false)
              this.$set(this.permissionStatus[item.code], 'all', true)
            } else {
              this.$set(this.permissionStatus[item.code], 'all', false)
              this.$set(this.permissionStatus[item.code], 'indeterminate', isSet > 0)
            }
            if (isSet > 0) {
              if (!this.permissionSelect[item.code]) {
                this.permissionSelect[item.code] = ['view']
              }
            } else if (this.permissionSelect[item.code]) {
              delete this.permissionSelect[item.code]
            }
          })
        },
        deep: true
      }
    },
    methods: {
      initPermissionStatus() {
        const ps = {}
        permission.forEach(item => {
          this.$set(ps, item.code, {})
          item.son.forEach(son => {
            this.$set(ps, son.code, {})
          })
        })
        return ps
      },
      permissionChangeFunc(val, code, per) {
        if (val) {
          if (!this.permissionSelect[code]) {
            this.$set(this.permissionSelect, code, [per])
          } else {
            if (this.permissionSelect[code].indexOf(per) < 0) {
              this.permissionSelect[code].push(per)
              // this.$set(this.permissionSelect, code, JSON.parse(JSON.stringify([...this.permissionSelect[code], per])))
              // console.log(this.permissionSelect)
            }
          }
        } else {
          if (this.permissionSelect[code]) {
            this.permissionSelect[code].splice(this.permissionSelect[code].indexOf(per), 1)
            if (this.permissionSelect[code].length < 1) {
              this.$delete(this.permissionSelect, code)
            }
          }
        }
      },
      functionChangeFunc(val, son) {
        if (val) {
          this.$set(this.permissionSelect, son.code, JSON.parse(JSON.stringify(son.permissions)))
        } else {
          this.$delete(this.permissionSelect, son.code)
        }
      },
      menuChangeFunc(val, v) {
        if (val) {
          v.son.forEach(item => {
            this.$set(this.permissionSelect, item.code, JSON.parse(JSON.stringify(item.permissions)))
          })
        } else {
          v.son.forEach(item => {
            this.$delete(this.permissionSelect, item.code)
          })
        }
      },
      checkedPwd() {
        if (this.form.pass === '') {
          this.passShow = true
          $('.start').addClass('is-error')
        } else {
          this.passShow = false
          $('.start').removeClass('is-error')
        }
      },
      passwordCheck() {
        if (this.form.id === '') {
          if (this.form.pass !== '') {
            this.passShow = false
            this.passChecked = true
            $('.start').removeClass('is-error')
          } else {
            this.passShow = true
            this.passChecked = false
            $('.start').addClass('is-error')
          }
        } else {
          this.passShow = false
          this.passChecked = true
        }
      },
      upsertAdmin(form) {
        console.log('merchant_allow_login', this.merchant_allow_login)
        this.dialogFormVisible = false
        this.passwordCheck()
        this.$refs[form].validate((valid) => {
          if (valid && this.passChecked) {
            this.disabled = true
            this.upsertData(this.type)
          } else {
            this.$alert(this.$t('lang.pleaseEnterComplete'), this.$t('lang.tips'), {
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
        this.passShow = false
        this.$refs[form].resetFields()
        $('.start').removeClass('is-error')
      },
      addAdmin() {
        this.permissionSelect = {}
        this.dialogFormVisible = true
        this.isOwner = false
        this.disabled = false
        this.form.id = ''
        this.form.mobile = ''
        this.form.nick_name = ''
        this.form.customer_servicer = true
        this.form.title = ''
        this.form.password = ''
        this.merchant_allow_login.allow = true
        this.form.merchant_allow_login = ''
        this.setTimeLine = false
        this.type = 'add'
        this.editTitle = this.$t('lang.addAdmin')
      },
      sizeChangeFunc(val) {
        this.pageSize = val
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      editAdmin(data) {
        this.disabled = false
        this.editTitle = this.$t('lang.editAdmin')
        this.permissionSelect = data.permissions ? JSON.parse(JSON.stringify(data.permissions)) : {}
        this.dialogFormVisible = true
        this.isOwner = data.default
        this.merchant_allow_login = data.merchant_allow_login
        if (data.merchant_allow_login.start_t !== '') {
          this.setTimeLine = true
          this.lineTimeData = [data.merchant_allow_login.start_t, data.merchant_allow_login.end_t]
        } else {
          this.setTimeLine = false
          this.lineTimeData = ['00:00', '00:00']
        }
        this.form = { id: data.id, password: '', mobile: data.user_login_name, nick_name: data.user_nick_name,
          customer_servicer: data.customer_servicer, title: data.title, merchant_allow_login: data.merchant_allow_login }
      },
      getTableData() {
        customerServicesList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      delAdmin(data) {
        customerServicesDel(data.id).then(response => {
          if (response.meta === 0) {
            this.$message.success(this.$t('lang.successfulDel'))
            this.getTableData()
          }
        })
      },
      search() {
        this.getTableData()
      },
      upsertData(data) {
        if (!this.form.mobile) {
          this.$message.error(this.$t('sys.mobileTip'))
          return
        }
        this.form.permissions = JSON.stringify(this.permissionSelect)
        if (this.merchant_allow_login.allow === true && this.setTimeLine === false) {
          this.merchant_allow_login.start_t = ''
          this.merchant_allow_login.end_t = ''
        }
        this.form.merchant_allow_login = JSON.stringify(this.merchant_allow_login)
        if (!this.form.id) {
          customerServicesAdd(this.form).then(response => {
            if (response.meta === 0) {
              this.$message.success(this.$t('lang.successfulPresservation'))
              this.dialogFormVisible = false
              this.getTableData()
            }
          })
        } else {
          customerServicesModify(this.form.id, this.form).then(response => {
            if (response.meta === 0) {
              this.$message.success(this.$t('lang.successfulPresservation'))
              this.dialogFormVisible = false
              this.getTableData()
            }
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .sys-page {
    .distpicker_error {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }
</style>

