import Vue, { PluginObject } from 'vue'
import Home from '@/views/Home.vue'
import store from './store'
import Slider from '@/components/Slider.vue'
import NavBar from '@/components/NavBar.vue';
import Configuration from '@/components/Configuration.vue';
import bootstrapVue from 'bootstrap-vue';
import Helper from './helper';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/css/mystyle.scss';

Vue.config.productionTip = false
Vue.use(bootstrapVue);

Vue.component('home', Home);
Vue.component('slider', Slider);
Vue.component('nav-bar', NavBar);
Vue.component('configuration', Configuration);
var ele: HTMLElement | null = document.getElementById("app-nospa");
var appVue: Vue;
if (ele != null) {
    appVue = new Vue({
        el: ele,
        store,
        data: {
            value: 66
        }
    });
}

Helper.initNow();

(<any>window).__getComponents = function (): Vue[] {
    if (appVue) {
        return appVue.$children;
    }
    return new Array<Vue>(0);
};

(<any>window).__setConfig = function (config: any): void {
    store.commit('setConfig', JSON.parse(decodeURIComponent(config)));
};

(<any>window).__createComponent = function (name: string, mountpoint: string): Vue | null {
    var vue: Vue;
    switch (name) {
        case "NavBar":          vue = new Vue({ render: h => h(NavBar) });          break;
        case "Home":            vue = new Vue({ render: h => h(Home) });            break;
        case "Slider":          vue = new Vue({ render: h => h(Slider) });          break;
        case "Configuration":   vue = new Vue({ render: h => h(Configuration) });   break;
        default:
            return null;
    }
    vue.$mount(mountpoint);
    return vue;
};
