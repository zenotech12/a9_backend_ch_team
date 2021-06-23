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
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="title" label="Banner">
            <template slot-scope="scope">
               <img class="image imagecss" :src="getImageUrl(scope.row.banner, 100)">
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品">
              <template slot="header" slot-scope="scope">
                  <el-row style="width: 100%">
                    <el-col :span="12">商品</el-col>
                    <el-col :span="12">折扣</el-col>
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
              <el-button type="text" @click="modifybtn(scope.row,1)" size="small">编辑</el-button>
              <span class="xiexian">/</span>
              <delete-button @delData="deleteDataFunc(scope.row)"></delete-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="添加组合购" :visible.sync="dialogVisible" width="40%">
          <el-form ref="form" :model="Dataform" label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="Dataform.title" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="Banner">
              <single-file-upload v-model="Dataform.banner"></single-file-upload>
            </el-form-item>
            <el-form-item label="选择商品">
              <el-button class="el-icon-edit-outline" @click="selectgoods" size="small"></el-button>
            </el-form-item>
          </el-form>
          <div>
            <!-- <div style="margin-left: 10px;" v-for="(item,k) in Dataform.group_spus" :key="k">
              <div>{{item}}</div>
            </div> -->
            <el-table :data="Dataform.group_spus" border stripe style="width: 100%">
              <el-table-column prop="off" label="折扣">
                <template slot-scope="scope">
                  {{100 - scope.row.off}}%
                </template>
              </el-table-column>
              <el-table-column prop="off" label="商品id">
                <template slot-scope="scope">
                  <div v-for="(item,k) in scope.row.spu_ids" :key="k">{{item}}</div>
                </template>
              </el-table-column>
               <el-table-column prop="off" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="delid(scope.row,scope.$index)" size="small">删除</el-button>    
                </template>
              </el-table-column>
            </el-table>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="AddcombineBuys">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="商品列表" :visible.sync="selectgoodsdialog" width="70%">
          <el-form ref="form" :model="Dataform" label-width="80px">
            <el-form-item  label="组合折扣">
              <el-input v-model="goodsiten.off" style="width: 200px"></el-input>
            </el-form-item>
          </el-form>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" height="calc(500px)">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="商品名称">
            </el-table-column>
            <el-table-column prop="name" label="商品图片">
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
            <el-button size="small" @click="selectgoodsdialog = false">取 消</el-button>
            <el-button size="small" type="primary" @click="confirmBtn">确 定</el-button>
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
      type: '',
      buysid:'',
      tableData:[],
      ListData:[],
      dialogVisible: false,
      selectgoodsdialog: false,
      Dataform: {
        title: "",
        banner: "",
        group_spus: [],
      },
      goodsiten: {
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
      obj: {},
      orderarr: []
    };
  },
  computed: {},
  watch: {
    currentPage(val) {
      this.searchForm.skip = (val - 1) * this.pageSize
      this.searchForm.limit = this.pageSize
      this.getgoodslist()
    },
    obj(val){
       
    }
  },
  mounted() {
    this.GetcombineBuyslist()
  },
  methods: {
    selectgoods() {
      this.goodsiten.spu_ids = []
      this.goodsiten.off = ''
      this.selectgoodsdialog = true;
      this.getgoodslist();
    },
    getgoodslist() {
      spusList(this.searchForm).then((res) => {
        this.tableData = res.items
        this.itemCount = res.total
      });
    },
    handleSelectionChange(val) {
      this.goodsiten.spu_ids = []
      val.forEach(item => {
        this.goodsiten.spu_ids.push(item.id)
      });
    },
    confirmBtn(){
      if(this.Dataform.group_spus.length == 0){
        this.Dataform.group_spus.push(this.goodsiten)
      }else{
        this.Dataform.group_spus.splice(-1,0,this.goodsiten)
      }
      if(this.Dataform.group_spus.length != 0){
        this.Dataform.group_spus.forEach(item => {
          item.off = Number(item.off)
        });
      }
      console.log(this.Dataform.group_spus);
      this.selectgoodsdialog = false;
    },
    AddcombineBuys(){
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
    addData(num){
      this.type = num
      this.Dataform.title = ''
      this.Dataform.banner = ''
      this.Dataform.group_spus = []
      this.dialogVisible = true
    },
    GetcombineBuyslist(){
      combineBuyslist(this.combineBuyspage).then(res=>{
        this.ListData = res.items
      })
    },
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
       this.orderarr[k].spu_ids.push(item.id)
      });
      console.log(this.orderarr);
      this.Dataform.group_spus = this.orderarr
    },
    deleteDataFunc(data){
      DelcombineBuys(data.id).then(res=>{
         this.GetcombineBuyslist()
      })
    },
    delid(data,index){
      this.Dataform.group_spus.splice(index,1)
    }
  },
};
</script>

<style lang="scss" scoped>
.funcList {
  width: 100%;
  text-align: right;
}
</style>
