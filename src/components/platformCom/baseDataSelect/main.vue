<template>
  <!--<div>-->
    <el-select v-model="value" @change="changeValue" :placeholder="placeString">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.name">
      </el-option>
    </el-select>
  <!--</div>-->
</template>

<script>
import { dataSelectsGet } from '@/api/system'
export default {
  name: 'baseDataSelect',
  data() {
    return {
      options: [],
      value: '',
      searchForm: {
        skip: 0,
        limit: 100,
        parent_tree_code: ''
      }
    }
  },
  model: {
    prop: 'value',
    event: 'selectValue'
  },
  props: {
    treeCode: {
      type: String,
      default: function() {
        return ''
      }
    },
    placeString: {
      type: String,
      default() {
        return ''
      }
    }
  },
  methods: {
    changeValue(item) {
      this.$emit('selectValue', this.value)
    },
    getDataList() {
      dataSelectsGet(this.searchForm).then(res => {
        if (res.meta === 0) {
          this.options = res.items
        }
      })
    }
  },
  watch: {
  },
  mounted() {
    this.searchForm.parent_tree_code = this.treeCode
    this.getDataList()
  }
}
</script>

<style>
</style>
