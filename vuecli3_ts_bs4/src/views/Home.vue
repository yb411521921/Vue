<template>
    <div class="home">
        <img src="../assets/logo.png">
        <hello-world v-bind:msg="init" />
        <b-button variant="primary" v-on:click="buttonClicked">Boostrap-vue Button</b-button>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
    @Prop({ default: 'Not Initialized' }) private init!: string;
    buttonClicked() {
        alert('Bootstrap-Vue button clicked');
    }
    beforeMount() {
        if (this.$parent.$el) {
            var jsonData = decodeURIComponent(<any>this.$parent.$el.getAttribute("data-init-vue"));
            if (jsonData) {
                var initData = JSON.parse(jsonData);
                for(var propertyName in initData) {
                    (<any>this)._props[propertyName] = initData[propertyName];
                }
            }
        }
    }
}
</script>
