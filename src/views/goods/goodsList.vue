<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <el-row  style="margin-top: 24px;">
        <el-col :span="4" class="funcTree">
          <el-row>
            <el-col :span="24" class="funcBoxTitle">
              <div class="small_title">{{$t('goods.type')}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="funcBoxTitle2">
              <i class="el-icon-circle-plus-outline" @click="showTypeEditForm"></i>
              <span @click="showTypeEditForm" >{{$t('goods.addType')}}</span>
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
          <el-dialog :title="$t('goods.typeEdit')" :visible.sync="FormVisible" @close="cancel1" center width="500px" :close-on-click-modal="false">
            <el-form :model="forms" :rules="formRules" ref="forms" label-width="80px">
              <el-form-item :label="$t('goods.parentType')" v-if="isShowType"  label-width="80px">
                <el-cascader :disabled="cascaderDisabled" :options="typeData" :props="typeProps" v-model="parentType" clearable></el-cascader>
              </el-form-item>
              <el-form-item :label="$t('goods.name')" prop="name" label-width="80px">
                <el-input v-model="forms.name" auto-complete="off" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('goods.note')" label-width="80px">
                <el-input type="textarea" :rows="2" v-model="forms.desc" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <confirm-button @confirmButton="editType('form')"></confirm-button>
              <el-button @click="cancel1" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.close')}}</el-button>
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
                    <el-select v-model="searchForm.approve_status" @change="search" :placeholder="$t('goods.checkSelectorHolder')">
                      <el-option
                        v-for="item in approveStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="searchForm.shelf_status" @change="search" :placeholder="$t('goods.displaySelectorHolder')">
                      <el-option
                        v-for="item in shelfStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="searchForm.key" :placeholder="$t('tools.searchKeyTip')" clearable></el-input>
                  </el-form-item>
                  <el-form-item class="searchBtn">
                    <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="4" style="text-align: right;padding: 10px 15px">
                <div class="boxFuncBtn">
                  <el-button type="primary" size="mini" icon="el-icon-plus" @click="showGoodsEditor(null, 1)">{{$t('gools.add')}}</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="height: calc(100vh - 242px)">
                <el-table stripe v-loading="tableData.loading" :data="tableData.body" height="calc(100% - 42px)" style="width: 100%;">
                  <el-table-column  :label="$t('goods.name')" min-width="300">
                    <template  slot-scope="scope">
                      <div class="goods-item">
                        <el-image class="image" style="width: 60px; height: 60px"  :src="getImageUrl(scope.row.images[0], 100,100)"  fit="cover"></el-image>
                        <div class="g-info">
                          <p>{{scope.row.name}}</p>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('goods.checkStatus')" width="110">
                    <template  slot-scope="scope">
                      <el-tag :type="scope.row.approve_status === 2 ? 'success' : (scope.row.approve_status === 3 ? 'danger' : 'info' )">
                        {{scope.row.approve_status === 2 ? $t('goods.checkStatusB') : (scope.row.approve_status === 3 ?  $t('goods.checkStatusC') :  $t('goods.checkStatusA') )}}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('goods.putaway')" width="90">
                    <template  slot-scope="scope">
                      <el-tooltip v-if="scope.row.approve_status === 2" class="item" effect="dark" :content="$t('goods.putawayTip')" placement="top">
                        <el-tag @click="goodsShelfModify(scope.row)" :type="scope.row.shelf_status === 2 ? 'success' :  'danger'">
                          {{scope.row.shelf_status === 2 ?$t('goods.putawayA') : $t('goods.putawayB')}}
                        </el-tag>
                      </el-tooltip>
                      <template v-else>
                        --
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('goods.price')" width="120">
                    <template  slot-scope="scope">
                      <span v-if="scope.row.min_price !== scope.row.max_price">{{scope.row.min_price | price}}-{{scope.row.max_price | price}}</span>
                      <span v-else>{{scope.row.min_price | price}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="inventory" width="75"  :label="$t('goods.inventory')">
                  </el-table-column>
                  <el-table-column prop="sales" width="75"  :label="$t('goods.saled')">
                  </el-table-column>
                  <el-table-column :label="$t('tools.opt')" width = "190" fixed="right">
                    <template slot-scope="scope">
                      <el-button type="text" @click="showGoodsEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                      <span class="xiexian">/</span>
                      <el-button type="text" @click="showGoodsEditor(scope.row,4)" size="small">{{$t('goods.piEdit')}}</el-button>
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
            <el-dialog :title="$t('goods.edit')" width="800px" @close="cancelGoodsEdit" :visible.sync="goodsEditorShow" :close-on-click-modal="false" center>
              <el-steps :active="goodsEditStep" style="margin-bottom: 20px">
                <el-step :title="$t('goods.step1')" :description="$t('goods.step1Tip')"></el-step>
                <el-step :title="$t('goods.step2')" :description="$t('goods.step2Tip')"></el-step>
                <el-step :title="$t('goods.step3')" :description="$t('goods.step3Tip')"></el-step>
                <el-step :title="$t('goods.step4')" :description="$t('goods.step4Tip')"></el-step>
              </el-steps>
              <el-form :model="goodsData" label-width="100px" style="min-height: 350px">
                <template v-if="goodsEditStep === 1">
                  <el-form-item :label="$t('goods.sysType')">
                    <el-cascader ref="sysGoodsTypeSelector" :options="sysTypes" v-model="goodsSysTypes" :props="typeProp" @change="sysTypeChange"></el-cascader>
                  </el-form-item>
                  <el-form-item v-for="(v,k) in goodsSysTypeFields" :key="k" :label="v.name">
                    <el-input v-if="v.type==='string' || v.type === 'number'" v-model="goodsData.fields[v.code]" auto-complete="off" clearable></el-input>
                    <el-select v-if="v.type==='mulitselect' || v.type === 'select'" :multiple="v.type==='mulitselect'" v-model="goodsData.fields[v.code]" :placeholder="$t('tools.pleaseSelect')" >
                      <el-option
                        v-for="item in v.param"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template v-else-if="goodsEditStep === 2">
                  <el-form-item :label="$t('goods.name')">
                    <el-input v-model="goodsData.name" auto-complete="off" clearable></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('goods.type')">
                    <el-cascader :options="typeData" v-model="goodsTypes" :props="typeProp2" @change="goodsTypeChange"></el-cascader>
                  </el-form-item>
                  <el-form-item :label="$t('goods.goodsPic')">
                    <div class="prop-image__preview" v-if="goodsData.images && goodsData.images.length > 0">
                      <div class="pitem"  v-for="(img,imgk) in goodsData.images" :key="imgk">
                        <el-image
                          style="height: 100px; width: 100px" fit="contain"
                          :src="getImageUrl(img)"
                          :preview-src-list="goodsPreviewImages">
                        </el-image>
                        <i class="el-icon-delete delbtn" @click="delGoodsImage(imgk)"></i>
                      </div>
                    </div>
                    <image-upload @uploadSuccess="imageUploadSuccess"></image-upload>
                  </el-form-item>
                </template>
                <template v-else-if="goodsEditStep === 3">
                  <ll-editor :content="goodsData.desc" @contentChange="contentChangeFunc"></ll-editor>
                </template>
                <template v-else-if="goodsEditStep === 4">
                  <el-form-item :label="$t('goods.sp')">
                    <div v-for="(v,k) in goodsProps" :key="k" class="prop-item">
                      <el-input v-model="goodsProps[k].name" class="prop-name" :placeholder="$t('goods.prop')"></el-input><el-button size="mini" @click="deleteProps(k)" type="danger" icon="el-icon-delete" circle></el-button>：
                      <el-tag :key="tag" v-for="tag in goodsProps[k].items" closable :disable-transitions="false"  @close="handleClose(k,tag)"> {{tag}} </el-tag>
                      <el-input class="input-new-tag"  :placeholder="$t('goods.spec')" v-if="goodsProps[k].isInput"  v-model="goodsProps[k].newTag"   ref="saveTagInput"  size="small"   @keyup.enter.native="handleInputConfirm(k)"  @blur="handleInputConfirm(k)" ></el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(k)">{{$t('goods.spec1')}}</el-button>
                    </div>
                    <a @click="addGoodsProp" class="add-prop-btn">{{$t('goods.prop1')}}</a>
                  </el-form-item>
                  <el-form-item :label="$t('goods.piEdit')">
                    <el-table :data="goodsInventoryTable"  style="width: 100%">
                      <el-table-column :label="$t('goods.sp')">
                        <template  slot-scope="scope">
                          {{scope.row.title}}
                        </template>
                      </el-table-column>
                      <el-table-column :label="$t('goods.inventory')">
                        <template  slot-scope="scope">
                          <el-input v-model.number="scope.row.inventory"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column :label="$t('goods.price')">
                        <template  slot-scope="scope">
                          <price-input v-model="scope.row.price"></price-input>
                          <!--<el-input v-model.number="scope.row.price"></el-input>-->
                        </template>
                      </el-table-column>
                      <el-table-column :label="$t('goods.goodsPic')">
                        <template  slot-scope="scope">
                          <i style="cursor: pointer" class="el-icon-picture-outline" @click="editorProppImageFunc(scope.$index)"></i>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </template>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button v-if = "goodsEditStep > 1" size="small" type="primary" @click="editNextFunc(-1)" >{{$t('goods.pre')}}</el-button>
                <confirm-button @confirmButton="editNextFunc(1)" :disabled="disabled" :confirmButtonInfor="goodsEditStep === 4 ? this.$t('tools.confirm') : $t('goods.next')"></confirm-button>
                <!--<el-button v-else size="small" type="primary" @click="editNextFunc(1)" >{{$t('goods.next')}}</el-button>-->
                <el-button @click="cancelGoodsEdit" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.close')}}</el-button>
              </div>
              <el-dialog :title="propsImageEditTitle" width="400px" @close="showPropsImageDialog=false" :visible.sync="showPropsImageDialog" :close-on-click-modal="false" center append-to-body>
                <template>
                  <div class="prop-image__preview" v-if="goodsInventoryTable.length > 0">
                    <div class="pitem"  v-for="(img,imgk) in goodsInventoryTable[propsImageEditIndex].images" :key="imgk">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="getImageUrl(img)"
                      :preview-src-list="propPreviewImages">
                    </el-image>
                      <i class="el-icon-delete delbtn" @click="delPropImage(imgk)"></i>
                    </div>
                  </div>
                </template>
                <image-upload @uploadSuccess="propImageUploadSuccess"></image-upload>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="showPropsImageDialog = false" size="small" style="margin-right: 24px;margin-left: 10px;">{{this.$t('tools.confirm')}}</el-button>
                </div>
              </el-dialog>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { spusAdd, spusShelf, spusList, spusDel, spusModify, spuTypesUpsert, spuTypesmodify, spuTypesList, spuTypesDel, spusSkusModify, spusSkusList } from '@/api/goods'
  import getPathById from '@/utils/getPathById'
  import store from '@/store'
  import service from '@/utils/request'
  import llEditor from '@/components/LLEditor'
  export default {
    components: {
      llEditor
    },
    data() {
      return {
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
        typeProps: { value: 'id', label: 'name', children: 'items', checkStrictly: true },
        typeProp: { value: 'id', label: 'name', children: 'items' },
        typeProp2: { value: 'id', label: 'name', children: 'items', multiple: true },
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
            label: this.$t('tools.all')
          }, {
            value: 1,
            label: this.$t('goods.checkStatusA')
          }, {
            value: 2,
            label: this.$t('goods.checkStatusB')
          }, {
            value: 3,
            label: this.$t('goods.checkStatusC')
          }],
        shelfStatus: [
          {
            value: 0,
            label: this.$t('tools.all')
          }, {
            value: 1,
            label: this.$t('goods.putawayB')
          }, {
            value: 2,
            label: this.$t('goods.putawayA')
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
        fileList: [],
        releaseForm: {
          resources_id: '',
          status: true
        },
        editResourceDialog: false,
        showForm: {},
        partnList: [],
        sysTypes: [],
        goodsEditStep: 1,
        goodsEditorShow: false,
        goodsData: {
          id: '',
          default_type_id: '',
          fields: {},
          merchant_type_ids: '',
          name: '',
          images: [],
          desc: ''
        },
        goodsSysTypes: [],
        goodsSysTypeFields: [],
        goodsTypes: [],
        goodsProps: [],
        goodsInventoryTable: [],
        goodsInventoryData: [],
        showPropsImageDialog: false,
        propsImageEditIndex: 0,
        propsImageEditTitle: ''
      }
    },
    created() {
      // this.$store.state.user.funcListName = '资源列表'
      // this.$store.state.user.pathRouter = false
    },
    mounted() {
      this.getTableData()
      this.getTypeList()
      this.getSysType()
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
      goodsProps: {
        handler(val) {
          // val.forEach((item) => {
          //   this.goodsInventoryTable.push()
          // })
          this.goodsInventoryTable = []
          const skus = this.getTreePath(0)
          skus.forEach(item => {
            const tableItem = { specifications: item, price: 0, inventory: 0, images: [] }
            let str = ''
            val.forEach(gi => {
              if (gi.name !== '' && gi.items.length > 0) {
                str += gi.name + '：' + item[gi.name] + '；'
              }
            })
            tableItem['title'] = str
            for (let i = 0; i < this.goodsInventoryData.length; i++) {
              const keys = Object.keys(item)
              let isEque = true
              for (let j = 0; j < keys.length; j++) {
                if (this.goodsInventoryData[i].specifications[keys[j]] !== item[keys[j]]) {
                  isEque = false
                  break
                }
              }
              if (isEque) {
                tableItem.inventory = this.goodsInventoryData[i].inventory
                tableItem.price = this.goodsInventoryData[i].price
                tableItem.images = this.goodsInventoryData[i].images
              }
            }
            this.goodsInventoryTable.push(tableItem)
          })
        },
        deep: true
      }
    },
    computed: {
      propPreviewImages() {
        const result = []
        if (this.goodsInventoryTable.length > 0 && this.goodsInventoryTable[this.propsImageEditIndex] && this.goodsInventoryTable[this.propsImageEditIndex].images) {
          this.goodsInventoryTable[this.propsImageEditIndex].images.forEach(img => {
            result.push(this.getImageUrl(img))
          })
        }
        return result
      },
      goodsPreviewImages() {
        const result = []
        this.goodsData.images && this.goodsData.images.forEach(img => {
          result.push(this.getImageUrl(img))
        })
        console.log(result)
        return result
      }
    },
    methods: {
      getTreePath(k) {
        const path = []
        if (k > this.goodsProps.length - 1 || !this.goodsProps[k] || !this.goodsProps[k].items || this.goodsProps[k].items < 1) {
          return path
        }
        for (let i = 0; i < this.goodsProps[k].items.length; i++) {
          const child = this.getTreePath(k + 1)
          if (child.length < 1) {
            const item = {}
            item[this.goodsProps[k].name] = this.goodsProps[k].items[i]
            path.push(item)
            // this.getTreePath(k++)
          } else {
            for (let j = 0; j < child.length; j++) {
              const ni = JSON.parse(JSON.stringify(child[j]))
              ni[this.goodsProps[k].name] = this.goodsProps[k].items[i]
              path.push(ni)
            }
          }
        }
        return path
      },
      getTypeList() {
        spuTypesList({ type: 2 }).then(response => {
          if (response.meta === 0) {
            this.typeData = []
            this.goodsTypeData = []
            if (response.items !== null) {
              this.isShowType = true
              this.typeData = response.items
              this.goodsTypeData = [{ name: '全部', code: '', id: '' }, ...response.items]
            } else {
              this.isShowType = false
            }
          }
        })
      },
      getSysType() {
        spuTypesList({ type: 1 }).then(response => {
          if (response.meta === 0) {
            this.sysTypes = response.items
          }
        })
      },
      sysTypeChange(data) {
        if (data.length < 1) {
          return
        }
        this.goodsData.default_type_id = data[data.length - 1]
        const nodes = this.$refs.sysGoodsTypeSelector.getCheckedNodes()
        this.goodsData.fields = {}
        this.goodsSysTypeFields = []
        const currentNode = nodes[nodes.length - 1]
        currentNode.data.fields && currentNode.data.fields.length > 0 && currentNode.data.fields.forEach(item => {
          if (item.type === 'string' || item.type === 'number') {
            this.goodsSysTypeFields.push({ code: item.code, name: item.name, type: item.type })
            this.$set(this.goodsData.fields, item.code, '')
          } else if (item.type === 'select' || item.type === 'mulitselect') {
            this.goodsSysTypeFields.push({ code: item.code, name: item.name, type: item.type, param: JSON.parse(item.param) })
            if (item.type === 'mulitselect') {
              this.$set(this.goodsData.fields, item.code, [])
            } else {
              this.$set(this.goodsData.fields, item.code, '')
            }
          }
        })
        console.log(currentNode)
        // console.log(data)
      },
      goodsTypeChange(data) {
        this.goodsData.merchant_type_ids = []
        if (data.length > 0) {
          data.forEach(item => {
            this.goodsData.merchant_type_ids.push(item[item.length - 1])
          })
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
        getPathById(row.parent_id, this.typeData, (res) => {
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
        getPathById(row.id, this.typeData, (res, node) => {
          this.parentType = res
          console.log(res, node)
        })
        this.resetForms()
        this.forms.parent_id = row.id
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
            if (this.forms.id !== '') {
              spuTypesmodify(this.forms.id, this.forms).then(res => {
                this.FormVisible = false
                // console.log(res)
                this.getTypeList()
              })
            } else {
              spuTypesUpsert(this.forms).then(res => {
                this.FormVisible = false
                // console.log(res)
                this.getTypeList()
              })
            }
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
      showGoodsEditor(data, step) {
        this.goodsProps = []
        this.goodsEditorShow = true
        this.goodsEditStep = 1
        if (step) {
          this.goodsEditStep = step
        }
        if (data) {
          this.goodsSysTypes = []
          this.goodsSysTypeFields = []
          getPathById(data.default_type_id, this.sysTypes, (res, node) => {
            this.goodsSysTypes = res
            const fields = node.data.fields
            fields.forEach(fi => {
              const fitem = { code: fi.code, name: fi.name, type: fi.type }
              if (fitem.type === 'select' || fitem.type === 'mulitselect') {
                fitem['param'] = JSON.parse(fi.param)
              }
              this.goodsSysTypeFields.push(fitem)
            })
          })
          const fieldsData = {}
          this.goodsSysTypeFields.forEach(fi => {
            if (fi.type === 'mulitselect') {
              fieldsData[fi.code] = JSON.parse(data.fields[fi.code])
            } else {
              fieldsData[fi.code] = data.fields[fi.code]
            }
          })

          this.goodsTypes = []
          data.merchant_type_ids && data.merchant_type_ids.forEach(item => {
            getPathById(item, this.typeData, (res) => {
              this.goodsTypes.push(res)
            })
          })

          this.goodsData = {
            id: data.id,
            default_type_id: data.default_type_id,
            fields: fieldsData,
            merchant_type_ids: data.merchant_type_ids,
            name: data.name,
            images: data.images,
            desc: data.desc
          }
          spusSkusList(data.id, { skip: 0, limit: -1 }).then(res => {
            this.goodsInventoryData = res.items
            data.specification_options && data.specification_options.forEach((op) => {
              this.goodsProps.push({ name: op.name, items: op.items, isInput: false, newTag: '' })
            })
          })
        } else {
          this.goodsData = {
            id: '',
            default_type_id: '',
            fields: {},
            merchant_type_ids: [],
            name: '',
            images: [],
            desc: ''
          }
        }
      },
      cancelGoodsEdit() {
        this.goodsEditorShow = false
        // this.$refs.upload.clearFiles()
      },
      editorProppImageFunc(k) {
        this.propsImageEditIndex = k
        this.showPropsImageDialog = true
        this.propsImageEditTitle = this.goodsInventoryTable[this.propsImageEditIndex].title
      },
      propImageUploadSuccess(data) {
        this.goodsInventoryTable[this.propsImageEditIndex].images.push(data.md5)
      },
      delPropImage(index) {
        this.goodsInventoryTable[this.propsImageEditIndex].images.splice(index, 1)
      },
      delGoodsImage(index) {
        this.goodsData.images.splice(index, 1)
      },
      editNextFunc(opt) {
        if (opt === 1 && this.goodsEditStep === 4) {
          this.updateGoodsSku()
        } else if (opt === 1 && this.goodsEditStep === 3) {
          this.updateGoodsFunc()
        } else {
          opt === 1 ? this.goodsEditStep++ : this.goodsEditStep--
        }
      },
      imageUploadSuccess(data) {
        this.goodsData.images = this.goodsData.images ? this.goodsData.images : []
        this.goodsData.images.push(data.md5)
      },
      contentChangeFunc(data) {
        this.goodsData.desc = data
      },
      updateGoodsFunc() {
        const goodsItem = { default_type_id: this.goodsData.default_type_id, merchant_type_ids: JSON.stringify(this.goodsData.merchant_type_ids), name: this.goodsData.name, images: JSON.stringify(this.goodsData.images), desc: this.goodsData.desc }
        const filedItem = {}
        for (const key in this.goodsData.fields) {
          if (Array.isArray(this.goodsData.fields[key])) {
            filedItem[key] = JSON.stringify(this.goodsData.fields[key])
          } else {
            filedItem[key] = this.goodsData.fields[key]
          }
        }
        goodsItem['fields'] = JSON.stringify(filedItem)
        if (this.goodsData.id !== '') {
          this.disabled = true
          spusModify(this.goodsData.id, goodsItem).then(res => {
            this.goodsData.id = res.error
            this.goodsEditStep = 4
            this.disabled = false
          }).catch(() => {
            this.disabled = false
          })
        } else {
          this.disabled = true
          spusAdd(goodsItem).then(res => {
            this.goodsData.id = res.error
            this.goodsEditStep = 4
            this.disabled = false
          }).catch(() => {
            this.disabled = false
          })
        }
      },
      handleInputConfirm(k) {
        if (this.goodsProps[k].newTag) {
          this.goodsProps[k].items.push(this.goodsProps[k].newTag)
        }
        this.goodsProps[k].isInput = false
        this.goodsProps[k].newTag = ''
      },
      handleClose(k, tag) {
        this.goodsProps[k].items.splice(this.goodsProps[k].items.indexOf(tag), 1)
      },
      showInput(k) {
        this.$set(this.goodsProps[k], 'isInput', true)
        // this.$nextTick(_ => {
        //   this.$refs['saveTagInput' + k].$refs.input.focus()
        // })
      },
      addGoodsProp() {
        const pi = { name: '', items: [], newTag: '', isInput: true }
        this.goodsProps.push(pi)
        console.log(this.goodsProps)
      },
      deleteProps(k) {
        this.goodsProps.splice(k, 1)
      },
      updateGoodsSku() {
        const data = { skus: JSON.stringify(this.goodsInventoryTable), spectification_options: JSON.stringify(this.goodsProps) }
        this.disabled = true
        spusSkusModify(this.goodsData.id, data).then(res => {
          this.disabled = false
          this.$message.success(res.error)
          this.goodsEditorShow = false
          this.getTableData()
        }).catch(() => {
          this.disabled = false
        })
      },
      goodsShelfModify(row) {
        if (row.approve_status !== 2) {
          this.$message.error('商品尚未审核通过')
          return
        }
        spusShelf(row.id, { shelf_status: row.shelf_status === 2 ? 1 : 2 }).then(res => {
          this.getTableData()
        })
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
  .prop-item{
    padding: 5px 0px;
    border-bottom: 1px solid #e4e4e4;
    .prop-name{
      width: 100px;
    }
    .input-new-tag{
      width: 100px;
    }
    .add-prop-btn {

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
  .prop-image__preview{
    .pitem{
      display: inline-block;
      position: relative;
      margin-right: 5px;
      .delbtn{
        cursor: pointer;
        position: absolute;
        top: 0px;
        right: 0px;
      }
    }
  }
  .goods-item{
    .image{
      float: left !important;
      margin-right: 5px !important;
    }
    .g-info{
      padding-left: 65px;
      text-align: left;
      p{
        margin: 0px;
        padding: 3px 0px;
        span{
          color: #8c939d;
          font{
            color: #606266;
          }
        }
      }
    }
  }
</style>
