<script setup>
import { computed, ref } from "vue";
import { RouterView } from "vue-router";
import { useLayoutStore } from "@/stores/layout";
import Header from "@/components/layout/Header.vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import ChatBot from "@/components/chatbot/ChatBot.vue";

const isChatOpen = ref(false);

const themeStore = useThemeStore();
const layoutStore = useLayoutStore();
const { darkMode } = storeToRefs(themeStore);

const showHeader = computed(() => layoutStore.showHeader);

// 외부 클릭 감지를 위한 함수
const handleClickOutside = (event) => {
  const chatbotElement = document.querySelector(".chatbot");
  const chatbotIcon = document.querySelector(".chatbot-icon");
  if (
    isChatOpen.value &&
    chatbotElement &&
    !chatbotElement.contains(event.target) &&
    !chatbotIcon.contains(event.target)
  ) {
    isChatOpen.value = false;
  }
};

// 페이지 전체에 클릭 이벤트 리스너 추가
document.addEventListener("click", handleClickOutside);
</script>

<template>
  <div class="" :class="{ dark: darkMode }">
    <Header v-if="showHeader" />
    <RouterView class="h-full bg-background-light dark:bg-background-dark" />

    <ChatBot
      :isChatOpen="isChatOpen"
      @toggleChat="isChatOpen = !isChatOpen"
      @openChat="isChatOpen = true"
    />
  </div>
</template>

<style scoped></style>
