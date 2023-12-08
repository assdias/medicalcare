import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'createaccount',
        name: 'createaccount',
        component: () => import('pages/CreateAccountPage.vue'),
      },
    ],
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayoutAuth.vue'),
    children: [
      {
        path: 'beneficiario',
        name: 'beneficiario',
        component: () => import('pages/BeneficiarioPage.vue'),
      },
      {
        path: 'prestador',
        name: 'prestador',
        component: () => import('pages/PrestadorPage.vue'),
      },
      {
        path: 'operador',
        name: 'operador',
        component: () => import('pages/OperadorPage.vue'),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
