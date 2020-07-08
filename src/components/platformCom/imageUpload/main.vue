<template>
  <div>
    <el-upload class="upload-demo"
      :headers="fileUploadHeader"
      :action="fileUploadUrl" :drag="drag"
      name="image"
       :multiple="multiple"
      :show-file-list="true"
      :on-success="imageUploadSuccess"
      :file-list="fileList"
      :before-upload="beforeImageUpload">
      <slot>
        <div class="el-upload__text">{{$t('tools.imgUploadTip1')}}<em>{{$t('tools.imgUploadTip2')}}</em>；{{$t('tools.imgUploadTip3')}}{{sizeLimit/1024/1024}}M</div>
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
        fileList: [],
        successNum: 0
      }
    },
    props: {
      sizeLimit: {
        type: Number,
        default: function() {
          return 1024 * 1024
        }
      },
      multiple: {
        type: Boolean,
        default() {
          return false
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
      imageUploadSuccess(res, f, fileList) {
        if (res.meta === 0) {
          this.successNum++
          this.$emit('uploadSuccess', res, f, fileList)
          if (this.successNum >= fileList.length) {
            fileList.sort(function(a, b) {
              if (a.name < b.name) {
                return -1
              } else if (a.name > b.name) {
                return 1
              } else {
                return 0
              }
            })
            const tempList = []
            fileList.forEach(fl => {
              tempList.push(fl.response.md5)
            })
            this.fileList = []
            this.successNum = 0
            this.$emit('multiSuccess', tempList)
          }
          // this.$set(this.company_info[this.currentLanguage], 'logo', res.md5)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
