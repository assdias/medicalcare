import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { useAuthStore } from 'src/stores/auth-store';
import { tipo } from 'src/interfaces';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const { getLoggedIn, getUser } = useAuthStore();

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!getLoggedIn) {
        next({
          path: '/',
        });
      } else if (
        getUser.tipo == tipo.BENEFICIARIO &&
        to.name !== 'beneficiario'
      ) {
        next({
          path: '/beneficiario',
        });
      } else if (getUser.tipo == tipo.PRESTADOR && to.name !== 'prestador') {
        next({
          path: '/prestador',
        });
      } else if (getUser.tipo == tipo.OPERADOR && to.name !== 'operador') {
        next({
          path: '/operador',
        });
      } else {
        next();
      }
    } else {
      next();
    }
  });

  return Router;
});
function elseif(arg0: boolean) {
  throw new Error('Function not implemented.');
}
