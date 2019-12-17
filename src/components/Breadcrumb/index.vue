<template>
  <span>
    <span class="prompt_position">{{$t('lang.currentLocation')}}：</span>
    <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{$t('global.'+item.meta.title)}}</span>
        <router-link v-else :to="item.redirect||item.path">{{$t('global.'+item.meta.title)}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
  </span>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'admin') {
        matched = [{ path: '/admin', meta: { title: 'home' }}].concat(matched)
      }
      this.levelList = matched
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 12px;
    line-height: 50px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
    .el-breadcrumb__inner, .el-breadcrumb__inner a {
      color: #777E87;
      font-weight: 500;
    }
    .el-breadcrumb__item {
      float:none;
    }
  }
  .prompt_position {
    display: inline-block;
    margin-left: 20px;
    font-size:12px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(119,126,135,1);
  }
</style>
