import { GetterTree, MutationTree, ActionTree, ActionContext } from "vuex"

export class ConfigState {
    environment: string = "";
    useCompile: boolean = false;
    cpuLoad: number = 0;
    now: Date = new Date('1970/1/1')
}

const getters = <GetterTree<ConfigState, any>>{
    environment: (state: ConfigState) => state.environment,
    useCompile: (state: ConfigState) => state.useCompile,
    cpuLoad: (state: ConfigState) => state.cpuLoad,
    now: (state: ConfigState) => state.now
};

const mutations = <MutationTree<ConfigState>>{
    setConfig(state: ConfigState, value: any) {
        state.environment = value['environment'];
        state.useCompile = value['useCompile'];
        state.cpuLoad = value['cpuLoad'];
    },
    setNow(state: ConfigState, now: Date) {
        state.now = now;
    }
};

const actions = <ActionTree<ConfigState, any>>{
    setConfig(store: ActionContext<ConfigState, any>, value: any) {
        store.commit('setConfig', value)
    },
    setNow(store: ActionContext<ConfigState, any>, now: Date) {
        store.commit('setNow', now)
    }
};

export const config = {
    state: new ConfigState(),
    getters: getters,
    mutations: mutations,
    actions: actions
};