import { ElLoading } from 'element-plus'

let loadingInstance = null

export const showLoading = () => {
  loadingInstance = ElLoading.service({
    lock: true
  })
}

export const hideLoading = () => {
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}
