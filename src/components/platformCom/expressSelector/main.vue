<template>
  <el-select v-model="expressCompany" :disabled="disabled" @change="changeFunc" :placeholder="$t('order.expressCompany')">
    <el-option
      v-for="(item, k) in expressageList"
      :key="k"
      :label="item"
      :value="k">
    </el-option>
  </el-select>
</template>
<script>
  import expressage from '@/utils/expressage'
  export default {
    name: 'expressSelector',
    data() {
      return {
        expressageList: expressage,
        expressCompany: ''
      }
    },
    model: {
      prop: 'express',
      event: 'expressChange'
    },
    props: {
      express: {
        default: function() {
          return ''
        }
      },
      placeHolder: {
        type: String,
        default() {
          return ''
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    watch: {
      express: {
        handler(val) {
          this.expressCompany = val
        },
        immediate: true
      }
    },
    methods: {
      changeFunc(val) {
        this.$emit('expressChange', val)
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
