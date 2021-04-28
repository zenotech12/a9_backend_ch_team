<template>
  <div>
    <el-row>
      <el-col :span="24">
        <purchases-list @dataid="dataid" @getvalue="getvalue" style="width: 400px;"></purchases-list>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="tableData" stripe @current-change="handleCurrentChange" highlight-current-row  ref="singleTable">
        <el-table-column
          type="index"
          width="50">>
        </el-table-column>
        <el-table-column property="name" :label="$t('warehouse.name2')"></el-table-column>
        <el-table-column :label="$t('warehouse.PlaceofOrigin')">
          <template slot-scope="scope">
            <el-input v-model="scope.row.origin"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.location')">
          <template slot-scope="scope">
            <el-input v-model="scope.row.position"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="specification" :label="$t('warehouse.pecifications')"></el-table-column>
        <el-table-column :label="$t('warehouse.barCode')">
          <template slot-scope="scope">
            <el-input v-model="scope.row.barcode"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="unit_price" :label="$t('warehouse.price')"></el-table-column>
        <el-table-column property="count" :label="$t('warehouse.num')"></el-table-column>
        <el-table-column property="total_price" :label="$t('warehouse.allprice')"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import { purchaseInfo } from '../../../api/warehouse'
export default {
  name: "showSkuPlist",
  data() {
    return {
      puid: '',
      tableData:[],
      bcode:'',
      key:'',
      Ty:false
    };
  },
  methods: {
    dataid(data) {
      this.puid = data.id
      this.getpuinfo()
    },
    getvalue(val) {
    
    },
    getpuinfo(){
      purchaseInfo(this.puid).then(res=>{
        // this.tableData = res
        // console.log(res.item.skus);
        res.item.skus.forEach(item => {
          item.position = ''
        });
        this.tableData = res.item.skus
      })
    },
     handleCurrentChange(val) {
         let array = []
          array.push(val)
          //  console.log(array);
          this.$emit('pulist',array)
          this.$emit('getid',this.puid)
      }
  },
  mounted() {
    this.tableData = []
  },
};
</script>

<style lang="scss" scoped>
.inputNumber {
  /deep/ {
    .el-input-number {
      line-height: 26px;
      width: 100%;
    }
  }
}
</style>
