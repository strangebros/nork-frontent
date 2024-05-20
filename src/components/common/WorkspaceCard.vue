<script setup>
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
</script>

<template>
  <div :class="{ dark: themeStore.darkMode }">
    <h1>WorkspaceCard 컴포넌트 입니다.</h1>
  </div>
</template>

<style scoped></style>
