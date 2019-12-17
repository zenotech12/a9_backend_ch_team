<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <!--添加-->
        <el-row>
          <el-col :span="12">
            <el-form :inline="true" :model="searchForm">
              <el-form-item>
                <el-select v-model="searchForm.online" @change="search" placeholder="请选择">
                  <el-option :value="-1" :label="$t('lang.all')"></el-option>
                  <el-option :value="0" :label="$t('lang.notOnline')"></el-option>
                  <el-option :value="1" :label="$t('lang.online')"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="searchForm.sn" :placeholder="$t('lang.pleaseEnterTraySn')" clearable></el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 0">
                <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="funcList">
            <div class="boxFuncBtn" @click="addTray">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
            <div class="boxFuncBtn" @click="batchUpgrade" style="margin-right: 20px">
              <i class="el-icon-upload2"></i>
              <el-button size="small" style="color: red;" type="text">{{$t('lang.batchUpgrade')}}</el-button>
            </div>
            <el-upload ref="fileUploader" style="float: right;margin-right: 20px;"
                       :headers="fileUploadHeader"
                       :action="fileUploadUrl"
                       :on-success="importUploadFunc"
                       :before-upload="beforeCertificateUpload"
                       :show-file-list="false">
              <i class="el-icon-upload2"></i>
              <el-button size="small" type="text">{{$t('tools.bulkImport')}}</el-button>
            </el-upload>
          </el-col>
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="24">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" class="demo-table-expand">
                    <el-row :gutter="20">
                      <el-col :span="4" v-for="(item, k) in props.row.charge_interfaces" :key="k">
                        <el-form-item :label="$t('lang.chargingNumber')">
                          <span>{{ item.n }}</span>
                        </el-form-item>
                        <el-form-item :label="$t('lang.state')">
                          <el-tag type="danger" v-if="item.s === 0">{{$t('lang.nullcharging')}}</el-tag>
                          <el-tag type="success" v-if="item.s === 1">{{$t('lang.hascharging')}}</el-tag>
                          <el-tag type="danger" v-if="item.s === 2">{{$t('lang.chargingPoNotNormal')}}</el-tag>
                          <el-tag type="danger" v-if="item.s === 3">{{$t('lang.unableCharging')}}</el-tag>
                        </el-form-item>
                        <el-form-item :label="$t('lang.chargingTreasureNumber')">
                          <span>{{ item.sn }}</span>
                        </el-form-item>
                        <el-form-item :label="$t('lang.chargingVolume')">
                          <span v-if="item.e === 0">0 - 9%</span>
                          <span v-if="item.e === 1">10 - 19%</span>
                          <span v-if="item.e === 2">20 - 29%</span>
                          <span v-if="item.e === 3">30 - 39%</span>
                          <span v-if="item.e === 4">40 - 49%</span>
                          <span v-if="item.e === 5">50 - 59%</span>
                          <span v-if="item.e === 6">60 - 69%</span>
                          <span v-if="item.e === 7">70 - 79%</span>
                          <span v-if="item.e === 8">80 - 89%</span>
                          <span v-if="item.e === 9">90 - 99%</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="partner_name" :label="$t('lang.shopName')"></el-table-column>
              <el-table-column prop="inventory" :label="$t('lang.stock')"></el-table-column>
              <el-table-column prop="sn" :label="$t('lang.sn')"></el-table-column>
              <el-table-column :label="$t('lang.isOnline')">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.online === true ? 'primary' : 'success'"
                          close-transition>{{scope.row.online === true ? $t('lang.online') : $t('lang.notOnline')}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="fireware_version" :label="$t('lang.firmwareVersion')"></el-table-column>
              <el-table-column prop="no" :label="$t('lang.number')"></el-table-column>
              <el-table-column prop="charge_num" :label="$t('lang.chargingPortsNumber')"></el-table-column>
              <el-table-column prop="gen_time" :label="$t('lang.addTime')"></el-table-column>
              <el-table-column :label="$t('tools.opt')">
                <template slot-scope="scope">
                  <el-button type="text" v-if="scope.row.online" @click="firmwareUpdate(scope.row)" size="small">{{$t('lang.firmwareUpdate')}}</el-button>
                  <span class="xiexian" v-if="scope.row.online">|</span>
                  <el-button type="text" v-if="scope.row.charge_num > 0" @click="outCharge(scope.row)" size="small">{{$t('lang.eject')}}</el-button>
                  <span class="xiexian" v-if="scope.row.charge_num > 0">|</span>
                  <el-button type="text" @click="restartTray(scope.row)" size="small">{{$t('lang.restart')}}</el-button>
                  <span class="xiexian">|</span>
                  <el-button type="text" @click="editTray(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                  <span class="xiexian">|</span>
                  <delete-button :promptInfor="promptInfor" @delData="deleteTray(scope.row)"></delete-button>
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
        <el-dialog :title="editTitle" @close="cancel('form')" :close-on-click-modal="false" :visible.sync="dialogFormVisible" center width="550px" style="margin-top: 0vh">
          <el-form :model="form" :rules="formRule" ref="form" label-width="90px">
            <el-form-item :label="$t('lang.shop')" prop="partner_id">
              <el-select v-model="form.partner_id" filterable :placeholder="$t('tools.pleaseChoose')">
                <el-option
                  v-for="item in shopListArray"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('lang.traySn')" prop="sn">
              <el-input v-model="form.sn" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="upsertTray('form')" :disabled="disabled"></confirm-button>
            <el-button @click="cancel('form')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="$t('lang.ejectionPort')" @close="outChargeCancel('outChargeForm')" :close-on-click-modal="false" :visible.sync="dialogOutCharge" center width="770px" class="dialogOutPop" style="margin-top: 0vh">
          <el-form :model="outChargeForm" :rules="outChargeFormRule" ref="outChargeForm" label-width="120px">
            <el-form-item :label="$t('lang.chargingPortOut')" prop="charge_num">
              <el-radio-group v-model="outChargeForm.charge_num">
                <el-radio :label="0">{{$t('lang.popUpAll')}}</el-radio>
                <el-radio :label="n" :key="k" v-for="(n, k) in charge_num">{{$t('lang.ejectionPort')}}{{n}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="upsertOutCharge('outChargeForm')" :disabled="disabledOut"></confirm-button>
            <el-button @click="outChargeCancel('outChargeForm')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="$t('lang.restart')" @close="restartCancel('restart')" :close-on-click-modal="false" :visible.sync="dialogRestart" center width="770px" style="margin-top: 0vh">
          <el-form :model="restart" :rules="restartRule" ref="restart" label-width="80px">
            <el-form-item :label="$t('lang.restart')" prop="dev">
              <el-radio-group v-model="restart.dev">
                <el-radio :label="0">{{$t('lang.restartAllDevices')}}</el-radio>
                <el-radio :label="1">{{$t('lang.restartCommunicationModule')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="upsertRestart('restart')" :disabled="disabledRestart"></confirm-button>
            <el-button @click="restartCancel('restart')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="$t('lang.firmwareUpdate')" @close="cancelFirmvare('firmwareUpdateForm')" :close-on-click-modal="false" :visible.sync="firewareDialog" center width="600px" style="margin-top: 0vh">
          <el-form :model="firmwareUpdateForm" :rules="firmwareUpdateFormRule" ref="firmwareUpdateForm" label-width="90px">
            <el-form-item :label="$t('lang.updateAddress')" prop="url">
              <el-input v-model="firmwareUpdateForm.url" :placeholder="$t('lang.pleaseEnterUpdateAddreesOrUpload')" clearable auto-complete="off"></el-input>
              <el-upload ref="uploader" name="file"
                         :headers="fileUploadHeader"
                         :action="fileUploadUrlBig"
                         :on-success="firmwareUploadFunc">
                <el-button size="small" style="margin-top: 10px" type="primary">{{$t('lang.clickUpload')}}</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="upsertFirmware('firmwareUpdateForm')" :disabled="disabled"></confirm-button>
            <el-button @click="cancelFirmvare('firmwareUpdateForm')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { firewareUpdata, cabinetUpsert, cabinetList, cabinetDel, cabinetEject, cabinetReboot } from '@/api/tray'
  import { shopList } from '@/api/shopStaffMgr'
  import store from '@/store'
  import { fileUrlApk } from '@/utils/serverConfig'
  import service from '@/utils/request'
  export default {
    data() {
      return {
        fileUploadUrlBig: fileUrlApk,
        fileUploadUrl: service.defaults.baseURL + 'cabinet/no-sn/import',
        fileUploadHeader: { 'X-Access-Token': store.state.user.token },
        importPara: {},
        editTitle: this.$t('lang.addTray'),
        disabled: false,
        disabledOut: false,
        promptInfor: this.$t('lang.delTrayPrompt'),
        searchForm: {
          skip: 0,
          limit: 10,
          sn: '',
          online: -1
        },
        form: {
          id: '',
          sn: '', // 托盘sn号
          partner_id: ''
        },
        formRule: {
          sn: [
            { required: true, message: this.$t('lang.pleaseEnterTraySn'), trigger: 'blur' }
          ],
          partner_id: [
            { required: true, message: this.$t('lang.pleaseSelectShop'), trigger: 'change' }
          ]
        },
        outChargeForm: {
          id: '',
          sn: '', // 托盘sn号
          charge_num: null
        },
        outChargeFormRule: {
          charge_num: [
            { required: true, message: this.$t('lang.pleaseSelectEjectionPort'), trigger: 'change' }
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
        shopListArray: [],
        dialogOutCharge: false,
        charge_num: null,
        restart: {
          id: '',
          sn: '',
          dev: 0 // 0：重启所有设备、包含自身，1：重启通讯模块
        },
        restartRule: {
          dev: [
            { required: true, message: this.$t('lang.pleaseSelectEjectionPort'), trigger: 'change' }
          ]
        },
        dialogRestart: false,
        disabledRestart: false,
        // 固件升级
        firmwareUpdateForm: {
          url: '',
          cabinet_id: ''
        },
        firewareDialog: false,
        firmwareUpdateFormRule: {
          url: [
            { required: true, message: this.$t('lang.pleaseEnterUpdateAddreesOrUpload'), trigger: 'change' }
          ]
        },
        disabledFirmvare: false
      }
    },
    created() {
      document.title = this.$t('lang.streetTelevisionBackstage')
    },
    mounted() {
      this.getTableData()
      this.getShopList()
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getTableData()
      }
    },
    methods: {
      // 固件升级部分
      // 每行后面升级
      firmwareUpdate(data) {
        this.firmwareUpdateForm.cabinet_id = data.id
        this.firewareDialog = true
        this.disabledFirmvare = false
      },
      // 批量升级
      batchUpgrade() {
        this.firmwareUpdateForm.cabinet_id = ''
        this.firewareDialog = true
        this.disabledFirmvare = false
      },
      firmwareUploadFunc(res) {
        if (res.meta === 0) {
          this.firmwareUpdateForm.url = res.url
        }
      },
      // 提交
      upsertFirmware(firmwareUpdateForm) {
        this.firewareDialog = false
        this.$refs[firmwareUpdateForm].validate((valid) => {
          if (valid) {
            this.disabledFirmvare = true
            firewareUpdata(this.firmwareUpdateForm).then(res => {
              if (res.meta === 0) {
                this.$message.success(this.$t('lang.successUpgrade'))
              }
            }).catch(res => {
              this.disabledFirmvare = false
            })
          } else {
            this.$alert(this.$t('lang.enterComplete'), this.$t('lang.prompt'), {
              confirmButtonText: '',
              center: true,
              type: 'warning'
            })
            this.firewareDialog = true
          }
        })
      },
      cancelFirmvare(firmwareUpdateForm) {
        this.firewareDialog = false
        this.$refs.uploader.clearFiles()
        this.$refs[firmwareUpdateForm].resetFields()
      },
      importUploadFunc(res) {
        if (res.meta === 0) {
          // console.log('res', res)
          this.$message.success(this.$t('tools.successfulImport') + res.error + this.$t('tools.data'))
          this.getTableData()
        }
      },
      beforeCertificateUpload(file) {
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        const isTxt = testmsg === 'txt'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isTxt) {
          this.$message.error(this.$t('lang.uplodFileTXT'))
        }
        if (!isLt2M) {
          this.$message.error(this.$t('lang.uplodFileSize'))
        }
        return isTxt && isLt2M
      },
      // 重启
      restartTray(data) {
        this.dialogRestart = true
        this.restart.dev = 0
        this.disabledRestart = false
        this.restart.id = data.id
        this.restart.sn = data.sn
      },
      restartCancel(restart) {
        this.dialogRestart = false
        this.$refs[restart].resetFields()
      },
      upsertRestart(restart) {
        this.dialogRestart = false
        this.$refs[restart].validate((valid) => {
          if (valid) {
            this.disabledRestart = true
            cabinetReboot(this.restart).then(response => {
              if (response.meta === 0) {
                this.$message.success(this.$t('lang.restartSuccess'))
                this.dialogRestart = false
                this.getTableData()
              }
            })
          } else {
            this.$alert(this.$t('tools.enterComplete'), this.$t('tools.prompt'), {
              confirmButtonText: '',
              center: true,
              type: 'warning'
            })
            this.dialogRestart = true
          }
        })
      },
      // 获取店铺列表
      getShopList() {
        shopList().then(res => {
          if (res.meta === 0) {
            this.shopListArray = res.items
          }
        })
      },
      outChargeCancel(outChargeForm) {
        this.dialogOutCharge = false
        this.$refs[outChargeForm].resetFields()
      },
      outCharge(data) {
        this.dialogOutCharge = true
        this.disabledOut = false
        this.outChargeForm.charge_num = null
        this.outChargeForm.id = data.id
        this.charge_num = data.charge_num
      },
      upsertOutCharge(outChargeForm) {
        this.dialogOutCharge = false
        this.$refs[outChargeForm].validate((valid) => {
          if (valid) {
            this.disabledOut = true
            cabinetEject(this.outChargeForm).then(response => {
              if (response.meta === 0) {
                this.$message.success(this.$t('lang.ejectionSuccess'))
                this.dialogOutCharge = false
                this.getTableData()
              }
            })
          } else {
            this.$alert(this.$t('tools.enterComplete'), this.$t('tools.prompt'), {
              confirmButtonText: '',
              center: true,
              type: 'warning'
            })
            this.dialogOutCharge = true
          }
        })
      },
      upsertTray(form) {
        this.dialogFormVisible = false
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.disabled = true
            this.upsertData()
          } else {
            this.$alert(this.$t('tools.enterComplete'), this.$t('tools.prompt'), {
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
      addTray() {
        this.dialogFormVisible = true
        this.disabled = false
        this.form.id = ''
        this.form.partner_id = ''
        this.form.sn = ''
      },
      sizeChangeFunc(val) {
        this.pageSize = val
        // this.searchForm.skip = (this.currentPage - 1) * val
        // this.searchForm.limit = val
        // this.getTableData()
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      editTray(data) {
        this.disabled = false
        this.editTitle = this.$t('lang.editTray')
        this.dialogFormVisible = true
        this.form.id = data.id
        this.form.sn = data.sn
        this.form.partner_id = data.partner_id
      },
      getTableData() {
        cabinetList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      deleteTray(data) {
        cabinetDel(data.id).then(response => {
          if (response.meta === 0) {
            this.$message.success(this.$t('tools.deleteSuccess'))
            this.getTableData()
          }
        })
      },
      search() {
        this.getTableData()
      },
      upsertData() {
        cabinetUpsert(this.form).then(response => {
          if (response.meta === 0) {
            this.$message.success(this.$t('tools.addSuccess'))
            this.dialogFormVisible = false
            this.getTableData()
          }
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .dialogOutPop {
    .el-radio-button__inner, .el-radio-group {
      line-height: 40px;
    }
  }
</style>
