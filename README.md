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

**While the SPA part is straight forward I had to use some tricky constructs to allow usage of Vue components in .cshtml pages:**

1. Providing a **window.__createComponent** function in _main_nospa.ts_ for use in the .cshtml pages. It must support all Vue components intended for use in .cshtml pages.
```<language>
(<any>window).__createComponent = function (name: string, mountpoint: string, handler : any) : any {
    var vue: Vue;
    switch (name) {
        case "NavBar":  vue = new Vue({ render: h => h(NavBar) });  break;
        case "Home":    vue = new Vue({ render: h => h(Home) });    break;
        case "Slider":  vue = new Vue({ render: h => h(Slider) });  break;
        default:
            return null;
    }
    Helper.mountAndInstallHandler(vue, mountpoint, handler);
    return vue;
}
```
Inside the .cshtml page you can create the component (to handle input events from v-model properties, event handlers can be provided) :
```<language>
<div id="slider" data-init-vue="@System.Uri.EscapeUriString("{ \"value\": \"50\"}")"></div>
<h1 id="slidervalue">??</h1>
@section scripts {
    <script lang="javascript">
        var sliderValue = document.getElementById("slidervalue");
        window.__createComponent("Slider", "#slider", {
            type: 'input',
            function: function(inputValue) {
                sliderValue.innerText = inputValue;
            }
        });
    </script>
}
```
2. Set properties of components. As shown above I added an attribute **data-init-vue** in the div which is replaced by the Vue component. This attribute contains a "uri-escaped" JSON object containing the properties and its values. 
Every component which shall be used in .cshtml pages must implement **beforeMount**. During **beforeMount** the original div element is available in _this.$parent.$el_.
```<language>
beforeMount() {
    Helper.processDataInitVue(this);
}
```
   