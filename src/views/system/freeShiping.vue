<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <div class="rightbox">
        <el-row  v-if="permissionCheck('opt')">
          <el-col :span="24" class="funcList" style="padding: 10px 15px; padding-right: 0">
            <div class="boxFuncBtn" @click="addData">
              <!-- <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add"> -->
              <el-button type="success" size="small" icon="el-icon-plus">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100vh - 185px)">
              <el-table stripe border :data="data.body" height="calc(100% - 40px)">
                <el-table-column label="#" width="60px">
                  <template slot-scope="scope">
                    {{scope.$index + searchForm.skip + 1}}
                  </template>
                </el-table-column>
                <el-table-column prop="name" :label="$t('sys.name')"></el-table-column>
                <el-table-column :label="$t('sys.freeShipingDate')">
                  <template slot-scope="scope">
                    {{scope.row.bt + '~' + scope.row.et}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('sys.freeShipingTitle1')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.cond_type === 1">{{$t('sys.number')}}({{scope.row.cond_val}})</span>
                    <span v-if="scope.row.cond_type === 2">{{$t('sys.price')}}({{scope.row.cond_val | price}})</span>
                  </template>
                </el-table-column>
                <!--<el-table-column label="Value">-->
                  <!--<template slot-scope="scope">-->
                    <!--<span v-if="scope.row.cond_type === 1">{{$t('sys.number')}}: {{scope.row.cond_val}}</span>-->
                    <!--<span v-if="scope.row.cond_type === 2">{{$t('sys.price')}}: {{scope.row.cond_val | price}}</span>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column :label="$t('sys.allGoods')" width="200" align="center">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.all ? 'success': 'danger'">{{scope.row.all ? $t('sys.yes'): $t('sys.no')}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('tools.opt')" width = "180"  v-if="permissionCheck('opt')" align="center">
                  <template slot-scope="scope">
                    <el-button @click="showDataEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
          
                    <delete-button  @delData="deleteDataFunc(scope.row)"></delete-button>
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
            </div>
          </el-col>
        </el-row>
        <el-dialog width="80%" @close="formEditDialog = false" :visible.sync="formEditDialog" :close-on-click-modal="false" center style="top: -8vh;">
          <span slot="title" style="font-weight: bold; font-size: 15px">{{$t('global.freeShipingSet')}}</span>
          <el-form ref="form" :inline="true" :model="form" label-width="150">
            <el-form-item :label="$t('sys.name')">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.freeShipingDate')">
              <el-date-picker
                v-model="freeShipingTime"
                type="datetimerange"
                value-format = "yyyy-MM-dd HH:mm"
                range-separator="~"
                :start-placeholder="$t('tools.startDate')"
                :end-placeholder="$t('tools.endDate')"
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('sys.freeShipingTitle1')" style="padding-right: 20px">
              <el-radio-group v-model="form.cond_type" @change="typeChange">
                <el-radio :label="1">{{$t('sys.number')}}</el-radio>
                <el-radio :label="2">{{$t('sys.price')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('sys.number')" v-if="form.cond_type === 1">
              <el-input v-model.number="form.cond_val" style="width: 160px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.price')" v-if="form.cond_type === 2">
              <price-input v-model="form.cond_val" style="width: 160px"></price-input>
            </el-form-item>
            <el-form-item :label="$t('sys.allGoods')" style="float: right">
              <el-switch
                v-model="form.all"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-form>
          <el-row v-if="form.all === false">
                <el-col :span="24" style="text-align: right; padding: 0 0 20px 0" v-if="permissionCheck('opt')">
                  <div class="boxFuncBtn">
                    <goods-selector :mulit="true" :trigger="false" :showTag="false" v-model="spu_ids" :notSpuIds="JSON.stringify(notSpuIds)" @selectChanged="addNewGoods" :approve_status="2" :shelf_status="2"></goods-selector>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div style="height: calc(100vh - 390px)">
                    <el-table stripe border :data="tableData" height="calc(100% - -10px)">
                      <el-table-column>
                        <template slot="header" slot-scope="scope">
                          <el-input
                            v-model="searchKey"
                            size="mini"
                            clearable
                            :placeholder="$t('goods.name')"/>
                        </template>
                        <template  slot-scope="scope">
                          <a class="goods-item" target="_blank" style="cursor: pointer">
                            <el-image class="image" style="width: 60px; height: 60px"  :src="getImageUrl(scope.row.images[0], 100,100)"  fit="cover"></el-image>
                            <div class="g-info">
                              <p>{{scope.row.name}}
                                <el-tag size="mini" type="danger" v-if="scope.row.type === 2">{{$t("goods.cobuy")}}</el-tag>
                                <el-tag size="mini" v-if="scope.row.type === 3">{{$t("goods.exp")}}</el-tag>
                              </p>
                            </div>
                          </a>
                        </template>
                      </el-table-column>
                      <el-table-column :label="$t('goods.price')" align="center" width="200px">
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
                      <el-table-column prop="inventory" :label="$t('goods.inventory')" align="center" width="200px"></el-table-column>
                      <el-table-column prop="sales" :label="$t('goods.saled')" align="center" width="200px"></el-table-column>
                      <el-table-column prop="gen_time"  :label="$t('goods.publishTime')" align="center" width="250px"></el-table-column>
                      <el-table-column :label="$t('tools.opt')" width="140" v-if="permissionCheck('opt')" align="center">
                        <template slot-scope="scope">
                          <i class="el-icon-delete-solid" style="font-size: 18px; cursor: pointer; color: red" @click="delCurrentGoods(scope.row.id)"></i>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-col>
              </el-row>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveAdFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
            <el-button @click="formEditDialog = false" size="small" style="margin-right: 5px; margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import goodsSelector from '@/components/goodsSelector'
  import { spusList } from '@/api/goods'
  import { freePostageUpsert, freePostageModify, freePostagesDel, freePostagesList } from '@/api/system'
  export default {
    components: {
      goodsSelector
    },
    data() {
      return {
        tableData: [],
        form: {
          id: '',
          name: '',
          spu_ids: '', // ["xxxx","xxxxxxx"]商品ids
          bt: '', // 2019-01-01 15:34
          et: '',
          cond_type: 1, // 1件数 2价格 计价方式
          cond_val: 0, // 值  cond_type 选1的话下面就是输入件数 单位件  选2就输入价格，价格按分  传的整数
          all: false, // true false 是否全部商品
          result_type: 1, // 1包邮 2 %xx off 3满减
          result_val: '' // tp2百分数 百分值 ；tp3满减金额，单位分
        },
        searchKey: '',
        searchCode: '',
        currentDataGoods: [],
        spu_ids: '',
        notSpuIds: [],
        submitDisabled: false,
        freeShipingTime: [], // 包邮日期
        formEditDialog: false,
        searchForm: {
          skip: 0,
          limit: 10,
          result_type: 1
        },
        pageSize: 20,
        itemCount: 0,
        currentPage: 1,
        data: {
          loading: true,
          body: []
        }
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      freeShipingTime(val) {
        if (val.length > 0) {
          this.form.bt = val[0]
          this.form.et = val[1]
        } else {
          this.form.bt = ''
          this.form.et = ''
        }
      },
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getTableData()
      },
      'form.all': function(val) {
        if (val) {
          this.notSpuIds = []
          this.form.spu_ids = ''
          this.tableData = []
          this.currentDataGoods = []
        }
      },
      searchKey(val) {
        if (val === '') {
          this.tableData = this.currentDataGoods
        } else {
          const array = []
          this.tableData.forEach(item => {
            const name = item.name.toUpperCase()
            const searchKey = val.toUpperCase()
            if (name.indexOf(searchKey) !== -1) {
              array.push(item)
            }
          })
          this.tableData = array
        }
      }
    },
    methods: {
      sizeChangeFunc(val) {
        this.pageSize = val
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      getTableData() {
        freePostagesList(this.searchForm).then(response => {
          if (response.meta === 0) {
            this.data.loading = false
            this.itemCount = response.total
            this.data.body = response.items
          }
        })
      },
      addData() {
        this.formEditDialog = true
        this.form.id = ''
        this.form.name = ''
        this.form.spu_ids = ''
        this.form.bt = ''
        this.form.et = ''
        this.form.cond_type = 1
        this.form.cond_val = 0
        this.form.all = false
        this.tableData = []
        this.notSpuIds = []
      },
      typeChange() {
        this.form.cond_val = 0
      },
      delCurrentGoods(id) {
        const array = this.notSpuIds
        array.splice(array.indexOf(id), 1)
        const index = this.tableData.findIndex(c => {
          if (c.id === id) {
            return c
          }
        })
        this.spu_ids = ''
        this.notSpuIds = array
        // console.log('notSpuIds', this.notSpuIds)
        this.tableData.splice(index, 1)
        this.currentDataGoods = this.tableData
      },
      addNewGoods() {
        const array = JSON.parse(this.spu_ids)
        array.forEach(v => {
          if (this.notSpuIds.indexOf(v) === -1) {
            this.notSpuIds.push(v)
          }
        })
        this.getGoodsList()
        console.log('this.supid', this.spu_ids)
      },
      deleteDataFunc(data) {
        freePostagesDel(data.id).then(res => {
          if (res.meta === 0) {
            this.$message.success(this.$t('tools.deleteSuccess'))
            this.getTableData()
          }
        })
      },
      showDataEditor(data) {
        this.formEditDialog = true
        this.form = JSON.parse(JSON.stringify(data))
        this.freeShipingTime = [this.form.bt, this.form.et]
        const array = []
        if (this.form.spu_ids !== null && this.form.spu_ids !== []) {
          this.form.spu_ids && this.form.spu_ids.forEach(v => {
            if (array.indexOf(v) === -1) {
              array.push(v)
            }
          })
          this.notSpuIds = array
          if (this.form.spu_ids.length > 0) {
            this.getGoodsList()
          }
        }
      },
      saveAdFunc() {
        if (this.form.bt === '') {
          this.$message.error(this.$t('sys.pleaseChooseFreeShipingDate'))
          return
        }
        this.submitDisabled = true
        if (this.form.all === false) {
          this.form.spu_ids = JSON.stringify(this.notSpuIds)
        } else {
          this.form.spu_ids = ''
        }
        if (this.form.id === '') {
          freePostageUpsert(this.form).then(res => {
            this.getTableData()
            this.$message.success(this.$t('operation.saveSuccess'))
            this.submitDisabled = false
            this.formEditDialog = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else {
          freePostageModify(this.form.id, this.form).then(res => {
            this.getTableData()
            this.$message.success(this.$t('operation.saveSuccess'))
            this.submitDisabled = false
            this.formEditDialog = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
      },
      getGoodsList() {
        spusList({ 'spu_ids': JSON.stringify(this.notSpuIds) }).then(res => {
          this.tableData = JSON.parse(JSON.stringify(res.items))
          this.currentDataGoods = JSON.parse(JSON.stringify(res.items))
        })
      }
    },
    mounted() {
      this.getTableData()
    },
    created() {
      // this.getFreeShipingFunc()
    }
  }
</script>

<style lang="scss" scoped>
  .liveBigBoxCurrent {
    /deep/ {
      .el-form-item {
        margin-bottom: 0!important;
      }
    }
  }
  .liveVideo {
    /deep/
    .my-video-dimensions.vjs-fluid {
      padding-top: 0;
    }
  }
  .liveBox {
    position: relative;
    height: calc(100vh - 236px);
  }
  .optBtnStyle {
    position: absolute;
    bottom: -105px;
  }
  .historyBox {
    /deep/
    .el-table__body-wrapper {
      overflow-y: auto;
    }
  }
</style>
