<template>
  <div class="toolbarContainer">
    <div class="toolbar">
      <!-- čçšćä˝ -->
      <div class="toolbarBlock">
        <div
          class="toolbarBtn"
          :class="{
            disabled: readonly || backEnd
          }"
          @click="emit('execCommand', 'BACK')"
        >
          <span class="icon iconfont iconhoutui-shi"></span>
          <span class="text">{{ $t('toolbar.undo') }}</span>
        </div>
        <div
          class="toolbarBtn"
          :class="{
            disabled: readonly || forwardEnd
          }"
          @click="emit('execCommand', 'FORWARD')"
        >
          <span class="icon iconfont iconqianjin1"></span>
          <span class="text">{{ $t('toolbar.redo') }}</span>
        </div>
        <div
          class="toolbarBtn"
          :class="{
            disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization
          }"
          @click="emit('execCommand', 'INSERT_NODE')"
        >
          <span class="icon iconfont iconjiedian"></span>
          <span class="text">{{ $t('toolbar.insertSiblingNode') }}</span>
        </div>
        <div
          class="toolbarBtn"
          :class="{
            disabled: activeNodes.length <= 0 || hasGeneralization
          }"
          @click="emit('execCommand', 'INSERT_CHILD_NODE')"
        >
          <span class="icon iconfont icontianjiazijiedian"></span>
          <span class="text">{{ $t('toolbar.insertChildNode') }}</span>
        </div>
        <div
          class="toolbarBtn"
          :class="{
            disabled: activeNodes.length <= 0
          }"
          @click="emit('execCommand', 'REMOVE_NODE')"
        >
          <span class="icon iconfont iconshanchu"></span>
          <span class="text">{{ $t('toolbar.deleteNode') }}</span>
        </div>
        <div
          class="toolbarBtn"
          :class="{
            disabled: activeNodes.length <= 0
          }"
          @click="emit('showNodeImage')"
        >
          <span class="icon iconfont iconimage"></span>
          <span class="text">{{ $t('toolbar.image') }}</span>
        </div>
        <div
          class="toolbarBtn"
          :class="{
            disabled: activeNodes.length <= 0
          }"
          @click="emit('showNodeIcon')"
        >
          <span class="icon iconfont iconxiaolian"></span>
          <span class="text">{{ $t('toolbar.icon') }}</span>
        </div>
        <div
          class="toolbarBtn"
          :class="{
            disabled: activeNodes.length <= 0
          }"
          @click="emit('showNodeLink')"
        >
          <span class="icon iconfont iconchaolianjie"></span>
          <span class="text">{{ $t('toolbar.link') }}</span>
        </div>
        <div
          class="toolbarBtn"
          :class="{
            disabled: activeNodes.length <= 0
          }"
          @click="emit('showNodeNote')"
        >
          <span class="icon iconfont iconflow-Mark"></span>
          <span class="text">{{ $t('toolbar.note') }}</span>
        </div>
        <div
          class="toolbarBtn"
          :class="{
            disabled: activeNodes.length <= 0
          }"
          @click="emit('showNodeTag')"
        >
          <span class="icon iconfont iconbiaoqian"></span>
          <span class="text">{{ $t('toolbar.tag') }}</span>
        </div>
        <div
          class="toolbarBtn"
          :class="{
            disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization
          }"
          @click="emit('execCommand', 'ADD_GENERALIZATION')"
        >
          <span class="icon iconfont icongaikuozonglan"></span>
          <span class="text">{{ $t('toolbar.summary') }}</span>
        </div>
      </div>
      <!-- éç¨ćä˝ -->
      <!-- <div class="toolbarBlock">
        <div class="toolbarBtn" @click="emit('showOutline')">
          <span class="icon iconfont iconfuhao-dagangshu"></span>
          <span class="text">{{ $t('toolbar.displayOutline') }}</span>
        </div>
        <div class="toolbarBtn" @click="emit('showBaseStyle')">
          <span class="icon iconfont iconyangshi"></span>
          <span class="text">{{ $t('toolbar.baseStyle') }}</span>
        </div>
        <div class="toolbarBtn" @click="emit('showTheme')">
          <span class="icon iconfont iconjingzi"></span>
          <span class="text">{{ $t('toolbar.theme') }}</span>
        </div>
        <div class="toolbarBtn" @click="emit('showStructure')">
          <span class="icon iconfont iconjiegou"></span>
          <span class="text">{{ $t('toolbar.strusture') }}</span>
        </div>
      </div> -->
      <!-- ĺŻźĺş -->
      <div class="toolbarBlock">
        <div class="toolbarBtn" @click="createNewLocalFile">
          <span class="icon iconfont iconxinjian"></span>
          <span class="text">{{ $t('toolbar.newFile') }}</span>
        </div>
        <div class="toolbarBtn" @click="openLocalFile">
          <span class="icon iconfont icondakai"></span>
          <span class="text">{{ $t('toolbar.openFile') }}</span>
        </div>
        <div class="toolbarBtn" @click="saveLocalFile">
          <span class="icon iconfont iconlingcunwei"></span>
          <span class="text">{{ $t('toolbar.saveAs') }}</span>
        </div>
        <div class="toolbarBtn" @click="emit('showImport')">
          <span class="icon iconfont icondaoru"></span>
          <span class="text">{{ $t('toolbar.import') }}</span>
        </div>
        <div class="toolbarBtn" @click="emit('showExport')">
          <span class="icon iconfont iconexport"></span>
          <span class="text">{{ $t('toolbar.export') }}</span>
        </div>
        <!-- <div class="toolbarBtn" @click="emit('showShortcutKey')">
          <span class="icon iconfont iconjianpan"></span>
          <span class="text">{{ $t('toolbar.shortcutKey') }}</span>
        </div> -->
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
import NodeImage from './NodeImage'
import NodeHyperlink from './NodeHyperlink'
import NodeIcon from './NodeIcon'
import NodeNote from './NodeNote'
import NodeTag from './NodeTag'
import Export from './Export'
import Import from './Import'
import { mapState } from 'vuex'
import { ElNotification } from 'element-plus'
import exampleData from 'simple-mind-map/example/exampleData'
import { getData } from '../../../api'
import bus from '@/utils/bus.js'

