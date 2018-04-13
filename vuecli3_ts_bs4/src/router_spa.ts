import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import SvgTest from './views/SvgTest.vue'
import SliderTest from './views/SliderTest.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
    {
        path: '/',
        name: 'home',
        component: Home,
        props: { init: "This Message is set from vue-router" }
    },
    {
        path: '/about',
        name: 'about',
        component: About,
        props: {}
    },
    {
        path: '/svgtest',
        name: 'svgtest',
        component: SvgTest,
        props: {}
    },
    {
        path: '/slidertest',
        name: 'slidertest',
        component: SliderTest,
        props: {}
    }
  ]
})
