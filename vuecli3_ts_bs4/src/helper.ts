import Vue from 'vue'
import { isArray } from 'util';

export default class Helper {
    static processDataInitVue(vue: Vue): void {
        if (vue.$parent.$el) {
            var jsonData = decodeURIComponent(<any>vue.$parent.$el.getAttribute("data-init-vue"));
            if (jsonData) {
                var initData = JSON.parse(jsonData);
                for (var propertyName in initData) {
                    vue.$props[propertyName] = initData[propertyName];
                }
            }
        }
    }
    static installHandler(vue: Vue, handler: any) {
        if (handler.type && typeof handler.type === 'string' && handler.function && typeof handler.function === 'function') {
            vue.$children[0].$on(handler.type, (arg: any) => handler.function(arg));
        }
        else {
            throw ("Illegal handler");
        }
    }
    static mountAndInstallHandler(vue: Vue, mountpoint: string, handler: any) {
        vue.$mount(mountpoint);
        if (handler) {
            if (isArray(handler)) {
                for (var i = 0; i < handler.length; i++)
                    Helper.installHandler(vue, handler[i]);
            }
            else
                Helper.installHandler(vue, handler);
        }
    }
}

 