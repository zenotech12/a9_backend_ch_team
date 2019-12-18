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
              <el-table-column prop="login_name" :label="$t('lang.adminLoginName')"></el-table-column>
              <el-table-column prop="real_name" :label="$t('lang.realName')"></el-table-column>
              <el-table-column prop="mobile" :label="$t('lang.phoneNumber')"></el-table-column>
              <el-table-column :label="$t('lang.state')">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status === 1 ? 'primary' : 'success'"
                          close-transition>{{scope.row.status === 1?$t('lang.normal'):$t('lang.prohibit')}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="comment" :label="$t('lang.note')"></el-table-column>
              <el-table-column :label="$t('tools.opt')">
                <template slot-scope="scope">
                  <el-button type="text" @click="editAdmin(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                  <span class="xiexian">|</span>
                  <delete-button :promptInfor="promptInfor" @delData="delAdmin(scope.row)"></delete-button>
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
            <el-form-item :label="$t('lang.adminLoginName')" label-width="80px" prop="login_name">
              <el-input v-model="form.login_name" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.realName')" label-width="80px" prop="real_name">
              <el-input v-model="form.real_name" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.pass')" class="start" label-width="80px">
              <el-input v-model="form.pass" :placeholder="$t('lang.passwordTips')" auto-complete="off" clearable @blur="checkedPwd"></el-input>
              <div class="distpicker_error" v-if="passShow">{{$t('lang.pleaseEnterPassword')}}</div>
            </el-form-item>
            <el-form-item :label="$t('lang.phoneNumber')" label-width="80px" prop="mobile">
              <el-input v-model="form.mobile" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('lang.state')" label-width="80px" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">{{$t('lang.normal')}}</el-radio>
                <el-radio :label="2">{{$t('lang.prohibit')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('lang.note')" label-width="80px">
              <el-input v-model="form.comment" auto-complete="off" clearable></el-input>
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
  import { adminAccountsUpsert, adminAccountsList, adminAccountsDel, adminAccountsModify } from '@/api/system'
  export default {
    data() {
      return {
        editTitle: this.$t('lang.addAdmin'),
        disabled: false,
        promptInfor: this.$t('lang.delAdminTips'),
        enterpriseList: [],
        searchForm: {
          skip: 0,
          limit: 10,
          key_login_name: '',
          key_real_name: ''
        },
        form: {
          login_name: '',
          pass: '',
          real_name: '',
          mobile: '',
          status: '1', // 账号状态 1正常 2禁止
          comment: ''
        },
        formRule: {
          login_name: [
            { required: true, message: this.$t('lang.pleaseEnterLogin'), trigger: 'blur' }
          ],
          pass: [
            { required: true, message: this.$t('lang.pleaseEnterPassword'), trigger: 'blur' }
          ],
          mobile: [
            // { validator: checkMobile, trigger: 'blur' },
            { required: true, message: this.$t('lang.pleaseEnterPhoneNumber'), trigger: 'blur' }
          ],
          real_name: [
            { required: true, message: this.$t('lang.pleaseEnterRealName'), trigger: 'blur' }
          ],
          status: [
            { required: true, message: this.$t('lang.pleaseChooseStatus'), trigger: 'change' }
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
        passShow: false,
        passChecked: false,
        currentId: '',
        type: 'add'
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
        this.form.real_name = ''
        this.form.login_name = ''
        this.form.pass = ''
        this.form.mobile = ''
        this.form.status = 1
        this.form.comment = ''
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
        this.form = JSON.parse(JSON.stringify(data))
        this.currentId = data.id
        this.type = 'modify'
      },
      getTableData() {
        adminAccountsList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      delAdmin(data) {
        adminAccountsDel(data.id).then(response => {
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
        if (data === 'add') {
          adminAccountsUpsert(this.form).then(response => {
            if (response.meta === 0) {
              this.$message.success(this.$t('lang.successfulPresservation'))
              this.dialogFormVisible = false
              this.getTableData()
            }
          })
        } else if (data === 'modify') {
          adminAccountsModify(this.currentId, this.form).then(response => {
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
