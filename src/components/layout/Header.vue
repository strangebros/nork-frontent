<script setup>
import { ref } from "vue";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "@/stores/auth";
import memberApi from "@/api/memberApi";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const authStore = useAuthStore();
const { darkMode } = storeToRefs(themeStore);
const { member } = storeToRefs(authStore);
const themeIconClass = ref(darkMode ? "fas fa-sun" : "fas fa-moon");

let memberInfo = ref({});
if (member.value != null) {
  memberApi.getMemberInfo(
    member.value.id,
    (response) => {
      memberInfo.value = response.data.data;
    },
    (error) => {}
  );
}

const toggleTheme = () => {
  let prevDark = darkMode;
  themeStore.toggleTheme();

  if (prevDark) {
    themeIconClass.value = "fas fa-sun rotating-icon";
    setTimeout(() => {
      themeIconClass.value = "fas fa-moon rotating-icon";
    }, 250); // Halfway through the animation (0.25s)
  } else {
    themeIconClass.value = "fas fa-moon rotating-icon";
    setTimeout(() => {
      themeIconClass.value = "fas fa-sun rotating-icon";
    }, 250); // Halfway through the animation (0.25s)
  }

  // Remove the rotation class after the animation is complete
  setTimeout(() => {
    themeIconClass.value = prevDark ? "fas fa-moon" : "fas fa-sun";
  }, 500); // Rotation animation duration
};
</script>

<template>
  <div :class="{ dark: darkMode }">
    <header class="header bg-header-light dark:bg-header-dark">
      <router-link to="/" class="logo">
        <img src="@/assets/img/logo/navbar_logo.svg" alt="Logo" />
      </router-link>
      <div class="right-section">
        <button
          class="theme-button color-primary-light dark:color-primary-dark"
          @click="toggleTheme"
        >
          <i :class="themeIconClass"></i>
        </button>

        <router-link
          v-if="memberInfo == null"
          to="/login"
          class="login-button bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark"
          >로그인</router-link
        >
      </div>
    </header>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.logo img {
  height: 50px;
  cursor: pointer;
}

.right-section {
  display: flex;
  align-items: center;
}

.theme-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #5271ff;
  margin-right: 20px;
}

.rotating-icon {
  animation: rotate 0.5s cubic-bezier(0.42, 0, 0.58, 1);
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.login-button {
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
  }

  .logo img {
    height: 40px;
  }

  .theme-button {
    margin: 10px 0;
  }

  .login-button {
    padding: 8px 16px;
  }
}
</style>
