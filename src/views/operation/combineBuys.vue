<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row
          style="padding: 8px 0; text-align: right"
          type="flex"
          justify="end"
          align="middle"
        >
          <el-col :span="2">
            <el-button
              type="success"
              size="small"
              icon="el-icon-plus"
              v-if="permissionCheck('opt')"
              @click="addData(2)"
            >
              {{ $t("tools.add") }}
            </el-button>
          </el-col>
        </el-row>

        <el-table :data="ListData" style="width: 100%" border stripe>
          <el-table-column prop="title" width="140" label="Banner">
            <template slot-scope="scope">
              <img :src="getImageUrl(scope.row.banner, 100)" />
            </template>
          </el-table-column>

          <el-table-column
            prop="title"
            :label="$t('sys.title')"
            show-overflow-tooltip
          />

          <el-table-column
            prop="title"
            :label="$t('operation.goods')"
            show-overflow-tooltip
          >
            <template slot="header" slot-scope="scope">
              <el-row
                style="width: 100%"
                type="flex"
                justify="space-between"
                align="middle"
              >
                <el-col :span="19">
                  {{ $t("operation.goods") }}
                </el-col>

                <el-col :span="4">
                  {{ $t("sys.zhekou") }}
                </el-col>
              </el-row>
            </template>

            <template slot-scope="scope">
              <div class="goods">
                <el-row
                  v-for="(item, k) in scope.row.group_spus"
                  :key="k"
                  class="odd"
                  style="width: 100%"
                >
                  <el-row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    v-for="(val, k) in item.item_combine_spus"
                    :key="k"
                    class="odd"
                    style="width: 100%"
                  >
                    <el-col :span="19">
                      <span :title="val.name">
                        {{ val.name }}
                      </span>
                    </el-col>

                    <el-col :span="4">
                      <span :title="item.off">
                        {{ 100 - item.off }}
                        %
                      </span>
                    </el-col>
                  </el-row>
                </el-row>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('tools.opt')"
            width="200"
            v-if="permissionCheck('opt')"
          >
            <template slot-scope="scope">
              <el-button @click="modifybtn(scope.row, 1)" size="small">
                {{ $t("tools.edit") }}
              </el-button>

              <delete-button @delData="deleteDataFunc(scope.row)" />
            </template>
          </el-table-column>
        </el-table>

        <div style="text-align: right;margin-top: 10px">
          <el-pagination
            :current-page.sync="CobuycurrentPage"
            :page-size="CobuypageSize"
            layout="total, prev, pager, next, jumper"
            :total="CobuyitemCount"
          />
        </div>

        <el-dialog
          :title="$t('operation.Addcombopurchase')"
          :visible.sync="dialogVisible"
          width="1000px"
        >
          <el-form
            ref="form"
            :model="Dataform"
            label-width="200px"
            label-position="left"
          >
            <el-form-item :label="$t('sys.title')">
              <el-input v-model="Dataform.title" style="width: 200px" />
            </el-form-item>

            <el-form-item label="Banner">
              <single-file-upload v-model="Dataform.banner" />
            </el-form-item>

            <el-form-item :label="$t('goods.cobuysec')">
              <el-date-picker
                v-model="timeArr"
                type="datetimerange"
                range-separator="-"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :start-placeholder="$t('lang.startDate')"
                :end-placeholder="$t('lang.endDate')"
                style="width: 100%"
              />
            </el-form-item>

            <!-- <el-form-item :label="$t('operation.chooseGoods')">
              <el-button
                class="el-icon-edit-outline"
                @click="selectgoods"
                size="small"
                />
            </el-form-item> -->
          </el-form>

          <el-divider content-position="left">
            <!-- {{ $t("operation.chooseGoods") }} -->

            <el-button size="small" @click="selectgoods(1)">
              <!-- {{ $t("tools.add") }} -->
              {{ $t("operation.chooseGoods") }}
            </el-button>
          </el-divider>

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

            <!-- <el-tabs
              type="card"
              v-model="types"
              addable
              @tab-add="selectgoods(1)"
            > -->
            <el-tabs type="card" v-model="types">
              <el-tab-pane
                :key="index"
                v-for="(item, index) in group_spus"
                :label="String(item.off + '%')"
                :name="String(item.off)"
              />

              <el-table :data="goodsinfo" style="width: 100%" height="400px">
                <el-table-column prop="off">
                  <template slot="header" slot-scope="scope">
                    <el-row style="width: 100%">
                      <el-col :span="4" style="text-align: center">
                        {{ $t("lang.picture") }}
                      </el-col>

                      <el-col :span="16" style="text-align: left">
                        {{ $t("goods.name") }}
                      </el-col>

                      <el-col :span="4" style="text-align: center">
                        {{ $t("tools.opt") }}
                      </el-col>
                    </el-row>
                  </template>

                  <template slot-scope="scope">
                    <div class="goods">
                      <el-row
                        v-for="(item, k) in scope.row.goods"
                        :key="k"
                        class="odd2"
                        style="width: 100%"
                      >
                        <el-col :span="4" style="text-align: center">
                          <el-image
                            class="image"
                            style="width: 60px; height: 60px"
                            :src="getImageUrl(item.images[0], 100, 100)"
                            fit="cover"
                          />
                          <!-- <span>{{item}}</span> -->
                        </el-col>

                        <el-col :span="16">{{ item.name }}</el-col>

                        <el-col :span="4" style="text-align: center">
                          <el-button
                            type="danger"
                            size="small"
                            @click="delid(scope.row, k, scope.row.off)"
                          >
                            {{ $t("tools.delete") }}
                          </el-button>
                        </el-col>
                      </el-row>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tabs>

            <el-button
              v-if="goodsinfo.length > 0"
              class="newgoods"
              size="mini"
              @click="selectgoods(2)"
            >
              {{ $t("tools.add") }}
            </el-button>
          </div>

          <span slot="footer" class="dialog-footer">
            
            <el-button size="small" type="success" @click="AddcombineBuys">
              {{ $t("tools.confirm") }}
            </el-button>
            <el-button size="small" @click="dialogVisible = false">
              {{ $t("tools.cancel") }}
            </el-button>

          </span>
        </el-dialog>

        <el-dialog
          :title="$t('goods.goodslist')"
          :visible.sync="selectgoodsdialog"
          width="1000px"
        >
          <el-form ref="form" :model="Dataform" label-width="80px">
            <el-form-item :label="$t('sys.zhekou')">
              <el-input
                v-model="goodsitem.off"
                style="width: 200px"
                :disabled="disabl"
              />
            </el-form-item>
          </el-form>

          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            border
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
            height="calc(500px)"
          >
            <el-table-column type="selection" width="55" />

            <el-table-column prop="name" :label="$t('warehouse.goodsname')" />

            <el-table-column prop="name" :label="$t('lang.picture')">
              <template slot-scope="scope">
                <el-image
                  class="image"
                  style="width: 60px; height: 60px"
                  :src="getImageUrl(scope.row.images[0], 100, 100)"
                  fit="cover"
                />
              </template>
            </el-table-column>

            <el-table-column :label="$t('goods.price')" width="120">
              <template slot-scope="scope">
                <template v-if="scope.row.type === 3">
                  <el-tag size="mini" v-if="scope.row.type === 3">
                    {{ $t("goods.exp") }}
                  </el-tag>

                  <span v-if="scope.row.min_price !== scope.row.max_price">
                    {{ scope.row.min_price }}
                    -
                    {{ scope.row.max_price }}
                  </span>

                  <span v-else>{{ scope.row.min_price }}</span>
                </template>

                <template v-else>
                  <span v-if="scope.row.min_price !== scope.row.max_price">
                    {{ scope.row.min_price | price }}
                    -
                    {{ scope.row.max_price | price }}
                  </span>

                  <span v-else>{{ scope.row.min_price | price }}</span>
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
            />
          </div>

          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="selectgoodsdialog = false">
              {{ $t("tools.cancel") }}
            </el-button>

            <el-button size="small" type="primary" @click="confirmBtn">
              {{ $t("tools.confirm") }}
            </el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  combineBuys,
  combineBuyslist,
  modifycombineBuys,
  DelcombineBuys
} from "@/api/operation";
import { spusList } from "@/api/goods";
import { InputNumber } from "element-ui";

