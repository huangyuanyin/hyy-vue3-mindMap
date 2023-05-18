<template>
  <Sidebar ref="sidebar" :title="$t('style.title')">
    <div class="styleBox" v-if="activeNodes.length > 0">
      <el-tabs class="tab" v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('style.normal')" name="normal"></el-tab-pane>
        <el-tab-pane :label="$t('style.active')" name="active"></el-tab-pane>
      </el-tabs>
      <div class="sidebarContent" v-if="activeNodes.length > 0">
        <!-- 文字 -->
        <div class="title noTop">{{ $t('style.text') }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('style.fontFamily') }}</span>
            <el-select
              size="small"
              v-model="style.fontFamily"
              placeholder=""
              :disabled="checkDisabled('fontFamily')"
              @change="update('fontFamily')"
            >
              <el-option
                v-for="item in fontFamilyList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
                :style="{ fontFamily: item.value }"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('style.fontSize') }}</span>
            <el-select
              size="small"
              style="width: 80px"
              v-model="style.fontSize"
              placeholder=""
              :disabled="checkDisabled('fontSize')"
              @change="update('fontSize')"
            >
              <el-option v-for="item in fontSizeList" :key="item" :label="item" :value="item" :style="{ fontSize: item + 'px' }">
              </el-option>
            </el-select>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t('style.lineHeight') }}</span>
            <el-select
              size="small"
              style="width: 80px"
              v-model="style.lineHeight"
              placeholder=""
              :disabled="checkDisabled('lineHeight')"
              @change="update('lineHeight')"
            >
              <el-option v-for="item in lineHeightList" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="btnGroup">
            <el-tooltip :content="$t('style.color')" placement="bottom">
              <div>
                <el-popover placement="bottom" trigger="hover" :disabled="checkDisabled('color')">
                  <template #reference>
                    <div class="styleBtn" :class="{ disabled: checkDisabled('color') }">
                      A
                      <span class="colorShow" :style="{ backgroundColor: style.color || '#eee' }"></span>
                    </div>
                  </template>
                  <Color :color="style.color" @change="changeFontColor"></Color>
                </el-popover>
              </div>
            </el-tooltip>
            <el-tooltip :content="$t('style.addFontWeight')" placement="bottom">
              <div
                class="styleBtn"
                :class="{
                  actived: style.fontWeight === 'bold',
                  disabled: checkDisabled('fontWeight')
                }"
                @click="toggleFontWeight"
              >
                B
              </div>
            </el-tooltip>
            <el-tooltip :content="$t('style.italic')" placement="bottom">
              <div
                class="styleBtn i"
                :class="{
                  actived: style.fontStyle === 'italic',
                  disabled: checkDisabled('fontStyle')
                }"
                @click="toggleFontStyle"
              >
                I
              </div>
            </el-tooltip>
            <el-tooltip :content="$t('style.textDecoration')" placement="bottom">
              <div>
                <el-popover placement="bottom" trigger="hover" :disabled="checkDisabled('color')">
                  <template #reference>
                    <div
                      class="styleBtn u"
                      :style="{
                        textDecoration: style.textDecoration || 'none'
                      }"
                      :class="{ disabled: checkDisabled('textDecoration') }"
                    >
                      U
                    </div>
                  </template>
                  <el-radio-group size="small" v-model="style.textDecoration" @change="update('textDecoration')">
                    <el-radio-button label="underline">{{ $t('style.underline') }}</el-radio-button>
                    <el-radio-button label="line-through"> {{ $t('style.lineThrough') }} </el-radio-button>
                    <el-radio-button label="overline">{{ $t('style.overline') }}</el-radio-button>
                  </el-radio-group>
                </el-popover>
              </div>
            </el-tooltip>
          </div>
        </div>
        <!-- 边框 -->
        <div class="title">{{ $t('style.border') }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('style.color') }}</span>
            <el-popover placement="bottom" trigger="hover" :disabled="checkDisabled('borderColor')" width="auto">
              <template #reference>
                <span
                  class="block"
                  :style="{ width: '80px', backgroundColor: style.borderColor }"
                  :class="{ disabled: checkDisabled('borderColor') }"
                ></span>
              </template>
              <Color :color="style.borderColor" @change="changeBorderColor"></Color>
            </el-popover>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t('style.style') }}</span>
            <el-select
              size="small"
              style="width: 80px"
              v-model="style.borderDasharray"
              placeholder=""
              :disabled="checkDisabled('borderDasharray')"
              @change="update('borderDasharray')"
            >
              <el-option v-for="item in borderDasharrayList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('style.width') }}</span>
            <el-select
              size="small"
              style="width: 80px"
              v-model="style.borderWidth"
              placeholder=""
              :disabled="checkDisabled('borderWidth')"
              @change="update('borderWidth')"
            >
              <el-option v-for="item in borderWidthList" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t('style.borderRadius') }}</span>
            <el-select
              size="small"
              style="width: 80px"
              v-model="style.borderRadius"
              placeholder=""
              :disabled="checkDisabled('borderRadius')"
              @change="update('borderRadius')"
            >
              <el-option v-for="item in borderRadiusList" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </div>
        </div>
        <!-- 背景 -->
        <div class="title">{{ $t('style.background') }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('style.color') }}</span>
            <el-popover placement="bottom" trigger="hover" :disabled="checkDisabled('fillColor')" width="auto">
              <template #reference>
                <span
                  class="block"
                  :style="{ width: '80px', backgroundColor: style.fillColor }"
                  :class="{ disabled: checkDisabled('fillColor') }"
                ></span>
              </template>
              <Color :color="style.fillColor" @change="changeFillColor"></Color>
            </el-popover>
          </div>
        </div>
        <!-- 形状 -->
        <div class="title">{{ $t('style.shape') }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('style.shape') }}</span>
            <el-select
              size="small"
              style="width: 120px"
              v-model="style.shape"
              placeholder=""
              :disabled="checkDisabled('shape')"
              @change="update('shape')"
            >
              <el-option v-for="item in shapeList" :key="item" :label="item.name" :value="item.value"> </el-option>
            </el-select>
          </div>
        </div>
        <!-- 线条 -->
        <div class="title">{{ $t('style.line') }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('style.color') }}</span>
            <el-popover placement="bottom" trigger="hover" :disabled="checkDisabled('lineColor')" width="auto">
              <template #reference>
                <span
                  class="block"
                  :style="{ width: '80px', backgroundColor: style.lineColor }"
                  :class="{ disabled: checkDisabled('lineColor') }"
                ></span>
              </template>
              <Color :color="style.lineColor" @change="changeLineColor"></Color>
            </el-popover>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t('style.style') }}</span>
            <el-select
              size="small"
              style="width: 80px"
              v-model="style.lineDasharray"
              placeholder="请选择..."
              :disabled="checkDisabled('lineDasharray')"
              @change="update('lineDasharray')"
            >
              <el-option v-for="item in borderDasharrayList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('style.width') }}</span>
            <el-select
              size="small"
              style="width: 80px"
              v-model="style.lineWidth"
              placeholder="请选择..."
              :disabled="checkDisabled('lineWidth')"
              @change="update('lineWidth')"
            >
              <el-option v-for="item in borderWidthList" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </div>
        </div>
        <!-- 节点内边距 -->
        <div class="title noTop">{{ $t('style.nodePadding') }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('style.horizontal') }}</span>
            <el-slider
              style="width: 200px"
              v-model="style.paddingX"
              :disabled="checkDisabled('paddingX')"
              @change="update('paddingX')"
            ></el-slider>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('style.vertical') }}</span>
            <el-slider
              style="width: 200px"
              v-model="style.paddingY"
              :disabled="checkDisabled('paddingY')"
              @change="update('paddingY')"
            ></el-slider>
          </div>
        </div>
      </div>
    </div>
    <div class="tipBox" v-else>
      <div class="tipIcon iconfont icontianjiazijiedian"></div>
      <div class="tipText">请选择一个节点</div>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar'