/**
 * @Author: éťĺĺŻ
 * @Desc: ĺˇĽĺˇć 
 */
let fileHandle = null
export default {
  name: 'Toolbar',
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
      timer: null
    }
  },
  computed: {
    ...mapState(['isHandleLocalFile']),
    hasRoot() {
      return this.activeNodes.findIndex(node => {
        return node.isRoot
      })
    },
    hasGeneralization() {
      return (
        this.activeNodes.findIndex(node => {
          return node.isGeneralization
        }) !== -1
      )
    }
  },
  watch: {
    isHandleLocalFile(val) {
      if (!val) {
        ElNotification.closeAll()
      }
    }
  },
  created() {
    bus.on('mode_change', this.onModeChange)
    bus.on('node_active', this.onNodeActive)
    bus.on('back_forward', this.onBackForward)
    bus.on('write_local_file', this.onWriteLocalFile)
  },
  beforeDestroy() {
    bus.off('mode_change', this.onModeChange)
    bus.off('node_active', this.onNodeActive)
    bus.off('back_forward', this.onBackForward)
    bus.off('write_local_file', this.onWriteLocalFile)
  },
  methods: {
    /**
     * @Author: éťĺĺŻ
     * @Desc: çĺŹć¨Ąĺźĺć˘
     */
    onModeChange(mode) {
      this.readonly = mode === 'readonly'
    },
    /**
     * @Author: éťĺĺŻ
     * @Desc: çĺŹčçšćżć´ť
     */
    onNodeActive(...args) {
      this.activeNodes = args[0][1]
    },
    /**
     * @Author: éťĺĺŻ
     * @Desc: çĺŹĺčżĺé
     */
    onBackForward(index, len) {
      this.backEnd = index <= 0
      this.forwardEnd = index >= len - 1
    },
    /**
     * @Author: éťĺĺŻ
     * @Desc: çĺŹćŹĺ°ćäťśčŻťĺ
     */
    onWriteLocalFile(content) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.writeLocalFile(content)
      }, 1000)
    },
    /**
     * @Author: éťĺĺŻ
     * @Desc: ćĺźćŹĺ°ćäťś
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
            }
          ],
          excludeAcceptAllOption: true,
          multiple: false
        })
        if (!_fileHandle) {
          return
        }
        fileHandle = _fileHandle
        if (fileHandle.kind === 'directory') {
          this.$message.warning('čŻˇéćŠćäťś')
          return
        }
        this.readFile()
      } catch (error) {
        console.log('error', error)
        if (error.toString().includes('aborted')) {
          return
        }
        this.$message({
          type: 'warning',
          message: 'ä˝ çćľč§ĺ¨ĺŻč˝ä¸ćŻćďźĺťşčŽŽä˝żç¨ćć°çćŹçChromećľč§ĺ¨',
          duration: 1000
        })
      }
    },

    /**
     * @Author: éťĺĺŻ
     * @Desc: čŻťĺćŹĺ°ćäťś
     */
    async readFile() {
      let file = await fileHandle.getFile()
      let fileReader = new FileReader()
      fileReader.onload = async () => {
        this.$store.commit('setIsHandleLocalFile', true)
        this.setData(fileReader.result)
        ElNotification.closeAll()
        ElNotification({
          title: 'ćç¤ş',
          message: `ĺ˝ĺć­Łĺ¨çźčžä˝ ćŹćşçă${file.name}ăćäťś`,
          duration: 0,
          showClose: false
        })
      }
      fileReader.readAsText(file)
    },

    /**
     * @Author: éťĺĺŻ
     * @Desc: ć¸˛ćčŻťĺçć°ćŽ
     */
    setData(str) {
      try {
        let data = JSON.parse(str)
        if (typeof data !== 'object') {
          throw new Error('ćäťśĺĺŽšćčŻŻ')
        }
        if (data.root) {
          this.isFullDataFile = true
        } else {
          this.isFullDataFile = false
          data = {
            ...exampleData,
            root: data
          }
        }
        bus.emit('setData', data)
      } catch (error) {
        console.log(error)
        this.$message.error('ćäťśćĺźĺ¤ąč´Ľ')
      }
    },

    /**
     * @Author: éťĺĺŻ
     * @Desc: ĺĺĽćŹĺ°ćäťś
     */
    async writeLocalFile(content) {
      if (!fileHandle || !this.isHandleLocalFile) {
        return
      }
      if (!this.isFullDataFile) {
        content = content.root
      }
      let string = JSON.stringify(content)
      const writable = await fileHandle.createWritable()
      await writable.write(string)
      await writable.close()
    },

    /**
     * @Author: éťĺĺŻ
     * @Desc: ĺĺťşćŹĺ°ćäťś
     */
    async createNewLocalFile() {
      await this.createLocalFile(exampleData)
    },

    /**
     * @Author: éťĺĺŻ
     * @Desc: ĺŚĺ­ä¸ş
     */
    async saveLocalFile() {
      let data = getData()
      await this.createLocalFile(data)
    },

    /**
     * @Author: éťĺĺŻ
     * @Desc: ĺĺťşćŹĺ°ćäťś
     */
    async createLocalFile(content) {
      try {
        let _fileHandle = await window.showSaveFilePicker({
          types: [
            {
              description: '',
              accept: { 'application/json': ['.smm'] }
            }
          ]
        })
        if (!_fileHandle) {
          return
        }
        const loading = this.$loading({
          lock: true,
          text: 'ć­Łĺ¨ĺĺťşćäťś',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        fileHandle = _fileHandle
        this.$store.commit('setIsHandleLocalFile', true)
        this.isFullDataFile = true
        await this.writeLocalFile(content)
        await this.readFile()
        loading.close()
      } catch (error) {
        console.log(error)
        if (error.toString().includes('aborted')) {
          return
        }
        this.$message.warning('ä˝ çćľč§ĺ¨ĺŻč˝ä¸ćŻćďźĺťşčŽŽä˝żç¨ćć°çćŹçChromećľč§ĺ¨')
      }
    },
    emit: (...agrs) => bus.emit(...agrs)
  }
}
</script>

<style lang="less" scoped>
.toolbarContainer {
  .toolbar {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    display: flex;
    padding: 0 20px;
    padding-top: 20px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(26, 26, 26, 0.8);
    z-index: 2;
    overflow-x: auto;

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
      flex-shrink: 0;

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
