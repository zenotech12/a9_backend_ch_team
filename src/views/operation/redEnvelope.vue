<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span ="14">
            <el-switch style="margin-top: 10px"
                       v-model="timeValidSwitch"
                       :active-text="$t('operation.valid')"
                       :inactive-text="$t('operation.all')">
            </el-switch>
          </el-col>
          <el-col :span="10" class="funcList">
            <div class="boxFuncBtn" @click="addData">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table stripe border :data="tableData" height="calc(100% - 40px)">
                <el-table-column prop="name" :label="$t('operation.name')"></el-table-column>
                <el-table-column  :label="$t('operation.totalMoney')">
                  <template  slot-scope="scope">
                    {{scope.row.used_money | price}} /  {{scope.row.total_money | price}}
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('operation.totalCount')">
                  <template  slot-scope="scope">
                    {{scope.row.used_count + '/' + scope.row.total_count}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.splitWay')">
                  <template  slot-scope="scope">
                    {{ scope.row.split_way === 1 ? $t('operation.splitWayA') : $t('operation.splitWayB')}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.triggers')">
                  <template  slot-scope="scope">
                    <el-tag v-for="(v, k) in scope.row.triggers" :key="k">{{triggersType[v-1].name}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('operation.getTime')">
                  <template  slot-scope="scope">
                    {{scope.row.bt + $t('operation.to') + scope.row.et}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "140">
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
        <el-dialog :title="$t('operation.readEnvelopeEdit')" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form">
            <el-form-item :label="$t('operation.name')">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.getTime')">
              <el-date-picker
                v-model="grantTime"
                type="daterange"
                value-format = "yyyy-MM-dd"
                :range-separator="$t('operation.to')"
                :start-placeholder="$t('tools.startDate')"
                :end-placeholder="$t('tools.endDate')"
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('operation.totalMoney')">
              <price-input v-model="form.total_money"></price-input>
            </el-form-item>
            <el-form-item :label="$t('operation.totalNum')">
              <el-input v-model.number="form.total_count"></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.splitWay')">
              <el-switch
                v-model="form.split_way"
                :active-value.number="1"
                :inactive-value.number="2"
                :active-text="$t('operation.splitWayA')"
                :inactive-text="$t('operation.splitWayB')">
              </el-switch>
            </el-form-item>
            <el-form-item :label="$t('operation.triggers')">
              <el-select multiple v-model="form.triggers" :placeholder="$t('tools.pleaseSelect')">
                <el-option
                  v-for="item in triggersType"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.triggers.indexOf(2) >= 0 " :label="$t('operation.triggersBLable')">
              <el-input v-model.number="form.consume_money"><template slot="prepend">{{$t('operation.triggersBLableA')}}</template><template slot="append">{{$t('operation.triggersBLableB')}}</template></el-input>
            </el-form-item>
            <el-form-item v-if="form.triggers.indexOf(3) >= 0" :label="$t('operation.triggersCLable')">
              <el-input v-model.number="form.recommend_new_user_count"><template slot="prepend">{{$t('operation.triggersCLableA')}}</template><template slot="append">{{$t('operation.triggersCLableB')}}</template></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.useLimit')">
              <el-switch
                v-model="form.limit"
                :active-value.number="1"
                :inactive-value.number="2"
                :active-text="$t('operation.useLimitA')"
                :inactive-text="$t('operation.useLimitB')">
              </el-switch>
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
  import { redEnvelopeAdd, redEnvelopeModify, redEnvelopeList, redEnvelopeDelete } from '@/api/operation'
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
          time_valid: 1,
          skip: '',
          limit: pz
        },
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
          this.grantTime = [data.bt, data.et]
          return data
        } else {
          this.grantTime = []
          this.validTime = []
          return {
            id: '',
            name: '',
            bt: '',
            et: '',
            total_money: 0,
            total_count: 0,
            split_way: 1,
            triggers: [],
            consume_money: 0,
            recommend_new_user_count: 0,
            limit: 1
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
          redEnvelopeModify(this.form.id, this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else {
          redEnvelopeAdd(this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
      },
      deleteDataFunc(row) {
        redEnvelopeDelete(row.id).then(res => {
          this.getDataListFun()
        })
      },
      getDataListFun() {
        redEnvelopeList(this.searchForm).then(res => {
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
