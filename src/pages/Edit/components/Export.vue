<template>
  <el-dialog custom-class="nodeDialog" v-model="dialogVisible" title="导出">
    <div>
      <div class="nameInputBox">
        <span class="name">导出文件名称</span>
        <el-input style="width: 300px" v-model="fileName" size="small"></el-input>
      </div>
      <el-radio-group v-model="exportType">
        <el-radio label="smm">专有文件（.smm）</el-radio>
        <el-radio label="json">json文件（.json）</el-radio>
        <el-radio label="png">图片文件（.png）</el-radio>
        <el-radio label="svg">svg文件（.svg）</el-radio>
        <el-radio label="pdf">pdf文件（.pdf）</el-radio>
      </el-radio-group>
      <div class="tip">tips：.smm文件可用于导入</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
/**
* @Author: 黄原寅
* @Desc: 导出功能
*/
import { onMounted, ref } from 'vue'
import bus from "@/utils/bus.js"
import { ElNotification } from 'element-plus'

const dialogVisible = ref(false)
const exportType = ref("smm")
const fileName = ref("思维导图")

onMounted(() => {
  bus.on("showExport", () => {
    dialogVisible.value = true;
  });
})

/**
 * @Author: 黄原寅
 * @Desc: 取消导出
 */
const cancel = () => {
  dialogVisible.value = false;
}

/**
 * @Author: 黄原寅
 * @Desc:  确定导出
 */
const confirm = () => {
  bus.emit("export", exportType.value, true, fileName.value);
  cancel();
  ElNotification({
    title: '消息',
    message: '如果没有触发下载，请检查是否被浏览器拦截了',
    type: 'warning',
  })
}
</script>

<script>
export default {
  name: "Export",
};
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