<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <!--添加-->
        <el-row>
          <el-col :span="24" class="funcList">
            <div class="boxFuncBtn" @click="addAdmin">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="24">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" style="width: 100%">
              <el-table-column prop="user_nick_name" :label="$t('sys.user')">
              </el-table-column>
              <el-table-column prop="user_login_name" :label="$t('sys.mobile')"></el-table-column>
              <el-table-column :label="$t('sys.isService')">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.customer_servicer ? 'primary' : 'success'"
                          close-transition>{{scope.row.customer_servicer?$t('tools.yes'):$t('tools.no')}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="gen_time" :label="$t('sys.genTime')"></el-table-column>
              <el-table-column :label="$t('tools.opt')">
                <template slot-scope="scope">
                  <el-button type="text" @click="editAdmin(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                  <template v-if="!scope.row.default">
                  <span class="xiexian">/</span>
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
        <el-dialog :title="editTitle" @close="cancel('form')" :close-on-click-modal="false" :visible.sync="dialogFormVisible" center width="400px" style="margin-top: 0vh">
          <el-form :model="form" :rules="formRule" ref="form" label-width="120px">
            <el-form-item :label="$t('sys.loginMobile')" prop="login_name">
              <el-input style="width: 200px" :disabled="form.id !== ''" v-model="form.mobile" auto-complete="off" clearable></el-input>
              <el-tooltip class="item" effect="dark" :content="$t('sys.loginMobileTip')" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('sys.user')" prop="real_name">
              <el-input style="width: 200px" v-model="form.nick_name" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.isService')"  prop="status">
              <el-checkbox v-model="form.customer_servicer">{{$t('tools.yes')}}</el-checkbox>
              <el-tooltip class="item" effect="dark" :content="$t('sys.serviceTip')" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('sys.permission')"  prop="status">
              <div v-for="(v, k) in permissionList" :key="k">
                <div><el-checkbox >{{$t('global.' + v.lk)}}</el-checkbox></div>
                <div v-for="(son, sk) in v.son" :key="sk">
                  <el-checkbox >{{$t('global.' + son.lk)}}</el-checkbox>
                  <div>{{son.permissions}}</div>
                  <el-checkbox v-for="per in son.permissions" :label="per" :key="per">{{$t('sys.permission_' + per)}}</el-checkbox>
                  <!--<el-checkbox-group >-->
                    <!--<el-checkbox v-for="per in son.permissions" :label="per" :key="per">{{$t('sys.permission_' + per)}}</el-checkbox>-->
                  <!--</el-checkbox-group>-->
                </div>
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
          customer_servicer: true
        },
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
        permissionList: permission
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
      }
    },
    methods: {
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
        this.dialogFormVisible = true
        this.disabled = false
        this.form.id = ''
        this.form.mobile = ''
        this.form.nick_name = ''
        this.form.customer_servicer = true
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
        this.dialogFormVisible = true
        this.form = { id: data.id, mobile: data.user_login_name, nick_name: data.user_nick_name, customer_servicer: data.customer_servicer }
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
