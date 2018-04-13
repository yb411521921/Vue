<template>
    <div id="navbar">
        <b-navbar toggleable="md" type="light" variant="light">

            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

            <b-navbar-brand v-if="routed" to="/">Home</b-navbar-brand>
            <b-navbar-brand v-else href="/">Home</b-navbar-brand>

            <b-collapse is-nav id="nav_collapse">
                <b-navbar-nav v-if="routed">
                    <b-nav-item to="/about">AboutR</b-nav-item>
                    <b-nav-item to="/svgtest">SVG Test</b-nav-item>
                    <b-nav-item to="/slidertest">Slider Test</b-nav-item>
                    <b-nav-item href="/nospa">No SPA</b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav v-else>
                    <b-nav-item href="/about">AboutN</b-nav-item>
                    <b-nav-item href="/svgtest">SVG Test</b-nav-item>
                    <b-nav-item href="/slidertest">Slider Test</b-nav-item>
                    <b-nav-item href="/nospa">No SPA</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-form>
                        <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search" />
                        <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                    </b-nav-form>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>
<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    @Component
    export default class NavBar extends Vue {
        @Prop({ default: false }) private routed! :boolean;
    }
</script>
