<template>
  <div class="searchContainer" :class="{ isDark: isDark, show: show }" @mouseleave="onMouseleave">
    <div class="closeBtnBox">
      <el-icon class="closeBtn" @click="close">
        <Close />
      </el-icon>
    </div>
    <div class="searchInputBox">
      <el-input
        ref="searchInputRef"
        :placeholder="$t('search.searchPlaceholder')"
        v-model="searchText"
        @keyup.enter.stop="onSearchNext"
        @keydown.native.stop
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append v-if="!isUndef(searchText)">
          <el-button @click="showReplaceInput = true">
            {{ $t('search.replace') }}
          </el-button>
        </template>
      </el-input>
      <div class="searchInfo" v-if="showSearchInfo">{{ currentIndex }} / {{ total }}</div>
    </div>
    <el-input
      v-if="showReplaceInput"
      ref="replaceInputRef"
      :placeholder="$t('search.replacePlaceholder')"
      v-model="replaceText"
      style="margin: 12px 0"
      @keydown.native.stop
    >
      <template #prefix>
        <el-icon><EditPen /></el-icon>
      </template>
      <template #append v-if="!!searchText.trim()">
        <el-button @click="hideReplaceInput">{{ $t('search.cancel') }}</el-button>
      </template>
    </el-input>
    <div class="btnList" v-if="showReplaceInput">
      <el-button :disabled="isReadonly" @click="replace">{{ $t('search.replace') }}</el-button>
      <el-button :disabled="isReadonly" @click="replaceAll">{{ $t('search.replaceAll') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bus from '@/utils/bus.js'
import { Close, Search, EditPen } from '@element-plus/icons-vue'
import { isUndef } from 'simple-mind-map/src/utils/index'
// 搜索替换
export default {
  name: 'Search2',
  components: {
    Close,
    Search,
    EditPen
  },
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      show: false,
      searchText: '',
      replaceText: '',
      showReplaceInput: false,
      currentIndex: 0,
      total: 0,
      showSearchInfo: false
    }
  },
  computed: {
    ...mapState(['isDark', 'isReadonly'])
  },
  watch: {
    searchText() {
      if (isUndef(this.searchText)) {
        this.currentIndex = 0
        this.total = 0
        this.showSearchInfo = false
      }
    }
  },
  created() {
    bus.on('show_search', this.showSearch)
    this.mindMap.on('search_info_change', this.handleSearchInfoChange)
    this.mindMap.keyCommand.addShortcut('Control+f', this.showSearch)
  },
  beforeDestroy() {
    bus.off('show_search', this.showSearch)
    this.mindMap.off('search_info_change', this.handleSearchInfoChange)
    this.mindMap.keyCommand.removeShortcut('Control+f', this.showSearch)
  },
  methods: {
    isUndef,
    handleSearchInfoChange(data) {
      this.currentIndex = data.currentIndex + 1
      this.total = data.total
      this.showSearchInfo = true
    },
    showSearch() {
      bus.emit('closeSideBar')
      this.show = true
      // this.$refs.searchInputRef.focus()
    },
    hideReplaceInput() {
      this.showReplaceInput = false
      this.replaceText = ''
    },
    onMouseleave() {
      if (this.$refs.searchInputRef) {
        this.$refs.searchInputRef.blur()
      }
      if (this.$refs.replaceInputRef) {
        this.$refs.replaceInputRef.blur()
      }
    },
    onSearchNext() {
      this.mindMap.search.search(this.searchText, () => {
        this.$refs.searchInputRef.focus()
      })
    },
    replace() {
      this.mindMap.search.replace(this.replaceText, true)
    },
    replaceAll() {
      this.mindMap.search.replaceAll(this.replaceText)
    },
    close() {
      this.show = false
      this.showSearchInfo = false
      this.total = 0
      this.currentIndex = 0
      this.searchText = ''
      this.hideReplaceInput()
      this.mindMap.search.endSearch()
    }
  }
}
</script>

<style lang="less" scoped>
.searchContainer {
  position: relative;
  background-color: #fff;
  padding: 16px;
  width: 296px;
  border-radius: 12px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 110px;
  right: -296px;
  transition: all 0.3s;
  &.isDark {
    background-color: #363b3f;
    .closeBtnBox {
      color: #fff;
      background-color: #363b3f;
    }
  }
  &.show {
    right: 20px;
  }
  .btnList {
    display: flex;
    justify-content: flex-end;
  }
  .closeBtnBox {
    position: absolute;
    right: -5px;
    top: -5px;
    width: 20px;
    height: 20px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    .closeBtn {
      font-size: 16px;
    }
  }
  .searchInputBox {
    position: relative;
    .searchInfo {
      position: absolute;
      right: 70px;
      top: 50%;
      transform: translateY(-50%);
      color: #909090;
      font-size: 14px;
    }
  }
}
</style>
