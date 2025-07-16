<script setup lang="ts">
import { ref } from '@vue/runtime-core';
import Icon from './Icon.vue';

const n = ref(0);

setInterval(() => {
  n.value++;
  // console.error('n++');
}, 1000);

function handleClick() {
  console.log('click');
}
</script>

<template>
  <screen @click="handleClick">
    Spent Time: {{ n }} s
    <!-- <Icon></Icon> -->
  </screen>
</template>
