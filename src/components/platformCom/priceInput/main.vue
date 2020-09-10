<template>
  <el-input :placeholder="placeHolder" :precision="2" v-model="floatPrice" :disabled="disabled" :clearable="canClear" @change="changeFunc" :controls="false">
    <template slot="prepend"><slot name="prepend">$</slot></template>
    <template slot="append"><slot name="append"></slot></template>
  </el-input>
</template>
<script>
  export default {
    name: 'priceInput',
    data() {
      return {
        floatPrice: 0
      }
    },
    model: {
      prop: 'price',
      event: 'floatPriceChange'
    },
    props: {
      price: {
        default: function() {
          return 0
        }
      },
      placeHolder: {
        type: String,
        default() {
          return ''
        }
      },
      canClear: {
        type: Boolean,
        default() {
          return false
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
      price: {
        handler(val) {
          this.floatPrice = (val / 100.0).toFixed(2)
        },
        immediate: true
      }
    },
    methods: {
      changeFunc(val) {
        let p = Math.round(val * 100)
        if (isNaN(p)) {
          p = 0
          this.$message.error(this.$t('tools.priceTip'))
        }
        this.$emit('floatPriceChange', p)
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
