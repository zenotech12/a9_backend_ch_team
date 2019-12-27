<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    // console.log('this.$route.path', this.$route.path)
    // if (this.$route.path) {
    //   document.title = 'MVISION'
    // } else {
    //   document.title = '街电后台'
    // }
  }
}
</script>
<style lang="scss">
  .sys-body {
    /*padding: 10px;*/
    border: 10px solid #F9F9F9;
    .sys-neiBody {
      padding: 10px;
      border: 1px solid #E8EDEE;
    }
    .sys-title{
      padding: 10px 0 10px 10px;
      background: #99a9bf;
      border-radius: 2px;
      margin-bottom: 10px;
    }
    .sys-search{

    }
    .dialog-footer{
      padding-right: 20px;
    }
  }
</style>
