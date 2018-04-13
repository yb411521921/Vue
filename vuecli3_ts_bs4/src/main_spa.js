import Vue from 'vue';
import AppSpa from './AppSpa.vue';
import router from './router_spa';
import bootstrapVue from 'bootstrap-vue/es';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/css/mystyle.scss';
Vue.config.productionTip = false;
var bootstrapPlugin = bootstrapVue;
Vue.use(bootstrapPlugin);
new Vue({
    router,
    render: h => h(AppSpa)
}).$mount('#app-spa');
//# sourceMappingURL=main_spa.js.map