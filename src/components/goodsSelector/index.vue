<template>
  <div class="goodsSelector">
    <el-input v-if="!mulit" :placeholder="$t('goods.placeholder')" v-model="goodsInfo.name" clearable @clear="cancelSelect">
      <el-button slot="append" icon="el-icon-search" @click="showGoodsTable"></el-button>
    </el-input>
    <div v-else>
      <el-tag :key="goods.id" v-for="(goods, k) in selectedGoods" closable :disable-transitions="false"  @close="deleteSelectedGoods(k)">{{goods.name}}</el-tag>
      <el-button icon="el-icon-search" @click="showGoodsTable" size="mini"></el-button>
    </div>
    <el-dialog :title="$t('goods.selectorTitle')"  :visible.sync="dialogFormVisible" center append-to-body :close-on-click-modal="false">
      <!-- 搜索 -->
      <el-row>
        <el-col :span="24" style="padding: 3px">
          <el-form :inline="true" :model="searchForm">
            <el-form-item>
              <el-cascader :options="typeData" v-model="selectTypes" :props="typeProp" clearable></el-cascader>
            </el-form-item>
            <el-form-item style="width: 150px">
              <el-select v-model="searchForm.approve_status" @change="search" placeholder="请选择审批状态">
                <el-option
                  v-for="item in approveStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 150px">
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
              <el-button type="primary" @click="search" size="mini" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="goodsDataTable" row-key="id" stripe v-loading="tableData.loading" :data="tableData.body" style="width: 100%" highlight-current-row @current-change="selectGoodsChange">
            <el-table-column v-if="mulit" width="55">
              <template  slot-scope="scope">
                <el-checkbox :checked="isSelected(scope.row)" @change="mulitSelectGoodsChange(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column label="审核">
              <template  slot-scope="scope">
                <el-tag :type="scope.row.approve_status === 2 ? 'success' : (scope.row.approve_status === 3 ? 'danger' : 'info' )">
                  {{scope.row.approve_status === 2 ? '已审' : (scope.row.approve_status === 3 ? '驳回' : '待审' )}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="上下架">
              <template  slot-scope="scope">
                <el-tag v-if="scope.row.approve_status === 2" @click="goodsShelfModify(scope.row)" :type="scope.row.shelf_status === 2 ? 'success' :  'danger'">
                  {{scope.row.shelf_status === 2 ? '已上架' : '已下架'}}
                </el-tag>
                <template v-else>
                  --
                </template>
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template  slot-scope="scope">
                {{scope.row.min_price + (scope.row.min_price === scope.row.max_price ? '': ('-' + scope.row.max_price))}}
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
          limit: 10,
          approve_status: 0, // 审批状态 0所有 1待审批 2审批成功 3拒绝
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
        itemCount: 0,
        tableData: {
          loading: true,
          body: []
        },
        currentPage: 1,
        pageSize: 10,
        goodsInfo: { id: '', name: '' },
        selectedGoods: [],
        dialogFormVisible: false,
        submitDisabled: false,
        selectedGoodsIds: ''
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
      mulit: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    created() {
    },
    mounted() {
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
          console.log(val, 'xx')
          if (val !== '' && val.length >= 24) {
            if (!this.mulit) {
              if (this.goodsInfo.id !== val) {
                this.getGoodsInfo()
              }
            } else if (val !== JSON.stringify(this.selectedGoodsIds)) {
              this.selectedGoodsIds = JSON.parse(val)
              this.getSelectedGoods(val)
            }
          } else {
            this.goodsInfo = {}
            this.selectedGoods = []
            this.selectedGoodsIds = []
          }
        },
        immediate: true
      }
    },
    computed: {
    },
    methods: {
      showGoodsTable() {
        this.dialogFormVisible = true
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
        console.log(val, 'selected')
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
      },
      deleteSelectedGoods(k) {
        this.selectedGoodsIds.splice(this.selectedGoodsIds.indexOf(this.selectedGoods[k].id), 1)
        this.selectedGoods.splice(k, 1)
        this.emitGoodsIds()
      },
      emitGoodsIds() {
        this.$emit('goodSelectedChange', JSON.stringify(this.selectedGoodsIds))
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