export default {
  components: {},
  data() {
    return {
      disabl: false,
      addtype: "",
      types: "",
      editableTabs: [],
      timeArr: [],
      type: "",
      buysid: "",
      tableData: [],
      ListData: [],
      dialogVisible: false,
      selectgoodsdialog: false,
      Dataform: {
        title: "",
        banner: "",
        group_spus: "",
        bt: "",
        et: ""
      },
      group_spus: [],
      goodsitem: {
        spu_ids: [],
        off: 0
      },
      searchForm: {
        name: "",
        skip: 0,
        limit: 10,
        approve_status: 2, // 审批状态 0所有 1待审批 2审批成功 3拒绝
        merchant_id: "", // 商户id，不填所有，自营填000000000000000000000001
        // type_id: '',
        shelf_status: 2, // 上架状态 所有0 未上架1 上架2
        deleted: false
      },
      currentPage: 1,
      pageSize: 10,
      itemCount: 0,
      CobuycurrentPage: 1,
      CobuypageSize: 10,
      CobuyitemCount: 0,
      combineBuyspage: {
        skip: 0,
        limit: 10
      },
      orderarr: [],
      ids: [],
      objdata: {},
      goodsinfo: [],
      modifyarr: []
    };
  },
  computed: {},
  watch: {
    CobuycurrentPage(val) {
      this.combineBuyspage.skip = (val - 1) * this.CobuypageSize;
      this.combineBuyspage.limit = this.CobuypageSize;
      this.GetcombineBuyslist();
    },
    currentPage(val) {
      this.searchForm.skip = (val - 1) * this.pageSize;
      this.searchForm.limit = this.pageSize;
      this.getgoodslist();
    },
    types(val) {
      this.group_spus.forEach(item => {
        if (item.off == val) {
          if (item.off == val) {
            if (this.goodsinfo.length == 0) {
              this.goodsinfo.push(item);
            } else {
              this.goodsinfo.splice(0, 1, item);
            }
          }
        }
      });
    }
  },
  mounted() {
    this.GetcombineBuyslist();
  },
  methods: {
    // 添加组合购商品
    selectgoods(num) {
      if (num == 1) {
        this.disabl = false;
      } else if (num == 2) {
        this.disabl = true;
        this.goodsitem.off = this.types;
      }
      if (num == 2 && this.types == 0) {
        this.$message(this.$t("operation.pleasemsg"));
        return;
      }
      this.addtype = num;
      this.goodsitem.spu_ids = [];
      this.goodsitem.off = "";
      this.selectgoodsdialog = true;
      this.getgoodslist();
    },
    // 获取商品列表
    getgoodslist() {
      spusList(this.searchForm).then(res => {
        this.tableData = res.items;
        this.itemCount = res.total;
      });
    },
    // 商品勾选
    handleSelectionChange(val) {
      let obj = {};
      this.ids = [];
      this.ids = val;
      this.goodsitem.spu_ids = [];
      obj.spu_ids = [];
      this.ids.forEach(item => {
        obj.spu_ids.push(item.id);
      });
      obj.goods = val;
      this.objdata = obj;
    },
    // 数组去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
    // 商品列表确定按钮
    confirmBtn() {
      if (this.addtype == 1) {
        if (!this.goodsitem.off) {
          this.$message("Please enter discount amount");
          return;
        }

        let atype = this.group_spus.some(item => {
          return item.off == this.goodsitem.off;
        });
        if (!atype) {
          this.objdata["off"] = this.goodsitem.off;
          this.types = this.goodsitem.off;
          this.group_spus.push(this.objdata);
        } else {
          this.$message(this.$t("operation.Repeatdiscount"));
          return;
        }
      } else if (this.addtype == 2) {
        let num = 0;
        this.group_spus.forEach(item => {
          if (this.types == item.off) {
            num = item.off;
            this.objdata.goods.forEach(val => {
              item.goods.push(val);
              this.types = "0";
              setTimeout(() => {
                this.types = String(num);
              }, 10);
            });
            this.objdata.spu_ids.forEach(val => {
              item.spu_ids.push(val);
            });
          }
        });
      }
      this.selectgoodsdialog = false;
    },
    // 确定 添加/编辑 组合购
    AddcombineBuys() {
      this.Dataform.bt = this.timeArr[0];
      this.Dataform.et = this.timeArr[1];
      if (this.group_spus.length != 0) {
        let arr2 = [];
        this.group_spus.forEach(item => {
          item.spu_ids = this.unique(item.spu_ids);
          delete item.goods;
          item.off = Number(item.off);
          this.Dataform.group_spus = [];
          arr2.push(item);
        });
        this.Dataform.group_spus = arr2;
      }
      if (this.Dataform.group_spus.length != 0) {
        let item = JSON.stringify(this.Dataform.group_spus);
        this.Dataform.group_spus = [];
        this.Dataform.group_spus = item;
      }
      if (this.type == 2) {
        combineBuys(this.Dataform).then(res => {
          this.dialogVisible = false;
          this.GetcombineBuyslist();
        });
      } else if (this.type == 1) {
        modifycombineBuys(this.Dataform, this.buysid).then(res => {
          this.dialogVisible = false;
          this.GetcombineBuyslist();
        });
      }
    },
    // 添加按钮
    addData(num) {
      this.goodsinfo = [];
      this.timeArr = [];
      this.type = num;
      this.Dataform.title = "";
      this.Dataform.banner = "";
      this.Dataform.group_spus = [];
      this.group_spus = [];
      this.dialogVisible = true;
    },
    // 获取组合购列表
    GetcombineBuyslist() {
      combineBuyslist(this.combineBuyspage).then(res => {
        this.ListData = res.items;
        this.CobuyitemCount = res.total;
      });
    },
    // 编辑组合购
    modifybtn(data, num) {
      this.timeArr = [];
      this.Dataform.bt = data.bt;
      this.Dataform.et = data.et;
      this.timeArr.push(data.bt, data.et);
      this.group_spus = [];
      this.buysid = data.id;
      this.type = num;
      this.dialogVisible = true;
      this.Dataform.title = data.title;
      this.Dataform.banner = data.banner;
      let numarr = [];
      data.group_spus.forEach(item => {
        let obj = {};
        obj.off = item.off;
        numarr.push(obj.off);
        let objd = {};
        objd.off = item.off;
        objd.goods = item.item_combine_spus;
        this.group_spus.push(obj);
        this.modifyarr.push(objd);
      });
      let num2 = numarr[0];
      this.group_spus.forEach(item => {
        this.modifyarr.forEach(val => {
          if (item.off == val.off) {
            item.goods = [];
            item.goods = val.goods;
            item.spu_ids = [];
            val.goods.forEach(val => {
              item.spu_ids.push(val.id);
            });
          }
        });
      });
      this.types = "0";
      setTimeout(() => {
        this.types = String(num2);
      }, 50);
    },
    // 删除组合购
    deleteDataFunc(data) {
      DelcombineBuys(data.id).then(res => {
        this.GetcombineBuyslist();
      });
    },
    // 删除组合购商品
    delid(data, index, off) {
      if (this.group_spus.length != 0) {
        this.group_spus.forEach(item => {
          if (item.off == off) {
            item.spu_ids.splice(index, 1);
            item.goods.splice(index, 1);
          }
          if (item.goods.length == 0) {
            this.group_spus.forEach(val => {
              if (val.off == off) {
                val = null;
              }
            });
          }
        });
        this.types = "0";
        setTimeout(() => {
          this.types = String(off);
        }, 10);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.funcList {
  width: 100%;
  text-align: right;
}

.goodsInfo {
  color: rgb(75, 133, 219);
  cursor: pointer;
}

.odd2 {
  display: flex;
  align-items: center;
}

.newgoods {
  cursor: pointer;
  width: 100%;
  padding: 10px;
  // text-align: center;
  // line-height: 40px;
  // background-color: #f3f3f3;
  // &:hover {
  //   color: rgb(58, 124, 211);
  // }
}
</style>
