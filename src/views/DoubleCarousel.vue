<template>
  <div class="double-carousel">
    <swiper :options="swiperOptions" ref="outerSwiper">
      <swiper-slide v-for="(item, index) in data" :key="index">
        <div class="inner-carousel-container">
          <swiper :options="swiperOptions" ref="innerSwipers[index]">
            <swiper-slide v-for="(subItem, subIndex) in item" :key="subIndex">
              <div class="carousel-item">{{ subItem }}</div>
            </swiper-slide>
          </swiper>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Swiper, { SwiperOptions } from 'swiper';
import 'swiper/swiper-bundle.css';

export default defineComponent({
  name: 'DoubleCarousel',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const innerSwipers = ref<Swiper[]>([]);
    const swiperOptions: SwiperOptions = {
      direction: 'horizontal',
      slidesPerView: 'auto',
      freeMode: true,
      mousewheel: true,
    };

    onMounted(() => {
      const outerSwiper = new Swiper('.double-carousel .swiper-container', swiperOptions);
      outerSwiper.on('reachEnd', () => {
        const { activeIndex } = outerSwiper;
        if (activeIndex < props.data.length - 1) {
          innerSwipers.value[activeIndex + 1].slideTo(0);
          outerSwiper.slideTo(activeIndex + 1);
        }
      });
      outerSwiper.on('reachBeginning', () => {
        const { activeIndex } = outerSwiper;
        if (activeIndex > 0) {
          innerSwipers.value[activeIndex - 1]
            .slideTo(innerSwipers.value[activeIndex - 1].slides.length - 1);
          outerSwiper.slideTo(activeIndex - 1);
        }
      });
    });

    return { innerSwipers, swiperOptions };
  },
});
</script>

<style>
.double-carousel {
  height: 200px;
}
.inner-carousel-container {
  height: 100%;
}
.carousel-item {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
}
</style>
