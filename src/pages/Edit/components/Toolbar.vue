<template>
  <div class="toolbarContainer">
    <div class="toolbar">
      <!-- 节点操作 -->
      <div class="toolbarBlock">
        <div class="toolbarBtn" :class="{
          disabled: readonly || backEnd,
        }" @click="emit('execCommand', 'BACK')">
          <span class="icon iconfont iconhoutui-shi"></span>
          <span class="text">回退</span>
        </div>
        <div class="toolbarBtn" :class="{
          disabled: readonly || forwardEnd,
        }" @click="emit('execCommand', 'FORWARD')">
          <span class="icon iconfont iconqianjin1"></span>
          <span class="text">前进</span>
        </div>
        <div class="toolbarBtn" :class="{
          disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization,
        }" @click="emit('execCommand', 'INSERT_NODE')">
          <span class="icon iconfont iconjiedian"></span>
          <span class="text">插入同级节点</span>
        </div>
        <div class="toolbarBtn" :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization,
        }" @click="emit('execCommand', 'INSERT_CHILD_NODE')">
          <span class="icon iconfont icontianjiazijiedian"></span>
          <span class="text">插入子节点</span>
        </div>
        <div class="toolbarBtn" :class="{
          disabled: activeNodes.length <= 0,
        }" @click="emit('execCommand', 'REMOVE_NODE')">
          <span class="icon iconfont iconshanchu"></span>
          <span class="text">删除节点</span>
        </div>
        <div class="toolbarBtn" :class="{
          disabled: activeNodes.length <= 0,
        }" @click="emit('showNodeImage')">
          <span class="icon iconfont iconimage"></span>
          <span class="text">图片</span>
        </div>
        <div class="toolbarBtn" :class="{
          disabled: activeNodes.length <= 0,
        }" @click="emit('showNodeIcon')">
          <span class="icon iconfont iconxiaolian"></span>
          <span class="text">图标</span>
        </div>
        <div class="toolbarBtn" :class="{
          disabled: activeNodes.length <= 0,
        }" @click="emit('showNodeLink')">
          <span class="icon iconfont iconchaolianjie"></span>
          <span class="text">超链接</span>
        </div>
        <div class="toolbarBtn" :class="{
          disabled: activeNodes.length <= 0,
        }" @click="emit('showNodeNote')">
          <span class="icon iconfont iconflow-Mark"></span>
          <span class="text">备注</span>
        </div>
        <div class="toolbarBtn" :class="{
          disabled: activeNodes.length <= 0,
        }" @click="emit('showNodeTag')">
          <span class="icon iconfont iconbiaoqian"></span>
          <span class="text">标签</span>
        </div>
        <div class="toolbarBtn" :class="{
          disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization,
        }" @click="emit('execCommand', 'ADD_GENERALIZATION')">
          <span class="icon iconfont icongaikuozonglan"></span>
          <span class="text">概要</span>
        </div>
      </div>
      <!-- 通用操作 -->
      <div class="toolbarBlock">
        <div class="toolbarBtn" @click="emit('showOutline')">
          <span class="icon iconfont iconfuhao-dagangshu"></span>
          <span class="text">显示大纲</span>
        </div>
        <div class="toolbarBtn" @click="emit('showBaseStyle')">
          <span class="icon iconfont iconyangshi"></span>
          <span class="text">基础样式</span>
        </div>
        <div class="toolbarBtn" @click="emit('showTheme')">
          <span class="icon iconfont iconjingzi"></span>
          <span class="text">主题</span>
        </div>
        <div class="toolbarBtn" @click="emit('showStructure')">
          <span class="icon iconfont iconjiegou"></span>
          <span class="text">结构</span>
        </div>
      </div>
      <!-- 导出 -->
      <div class="toolbarBlock">
        <div class="toolbarBtn" @click="createNewLocalFile">
          <span class="icon iconfont iconxinjian"></span>
          <span class="text">新建</span>
        </div>
        <div class="toolbarBtn" @click="openLocalFile">
          <span class="icon iconfont icondakai"></span>
          <span class="text">打开</span>
        </div>
        <div class="toolbarBtn" @click="saveLocalFile">
          <span class="icon iconfont iconlingcunwei"></span>
          <span class="text">另存为</span>
        </div>
        <div class="toolbarBtn" @click="emit('showImport')">
          <span class="icon iconfont icondaoru"></span>
          <span class="text">导入</span>
        </div>
        <div class="toolbarBtn" @click="emit('showExport')">
          <span class="icon iconfont iconexport"></span>
          <span class="text">导出</span>
        </div>
        <div class="toolbarBtn" @click="emit('showShortcutKey')">
          <span class="icon iconfont iconjianpan"></span>
          <span class="text">快捷键</span>
        </div>
      </div>
    </div>
    <NodeImage></NodeImage>
    <NodeHyperlink></NodeHyperlink>
    <NodeIcon></NodeIcon>
    <NodeNote></NodeNote>
    <NodeTag></NodeTag>
    <Export></Export>
    <Import></Import>
  </div>
</template>

<script>
import NodeImage from "./NodeImage";
import NodeHyperlink from "./NodeHyperlink";
import NodeIcon from "./NodeIcon";
import NodeNote from "./NodeNote";
import NodeTag from "./NodeTag";
import Export from "./Export";
import Import from './Import';
import { mapState } from 'vuex';
import { ElNotification } from 'element-plus'
import exampleData from 'simple-mind-map/example/exampleData';
import { getData } from '../../../api';
import bus from "@/utils/bus.js"

/**
 * @Author: 黄原寅
 * @Desc: 工具栏
 */
