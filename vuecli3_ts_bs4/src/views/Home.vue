<template>
    <div class="home">
        <img src="../assets/logo.png">
        <hello-world v-bind:msg="init" />
        <configuration></configuration>
        <b-button variant="primary" v-on:click="buttonClicked">Boostrap-vue Button</b-button>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; 
import Configuration from '@/components/Configuration.vue'; 
import Helper from '../helper';
@Component({
  components: {
      HelloWorld,
      Configuration
  },
})
export default class Home extends Vue {
    @Prop({ default: 'Not Initialized' }) private init!: string;
    buttonClicked() {
        alert('Bootstrap-Vue button clicked');
    }
    beforeMount() {
        Helper.processInitProps(this);
    }
}
</script>
