<template>

  <div class="test-back">
    hgn-ha-ha
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';

defineComponent({
  name: 'myTest',
});

</script>

<style lang="less" scoped>
.test-back{
  background-color: red;
  height: 200px;
  width: 200px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
