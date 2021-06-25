<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="10" class="funcList">
            <div class="boxFuncBtn" v-if="permissionCheck('opt')" @click="addData(2)">
              <img src="../../assets/images/icon/icon_add.png" alt class="icon_add" />
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table :data="ListData" style="width: 100%" border stripe>
          <el-table-column prop="title" :label="$t('sys.title')"></el-table-column>
          <el-table-column prop="title" label="Banner">
            <template slot-scope="scope">
               <img class="image imagecss" :src="getImageUrl(scope.row.banner, 100)">
            </template>
          </el-table-column>
          <el-table-column prop="title" :label="$t('operation.goods')">
              <template slot="header" slot-scope="scope">
                  <el-row style="width: 100%">
                    <el-col :span="12">{{$t('operation.goods')}}</el-col>
                    <el-col :span="12">{{$t('sys.zhekou')}}</el-col>
                  </el-row>
                </template>
                <template slot-scope="scope">
                  <div class="goods">
                    <el-row v-for="(item, k) in scope.row.group_spus" :key="k" class="odd" style="width: 100%">
                       <el-row v-for="(val, k) in item.item_combine_spus" :key="k" class="odd" style="width: 100%">
                        <el-col :span="12"><span :title="val.name">{{val.name}}</span></el-col>
                        <el-col :span="12"><span :title="item.off">{{100 - item.off}}%</span></el-col>
                      </el-row>
                    </el-row>
                  </div>
                </template>
          </el-table-column>
          <el-table-column :label="$t('tools.opt')" v-if="permissionCheck('opt')">
            <template slot-scope="scope">
              <el-button type="text" @click="modifybtn(scope.row,1)" size="small">{{$t('tools.edit')}}</el-button>
              <span class="xiexian">/</span>
              <delete-button @delData="deleteDataFunc(scope.row)"></delete-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :title="$t('operation.Addcombopurchase')" :visible.sync="dialogVisible" width="50%">
          <el-form ref="form" :model="Dataform" label-width="80px">
            <el-form-item :label="$t('sys.title')">
              <el-input v-model="Dataform.title" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="Banner">
              <single-file-upload v-model="Dataform.banner"></single-file-upload>
            </el-form-item>
             <el-form-item :label="$t('goods.cobuysec')">
                <div class="block">
                <el-date-picker
                  v-model="timeArr"
                  type="datetimerange"
                  range-separator="-"
                  format = 'yyyy-MM-dd HH:mm'
                  value-format="yyyy-MM-dd HH:mm"
                  :start-placeholder="$t('lang.startDate')"
                  :end-placeholder="$t('lang.endDate')">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item :label="$t('operation.chooseGoods')">
              <!-- <el-button class="el-icon-edit-outline" @click="selectgoods" size="small"></el-button> -->
            </el-form-item>
          </el-form>
          <div>
            <!-- <el-table :data="this.goodsDataarr" border stripe style="width: 100%">
              <el-table-column prop="off" :label="$t('sys.zhekou')">
                <template slot-scope="scope">
                  {{100 - scope.row.off}}%
                </template>
              </el-table-column>
              <el-table-column prop="off" label="商品详情">
                <template slot-scope="scope">
                  <span class="goodsInfo" @click="Infogoods(scope.row)">点击查看</span>
                </template>
              </el-table-column>
               <el-table-column prop="off" :label="$t('tools.opt')">
                <template slot-scope="scope">
                  <el-button type="text" @click="delid(scope.row,scope.$index)" size="small">{{$t('tools.delete')}}</el-button>    
                </template>
              </el-table-column>
            </el-table> -->

            <el-tabs v-model="editableTabsValue" type="card" editable @edit="selectgoods">
              <el-tab-pane
                v-model="types"
                :key="index"
                v-for="(item, index) in group_spus"
                :label="item.off"
                :name="item.off"
              >
              </el-tab-pane>
              <el-table :data="group_spus" style="width: 100%">
                <el-table-column prop="off">
                  <template slot="header" slot-scope="scope">
                    <el-row style="width: 100%">
                      <el-col :span="8" style="text-align: center">名称</el-col>
                      <el-col :span="8" style="text-align: center">图片</el-col>
                      <el-col :span="8" style="text-align: center">操作</el-col>
                    </el-row>
                  </template>
                  <template slot-scope="scope">
                    <div class="goods">
                      <el-row v-for="(item, k) in scope.row.goods" :key="k" class="odd2" style="width: 100%">
                        <el-col :span="8">{{item.name}}</el-col>
                        <el-col :span="8" style="text-align: center">
                          <el-image class="image" style="width: 60px; height: 60px"  :src="getImageUrl(item.images[0], 100,100)"  fit="cover"></el-image>
                          <!-- <span>{{item}}</span> -->
                        </el-col>
                        <el-col :span="8" style="text-align: center">
                          <span class="goodsInfo" @click="delid(scope.row,k)">删除</span>
                        </el-col>
                      </el-row>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tabs>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">{{$t('tools.cancel')}}</el-button>
            <el-button size="small" type="primary" @click="AddcombineBuys">{{$t('tools.confirm')}}</el-button>
          </span>
        </el-dialog>
        <el-dialog :title="$t('goods.goodslist')" :visible.sync="selectgoodsdialog" width="70%">
          <el-form ref="form" :model="Dataform" label-width="80px">
            <el-form-item  :label="$t('sys.zhekou')">
              <el-input v-model="goodsitem.off" style="width: 200px"></el-input>
            </el-form-item>
          </el-form>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border stripe style="width: 100%" @selection-change="handleSelectionChange" height="calc(500px)">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" :label="$t('warehouse.goodsname')">
            </el-table-column>
            <el-table-column prop="name" :label="$t('lang.picture')">
              <template slot-scope="scope">
                <el-image class="image" style="width: 60px; height: 60px"  :src="getImageUrl(scope.row.images[0], 100,100)"  fit="cover"></el-image>
              </template>
            </el-table-column>
            <el-table-column :label="$t('goods.price')" width="120">
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
          <div style="text-align: right;margin-top: 10px">
            <el-pagination
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="itemCount"
            ></el-pagination>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="selectgoodsdialog = false">{{$t('tools.cancel')}}</el-button>
            <el-button size="small" type="primary" @click="confirmBtn">{{$t('tools.confirm')}}</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { combineBuys, combineBuyslist, modifycombineBuys, DelcombineBuys } from "@/api/operation";
