import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import IndexPage from '@/pages/Index/Index'

const routes = [
  {
    path: '/index',
    name: 'Index',
    component: IndexPage
  },
  { path: '/', name: 'Edit', component: () => import(`./pages/Edit/Index.vue`) }
]

const router = createRouter({
  history: process.env.NODE_ENV === 'development' ? createWebHistory() : createWebHashHistory(),
  base: '/hyy-vue3-mindmap/',
  routes
})

export default router
