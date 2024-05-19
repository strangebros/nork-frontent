<script setup>
import { ref } from "vue";
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

// const toggleTheme = () => {
  
// };
</script>

<template>
  <header class="header" :class="{ dark: themeStore.darkMode }">
    <router-link to="/" class="logo">
      <img src="@/assets/img/logo/navbar_logo.svg" alt="Logo" />
    </router-link>
    <div class="right-section">
      <button class="theme-button" @click="toggleTheme">
        <i :class="themeIconClass"></i>
      </button>
      <p class="bg-background-light dark:bg-background-dark">asdasd</p>
      <router-link to="/login" class="login-button">로그인</router-link>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f5f5f5;
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
  background-color: #5271ff;
  color: white;
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
