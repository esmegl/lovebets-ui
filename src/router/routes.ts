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
    path: '/',
    name: 'guide',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/guide', component: () => import('pages/Guide.vue') }
    ]
  },
  {
    path: '/',
    name: 'high_scores',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/high_scores', component: () => import('pages/HighScores.vue') }
    ]
  },
  {
    path: '/',
    name: 'support_me',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/support_me', component: () => import('pages/SupportMe.vue') }
    ]
  },
  {
    path: '/',
    name: 'contact',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/contact', component: () => import('pages/Contact.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
