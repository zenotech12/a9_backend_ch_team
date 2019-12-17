<template>
      <el-button type="text" @click="deleteInfro()" size="small">{{btnName}}</el-button>
</template>
<script>
  export default {
    name: 'DeleteButton',
    data() {
      return {
      }
    },
    props: {
      promptInfor: {
        type: String,
        default: function() {
          return this.$t('tools.willDeleteRecord')
        }
      },
      btnName: {
        type: String,
        default: function() {
          return this.$t('tools.delete')
        }
      }
    },
    methods: {
      // 删除按钮
      deleteInfro() {
        this.$confirm(this.promptInfor, this.$t('tools.prompt'), {
          confirmButtonText: this.$t('tools.confirm'),
          cancelButtonText: this.$t('tools.cancel'),
          type: 'error '
        }).then(() => {
          this.$emit('delData')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('tools.cancel') + this.btnName
          })
        })
      }
    }
}

</script>

<style scoped>

</style>
