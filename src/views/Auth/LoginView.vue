<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

const themeStore = useThemeStore();
const authStore = useAuthStore();
const router = useRouter();

const { darkMode } = storeToRefs(themeStore);

const loginForm = ref({
  email: "",
  password: "",
});

const isOpen = ref(false);

function closeModal() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}

const login = async () => {
  let result = await authStore.login(loginForm.value);

  if (result) {
    router.push("/");
  } else {
    openModal();
  }
};
</script>

<template>
  <div
    class="login-container bg-background-light dark:bg-background-dark"
    :class="{ dark: darkMode }"
  >
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  로그인에 실패했습니다.
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    아이디 또는 비밀번호를 확인 후 다시 시도해 주세요.
                  </p>
                </div>

                <div class="mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-light dark:bg-primary-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeModal"
                  >
                    확인
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <div class="login-box bg-background-light dark:bg-background-light">
      <img
        src="@/assets/img/logo/content_logo.svg"
        alt="Logo"
        class="login-logo"
      />
      <h1 class="login-title text-base">로그인</h1>
      <form @submit.prevent="login" class="login-form">
        <label>
          <input
            type="text"
            v-model.trim="loginForm.email"
            required
            placeholder="아이디"
            class="login-input"
          />
        </label>
        <label>
          <input
            type="password"
            v-model.trim="loginForm.password"
            required
            placeholder="비밀번호"
            class="login-input"
          />
        </label>
        <input type="submit" value="로그인" class="login-button" />
      </form>
      <p class="signup-ment text-xs">
        아직 계정이 없으신가요?
        <router-link to="/signUp" class="signup-link">회원가입하기</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-logo {
  width: 100px;
  margin-bottom: 20px;
}

.login-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.login-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #5271ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-button:hover {
  background-color: #405bdb;
}

.signup-ment {
  margin-top: 20px;
  color: #666;
}

.signup-link {
  color: #5271ff;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}
</style>
