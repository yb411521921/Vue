import Vue, { PluginObject } from 'vue'
import Home from '@/views/Home.vue'
import Slider from '@/components/Slider.vue'
import NavBar from '@/components/NavBar.vue';
import bootstrapVue from 'bootstrap-vue/es';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/css/mystyle.scss';

Vue.config.productionTip = false
var bootstrapPlugin: PluginObject<{}> = <any>bootstrapVue;
Vue.use(bootstrapPlugin);

Vue.component('home', Home);
Vue.component('slider', Slider);
Vue.component('nav-bar', NavBar);
var ele: HTMLElement | null = document.getElementById("app-nospa");
var appVue: Vue;
if (ele != null) {
    appVue = new Vue({
        el: ele,
        data: {
            value: 66
        }
    });
}
(<any>window).__getComponents = function (): Vue[] {
    if (appVue) {
        return appVue.$children;
    }
    return new Array<Vue>(0);
};

(<any>window).__createComponent = function (name: string, mountpoint: string): Vue | null {
    var vue: Vue;
    switch (name) {
        case "NavBar":  vue = new Vue({ render: h => h(NavBar) });  break;
        case "Home":    vue = new Vue({ render: h => h(Home) });    break;
        case "Slider":  vue = new Vue({ render: h => h(Slider) });  break;
        default:
            return null;
    }
    vue.$mount(mountpoint);
    return vue;
};
