<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24" class="funcList">
            <div class="boxFuncBtn" @click="addData"  v-if="permissionCheck('opt')">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)">
                <el-table-column prop="no" :label="$t('warehouse.SupplierNum')"></el-table-column>
                <el-table-column prop="company_name" :label="$t('warehouse.corporateName')"></el-table-column>
                <el-table-column prop="business_scope" :label="$t('warehouse.MainBusiness')"></el-table-column>
                <el-table-column prop="warehouse_business_addr" :label="$t('warehouse.WarehouseAddress')"></el-table-column>
                <el-table-column prop="contacter_name" :label="$t('warehouse.contactsName')"></el-table-column>
                <el-table-column prop="mobile" :label="$t('warehouse.Tel2')"></el-table-column>
                <!-- <el-table-column prop="business_license" :label="$t('warehouse.License')">
                  <template  slot-scope="scope">
                    <el-popover v-if="scope.row.business_license" class="pointer"
                      placement="right"
                      title=""
                      trigger="click">
                      <img :src="imgUrl + scope.row.business_license" height="480"/>
                      <img slot="reference" :src="imgUrl + scope.row.business_license" style="margin-right:8px;max-height: 60px;max-width: 120px">
                    </el-popover>
                  </template>
                </el-table-column> -->
                <!-- <el-table-column prop="business_goods" :label="$t('warehouse.mainProducts')"></el-table-column> -->
                <!-- <el-table-column prop="business_type" :label="$t('warehouse.mainClass')"></el-table-column>
                <el-table-column prop="gen_time" :label="$t('warehouse.addtime')"></el-table-column> -->
                <el-table-column :label="$t('tools.opt')" width = "140"  v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showDataEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                    <span class="xiexian">/</span>
                    <delete-button  @delData="deleteDataFunc(scope.row)"></delete-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount">
                </el-pagination>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-dialog :title="$t('warehouse.SupplierSettings')" width="800px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form" :inline="true">
            <el-form-item :label="$t('warehouse.SupplierNum')">
              <el-input v-model="form.no"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.Tel2')">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.License')">
              <single-file-upload v-model="form.business_license" :promptInfo1="promptInfo"></single-file-upload>
            </el-form-item>
            <el-form-item :label="$t('warehouse.corporateName')">
              <el-input v-model="form.company_name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.MainBusiness')">
              <el-input type="textarea" v-model="form.business_scope"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.mainProducts')">
              <el-input type="textarea" v-model="form.business_goods"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.mainClass')">
              <el-input type="textarea" v-model="form.business_type"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.WarehouseAddress')">
              <el-input v-model="form.warehouse_business_addr"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.contactsName')">
              <el-input v-model="form.contacter_name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.FileUpload')">
              <el-upload
                name="image" :headers="fileUploadHeader"
                :action="importUrl"
                :on-success="handleSuccess"
                multiple
                :limit="1"
                :file-list="fileList">
                <el-button size="small" type="primary">{{$t('warehouse.upload')}}</el-button>
              </el-upload>
              <!--<span v-if="typeOpt === 'edit' && form.goods_application_file !== ''">已上传</span>-->
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { fileUploadUrl, imgGetUrl } from '@/utils/serverConfig'
  import store from '@/store'
  import { suppliersAdd, suppliersModify, suppliersList, suppliersDel } from '@/api/warehouse'
  export default {
    components: {
    },
    data() {
      const formData = this.setForm()
      const pz = 10
      return {
        triggersType: [{ code: 1, name: this.$t('operation.triggersA') }, { code: 2, name: this.$t('operation.triggersB') }, { code: 3, name: this.$t('operation.triggersC') }],
        timeValidSwitch: true,
        searchForm: {
          skip: 0,
          limit: pz
        },
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        form: formData,
        formEditDialog: false,
        submitDisabled: false,
        promptInfo: (this.$t('warehouse.promptInfo')),
        fileList: [],
        importUrl: fileUploadUrl,
        imgUrl: imgGetUrl + '?md5=',
        fileUploadHeader: { 'X-Access-Token': store.state.user.token },
        typeOpt: 'add'
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      }
    },
    methods: {
      handleSuccess(file) {
        this.form.goods_application_file = file.md5
      },
      setForm(data) {
        if (data) {
          return data
        } else {
          this.fileList = []
          return {
            id: '',
            user_id: '', // 用户id，可选项目
            no: '', // 供应商编号
            mobile: '', // 手机号
            business_license: '', // 执照
            company_name: '', // 公司名称
            business_scope: '', // 主营业务
            business_goods: '', // 主要产品
            business_type: '', // 主要类目
            warehouse_business_addr: '', // 经验仓库地址
            contacter_name: '', // 联系人名字
            goods_application_file: '' // 商品申请文件
          }
        }
      },
      addData() {
        this.typeOpt = 'add'
        this.form = this.setForm()
        this.formEditDialog = true
      },
      showDataEditor(data) {
        console.log(data)
        this.fileList = []
        this.typeOpt = 'edit'
        this.form = this.setForm(data)
        const url = imgGetUrl + '?md5=' + data.goods_application_file
        const obj = {
          name: data.goods_application_file,
          url: url
        }
        this.fileList.push(obj)
        this.formEditDialog = true
      },
      imageUploadSuccess(res) {
        this.form.image = res.md5
        console.log(res)
      },
      saveDataFunc() {
        this.submitDisabled = true
        console.log(this.form)
        if (this.form.id !== '') {
          suppliersModify(this.form.id, this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else {
          suppliersAdd(this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
      },
      deleteDataFunc(row) {
        suppliersDel(row.id).then(res => {
          this.getDataListFun()
        })
      },
      getDataListFun() {
        suppliersList(this.searchForm).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
        })
      }
    },
    mounted() {
      this.getDataListFun()
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
</style>
