<template>
  <div class="sys-body">
      <!-- 搜索 -->
      <el-row  v-if="shopInfo.distribution">
        <el-col :span="4" class="funcTree" style="margin:0;">
          <el-row>
            <el-col :span="24" class="funcBoxTitle" style="display:flex; align-items: center; padding-left: 15px; font-weight:bold;">
              <div >{{$t('goods.type')}}</div>
            </el-col>
          </el-row>
          <div class="custom-tree-container">
            <div class="block">
              <el-tree style="height: calc(100vh - 147px); overflow-y: auto;"
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
        </el-col>
        <el-col :span="20" class="funcBox">
          <div class="rightbox">
            <!-- 搜索 -->
            <el-row style="margin: 10px 0">
              <el-col :span="20" style="padding: 6px 10px ">
                <el-form :inline="true" :model="searchForm">
                  <el-form-item>
                    <el-radio-group v-model="searchForm.distribution_low_profits" @change="search" size="medium">
                      <el-radio-button :label="0">{{$t('goods.all')}}</el-radio-button>
                      <el-radio-button :label="1">{{$t('goods.noLowMarginGoods')}}</el-radio-button>
                      <el-radio-button :label="2">{{$t('goods.lowMarginGoods')}}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item style="margin-left: 50px">
                    <el-input v-model="searchForm.key" :placeholder="$t('tools.searchKeyTip')" clearable></el-input>
                  </el-form-item>
                  <el-form-item class="searchBtn">
                    <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="4" style="text-align: right;padding: 10px 15px">
                <div class="boxFuncBtn" v-if="permissionCheck('opt')">
                  <el-button type="success" size="small" icon="el-icon-plus" @click="showShareEditor">{{$t('tools.add')}}</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="height: calc(100vh - 175px)">
                <el-table stripe v-loading="tableData.loading" :data="tableData.body" height="calc(100% - 50px)" style="width: 100%;" row-key="id" border  @selection-change="handleSelectionChange">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column label="#" width="60px" fixed="left">
                    <template slot-scope="scope">
                      {{scope.$index + searchForm.skip + 1}}
                    </template>
                  </el-table-column>
                  <el-table-column  :label="$t('goods.name')" min-width="200">
                    <template  slot-scope="scope">
                      <div class="goods-item">
                        <el-image class="image" style="width: 60px; height: 60px"  :src="getImageUrl(scope.row.images[0], 100,100)"  fit="cover"></el-image>
                        <div class="g-info">
                          <p>{{scope.row.name}}</p>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('goods.price')" width="120">
                    <template  slot-scope="scope">
                      <span v-if="scope.row.min_price !== scope.row.max_price">{{scope.row.min_price | price}}-{{scope.row.max_price | price}}</span>
                      <span v-else>{{scope.row.min_price | price}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sales" width="150"  :label="$t('goods.commissionMoney')">
                    <template  slot-scope="scope">
                      <span v-if="scope.row.min_brokerage !== scope.row.max_brokerage">{{scope.row.min_brokerage | price}}-{{scope.row.max_brokerage | price}}</span>
                      <span v-else>{{scope.row.min_brokerage | price}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('tools.opt')" width = "220" fixed="right" align="center" header-align="left">
                    <template slot-scope="scope">
                      <el-button :title="$t('tools.copyLinkTip')" v-clipboard:copy="goodsShareLink(scope.row.id)" v-clipboard:success="copySuccess" v-clipboard:error="copyError"  size="small">{{$t('tools.copyLink')}}</el-button>
                      <!--<span class="xiexian">/</span>-->
                      <!--<el-button type="text" @click="editShareGoods(scope.row)" size="small">{{$t('tools.edit')}}</el-button>-->
                      <template  v-if="permissionCheck('opt')">
                        <delete-button @delData="deleteShareGoods(scope.row)"></delete-button>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
                <template v-if="itemCount !== 0">
                  <el-row style="margin-top: 10px">
                    <el-col :span="8">
                      <el-button v-if="permissionCheck('opt')" size="small" type="danger" @click="batchDelFunc()">{{$t('tools.batchDelete')}}</el-button>
                      &nbsp;
                    </el-col>
                    <el-col :span="16"  style="text-align: right;">
                    <el-pagination
                      @size-change="sizeChangeFunc"
                      @current-change="pageChangeFunc"
                      :current-page.sync="currentPage"
                      :page-size="10"
                      layout="total, prev, pager, next, jumper"
                      :total="itemCount">
                    </el-pagination>
                    </el-col>
                  </el-row>
                </template>
              </el-col>
            </el-row>
            <el-dialog width="800px" @close="cancelShareEdit" :visible.sync="shareEditorShow" :close-on-click-modal="false" center>
              <span slot="title" style="font-weight: bold; font-size: 15px">{{$t('goods.shareSet')}}</span>
              <el-form :model="shareForm" ref="forms" label-width="170px" label-position="left">
                <template v-if="!shareForm.edit">
                  <el-form-item :label="$t('goods.shareGoods')" style="margin-bottom: 15px !important;" >
                    <el-checkbox v-model="shareForm.all">{{$t('goods.shareAll')}}</el-checkbox>
                  </el-form-item>
                  <el-form-item v-if="!shareForm.all" :label="$t('goods.goodsSelect')" style="margin-bottom: 15px !important;" >
                    <goods-selector v-if="shareEditorShow" v-model="shareForm.spu_ids" :approve_status="2" :shelf_status="2" :distribution="1" :mulit="true"></goods-selector>
                  </el-form-item>
                  <el-form-item :label="$t('goods.distributionLowProfits')">
                    <el-switch
                      v-model="shareForm.distribution_low_profits"
                      :active-text="$t('goods.yes')"
                      :inactive-text="$t('goods.not')">
                    </el-switch>
                  </el-form-item>
                </template>
                <template v-else>
                  <el-form-item :label="$t('goods.shareGoods')">
                    {{shareForm.goodsName}}
                  </el-form-item>
                </template>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <confirm-button @confirmButton="addShareGoods('form')"></confirm-button>
                <el-button @click="cancelShareEdit" size="small" style="margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
              </div>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
      <el-row  style="margin-top: 24px;" v-else>
        <el-alert
          :title="$t('goods.shareTip')"
          type="error" :closable="false"
          show-icon>
        </el-alert>
      </el-row>
  </div>
</template>

<script>
  import { spusList, spuTypesList, spuDistribution } from '@/api/goods'
  import { mapGetters } from 'vuex'
  import goodsSelector from '@/components/goodsSelector'
  import { appUrl } from '@/utils/serverConfig'
  export default {
    components: {
      goodsSelector
    },
    data() {
      return {
        goodsTypeData: [],
        defaultProps: {
          children: 'items',
          label: 'name'
        },
        searchForm: {
          skip: 0,
          limit: 10,
          approve_status: 0, // 审批状态 0所有 1待审批 2审批成功 3拒绝
          merchant_id: '', // 商户id，不填所有，自营填000000000000000000000001
          type_id: '',
          shelf_status: 0, // 上架状态 所有0 未上架1 上架2
          distribution: 2,
          distribution_low_profits: 0 // 分销 0所有 1非低利润商品 2低利润商品
        },
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        tableData: {
          loading: true,
          body: []
        },
        shareEditorShow: false,
        shareForm: {
          goodsName: '',
          edit: false,
          all: false,
          spu_ids: '',
          distribution: true,
          distribution_low_profits: false // 是否为低利润商品true false
        },
        multipleSelection: []
      }
    },
    created() {
      // this.$store.state.user.funcListName = '资源列表'
      // this.$store.state.user.pathRouter = false
    },
    mounted() {
      this.getTableData()
      this.getTypeList()
      // this.getPartner()
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getTableData()
      }
    },
    computed: {
      ...mapGetters([
        'shopInfo'
      ])
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = []
        val.forEach((item) => {
          this.multipleSelection.push(item.id)
        })
      },
      goodsShareLink(id) {
        return appUrl + '/goods/info?id=' + id
      },
      copySuccess() {
        this.$message.success(this.$t('tools.copySuccess'))
      },
      copyError(e) {
        this.$message.error(e)
      },
      getTypeList() {
        spuTypesList({ type: 2 }).then(response => {
          if (response.meta === 0) {
            this.typeData = []
            this.goodsTypeData = []
            if (response.items !== null) {
              this.isShowType = true
              this.typeData = response.items
              this.goodsTypeData = [{ name: this.$t('tools.all'), code: '', id: '' }, ...response.items]
            } else {
              this.isShowType = false
            }
          }
        })
      },
      renderContent(h, { node, data, store }) {
        return (
          <span class='custom-tree-node'>
            <span title={node.label}>{node.label}</span>
          </span>)
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
      search() {
        this.searchForm.skip = 0
        this.currentPage = 1
        this.getTableData()
      },
      showShareEditor() {
        this.shareForm.edit = false
        this.shareForm.spu_ids = ''
        this.shareEditorShow = true
      },
      cancelShareEdit() {
        this.shareEditorShow = false
      },
      deleteShareGoods(row) {
        const goodsIds = [row.id]
        spuDistribution({ distribution: false, spu_ids: JSON.stringify(goodsIds) }).then(res => {
          this.getTableData()
        })
      },
      batchDelFunc(row) {
        if (this.multipleSelection.length < 1) {
          this.$message.error(this.$t('goods.batchOptTip'))
          return
        }
        spuDistribution({ distribution: false, spu_ids: JSON.stringify(this.multipleSelection) }).then(res => {
          this.getTableData()
        })
      },
      editShareGoods(row) {
        this.shareForm.edit = true
        this.shareForm.goodsName = row.name
        this.shareForm.spu_ids = JSON.stringify([row.id])
        this.shareEditorShow = true
      },
      addShareGoods() {
        console.log(this.shareForm)
        spuDistribution(this.shareForm).then(res => {
          this.shareEditorShow = false
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
    // .add-prop-btn {

    // }
  }

  /deep/{
      .el-tree-node{
      margin-left: 0;
    }
    .el-form-item{
      margin-bottom: 0 !important;
    }
  }
</style>
<style lang="scss">
  .custom-tree-node{
    & > span:first-child{
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
