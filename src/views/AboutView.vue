<template>
  <div class="carousel">
    <div class="outer-carousel">
      <div class="carousel-wrapper" ref="outerCarousel">
        <div class="carousel-item" v-for="(innerItems, index) in items" :key="index">
          <div class="inner-carousel" @touchstart="onTouchStart($event, index)" @touchmove="onTouchMove($event, index)" @touchend="onTouchEnd($event, index)">
            <div class="carousel-wrapper" ref="innerCarousels" :style="{transform: `translateX(${innerCarouselPositions[index]}px)`}">
              <div class="carousel-item" v-for="(item, innerIndex) in innerItems" :key="innerIndex">{{ item }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  name: 'Carousel',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const outerCarousel = ref<HTMLElement>();
    const innerCarousels = ref<HTMLElement[]>([]);
    const positions = reactive({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0,
      isScrolling: false,
    });
    const innerCarouselPositions = reactive(new Array(props.items.length).fill(0));

    const onTouchStart = (event: TouchEvent, index: number) => {
      positions.startX = event.touches[0].pageX;
      positions.startY = event.touches[0].pageY;
      positions.currentX = positions.startX;
      positions.currentY = positions.startY;
      positions.isScrolling = false;
    };

    const onTouchMove = (event: TouchEvent, index: number) => {
      positions.currentX = event.touches[0].pageX;
      positions.currentY = event.touches[0].pageY;
      positions.deltaX = positions.currentX - positions.startX;
      positions.deltaY = positions.currentY - positions.startY;

      // 判断是否为垂直滑动
      if (Math.abs(positions.deltaY) > Math.abs(positions.deltaX)) {
        positions.isScrolling = true;
        return;
      }

      event.preventDefault();

      // 滑动内层轮播图
      const innerCarousel = innerCarousels.value[index];
      const innerCarouselWidth = innerCarousel.offsetWidth;
      let innerCarouselPosition = innerCarouselPositions[index] - positions.deltaX;
      innerCarouselPosition = Math.max(Math.min(innerCarouselPosition, 0), -(innerCarouselWidth - outerCarousel.value.offsetWidth));
      innerCarouselPositions[index] = innerCarouselPosition;
    };

    const onTouchEnd = (event: TouchEvent, index: number) => {
      if (positions.isScrolling) {
        return;
      }

      // 滑动外层轮播图
      const outerCarouselWidth = outerCarousel.value.offsetWidth;
      let outerCarouselPosition = -index * outerCarouselWidth;
      if (positions.deltaX > 0 && index > 0) {
        outerCarouselPosition += outerCarouselWidth;
      } else if (positions.deltaX < 0 && index < props.items.length - 1) {
        outerCarouselPosition -= outerCarouselWidth;
      }
      outerCarouselPosition = Math.max(Math.min(outerCarouselPosition, 0), -(props.items.length - 1) * outerCarouselWidth);
      outerCarousel.value.style.transform = `translateX(${outerCarouselPosition}px)`;
    };

    return {
      outerCarousel,
      innerCarousels,
      positions,
      innerCarouselPositions,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    };
  },
});
</script>

<style scoped>
.carousel {
  overflow: hidden;
}

.carousel-wrapper {
  display: flex;
  transition: transform 0.3s ease-out;
}

.carousel-item {
  flex-shrink: 0;
}

.inner-carousel {
  overflow: hidden;
}

.inner-carousel .carousel-wrapper {
  display: flex;
}

.inner-carousel .carousel-item {
  flex-shrink: 0;
}
</style>
