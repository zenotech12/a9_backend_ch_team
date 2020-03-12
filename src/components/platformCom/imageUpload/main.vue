<template>
  <div>
    <el-upload class="upload-demo"
      :headers="fileUploadHeader"
      :action="fileUploadUrl" :drag="drag"
      name="image"
      :show-file-list="true"
      :on-success="imageUploadSuccess"
      :file-list="fileList"
      :before-upload="beforeImageUpload">
      <slot>
        <div class="el-upload__text">{{$t('tools.imgUploadTip1')}}<em>{{$t('tools.imgUploadTip2')}}</em>；{{$t('tools.imgUploadTip3')}}{{sizeLimit/1024}}kb</div>
      </slot>
      <div style="display: none" class="el-upload__tip" slot="tip">{{$t('tools.imgUploadTip3')}}{{sizeLimit/1024}}kb</div>
    </el-upload>
  </div>
</template>
<script>
  import store from '@/store'
  import { fileUploadUrl, imgGetUrl } from '@/utils/serverConfig'
  export default {
    name: 'imageUpload',
    data() {
      return {
        stringShow: false,
        imgPreUrl: imgGetUrl,
        fileUploadUrl: fileUploadUrl,
        fileUploadHeader: { 'X-Access-Token': store.state.user.token },
        fileList: []
      }
    },
    props: {
      sizeLimit: {
        type: Number,
        default: function() {
          return 1024 * 500
        }
      },
      drag: {
        type: Boolean,
        default() {
          return true
        }
      }
    },
    watch: {
    },
    methods: {
      beforeImageUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isPng = file.type === 'image/png'
        const isLimit = file.size < this.sizeLimit
        if (!isJPG && !isPng) {
          this.$message.error(this.$t('tools.imageFormatTip'))
        }
        if (!isLimit) {
          this.$message.error(this.$t('tools.imageSizeTip'))
        }
        return isLimit
      },
      imageUploadSuccess(res) {
        if (res.meta === 0) {
          this.fileList = []
          this.$emit('uploadSuccess', res)
          // this.$set(this.company_info[this.currentLanguage], 'logo', res.md5)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
