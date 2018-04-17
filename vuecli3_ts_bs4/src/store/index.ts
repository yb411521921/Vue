import Vue from 'vue'
import Vuex, { mapState, mapActions } from 'vuex'
import { config, ConfigState } from './modules/config'

const debug = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);

export default new Vuex.Store<ConfigState>({
    modules: {
        config
    },
    /*
    computed: {
        ...mapState('config/module', ['environment', 'useCompile'])
    },
    methods: {
        ...mapActions([
            'config/setConfig',
            'config/setNow'
        ])
    },
    */
    strict: debug
})