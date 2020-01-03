<template>
  <div class="dashboard-container">
    <el-row>
      <el-card shadow="always">
        <div class="star-info">
          <span class="title">{{shopInfo.name}}</span>
          <div class="rate-item"><span>{{$t('order.star')}}</span><el-rate class="rate" :value="shopInfo.star_score" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
          <div class="rate-item"><span>{{$t('order.star1')}}</span><el-rate class="rate" :value="shopInfo.description_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
          <div class="rate-item"><span>{{$t('order.star2')}}</span><el-rate class="rate" :value="shopInfo.service_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
          <div class="rate-item"><span>{{$t('order.star3')}}</span><el-rate class="rate" :value="shopInfo.express_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
        </div>
      </el-card>
    </el-row>
    <!--<div>我的天啊</div>-->
    <!-- <div class="dashboard-text">roles:<span v-for='role in roles' :key='role'>{{role}}</span></div>-->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { shopStat } from '@/api/operation'
  export default {
    name: 'dashboard',
    data() {
      return {
        name: '',
        statInfo: {}
      }
    },
    computed: {
      ...mapGetters([
        'shopInfo'
      ])
    },
    methods: {
      getStatInfo() {
        const items = ['need_pay', 'need_ship', 'refund', 'need_evaluate', 'shipping_exception', 'today_order', 'today_traffic', 'today_visit', 'yesterday_visit', 'yesterday_traffic', 'today_sales']
        shopStat({ categories: JSON.stringify(items) }).then(res => {
          this.statInfo = res.item
        })
      }
    },
    mounted() {
      this.getStatInfo()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
      .star-info{
        .title{
          font-size: 20px;
          color: #333333;
        }
        display: flex;
        align-items: center;
        .rate-item{
          display: flex;
          padding: 0px 20px;
          span{
            display: inline-block;
            padding-right: 5px;
          }
        }
      }
    }
  }
</style>
