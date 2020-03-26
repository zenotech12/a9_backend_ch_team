<template>
  <div v-loading="loading">
  <div class="sys-body">
    <div class="sys-neiBody" style="margin-bottom: 50px">
      <!-- 搜索 -->
        <el-form :model="goodsData" :rules="formRules" ref="goodsForm" label-width="100px" style="min-height: 350px">
          <el-form-item :label="$t('goods.sysType')" required>
            <el-cascader ref="sysGoodsTypeSelector" :options="sysTypes" v-model="goodsSysTypes" :props="typeProp" @change="sysTypeChange" filterable></el-cascader>
          </el-form-item>
          <el-divider content-position="left">{{$t('goods.goodsInfo1')}}</el-divider>
          <el-form-item :label="$t('goods.name')" prop="name">
            <el-input v-model="goodsData.name" style="max-width: 500px" auto-complete="off" clearable></el-input>
          </el-form-item>
          <el-row v-if="goodsSysTypeFields.length > 0">
            <el-col :span="24" style="text-align: center">{{$t('goods.sysTypeProp')}}</el-col>
            <el-col :span="6" v-for="(v,k) in goodsSysTypeFields" :key="k" >
              <el-form-item :label="v.name">
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
            </el-col>
          </el-row>
          <el-divider content-position="left">{{$t('goods.goodsInfo2')}}</el-divider>
          <el-form-item :label="$t('goods.goodsType')" v-if="goodsData.type !==2">
            <el-col :span="4">
              <el-select v-model="goodsData.type">
                <el-option :key="$t('goods.goodsType1')" :label="$t('goods.goodsType1')" :value="1"></el-option>
                <el-option v-if="shopInfo.source_type===3" :key="$t('goods.goodsType3')" :label="$t('goods.goodsType3')" :value="3"></el-option>
              </el-select>
            </el-col>
            <template v-if="goodsData.type===2">
              <el-col :span="8">
                <el-input v-model.number="goodsData.cobuy_person_count">
                  <template slot="prepend">{{$t('goods.cobuyuser')}}</template>
                </el-input>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="8">
                {{$t('goods.cobuysec')}}
                <el-select style="width: 100px" v-model="goodsData.cobuy_group_valid_sec">
                  <el-option
                    v-for="item in secondArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                {{$t('goods.hour')}}
              </el-col>
            </template>
          </el-form-item>
          <el-form-item :label="$t('goods.sp')" required>
            <div v-for="(v,k) in goodsProps" :key="k" class="prop-item">
              <el-input v-model="goodsProps[k].name" class="prop-name" :placeholder="$t('goods.prop')"></el-input><el-button size="mini" @click="deleteProps(k)" type="danger" icon="el-icon-delete" circle></el-button>：
              <el-tag :key="tag" v-for="tag in goodsProps[k].items" closable :disable-transitions="false"  @close="handleClose(k,tag)"> {{tag}} </el-tag>
              <el-input class="input-new-tag"  :placeholder="$t('goods.spec')" v-if="goodsProps[k].isInput"  v-model="goodsProps[k].newTag"   ref="saveTagInput"  size="small"   @keyup.enter.native="handleInputConfirm(k)"  @blur="handleInputConfirm(k)" ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(k)">{{$t('goods.spec1')}}</el-button>
            </div>
            <a @click="addGoodsProp" class="add-prop-btn">{{$t('goods.prop1')}}</a>
          </el-form-item>
          <el-form-item :label="$t('goods.piEdit')" required>
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
              <el-table-column v-if="goodsData.type !== 3" :label="$t('goods.price')">
                <template  slot-scope="scope">
                  <price-input v-model="scope.row.price"></price-input>
                  <!--<el-input v-model.number="scope.row.price"></el-input>-->
                </template>
              </el-table-column>
              <el-table-column v-if="goodsData.type === 3" :label="$t('goods.needExp')">
                <template  slot-scope="scope">
                  <el-input v-model.number="scope.row.price"></el-input>
                </template>
              </el-table-column>
              <el-table-column v-if="goodsData.type == 2" :label="$t('goods.cobuyPrice')">
                <template  slot-scope="scope">
                  <price-input v-model="scope.row.cobuy_price"></price-input>
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

          <el-divider content-position="left">{{$t('goods.goodsInfo3')}}</el-divider>
          <el-form-item :label="$t('goods.type')" required>
            <el-cascader :options="typeData" v-model="goodsTypes" :props="typeProp2" @change="goodsTypeChange"></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('goods.intro')">
            <el-input v-model="goodsData.intro" auto-complete="off" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('goods.goodsPic')" required>
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
          <el-form-item :label="$t('goods.picdes')">
            <ll-editor :content="goodsData.desc" @contentChange="contentChangeFunc"></ll-editor>
          </el-form-item>

          <el-divider content-position="left">{{$t('goods.goodsInfo4')}}</el-divider>
          <el-form-item :label="$t('goods.riderPost')">
            <el-checkbox v-model="goodsData.rider_post_support">{{$t('goods.riderPostSupport')}}</el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('goods.posageRule')" prop="postage_setting_id">
            <el-select v-model="goodsData.postage_setting_id" style="width: 300px" >
              <el-option
                v-for="item in postagesListData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('goods.postAddr')" prop="address_id">
            <el-select v-model="goodsData.address_id" style="width: 300px" >
              <el-option
                v-for="item in addressList"
                :key="item.id"
                :label="item.province + item.city + item.district"
                :value="item.id">
                <div class="address-item">
                  <p>{{item.province + item.city + item.district + item.addr}}</p>
                  <p>{{item.contacter_name + item.mobile}}</p>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-divider content-position="left">{{$t('goods.goodsInfo5')}}</el-divider>
          <el-form-item :label="$t('goods.putaway')">
            <el-col :span="4">
              <el-select v-model="goodsData.shelf_status">
                <el-option
                  v-for="(item,k) in putAwayType"
                  :key="item"
                  :label="item"
                  :value="k+1">
                </el-option>
              </el-select>
            </el-col>
            <template  v-if="goodsData.shelf_status==2">
              <el-col :span="4">
                <el-checkbox v-model="isSetShelfTime"></el-checkbox>{{$t('goods.putawayD')}}
              </el-col>
              <el-col :span="8" v-if="isSetShelfTime">
                <el-date-picker
                  v-model="goodsData.shelf_time"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  :placeholder="$t('goods.putawayD')">
                </el-date-picker>
              </el-col>
            </template>
          </el-form-item>
        </el-form>
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
    </div>
  </div>
  <div class="page-footer">
    <confirm-button @confirmButton="saveFunc" :disabled="disabled" :confirmButtonInfor="$t('goods.saveGoods')"></confirm-button>
    <el-button @click="cancelGoodsEdit" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
  </div>
  </div>
