<template>
  <el-dialog
    custom-class="nodeDialog"
    v-model="dialogVisible"
    :title="$t('export.title')"
    width="700px"
    v-loading.fullscreen.lock="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div>
      <div class="nameInputBox">
        <span class="name">{{ $t('export.filename') }}</span>
        <el-input style="width: 300px" v-model="fileName" size="small"></el-input>
        <el-checkbox v-show="['smm', 'json'].includes(exportType)" v-model="widthConfig" style="margin-left: 12px">
          {{ $t('export.include') }}
        </el-checkbox>
        <el-checkbox v-show="['svg'].includes(exportType)" v-model="domToImage" style="margin-left: 12px">
          {{ $t('export.domToImage') }}
        </el-checkbox>
      </div>
      <div class="downloadTypeList">
        <div
          class="downloadTypeItem"
          v-for="item in downTypeList2"
          :key="item.type"
          :class="{ active: exportType === item.type }"
          @click="exportType = item.type"
        >
          <div class="icon iconfont" :class="[item.icon, item.type]"></div>
          <div class="info">
            <div class="name">{{ item.name }}</div>
            <div class="desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
      <div class="tip">{{ $t('export.tips') }}</div>
      <div class="tip warning" v-if="openNodeRichText && ['png', 'pdf'].includes(exportType)">{{ $t('export.pngTips') }}</div>
      <div class="tip warning" v-if="openNodeRichText && exportType === 'svg' && domToImage">{{ $t('export.svgTips') }}</div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">{{ $t('dialog.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('dialog.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * @Author: 黄原寅
 * @Desc: 导出功能
 */
import { onMounted, ref, computed } from 'vue'
import bus from '@/utils/bus.js'
import { ElNotification } from 'element-plus'
import { mapState, useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { downTypeList } from '@/config'

const store = useStore()
const { t } = useI18n()
const dialogVisible = ref(false)
const exportType = ref('smm')
const fileName = ref('思维导图')
const widthConfig = ref(true)
const domToImage = ref(false)
const loading = ref(false)
const loadingText = ref('')

const openNodeRichText = computed(() => store.state.localConfig.openNodeRichText)
const downTypeList2 = computed(() => downTypeList[t.locale] || downTypeList.zh)

onMounted(() => {
  bus.on('showExport', () => {
    dialogVisible.value = true
  })
  bus.on('transforming-dom-to-images', (index, len) => {
    loading.value = true
    loadingText.value = `${t('export.transformingDomToImages')}${index + 1}/${len}`
    if (index >= len - 1) {
      loading.value = false
    }
  })
})

/**
 * @Author: 黄原寅
 * @Desc: 取消导出
 */
const cancel = () => {
  dialogVisible.value = false
}

/**
 * @Author: 黄原寅
 * @Desc:  确定导出
 */
const confirm = () => {
  bus.emit('export', [exportType.value, true, fileName.value, widthConfig.value]) // mitt只支持传入一个参数
  if (exportType.value === 'svg') {
    bus.emit(
      'export',
      exportType.value,
      true,
      fileName.value,
      domToImage.value,
      `* {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }`
    )
  } else {
    bus.emit('export', exportType.value, true, fileName.value, widthConfig.value)
  }
  cancel()
  ElNotification({
    title: t('export.notifyTitle'),
    message: t('export.notifyMessage'),
    type: 'warning'
  })
}
</script>

<script>
export default {
  name: 'Export'
}
</script>

<style lang="less" scoped>
.nodeDialog {
  .nameInputBox {
    margin-bottom: 20px;

    .name {
      margin-right: 10px;
    }
  }

  .tip {
    margin-top: 10px;
    &.warning {
      color: #f56c6c;
    }
  }
  .downloadTypeList {
    display: flex;
    flex-wrap: wrap;
    .downloadTypeItem {
      width: 200px;
      height: 88px;
      padding: 22px;
      overflow: hidden;
      margin: 10px;
      border-radius: 11px;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.02);
      background-color: #fff;
      display: flex;
      align-items: center;
      cursor: pointer;
      border: 2px solid transparent;
      &.active {
        border-color: #409eff;
      }
      .icon {
        font-size: 30px;
        margin-right: 10px;
        &.png {
          color: #ffc038;
        }
        &.pdf {
          color: #ff6c4d;
        }
        &.md {
          color: #2b2b2b;
        }
        &.json {
          color: #12c87e;
        }
        &.svg {
          color: #4380ff;
        }
        &.smm {
          color: #409eff;
        }
      }
      .info {
        .name {
          color: #1a1a1a;
          font-size: 15px;
          margin-bottom: 5px;
        }
        .desc {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

<style lang="less">
.nodeDialog {
  .el-dialog__body {
    background-color: #f2f4f7 !important;
  }
}
</style>
