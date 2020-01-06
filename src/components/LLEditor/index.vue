<template>
  <div>
    <div style="line-height: 20px;">
      <quill-editor ref="myeditor" height="500px"
                    :content="content"
                    :options="editorConfig"
                    @change="onEditorChange($event)"
                    @ready="onEditorReady($event)"></quill-editor>
      <el-upload ref="videoUploader" name="image"
                 :headers="fileUploadHeader"
                 :action="videoUploadUrl"
                 style="display:none"
                 :before-upload="beforeCertificateVideoUpload"
                 :on-success="videoUploadFunc">
        <el-button size="small" type="primary" id="editorVideoUploadBtn" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="插入中,请稍候">点击上传</el-button>
      </el-upload>
      <el-dialog title="链接设置" append-to-body  :visible.sync="editorLinkFormVisible" width="400px">
        <el-form :model="linkForm" >
          <el-form-item label="类型" prop="name"  :label-width="linkformLabelWidth" style="margin-bottom: 22px">
            <el-select v-model="linkForm.type" placeholder="请选择链接类型" >
              <el-option v-for="item in linkType" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品" v-if="linkForm.type === '1'" :label-width="linkformLabelWidth" >
            <goods-selector style="width: 220px"  v-model="linkForm.value"></goods-selector>
          </el-form-item>
          <el-form-item label="文章" v-if="linkForm.type === '2'" :label-width="linkformLabelWidth">
            <articles-selector style="width: 220px"  v-model="linkForm.value"></articles-selector>
          </el-form-item>
          <el-form-item label="地址" v-if="linkForm.type === '3'" :label-width="linkformLabelWidth">
            <el-input v-model="linkForm.value" type="text" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="submitLinkSet">确定</el-button>
          <el-button @click="editorLinkFormVisible = false" size="small" style="margin-right: 24px;margin-left: 10px;">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="图片上传" :visible.sync="imagesFormVisible" append-to-body width="515px">
        <el-upload name="image" :headers="fileUploadHeader"
                   :action="fileUploadUrl"
                   list-type="picture-card"
                   :file-list="images"
                   :on-success="fileUploadSuccess"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :before-upload="beforeCertificateUpload">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <span class="fontColor" v-if="promptInfo">{{promptInfo}}</span>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="submitImages">确定</el-button>
          <el-button @click="imagesCancel" size="small" style="margin-right: 24px;margin-left: 10px;">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'
  // import service from '@/utils/request'
  import store from '@/store'
  // import serverConfig from '@/utils/serverConfig'
  import { fileUploadUrl } from '@/utils/serverConfig'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import goodsSelector from '@/components/goodsSelector'
  export default {
    name: 'LLEditor',
    components: {
      quillEditor,
      goodsSelector
    },
    props: {
      content: {
        type: String,
        default: function() {
          return ''
        }
      },
      imageSize: {
        type: Number,
        default: function() {
          return 0.5
        }
      },
      promptInfo: {
        type: String,
        default: function() {
          return '上传图片只能是 JPG、Png 格式!上传图片大小不能超过500KB!'
        }
      },
      showQuill: {
        type: Boolean,
        default: function() {
          return true
        }
      }
    },
    data() {
      return {
        // showGoods: true,
        editorLinkFormVisible: false,
        imagesFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        images: [],
        formImagesLists: [],
        linkType: [{
          value: '1',
          label: '商品'
        }],
        linkformLabelWidth: '120px',
        linkForm: { type: '1', value: '' },
        editorConfig: {},
        fileUploadUrl: fileUploadUrl,
        videoUploadUrl: fileUploadUrl,
        // videoUploadUrl: serverConfig.api_url + '/big-file/upload',
        fileUploadHeader: { 'X-Access-Token': store.state.user.token },
        fullscreenLoading: false
      }
    },
    mounted() {
      if (this.showQuill === true) {
        this.$refs['myeditor'].quill.getModule('toolbar').addHandler('image', this.editerImgFunc)
        this.$refs['myeditor'].quill.getModule('toolbar').addHandler('video', this.editerVideoFunc)
        this.$refs['myeditor'].quill.getModule('toolbar').addHandler('link', this.editerLinkFunc)
      }
    },
    methods: {
      submitLinkSet() {
        const quill = this.$refs['myeditor'].quill
        let val = this.linkForm.value
        if (this.linkForm.type === '1') {
          val = 'https://a9app.idesum.com/goods/info?id=' + val
        } else if (this.linkForm.type === '2') {
          val = 'http://articleId/' + val
        }
        // console.log(val)
        quill.format('link', val)
        this.editorLinkFormVisible = false
      },
      editerLinkFunc(state) {
        const quill = this.$refs['myeditor'].quill
        if (state) {
          var range = quill.getSelection()
          if (range) {
            if (range.length === 0) {
              this.$message.error('请选择您要插入链接的对象')
            } else {
              this.linkForm = { type: '1', value: '' }
              this.editorLinkFormVisible = true
            }
          } else {
            this.$message.error('请选择您要插入链接的对象')
          }
        } else {
          quill.format('link', false)
        }
      },
      editerVideoFunc(state) {
        if (state) {
          const fileInput = document.getElementById('editorVideoUploadBtn')
          fileInput.click() // 加一个触发事件
        }
      },
      editerImgFunc(state) {
        if (state) {
          // const fileInput = document.getElementById('editorImgUploadBtn')
          // fileInput.click() // 加一个触发事件
          this.imagesFormVisible = true
        }
      },
      handleRemove(file, fileList) {
        this.setImages(fileList)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      fileUploadSuccess(response, file, fileList) {
        this.setImages(fileList)
      },
      setImages(fileList) {
        // console.log('fileList', fileList)
        var responseFileList = []
        fileList.forEach(file => {
          var response = file.response
          if (response) {
            if (response.meta === 0) {
              responseFileList.push(response.md5)
            }
          } else {
            responseFileList.push(file.md5)
          }
        })
        this.formImagesLists = responseFileList
      },
      submitImages() {
        if (this.formImagesLists.length !== 0) {
          this.formImagesLists.forEach(res => {
            const imgUrl = this.getImageUrl(res)
            this.addRange = this.$refs['myeditor'].quill.getSelection()
            this.$refs['myeditor'].quill.insertEmbed(this.addRange !== null ? this.addRange.index : 0, 'image', imgUrl)
          })
          this.formImagesLists = []
          this.images = []
          this.imagesFormVisible = false
        } else {
          this.$message.error('请选择图片!')
        }
      },
      imagesCancel() {
        this.images = []
        this.imagesFormVisible = false
      },
      // editorImgUploadSuccess(res) {
      //   console.log(res)
      //   if (res.meta === 0) {
      //     const imgUrl = serverConfig.img_url + res.md5
      //     this.addRange = this.$refs['myeditor'].quill.getSelection()
      //     this.$refs['myeditor'].quill.insertEmbed(this.addRange !== null ? this.addRange.index : 0, 'image', imgUrl)
      //   } else {
      //     this.$message.error(res.error)
      //   }
      // },
      onEditorReady() {
        const quill = this.$refs['myeditor'].quill
        quill.enable(this.showQuill)
        // console.log('showQuill', this.showQuill)
        // console.log('1111')
      },
      onEditorChange(val) {
        this.$emit('contentChange', val.html)
      },
      beforeCertificateUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isPng = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < this.imageSize
        if (!isJPG && !isPng) {
          this.$message.error('上传图片只能是 JPG、Png 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 ' + this.imageSize * 1000 + ' KB!')
        }
        return (isJPG || isPng) && isLt2M
      },
      // 视频上传成功
      videoUploadFunc(res) {
        if (res.meta === 0) {
          // console.log(res)
          const videoUrl = this.getImageUrl(res.md5)
          this.addRange = this.$refs['myeditor'].quill.getSelection()
          this.$refs['myeditor'].quill.insertEmbed(this.addRange !== null ? this.addRange.index : 0, 'video', videoUrl)
        } else {
          this.$message.error(res.error)
        }
      },
      // 视频上传之前
      beforeCertificateVideoUpload(file) {
        const isMp4 = file.type === 'video/mp4'
        const isLt20M = file.size / 1024 / 1024 < 20
        if (!isMp4) {
          this.$message.error('上传视频只能是 MP4 格式!')
        }
        if (!isLt20M) {
          this.$message.error('上传视频大小不能超过20MB!')
        }
        return isMp4 && isLt20M
      }
    }
  }
</script>

<style lang="scss">
  el-form-item{
    margin-bottom: 22px;
  }
  .ql-container{
    height: 340px;
  }
  .ql-editor{
    min-height: 300px;
  }
  .fontColor{
    color: red;
  }
</style>