</template>

<script>
  import { spusAdd, spusInfo, spusModify, spuTypesList, spusSkusList } from '@/api/goods'
  import { shippingAddressesList, postagesList } from '@/api/system'
  import getPathById from '@/utils/getPathById'
  import store from '@/store'
  import service from '@/utils/request'
  import llEditor from '@/components/LLEditor'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      llEditor
    },
    data() {
      return {
        loading: true,
        defaultAddr: '',
        addressList: [],
        postagesListData: [],
        formRules: {
          sysType: [{ required: true, message: this.$t('goods.systip1'), trigger: 'blur' }],
          name: [
            { required: true, message: this.$t('goods.nameTip'), trigger: 'blur' }
          ],
          postage_setting_id: [{ required: true, message: this.$t('goods.postageRuleTip'), trigger: 'blur' }],
          address_id: [{ required: true, message: this.$t('goods.addressIdTip'), trigger: 'blur' }]
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
        goodsType: [this.$t('goods.goodsType1'), this.$t('goods.goodsType2'), this.$t('goods.goodsType3')],
        putAwayType: [this.$t('goods.putawayE'), this.$t('goods.putawayC')],
        secondArr: [{ label: 0.5, value: 1800 }, { label: 1, value: 3600 }, { label: 2, value: 7200 }, { label: 5, value: 18000 }],
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
        goodsData: {
          id: '',
          default_type_id: '',
          fields: {},
          merchant_type_ids: [],
          name: '',
          intro: '',
          type: 1,
          cobuy_person_count: 0,
          cobuy_group_valid_sec: 0,
          images: [],
          desc: '',
          shelf_status: 2,
          shelf_time: '',
          address_id: '',
          postage_setting_id: '',
          rider_post_support: false
        },
        isSetShelfTime: false,
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
      this.getTypeGoodsBaseInfo()
      this.getAddressListFunc()
      this.getPostageListFunc()
      // this.getPartner()
    },
    watch: {
      tableFile: {
        handler(val) {
          this.importPara.extra = val
        },
        deep: true
      },
      goodsProps: {
        handler(val) {
          // val.forEach((item) => {
          //   this.goodsInventoryTable.push()
          // })
          this.goodsInventoryTable = []
          const skus = this.getTreePath(0)
          skus.forEach(item => {
            const tableItem = { specifications: item, price: 0, cobuy_price: 0, inventory: 0, images: [] }
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
                tableItem.cobuy_price = this.goodsInventoryData[i].cobuy_price ? this.goodsInventoryData[i].cobuy_price : 0
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
      ...mapGetters([
        'shopInfo'
      ]),
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
      getAddressListFunc() {
        shippingAddressesList().then(res => {
          this.addressList = res.items
          const defaultAddr = this.addressList.find(addr => {
            return addr.default === true
          })
          this.defaultAddr = defaultAddr.id
        })
      },
      getPostageListFunc() {
        postagesList().then(res => {
          this.postagesListData = res.items
        })
      },
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
            const id = this.$route.query.id
            if (id && id.length === 24) {
              spusInfo(id).then(res => {
                this.loading = false
                this.showGoodsEditor(res.item)
              })
            } else {
              this.loading = false
            }
          }
        })
      },
      getTypeGoodsBaseInfo() {
        spuTypesList({ type: 1 }).then(response => {
          if (response.meta === 0) {
            this.sysTypes = response.items
            this.getTypeList()
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
      showGoodsEditor(data) {
        this.goodsProps = []
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
            intro: data.intro,
            type: data.type,
            cobuy_person_count: data.cobuy ? data.cobuy.person_count : 0,
            cobuy_group_valid_sec: data.cobuy ? data.cobuy.cobuy_group_valid_sec : 0,
            images: data.images,
            desc: data.desc,
            shelf_status: data.shelf_status === 2 ? 2 : 1,
            shelf_time: data.shelf_time !== '--' ? data.shelf_time : this.$moment().format('YYYY-MM-DD HH:mm:ss'),
            address_id: data.address_id,
            postage_setting_id: data.postage_setting_id,
            rider_post_support: data.rider_post_support
          }
          this.isSetShelfTime = false
          console.log(this.$moment().format('YYYY-MM-DD HH:mm:ss'))
          if (data.shelf_time !== '--' && data.shelf_time > this.$moment().format('YYYY-MM-DD HH:mm:ss')) {
            this.isSetShelfTime = true
          }
          spusSkusList(data.id, { skip: 0, limit: -1 }).then(res => {
            this.goodsInventoryData = res.items
            data.specification_options && data.specification_options.forEach((op) => {
              this.goodsProps.push({ name: op.name, items: op.items, isInput: false, newTag: '' })
            })
          })
        } else {
          this.isSetShelfTime = false
          this.goodsSysTypes = []
          this.goodsSysTypeFields = []
          this.goodsData = {
            id: '',
            default_type_id: '',
            fields: {},
            merchant_type_ids: [],
            name: '',
            intro: '',
            type: 1,
            cobuy_person_count: 0,
            cobuy_group_valid_sec: 0,
            images: [],
            desc: '',
            shelf_status: 2,
            shelf_time: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
            address_id: '',
            postage_setting_id: '',
            rider_post_support: false
          }
        }
      },
      cancelGoodsEdit() {
        this.$router.push({ path: '/goods/list' })
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
      saveFunc(opt) {
        this.$refs['goodsForm'].validate((valid) => {
          if (valid) {
            if (!this.goodsData.default_type_id) {
              this.$message.error(this.$t('goods.systip1'))
              return
            }
            if (this.goodsProps.length < 1) {
              this.$message.error(this.$t('goods.ipTip'))
              return false
            }
            if (this.goodsData.images.length < 2) {
              this.$message.error(this.$t('goods.imgTip'))
              return false
            }
            this.updateGoodsFunc()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      imageUploadSuccess(data) {
        this.goodsData.images = this.goodsData.images ? this.goodsData.images : []
        this.goodsData.images.push(data.md5)
      },
      contentChangeFunc(data) {
        this.goodsData.desc = data
      },
      updateGoodsFunc() {
        const goodsItem = { default_type_id: this.goodsData.default_type_id, merchant_type_ids: JSON.stringify(this.goodsData.merchant_type_ids), name: this.goodsData.name, intro: this.goodsData.intro,
          type: this.goodsData.type, shelf_status: this.goodsData.shelf_status, shelf_time: this.goodsData.shelf_time, cobuy_person_count: this.goodsData.cobuy_person_count, cobuy_group_valid_sec: this.goodsData.cobuy_group_valid_sec, images: JSON.stringify(this.goodsData.images), desc: this.goodsData.desc }
        goodsItem['postage_setting_id'] = this.goodsData.postage_setting_id
        goodsItem['rider_post_support'] = this.goodsData.rider_post_support
        goodsItem['address_id'] = this.goodsData.address_id
        goodsItem['skus'] = JSON.stringify(this.goodsInventoryTable)
        goodsItem['spectification_options'] = JSON.stringify(this.goodsProps)
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
            this.disabled = false
            this.$message.success(this.$t('goods.saveTip2'))
          }).catch(() => {
            this.disabled = false
          })
        } else {
          this.disabled = true
          spusAdd(goodsItem).then(res => {
            this.goodsData.id = res.error
            this.disabled = false
            this.$confirm(this.$t('goods.saveTip1'), this.$t('tools.prompt'), {
              confirmButtonText: this.$t('tools.confirm'),
              cancelButtonText: this.$t('tools.cancel'),
              type: 'success'
            }).then(() => {
              this.$router.go(0)
            }).catch(() => {
              this.$router.push({ path: '/goods/list' })
            })
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
  .address-item{
    border-bottom: 1px solid #eeeeee;
    p{
      margin: 0px;
      padding: 0px;
    }
  }
</style>
