<template>
  <el-button type="text" @click="deleteInfro()" size="small">
    {{ btnName }}
  </el-button>
</template>
<script>
export default {
  name: "DeleteButtonText",
  data() {
    return {};
  },
  props: {
    promptInfor: {
      type: String,
      default: function() {
        return this.$t("tools.willDeleteRecord");
      }
    },
    btnName: {
      type: String,
      default: function() {
        return this.$t("tools.delete");
      }
    },
    btnType: {
      type: String,
      default: function() {
        return "danger";
      }
    }
  },
  methods: {
    // 删除按钮
    deleteInfro() {
      this.$confirm(this.promptInfor, this.$t("tools.prompt"), {
        cancelButtonText: this.$t("tools.cancel"),
        confirmButtonText: this.$t("tools.confirm"),
        type: "warning"
      })
        .then(() => {
          this.$emit("delData");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("tools.cancel") + this.btnName
          });
        });
    }
  }
};
</script>

<style scoped></style>
