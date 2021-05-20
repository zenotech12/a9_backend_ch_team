<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">

      <router-link v-if="item.children.length===1 && !item.children[0].children && !item.alwaysShow" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <span class="itemCurrent1"></span>
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{$t("global."+item.children[0].meta.title)}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <span class="itemCurrent"></span>
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title">{{$t("global."+item.meta.title)}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <span class="itemCurrent"></span>
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title">{{$t("global."+child.meta.title)}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarItem',
  data() {
    return {
      position: ''
    }
  },
  computed: {
    ...mapGetters([
      'shopInfo'
    ])
  },
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    const position = this.shopInfo.user_info.title.toLowerCase()
    this.routes.forEach(res => {
      if (res.name === 'warehouse') {
        if (position === 'purchaser') {
          res.meta.title = 'ProcurementManagement'
        } else if (position === 'warehouse') {
          res.meta.title = 'warehouseMgr'
        }
      }
    })
  }
}
</script>
<style lang="scss">
  .el-menu-item {
    /*background-color: #9ac338 !important;*/
  }
  .el-submenu__title {
    /*background-color: #9ac338 !important;*/
  }
</style>
