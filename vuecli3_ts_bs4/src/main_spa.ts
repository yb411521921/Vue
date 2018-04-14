import Vue, { PluginObject } from 'vue'
import AppSpa from './AppSpa.vue'
import router from './router_spa'
import bootstrapVue from 'bootstrap-vue/es';
import Helper from './helper';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/css/mystyle.scss';

Vue.config.productionTip = false
var bootstrapPlugin: PluginObject<{}> = <any>bootstrapVue;
Vue.use(bootstrapPlugin);

new Vue({
  router,
  render: h => h(AppSpa)
}).$mount('#app-spa')
