<template>
  <div class="spanBox">
    <el-button v-if="loading" size="small" type="primary" @click="confirmInfro()" :disabled="disabled">{{confirmButtonInfor}}</el-button>
    <el-button v-else size="small" type="primary" :disabled="disabled" :loading="true">{{$t('tools.loading')}}</el-button>
  </div>
</template>
<script>
  export default {
    name: 'ConfirmButton',
    data() {
      return {
        loading: true
      }
    },
    props: {
      confirmButtonInfor: {
        type: String,
        default: function() {
          return this.$t('tools.confirm')
        }
      },
      disabled: {
        type: Boolean,
        default: function() {
          return false
        }
      }
    },
    watch: {
      // 通过监听判断是否显示加载中
      disabled(val) {
        if (val === true) {
          this.loading = false
        } else {
          this.loading = true
        }
      }
    },
    methods: {
      // 确定按钮
      confirmInfro() {
        this.$emit('confirmButton')
      }
    }
}

</script>

<style scoped>
.spanBox {
  display: inline;
}
</style>
