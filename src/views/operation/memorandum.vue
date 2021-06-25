<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="10" class="funcList">
            <div class="boxFuncBtn" v-if="permissionCheck('opt')" @click="addData">
              <img src="../../assets/images/icon/icon_add.png" alt class="icon_add" />
              <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table :data="tableData" style="width: 100%" border stripe>
          <el-table-column :label="$t('goods.cobuysec')">
            <template slot-scope="scope">
              <span>{{scope.row.bt}} - {{scope.row.et}}</span>
            </template>
          </el-table-column>
           <el-table-column prop="content" :label="$t('lang.content')"></el-table-column>
           <el-table-column :label="$t('tools.opt')">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="modifybtn(scope.row)">{{$t('tools.edit')}}</el-button>
              <span class="xiexian">/</span>
              <delete-button @delData="deleteDataFunc(scope.row)"></delete-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :title="$t('operation.Addmemorandum')" :visible.sync="dialogVisible" width="40%">
          <el-form ref="form" :model="dataForm" label-width="80px">
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
            <el-form-item :label="$t('lang.content')">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="dataForm.content">
              </el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="small">{{$t('tools.cancel')}}</el-button>
            <el-button type="primary" @click="comformBtn" size="small">{{$t('tools.confirm')}}</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { memorandumsadd, getmemorandums, Delmemorandums, modifymemorandums } from "@/api/operation";
export default {
  components: {},
  data() {
    return {
      type: '',
      dataid: '',
      tableData: [],
      dialogVisible: false,
      timeArr: [],
      dataForm:{
        bt: '',
        et: '',
        content: ''
      },
      serachform:{
        status: 0,
        skip: 0,
        limit: 10,
      }
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.Getmemorandumslist()
  },
  methods: {
    addData(){
      this.type = '1'
      this.timeArr = []
      this.dataForm.bt = ''
      this.dataForm.et = ''
      this.dataForm.content = ''
      this.dialogVisible = true
    },
    modifybtn(data){
      this.timeArr = []
      this.timeArr[0] = data.bt
      this.timeArr[1] = data.et
      this.dataForm.content = data.content
      // console.log(data);
      this.dataid = data.id
      this.type = '2'
      this.dialogVisible = true
    },
    comformBtn(){
      this.dataForm.bt = this.timeArr[0]
      this.dataForm.et = this.timeArr[1]
     if(this.type == 1){
        memorandumsadd(this.dataForm).then(res=>{
        this.dialogVisible = false
        this.Getmemorandumslist()
      })
     }else if(this.type == 2){
       modifymemorandums(this.dataForm,this.dataid).then(res=>{
        this.dialogVisible = false
        this.Getmemorandumslist()
       })
     }
    },
    Getmemorandumslist(){
      getmemorandums(this.serachform).then(res=>{
        this.tableData = res.items
      })
    },
    deleteDataFunc(data){
      Delmemorandums(data.id).then(res=>{
         this.Getmemorandumslist()
      })
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
