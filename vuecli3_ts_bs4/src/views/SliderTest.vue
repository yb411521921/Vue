<template>
    <div class="col-sm-12">
        <h1>Slider Test</h1>
        <slider-bar v-model="value1" />
        <h2>Value: {{value1}}</h2>
        <button type="button" name="button" v-on:click="value1 = 90">+</button>
        <button type="button" name="button" v-on:click="value1 = 20">-</button>
        <br><br>

        <slider-bar v-model="slider.value"
                              :data="slider.data"
                              :range="slider.range"
                              :labelStyles="{ 'color': '#777', 'font-family': 'Helvetica, sans-serif' }"
                              :processStyle="{ backgroundColor: '#d8d8d8' }"
                              @callbackRange="callbackRange">
            <template slot="tooltip" slot-scope="tooltip">
                <img src="../assets/rectangle-slider.svg">
            </template>
        </slider-bar>
        <h2>Value: {{slider.value}}</h2>
        <h2>Label: {{rangeValue.label}}</h2>
        <br><br>

        <slider-bar v-model="value2"
                              :min="1"
                              :max="10"
                              :processStyle="slider.processStyle"
                              :lineHeight="slider.lineHeight"
                              :tooltipStyles="{ backgroundColor: 'red', borderColor: 'red' }">
        </slider-bar>
        <h2>Value: {{value2}}</h2>
        <br><br>

        <slider-bar v-model="loading"
                              :showTooltip="false"
                              :lineHeight="20"
                              :isDisabled="true" />
        <br>
        <button type="button" name="button" v-on:click="startLoad">
            Click to start load
        </button>
        <h2>Loading: {{loading}}%</h2>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import SliderBar from '@/components/Slider.vue';

    @Component({
      components: {
          SliderBar,
      },
    })
    export default class SliderTest extends Vue {
        value1: number = 50;
        loader: any = null;
        rangeValue: any = {};
        value2: number = 8;
        loading: number = 0;
        switchReassign: boolean = false;
        slider: any = {
            value: 45,
            data: [
                15,
                30,
                45,
                60,
                75,
                90,
                120
            ],
            range: [
                {
                    label: '15 mins'
                },
                {
                    label: '30 mins',
                    isHide: true
                },
                {
                    label: '45 mins'
                },
                {
                    label: '1 hr',
                    isHide: true
                },
                {
                    label: '1 hr 15 mins'
                },
                {
                    label: '1 hr 30 mins',
                    isHide: true
                },
                {
                    label: '2 hrs'
                }
            ],
            lineHeight: 10,
            processStyle: {
                backgroundColor: 'red'
            }
        }

        callbackRange(val: any): void {
            this.rangeValue = val
        }

        startLoad(): void {
            var self = this;
            this.loader = setInterval(() => {
                self.loading++;
                if (self.loading === 100) {
                    clearInterval(self.loader)
                }
            }, 100)
        }
    }
</script>
