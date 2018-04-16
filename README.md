# Vue
**ASPNET Core Prototype with Vue, Bootstrap 4, bootstrap-vue and Typescript.**

The prototype was created with latest vue-cli 3.0.0 beta6 combining it with an empty AspNetCore project.
My goal was :

- Using latest vue-cli 3 approach
- Using Bootstrap 4 and bootstrap-vue
- Have SPA pages and classical (non SPA) ASP MVC pages in one project
- Find a way to use the same Vue component as subcomponents in Vue views (inside SPA) and inside .cshtml pages.


**Important :**

There are still some flaws in the prototype. Solutions are welcome !! (please apply _issues_)
I plan to improve this things.

1. Typescript definition for boostrap-vue

Create a file **index.d.ts** inside node_modules/bootstrap_vue/es after **npm install** with this content :
```<Typescript>
import {PluginObject} from 'vue';
export declare const bootstrap : PluginObject<{}>;
```

2. **Manually** build the bundles after changing of Vue components or typescript files.

If you use ASPNET Development : **npm run build-dev**<br>
If you use ASPNET Production  : **npm run build**

3. Debugging Typescript does not work properly 

**How does the prototype work :**

Using **vue.config.js** I configured two bundles :
- **appspa** for the SPA part, with entry _main_spa.ts_, _router_spa.ts_ to start with _AppSpa.vue_.
- **appnospa** for the no SPA part, with entry _main_nospa.ts_ for the MVC .cshtml pages

**While the SPA part is straight forward there are 2 possibilities to use Vue components in .cshtml pages.**

**1. Let Vue compile the rendered cshtml like a template. Of course this will take some time at the client, but usage is easy.**<br>
1.1. Modify _vue.config.use_ to use the whole vue module (_vue/dist/vue.esm.js_) including template compiler (instead of the runtime only module _vue/dist/vue.runtime.esm.js_)<br>
1.2. Create a vue instance in main_nospa.ts and add all vue components you intend to use in the .cshtml pages. You also must add data definitions for all v-model attributes.
```<language>
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
```
We mount the vue instance at the "app-nospa" element in __Layout.cshtml_
```<language>
<div id="app-nospa">
    <nav-bar routed="false"></nav-bar>
    <div id="container" class="container">
        @RenderBody()
    </div>
</div>

```
1.3. In this case the cshtml page looks quite simple
```<language>
ViewData["Title"] = "No SPA Page compiled";
<home msg="This Message is set from NoSpa/index.html"></home>
<slider v-model="value"></slider>
<h1 id="slidervalue">{{value}}</h1>

```
**2. If we want to avoid template comilation and reduce the startup time at the client things become more complicated**

2.1. Provide a **window.__createComponent** function in _main_nospa.ts_ for use in the .cshtml pages. It must support all Vue components intended for use in .cshtml pages.
In this case only _vue.runtime.esm.js_ is required.  
```<language>
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
```
2.2. Every component which shall be used in .cshtml pages must implement **beforeMount**. During **beforeMount** the original div element is available in _this.$parent.$el_.
Every property is defined using its _name_ or, if it causes troubles, with _vt_prop:name_. Event handlers are defined with _vt_event:name_. 
```<language>
beforeMount() {
    Helper.processInitProps(this);
}

```
If you require script blocks you must use the _@section scripts" feature because the template compiler will discard all script blocks. 

2.3. Inside the .cshtml page you can create the component (to handle input events from v-model properties, an event handleris used) :
```<language>
ViewData["Title"] = "No SPA Page manually";
<div id="homenospa" init="This Message is set from NoSpa/index.html")"></div>
<div id="slider" v-prop:value="66" v-event:input="setSliderValue" tooltip-styles="{ 'backgroundColor': 'red', 'borderColor': 'red' }"></div>
<h1 id="slidervalue">??</h1>

@section scripts {
    <script lang="javascript">
        window.__createComponent("Home", "#homenospa");
        window.__createComponent("Slider", "#slider");
        var sliderValue = document.getElementById("slidervalue");

        function setSliderValue(inputValue) {
            sliderValue.innerText = inputValue;
        } 
    </script>
}```
   