import Color from './Color'
import { fontFamilyList, fontSizeList, borderWidthList, borderDasharrayList, borderRadiusList, lineHeightList, shapeList } from '@/config'
import { supportActiveStyle } from 'simple-mind-map/src/themes/default'
import bus from '@/utils/bus.js'
import { mapState } from 'vuex'
/**
 * @Author: 黄原寅
 * @Desc: 节点样式设置
 */
export default {
  name: 'Style',
  components: {
    Sidebar,
    Color
  },
  data() {
    return {
      supportActiveStyle,
      fontSizeList,
      borderWidthList,
      borderRadiusList,
      lineHeightList,
      activeNodes: [],
      activeTab: 'normal',
      style: {
        shape: '',
        paddingX: 0,
        paddingY: 0,
        color: '',
        fontFamily: '',
        fontSize: '',
        lineHeight: '',
        textDecoration: '',
        fontWeight: '',
        fontStyle: '',
        borderWidth: '',
        borderColor: '',
        fillColor: '',
        borderDasharray: '',
        borderRadius: '',
        lineColor: '',
        lineDasharray: '',
        lineWidth: ''
      }
    }
  },
  computed: {
    ...mapState(['activeSidebar']),
    fontFamilyList() {
      return fontFamilyList[this.$i18n.locale] || fontFamilyList.zh
    },
    borderDasharrayList() {
      return borderDasharrayList[this.$i18n.locale] || borderDasharrayList.zh
    },
    shapeList() {
      return shapeList[this.$i18n.locale] || shapeList.zh
    }
  },
  watch: {
    activeSidebar(val) {
      if (val === 'nodeStyle') {
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
      }
    }
  },
  created() {
    bus.on('node_active', this.onNodeActive)
  },
  beforeDestroy() {
    bus.off('node_active', this.onNodeActive)
  },
  methods: {
    /**
     * @Author: 黄原寅
     * @Desc: 监听节点激活事件
     */
    onNodeActive(...args) {
      // if (this.$refs.sidebar) this.$refs.sidebar.show = false
      this.$nextTick(() => {
        this.activeTab = 'normal'
        this.activeNodes = args[0][1]
        // if (this.$refs.sidebar) this.$refs.sidebar.show = this.activeNodes.length > 0
        this.initNodeStyle()
      })
    },
    /**
     * @Author: 黄原寅
     * @Desc: tab切换
     */
    handleTabClick() {
      this.initNodeStyle()
    },

    /**
     * @Author: 黄原寅
     * @Desc: 检查是否禁用
     */
    checkDisabled(prop) {
      return this.activeTab === 'active' && !this.supportActiveStyle.includes(prop)
    },

    /**
     * @Author: 黄原寅
     * @Desc: 初始节点样式
     */
    initNodeStyle() {
      if (this.activeNodes.length <= 0) {
        this.activeTab = 'normal'
        return
      }
      ;[
        'shape',
        'paddingX',
        'paddingY',
        'color',
        'fontFamily',
        'fontSize',
        'lineHeight',
        'textDecoration',
        'fontWeight',
        'fontStyle',
        'borderWidth',
        'borderColor',
        'fillColor',
        'borderDasharray',
        'borderRadius',
        'lineColor',
        'lineDasharray',
        'lineWidth'
      ].forEach(item => {
        this.style[item] = this.activeNodes[0].getStyle(item, false, this.activeTab === 'active')
      })
    },

    /**
     * @Author: 黄原寅
     * @Desc: 修改样式
     */
    update(prop) {
      this.activeNodes.forEach(node => {
        node.setStyle(prop, this.style[prop], this.activeTab === 'active')
      })
    },

    /**
     * @Author: 黄原寅
     * @Desc: 切换加粗样式
     */
    toggleFontWeight() {
      if (this.style.fontWeight === 'bold') {
        this.style.fontWeight = 'normal'
      } else {
        this.style.fontWeight = 'bold'
      }
      this.update('fontWeight')
    },

    /**
     * @Author: 黄原寅
     * @Desc: 切换字体样式
     */
    toggleFontStyle() {
      if (this.style.fontStyle === 'italic') {
        this.style.fontStyle = 'normal'
      } else {
        this.style.fontStyle = 'italic'
      }
      this.update('fontStyle')
    },

    /**
     * @Author: 黄原寅
     * @Desc: 修改字体颜色
     */
    changeFontColor(color) {
      this.style.color = color
      this.update('color')
    },

    /**
     * @Author: 黄原寅
     * @Desc: 修改边框颜色
     */
    changeBorderColor(color) {
      this.style.borderColor = color
      this.update('borderColor')
    },

    /**
     * @Author: 黄原寅
     * @Desc: 修改线条颜色
     */
    changeLineColor(color) {
      this.style.lineColor = color
      this.update('lineColor')
    },

    /**
     * @Author: 黄原寅
     * @Desc: 修改背景颜色
     */
    changeFillColor(color) {
      this.style.fillColor = color
      this.update('fillColor')
    }
  }
}
</script>

