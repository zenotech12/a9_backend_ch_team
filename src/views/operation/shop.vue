<template>
  <div class="sys-body">
    <div class="sys-neiBody">
      <!-- 搜索 -->
      <div class="rightbox">
        <el-row>
          <el-col :span="24">
            <div class="page-form">
              <el-form label-width="100px" v-model="shopForm">
                <el-form-item :label="$t('operation.shopPublish')">
                  <el-switch
                    v-model="shopForm.published"
                    :active-text="$t('operation.shopPublish1')"
                    :inactive-text="$t('operation.shopPublish2')">
                  </el-switch>
                </el-form-item>
                <el-form-item :label="$t('operation.shopName')">
                  <el-input  disabled v-model="shopForm.name"></el-input>
                </el-form-item>
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
          published: false,
          name: '',
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
        this.shopForm.published = this.shopInfo.published ? this.shopInfo.published : false
        this.shopForm.name = this.shopInfo.name
        this.shopForm.desc = this.shopInfo.desc
        this.shopForm.avatar = this.shopInfo.avatar
        console.log(this.shopForm)
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
