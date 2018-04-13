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

(<any>window).__createComponent = function (name: string, mountpoint: string, inputHandler?: Function) : any {
    var vue: Vue;
    switch (name) {
        case "NavBar": vue = new Vue({ render: h => h(NavBar) }); break;
        case "Home": vue = new Vue({ render: h => h(Home) }); break;
        case "Slider": vue = new Vue({ render: h => h(Slider) }); break;
        default:
            return null;
    }
    vue.$mount(mountpoint);
    if (inputHandler) {
        vue.$children[0].$on("input", (arg: any) => inputHandler(arg));
    }
    return vue;
}
