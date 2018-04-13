<template>
    <div class="svgtest">
        <h1>SVG Test</h1>

        <svg width="200" height="200">
            <my-svg ref="svg1"></my-svg>
        </svg>
        <button v-on:click="clickOn">On</button>
        <button v-on:click="clickOff">Off</button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MySvg from '@/components/Svg.vue';

@Component({
  components: {
    MySvg,
  },
})
export default class SvgTest extends Vue { 
    clickOn(): void {
        var ele: any = this.$refs.svg1;
        ele.setOn();
        ele.polygonStyle.fill = "red";
    }
    clickOff(): void {
        var ele: any = this.$refs.svg1;
        ele.polygonStyle.fill = "yellow";
        ele.setOff();
    }
}
</script>
