<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <el-row  style="margin-top: 24px;">
        <el-col :span="4" class="funcTree">
          <el-row>
            <el-col :span="24" class="funcBoxTitle">
              <div class="small_title">商品分类</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="funcBoxTitle2">
              <i class="el-icon-circle-plus-outline" @click="showTypeEditForm"></i>
              <span @click="showTypeEditForm" >创建分类</span>
            </el-col>
          </el-row>
          <div class="custom-tree-container">
            <div class="block">
              <el-tree style="height: calc(100vh - 280px); overflow-y: auto;"
                       :data="goodsTypeData"
                       node-key="id"
                       :show-checkbox="false"
                       :props="defaultProps"
                       @node-click="typeChangeFunc"
                       :expand-on-click-node="false"
                       :render-content="renderContent"
              >
              </el-tree>
            </div>
          </div>
          <el-dialog title="商品分类" :visible.sync="FormVisible" @close="cancel1" center width="500px" :close-on-click-modal="false">
            <el-form :model="forms" :rules="formRules" ref="forms" label-width="80px">
              <el-form-item label="父分类:" v-if="isShowType"  label-width="80px">
                <el-cascader :disabled="cascaderDisabled" :options="typeData" :props="typeProps" v-model="parentType" change-on-select clearable></el-cascader>
              </el-form-item>
              <el-form-item label="名称:" prop="name" label-width="80px">
                <el-input v-model="forms.name" auto-complete="off" clearable></el-input>
              </el-form-item>
              <el-form-item label="备注:" label-width="80px">
                <el-input type="textarea" :rows="2" v-model="forms.desc" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <confirm-button @confirmButton="editType('form')"></confirm-button>
              <el-button @click="cancel1" size="small" style="margin-right: 24px;margin-left: 10px;">关闭</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="19" class="funcBox">
          <div class="rightbox">
            <!-- 搜索 -->
            <el-row>
              <el-col :span="20" style="padding: 6px 15px ">
                <el-form :inline="true" :model="searchForm">
                  <el-form-item>
                    <el-select v-model="searchForm.approve_status" @change="search" placeholder="请选择审批状态">
                      <el-option
                        v-for="item in approveStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="searchForm.shelf_status" @change="search" placeholder="请选择上架状态">
                      <el-option
                        v-for="item in shelfStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="searchForm.key" placeholder="请输入关键字" clearable></el-input>
                  </el-form-item>
                  <el-form-item class="searchBtn">
                    <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="4" style="text-align: right;padding: 10px 15px">
                <div class="boxFuncBtn">
                  <el-button type="primary" size="mini" icon="el-icon-plus" @click="importShow1">添加</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="height: calc(100vh - 242px)">
                <el-table stripe v-loading="tableData.loading" :data="tableData.body" height="calc(100% - 42px)" style="width: 100%">
                  <el-table-column prop="name" label="名称"></el-table-column>
                  <el-table-column label="状态">
                    <template  slot-scope="scope">
                      <el-tag :type="scope.row.status ? 'success' : 'danger'">
                        {{scope.row.status ? '发布': '未发布'}}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="content_type" label="文件类型"></el-table-column>
                  <el-table-column prop="size" label="文件大小"></el-table-column>
                  <el-table-column prop="url" label="url">
                    <template  slot-scope="scope">
                      <el-tag>
                        <a :href="scope.row.url" target="view_window">预览</a>
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="user_info" label="上传人"></el-table-column>
                  <el-table-column label="操作" width = "230">
                    <template slot-scope="scope">
                      <el-button type="text" @click="editResource(scope.row.id)" size="small">编辑</el-button>
                      <span class="xiexian">/</span>
                      <delete-button :promptInfor="promptInfor" @delData="deleteResource(scope.row)"></delete-button>
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
            <el-dialog title="资源上传" width="500px" @close="cancelShow" :visible.sync="importShow" :close-on-click-modal="false" center>
              <el-form :model="importPara" label-width="100px">
                <el-form-item label="分类">
                  <el-cascader :options="typeData" :props="typeProp" v-model="formType" change-on-select clearable></el-cascader>
                </el-form-item>
                <el-form-item label="公司:" prop="name" label-width="100px">
                  <el-select v-model="importPara.partner_id" clearable>
                    <el-option :label="item.name || item.short_name" :value="item.id" :key="item.id" v-for="item in partnList"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="文件" v-if="showUplodBtn">
                  <el-table :data="tableFile">
                    <el-table-column prop="name" label="名字"></el-table-column>
                    <el-table-column label="可修改为">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.changeName"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" @click="delFile(scope.row.uid)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <confirm-button @confirmButton="submitUpload" :disabled="disabled"></confirm-button>
                <el-button @click="cancelShow" size="small" style="margin-right: 24px;margin-left: 10px;">关闭</el-button>
              </div>
            </el-dialog>
            <el-dialog title="资源修改" width="500px" @close="cancelShowEdit" :visible.sync="editResourceDialog" :close-on-click-modal="false" center>
              <el-form :model="form" :rules="formRule" ref="form" label-width="80px">
                <el-form-item label="分类">
                  <el-cascader :options="typeData" :props="typeProp" v-model="selectedFuncType" change-on-select clearable></el-cascader>
                </el-form-item>
                <el-form-item label="公司:">
                  <el-select v-model="form.partner_id" clearable>
                    <el-option :label="item.name || item.short_name" :value="item.id" :key="item.id" v-for="item in partnList"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="名称:" prop="name" label-width="80px">
                  <el-input v-model="form.name" auto-complete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="md5:" label-width="80px">
                  <el-input v-model="showForm.md5" :disabled="true" auto-complete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="大小:" label-width="80px">
                  <el-input v-model="showForm.size" :disabled="true" auto-complete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="path:" label-width="80px">
                  <el-input v-model="showForm.path" :disabled="true" auto-complete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="状态:" label-width="80px">
                  <el-switch
                    v-model="showForm.status"
                    active-text="未发布"
                    inactive-text="发布"
                    disabled>
                  </el-switch>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <confirm-button @confirmButton="submitEditResource('form')" :disabled="disabled"></confirm-button>
                <el-button @click="cancelShowEdit" size="small" style="margin-right: 24px;margin-left: 10px;">关闭</el-button>
              </div>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { spusAdd, spusInfo, spusList, spusDel, spuTypesUpsert, spuTypesList, spuTypesDel } from '@/api/goods'
  import getPathById from '@/utils/getPathById'
  import store from '@/store'
  import service from '@/utils/request'
  export default {
    components: {
    },
    data() {
      return {
        proxyFile: [],
        formType: [],
        selectedFuncType: [],
        formRules: {
          name: [
            { required: true, message: '请输入商品分类的名称', trigger: 'blur' }
          ]
        },
        // 商品类型
        forms: {
          id: '',
          parent_id: '',
          name: '',
          desc: ''
        },
        isShowType: true,
        typeData: [],
        parentType: [],
        cascaderDisabled: false,
        goodsTypeData: [],
        FormVisible: false,
        typeProps: { value: 'id', label: 'name', children: 'items' },
        typeProp: { value: 'tree_code', label: 'name', children: 'items' },
        defaultProps: {
          children: 'items',
          label: 'name'
        },
        editTitle: '发布资源',
        disabled: false,
        promptInfor: '确定删除当前资源？',
        searchForm: {
          skip: 0,
          limit: 10,
          approve_status: 0, // 审批状态 0所有 1待审批 2审批成功 3拒绝
          merchant_id: '', // 商户id，不填所有，自营填000000000000000000000001
          type_id: '',
          shelf_status: 0 // 上架状态 所有0 未上架1 上架2
        },
        approveStatus: [
          {
            value: 0,
            label: '所有'
          }, {
            value: 1,
            label: '待审批'
          }, {
            value: 2,
            label: '审批成功'
          }, {
            value: 3,
            label: '拒绝'
          }],
        shelfStatus: [
          {
            value: 0,
            label: '所有'
          }, {
            value: 1,
            label: '未上架'
          }, {
            value: 2,
            label: '上架'
          }],
        form: {
          resources_id: '',
          name: '', // 名称,
          type_code: '',
          partner_id: ''
        },
        formRule: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        tableData: {
          loading: true,
          body: []
        },
        edit: true,
        fileUploadUrl: service.defaults.baseURL + '/resources/upload',
        fileUploadHeader: { 'X-Access-Token': store.state.user.token },
        importShow: false,
        importPara: { 'type_code': '', 'name': '', partner_id: '' },
        fileList: [],
        showUplodBtn: false,
        releaseForm: {
          resources_id: '',
          status: true
        },
        editResourceDialog: false,
        showForm: {},
        partnList: [],
        tableFile: []
      }
    },
    created() {
      this.$store.state.user.funcListName = '资源列表'
      this.$store.state.user.pathRouter = false
    },
    mounted() {
      this.getTableData()
      this.getTypeList()
      // this.getPartner()
    },
    watch: {
      tableFile: {
        handler(val) {
          this.importPara.extra = val
        },
        deep: true
      },
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getTableData()
      },
      parentType(val) {
        if (val === undefined) {
          this.forms.parent_id = ''
        } else {
          this.forms.parent_id = val[val.length - 1]
        }
      },
      formType(val) {
        if (val.length !== 0) {
          this.showUplodBtn = true
        }
        this.importPara.type_code = Array.isArray(val) ? val[val.length - 1] : val
      },
      selectedFuncType(val) {
        this.form.type_code = Array.isArray(val) ? val[val.length - 1] : val
      }
    },
    methods: {
      getTypeList() {
        spuTypesList().then(response => {
          if (response.meta === 0) {
            this.typeData = []
            this.goodsTypeData = []
            if (response.items !== null) {
              this.isShowType = true
              this.typeData = response.items
              this.goodsTypeData = [{ name: '全部', code: '' }, ...response.items]
            } else {
              this.isShowType = false
            }
          }
        })
      },
      getPathByCode(code, items, callback) {
        var temppath = []
        function getNodePath(nodes) {
          nodes.forEach(node => {
            temppath.push(node.tree_code)
            if (node.tree_code === code) {
              throw new Error('GOT IT!')
            }
            if (node.items !== null && node.items.length > 0) {
              getNodePath(node.items)
            } else {
              temppath.pop()
            }
          })
          temppath.pop()
        }
        try {
          getNodePath(items)
        } catch (e) {
          callback(temppath)
        }
      },
      renderContent(h, { node, data, store }) {
        return (
          <span class='custom-tree-node'>
            <span title={node.label}>{node.label}</span>
            <span class='showHide' v-show={data.tree_code}>
              <i class='el-icon-circle-plus-outline treeAddImg' on-click={ () => this.showAddChildFunc(data)}></i>
              <el-popover
                placement='bottom-end'
                width='250'
                visible-arrow
                trigger='hover'>
                <div class='labelName'>{node.label}</div>
                <div class='funcListBox'>
                  <div class='funcList' on-click={ () => this.deleteResourcesType(data)}>
                    <i class='el-icon-delete treeDelEditImg permissionsDel'></i>
                    <span class='permissionsDel'>删除</span>
                  </div>
                  <div class='funcList' on-click={ () => this.showEditDataFunc(data)}>
                    <i class='el-icon-edit treeDelEditImg permissionsEdit'></i>
                    <span class='permissionsEdit'>编辑</span>
                  </div>
                </div>
                <i class='el-icon-more imgMore' slot='reference'></i>
              </el-popover>
            </span>
          </span>)
      },
      showEditDataFunc(row) {
        this.parentType = []
        getPathById(row.parent, this.typeData, (res) => {
          this.parentType = res
        })
        this.resetForms()
        this.forms = Object.assign({}, row)
        this.cascaderDisabled = true
        this.FormVisible = true
      },
      resetForms() {
        this.forms.id = ''
        this.forms.parent_id = ''
        this.forms.name = ''
        this.forms.desc = ''
      },
      deleteResourcesType(data) {
        spuTypesDel(data.id).then(res => {
          this.$message.success('删除成功')
          this.getTypeList()
        })
      },
      showAddChildFunc(row) {
        this.parentType = []
        console.log('this.typeData', this.typeData)
        getPathById(row.id, this.typeData, (res) => {
          this.parentType = res
          console.log(res)
        })
        this.resetForms()
        this.forms.parent = row.id
        this.cascaderDisabled = true
        this.FormVisible = true
      },
      showTypeEditForm() {
        this.forms.id = ''
        this.forms.parent_id = ''
        this.forms.name = ''
        this.forms.desc = ''
        this.cascaderDisabled = false
        this.FormVisible = true
        this.parentType = []
      },
      editType() {
        this.$refs.forms.validate(res => {
          if (res) {
            spuTypesUpsert(this.forms).then(res => {
              this.FormVisible = false
              // console.log(res)
              this.getTypeList()
            })
          }
        })
      },
      cancel1() {
        this.FormVisible = false
        this.$refs['forms'].resetFields()
      },
      typeChangeFunc(data) {
        this.searchForm.type_id = data.id
        this.currentPage = 1
        this.search()
      },
      sizeChangeFunc(val) {
        this.pageSize = val
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      getTableData() {
        spusList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
          }
        })
      },
      deleteResource(data) {
        spusDel(data.id).then(response => {
          if (response.meta === 0) {
            this.$message.success('删除成功')
            this.getTableData()
          }
        })
      },
      search() {
        this.getTableData()
      },
      editResource(id) {
        this.selectedFuncType = []
        spusInfo(id).then(res => {
          if (res.meta === 0) {
            // console.log(res)
            this.showForm = res.item
            this.form.name = res.item.name
            this.form.partner_id = res.item.partner_id
            this.form.resources_id = res.item.id
            this.editResourceDialog = true
            if (this.showForm.type_code !== '') {
              this.getPathByCode(this.showForm.type_code, this.typeData, res => {
                this.selectedFuncType = res
              })
            }
          }
        })
      },
      submitEditResource() {
        this.$refs.form.validate(res => {
          if (res) {
            spusAdd(this.form).then(res => {
              this.editResourceDialog = false
              // console.log(res)
              this.$message.success('修改成功')
              this.getTableData()
            })
          }
        })
      },
      cancelShowEdit() {
        this.editResourceDialog = false
        this.$refs['form'].resetFields()
      },
      importShow1() {
        this.proxyFile = []
        this.tableFile = []
        this.importShow = true
        this.showUplodBtn = false
        this.formType = []
        this.importPara = { 'type_code': '', 'name': '', partner_id: '' }
        // this.$refs.fileUploader.clearFiles()
      },
      fileChange(file, fileList) {
        if (fileList.length !== 1) {
          fileList.splice(0, 1)
        }
      },
      cancelShow() {
        this.importShow = false
        // this.$refs.upload.clearFiles()
      },
      // 导入后的确定
      submitUpload() {
        this.$refs.upload.submit()
      },
      delFile(index) {
        const ind = this.proxyFile.findIndex(res => res.uid === index)
        const inds = this.tableFile.findIndex(res => res.uid === index)
        if (ind !== -1) {
          this.proxyFile.splice(ind, 1)
        }
        if (inds !== -1) {
          this.tableFile.splice(ind, 1)
        }
      },
      importUploadFunc(res, files) {
        this.importShow = false
        // if (res.meta === 0) {
        // console.log('res', res)
        this.$message.success('上传成功')
        this.getTableData()
        this.$refs.upload.clearFiles()
        // }
      },
      beforeCertificateUpload(file) {
        // const isLt2M = file.size / 1024 / 1024 < 300
        // if (!isLt2M) {
        //   this.$message.error('上传的文件不大于300MB')
        // }
        return true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .rightbox {
    padding: 0;
    margin: 0;
    & > div {
      padding: 0 10px;
    }
    & > div:first-child{
      padding: 0;
    }
    .funcList {
      margin: 0;
      padding: 6px 10px;
      line-height: 43px;
    }
  }
</style>
<style lang="scss">
  .custom-tree-node{
    & > span:first-child{
      width: 100px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
</style>
