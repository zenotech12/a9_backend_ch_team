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
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </slot>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过{{sizeLimit/1024}}kb</div>
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
