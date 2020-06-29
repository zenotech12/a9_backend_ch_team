<template>
  <div class="sys-body">
    <div  class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <!--添加-->
        <el-row>
          <el-col :span="20" class="funcList">
            <el-form :inline="true" :model="searchForm">
              <!--<el-form-item :label="$t('sys.parentMessage')">-->
              <!--<el-select v-model="searchForm.father_id" @change="search" :placeholder="$t('sys.pleaseChoose')+$t('sys.parentMessage')">-->
              <!--<el-option-->
              <!--v-for="item in searchMessageList"-->
              <!--:key="item.id"-->
              <!--:label="item.title"-->
              <!--:value="item.id">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <!--</el-form-item>-->
              <!--<el-form-item :label="$t('sys.language')">-->
              <!--<el-switch-->
              <!--v-model="searchForm.lang"-->
              <!--:active-text="$t('sys.english')"-->
              <!--:active-value="0"-->
              <!--:inactive-text="$t('sys.chinese')"-->
              <!--:inactive-value="1"-->
              <!--@change="search">-->
              <!--</el-switch>-->
              <!--</el-form-item>-->
              <!--<el-form-item :label="$t('sys.type')">-->
                <!--<el-switch-->
                  <!--v-model="searchForm.platform"-->
                  <!--:active-text="$t('sys.rider')"-->
                  <!--:active-value="1"-->
                  <!--:inactive-text="$t('sys.app')"-->
                  <!--:inactive-value="2"-->
                  <!--@change="search">-->
                <!--</el-switch>-->
              <!--</el-form-item>-->
              <!--<el-form-item>-->
              <!--<el-switch-->
              <!--v-model="searchForm.option_show_type"-->
              <!--active-text="不显示"-->
              <!--:active-value="0"-->
              <!--inactive-text="显示所有"-->
              <!--:inactive-value="1"-->
              <!--@change="search">-->
              <!--</el-switch>-->
              <!--</el-form-item>-->
              <!--<el-form-item>-->
              <!--<el-button type="primary" @click="search" size="small" icon="el-icon-search"></el-button>-->
              <!--</el-form-item>-->
            </el-form>
          </el-col>
          <!--<el-col :span="4" class="funcList">-->
          <!--<div class="boxFuncBtn" @click="addMessage">-->
          <!--<img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">-->
          <!--<el-button type="text" size="small">{{$t('tools.add')}}</el-button>-->
          <!--</div>-->
          <!--</el-col>-->
        </el-row>
        <!-- 搜索 -->
        <el-row>
          <el-col :span="6" class="funcTree" style="margin-left: 0; height: 100%">
            <div style="text-align: center; padding: 10px">
              {{$t('sys.questionList')}}
            </div>
            <div style="height: calc(100vh - 186px)">
              <el-tree :data="tableData.body" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
          </el-col>
          <el-col :span="18"  class="funcBox">
            <el-row class="funcList">
              <div class="boxFuncBtn" @click="addMessage"  v-if="permissionCheck('opt')">
                <img src="../../assets/images/icon/icon_add.png" alt="" class="icon_add">
                <el-button type="text" size="small">{{$t('tools.add')}}</el-button>
              </div>
            </el-row>
            <el-row style="height: calc(100vh - 200px)">
              <el-col :span="24" style="height: 100%; padding: 0 10px">
                <el-table stripe v-loading="tableData.loading" :data="rightTableData" style="width: 100%;" height="100%">
                  <el-table-column prop="title" :label="$t('sys.title')"></el-table-column>
                  <el-table-column prop="no" :label="$t('sys.messageNumber')"></el-table-column>
                  <!--<el-table-column :label="$t('sys.language')">-->
                  <!--<template slot-scope="scope">-->
                  <!--<el-tag type="primary" v-if="scope.row.lang === 0">{{$t('sys.english')}}</el-tag>-->
                  <!--<el-tag type="success" v-if="scope.row.lang === 1">{{$t('sys.chinese')}}</el-tag>-->
                  <!--</template>-->
                  <!--</el-table-column>-->
                  <el-table-column prop="tags" :label="$t('sys.keyWord')"></el-table-column>
                  <el-table-column :label="$t('sys.showSubmessages')">
                    <template slot-scope="scope">
                      <el-tag type="primary" v-if="scope.row.lang === 0">{{$t('sys.noDisplay')}}</el-tag>
                      <el-tag type="success" v-if="scope.row.lang === 1">{{$t('sys.showAll')}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="content" :label="$t('sys.content')"></el-table-column>
                  <el-table-column prop="gen_time" :label="$t('sys.addTime')"></el-table-column>
                  <el-table-column :label="$t('tools.opt')"  v-if="permissionCheck('opt')">
                    <template slot-scope="scope">
                      <el-button type="text" @click="editMessage(scope.row)" size="small">{{$t('tools.edit')}}</el-button>
                      <span class="xiexian">|</span>
                      <delete-button :promptInfor="promptInfor" @delData="delMessage(scope.row)"></delete-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!--<template v-if="itemCount !== 0">-->
                <!--<div style="text-align: right;margin-top: 10px">-->
                <!--<el-pagination-->
                <!--@size-change="sizeChangeFunc"-->
                <!--@current-change="pageChangeFunc"-->
                <!--:current-page.sync="currentPage"-->
                <!--:page-size="10"-->
                <!--layout="total, prev, pager, next, jumper"-->
                <!--:total="itemCount">-->
                <!--</el-pagination>-->
                <!--</div>-->
                <!--</template>-->
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-dialog :title="editTitle" @close="cancel('form')" :close-on-click-modal="false" :visible.sync="dialogFormVisible" center width="600px" style="margin-top: 0vh">
          <el-form :model="form" :rules="formRule" ref="form" label-width="100px">
            <!--<el-form-item :label="$t('sys.type')">-->
              <!--<el-radio-group v-model="form.platform" @change="typeChange">-->
                <!--<el-radio :label="1">{{$t('sys.rider')}}</el-radio>-->
                <!--<el-radio :label="2">{{$t('sys.app')}}</el-radio>-->
              <!--</el-radio-group>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('sys.parentMessage')">
              <el-select v-model="form.father_id" :placeholder="$t('sys.pleaseChoose') + $t('sys.parentMessage')">
                <el-option
                  v-for="item in messageList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>
              <div style="color: red;">{{$t('sys.noChooseParentMessage')}}</div>
            </el-form-item>
            <!--<el-form-item :label="$t('sys.language')">-->
            <!--<el-radio-group v-model="form.lang">-->
            <!--<el-radio :label="0">{{$t('sys.english')}}</el-radio>-->
            <!--<el-radio :label="1">{{$t('sys.chinese')}}</el-radio>-->
            <!--</el-radio-group>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('sys.title')" prop="title">
              <el-input v-model="form.title" auto-complete="off" :placeholder="$t('sys.pleaseEnter')+$t('sys.title')" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.messageNumber')" prop="no">
              <el-input v-model.number="form.no" auto-complete="off" :placeholder="$t('sys.pleaseEnter')+$t('sys.messageNumber')" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys.keyWord')" prop="tags">
              <el-input v-model="form.tags" auto-complete="off" :placeholder="$t('sys.pleaseEnter')+$t('sys.keyWord')" clearable></el-input>
              <div style="color: red;">{{$t('sys.enterKeyWordWithSpaces')}}</div>
            </el-form-item>
            <!--<el-form-item :label="$t('sys.showSubmessages')">-->
            <!--<el-radio-group v-model="form.option_show_type">-->
            <!--<el-radio :label="0">{{$t('sys.noDisplay')}}</el-radio>-->
            <!--<el-radio :label="1">{{$t('sys.showAll')}}</el-radio>-->
            <!--</el-radio-group>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('sys.content')" prop="content">
              <el-input v-model="form.content" type="textarea" :rows="3" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <confirm-button @confirmButton="upsertMessage('form')" :disabled="disabled"></confirm-button>
            <el-button @click="cancel('form')" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { chatRobotReplies, chatRobotRepliesAdd, chatRobotRepliesDel, chatRobotRepliesModify } from '@/api/system'
  export default {
    data() {
      return {
        defaultProps: {
          children: 'items',
          label: 'title'
        },
        editTitle: this.$t('sys.addMessage'),
        disabled: false,
        promptInfor: this.$t('sys.delMessageTips'),
        searchForm: {
          skip: 0,
          limit: 1000,
          lang: 1, // 语言 0英文 1中文
          father_id: '',
          platform: 2, // 1 骑手 2 app
          option_show_type: 1, // 显示子消息；0不显示 1显示所有
          type: 2 // 消息类型 固定2
        },
        searchFormList: {
          lang: 1, // 语言 0英文 1中文
          father_id: '',
          platform: 1, // 1 骑手 2 app
          option_show_type: 1, // 显示子消息；0不显示 1显示所有
          type: 2 // 消息类型 固定2
        },
        form: {
          platform: 1, // 1骑手 2 app
          lang: 1, // 语言 0英文 1中文
          no: 0, // 消息序号
          title: '', // 标题
          tags: '', // 关键词 空格隔开
          content: '', // 内容
          option_show_type: 1, // 显示子消息；0不显示 1显示所有
          type: 2, // 消息类型 固定2
          father_id: '' // 父消息id
        },
        formRule: {
          title: [
            { required: true, message: this.$t('sys.pleaseEnter') + this.$t('sys.title'), trigger: 'blur' }
          ],
          tags: [
            { required: true, message: this.$t('sys.pleaseEnter') + this.$t('sys.keyWord'), trigger: 'blur' }
          ]
        },
        pageSize: 10,
        itemCount: 0,
        currentPage: 1,
        tableData: {
          loading: true,
          body: []
        },
        dialogFormVisible: false,
        currentId: '',
        type: 'add',
        messageList: [],
        searchMessageList: [],
        rightTableData: []
      }
    },
    mounted() {
      this.getTableData()
      this.getMessageList()
    },
    watch: {
      currentPage(val) {
        this.searchForm.skip = (val - 1) * this.pageSize
        this.searchForm.limit = this.pageSize
        this.getTableData()
      }
    },
    methods: {
      handleNodeClick(data) {
        this.rightTableData = []
        if (data.id === 11) {
          this.getChild(this.rightTableData, JSON.parse(JSON.stringify(this.tableData.body || [])))
          this.rightTableData.shift()
        } else {
          this.getChild(this.rightTableData, JSON.parse(JSON.stringify(data.items || [])))
        }
        this.$forceUpdate()
      },
      getChild(arr, data) {
        if (!data.length) {
          return
        }
        data.forEach(item => {
          arr.push(item)
          if (item.items) {
            this.getChild(arr, item.items)
          }
        })
      },
      upsertMessage(form) {
        this.dialogFormVisible = false
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.disabled = true
            this.upsertData(this.type)
          } else {
            this.$alert(this.$t('merchant.pleaseEnterComplete'), this.$t('merchant.tips'), {
              confirmButtonText: '',
              center: true,
              type: 'warning'
            })
            this.dialogFormVisible = true
          }
        })
      },
      editMessage(data) {
        this.disabled = false
        this.editTitle = this.$t('sys.editMessage')
        this.dialogFormVisible = true
        this.form = JSON.parse(JSON.stringify(data))
        this.currentId = data.id
        this.type = 'modify'
      },
      delMessage(data) {
        chatRobotRepliesDel(data.id).then(response => {
          if (response.meta === 0) {
            this.$message.success(this.$t('sys.successfulDel'))
            this.getTableData()
          }
        })
      },
      cancel(form) {
        this.dialogFormVisible = false
        this.$refs[form].resetFields()
      },
      addMessage() {
        this.dialogFormVisible = true
        this.disabled = false
        this.form.platform = 1
        this.form.lang = 1
        this.form.no = 0
        this.form.title = ''
        this.form.tags = ''
        this.form.content = ''
        this.form.option_show_type = 1
        this.form.type = 2
        this.form.father_id = ''
        this.type = 'add'
        this.editTitle = this.$t('sys.addMessage')
      },
      sizeChangeFunc(val) {
        this.pageSize = val
      },
      pageChangeFunc(val) {
        this.currentPage = val
      },
      getTableData() {
        chatRobotReplies(this.searchForm).then(res => {
          if (res.meta === 0) {
            this.tableData.loading = false
            this.itemCount = res.total
            this.rightTableData = res.items
            this.tableData.body = this.reloadTree(res.items)
            this.tableData.body.unshift({
              title: this.$t('tools.all'),
              id: 11
            })
            this.searchMessageList = [{ title: this.$t('goods.whole') }, ...res.items]
          }
        })
      },
      reloadTree(data) {
        data.forEach(item => {
          const index = data.findIndex(res => item.father_id === res.id)
          if (index !== -1) {
            if (!data[index].items) {
              data[index].items = []
            }
            data[index].items.push(item)
            item.hasFather = true
          }
        })
        return data.filter(res => !res.hasFather)
      },
      typeChange(value) {
        this.searchFormList.platform = value
        this.getMessageList()
      },
      getMessageList() {
        chatRobotReplies(this.searchFormList).then(res => {
          if (res.meta === 0) {
            this.messageList = res.items
          }
        })
      },
      search() {
        this.getTableData()
      },
      upsertData(data) {
        if (data === 'add') {
          chatRobotRepliesAdd(this.form).then(response => {
            if (response.meta === 0) {
              this.$message.success(this.$t('sys.successfulPresservation'))
              this.dialogFormVisible = false
              this.getTableData()
              this.getMessageList()
            }
          })
        } else if (data === 'modify') {
          chatRobotRepliesModify(this.currentId, this.form).then(response => {
            if (response.meta === 0) {
              this.$message.success(this.$t('sys.successfulPresservation'))
              this.dialogFormVisible = false
              this.getTableData()
              this.getMessageList()
            }
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .sys-page {
    .distpicker_error {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }
</style>
