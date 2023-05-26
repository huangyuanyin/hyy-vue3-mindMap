import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import EditPage from '@/pages/Edit/Index'

const routes = [{ path: '/', name: 'Edit', component: EditPage }]

const router = createRouter({
  history: process.env.NODE_ENV === 'development' ? createWebHistory() : createWebHashHistory(),
  base: '/',
  routes
})

export default router
