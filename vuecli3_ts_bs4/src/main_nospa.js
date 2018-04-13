import Vue from 'vue';
import Home from '@/views/Home.vue';
import Slider from '@/components/Slider.vue';
import NavBar from '@/components/NavBar.vue';
import bootstrapVue from 'bootstrap-vue/es';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/css/mystyle.scss';
Vue.config.productionTip = false;
var bootstrapPlugin = bootstrapVue;
Vue.use(bootstrapPlugin);
window.__createComponent = function (name, mountpoint, inputHandler) {
    var vue;
    switch (name) {
        case "NavBar":
            vue = new Vue({ render: h => h(NavBar) });
            break;
        case "Home":
            vue = new Vue({ render: h => h(Home) });
            break;
        case "Slider":
            vue = new Vue({ render: h => h(Slider) });
            break;
        default:
            return null;
    }
    vue.$mount(mountpoint);
    if (inputHandler) {
        vue.$children[0].$on("input", (arg) => inputHandler(arg));
    }
    return vue;
};
//# sourceMappingURL=main_nospa.js.map