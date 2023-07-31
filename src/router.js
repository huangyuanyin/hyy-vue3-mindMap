import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import EditPage from '@/pages/Edit/Index'
import IndexPage from '@/pages/Index/Index'

const routes = [
  {
    path: '/index',
    name: 'Index',
    component: IndexPage
  },
  { path: '/', name: 'Edit', component: EditPage }
]

const router = createRouter({
  history: process.env.NODE_ENV === 'development' ? createWebHistory() : createWebHashHistory(),
  base: '/hyy-vue3-mindmap/',
  routes
})

export default router