let fileHandle = null;
export default {
  name: "Toolbar",
  components: {
    NodeImage,
    NodeHyperlink,
    NodeIcon,
    NodeNote,
    NodeTag,
    Export,
    Import
  },
  data() {
    return {
      activeNodes: [],
      backEnd: false,
      forwardEnd: true,
      readonly: false,
      isFullDataFile: false,
      timer: null,
    };
  },
  computed: {
    ...mapState(['isHandleLocalFile']),
    hasRoot() {
      return this.activeNodes.findIndex((node) => {
        return node.isRoot;
      });
    },
    hasGeneralization() {
      return this.activeNodes.findIndex((node) => {
        return node.isGeneralization;
      }) !== -1;
    }
  },
  watch: {
    isHandleLocalFile(val) {
      if (!val) {
        ElNotification.closeAll();
      }
    }
  },
  created() {
    bus.on("mode_change", (mode) => {
      this.readonly = mode === 'readonly'
    });
    bus.on("node_active", (args) => {
      this.activeNodes = args[1];
    });
    bus.on("back_forward", (index, len) => {
      this.backEnd = index <= 0
      this.forwardEnd = index >= len - 1
    });
    bus.on("write_local_file", (content) => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.writeLocalFile(content);
      }, 1000);
    });
  },
  methods: {
    /** 
     * @Author: 黄原寅
     * @Desc: 打开本地文件 
     */
    async openLocalFile() {
      try {
        let [_fileHandle] = await window.showOpenFilePicker({
          types: [
            {
              description: '',
              accept: {
                'application/json': ['.smm']
              }
            },
          ],
          excludeAcceptAllOption: true,
          multiple: false
        });
        if (!_fileHandle) {
          return;
        }
        fileHandle = _fileHandle;
        if (fileHandle.kind === 'directory') {
          this.$message.warning('请选择文件');
          return;
        }
        this.readFile();
      } catch (error) {
        console.log("error", error);
        if (error.toString().includes('aborted')) {
          return
        }
        this.$message({
          type: 'warning',
          message: '你的浏览器可能不支持，建议使用最新版本的Chrome浏览器',
          duration: 1000,
        })
      }
    },

    /** 
     * @Author: 黄原寅
     * @Desc: 读取本地文件 
     */
    async readFile() {
      let file = await fileHandle.getFile();
      let fileReader = new FileReader();
      fileReader.onload = async () => {
        this.$store.commit('setIsHandleLocalFile', true);
        this.setData(fileReader.result);
        ElNotification.closeAll();
        ElNotification({
          title: '提示',
          message: `当前正在编辑你本机的【${file.name}】文件`,
          duration: 0,
          showClose: false
        });
      }
      fileReader.readAsText(file);
    },

    /** 
     * @Author: 黄原寅 
     * @Desc: 渲染读取的数据 
     */
    setData(str) {
      try {
        let data = JSON.parse(str);
        if (typeof data !== 'object') {
          throw new Error('文件内容有误');
        }
        if (data.root) {
          this.isFullDataFile = true;
        } else {
          this.isFullDataFile = false;
          data = {
            ...exampleData,
            root: data
          }
        }
        bus.emit('setData', data);
      } catch (error) {
        console.log(error)
        this.$message.error("文件打开失败");
      }
    },

    /** 
     * @Author: 黄原寅
     * @Desc: 写入本地文件 
     */
    async writeLocalFile(content) {
      if (!fileHandle || !this.isHandleLocalFile) {
        return;
      }
      if (!this.isFullDataFile) {
        content = content.root;
      }
      let string = JSON.stringify(content);
      const writable = await fileHandle.createWritable();
      await writable.write(string);
      await writable.close();
    },

    /** 
     * @Author: 黄原寅
     * @Desc: 创建本地文件 
     */
    async createNewLocalFile() {
      await this.createLocalFile(exampleData);
    },

    /** 
     * @Author: 黄原寅
     * @Desc: 另存为 
     */
    async saveLocalFile() {
      let data = getData();
      await this.createLocalFile(data);
    },

    /** 
     * @Author: 黄原寅
     * @Desc: 创建本地文件 
     */
    async createLocalFile(content) {
      try {
        let _fileHandle = await window.showSaveFilePicker({
          types: [{
            description: '',
            accept: { 'application/json': ['.smm'] },
          }],
        });
        if (!_fileHandle) {
          return;
        }
        const loading = this.$loading({
          lock: true,
          text: '正在创建文件',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        fileHandle = _fileHandle;
        this.$store.commit('setIsHandleLocalFile', true);
        this.isFullDataFile = true;
        await this.writeLocalFile(content);
        await this.readFile();
        loading.close();
      } catch (error) {
        console.log(error);
        if (error.toString().includes('aborted')) {
          return
        }
        this.$message.warning('你的浏览器可能不支持，建议使用最新版本的Chrome浏览器');
      }
    },
    emit: (...agrs) => bus.emit(...agrs)
  }
};
</script>

<style lang="less" scoped>
.toolbarContainer {
  .toolbar {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    padding: 0 20px;
    padding-top: 20px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(26, 26, 26, 0.8);
    z-index: 2;

    .toolbarBlock {
      display: flex;
      background-color: #fff;
      padding: 10px 20px;
      border-radius: 6px;
      box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.06);
      margin-right: 20px;

      &:last-of-type {
        margin-right: 0;
      }
    }

    .toolbarBtn {
      display: flex;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      margin-right: 20px;

      &:last-of-type {
        margin-right: 0;
      }

      &:hover {
        &:not(.disabled) {
          .icon {
            background: #f5f5f5;
          }
        }
      }

      &.disabled {
        color: #bcbcbc;
        cursor: not-allowed;
        pointer-events: none;
      }

      .icon {
        display: flex;
        height: 26px;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        padding: 0 5px;
      }

      .text {
        margin-top: 3px;
      }
    }
  }
}
</style>
