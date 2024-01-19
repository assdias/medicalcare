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

    if (to.meta.requiresAuth && !getLoggedIn) return next('/');
    if (!to.meta.requiresAuth) return next();

    if (
      to.meta.requiresAuth &&
      to.meta.requiresBeneficario &&
      getUser.tipo === tipo.BENEFICIARIO
    ) {
      return next();
    } else if (
      to.meta.requiresAuth &&
      to.meta.requiresPrestador &&
      getUser.tipo === tipo.PRESTADOR
    ) {
      return next();
    } else if (
      to.meta.requiresAuth &&
      to.meta.requiresOperador &&
      getUser.tipo === tipo.OPERADOR
    ) {
      return next();
    } else {
      return next('/Unauthorized');
    }
  });

  return Router;
});
function elseif(arg0: boolean) {
  throw new Error('Function not implemented.');
}
