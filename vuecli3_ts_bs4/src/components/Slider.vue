<template>
    <!-- Translated to TS, originally https://github.com/biigpongsatorn/vue-slide-bar -->
    <div ref="wrap"
         class="vue-slide-bar-component vue-slide-bar-horizontal"
         v-bind:style="calculateMinHeight" v-on:click="wrapClick">
        <div ref="elem" class="vue-slide-bar" v-bind:style="calculateBarHeight">
            <template>
                <div ref="dot"
                     class="vue-slide-bar-always vue-slide-bar-dot"
                     v-bind:style="calculateIconWidth"
                     v-on:mousedown="moveStart"
                     v-on:touchstart="moveStart">
                    <span class="vue-slide-bar-tooltip-top vue-slide-bar-tooltip-wrap" v-if="showTooltip">
                        <slot name="tooltip">
                            <span class="vue-slide-bar-tooltip" v-bind:style="tooltipStyles">{{ val }}</span>
                        </slot>
                    </span>
                </div>
            </template>
            <div ref="process" class="vue-slide-bar-process" v-bind:style="processStyle"></div>
        </div>
        <div v-if="range" class="vue-slide-bar-range">
            <div v-for="(r, index) in range" v-bind:key="index" class="vue-slide-bar-separate" v-bind:style="dataLabelStyles">
                <span v-if="!r.isHide" class="vue-slide-bar-separate-text">
                    {{ r.label }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import Helper from '../helper';

@Component
export default class SliderComponent extends Vue {
    flag: boolean = false;
    size: number = 0;
    currentValue: number = 0;
    isComponentExists: boolean = true;
    interval: number = 1;
    lazy: boolean = false;
    realTime: boolean = false;
    offset: number = 0;
    dataLabelStyles : any = {
        'color': '#4a4a4a',
        'font-family': 'Arial, sans-serif',
        'font-size': '12px'
        // , ...this.$props.labelStyles
    };

    @Prop({ default: null })    private data!: Array<number>;
    @Prop({ default: null })    private range!: Array<number>;
    @Prop({ default: 0.5 })     private speed!: number;
    @Prop({ default: 5 })       private lineHeight!: number;
    @Prop({ default: 20 })      private iconWidth!: number;
    @Prop({ default: 0 })       private value!: number;
    @Prop({ default: 0 })       private min!: number;
    @Prop({ default: 100 })     private max!: number;
    @Prop({ default: true })    private showTooltip!: boolean;
    @Prop({ default: false })   private isDisabled!: boolean;
    @Prop({ default: null })    private tooltipStyles!: object;
    @Prop({ default: null })    private labelStyles!: object;
    @Prop({ default: null })    private processStyle!: object;

    get slider() : any {
        return this.$refs.dot
    }

    get val() {
        return this.data ? this.data[this.currentValue] : this.currentValue
    }
    set val(newVal)  {
        if (this.data) {
            let index = this.data.indexOf(newVal)
            if (index > -1) {
                this.currentValue = index
            }
        } else {
            this.currentValue = newVal
        }
    }
    get currentIndex()  {
        return (this.currentValue - this.minimum) / this.spacing;
    }

    get indexRange() {
        return [0, this.currentIndex];
    }
    get minimum()  {
        return this.data ? 0 : this.min;
    }
    get maximum()  {
        return this.data ? (this.data.length - 1) : this.max;
    }
    get multiple() {
        let decimals = this.interval.toString().split('.')[1];
        return decimals ? Math.pow(10, decimals.length) : 1;
    }
    get spacing()  {
        return this.data ? 1 : this.interval;
    }
    get total()   {
        if (this.data) {
            return this.data.length - 1;
        }
        else if (Math.floor((this.maximum - this.minimum) * this.multiple) % (this.interval * this.multiple) !== 0) {
            this.printError('[VueSlider error]: Prop[interval] is illegal, Please make sure that the interval can be divisible')
        }
        return (this.maximum - this.minimum) / this.interval;
    }
    get gap()  {
        return this.size / this.total;
    }
    get position() {
        let pos = (this.currentValue - this.minimum) / this.spacing * this.gap;
        return pos;
    }
    get limit() {
        return [0, this.size]
    }
    get valueLimit()  {
        return [this.minimum, this.maximum]
    }
    get calculateMinHeight() {
        return this.range ? { minHeight: '100px' } : {}
    }
    get calculateBarHeight() {
        return { height: this.lineHeight + 'px' };
    }
    get calculateIconWidth() {
        return { width: this.iconWidth + 'px' };
    }
    @Watch('value')
    onValueChange(newVal : number, oldVal : number) {
        if (this.flag) this.setValue(newVal, true)
        else this.setValue(newVal, true, this.speed)
    }

    @Watch('max')
    onMaxChange(newVal: number, oldVal: number) {
        if (newVal < this.min) {
            return this.printError('[VueSlider error]: The maximum value can not be less than the minimum value.')
        }
        let resetVal = this.limitValue(this.val)
        this.setValue(resetVal)
        this.refresh()
    }

    @Watch('min')
    onMinChange(newVal: number, oldVal: number) {
        if (newVal > this.max) {
            return this.printError('[VueSlider error]: The minimum value can not be greater than the maximum value.')
        }
        let resetVal = this.limitValue(this.val)
        this.setValue(resetVal)
        this.refresh()
    }

    bindEvents(): void {
        var opt: any = { passive: false };  
        document.addEventListener('touchmove', this.moving, opt)
        document.addEventListener('touchend', this.moveEnd, opt)
        document.addEventListener('mousemove', this.moving)
        document.addEventListener('mouseup', this.moveEnd)
        document.addEventListener('mouseleave', this.moveEnd)
        window.addEventListener('resize', this.refresh)
    }

    unbindEvents() : void {
        window.removeEventListener('resize', this.refresh)
        document.removeEventListener('touchmove', this.moving)
        document.removeEventListener('touchend', this.moveEnd)
        document.removeEventListener('mousemove', this.moving)
        document.removeEventListener('mouseup', this.moveEnd)
        document.removeEventListener('mouseleave', this.moveEnd)
    }

    getPos(e : any) : any {
        this.realTime && this.getStaticData()
        return e.clientX - this.offset
    }

    wrapClick(e : any) : boolean {
        if (this.isDisabled) return false
        let pos = this.getPos(e)
        this.setValueOnPos(pos)
        return true;
    }

    moveStart(e : any, index : number) : void {
        this.flag = true
        this.$emit('drag-start', this)
    }

    moving(e : any) : boolean {
        if (!this.flag) return false
        e.preventDefault()
        if (e.targetTouches && e.targetTouches[0]) e = e.targetTouches[0]
        this.setValueOnPos(this.getPos(e), true)
        return true;
    }

    moveEnd(e : any) : boolean {
        if (this.flag) {
            this.$emit('drag-end', this)
            if (this.lazy && this.isDiff(this.val, this.value)) {
                this.syncValue()
            }
        } else {
            return false
        }
        this.flag = false
        this.setPosition()
        return true;
    }

    setValueOnPos(pos : number, isDrag? : boolean) : void {
        let range : Array<number> = this.limit
        let valueRange : Array<number> = this.valueLimit
        if (pos >= range[0] && pos <= range[1]) {
            this.setTransform(pos)
            let v = (Math.round(pos / this.gap) * (this.spacing * this.multiple) + (this.minimum * this.multiple)) / this.multiple
            this.setCurrentValue(v, isDrag)
        } else if (pos < range[0]) {
            this.setTransform(range[0])
            this.setCurrentValue(valueRange[0])
        } else {
            this.setTransform(range[1])
            this.setCurrentValue(valueRange[1])
        }
    }

    isDiff(a : number, b: number) : boolean {
        return a !== b;
    }

    setCurrentValue(newVal: number, bool? : boolean) : boolean {
        if (newVal < this.minimum || newVal > this.maximum) return false
        if (this.isDiff(this.currentValue, newVal)) {
            this.currentValue = newVal
            if (!this.lazy || !this.flag) {
                this.syncValue()
            }
        }
        bool || this.setPosition()
        return true;
    }

    setIndex(newVal: number) : void {
        newVal = this.spacing * newVal + this.minimum
        this.setCurrentValue(newVal)
    }

    setValue(newVal: number, noCb? : boolean, speed? : number) : void {
        if (this.isDiff(this.val, newVal)) {
            let resetVal = this.limitValue(newVal);
            this.val = resetVal;
            this.syncValue(noCb);
        }
        let self = this;
        this.$nextTick(() => self.setPosition(speed))
    }

    setPosition(speed? : number) : void {
        if (!this.flag) this.setTransitionTime(speed === undefined ? this.speed : speed)
        else this.setTransitionTime(0)
        this.setTransform(Number(this.position))
    }

    setTransform(newVal : number) : void {
        let value = newVal - 8
        let translateValue = 'translateX(' + value + 'px)'
        this.slider.style.transform = translateValue
        this.slider.style.WebkitTransform = translateValue
        this.slider.style.msTransform = translateValue
        var process: any = this.$refs.process;
        process.style.width = newVal + 'px'
        process.style['left'] = 0
    }

    setTransitionTime(time: number): void {
        let tstr = time + 's';
        this.slider.style.transitionDuration = tstr
        this.slider.style.WebkitTransitionDuration = tstr
        var process: any = this.$refs.process;
        process.style.transitionDuration = tstr
        process.style.WebkitTransitionDuration = tstr
    }

    limitValue(newVal : number) : number {
        if (this.data) {
            return newVal
        }
        const inRange = (v : number) => {
            if (v < this.min) {
                this.printError('[VueSlider warn]: The value of the slider is ' + newVal + ', the minimum value is ' + this.min + ', the value of this slider can not be less than the minimum value')
                return this.min
            } else if (v > this.max) {
                this.printError('[VueSlider warn]: The value of the slider is ' + newVal + ', the maximum value is ' + this.max + ', the value of this slider can not be greater than the maximum value')
                return this.max
            }
            return v
        }
        return inRange(newVal)
    }

    syncValue(noCb? : boolean) : void {
        let newVal = this.val
        if (this.range) {
            this.$emit('callbackRange', this.range[<any>this.currentIndex])
        }
        this.$emit('input', newVal)
        noCb || this.$emit('callback', newVal)
    }

    getIndex() : number {
        return this.currentIndex
    }

    getStaticData() : void {
        if (this.$refs.elem) {
            var elem: any = this.$refs.elem;
            this.size = elem.offsetWidth
            this.offset = elem.getBoundingClientRect().left
        }
    }

    refresh() : void {
        if (this.$refs.elem) {
            this.getStaticData()
            this.setPosition()
        }
    } 

    printError(msg : string) : void {
        console.error(msg)
    }

    beforeMount() : void {
        Helper.processInitProps(this);
    }
    mounted(): void {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return this.printError('[VueSlider error]: window or document is undefined, can not be initialization.')
        }
        let self = this;
        this.$nextTick(() => {
            if (self.isComponentExists) {
                self.getStaticData()
                self.setValue(this.limitValue(this.value), true, 0)
                self.bindEvents()
            }
        })
    }
    beforeDestroy() : void {
        this.isComponentExists = false
        this.unbindEvents()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.vue-slide-bar-component {
    position: relative;
    box-sizing: border-box;
    user-select: none;
    padding-top: 40px !important;
}

.vue-slide-bar {
    position: relative;
    display: block;
    border-radius: 15px;
    background-color: #d8d8d8;
    cursor: pointer;
}

    .vue-slide-bar::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
    }

.vue-slide-bar-process {
    position: absolute;
    border-radius: 15px;
    background-color: #1066FD;
    transition: all 0s;
    z-index: 1;
    width: 0;
    height: 100%;
    top: 0;
    left: 0;
    will-change: width;
}

.vue-slide-bar-dot {
    position: absolute;
    transition: all 0s;
    will-change: transform;
    cursor: pointer;
    z-index: 3;
    left: 0;
    top: -16px;
}

.vue-slide-bar-tooltip-wrap {
    /* display: none; */
    position: absolute;
    z-index: 9;
    width: 100%;
    height: 100%;
    display: block !important;
}

.vue-slide-bar-tooltip-top {
    top: -12px;
    left: 40%;
    transform: translate(-50%, -100%);
}

.vue-slide-bar-tooltip {
    position: relative;
    font-size: 14px;
    white-space: nowrap;
    padding: 2px 5px;
    min-width: 20px;
    text-align: center;
    color: #fff;
    border-radius: 5px;
    border: 1px solid #1066FD;
    background-color: #1066FD;
}

    .vue-slide-bar-tooltip::before {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-top-color: inherit;
        transform: translate(-50%, 0);
    }

.vue-slide-bar-range {
    display: flex;
    padding: 5px 0;
    justify-content: space-between;
}

.vue-slide-bar-separate {
    position: relative;
    width: 2px;
    background-color: #9e9e9e;
    height: 5px;
}

.vue-slide-bar-separate-text {
    text-align: center;
    position: absolute;
    white-space: nowrap;
    transform: translate(-50%, 0);
    top: 6px;
}
</style>
