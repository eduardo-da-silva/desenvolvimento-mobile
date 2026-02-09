import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/records',
    name: 'records',
    component: () => import('@/views/RecordsView.vue'),
  },
  {
    path: '/records/:id',
    name: 'record-detail',
    component: () => import('@/views/RecordDetailView.vue'),
  },
  {
    path: '/records/:id/edit',
    name: 'record-edit',
    component: () => import('@/views/RecordFormView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
