<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <!--添加-->
        <el-row>
          <el-col :span="20">
            <el-form :inline="true" :model="searchForm">
              <el-form-item>
                <el-select v-model="searchForm.status" @change="search" :placeholder="$t('lang.pleaseChooseStatus')">
                  <el-option :value="-1" :label="$t('lang.all')"></el-option>
                  <el-option :value="0" :label="$t('lang.application')"></el-option>
                  <el-option :value="1" :label="$t('lang.successApproval')"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" class="funcList">
            <div class="boxFuncBtn" @click="openDiagExport">
              <i class="el-icon-upload2"></i>
              <el-button size="small" type="text">{{$t('lang.exportPresentationList')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="24">
            <el-table stripe border v-loading="tableData.loading" :data="tableData.body" style="width: 100%">
              <el-table-column prop="bsb" :label="$t('lang.openBankCode')"></el-table-column>
              <el-table-column prop="acc" :label="$t('lang.bankCardNumber')"></el-table-column>
              <el-table-column prop="status" :label="$t('lang.state')">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status === 0" type="primary">{{$t('lang.application')}}</el-tag>
                  <el-tag v-if="scope.row.status === 1" type="success">{{$t('lang.successApproval')}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="amount" :label="$t('lang.numberN')"></el-table-column>
              <el-table-column prop="gen_time" :label="$t('lang.generationTime')"></el-table-column>
              <el-table-column :label="$t('tools.opt')">
                <template slot-scope="scope">
                  <el-button type="text" @click="approvalId(scope.row)" size="small" v-if="scope.row.status === 0">{{$t('lang.approval')}}</el-button>
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
      </div>
      <el-dialog :title="editTitle" @close="cancel('exportForm')" :close-on-click-modal="false" :visible.sync="dialogFormVisible" center width="500px" style="margin-top: 0vh">
        <el-form :model="exportForm" :rules="exportFormRule" ref="exportForm" label-width="90px">
          <el-form-item :label="$t('lang.state')" prop="status">
            <el-radio-group v-model="exportForm.status">
              <el-radio :label="-1">{{$t('lang.all')}}</el-radio>
              <el-radio :label="0">{{$t('lang.application')}}</el-radio>
              <el-radio :label="1">{{$t('lang.success')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('lang.numberBars')" prop="count">
            <el-input v-model="exportForm.count" auto-complete="off" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <confirm-button @confirmButton="exportFile('exportForm')" :disabled="disabled"></confirm-button>
          <el-button @click="cancel('exportForm')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { withdrawList, withdrawApprove, withdrawExport } from '@/api/withdrawal'
  export default {
    data() {
      return {
        searchForm: {
          skip: 0,
          limit: 10,
          status: 0
        },
        editTitle: this.$t('lang.exportFile'),
        disabled: false,
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        tableData: {
          loading: true,
          body: []
        },
        exportForm: {
          status: 0, // -1所有 0申请中 1成功 默认选0
          count: 1 // 条目数
        },
        exportFormRule: {
          status: [
            { required: true, message: this.$t('lang.pleaseChooseStatus'), trigger: 'change' }
          ],
          count: [
            { required: true, message: this.$t('lang.fillInNumberExport'), trigger: 'blur' }
          ]
        },
        dialogFormVisible: false
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
      }
    },
    methods: {
      sizeChangeFunc(val) {
        this.pageSize = val
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      exportExel() {
        withdrawExport(this.exportForm).catch(res => {
          var eleLink = document.createElement('a')
          eleLink.download = this.$t('lang.presentationList') + '.xlsx'
          eleLink.style.display = 'none'
          // 字符内容转变成blob地址
          var blob = new Blob([res])
          eleLink.href = URL.createObjectURL(blob)
          // 触发点击
          document.body.appendChild(eleLink)
          eleLink.click()
          // 然后移除
          document.body.removeChild(eleLink)
          this.dialogFormVisible = false
        })
      },
      openDiagExport() {
        this.dialogFormVisible = true
        this.disabled = false
      },
      exportFile(exportForm) {
        this.$refs[exportForm].validate((valid) => {
          if (valid) {
            this.disabled = true
            // console.log('this.exportForm', this.exportForm)
            this.exportExel()
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
      cancel(exportForm) {
        this.dialogFormVisible = false
        this.$refs[exportForm].resetFields()
      },
      approvalId(data) {
        withdrawApprove({ 'id': data.id }).then(res => {
          if (res.meta === 0) {
            this.getTableData()
            this.$message.success(this.$t('lang.successfulApproval'))
          }
        })
      },
      getTableData() {
        withdrawList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      search() {
        this.getTableData()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
