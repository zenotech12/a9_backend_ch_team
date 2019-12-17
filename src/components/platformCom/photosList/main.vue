<template>
  <div>
    <el-popover v-if="checkedArray" v-for="(img, k) in photosArray"
                placement="right"
                title=""
                :key="k"
                trigger="click">
      <img :src="img !== ''? img : ''" :key="k" height="480"/>
      <img slot="reference" :src="img !== ''? img: ''" :key="k" style="margin-right:2px;max-height: 30px;">
    </el-popover>
    <el-popover v-if="stringShow"
                placement="right"
                title=""
                trigger="click">
      <img :src="photosString !== ''? photosString : ''" height="480"/>
      <img slot="reference" :src="photosString !== ''? photosString: ''" style="max-height: 40px;">
    </el-popover>
  </div>
</template>
<script>
  export default {
    name: 'photosList',
    data() {
      return {
        stringShow: false
      }
    },
    props: {
      photosArray: {
        type: Array,
        default: function() {
          return []
        }
      },
      photosString: {
        type: String,
        default: function() {
          return ''
        }
      },
      checkedArray: {
        type: Boolean,
        default: function() {
          return true
        }
      }
    },
    watch: {
      checkedArray: {
        handler(val) {
          this.stringShow = !val
        },
        immediate: true
      }
    }
  }
</script>
