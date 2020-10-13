<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row class="liveBox">
          <el-col :span="24">
            <el-row>
              <el-col :span="24" class="liveBigBoxCurrent">
                <el-form ref="form" :inline="true" :model="form" label-width="120px">
                  <el-form-item :label="$t('sys.freeShipingDate')">
                    <el-date-picker
                      v-model="freeShipingTime"
                      type="datetimerange"
                      value-format = "yyyy-MM-dd HH:mm"
                      :range-separator="$t('operation.to')"
                      :start-placeholder="$t('tools.startDate')"
                      :end-placeholder="$t('tools.endDate')"
                      align="right">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item :label="$t('sys.freeShipingTitle1')">
                    <el-radio-group v-model="form.cond_type" @change="typeChange">
                      <el-radio :label="1">{{$t('sys.number')}}</el-radio>
                      <el-radio :label="2">{{$t('sys.price')}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('sys.number')" v-if="form.cond_type === 1">
                    <el-input v-model.number="form.cond_val"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('sys.price')" v-if="form.cond_type === 2">
                    <price-input v-model="form.cond_val"></price-input>
                  </el-form-item>
                  <el-form-item :label="$t('sys.allGoods')">
                    <el-switch
                      v-model="form.all"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                  </el-form-item>
                </el-form>
              </el-col>
              <!--商品表格-->
              <el-col :span="24" v-if="form.all === false">
                <el-row>
                  <el-col :span="24" style="text-align: right;padding: 10px 15px" v-if="permissionCheck('opt')">
                    <div class="boxFuncBtn">
                      <goods-selector :mulit="true" :trigger="false" :showTag="false" v-model="spu_ids" :notSpuIds="JSON.stringify(notSpuIds)" @selectChanged="addNewGoods" :approve_status="2" :shelf_status="2"></goods-selector>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <div style="height: calc(100vh - 270px)">
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
                        <el-table-column prop="inventory" :label="$t('goods.inventory')"></el-table-column>
                        <el-table-column prop="sales" :label="$t('goods.saled')"></el-table-column>
                        <el-table-column prop="gen_time"  :label="$t('goods.publishTime')"></el-table-column>
                        <el-table-column :label="$t('tools.opt')" v-if="permissionCheck('opt')">
                          <template slot-scope="scope">
                            <i class="el-icon-delete" style="font-size: 18px;cursor: pointer" @click="delCurrentGoods(scope.row.id)"></i>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="optBtnStyle">
              <el-col :span="24" style="margin-top: 20px">
                <confirm-button @confirmButton="saveAdFunc" :disabled="submitDisabled" v-if="permissionCheck('opt')" :confirmButtonInfor="$t('tools.save')"></confirm-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import goodsSelector from '@/components/goodsSelector'
  import { spusList } from '@/api/goods'
  import { getFreePostage, freePostageSet } from '@/api/system'
  export default {
    components: {
      goodsSelector
    },
    data() {
      return {
        tableData: [],
        form: {
          spu_ids: '', // ["xxxx","xxxxxxx"]商品ids
          bt: '', // 2019-01-01 15:34
          et: '',
          cond_type: 1, // 1件数 2价格 计价方式
          cond_val: 0, // 值  cond_type 选1的话下面就是输入件数 单位件  选2就输入价格，价格按分  传的整数
          all: false // true false 是否全部商品
        },
        freeShipingObj: {},
        primary: 'primary',
        searchKey: '',
        searchCode: '',
        currentDataGoods: [],
        spu_ids: '',
        notSpuIds: [],
        submitDisabled: false,
        freeShipingTime: [] // 包邮日期
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
        // this.spu_ids = ''
        console.log('this.supid', this.spu_ids)
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
        // console.log('tu', this.form)
        freePostageSet(this.form).then(res => {
          this.getFreeShipingFunc()
          this.$message.success(this.$t('operation.saveSuccess'))
          this.submitDisabled = false
        }).catch(() => {
          this.submitDisabled = false
        })
      },
      getFreeShipingFunc() {
        getFreePostage().then(res => {
          this.form = res.item ? JSON.parse(JSON.stringify(res.item)) : {}
          // console.log('this.form', this.form)
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
        })
      },
      getGoodsList() {
        spusList({ 'spu_ids': JSON.stringify(this.notSpuIds) }).then(res => {
          this.tableData = JSON.parse(JSON.stringify(res.items))
          this.currentDataGoods = JSON.parse(JSON.stringify(res.items))
        })
      }
    },
    mounted() {
    },
    created() {
      this.getFreeShipingFunc()
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
