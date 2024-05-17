<script setup>
import { computed } from "vue";
import { RouterView } from "vue-router";
import { useLayoutStore } from "@/stores/layout";
import Header from "@/components/layout/Header.vue";

const layoutStore = useLayoutStore();
const showHeader = computed(() => layoutStore.showHeader);
</script>

<template>
  <Header v-if="showHeader" />
  <RouterView />
</template>

<style scoped></style>
