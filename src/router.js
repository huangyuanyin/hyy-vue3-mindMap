import { createRouter, createWebHashHistory } from 'vue-router'
import EditPage from '@/pages/Edit/Index'

const routes = [{ path: '/', name: 'Edit', component: EditPage }]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
