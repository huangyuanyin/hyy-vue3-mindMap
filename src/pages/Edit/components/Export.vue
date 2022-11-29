<template>
  <el-dialog custom-class="nodeDialog" v-model="dialogVisible" :title="$t('export.title')" width="900px">
    <div>
      <div class="nameInputBox">
        <span class="name">{{ $t('export.filename') }}</span>
        <el-input style="width: 300px" v-model="fileName" size="small"></el-input>
        <el-checkbox v-show="['smm', 'json'].includes(exportType)" v-model="widthConfig" style="margin-left: 12px">
          {{ $t('export.include') }}
        </el-checkbox>
      </div>
      <el-radio-group v-model="exportType" size="small">
        <el-radio-button label="smm">{{ $t('export.dedicatedFile') }}（.smm）</el-radio-button>
        <el-radio-button label="json">{{ $t('export.jsonFile') }}（.json）</el-radio-button>
        <el-radio-button label="png">{{ $t('export.imageFile') }}（.png）</el-radio-button>
        <el-radio-button label="svg">{{ $t('export.svgFile') }}（.svg）</el-radio-button>
        <el-radio-button label="pdf">{{ $t('export.pdfFile') }}（.pdf）</el-radio-button>
      </el-radio-group>
      <div class="tip">{{ $t('export.tips') }}</div>
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
import { onMounted, ref } from 'vue'
import bus from '@/utils/bus.js'
import { ElNotification } from 'element-plus'

const dialogVisible = ref(false)
const exportType = ref('smm')
const fileName = ref('思维导图')
const widthConfig = ref(true)

onMounted(() => {
  bus.on('showExport', () => {
    dialogVisible.value = true
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
  cancel()
  ElNotification({
    title: '消息',
    message: '如果没有触发下载，请检查是否被浏览器拦截了',
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
  }
}
</style>
