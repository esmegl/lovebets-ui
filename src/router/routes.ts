import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }]
  },
  {
    path: '/account/:account',
    name: 'account',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Account.vue')
      }
    ]
  },
  {
    path: '/select_role',
    name: 'select_role',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/select_role', component: () => import('pages/SelectRole.vue') }
    ]
  },
  {
    path: '/minister',
    name: 'minister',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/minister', component: () => import('pages/Minister.vue') }
    ]
  },
  // {
  //   path: '/start_wedding',
  //   name: 'start_wedding',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: '/start_wedding', component: () => import('pages/StartWedding.vue') }
  //   ]
  // },
  {
    path: '/bettor_approval',
    name: 'bettor_approval',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/bettor_approval', component: () => import('pages/BettorApproval.vue') }
    ]
  },
  {
    path: '/witness_approval',
    name: 'witness_approval',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/witness_approval', component: () => import('pages/WitnessApproval.vue') }
    ]
  },
  {
    path: '/guide',
    name: 'guide',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/guide', component: () => import('pages/Guide.vue') }
    ]
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/docs', component: () => import('pages/Docs.vue') }
    ]
  },
  {
    path: '/high_scores',
    name: 'high_scores',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/high_scores', component: () => import('pages/HighScores.vue') }
    ]
  },
  {
    path: '/support_me',
    name: 'support_me',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/support_me', component: () => import('pages/SupportMe.vue') }
    ]
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/contact', component: () => import('pages/Contact.vue') }
    ]
  },
  {
    path: '/transaction/:transaction',
    name: 'transaction',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Transaction.vue') }]
  },
  {
    path: '/witness_approval/:proposalName',
    name: 'ProposalItem',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProposalItem.vue') }]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
