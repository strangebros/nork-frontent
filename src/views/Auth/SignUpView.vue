<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import defaultProfileImage from "@/assets/img/default_profile_image";
import VueCropper from "@ballcat/vue-cropper";
import "cropperjs/dist/cropper.css";

import base64 from "@/util/base64";

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
  profileImage: "",
});

// crop 전 임시 이미지
const tempProfileImage = ref("");

const vueCropperRef = ref(null);

const cropperOptions = reactive({
  aspectRatio: 1 / 1,
  viewMode: 0,
  responsive: true,
  restore: true,
  checkCrossOrigin: true,
  checkOrientation: true,
  modal: true,
  guides: true,
  center: true,
  highlight: true,
  background: true,
  autoCrop: true,
  movable: true,
  rotatable: true,
  scalable: true,
  zoomable: false,
  cropBoxMovable: true,
  cropBoxResizable: true,
  toggleDragModeOnDblclick: true,
});

onMounted(() => {});

const isOpen = ref(false);

function closeModal() {
  isOpen.value = false;
}

function profileImageConfirm() {
  isOpen.value = false;
  cropImage();
}

function openModal() {
  isOpen.value = true;
}

function cropImage() {
  signupForm.value.profileImage = vueCropperRef.value
    .getCroppedCanvas()
    .toDataURL()
    .split(",")[1];
}

const uploadProfileImage = (files) => {
  base64(files[0], (e) => {
    tempProfileImage.value = e.target.result.split(",")[1];
    openModal();
  });
};

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
                  프로필 이미지 등록
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 mb-3">
                    등록을 원하는 부분을 지정해 주세요.
                  </p>
                </div>
                <div>
                  <vue-cropper
                    ref="vueCropperRef"
                    :src="`data:image/png;base64,${tempProfileImage}`"
                    v-bind="cropperOptions"
                  />
                </div>
                <div class="mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-light dark:bg-primary-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="profileImageConfirm"
                  >
                    등록
                  </button>
                  <button
                    type="button"
                    class="ml-2 inline-flex justify-center rounded-md border border-transparent bg-error-light dark:bg-error-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeModal"
                  >
                    취소
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <div
      class="signup-box w-full sm:w-2/3 md:w-1/2 bg-background-light dark:bg-background-light"
    >
      <img
        src="@/assets/img/logo/content_logo.svg"
        alt="Logo"
        class="signup-logo"
      />
      <h1 class="signup-title text-base">회원가입</h1>
      <form @submit.prevent="signup" class="signup-form flex flex-col w-full">
        <div class="flex">
          <div class="w-1/2 flex flex-col">
            <p class="text-xs font-semibold mb-0.5">프로필 이미지</p>

            <img
              class="w-4/5 object-cover"
              :src="`data:image/png;base64,${
                signupForm.profileImage == ''
                  ? defaultProfileImage
                  : signupForm.profileImage
              }`"
              alt="프로필 이미지"
            />
            <input
              type="file"
              id="profile-image"
              @change.prevent="uploadProfileImage($event.target.files)"
              hidden
            />
            <label
              class="mt-3 bg-primary-light dark:bg-primary-dark w-fit p-3 rounded-md text-white"
              for="profile-image"
              >등록</label
            >
          </div>
          <div class="w-1/2 flex flex-col">
            <label class="text-xs font-semibold mb-0.5" for="id">
              이메일
            </label>
            <input
              id="id"
              type="text"
              v-model.trim="signupForm.email"
              required
              placeholder="이메일"
              class="signup-input"
            />

            <label class="text-xs font-semibold mb-0.5" for="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              v-model.trim="signupForm.password"
              required
              placeholder="비밀번호"
              class="signup-input"
            />

            <label class="text-xs font-semibold mb-0.5" for="nickname">
              닉네임
            </label>

            <input
              id="nickname"
              type="text"
              v-model.trim="signupForm.nickname"
              required
              placeholder="닉네임"
              class="signup-input"
            />

            <label class="text-xs font-semibold mb-0.5" for="position">
              포지션
            </label>
            <input
              id="position"
              type="text"
              v-model.trim="signupForm.position"
              placeholder="포지션"
              class="signup-input"
            />

            <label class="text-xs font-semibold mb-0.5" for="birthdate">
              생년월일
            </label>
            <input
              id="birthdate"
              type="date"
              v-model.trim="signupForm.birthdate"
              placeholder="생년월일"
              class="signup-input"
            />
          </div>
        </div>

        <input
          type="submit"
          value="회원가입"
          class="signup-button text-white bg-primary-light dark:bg-primary-dark mt-3"
        />
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
