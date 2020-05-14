<template>
  <div class="sys-body">
    <div v-if="shopInfo.goods_cut" class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="20" style="padding: 6px 15px ">
            <el-form :inline="true" :model="searchForm">
              <el-form-item>
                <el-input v-model="searchForm.key" :placeholder="$t('tools.searchKeyTip')" clearable></el-input>
              </el-form-item>
              <el-form-item class="searchBtn">
                <el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" style="text-align: right;padding: 10px 15px">
            <div class="boxFuncBtn" @click="addData">
              <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="height: calc(100vh - 200px)">
            <el-table stripe border :data="tableData" height="calc(100% - 40px)" style="width: 100%;">
              <el-table-column  :label="$t('operation.cutGoods')" min-width="300">
                <template  slot-scope="scope">
                  <div class="goods-item">
                    <el-image class="image" style="width: 60px; height: 60px"  :src="getImageUrl(scope.row.img, 100,100)"  fit="cover"></el-image>
                    <div class="g-info">
                      <p>{{scope.row.spu_name}}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('operation.cutTimes')" width="300">
                <template  slot-scope="scope">
                  {{scope.row.bt}}{{$t('tools.to')}}{{scope.row.et}}
                </template>
              </el-table-column>
              <el-table-column width="200"  :label="$t('operation.cutWay')">
                <template slot-scope="scope">
                  <template v-if="scope.row.cut_way === 1">
                    {{$t('operation.cutWay1')}}({{scope.row.price_cut | price}})
                  </template>
                  <template v-if="scope.row.cut_way === 2">
                    {{$t('operation.cutWay2')}}({{scope.row.price_cut_range_bt | price}}-{{scope.row.price_cut_range_et | price}})
                  </template>
                </template>
              </el-table-column>
              <el-table-column :label="$t('operation.cutCount')" width="120">
                <template slot-scope="scope">
                  {{scope.row.count}}
                </template>
              </el-table-column>
              <el-table-column width="150"  :label="$t('operation.cutCountTip')">
                <template slot-scope="scope">
                  {{scope.row.cutting_count}}/{{scope.row.sales}}
                </template>
              </el-table-column>
              <el-table-column :label="$t('tools.opt')" width = "120" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="showDataEditor(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                  <span class="xiexian">/</span>
                  <delete-button :promptInfor="promptInfor" @delData="deleteDataFunc(scope.row)"></delete-button>
                </template>
              </el-table-column>
            </el-table>
            <template v-if="itemCount !== 0">
              <div style="text-align: right;margin-top: 10px">
                <el-pagination
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="itemCount">
                </el-pagination>
              </div>
            </template>
          </el-col>
        </el-row>
        <el-dialog :title="$t('operation.cutGoodsEdit')" width="700px" @close="formEditDialog=false" :visible.sync="formEditDialog" :close-on-click-modal="false" center >
          <el-form label-width="100px" :model="form">
            <el-form-item :label="$t('operation.cutTimes')">
              <el-date-picker
                v-model="grantTime"
                type="datetimerange"
                format = "yyyy-MM-dd HH:mm"
                value-format = "yyyy-MM-dd HH:mm"
                :range-separator="$t('operation.to')"
                :start-placeholder="$t('tools.startDate')"
                :end-placeholder="$t('tools.endDate')" :default-time="['12:00:00']"
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('operation.cutGoods')">
              <goods-selector @selectChanged="goodsSelectedChanged" v-model="form.spu_id" :approve_status="2" :shelf_status="2"></goods-selector>
            </el-form-item>
            <el-form-item :label="$t('operation.cutImg')">
              <image-upload :drag="false" @uploadSuccess="imageUploadSuccess">
                <el-image v-if="form.img" :src="getImageUrl(form.img,200)" style="height: 100px; width:400px" fit="contain"></el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </image-upload>
            </el-form-item>
            <el-form-item :label="$t('operation.cutCount')">
              <el-input v-model.number="form.count"></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.cutWay')">
              <el-radio v-model="form.cut_way" :label="1">{{$t('operation.cutWay1')}}</el-radio>
              <el-radio v-model="form.cut_way" :label="2">{{$t('operation.cutWay2')}}</el-radio>
            </el-form-item>
            <el-form-item>
              <template v-if="form.cut_way === 1">
                <el-row>
                  <el-col :span="4">{{$t('operation.cutWayTip1')}}</el-col><el-col :span="8"><price-input v-model="form.price_cut"></price-input></el-col>
                </el-row>
              </template>
              <template v-if="form.cut_way === 2">
                <el-row>
                  <el-col :span="1">{{$t('operation.cutWayTip2A')}}</el-col>
                  <el-col :span="8"><price-input v-model="form.price_cut_range_bt"></price-input></el-col>
                  <el-col :span="1">-</el-col>
                  <el-col :span="8"><price-input v-model="form.price_cut_range_et"></price-input></el-col>
                  <el-col :span="6">{{$t('operation.cutWayTip2')}}</el-col>
                </el-row>
              </template>
            </el-form-item>
            <el-form-item :label="$t('operation.cutShare')">
              <el-input type="textarea" v-model="form.share_slogan"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="saveDataFunc()" :disabled="submitDisabled" :confirmButtonInfor="$t('tools.confirm')"></confirm-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div v-else>
      <el-alert
        :title="$t('operation.cutGoodsTip')"
        type="error" :closable="false"
        show-icon>
      </el-alert>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import goodsSelector from '@/components/goodsSelector'
  import { cutGoodsAdd, cutGoodsList, cutGoodsModify, cutGoodsDel } from '@/api/operation'
  export default {
    components: {
      goodsSelector
    },
    data() {
      const formData = this.setForm()
      const pz = 10
      return {
        batchPrice: 0,
        xgType: 1,
        timeValidSwitch: true,
        searchForm: {
          skip: '',
          limit: pz
        },
        secondArr: [{ label: 0.5, value: 1800 }, { label: 1, value: 3600 }, { label: 2, value: 7200 }, { label: 5, value: 18000 }],
        tableData: [],
        currentPage: 1,
        pageSize: pz,
        itemCount: 0,
        grantTime: [], // 秒杀时段
        form: formData,
        goodsInventoryTable: [],
        currentSetSkus: [],
        formEditDialog: false,
        submitDisabled: false,
        seckillTimes: [],
        promptInfor: this.$t('operation.cutDelTip')
      }
    },
    computed: {
      ...mapGetters([
        'userInfo', 'shopInfo'
      ])
    },
    watch: {
      grantTime(val) {
        if (val.length > 0) {
          this.form.bt = val[0]
          this.form.et = val[1]
        }
      },
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getDataListFun()
      }
    },
    methods: {
      setForm(data) {
        if (data) {
          this.grantTime = [data.bt, data.et]
          return {
            id: data.id,
            spu_id: data.spu_id,
            img: data.img,
            bt: data.bt,
            et: data.et,
            cut_way: data.cut_way,
            count: data.count,
            price_cut: data.price_cut,
            price_cut_range_bt: data.price_cut_range_bt,
            price_cut_range_et: data.price_cut_range_et,
            share_slogan: data.share_slogan
          }
        } else {
          this.grantTime = []
          this.validTime = []
          this.currentSetSkus = []
          this.xgType = 1
          return {
            id: '',
            spu_id: '',
            img: '',
            bt: '',
            et: '',
            cut_way: 1,
            count: 0,
            price_cut: 0,
            price_cut_range_bt: 0,
            price_cut_range_et: 0,
            share_slogan: ''
          }
        }
      },
      addData() {
        this.form = this.setForm()
        this.formEditDialog = true
      },
      showDataEditor(data) {
        this.form = this.setForm(data)
        this.formEditDialog = true
      },
      goodsSelectedChanged(val) {
        if (this.form.img === '' && val.images.length > 0) {
          this.form.img = val.images[0]
        }
      },
      imageUploadSuccess(res) {
        this.form.img = res.md5
        console.log(res)
      },
      saveDataFunc() {
        this.submitDisabled = true
        if (this.form.id !== '') {
          cutGoodsModify(this.form.id, this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        } else {
          cutGoodsAdd(this.form).then(res => {
            this.getDataListFun()
            this.formEditDialog = false
            this.submitDisabled = false
          }).catch(() => {
            this.submitDisabled = false
          })
        }
      },
      deleteDataFunc(row) {
        cutGoodsDel(row.id).then(res => {
          this.getDataListFun()
        })
      },
      getDataListFun() {
        cutGoodsList(this.searchForm).then(res => {
          this.tableData = res.items
          this.itemCount = res.total
        })
      },
      search() {
        this.getDataListFun()
      }
    },
    mounted() {
      // this.searchForm.doing_time = this.$moment().format('YYYY-MM-DD HH')
      if (!this.shopInfo.goods_cut) {
        return
      }
      this.getDataListFun()
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
  .pi{
    position: relative;
    .ei{
      float: left;
    }
    .info {
      vertical-align: middle;
      padding-left: 60px;
      text-align: left;
      span{
        display: inline-block;
        margin-right: 5px;
        color: #8c939d;
        font: #333333 !important;
      }
    }
  }
</style>
