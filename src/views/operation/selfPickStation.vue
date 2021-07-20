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
                <el-table-column label="#" width="60px">
                  <template slot-scope="scope">
                    {{scope.$index + searchForm.skip + 1}}
                  </template>
                </el-table-column>
                <el-table-column prop="name" :label="$t('operation.name')"></el-table-column>
                <el-table-column prop="tel" width="150" :label="$t('operation.tel')"></el-table-column>
                <el-table-column :label="$t('operation.address')">
                  <template slot-scope="scope">
                    {{scope.row.addr.province + scope.row.addr.city + scope.row.addr.district + scope.row.addr.addr + '(' + scope.row.addr.coord.join(',') +  ')' }}
                  </template>
                </el-table-column>
                <el-table-column label="已完成订单量" width="150">
                  <template slot-scope="scope">
                    <el-button type="text">{{scope.row.order_complete_count}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="订单存量" width="150">
                  <template slot-scope="scope">
                    <el-button type="text">{{scope.row.order_store_count}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="gen_time" :label="$t('sys.addTime')" width="200"></el-table-column>
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
        <el-dialog :title="$t('operation.selfPickStationSet')" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="120px" :model="form">
            <el-form-item :label="$t('operation.name')">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.tel')">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item class="start" :label="$t('sys.address1')">
              <map-selector v-model="formAddress"></map-selector>
              <div class="distpicker_error" v-if="placeShow">{{$t('sys.selectAddress')}}</div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
        <el-dialog title="订单量" width="700px" @close="orderDialog=false" :visible.sync="orderDialog" :close-on-click-modal="false" center >

          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="orderDialog = false">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { selfPickStations, selfPickStationsModify, selfPickStationsList, selfPickStationsDel } from '@/api/operation'
  export default {
    components: {
    },
    data() {
      const formData = this.setForm()
      const pz = 10
      return {
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
        formAddress: {
          province: '',
          city: '',
          area: '',
          address: '',
          lon: 104.917445,
          lat: 11.558831
        },
        placeShow: false,
        placeChecked: false,
        formEditDialog: false,
        submitDisabled: false,
        orderDialog: false
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
      placeCheck() {
        if (this.formAddress.province !== '' && this.formAddress.city !== '' && this.formAddress.area !== '' && this.formAddress.address !== '' && this.formAddress.lat !== '' && this.formAddress.lon !== '') {
          this.placeShow = false
          this.placeChecked = true
        } else {
          this.placeShow = true
          this.placeChecked = false
        }
      },
      setForm(data) {
        if (data) {
          return data
        } else {
          return {
            id: '',
            name: '',
            tel: '',
            addr: ''
          }
        }
      },
      addData() {
        this.form = this.setForm()
        this.formAddress = {
          province: '',
          city: '',
          area: '',
          address: '',
          lon: 104.917445,
          lat: 11.558831
        }
        this.formEditDialog = true
      },
      showDataEditor(data) {
        console.log(data)
        // this.form = this.setForm(data)
        this.form.name = data.name
        this.form.id = data.id
        this.form.tel = data.tel
        this.form.addr = JSON.stringify(data.addr)
        const addr = data.addr
        const obj = {
          province: addr.province,
          city: addr.city,
          area: addr.district,
          address: addr.addr,
          lon: addr.coord[0],
          lat: addr.coord[1]
        }
        this.formAddress = obj
        this.formEditDialog = true
      },
      imageUploadSuccess(res) {
        this.form.image = res.md5
        console.log(res)
      },
      saveDataFunc() {
        this.submitDisabled = true
        const addrForm = {
          province: this.formAddress.province,
          city: this.formAddress.city,
          district: this.formAddress.area,
          addr: this.formAddress.address,
          coord: [this.formAddress.lon, this.formAddress.lat]
        }
        this.form.addr = JSON.stringify(addrForm)
        this.placeCheck()
        if (this.placeChecked === false) {
          this.$message.error(this.$t('sys.pleaseFillCompleteAddr'))
          this.submitDisabled = false
          return
        }
        console.log('addr', this.form)
        if (this.form.id !== '') {
          selfPickStationsModify(this.form.id, this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else {
          selfPickStations(this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
      },
      deleteDataFunc(row) {
        selfPickStationsDel(row.id).then(res => {
          this.getDataListFun()
        })
      },
      getDataListFun() {
        selfPickStationsList(this.searchForm).then(res => {
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
