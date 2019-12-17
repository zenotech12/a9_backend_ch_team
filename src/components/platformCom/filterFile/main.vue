<template>
  <div>
    <el-popover
      placement="top-start"
      width="300"
      trigger="hover">
      <div style="padding: 15px">
        <div>{{filterContent}}</div>
      </div>
      <span slot="reference" style="cursor: pointer;">{{filterContent | afterFilterContent}}</span>
    </el-popover>
  </div>
</template>
<script>
  export default {
    name: 'filterFile',
    props: {
      filterContent: {
        type: String,
        default: function() {
          return ''
        }
      },
      startPosition: {
        type: Number,
        default: function() {
          return 0
        }
      },
      endPosition: {
        type: Number,
        default: function() {
          return 40
        }
      }
    },
    filters: {
      afterFilterContent: function(value) {
        if (!value) return ''
        if (value.length >= 30) {
          return value.substring(0, 29) + '...'
        } else {
          return value
        }
      }
    }
  }
</script>
