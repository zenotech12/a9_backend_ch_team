<template>
  <el-select v-model="currentProp" :disabled="disabled" @change="changeFunc" :placeholder="placeString">
    <el-option
      v-for="(item, k) in currentPropsArr"
      :key="k"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
</template>
<script>
  import goodsProps from '@/utils/propsArr'
  export default {
    name: 'propSelector',
    data() {
      return {
        propsArr: goodsProps,
        currentProp: ''
      }
    },
    model: {
      prop: 'goodsProp',
      event: 'goodsPropChange'
    },
    props: {
      goodsProp: {
        default: function() {
          return ''
        }
      },
      clang: {
        default: function() {
          return ''
        }
      },
      placeString: {
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
      goodsProp: {
        handler(val) {
          this.currentProp = val
        },
        immediate: true
      },
      clang: {
        handler(val) {
          if (this.currentProp !== '' && this.currentPropsArr.indexOf(this.currentProp) < 0) {
            let cIndex = 0
            const lKeys = Object.keys(this.propsArr)
            for (let i = 0; i < lKeys.length; i++) {
              if (lKeys[i] === val) {
                continue
              }
              const ci = this.propsArr[lKeys[i]].indexOf(this.currentProp)
              if (ci >= 0) {
                cIndex = ci
                break
              }
            }
            this.currentProp = this.currentPropsArr[cIndex]
            this.changeFunc(this.currentProp)
          }
        },
        immediate: true
      }
    },
    computed: {
      currentPropsArr() {
        if (this.clang === '') {
          this.clang = 'en'
        }
        return this.propsArr[this.clang]
      }
    },
    methods: {
      changeFunc(val) {
        this.$emit('goodsPropChange', val)
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
