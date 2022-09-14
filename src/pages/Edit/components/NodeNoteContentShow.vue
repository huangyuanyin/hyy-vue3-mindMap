<template>
  <div class="noteContentViewer" ref="noteContentViewer"
    :style="{ left: this.left + 'px', top: this.top + 'px', visibility: show ? 'visible' : 'hidden' }"></div>
</template>

<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import bus from "@/utils/bus.js"
/**
 * @Author: 黄原寅
 * @Desc: 节点备注内容显示
 */
export default {
  name: "NodeNoteContentShow",
  data() {
    return {
      editor: null,
      show: false,
      left: 0,
      top: 0,
    };
  },
  created() {
    bus.on("showNoteContent", ([content, left, top]) => { // mitt只支持传入一个参数
      this.editor.setMarkdown(content);
      this.left = left;
      this.top = top;
      this.show = true;
    });
    bus.on("hideNoteContent", () => {
      this.show = false;
    });
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    /**
     * @Author: 黄原寅
     * @Desc: 初始化编辑器
     */
    initEditor() {
      if (!this.editor) {
        this.editor = new Viewer({
          el: this.$refs.noteContentViewer
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.noteContentViewer {
  position: fixed;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
}
</style>
