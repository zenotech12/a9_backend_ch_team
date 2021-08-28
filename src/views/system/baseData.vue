<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <el-row>
        <el-col :span="4" class="funcTree" style="margin-left: 0">
          <el-row>
            <el-col :span="24" class="funcBoxTitle">
              <div class="small_title">{{$t('goods.type')}}</div>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24" style="text-align: right; padding: 10px">
              <template v-if="permissionCheck('opt')" style="padding: 10px 50px">
                <el-button type="success" size="small" @click="showTypeEditForm" icon="el-icon-plus">{{$t('goods.addType')}}</el-button>
              </template>
            </el-col>
          </el-row>
          <div class="custom-tree-container">
            <div class="block">
              <el-tree style="height: calc(100vh - 240px); overflow-y: auto;"
                       :data="typeDataList"
                       node-key="id"
                       :show-checkbox="false"
                       :props="defaultProps"
                       :current-node-key="currentNodeKey"
                       :highlight-current="true"
                       @node-click="typeChangeFunc"
                       :expand-on-click-node="false"
                       :render-content="renderContent"
              >
              </el-tree>
            </div>
          </div>
          <el-dialog :visible.sync="FormVisible" center width="500px" :close-on-click-modal="false">
            <span slot="title" style="font-weight: bold; font-size: 15px">{{$t('sys.Basicdata')}}</span>
            <el-form :model="formType" label-width="80px" label-position="left">
              <el-form-item :label="$t('goods.name')" prop="name" >
                <el-input v-model="formType.name" auto-complete="off" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('sys.coding')" style="margin-top: 20px">
                <el-input v-model="formType.code" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <confirm-button @confirmButton="editType()"></confirm-button>
              <el-button @click="FormVisible = false" size="small" style="margin-right:5px; margin-left:10px;">{{$t('tools.cancel')}}</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="20" class="funcBox">
          <div class="rightbox">
            <el-row>
              <el-col :span="24" class="funcList" style="padding: 10px 15px; padding-right: 0">
                <div class="boxFuncBtn" @click="addData"  v-if="permissionCheck('opt')">
                  <!-- <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add"> -->
                  <el-button type="success" size="small" icon="el-icon-plus">{{$t('tools.add')}}</el-button>
                </div>
              </el-col>
            </el-row>
            <el-table :data="dataList" border stripe height="calc(100vh - 232px)" style="width: 100%">
                  <el-table-column label="#" width="60px">
                    <template slot-scope="scope">
                      {{scope.$index + searchForm.skip + 1}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" :label="$t('warehouse.name2')"></el-table-column>
                  <el-table-column prop="code" :label="$t('sys.coding')"></el-table-column>
                  <el-table-column prop="gen_time" :label="$t('sys.addTime')"></el-table-column>
                  <el-table-column :label="$t('warehouse.operation')" width = "180"  v-if="permissionCheck('opt')" align="center">
                    <template slot-scope="scope">
                      <el-button @click="showDataEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                      <delete-button @delData="deleteDataFunc(scope.row)"></delete-button>
                    </template>
                  </el-table-column>
                </el-table>
            <el-row>
              <el-col :span="24">
                <div style="text-align: right;margin-top: 10px">
                  <el-pagination
                    :current-page.sync="currentPage_to"
                    :page-size="pageSize_to"
                    layout="total, prev, pager, next, jumper"
                    :total="itemCount_to"
                  ></el-pagination>
                </div>
              </el-col>
            </el-row>
            <el-dialog width="500px" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
              <span slot="title" style="font-weight: bold; font-size: 15px">{{$t('sys.BasicdataSet')}}</span>
              <el-form label-width="120px" label-position="left" :model="form">
                <el-form-item :label="$t('goods.parentType')">
                  <el-select v-model="form.parent_tree_code" :placeholder="$t('sys.pleasechoose')" style="width: 100%">
                    <el-option
                      v-for="item in typeDataList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.tree_code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('goods.name')">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('sys.coding')">
                  <el-input v-model="form.code"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <confirm-button @confirmButton="saveDataFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
                <el-button @click="formEditDialog = false" size="small" style="margin-right: 5px; margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
              </div>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { dataSelects, dataSelectsGet, dataSelectsDel, dataSelectsModify } from '@/api/system'
export default {
  data() {
    return {
      currentPage_to: 1,
      pageSize_to: 15,
      itemCount_to: 0,
      dialogVisible: false,
      typeDataList: [],
      defaultProps: {
        children: 'items',
        label: 'name'
      },
      funcTreeWidth: 0,
      funcBoxWidth: 0,
      formEditDialog: false,
      submitDisabled: false,
      form: {
        id: '',
        name: '',
        code: '',
        parent_tree_code: ''
      },
      formType: {
        id: '',
        name: '',
        code: ''
      },
      dataList: [],
      FormVisible: false,
      searchForm: {
        skip: 0,
        limit: 10,
        parent_tree_code: ''
      },
      currentNodeKey: 1,
      currentTreeCode: ''
    }
  },
  watch: {
    currentPage_to(val) {
      this.searchForm.skip = (val - 1) * this.pageSize_to
      this.searchForm.limit = this.pageSize_to
      this.getDataList()
    }
  },
  async mounted() {
    await this.getTypeList()
    await this.getDataList()
  },
  methods: {
    async getTypeList() {
      await dataSelectsGet().then(res => {
        if (res.meta === 0) {
          this.typeDataList = []
          if (res.items !== null) {
            this.typeDataList = res.items
            if (this.typeDataList.length > 0) {
              this.currentTreeCode = this.typeDataList[0].tree_code
            }
          }
        }
        console.log(111)
      })
    },
    async getDataList() {
      this.searchForm.parent_tree_code = this.currentTreeCode
      await dataSelectsGet(this.searchForm).then((res) => {
        this.dataList = res.items
        this.itemCount_to = res.total
        console.log(2)
      })
    },
    showDataEditor(data) {
      this.form.id = data.id
      this.form.name = data.name
      this.form.code = data.code
      this.form.parent_tree_code = data.father_tree_code
      this.formEditDialog = true
    },
    showTypeEditForm() {
      this.formType.id = ''
      this.formType.name = ''
      this.formType.code = ''
      this.FormVisible = true
    },
    editType() {
      if (this.formType.name === '') {
        this.$message.error(this.$t('warehouse.Msg'))
        return
      }
      if (this.formType.id === '') {
        dataSelects(this.formType).then(res => {
          if (res.meta === 0) {
            this.getTypeList()
            this.FormVisible = false
          }
        })
      } else {
        dataSelectsModify(this.formType.id, this.formType).then(res => {
          if (res.meta === 0) {
            this.getTypeList()
            this.FormVisible = false
          }
        })
      }
    },
    addData() {
      this.form.id = ''
      this.form.name = ''
      this.form.code = ''
      this.form.parent_tree_code = ''
      this.formEditDialog = true
    },
    saveDataFunc() {
      if (this.form.name === '' || this.form.parent_tree_code === '') {
        this.$message.error(this.$t('warehouse.Msg'))
        return
      }
      this.submitDisabled = true
      // console.log(this.form)
      if (this.form.id === '') {
        dataSelects(this.form).then(res => {
          this.getDataList()
          this.formEditDialog = false
          this.submitDisabled = false
        }).catch(() => {
          this.submitDisabled = false
        })
      } else {
        dataSelectsModify(this.form.id, this.form).then(res => {
          this.getDataList()
          this.formEditDialog = false
          this.submitDisabled = false
        }).catch(() => {
          this.submitDisabled = false
        })
      }
    },
    deleteDataFunc(data) {
      dataSelectsDel(data.id).then(res => {
        this.getDataList()
      })
    },
    typeChangeFunc(data) {
      this.currentPage_to = 1
      this.searchForm.skip = 0
      this.currentTreeCode = data.tree_code
      this.getDataList()
    },
    deleteResourcesType(data) {
      dataSelectsDel(data.id).then(res => {
        this.getTypeList()
        this.getDataList()
      })
    },
    renderContent(h, { node, data, store }) {
      if (this.permissionCheck('opt')) {
        return (
          <span class='custom-tree-node'>
            <span title={node.label}>[{data.tree_code}]{node.label}</span>
            <i class='el-icon-edit treeDelEditImg permissionsEdit' on-click={ () => this.showEditDataFunc(data)}></i>
          </span>)
      } else {
        return (<span class='custom-tree-node'>
          <span title={node.label}>{node.label}</span></span>)
      }
    },
    showEditDataFunc(data) {
      this.FormVisible = true
      this.formType.id = data.id
      this.formType.name = data.name
      this.formType.code = data.code
    }
  }
}
</script>
<style lang="scss" scoped>
.searchbtn {
  display: flex;
  margin-bottom: 5px;
  align-items: center;
}
.numcss {
  display: inline-block;
  width: 100%;
  cursor: pointer;
  color: #409eff;
}
.bigbox {
  display: flex;
  > div:nth-child(1) {
    width: 15%;
  }
  > div:nth-child(2) {
    width: 85%;
  }
}
  /deep/ {
    .el-form-item {

    }
    .el-tree-node {
      margin-left: 0;
    }
  }
  .cellBoxTitle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sortBox {
    display: flex;
    flex-direction: column;
    margin-left: 4px;
    .jiantouC {
      color: #C0C4CC;
      cursor: pointer;
    }
    .jiantouBlue {
      color: #409EFF;
    }
  }
  .totlaInv {
    height: 48px;
    display: flex;
    align-items: center;
    margin: 0 20px;
  }

</style>
