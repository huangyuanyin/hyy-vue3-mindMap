<template>
  <div class="imgUploadContainer">
    <div class="imgUploadPanel">
      <div class="upBtn" v-if="!value">
        <label for="imgUploadInput" class="imgUploadInputArea" @dragenter.stop.prevent @dragover.stop.prevent @drop.stop.prevent="onDrop"
          >点击此处选择图片、或拖动图片到此</label
        >
        <input type="file" accept="image/*" id="imgUploadInput" @change="onImgUploadInputChange" />
      </div>
      <div v-if="value" class="uploadInfoBox">
        <div class="previewBox" :style="{ backgroundImage: `url('${value}')` }"></div>
        <el-icon class="delBtn" @click="deleteImg">
          <Close />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { Close } from '@element-plus/icons-vue'
export default {
  components: {
    Close
  },
  name: 'ImgUpload',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      file: null
    }
  },
  methods: {
    /**
     * @Author: 黄原寅
     * @Desc: 图片选择事件
     */
    onImgUploadInputChange(e) {
      console.log('e', e)
      let file = e.target.files[0]
      this.selectImg(file)
    },

    /**
     * @Author: 黄原寅
     * @Desc: 拖动上传图片
     */
    onDrop(e) {
      let dt = e.dataTransfer
      let file = dt.files && dt.files[0]
      this.selectImg(file)
    },

    /**
     * @Author: 黄原寅
     * @Desc: 选择图片
     */
    selectImg(file) {
      this.file = file
      let fr = new FileReader()
      fr.readAsDataURL(file)
      fr.onload = e => {
        this.$emit('changeImg', e.target.result)
      }
    },

    /**
     * @Author: 黄原寅
     * @Desc: 获取图片大小
     */
    getSize() {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = this.value
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height
          })
        }
        img.onerror = e => {
          resolve({
            width: 0,
            height: 0
          })
        }
      })
    },

    /**
     * @Author: 黄原寅
     * @Desc: 删除图片
     */
    deleteImg() {
      this.$emit('changeImg', '')
      this.file = null
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>
