<template>
    <g>
        <circle cx="100" cy="100" r="80" v-bind:style="circleStyle"></circle>
        <circle class="circle" cx="100" cy="100" r="20"></circle>
        <polygon class="polygon" v-bind:points="points" v-bind:style="polygonStyle"></polygon>
    </g>
</template>

<script lang="ts">
    import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
    class Point {
        constructor(x: number, y: number) {
            this.x = x; this.y = y;
        }
        x: number;
        y: number;
    };
    @Component
    export default class SvgComponent extends Vue {
        pointsXY: Array<Point> = new Array<Point>();
        strokeWidth: number = 5;
        circleStyle: any = {
            fill: "red",
            stroke: "black",
            strokeWidth: 5
        }
        polygonStyle: any = {
            fill: "blue",
            stroke: "black",
            strokeWidth: 5
        }
        created(): void {
            this.pointsXY.push(new Point(10, 10));
            this.pointsXY.push(new Point(20, 10));
            this.pointsXY.push(new Point(20, 20));
            this.pointsXY.push(new Point(10, 20));
            this.strokeWidth = 5;
            this.circleStyle = {
                fill: "red",
                stroke: "black",
                strokeWidth: 5
            }
            this.polygonStyle = {
                fill: "blue",
                stroke: "black",
                strokeWidth: 5
            }
        }
        get points(): string {
            var str: string = "";
            for (var i = 0; i < this.pointsXY.length; i++) {
                str = str + this.pointsXY[i].x + ',' + this.pointsXY[i].y + ' ';
            }
            return str;
        }
        setOn(): void {
            this.circleStyle.fill = "red";
            //this.circleStyle.strokeWidth = 15;
            this.strokeWidth = 15;
        }
        setOff(): void {
            this.circleStyle.fill = "yellow";
            //this.circleStyle.strokeWidth = 5;
            this.strokeWidth = 5;
        }
        @Watch('strokeWidth')
        onStrokeWidthChange(newVal: number, oldVal: number) {
            //alert("new stroke width " + newVal);
            this.circleStyle.strokeWidth = newVal;
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.polygon {
    fill: green;
    stroke: black;
    opacity: .75;
}

.circle {
    fill: green;
    stroke: blue;
    stroke-width: 20;
}
</style>
