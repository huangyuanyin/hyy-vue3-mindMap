<template>
  <el-dialog custom-class="nodeDialog" v-model="dialogVisible" title="图片">
    <ImgUpload ref="ImgUpload" v-model="img" @changeImg="onchange" :value="img"></ImgUpload>
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

<script>
import ImgUpload from "@/components/ImgUpload";
import bus from "@/utils/bus.js"
/**
 * @Author: 黄原寅
 * @Desc: 节点图片内容设置
 */
export default {
  name: "NodeImage",
  components: {
    ImgUpload,
  },
  data() {
    return {
      dialogVisible: false,
      img: "",
      imgTitle: "",
      activeNodes: null,
    };
  },
  created() {
    bus.on("node_active", (args) => {
      this.activeNodes = args[1];
      if (this.activeNodes.length > 0) {
        let firstNode = this.activeNodes[0];
        this.img = firstNode.getData("image");
        this.imgTitle = firstNode.getData("imageTitle");
      } else {
        this.img = "";
        this.imgTitle = "";
      }
    });
    bus.on("showNodeImage", () => {
      this.dialogVisible = true;
    });
  },
  methods: {
    onchange(src) {
      this.img = src;
    },
    /**
     * @Author: 黄原寅
     * @Desc: 取消
     */
    cancel() {
      this.dialogVisible = false;
      this.img = ""
    },

    /**
     * @Author: 黄原寅
     * @Desc:  确定
     */
    async confirm() {
      try {
        let { width, height } = await this.$refs.ImgUpload.getSize();
        this.activeNodes.forEach((node) => {
          node.setImage({
            url: this.img || "none",
            title: this.imgTitle,
            width,
            height,
          });
        });
        this.cancel();
      } catch (error) {
        console.log(error);
      }
    },
  },
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