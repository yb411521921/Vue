import Vue, { PluginObject } from 'vue'
import AppSpa from './AppSpa.vue'
import router from './router_spa'
import store  from './store'
import bootstrapVue from 'bootstrap-vue';
import Helper from './helper';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/css/mystyle.scss';

Vue.config.productionTip = false
Vue.use(bootstrapVue);

new Vue({
    router,
    store,
    render: h => h(AppSpa)
}).$mount('#app-spa');

Helper.initNow();

(<any>window).__setConfig = function (config: any): void {
    store.commit('setConfig', JSON.parse(decodeURIComponent (config)));
};
