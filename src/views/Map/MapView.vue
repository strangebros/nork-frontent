<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useLayoutStore } from "@/stores/layout";
import { useRouter } from "vue-router";
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const layoutStore = useLayoutStore();
const router = useRouter();

onMounted(() => {
  layoutStore.toggleHeader(false);
});

onBeforeUnmount(() => {
  layoutStore.toggleHeader(true);
});
</script>

<template>
  <div :class="{ dark: themeStore.darkMode }">
    <h1>map 페이지 입니다.</h1>
    <RouterLink to="/"> home으로 이동 </RouterLink>
  </div>
</template>

<style scoped></style>
