import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/get-ip',
    },
    {
      path: '/get-ip',
      name: 'get-ip',
      component: () => import('../views/get-ip.vue'),
    },
  ],
})

export default router
