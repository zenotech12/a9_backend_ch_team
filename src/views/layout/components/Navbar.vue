<template>
  <el-menu class="navbar" mode="horizontal">
    <!--<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->
    <breadcrumb></breadcrumb>
    <div class="right-opt">
      <a target="_blank" :href="shopInfo.user_info.im_login_url" style="padding: 0px 10px"><i class="el-icon-chat-dot-square"></i></a>
      <el-dropdown trigger="click" @command="changeNewLang">
        <span class="language-select">
          {{currentLanguage}}<i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(v,k) in languages" :key="k" :command="v.code">{{v.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-divider direction="vertical"></el-divider>
      <el-dropdown trigger="click">
        <div class="avatar-wrapper">
          <span>{{shopInfo.user_info.nick_name}}@{{shopInfo.name}} <i class="el-icon-caret-bottom"></i></span>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('login.loginOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getIdentity } from '@/utils/auth'
export default {
  data() {
    return {
      languages: [{ code: 'zh', name: this.$t('global.zh') }, { code: 'en', name: this.$t('global.en') }, { code: 'km', name: this.$t('global.km') }],
      name: '',
      imgPng: require('../../../assets/images/dl/userLogo.png'),
      zhLang: require('../../../assets/images/icon_zw.png'),
      ehLang: require('../../../assets/images/icon_yw.png'),
      nowImg: null
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'shopInfo', 'lang'
    ]),
    currentLanguage() {
      const cl = this.languages.find((item) => {
        return item.code === this.lang
      })
      return cl.name
    }
  },
  mounted() {
    this.name = getIdentity()
    if (this.lang === 'zh') {
      this.nowImg = this.zhLang
    } else {
      this.nowImg = this.ehLang
    }
  },
  methods: {
    ...mapMutations({
      changeLang: 'CHANGE_LANG'
    }),
    changeNewLang(lan) {
      if (this.lang !== lan) {
        this.changeLang(lan)
        window.location = window.location
      }
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
        // this.$router.replace('/login')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  /*display: flex;*/
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .big_screen {
    position: absolute;
    right: 85px;
  }
  .big_screen1 {
    position: absolute;
    right: 90px;
  }
  .big_screen2 {
    position: absolute;
    right: 285px;
  }
  .right-opt{
    height: 50px;
    float: right;
    padding-right: 20px;
    .language-select{
      cursor: pointer;
      color: #409eff !important;
    }
    .avatar-wrapper{
      cursor: pointer;
      color:#9ac338 ;
    }
  }
}
.el-menu.el-menu--horizontal {
  border: none;
}
</style>

