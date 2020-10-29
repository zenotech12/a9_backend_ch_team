export default [
  { 'name': '商品管理', 'lk': 'goodsMgr', 'code': '2', 'permissions': [], 'urls': [], 'son': [
    { 'name': '商品列表', 'lk': 'goodsList', 'code': '2_1', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '发布商品', 'lk': 'goodsEdit', 'code': '2_2', 'permissions': ['opt'], 'urls': [] },
    { 'name': '分销商品', 'lk': 'shareGoods', 'code': '2_3', 'permissions': ['view', 'opt'], 'urls': [] }
  ] },
  { 'name': '订单管理', 'lk': 'orderMgr', 'code': '3', 'permissions': [], 'urls': [], 'son': [
    { 'name': '订单列表', 'lk': 'orderList', 'code': '3_1', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '退货', 'lk': 'returnGoods', 'code': '3_2', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '换货', 'lk': 'exchangeGoods', 'code': '3_4', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '评论管理', 'lk': 'evaluateMgr', 'code': '3_3', 'permissions': ['view', 'opt'], 'urls': [] }
  ] },
  { 'name': '运营管理', 'lk': 'operationMgr', 'code': '4', 'permissions': [], 'urls': [], 'son': [
    { 'name': '广告管理', 'lk': 'adMgr', 'code': '4_1', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '优惠券', 'lk': 'coupon', 'code': '4_2', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '红包设置', 'lk': 'redEnvelope', 'code': '4_3', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '秒杀', 'lk': 'redEnvelope', 'code': '4_4', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '团购', 'lk': 'cobuy', 'code': '4_5', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '砍价免费领', 'lk': 'cutGoods', 'code': '4_6', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '店铺信息', 'lk': 'shopInfo', 'code': '4_7', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '直播管理', 'lk': 'liveBroadcast', 'code': '4_8', 'permissions': ['view', 'opt'], 'urls': [] }
  ] },
  { 'name': '财务管理', 'lk': 'financeMgr', 'code': '5', 'permissions': [], 'urls': [], 'son': [
    { 'name': '账户明细', 'lk': 'financeList', 'code': '5_1', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '提现记录', 'lk': 'financeTixian', 'code': '5_2', 'permissions': ['view', 'opt'], 'urls': [] }
  ] },
  { 'name': '设置', 'lk': 'system', 'code': '6', 'permissions': [], 'urls': [], 'son': [
    { 'name': '管理员列表', 'lk': 'adminList', 'code': '6_1', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '银行卡管理', 'lk': 'cardMgr', 'code': '6_2', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '邮费规则', 'lk': 'postageRule', 'code': '6_3', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '包邮设置', 'lk': 'freeShipingSet', 'code': '6_7', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '满减设置', 'lk': 'fullReductionSet', 'code': '6_8', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '地址管理', 'lk': 'address', 'code': '6_4', 'permissions': ['view', 'opt'], 'urls': [] },
    // { 'name': '聊天机器人', 'lk': 'chatRobot', 'code': '6_5', 'permissions': ['view', 'opt'], 'urls': [] },
    { 'name': '操作日志', 'lk': 'optLog', 'code': '6_6', 'permissions': ['view'], 'urls': [] }
  ] }
]
