<template>
  <el-menu class="navbar" mode="horizontal">
    <!-- <hamburger
      class="hamburger-container"
      :toggleClick="toggleSideBar"
      :isActive="sidebar.opened"
    /> -->

    <breadcrumb />

    <div class="right-opt">
      <a
        target="_blank"
        :href="shopInfo.user_info.im_login_url"
        style="padding: 0px 10px"
      >
        <i class="el-icon-chat-dot-square" />
      </a>

      <el-divider direction="vertical" />

      <el-dropdown trigger="click" @command="changeNewLang" placement="top">
        <span class="language-select">
          <img
            size="small"
            :src="currentLanguage.icon"
            :alt="currentLanguage.name"
            fit="contain"
          />
        </span>

        <!-- <span class="language-select">
          {{ currentLanguage.name }}
          <i class="el-icon-caret-bottom" />
        </span> -->

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(v, k) in languages"
            :key="k"
            :command="v.code"
            class="language_container"
          >
            <div class="flag_container">
              <img :src="v.icon" :alt="v.name" />
            </div>

            <span>
              {{ v.name }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-divider direction="vertical" />

      <el-dropdown trigger="click" placement="top">
        <!-- <span class="avatar-wrapper">
          <span class="avatar-img-container">
            <img class="avatar-img" :src="imgPng" alt="user_icon" />
          </span>

          <span>
            {{ shopInfo.user_info.nick_name }}
            @
            {{ shopInfo.name }}

            <i class="el-icon-caret-bottom" />
          </span>
        </span> -->

        <span class="avatar-wrapper">
          {{ shopInfo.user_info.nick_name }}
          @
          {{ shopInfo.name }}

          <i class="el-icon-caret-bottom" />
        </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="logout" style="display:block;">
              {{ $t("login.loginOut") }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { getIdentity } from "@/utils/auth";
import flag_kh from "@/assets/flags/flag-kh.png";
import flag_zh from "@/assets/flags/flag-zh.png";
import flag_en from "@/assets/flags/flag-us.png";

export default {
  data() {
    return {
      languages: [
        {
          code: "zh",
          name: this.$t("global.zh"),
          icon: flag_zh
        },
        {
          code: "en",
          name: this.$t("global.en"),
          icon: flag_en
        },
        {
          code: "km",
          name: this.$t("global.km"),
          icon: flag_kh
        }
      ],
      name: "",
      imgPng: require("../../../assets/images/dl/userLogo.png"),
      zhLang: require("../../../assets/images/icon_zw.png"),
      ehLang: require("../../../assets/images/icon_yw.png"),
      nowImg: null
    };
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "shopInfo", "lang"]),
    currentLanguage() {
      const cl = this.languages.find(item => {
        return item.code === this.lang;
      });

      return cl;
    }
  },
  mounted() {
    this.name = getIdentity();
    if (this.lang === "zh") {
      this.nowImg = this.zhLang;
    } else {
      this.nowImg = this.ehLang;
    }
  },
  methods: {
    ...mapMutations({
      changeLang: "CHANGE_LANG"
    }),
    changeNewLang(lan) {
      if (this.lang !== lan) {
        this.changeLang(lan);
        window.location = window.location;
      }
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
        // this.$router.replace('/login')
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
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
  .right-opt {
    height: 50px;
    float: right;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    .language-select {
      cursor: pointer;
      color: #409eff !important;
      display: flex;
      align-items: center;
      img {
        width: 24px;
        height: 100%;
        object-fit: contain;
      }
    }
    .avatar-wrapper {
      cursor: pointer;
      color: #9ac338;
    }
  }
}

.el-menu.el-menu--horizontal {
  border: none;
}

.language_container {
  display: flex;
  align-items: center;
  .flag_container {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