<style lang="less" scoped>
.styleBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .tab {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 0 20px;
  }
}
.tipBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  .tipIcon {
    font-size: 100px;
  }
}

.sidebarContent {
  padding: 20px;
  padding-top: 10px;

  .title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(26, 26, 26, 0.9);
    margin-bottom: 10px;
    margin-top: 20px;

    &.noTop {
      margin-top: 0;
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .btnGroup {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .rowItem {
      display: flex;
      align-items: center;

      .name {
        font-size: 12px;
        margin-right: 10px;
      }

      .block {
        display: inline-block;
        width: 30px;
        height: 30px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;

        &.disabled {
          background-color: #f5f7fa !important;
          border-color: #e4e7ed !important;
          color: #c0c4cc !important;
          cursor: not-allowed !important;
        }
      }
    }

    .styleBtn {
      position: relative;
      width: 50px;
      height: 30px;
      background: #fff;
      border: 1px solid #eee;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;

      &.actived {
        background-color: #eee;
      }

      &.disabled {
        background-color: #f5f7fa !important;
        border-color: #e4e7ed !important;
        color: #c0c4cc !important;
        cursor: not-allowed !important;
      }

      &.i {
        font-style: italic;
      }

      &.u {
      }

      .colorShow {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
      }
    }
  }
}
</style>
