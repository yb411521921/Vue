<template>
    <div class="about">
        <h1>This is an about page and a short test of boostrap-vue buttons</h1>
        <div class="row">
            <button type="button" class="btn btn-primary" v-on:click="pressed">Primary</button>
            <b-button variant="primary" @click="pressed">I am a Button</b-button>
            <div>
                <b-dropdown id="ddown1" v-bind:text="name" class="m-md-2">
                    <b-dropdown-item v-on:click="select('First Action')">First Action</b-dropdown-item>
                    <b-dropdown-item v-on:click="select('Second Action')">Second Action</b-dropdown-item>
                    <b-dropdown-item v-on:click="select('Third Action')">Third Action</b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item>Something else here...</b-dropdown-item>
                    <b-dropdown-item disabled>Disabled action</b-dropdown-item>
                </b-dropdown>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class About extends Vue {
    name: string = "Select an action";

    pressed(): void {
        alert('button pressed');
    }
    select(action: string) : void {
        this.name = action;
    }
}
</script>
