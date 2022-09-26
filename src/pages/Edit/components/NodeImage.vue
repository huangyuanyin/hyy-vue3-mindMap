<template>
  <el-dialog custom-class="nodeDialog" v-model="dialogVisible" title="图片">
    <ImgUpload ref="imgUpload"  @changeImg="onchange" :value="img"></ImgUpload>
    <div class="imgTitleBox">
      <span class="title">图片标题</span>
      <el-input v-model="imgTitle" size="small"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/**
* @Author: 黄原寅
* @Desc: 节点图片内容设置
*/
import { onMounted, ref } from 'vue'
import ImgUpload from "@/components/ImgUpload"
import bus from "@/utils/bus.js"

const dialogVisible = ref(false)
const img = ref('')
const imgTitle = ref('')
const activeNodes = ref(null)
const imgUpload = ref(null)

onMounted(() => {
  bus.on("node_active", (args) => {
    activeNodes.value = args[1];
    if (activeNodes.value.length > 0) {
      let firstNode = activeNodes.value[0];
      img.value = firstNode.getData("image");
      imgTitle.value = firstNode.getData("imageTitle");
    } else {
      img.value = "";
      imgTitle.value = "";
    }
  });
  bus.on("showNodeImage", () => {
    dialogVisible.value = true;
  });
})

const onchange = (src) => {
  img.value = src;
}

/**
 * @Author: 黄原寅
 * @Desc: 取消
 */
const cancel = () => {
  dialogVisible.value = false;
  img.value = ""
}

/**
 * @Author: 黄原寅
 * @Desc:  确定
 */
const confirm = async () => {
  try {
    let { width, height } = await imgUpload.value.getSize();
    activeNodes.value.forEach((node) => {
      node.setImage({
        url: img.value || "none",
        title: imgTitle.value,
        width,
        height,
      });
    });
    cancel();
  } catch (error) {
    console.log(error);
  }
}
</script>

<script>
export default {
  name: "NodeImage",
};
</script>

<style lang="less" scoped>
.nodeDialog {
  .imgTitleBox {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .title {
      width: 100px;
    }
  }
}
</style>