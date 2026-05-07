import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/products', name: 'Products', component: () => import('../views/Products.vue') },
  { path: '/agritech', name: 'AgriTech', component: () => import('../views/AgriTech.vue') },
  { path: '/supply', name: 'Supply', component: () => import('../views/Supply.vue') },
  { path: '/village', name: 'Village', component: () => import('../views/Village.vue') },
  { path: '/services', name: 'Services', component: () => import('../views/Services.vue') },
  { path: '/seed-trading', name: 'SeedTrading', component: () => import('../views/SeedTrading.vue') },
  { path: '/irrigation', name: 'Irrigation', component: () => import('../views/Irrigation.vue') },
  { path: '/weather', name: 'Weather', component: () => import('../views/Weather.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
