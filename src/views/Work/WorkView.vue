<script setup>
import { useThemeStore } from '@/stores/theme';
import { storeToRefs } from 'pinia';

const themeStore = useThemeStore();
const {darkMode} = storeToRefs(themeStore);
</script>

<template>
  <div :class="{ dark: darkMode }">
    <h1>work 페이지 입니다.</h1>
  </div>
</template>

<style scoped></style>
