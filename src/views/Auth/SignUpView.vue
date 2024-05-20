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

const signupForm = ref({
  email: "",
  password: "",
  nickname: "",
  position: "",
  date: "",
});

const isOpen = ref(false);

function closeModal() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}

const signup = async () => {
  let result = await authStore.signUp(signupForm.value);

  if (result) {
    router.push("/");
  } else {
    openModal();
  }
};
</script>

<template>
  <div
    class="signup-container bg-background-light dark:bg-background-dark"
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
                  회원가입에 실패했습니다.
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
    <div class="signup-box w-96 bg-background-light dark:bg-background-light">
      <img
        src="@/assets/img/logo/content_logo.svg"
        alt="Logo"
        class="signup-logo"
      />
      <h1 class="signup-title text-base">회원가입</h1>
      <form @submit.prevent="signup" class="signup-form">
        <label>
          <input
            type="text"
            v-model.trim="signupForm.email"
            required
            placeholder="아이디"
            class="signup-input"
          />
        </label>
        <label>
          <input
            type="password"
            v-model.trim="signupForm.password"
            required
            placeholder="비밀번호"
            class="signup-input"
          />
        </label>
        <label>
          <input
            type="text"
            v-model.trim="signupForm.nickname"
            required
            placeholder="닉네임"
            class="signup-input"
          />
        </label>
        <label>
          <input
            type="text"
            v-model.trim="signupForm.position"
            required
            placeholder="포지션"
            class="signup-input"
          />
        </label>
        <label class="text-xs font-semibold">
          생년월일
          <input
            type="date"
            v-model.trim="signupForm.birthdate"
            required
            placeholder="생년월일"
            class="signup-input text-base font-normal mt-0.5"
          />
        </label>

        <input type="submit" value="회원가입" class="signup-button" />
      </form>
    </div>
  </div>
</template>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.signup-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.signup-logo {
  width: 100px;
  margin-bottom: 20px;
}

.signup-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.signup-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.signup-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.signup-button {
  width: 100%;
  padding: 10px;
  background-color: #5271ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.signup-button:hover {
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
