<template>
  <div class="navigatorContainer" :class="{ isDark: isDark }">
    <div class="item">
      <el-select v-model="lang" size="small" style="width: 100px" @change="onLangChange">
        <el-option v-for="item in langList" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
    </div>
    <div class="item">
      <div class="btn iconfont iconsousuo" @click="showSearch"></div>
    </div>
    <div class="item">
      <MouseAction :isDark="isDark" :mindMap="mindMap"></MouseAction>
    </div>
    <div class="item">
      <el-tooltip
        effect="dark"
        :content="openMiniMap ? $t('navigatorToolbar.closeMiniMap') : $t('navigatorToolbar.openMiniMap')"
        placement="top"
      >
        <div class="btn iconfont icondaohang1" @click="toggleMiniMap"></div>
      </el-tooltip>
    </div>
    <div class="item">
      <!-- <el-switch
        v-model="isReadonly"
        :active-text="$t('navigatorToolbar.readonly')"
        :inactive-text="$t('navigatorToolbar.edit')"
        @change="readonlyChange"
      >
      </el-switch> -->
      <el-tooltip effect="dark" :content="isReadonly ? $t('navigatorToolbar.edit') : $t('navigatorToolbar.readonly')" placement="top">
        <div class="btn iconfont" :class="[isReadonly ? 'iconyanjing' : 'iconbianji1']" @click="readonlyChange"></div>
      </el-tooltip>
    </div>
    <div class="item">
      <Fullscreen :isDark="isDark" :mindMap="mindMap"></Fullscreen>
    </div>
    <div class="item">
      <Scale :isDark="isDark" :mindMap="mindMap"></Scale>
    </div>
    <div class="item">
      <div class="btn iconfont" :class="[isDark ? 'iconmoon_line' : 'iconlieri']" @click="toggleDark"></div>
    </div>
  </div>
</template>

<script setup>
/**
 * @Author: 黄原寅
 * @Desc: 导航器工具栏
 */
import { ref, onMounted, defineProps, computed } from 'vue'
import { useStore } from 'vuex'
import Scale from './Scale'
import Fullscreen from './Fullscreen'
import MouseAction from './MouseAction.vue'
import bus from '@/utils/bus.js'
import { langList } from '@/config'
import i18n from '@/i18n.js'
import { storeLang, getLang } from '@/api'

const props = defineProps({
  mindMap: {
    type: Object
  }
})

const store = useStore()
const openMiniMap = ref(false)
const lang = ref(getLang())
const isDark = computed(() => store.state.isDark)
const isReadonly = computed(() => store.state.isReadonly)

const readonlyChange = () => {
  store.commit('setIsReadonly', !isReadonly.value)
  props.mindMap.setMode(isReadonly.value ? 'readonly' : 'edit')
}

const toggleMiniMap = () => {
  openMiniMap.value = !openMiniMap.value
  bus.emit('toggle_mini_map', openMiniMap.value)
}

const onLangChange = lang => {
  i18n.locale = lang
  console.log('i18n', i18n)
  storeLang(lang)
  bus.emit('lang_change')
}

const showSearch = () => {
  bus.emit('show_search')
}

const toggleDark = () => {
  store.commit('setIsDark', !isDark.value)
}
</script>

<script>
export default {
  name: 'NavigatorToolbar'
}
</script>

<style lang="less" scoped>
.navigatorContainer {
  padding: 0 12px;
  position: fixed;
  right: 20px;
  bottom: 20px;
  background: hsla(0, 0%, 100%, 0.8);
  border-radius: 5px;
  opacity: 0.8;
  height: 44px;
  font-size: 12px;
  display: flex;
  align-items: center;
  &.isDark {
    background: #262a2e;
    .item {
      a {
        color: hsla(0, 0%, 100%, 0.6);
      }
      .btn {
        color: hsla(0, 0%, 100%, 0.6);
      }
    }
  }
  .item {
    margin-right: 20px;

    &:last-of-type {
      margin-right: 0;
    }
    .btn {
      cursor: pointer;
      font-size: 18px;
    }
  }
}
@media screen and (max-width: 590px) {
  .navigatorContainer {
    left: 20px;
    overflow-x: auto;
  }
}
</style>
