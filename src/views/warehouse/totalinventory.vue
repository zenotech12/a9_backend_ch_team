<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <el-row>
        <el-col :span="4" class="funcTree" style="margin-left: 0">
          <el-row>
            <el-col :span="24" class="funcBoxTitle">
              <div class="small_title">{{$t('goods.type')}}</div>
            </el-col>
          </el-row>
          <div class="custom-tree-container">
            <div class="block">
              <el-tree style="height: calc(100vh - 185px); overflow-y: auto;"
                       :data="goodsTypeData"
                       node-key="id"
                       :show-checkbox="false"
                       :props="defaultProps"
                       @node-click="typeChangeFunc"
                       @node-expand="nodeOpen"
                       @node-collapse="nodeClose"
                       :default-expanded-keys="defaultExpanded"
                       :expand-on-click-node="false"
                       :render-content="renderContent"
              >
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="20" class="funcBox">
          <div class="rightbox">
            <div>
              <div>
                <el-row>
                  <el-col :span="24" style="padding-left: 20px">
                    <el-form :inline="true" :model="totalgoodshForm">
                      <el-form-item>
                        <el-input v-model="totalgoodshForm.key" clearable></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-switch @change="Searchlist"
                          v-model="totalgoodshForm.zero_inventory"
                          active-text="没库存"
                          inactive-text="有库存">
                        </el-switch>
                      </el-form-item>
                      <el-form-item class="searchBtn">
                        <el-button type="primary" @click="Searchlist" size="small" icon="el-icon-search"></el-button>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
                <el-table :data="Totaldata" border stripe height="calc(100vh - 229px)" style="width: 100%">
                  <el-table-column label="#" width="60px" fixed = "left">
                    <template slot-scope="scope">
                      {{scope.$index + totalgoodshForm.skip + 1}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" :label="$t('warehouse.name2')"></el-table-column>
                  <el-table-column prop="date" :label="$t('warehouse.SpecificationsMsg')">
                    <template slot-scope="scope">{{textFilter(scope.row.specification)}}</template>
                  </el-table-column>
                  <el-table-column prop="barcode" :label="$t('warehouse.barCode')"></el-table-column>
                  <el-table-column prop="unit_price" :label="$t('warehouse.price')"></el-table-column>
                  <el-table-column prop="count" :label="$t('warehouse.num')">
                    <template slot-scope="scope">
                      <span class="numcss" @click="numinfo(scope.row)">{{scope.row.count}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="origin" :label="$t('warehouse.PlaceofOrigin')"></el-table-column>
                </el-table>
              </div>
            </div>
            <div style="text-align: right;margin-top: 10px">
              <el-pagination
                :current-page.sync="currentPage_to"
                :page-size="pageSize_to"
                layout="total, prev, pager, next, jumper"
                :total="itemCount_to"
              ></el-pagination>
            </div>
            <total-data :restFrom="restFrom" :restFromid="restFromid" :istype="dialogVisible" @dalogtype="dalogtype"></total-data>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { warehousegroup } from "@/api/warehouse";
import { spuTypesList } from '@/api/goods'

export default {
  data() {
    return {
      totalgoodshForm: {
        key: "",
        warehouse_id: "",
        sku_uid: "",
        // specification: "",
        // type_id: '',
        skip: 0,
        limit: 15,
        zero_inventory: false
      },
      numinfoForm: {
        key: "",
        warehouse_id: "",
        position: "",
        sku_uid: "",
        specification: "",
        skip: 0,
        limit: 10,
      },
      Totaldata: [],
      currentPage_to: 1,
      pageSize_to: 15,
      itemCount_to: 0,
      currentPage_info: 1,
      pageSize_info: 10,
      itemCount_info: 0,
      dialogVisible: false,
      numinfoData: [],
      restFrom: "",
      restFromid: "",
      goodsTypeData: [],
      defaultProps: {
        children: 'items',
        label: 'name'
      },
      defaultExpanded: [],
      maxNumber: 0,
      funcTreeWidth: 0,
      funcBoxWidth: 0,
    };
  },
  watch: {
    currentPage_to(val) {
      this.totalgoodshForm.skip = (val - 1) * this.pageSize_to;
      this.totalgoodshForm.limit = this.pageSize_to;
      this.gettotaldata();
    }
  },
  methods: {
    getTypeList() {
      spuTypesList({ type: 2 }).then(response => {
        if (response.meta === 0) {
          this.typeData = []
          this.goodsTypeData = []
          if (response.items !== null) {
            this.typeData = response.items
            this.goodsTypeData = [{ name: this.$t('tools.all'), code: '', id: '' }, ...response.items]
          }
        }
      })
    },
    typeChangeFunc(data) {
      this.totalgoodshForm.type_id = data.id
      this.currentPage_to = 1
      this.Searchlist()
    },
    nodeOpen(data, node, obj) {
      this.defaultExpanded.push(data.id)
      console.log('node', node)
      if (node.level > this.maxNumber) {
        this.maxNumber = node.level
        const addWidth = 18 * this.maxNumber
        const funcTreeWidth1 = this.funcTreeWidth
        const funcBoxWidth1 = this.funcBoxWidth
        const addClassWidth = funcTreeWidth1 + addWidth
        const reduceWidth = funcBoxWidth1 - addWidth
        $('.funcTree').width(addClassWidth)
        $('.funcBox').width(reduceWidth)
      }
    },
    nodeClose(data, node, obj) {
      this.defaultExpanded.splice(this.defaultExpanded.indexOf(data.id), 1)
    },
    renderContent(h, { node, data, store }) {
      if (this.permissionCheck('opt')) {
        return (
          <span class='custom-tree-node'>
            <span title={node.label}>{node.label}</span>
          </span>)
      } else {
        return (<span class='custom-tree-node'>
          <span title={node.label}>{node.label}</span></span>)
      }
    },
    textFilter(data) {
      let index = data.indexOf("{");
      if (index != -1) {
        let str = "";
        const text = JSON.parse(data);
        Object.keys(text).forEach((v, i) => {
          if (i === 0) {
            str = v + ":" + text[v] + ";";
          } else {
            str = str + v + ":" + text[v] + ";";
          }
        });
        return str;
      } else {
        return data;
      }
    },
    gettotaldata() {
      warehousegroup(this.totalgoodshForm).then((res) => {
        this.Totaldata = res.items;
        this.itemCount_to = res.total;
      });
    },
    Searchlist() {
      this.gettotaldata();
    },
    numinfo(data) {
      this.dialogVisible = true;
      this.restFrom = data.specification;
      this.restFromid = data.sku_uid;
    },
    dalogtype() {
      this.dialogVisible = false;
    },

  },
  mounted() {
    if (this.$route.params.zero_inventory) {
      this.totalgoodshForm.skip = 0
      this.currentPage_to = 1
      this.totalgoodshForm.zero_inventory = this.$route.params.zero_inventory
    }
    this.gettotaldata()
    this.getTypeList()
    this.funcTreeWidth = $('.funcTree').width()
    this.funcBoxWidth = $('.funcBox').width()
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.searchbtn {
  display: flex;
  margin-bottom: 5px;
  align-items: center;
}
.numcss {
  display: inline-block;
  width: 100%;
  cursor: pointer;
  color: #409eff;
}
.bigbox {
  display: flex;
  > div:nth-child(1) {
    width: 15%;
  }
  > div:nth-child(2) {
    width: 85%;
  }
}
  /deep/ {
    .el-form-item {
      margin-bottom: 0!important;
    }
    .el-tree-node {
      margin-left: 0;
    }
  }
</style>
