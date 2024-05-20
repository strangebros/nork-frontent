<script setup>
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
</script>

<template>
  <div :class="{ dark: themeStore.darkMode }">
    <h1>회원가입 페이지 입니다.</h1>
  </div>
</template>

<style scoped></style>
