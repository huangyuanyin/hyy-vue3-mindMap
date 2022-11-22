import { createStore } from 'vuex'
import exampleData from 'simple-mind-map/example/exampleData'

const store = createStore({
  state: {
    mindMapData: null, // 思维导图数据
    isHandleLocalFile: false // 是否操作的是本地文件
  },
  mutations: {
    /**
     * @Author: 黄原寅
     * @Desc: 设置思维导图数据
     */
    setMindMapData(state, data) {
      state.mindMapData = data
    },
    /**
     * @Author: 黄原寅
     * @Desc: 设置操作本地文件标志位
     */
    setIsHandleLocalFile(state, data) {
      state.isHandleLocalFile = data
    }
  },
  actions: {
    /**
     * @Author: 黄原寅
     * @Desc: 设置初始思维导图数据
     */
    getUserMindMapData(ctx) {
      try {
        let { data } = {
          data: {
            data: {
              mindMapData: exampleData
            }
          }
        }
        ctx.commit('setMindMapData', data.data)
      } catch (error) {
        console.log(error)
      }
    }
  }
})

export default store
