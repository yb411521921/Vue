import Vue from 'vue'
import { isArray, isUndefined } from 'util';

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
    static processInitProps(vue: Vue): void {
        if (vue.$parent.$el) {
            for (var i = 0; i < vue.$parent.$el.attributes.length; i++) {
                var attr: Attr | null = vue.$parent.$el.attributes.item(i);
                if (attr != null) {
                    var attrName = attr.name;
                    if (attrName == 'id')
                        continue;
                    if (attrName == 'data-init-vue')
                        continue;
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
}

 