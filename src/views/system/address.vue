<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row  v-if="permissionCheck('opt')">
          <el-col :span="24" class="funcList">
            <div class="boxFuncBtn" @click="addData">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table stripe border :data="tableData" height="calc(100% - 5px)">
                <el-table-column prop="contacter_name" :label="$t('sys.contacterName')"></el-table-column>
                <el-table-column prop="mobile" :label="$t('sys.mobile')"></el-table-column>
                <el-table-column prop="province" :label="$t('sys.province')"></el-table-column>
                <el-table-column prop="city" :label="$t('sys.city')"></el-table-column>
                <el-table-column prop="district" :label="$t('sys.district')"></el-table-column>
                <el-table-column prop="addr" :label="$t('sys.addr')"></el-table-column>
                <el-table-column  :label="$t('sys.default')">
                  <template  slot-scope="scope">
                    <el-tag v-if="scope.row.default" type="success">{{$t('tools.yes')}}</el-tag>
                    <el-tag v-else type="info">{{$t('tools.no')}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "140"  v-if="permissionCheck('opt')">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showDataEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                    <span class="xiexian">/</span>
                    <delete-button  @delData="deleteDataFunc(scope.row)"></delete-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <el-dialog :title="$t('sys.addrEdit')" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form">
            <el-form-item :label="$t('sys.contacterName')">
              <el-input v-model="form.contacter_name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.mobile')">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.province')">
              <el-input v-model="form.province"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.city')">
              <el-input v-model="form.city"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.district')">
              <el-input v-model="form.district"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.addr')">
              <el-input v-model="form.addr"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.lngAndlat')">
              <el-col :span="8">
                <el-input v-model="form.lng" :placeholder="$t('sys.lng')"></el-input>
              </el-col>
              <el-col :span="8">
                <el-input v-model="form.lat" :placeholder="$t('sys.lat')"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('sys.default')">
              <el-checkbox v-model="form.default"></el-checkbox>
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
  import { shippingAddressesList, shippingAddressesDel, shippingAddressesAdd, shippingAddressesModify } from '@/api/system'
  export default {
    components: {
    },
    data() {
      const formData = this.setForm()
      const pz = 10
      return {
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        grantTime: [], // 发放时段
        form: formData,
        formEditDialog: false,
        submitDisabled: false
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      grantTime(val) {
        if (val.length > 0) {
          this.form.bt = val[0]
          this.form.et = val[1]
        }
      },
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      }
    },
    methods: {
      setForm(data) {
        if (data) {
          return data
        } else {
          return {
            id: '',
            province: '',
            city: '',
            districe: '',
            addr: '',
            default: false,
            contacter_name: '',
            mobile: '',
            area_code: '',
            lng: 0,
            lat: 0
          }
        }
      },
      addData() {
        this.form = this.setForm()
        this.formEditDialog = true
      },
      showDataEditor(data) {
        console.log(data)
        this.form = this.setForm(data)
        this.formEditDialog = true
      },
      imageUploadSuccess(res) {
        this.form.image = res.md5
        console.log(res)
      },
      saveDataFunc() {
        this.submitDisabled = true
        console.log(this.form)
        this.form.triggers = JSON.stringify(this.form.triggers)
        if (this.form.id !== '') {
          shippingAddressesModify(this.form.id, this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else {
          shippingAddressesAdd(this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
      },
      deleteDataFunc(row) {
        shippingAddressesDel(row.id).then(res => {
          this.getDataListFun()
        })
      },
      getDataListFun() {
        shippingAddressesList(this.searchForm).then(res => {
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

</style>
