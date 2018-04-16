import Vue, { PluginObject } from 'vue'
import AppSpa from './AppSpa.vue'
import router from './router_spa'
import bootstrapVue from 'bootstrap-vue';
import Helper from './helper';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/css/mystyle.scss';

Vue.config.productionTip = false
Vue.use(bootstrapVue);

new Vue({
  router,
  render: h => h(AppSpa)
}).$mount('#app-spa')
