<template>
  <div class="dashboard-container">
    <el-row>
      <el-card shadow="always">
        <div class="star-info cp" @click="gotoUrl('/order/evaluate')">
          <span class="title">{{shopInfo.name}}</span>
          <div class="rate-item"><span>{{$t('order.star')}}</span><el-rate class="rate" :value="shopInfo.star_score" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
          <div class="rate-item"><span>{{$t('order.star1')}}</span><el-rate class="rate" :value="shopInfo.description_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
          <div class="rate-item"><span>{{$t('order.star2')}}</span><el-rate class="rate" :value="shopInfo.service_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
          <div class="rate-item"><span>{{$t('order.star3')}}</span><el-rate class="rate" :value="shopInfo.express_lv" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></div>
        </div>
      </el-card>
    </el-row>
    <el-row class="liuliang" v-if="permissionCheck('view', '3_1')">
      <el-col :span="8">
        <el-card shadow="always" class="stat-item">
          <div class="sp cp" @click="gotoUrl('orderList',{ bt: $moment(new Date().getTime()).format('YYYY-MM-DD'), et: $moment(new Date().getTime()).format('YYYY-MM-DD') })">
            <p>{{$t('lang.todayOrder')}}：<span>{{statInfo.today_order}}</span></p>
            <p>{{$t('lang.todayMoney')}}：<span>{{statInfo.today_sales | price}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always"  class="stat-item">
          <div class="sp">
            <p>{{$t('lang.todayUser')}}：<span>{{statInfo.today_visit}}</span></p>
            <p>{{$t('lang.todayPV')}}：<span>{{statInfo.today_traffic}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">
          <div class="sp">
            <p>{{$t('lang.yesterdayUser')}}：<span>{{statInfo.yesterday_visit}}</span></p>
            <p>{{$t('lang.yesterdayPV')}}：<span>{{statInfo.yesterday_traffic}}</span></p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="liuliang" v-if="permissionCheck('view', '3_1')">
      <el-col :span="4">
        <el-card shadow="always">
          <div class="sp cp" @click="gotoUrl('orderList', { order_status: 2})">
            <p>{{$t('lang.orderStat1')}}：<span>{{statInfo.need_pay}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div class="sp cp" @click="gotoUrl('orderList', { order_status: 5})">
            <p>{{$t('lang.orderStat2')}}：<span>{{statInfo.need_ship}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div class="sp cp" @click="gotoUrl('/order/return')">
            <p>{{$t('lang.orderStat3')}}：<span>{{statInfo.refund}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div class="sp">
            <p>{{$t('lang.orderStat4')}}：<span>{{statInfo.need_evaluate}}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div class="sp">
            <p>{{$t('lang.orderStat5')}}：<span>{{statInfo.shipping_exception}}</span></p>
          </div>
        </el-card>
      </el-col>
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
      },
      gotoUrl(url, params) {
        if (url === '/order/evaluate' && !this.permissionCheck('view', '3_3')) {
          return
        }
        let pushUrl = {}
        if (params) {
          pushUrl = { name: url, params: params }
        } else {
          pushUrl = { path: url }
        }
        this.$router.push(pushUrl)
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
      .cp{
        cursor: pointer;
      }
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
            color: #8d8d8d;
          }
        }
      }
      .liuliang{
        margin-top: 20px;
      }
      .stat-item{
        margin-right: 20px;
      }
      .sp{
        p{
          color: #8d8d8d;
          span{
            font-size:25px;
            color: #333333
          }
          line-height: 30px;
        }
      }
    }
  }
</style>
