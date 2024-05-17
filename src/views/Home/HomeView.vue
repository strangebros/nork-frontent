<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div>
    <h1>Main 페이지 입니다.</h1>
    <RouterLink to="/map"> map으로 이동 </RouterLink>
  </div>
</template>

<style scoped></style>
