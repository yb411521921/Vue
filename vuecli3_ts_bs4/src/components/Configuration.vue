<template>
    <div>
        <h3>Environment {{ environment }}</h3>
        <h3>UseCompile {{ useCompile }}</h3>
        <h3>CpuLoad {{ cpuLoad }}</h3>
        <h3>Now {{ now }}</h3>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import store from '../store'

@Component
export default class Configuration extends Vue {
    get environment () : string {
        return this.$store.state.config.environment;
    }
    get useCompile () : boolean {
        return this.$store.state.config.useCompile;
    }
    get cpuLoad () : number {
        return this.$store.state.config.cpuLoad;
    }
    get now(): Date {
        return this.$store.state.config.now;
    }
}
</script>

