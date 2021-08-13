<template>
  <el-input :placeholder="placeHolder" :precision="2" @blur="inputBlurFunc1" v-model="floatPriceValue" :disabled="disabled" :clearable="canClear" @change="changeFunc" :controls="false">
    <template slot="prepend"><slot name="prepend">$</slot></template>
    <template slot="append"><slot name="append"></slot></template>
  </el-input>
</template>
<script>
  export default {
    name: 'priceInputNew',
    data() {
      return {
        floatPriceValue: 0
      }
    },
    model: {
      prop: 'priceValue',
      event: 'floatPriceChange1'
    },
    props: {
      priceValue: {
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
      priceValue: {
        handler(val) {
          console.log('ddd', val)
          this.floatPriceValue = (val / 100.0).toFixed(2)
        },
        immediate: true
      }
    },
    methods: {
      changeFunc(val) {
        console.log('vvv', val)
        let p = Math.round(val * 100)
        if (isNaN(p)) {
          p = 0
          this.$message.error(this.$t('tools.priceTip'))
        }
        this.$emit('floatPriceChange1', p)
      },
      inputBlurFunc1() {
        this.$emit('inputBlurFunc1')
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
