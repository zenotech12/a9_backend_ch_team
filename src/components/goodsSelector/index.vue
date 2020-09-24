<template>
  <div class="goodsSelector">
    <el-input v-if="!mulit" :placeholder="$t('goods.placeholder')" v-model="goodsInfo.name" clearable @clear="cancelSelect">
      <el-button slot="append" icon="el-icon-search" @click="showGoodsTable"></el-button>
    </el-input>
    <div v-else>
      <div v-if="showTag">
        <el-tag :key="goods.id" v-for="(goods, k) in selectedGoods" :closable="disabled" :disable-transitions="false"  @close="deleteSelectedGoods(k)">{{goods.name}}</el-tag>
        <el-button icon="el-icon-search" :disabled="!disabled" @click="showGoodsTable1" size="mini"></el-button>
      </div>
      <div v-if="!showTag">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="showGoodsTable1">选择商品</el-button>
      </div>
    </div>
    <el-dialog :title="$t('goods.selectorTitle')" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" center append-to-body :close-on-click-modal="false">
      <!-- 搜索 -->
      <el-row>
        <el-col :span="24" style="padding: 3px">
          <el-form :inline="true" :model="searchForm">
            <el-form-item>
              <el-cascader :options="typeData" v-model="selectTypes" :props="typeProp" clearable></el-cascader>
            </el-form-item>
            <el-form-item style="width: 150px">
              <el-select v-model="searchForm.approve_status" :disabled="approveDisable" @change="search" placeholder="请选择审批状态">
                <el-option
                  v-for="item in approveStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 150px">
              <el-select v-model="searchForm.shelf_status" :disabled="shelfDisable" @change="search" :placeholder="$t('goods.displaySelectorHolder')">
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
              <el-button type="primary" @click="search" size="mini" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="goodsDataTable" row-key="id" stripe v-loading="tableData.loading" @selection-change="handleSelectionChange" :data="tableData.body" style="width: 100%" highlight-current-row @current-change="selectGoodsChange">
            <el-table-column v-if="mulit" type="selection" :reserve-selection="true" width="55">
              <!--<template  slot-scope="scope">-->
                <!--<el-checkbox :checked="isSelected(scope.row)" @change="mulitSelectGoodsChange(scope.row)"></el-checkbox>-->
              <!--</template>-->
            </el-table-column>
            <el-table-column prop="name" width="50">
              <template  slot-scope="scope">
                <img :src="getImageUrl(scope.row.images[0],200,200)" width="50" height="50"/>
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('goods.name')"></el-table-column>
            <el-table-column :label="$t('goods.checkStatus')">
              <template  slot-scope="scope">
                <el-tag :type="scope.row.approve_status === 2 ? 'success' : (scope.row.approve_status === 3 ? 'danger' : 'info' )">
                  {{scope.row.approve_status === 2 ? $t('goods.checkStatusB') : (scope.row.approve_status === 3 ? $t('goods.checkStatusC') : $t('goods.checkStatusA') )}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('goods.putaway')">
              <template  slot-scope="scope">
                <el-tag v-if="scope.row.approve_status === 2" @click="goodsShelfModify(scope.row)" :type="scope.row.shelf_status === 2 ? 'success' :  'danger'">
                  {{scope.row.shelf_status === 2 ? $t('goods.hasBeenAddedTo') : $t('goods.removed')}}
                </el-tag>
                <template v-else>
                  --
                </template>
              </template>
            </el-table-column>
            <el-table-column :label="$t('goods.price')">
              <template  slot-scope="scope">
                <template v-if="scope.row.type === 3">
                  <el-tag size="mini" v-if="scope.row.type === 3">{{$t("goods.exp")}}</el-tag>
                  <span v-if="scope.row.min_price !== scope.row.max_price">{{scope.row.min_price}}-{{scope.row.max_price}}</span>
                  <span v-else>{{scope.row.min_price}}</span>
                </template>
                <template v-else>
                  <span v-if="scope.row.min_price !== scope.row.max_price">{{scope.row.min_price | price}}-{{scope.row.max_price | price}}</span>
                  <span v-else>{{scope.row.min_price | price}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <template v-if="itemCount !== 0">
            <div style="text-align: right;margin-top: 10px">
              <el-pagination
                @size-change="sizeChangeFunc"
                @current-change="pageChangeFunc"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="itemCount">
              </el-pagination>
            </div>
          </template>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer" v-if="mulit">
        <confirm-button @confirmButton="saveSelectedFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { spusList, spuTypesList, spusInfo } from '@/api/goods'
  export default {
    components: {
    },
    data() {
      return {
        typeData: [],
        selectTypes: [],
        typeProp: { value: 'id', label: 'name', children: 'items' },
        searchForm: {
          skip: 0,
          limit: 5,
          approve_status: 0, // 审批状态 0所有 1待审批 2审批成功 3拒绝
          type_id: '',
          shelf_status: 0, // 上架状态 所有0 未上架1 上架2
          distribution: 0, // 0所有 1不参与分销 2参与分销
          not_spu_ids: '' // 除开里面的spu
        },
        approveDisable: false,
        shelfDisable: false,
        approveStatus: [
          {
            value: 0,
            label: this.$t('goods.all')
          }, {
            value: 1,
            label: this.$t('goods.pending')
          }, {
            value: 2,
            label: this.$t('goods.approvalSuccess')
          }, {
            value: 3,
            label: this.$t('goods.refuse')
          }],
        shelfStatus: [
          {
            value: 0,
            label: this.$t('goods.whole')
          }, {
            value: 1,
            label: this.$t('goods.notListed')
          }, {
            value: 2,
            label: this.$t('goods.shangJia')
          }],
        itemCount: 0,
        tableData: {
          loading: true,
          body: []
        },
        currentPage: 1,
        pageSize: 5,
        goodsInfo: { id: '', name: '' },
        selectedGoods: [],
        dialogFormVisible: false,
        submitDisabled: false,
        selectedGoodsIds: '',
        multipleSelection: []
      }
    },
    model: {
      prop: 'goodsId',
      event: 'goodSelectedChange'
    },
    props: {
      goodsId: {
        type: String,
        default: function() {
          return ''
        }
      },
      notSpuIds: {
        type: String,
        default: function() {
          return ''
        }
      },
      mulit: {
        type: Boolean,
        default() {
          return false
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return true
        }
      },
      trigger: {
        type: Boolean,
        default() {
          return true
        }
      },
      showTag: {
        type: Boolean,
        default() {
          return true
        }
      },
      approve_status: {
        type: Number,
        default() {
          return 0
        }
      },
      shelf_status: {
        type: Number,
        default() {
          return 0
        }
      },
      haveTime: {
        type: Boolean,
        default() {
          return false
        }
      },
      distribution: {
        type: Number,
        default() {
          return 0
        }
      }
    },
    created() {
    },
    mounted() {
      if (this.notSpuIds !== '' && this.notSpuIds.length > 24) {
        this.searchForm.not_spu_ids = this.notSpuIds
      }
      this.getTableData()
      this.getTypeList()
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getTableData()
      },
      pageSize(val) {
        if (this.currentPage !== 1) {
          this.currentPage = 1
        } else {
          this.searchForm.limit = val
          this.getTableData()
        }
      },
      notSpuIds(val) {
        if (val !== '' && val.length > 24) {
          this.searchForm.not_spu_ids = this.notSpuIds
          this.getTableData()
        } else {
          this.searchForm.not_spu_ids = ''
          this.getTableData()
        }
        // console.log('notSpuIds', val)
      },
      // haveTime(val) {
      //   console.log('valll;', val)
      // },
      selectTypes(val) {
        if (val.length < 1) {
          this.searchForm.type_id = ''
        } else {
          this.searchForm.type_id = val[ val.length - 1]
        }
        this.searchForm.skip = 0
        this.currentPage = 1
        this.getTableData()
      },
      goodsId: {
        handler(val) {
          // console.log(val, 'xx')
          if (val !== '' && val.length >= 24) {
            if (!this.mulit) {
              if (this.goodsInfo.id !== val) {
                this.getGoodsInfo()
              }
            } else if (val !== JSON.stringify(this.selectedGoodsIds)) {
              this.selectedGoodsIds = JSON.parse(val)
              this.getSelectedGoods(val)
              // console.log('this.selectedGoodsIds', this.selectedGoodsIds)
            }
          } else {
            this.goodsInfo = {}
            this.selectedGoods = []
            this.selectedGoodsIds = []
          }
        },
        immediate: true
      },
      approve_status: {
        handler(val) {
          this.searchForm.approve_status = val
          if (val > 0) {
            this.approveDisable = true
          }
        },
        immediate: true
      },
      shelf_status: {
        handler(val) {
          this.searchForm.shelf_status = val
          if (val > 0) {
            this.shelfDisable = true
          }
        },
        immediate: true
      },
      distribution: {
        handler(val) {
          this.searchForm.distribution = val
        },
        immediate: true
      }
    },
    computed: {
    },
    methods: {
      handleSelectionChange(val) {
        this.selectedGoods = val
        // console.log('val', val)
        this.selectedGoodsIds = []
        val.forEach(res => {
          this.selectedGoodsIds.push(res.id)
        })
        if (this.trigger) {
          this.emitGoodsIds()
        }
      },
      toggleSelection(rows) {
        if (!this.$refs.goodsDataTable) {
          return
        }
        if (rows) {
          // this.tableData.body.forEach(item => {
          //   const exit = rows.find(r => {
          //     return r.id === item.id
          //   })
          //   if (exit) {
          //     console.log('exit', exit)
          //     this.$refs.goodsDataTable.toggleRowSelection(item, true)
          //   }
          // })
          rows.forEach(row => {
            const find = this.tableData.body.find(item => {
              return item.id === row.id
            })
            if (find) {
              this.$refs.goodsDataTable.toggleRowSelection(find, true)
            } else {
              this.$refs.goodsDataTable.toggleRowSelection(row, true)
            }
          })
        } else {
          this.$refs.goodsDataTable.clearSelection()
        }
      },
      showGoodsTable() {
        this.dialogFormVisible = true
      },
      showGoodsTable1() {
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.toggleSelection(this.selectedGoods)
        })
      },
      sizeChangeFunc() {

      },
      pageChangeFunc() {

      },
      getTypeList() {
        spuTypesList({ type: 2 }).then(response => {
          if (response.meta === 0) {
            this.typeData = []
            if (response.items !== null) {
              this.typeData = response.items
            }
          }
        })
      },
      goodsTypeChange(data) {
        if (data.length < 1) {
          this.goodsData.merchant_type_id = ''
        } else {
          this.goodsData.merchant_type_id = data[data.length - 1]
        }
      },
      getTableData() {
        spusList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.tableData.loading = false
            this.itemCount = response.total
            this.tableData.body = response.items
            this.$nextTick(() => {
              if (this.$refs.goodsDataTable) {
                this.tableData.body.forEach(item => {
                  const exit = this.selectedGoodsIds.find(r => {
                    return r.id === item.id
                  })
                  if (exit) {
                    this.$refs.goodsDataTable.toggleRowSelection(item, true)
                  }
                })
              }
            })
          }
        })
      },
      getSelectedGoods(gids) {
        spusList({ spu_ids: gids, skip: 0, limit: 1000 }).then(res => {
          this.selectedGoods = res.items
        })
      },
      getGoodsInfo() {
        spusInfo(this.goodsId).then((res) => {
          this.goodsInfo = res.item
        })
      },
      search() {
        this.getTableData()
      },
      selectGoodsChange(val) {
        if (!this.mulit) {
          this.goodsInfo = JSON.parse(JSON.stringify(val))
          this.$emit('goodSelectedChange', this.goodsInfo.id)
          this.$emit('selectChanged', this.goodsInfo)
          this.dialogFormVisible = false
        }
      },
      cancelSelect() {
        if (!this.mulit) {
          this.$emit('goodSelectedChange', '')
          this.$emit('selectChanged', {})
          this.$refs.goodsDataTable.setCurrentRow([])
        }
      },
      isSelected(row) {
        return this.selectedGoodsIds.includes(row.id)
      },
      mulitSelectGoodsChange(row) {
        if (this.selectedGoodsIds.includes(row.id)) {
          this.selectedGoodsIds.splice(this.selectedGoodsIds.indexOf(row.id), 1)
          const gi = this.selectedGoods.findIndex(item => {
            return item.id === row.id
          })
          this.selectedGoods.splice(gi, 1)
        } else {
          this.selectedGoods.push(row)
          this.selectedGoodsIds.push(row.id)
        }
        this.emitGoodsIds()
      },
      saveSelectedFunc() {
        this.dialogFormVisible = false
        this.emitGoodsIds()
      },
      deleteSelectedGoods(k) {
        this.selectedGoodsIds.splice(this.selectedGoodsIds.indexOf(this.selectedGoods[k].id), 1)
        this.selectedGoods.splice(k, 1)
        this.emitGoodsIds()
      },
      emitGoodsIds() {
        this.$emit('goodSelectedChange', JSON.stringify(this.selectedGoodsIds))
        this.$emit('selectChanged', this.selectedGoods)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .goodsSelector{
    div{
      vertical-align: middle !important;
    }
  }
</style>
