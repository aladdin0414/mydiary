import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('../views/Login.vue') },
    { 
      path: '/', 
      component: () => import('../views/Calendar.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/editor/:date', 
      component: () => import('../views/Editor.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/search', 
      component: () => import('../views/Search.vue'),
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior(_to, _from, _savedPosition) {
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login');
  } else if (to.path === '/login' && authStore.token) {
    next('/');
  } else {
    next();
  }
});

export default router;
