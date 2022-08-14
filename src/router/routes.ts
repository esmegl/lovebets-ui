import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }]
  },
  {
    path: '/',
    name: 'select_role',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/select_role', component: () => import('pages/SelectRole.vue') }
    ]
  },
  {
    path: '/',
    name: 'start_wedding',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/start_wedding', component: () => import('pages/StartWedding.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
