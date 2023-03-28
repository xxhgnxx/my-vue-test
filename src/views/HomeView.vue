<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable vuejs-accessibility/iframe-has-title -->
<template>

<button @click="testDialog">testDialog</button>
<button @click="getData">getData</button>
<input type="text" v-model="v">
<button @click="message">通信</button>
<button @click="initRef2">初始化ref2</button>
<button @click="initRef22">初始化ref22</button>
<button @click="changeTurn">changeTurn</button>
<div class="item" v-for="d,i in pageData.list" :key="i+d.id+d.v" >
  {{d}}
</div>
<iframe style="height:500px;width: 500px;"
src="https://xueyan.xueersi.com/chess-base-topic/index.html?type=iframe" ref="testRef"></iframe>
<iframe style="height:500px;width: 500px;" src="http://10.14.168.5:8080?type=iframe" ref="testRef2"></iframe>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { createDialog, close } from '@/components/testCom';

const v = ref(0);

const testRef = ref<any>(null);
const testRef2 = ref<any>(null);

const postFn = (d:any) => {
  testRef2.value?.contentWindow.postMessage(d, '*');
  testRef.value?.contentWindow.postMessage(d, '*');
};
window.addEventListener(
  'message',
  (e) => {
    if (e.source !== window) {
      const type = e?.data?.type;
      const data = e?.data?.data || {};
      console.log('getMessage', type, data);
    }
  },
  false,
);

const initRef2 = () => {
  postFn({
    type: 'setupTest',
    data: {
      testInfo: {
        id: 1,
        content: '我是题目一',
        chessJson:
        '{"userCamp":"w","initFen":"r3k2r/1P6/8/8/8/8/1p6/4K3 b - - 0 1","steps":[{"fen":"r4k1r/1P6/8/8/8/8/1p6/4K3 w - - 1 2","color":"b","from":"e8","to":"f8","flags":"n","piece":"k","san":"Kf8"},{"fen":"r4k1r/1P6/8/8/8/8/1p6/5K2 b - - 2 2","color":"w","from":"e1","to":"f1","flags":"n","piece":"k","san":"Kf1"},{"fen":"r5kr/1P6/8/8/8/8/1p6/5K2 w - - 3 3","color":"b","from":"f8","to":"g8","flags":"n","piece":"k","san":"Kg8"},{"fen":"r5kr/1P6/8/8/8/8/1p6/6K1 b - - 4 3","color":"w","from":"f1","to":"g1","flags":"n","piece":"k","san":"Kg1"},{"fen":"r6r/1P4k1/8/8/8/8/1p6/6K1 w - - 5 4","color":"b","from":"g8","to":"g7","flags":"n","piece":"k","san":"Kg7"},{"fen":"r6r/1P4k1/8/8/8/8/1p4K1/8 b - - 6 4","color":"w","from":"g1","to":"g2","flags":"n","piece":"k","san":"Kg2"}]}',
        isAnswered: true,
        starCount: 0,
      },
      userInfo: {
        turnPassed: 3,
        starsCount: 2, // 当前分数 默认3
      },
      showRetryBtn: false, // 是否显示重玩按钮
      animation: true, // 默认true 是否有过渡效果，主要用于切换题目的场景
    },
  });
};
const initRef22 = () => {
  postFn(
    {
      type: 'setupTest',
      data: {
        testInfo: {
          id: 1,
          content: '我是题目二',
          chessJson: '{"initFen":"k7/pp6/2b5/8/8/8/4QK2/4R3 w - - 0 1","steps":[{"fen":"k3Q3/pp6/2b5/8/8/8/5K2/4R3 b - - 1 1","color":"w","from":"e2","to":"e8","flags":"n","piece":"q","san":"Qe8+"},{"fen":"k3b3/pp6/8/8/8/8/5K2/4R3 w - - 0 2","color":"b","from":"c6","to":"e8","flags":"c","piece":"b","captured":"q","san":"Bxe8"},{"fen":"k3R3/pp6/8/8/8/8/5K2/8 b - - 0 2","color":"w","from":"e1","to":"e8","flags":"c","piece":"r","captured":"b","san":"Rxe8#"}]}',
          isAnswered: true,
          starCount: 0,
        },
        userInfo: {
          turnPassed: 3,
          starsCount: 1, // 当前分数 默认3
        },
        showRetryBtn: true, // 是否显示重玩按钮
        animation: true, // 默认true 是否有过渡效果，主要用于切换题目的场景
      },
    },
  );
};
const changeTurn = () => {
  postFn(
    {
      type: 'setRetryBtn',
      data: {
        show: true,
        turnPassed: 2,
      },
    },
  );
};
const message = () => {
  postFn(
    {
      type: 'changeStartCount',
      data: {
        starsCount: v.value,
      },
    },
  );
};
const dataA = {
  list: [
    { id: 1, v: '1' },
    { id: 2, v: '2' },
    { id: 3, v: '3' },
    { id: 4, v: '4' }],
};
const dataB = {
  list: [{ id: 1, v: 'A' },
    { id: 2, v: 'B' },
    { id: 3, v: 'C' },
    { id: 4, v: 'D' }],
};
const pageData:{list:any[]} = reactive(
  {
    list: [],
  },
);
let count = 0;
const getData = () => {
  count += 1;
  Object.assign(pageData, count % 2 ? dataA : dataB);
  // pageData.list = count % 2 ? listA : listB;

  // pageData.list = JSON.parse(JSON.stringify(
  //   count % 2 ? listA : listB,
  // ));
};

let t = false;
const testDialog = () => {
  if (t) {
    t = false;
    close();
  } else {
    createDialog();
    t = true;
  }
};
</script>

<style scoped lang="less">
.item{
  padding: 5px ;
  width: 200px;
  border: 1px solid blue;
  margin: 2px;
}
</style>
