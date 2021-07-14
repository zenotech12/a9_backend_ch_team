<template>
  <div>
    <div style="line-height: 20px;">
      <quill-editor ref="myeditor"
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
      <el-dialog :title="$t('tools.linkSet')" append-to-body  :visible.sync="editorLinkFormVisible" width="400px">
        <el-form :model="linkForm" >
          <el-form-item :label="$t('tools.linkType')" prop="name"  :label-width="linkformLabelWidth" style="margin-bottom: 22px">
            <el-select v-model="linkForm.type" >
              <el-option v-for="item in linkType" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('tools.linkType1')" v-if="linkForm.type === '1'" :label-width="linkformLabelWidth" >
            <goods-selector style="width: 220px"  v-model="linkForm.value"></goods-selector>
          </el-form-item>
          <el-form-item :label="$t('tools.linkType2')" v-if="linkForm.type === '2'" :label-width="linkformLabelWidth">
            <articles-selector style="width: 220px"  v-model="linkForm.value"></articles-selector>
          </el-form-item>
          <el-form-item :label="$t('tools.linkType3')" v-if="linkForm.type === '3'" :label-width="linkformLabelWidth">
            <el-input v-model="linkForm.value" type="text" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="submitLinkSet">{{$t('tools.confirm')}}</el-button>
          <el-button @click="editorLinkFormVisible = false" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('tools.imageUpload')" :visible.sync="imagesFormVisible" append-to-body width="515px">
        <div class="prop-image__preview">
          <draggable v-model="formImagesLists"  :options = "{animation:500}">
            <div class="pitem"  v-for="(img,imgk) in formImagesLists" :key="imgk">
              <el-image
                style="height: 100px; width: 100px" fit="contain"
                :src="getImageUrl(img)"
                :preview-src-list="previewImages">
              </el-image>
              <i class="el-icon-delete delbtn" @click="delImage(imgk)"></i>
            </div>
          </draggable>
        </div>
        <image-upload :multiple="true"  @multiSuccess="fileMultiUploadSuccess"></image-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="submitImages">{{$t('tools.confirm')}}</el-button>
          <el-button @click="imagesCancel" size="small" style="margin-right: 24px;margin-left: 10px;">{{$t('tools.cancel')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'
  import { Quill } from 'vue-quill-editor'
  // import service from '@/utils/request'
  import store from '@/store'
  // import serverConfig from '@/utils/serverConfig'
  import { fileUploadUrl } from '@/utils/serverConfig'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import goodsSelector from '@/components/goodsSelector'
  import draggable from 'vuedraggable'

  import Video from '../../utils/video'
  Quill.register(Video, true)
  export default {
    name: 'LLEditor',
    components: {
      quillEditor,
      goodsSelector,
      draggable
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
          return 1
        }
      },
      promptInfo: {
        type: String,
        default: function() {
          return this.$t('tools.imageFormatTip1')
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
          label: this.$t('tools.linkType1')
        }],
        linkformLabelWidth: '120px',
        linkForm: { type: '1', value: '' },
        editorConfig: {},
        fileUploadUrl: fileUploadUrl,
        videoUploadUrl: fileUploadUrl,
        // videoUploadUrl: serverConfig.api_url + '/big-file/upload',
        fileUploadHeader: { 'X-Access-Token': store.state.user.token },
        fullscreenLoading: false,
        imageInsertIndex: 0
      }
    },
    mounted() {
      if (this.showQuill === true) {
        this.$refs['myeditor'].quill.getModule('toolbar').addHandler('image', this.editerImgFunc)
        this.$refs['myeditor'].quill.getModule('toolbar').addHandler('video', this.editerVideoFunc)
        this.$refs['myeditor'].quill.getModule('toolbar').addHandler('link', this.editerLinkFunc)
        window.addEventListener('scroll', this.getScrollPosition, false)
      }
    },
    computed: {
      previewImages() {
        const result = []
        this.formImagesLists && this.formImagesLists.forEach(img => {
          result.push(this.getImageUrl(img))
        })
        return result
      }
    },
    methods: {
      getScrollPosition() {
        const toolbar = document.getElementsByClassName('ql-toolbar')[0]
        const editor = document.getElementsByClassName('quill-editor')[0]
        const top = editor.getBoundingClientRect().top
        if (top < 0 && Math.abs(top) < editor.offsetHeight - 150) {
          toolbar.style.position = 'fixed'
          toolbar.style.top = '0px'
          toolbar.style.width = editor.offsetWidth + 'px'
          toolbar.style.zIndex = '999'
          toolbar.style.backgroundColor = '#ffffff'
        } else {
          toolbar.style.position = ''
        }
        console.log()
      },
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
              this.$message.error(this.$t('tools.qullEditorTip1'))
            } else {
              this.linkForm = { type: '1', value: '' }
              this.editorLinkFormVisible = true
            }
          } else {
            this.$message.error(this.$t('tools.qullEditorTip1'))
          }
        } else {
          quill.format('link', false)
        }
      },
      editerVideoFunc(state) {
        const quill = this.$refs['myeditor'].quill
        if (state) {
          const fileInput = document.getElementById('editorVideoUploadBtn')
          fileInput.click() // 加一个触发事件
        } else {
          quill.format('video', false)
        }
      },
      editerImgFunc(state) {
        if (state) {
          // const fileInput = document.getElementById('editorImgUploadBtn')
          // fileInput.click() // 加一个触发事件
          this.imagesFormVisible = true
          this.addRange = this.$refs['myeditor'].quill.getSelection()
          this.imageInsertIndex = this.addRange !== null ? this.addRange.index : 0
        }
      },
      handleRemove(file, fileList) {
        console.log(file)
        // this.setImages(fileList)
        this.formImagesLists.splice(this.formImagesLists.findIndex(item => {
          return item === file.response.md5
        }))
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      fileMultiUploadSuccess(files) {
        this.formImagesLists = this.formImagesLists.concat(files)
      },
      delImage(k) {
        this.formImagesLists.splice(k, 1)
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
            this.$refs['myeditor'].quill.insertEmbed(this.imageInsertIndex, 'image', imgUrl)
            this.imageInsertIndex++
          })
          this.formImagesLists = []
          this.images = []
          this.imagesFormVisible = false
        } else {
          this.$message.error(this.$t('tools.imageTip1'))
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
          this.$message.error(this.$t('tools.imageFormatTip'))
        }
        if (!isLt2M) {
          this.$message.error(this.$t('tools.imageFormatTip2') + this.imageSize * 1000 + ' KB!')
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
          this.$message.error(this.$t('tools.qullEditorTip2'))
        }
        if (!isLt20M) {
          this.$message.error(this.$t('tools.qullEditorTip3'))
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
    /*height: 340px;*/
  }
  .ql-editor{
    min-height: 300px;
    img{
      display: block;
      margin: 0 auto;
      max-width: 640px !important;
    }
  }
  .fontColor{
    color: red;
  }
  .prop-image__preview{
    .pitem{
      display: inline-block;
      position: relative;
      margin-right: 5px;
      .delbtn{
        cursor: pointer;
        position: absolute;
        top: 0px;
        right: 0px;
      }
    }
  }
</style>
