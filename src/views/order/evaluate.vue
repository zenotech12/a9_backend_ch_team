<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24" class="funcList">

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="height: calc(100% - 88px)">
              <el-table stripe border :span-method="arraySpanMethod" :data="tablePostage">
                <el-table-column prop="name" :label="$t('sys.name')"></el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    components: {
    },
    data() {
      return {
        searchForm: {
          key: '',
          skip: '',
          limit: 20
        }
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
    },
    methods: {
    },
    mounted() {
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>

</style>
