<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24">
            <div class="page-form">
              <el-form label-width="100px">
                <el-form-item :label="$t('operation.shopLogo')">
                  <image-upload :drag="false" @uploadSuccess="imageUploadSuccess">
                    <img v-if="shopForm.avatar" :src="getImageUrl(shopForm.avatar)" class="shop-logo">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </image-upload>
                </el-form-item>
                <el-form-item :label="$t('operation.shopDesc')">
                  <el-input type="textarea" maxlength="200" rows="10" v-model="shopForm.desc"></el-input>
                </el-form-item>
                <el-form-item >
                  <confirm-button @confirmButton="saveInfo" :disabled="disabled" :confirmButtonInfor="this.$t('tools.save')"></confirm-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { shopModify } from '@/api/operation'

  export default {
    components: {
    },
    data() {
      return {
        shopForm: {
          desc: '',
          avatar: ''
        },
        disabled: false
      }
    },
    computed: {
      ...mapGetters([
        'shopInfo'
      ])
    },
    watch: {
    },
    methods: {
      getShopInfo() {
        this.shopForm.desc = this.shopInfo.desc
        this.shopForm.avatar = this.shopInfo.avatar
      },
      saveInfo() {
        this.disabled = true
        shopModify(this.shopForm).then(res => {
          this.$message.success('保存成功')
          this.disabled = false
          this.$store.dispatch('GetShopInfo').then()
        }).catch(() => {
          this.disabled = false
        })
      },
      imageUploadSuccess(res) {
        this.shopForm.avatar = res.md5
      }
    },
    mounted() {
      this.getShopInfo()
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
  .page-form{
    width: 50%;
    margin: 40px auto auto auto;
    .shop-logo{
      border: 1px dashed #d9d9d9;
      width: 100px;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
  }
</style>
