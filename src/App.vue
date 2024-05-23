<script setup>
import { computed, ref } from "vue";
import { RouterView } from "vue-router";
import { useLayoutStore } from "@/stores/layout";
import Header from "@/components/layout/Header.vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const layoutStore = useLayoutStore();
const { darkMode } = storeToRefs(themeStore);

const showHeader = computed(() => layoutStore.showHeader);
</script>

<template>
  <div class="" :class="{ dark: darkMode }">
    <Header v-if="showHeader" />
    <RouterView class="h-full bg-background-light dark:bg-background-dark" />
  </div>
</template>

<style scoped></style>
