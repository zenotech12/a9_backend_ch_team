<template>
    <div>
       <el-upload :headers="fileUploadHeader"  name="image"
                   :action="fileUploadUrl"
                   :show-file-list="false"
                   :on-success="handleUploadSuccess"
                   :before-upload="beforeCertificateUpload">
         <div v-if="imageUrl" class="imgBox">
           <img :src="imageUrl" class="avatar" height="150px">
         </div>
         <img v-else-if="showImage" :src="showImage" width="60px" height="60px">
         <i v-else class="el-icon-plus avatar-uploader-icon" height="60px"></i>
        </el-upload>
      <!--<i class="el-icon-circle-close delBtn" @click="delImg"></i>-->
        <span class="fontColor" v-if="promptInfo">{{promptInfo}}</span>
    </div>
</template>
<script>
  import store from '@/store'
  // import service from '@/utils/request'
  import { fileUploadUrl, imgGetUrl } from '@/utils/serverConfig'
  export default {
    name: 'SingleFileUpload',
    data() {
      return {
        fileUploadUrl: fileUploadUrl,
        fileUploadHeader: { 'X-Access-Token': store.state.user.token },
        waitingImage: require('../../../assets/images/fileUpload.gif'),
        showImage: '',
        imgUrl: imgGetUrl + '/?md5='
      }
    },
    model: {
      prop: 'imageMd5',
      event: 'uploadImage'
    },
    props: {
      imageSize: {
        type: Number,
        default: function() {
          return 1
        }
      },
      imageMd5: {
        type: String,
        default: function() {
          return ''
        }
      },
      promptInfo1: {
        type: String,
        default: function() {
          return ''
        }
      }
    },
    computed: {
      imageUrl: function() {
        // console.log('imgmd5', this.imageMd5)
        if (this.imageMd5 !== '') {
          return this.getImageUrl(this.imageMd5)
        } else {
          this.showImage = ''
          return ''
        }
      },
      promptInfo: function() {
        if (this.promptInfo1 !== '') {
          return this.promptInfo1
        } else {
          return ''
        }
      }
    },
    methods: {
      // delImg() {
      //   console.log(1)
      // },
      handleUploadSuccess(res) {
        if (res.meta === 0) {
          // this.imageMd5 = res.md5
          console.log('res', res)
          this.$emit('uploadImage', res.md5)
          this.$emit('checkImgUpload')
          // this.showImage = this.imageUrl
          // console.log(this.showImage)
        } else {
          this.$message.error(res.error)
        }
      },
      beforeCertificateUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isPng = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < this.imageSize
        if (!isJPG && !isPng) {
          this.$message.error(this.$t('tools.uploadImgFormat'))
        }
        if (!isLt2M) {
          this.$message.error(this.$t('tools.uploadImgNoMoreThan') + this.imageSize * 1000 + ' KB!')
        }
        if ((isJPG || isPng) && isLt2M) {
          this.showImage = this.waitingImage
        } else {
          this.showImage = ''
        }
        return (isJPG || isPng) && isLt2M
      }
    }
}

</script>

<style lang="scss">
  .fontColor{
    color: red;
  }
  .avatar {
    max-height: 150px;
    max-width: 400px;
  }
  .imgBox {
    position: relative;
  }
  .delBtn {
    font-size: 20px;
    position: absolute;
    top: -10px;
    right: -10px;
  }
</style>
