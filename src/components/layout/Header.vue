<script setup>
import { ref, watch } from "vue";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "@/stores/auth";
import memberApi from "@/api/memberApi";
import { storeToRefs } from "pinia";
import defaultProfileImage from "@/assets/img/default_profile_image";

// drop down
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const themeStore = useThemeStore();
const authStore = useAuthStore();
const { darkMode } = storeToRefs(themeStore);
const { member } = storeToRefs(authStore);
const themeIconClass = ref(darkMode ? "fas fa-sun" : "fas fa-moon");

let memberInfo = ref(null);
watch(member, (newValue, prevValue) => {
  if (newValue == null) {
    memberInfo.value = null;
    return;
  }

  // GUEST 일 경우 무시
  if (newValue.role == "GUEST") {
    memberInfo.value = null;
    return;
  }

  memberApi.getMemberInfo(
    newValue.id,
    (response) => {
      memberInfo.value = response.data.data;
    },
    (error) => {}
  );
});

if (member.value != null && member.value.role != "GUEST") {
  memberApi.getMemberInfo(
    member.value.id,
    (response) => {
      memberInfo.value = response.data.data;
    },
    (error) => {}
  );
}

const logout = () => {
  authStore.logout();
  memberInfo.value = null;
};

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
          <i :class="themeIconClass" class="mr-3"></i>
        </button>
        <Menu
          v-if="memberInfo != null"
          as="div"
          class="relative inline-block text-left z-50"
        >
          <div>
            <MenuButton
              class="inline-flex border border-grey dark:border-header-dark justify-center rounded-full bg-black/20 h-11 w-11 hover:bg-black/30 focus:outline-none"
            >
              <img
                class="rounded-full"
                :src="`data:image/png;base64,${
                  memberInfo.profileImage == null ||
                  memberInfo.profileImage == ''
                    ? defaultProfileImage
                    : memberInfo.profileImage
                }`"
              />
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active
                        ? 'bg-primary-light dark:bg-primary-dark text-white'
                        : 'text-primary-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    마이페이지
                  </button>
                </MenuItem>
              </div>

              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    @click.prevent="logout"
                    :class="[
                      active ? 'bg-red-500 text-white' : 'text-red-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    로그아웃
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
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

@media (max-width: 350px) {
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
