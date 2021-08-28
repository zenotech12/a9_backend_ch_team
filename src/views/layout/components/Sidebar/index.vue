<template>
  <scroll-bar :style="{ backgroundColor: fallBackColor }">
    <div class="logoTitle">
      <div class="logoImgBox">
        <img :src="imgPng" class="logoImg" />
      </div>

      <span class="title">{{ $t("login.merchantSystem") }}</span>

      <span class="subtitle">{{ shopInfo.user_info.title }}</span>
    </div>

    <div @click="jump()" class="guide">
      <el-button round icon="el-icon-s-home" class="btn">
        {{ $t("global.home") }}
      </el-button>
    </div>

    <el-menu
      mode="vertical"
      unique-opened
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="fallBackColor"
      text-color="#fff"
      active-text-color="#fff"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";
import store from "@/store";
import Cookies from "js-cookie";
import Hamburger from "@/components/Hamburger";
export default {
  components: { SidebarItem, ScrollBar, Hamburger },
  data() {
    return {
      toggle: true,
      imgPng: require("../../../../assets/images/dl/logoMerchant.png"),
      opened: !+Cookies.get("sidebarStatus"),
      fallBackColor: "#263238",
      position: ""
    };
  },
  computed: {
    ...mapGetters(["permission_routers", "sidebar", "shopInfo"]),
    routes() {
      return store.getters.routers;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    side() {
      return store.getters.sidebar.opened;
    }
  },
  watch: {
    side: function(val) {
      this.toggle = val;
    }
  },
  mounted() {
    this.position = this.shopInfo.user_info.title.toLowerCase();
  },
  methods: {
    jump() {
      this.$router.push("/");
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    }
  }
};
</script>

<style lang="scss" scoped>
.logoTitle {
  text-align: center;
  display: flex;
  flex-direction: column;
  color: #fff;
  .subtitle {
    font-size: 20px;
    font-weight: 600;
    padding: 5px 0;
  }
  .title {
    padding: 5px 0;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 2px;
  }
  .logoImgBox {
    padding: 13px 0 5px 0;
    .logoImg {
      display: inline-block;
      height: 50px;
      margin-right: 7px;
      border-radius: 6px;
    }
  }
}

.guide {
  padding: 10px 30px;
  .btn {
    width: 100%;
    background-color: #62727b;
    color: white;
    border: 2px none white;
    letter-spacing: 1.5px;
    font-weight: bold;
    transition: 0.5s;
    &:hover {
      background-color: #4f5b62;
      box-shadow: 0 6px 6px rgba(0, 0, 0, 0.8);
    }
  }
}
</style>
