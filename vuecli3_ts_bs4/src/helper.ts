import Vue from 'vue'
import store from './store';
import { isArray, isUndefined } from 'util';
import { setInterval, clearInterval } from 'timers';

export default class Helper {
    static timer: NodeJS.Timer;
    static processDataInitVue(vue: Vue): void {
        if (vue.$parent.$el) {
            var jsonData = decodeURIComponent(<any>vue.$parent.$el.getAttribute("data-init-vue"));
            if (jsonData) {
                var initData = JSON.parse(jsonData);
                for (var propertyName in initData) {
                    var prop = vue.$props[propertyName];
                    if (isUndefined(prop)) {
                        throw ("Illegal property" + propertyName);
                    }
                    vue.$props[propertyName] = initData[propertyName];
                }
            }
        }
    }
    static processInitProps(vue: Vue): void {
        if (vue.$parent.$el) {
            for (var i = 0; i < vue.$parent.$el.attributes.length; i++) {
                var attr: Attr | null = vue.$parent.$el.attributes.item(i);
                if (attr != null) {
                    var attrName = attr.name;
                    if (attrName == 'id')
                        continue;
                    if (attrName == 'data-init-vue') {
                        Helper.processDataInitVue(vue);
                        continue;
                    }
                    if (attrName.startsWith('v-event:')) {
                        attrName = attrName.substring(8);
                        attrName = Helper.hyphenToCamelCase(attrName);
                        var func: any = (<any>window)[attr.value];
                        vue.$on(attrName, (arg: any) => func(arg)); 
                        continue;
                    }
                    var attrValue: any = attr.value;
                    if (attrName.startsWith('v-prop:')) {
                        attrName = attrName.substring(7);
                    }
                    attrName = Helper.hyphenToCamelCase(attrName);
                    var prop = vue.$props[attrName];
                    if (isUndefined(prop)) {
                        throw ("Illegal property" + attrName);
                    }
                    if (attrValue.charAt(0) == '{') {
                        attrValue = attrValue.replace(/'/g, '"'); 
                        attrValue = JSON.parse(attrValue);
                    }
                    else if (attrValue.charAt(0) == '[') {
                        attrValue = attrValue.replace(/'/g, '"'); 
                        attrValue = JSON.parse(attrValue);
                    }
                    vue.$props[attrName] = attrValue;
                }
            }
        }
    }
    static hyphenToCamelCase(hyphen: string) : string {
        return hyphen.replace(/-([a-z])/g, function (match) {
            return match[1].toUpperCase();
        });
    }
    static camelCaseToHyphen(camelCase: string) : string {
        return camelCase.replace(/[A-Z]/g, '-$1').toLowerCase();
    }
    static initNow(): void {
        Helper.timer = setInterval(() =>
            store.commit('setNow', new Date()),
            100);
    }
    static stopNow(): void {
        clearInterval(Helper.timer);
    }
}

 