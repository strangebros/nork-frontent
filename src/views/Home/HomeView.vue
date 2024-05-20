<script setup>
import { useRouter } from "vue-router";
import { useThemeStore } from '@/stores/theme';
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const router = useRouter();
const {darkMode} = storeToRefs(themeStore);
</script>

<template>
  <div :class="{ dark: darkMode }">
    <h1>Main 페이지 입니다.</h1>
    <RouterLink to="/map"> map으로 이동 </RouterLink>
  </div>
</template>

<style scoped></style>