import { spusList } from "@/api/goods";
export default {
  components: {},
  data() {
    return {
      types: '',
      editableTabs: [],
      editableTabsValue: '0',
      timeArr: [],
      type: '',
      buysid:'',
      tableData:[],
      ListData:[],
      dialogVisible: false,
      selectgoodsdialog: false,
      Dataform: {
        title: "",
        banner: "",
        group_spus: '',
        bt: '',
        et: ''
      },
      group_spus: [],
      goodsitem: {
        spu_ids: [],
        off: 0,
      },
      searchForm: {
        name: "",
        skip: 0,
        limit: 10,
        approve_status: 2, // 审批状态 0所有 1待审批 2审批成功 3拒绝
        merchant_id: "", // 商户id，不填所有，自营填000000000000000000000001
        // type_id: '',
        shelf_status: 2, // 上架状态 所有0 未上架1 上架2
        deleted: false,
      },
      currentPage: 1,
      pageSize: 10,
      itemCount: 0,
      combineBuyspage:{
        skip: 0,
        limit: 10
      },
      orderarr: [],
      ids: [],
      objdata: {},
      changeoff: ''
      
    };
  },
  computed: {},
  watch: {
    currentPage(val) {
      this.searchForm.skip = (val - 1) * this.pageSize
      this.searchForm.limit = this.pageSize
      this.getgoodslist()
    },
    types(val){
      console.log(val);
    }
  },
  mounted() {
    this.GetcombineBuyslist()
  },
  methods: {
    selectgoods() {
      this.goodsitem.spu_ids = []
      this.goodsitem.off = ''
      this.selectgoodsdialog = true;
      this.getgoodslist();
    },
    // 获取商品列表
    getgoodslist() {
      spusList(this.searchForm).then((res) => {
        this.tableData = res.items
        this.itemCount = res.total
      });
    },
    handleSelectionChange(val) {
      let obj = {}
      this.ids = []
      this.ids = val
      this.goodsitem.spu_ids = []
      obj.spu_ids = []
      this.ids.forEach(item => {
        obj.spu_ids.push(item.id)
      });
      obj.goods = val
      this.objdata = obj
    },
    // 商品列表确定按钮
    confirmBtn(){
      this.objdata['off'] = this.goodsitem.off
      this.group_spus.push(this.objdata)
      console.log(this.group_spus);
      this.selectgoodsdialog = false;
    },
    // 确定 添加/编辑 组合购
    AddcombineBuys(){
      if(this.group_spus.length !=0){
        this.group_spus.forEach(item => {
          delete item.goods
          item.off = Number(item.off)
          this.Dataform.group_spus.push(item)
        });
      }
      if(this.Dataform.group_spus.length != 0){
        let item =  JSON.stringify(this.Dataform.group_spus)
        this.Dataform.group_spus = item
      }
      if(this.type == 2){
        combineBuys(this.Dataform).then(res=>{
          this.dialogVisible = false
          this.GetcombineBuyslist()
        })
      }else if(this.type == 1){
        modifycombineBuys(this.Dataform,this.buysid).then(res=>{
          this.dialogVisible = false
          this.GetcombineBuyslist()
        })
      }
    },
    // 添加按钮
    addData(num){
      this.timeArr = []
      this.type = num
      this.Dataform.title = ''
      this.Dataform.banner = ''
      this.Dataform.group_spus = []
      this.group_spus = []
      this.dialogVisible = true
    },
    // 获取组合购列表
    GetcombineBuyslist(){
      combineBuyslist(this.combineBuyspage).then(res=>{
        this.ListData = res.items
      })
    },
    // 编辑组合购
    modifybtn(data,num){
      let arr = []
      this.orderarr = []
      this.buysid = data.id
      this.type = num
      this.dialogVisible = true
      this.Dataform.title = data.title
      this.Dataform.banner = data.banner
      data.group_spus.forEach((item,k) => {
        this.orderarr.push({
          off :item.off,
          spu_ids:[]
        })
        item.item_combine_spus.forEach(val => {
          arr.push(val)
        });
      });
      arr.forEach((item,k) => {
        console.log(item);
        // this.orderarr[k].spu_ids.push(item.id)
        // console.log(item.id,'6666',this.orderarr[k]);
      });
      this.Dataform.group_spus = this.orderarr
    },
    // 删除组合购
    deleteDataFunc(data){
      DelcombineBuys(data.id).then(res=>{
         this.GetcombineBuyslist()
      })
    },
    // 删除组合购商品
    delid(data,index){
      console.log(index);
      if(this.group_spus.length !=0 ){
        this.group_spus.forEach(item => {
          item.spu_ids.splice(index,1)
          item.goods.splice(index,1)
        });
      }
    },
    Infogoods(data){
      console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.funcList {
  width: 100%;
  text-align: right;
}
.goodsInfo{
  color: rgb(75, 133, 219);
  cursor: pointer;
}
.odd2{
  display: flex;
  align-items: center;
}
</style>
