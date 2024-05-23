<script setup>
import { reactive, onMounted } from "vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import workspaceApi from "@/api/workspaceApi"; // Import workspaceApi correctly

const themeStore = useThemeStore();
const { darkMode } = storeToRefs(themeStore);
const route = useRoute();

const state = reactive({
  currentTab: "reservation",
  poiId: route.query.poiId || "10533498", // Set default poiId to 10533497
  officeImage: "",
  officeName: "",
  roadAddress: "",
  category: "",
  rating: null,
  reservationDate: "",
  selectedTime: "",
  hours: 1,
  minutes: 30,
  taskDescription: "",
  profiles: [],
  reviews: [],
  lastAdjusted: { hours: 1, minutes: 30 },
});

async function fetchWorkspaceData() {
  workspaceApi.search(
    state.poiId,
    (response) => {
      const data = response.data.data;

      console.log("Workspace data:", data); // Log the response data

      state.officeName = data.name || "Unknown";
      state.roadAddress = data.roadAddress || "No address";
      state.category = data.category || "No category";
      state.rating = data.rating != null ? data.rating : "No rating";

      if (Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
        state.officeImage = data.imageUrls[0];
      } else {
        state.officeImage = ""; // default image or placeholder
      }

      if (Array.isArray(data.currentWorkers)) {
        state.profiles = data.currentWorkers.map((worker) => ({
          id: worker.id,
          image: worker.imageUrl, // assuming there is an imageUrl field in worker data
          role: worker.role,
          time: worker.time, // assuming there is a time field in worker data
        }));
      } else {
        state.profiles = [];
      }
    },
    (error) => {
      console.error("Error fetching workspace data:", error);
    }
  );
}

onMounted(() => {
  fetchWorkspaceData();
});

function selectTab(tab) {
  state.currentTab = tab;
  if (tab === "details") {
    fetchReviews();
  }
}

function selectTime(time) {
  state.selectedTime = time;
}

function adjustTime(amount, unit) {
  state.lastAdjusted = { hours: state.hours, minutes: state.minutes };
  if (unit === "hour") {
    state.hours = Math.max(0, state.hours + amount);
  } else if (unit === "minute") {
    let totalMinutes = state.hours * 60 + state.minutes + amount;
    state.hours = Math.floor(totalMinutes / 60);
    state.minutes = totalMinutes % 60;
    if (state.hours < 0 || (state.hours === 0 && state.minutes < 0)) {
      state.hours = 0;
      state.minutes = 0;
    }
  }
}

function registerReservation() {
  // Call the reservation API with the collected data
  // Example: axios.post('/api/reservations', { ... })
}

function clearForm() {
  state.reservationDate = "";
  state.selectedTime = "";
  state.hours = 1;
  state.minutes = 30;
  state.taskDescription = "";
}

async function fetchReviews() {
  // Implement review fetching logic if needed
}
</script>

<template>
  <div
    :class="{
      'dark:bg-background-dark': darkMode,
      'bg-background-light': !darkMode,
      'text-onBackground-light': !darkMode,
      'text-onBackground-dark': darkMode,
    }"
    class="min-h-screen"
  >
    <div class="navbar bg-header-light dark:bg-header-dark">
      <!-- This is the placeholder for the existing navbar -->
    </div>

    <div class="relative text-center">
      <img :src="state.officeImage" alt="Office Image" class="w-full h-auto" />
      <div
        class="absolute top-5 left-5 text-onSurface-light dark:text-onSurface-dark"
      >
        <h1 class="text-4xl font-bold">{{ state.officeName }}</h1>
        <p class="text-2xl">{{ state.roadAddress }}</p>
        <p class="text-2xl">{{ state.category }}</p>
        <p class="text-2xl">Rating: {{ state.rating }}</p>
      </div>
    </div>

    <div class="flex justify-center mt-5">
      <button
        @click="selectTab('reservation')"
        :class="{
          'font-bold border-b-4 border-primary-light dark:border-primary-dark':
            state.currentTab === 'reservation',
        }"
        class="px-6 py-3 text-lg"
      >
        예약
      </button>
      <button
        @click="selectTab('details')"
        :class="{
          'font-bold border-b-4 border-primary-light dark:border-primary-dark':
            state.currentTab === 'details',
        }"
        class="px-6 py-3 text-lg"
      >
        상세정보
      </button>
    </div>

    <!-- 예약 탭 -->
    <div
      v-if="state.currentTab === 'reservation'"
      class="p-10 max-w-5xl mx-auto flex flex-col gap-10"
    >
      <!-- 예약 날짜 및 시간 파트 -->
      <div class="flex flex-col lg:flex-row gap-10">
        <!-- 예약 날짜 파트 -->
        <div class="flex flex-col w-full lg:w-1/2">
          <label class="text-xl font-semibold mb-4"
            >언제 일을 하실 건가요?</label
          >
          <input
            type="date"
            v-model="state.reservationDate"
            class="border p-4 rounded mb-6 w-full text-lg dark:text-black"
          />
          <div class="flex justify-around mt-3">
            <button
              @click="selectTime('dawn')"
              :class="{
                'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark':
                  state.selectedTime === 'dawn',
              }"
              class="px-6 py-3 rounded-lg text-lg mx-2 hover:bg-secondary-light dark:hover:bg-secondary-dark"
            >
              새벽
            </button>
            <button
              @click="selectTime('morning')"
              :class="{
                'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark':
                  state.selectedTime === 'morning',
              }"
              class="px-6 py-3 rounded-lg text-lg mx-2 hover:bg-secondary-light dark:hover:bg-secondary-dark"
            >
              오전
            </button>
            <button
              @click="selectTime('afternoon')"
              :class="{
                'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark':
                  state.selectedTime === 'afternoon',
              }"
              class="px-6 py-3 rounded-lg text-lg mx-2 hover:bg-secondary-light dark:hover:bg-secondary-dark"
            >
              오후
            </button>
            <button
              @click="selectTime('evening')"
              :class="{
                'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark':
                  state.selectedTime === 'evening',
              }"
              class="px-6 py-3 rounded-lg text-lg mx-2 hover:bg-secondary-light dark:hover:bg-secondary-dark"
            >
              저녁
            </button>
          </div>
        </div>

        <!-- 예약 시간 파트 -->
        <div class="flex flex-col w-full lg:w-1/2">
          <label class="text-xl font-semibold mb-4"
            >얼마 동안 일하실 건 가요?</label
          >
          <div
            class="flex justify-center items-center text-2xl font-bold mt-4 mb-8 h-10"
          >
            <transition
              :name="
                state.lastAdjusted &&
                (state.hours < state.lastAdjusted.hours ||
                  state.minutes < state.lastAdjusted.minutes)
                  ? 'slide-down'
                  : 'slide-up'
              "
              mode="out-in"
            >
              <p :key="`${state.hours}-${state.minutes}`">
                {{ state.hours }}시간 {{ state.minutes }}분
              </p>
            </transition>
          </div>
          <div class="flex justify-around mt-3">
            <button
              @click="adjustTime(1, 'hour')"
              class="px-6 py-3 border rounded-lg text-lg mx-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              +1시간
            </button>
            <button
              @click="adjustTime(-1, 'hour')"
              class="px-6 py-3 border rounded-lg text-lg mx-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              -1시간
            </button>
            <button
              @click="adjustTime(10, 'minute')"
              class="px-6 py-3 border rounded-lg text-lg mx-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              +10분
            </button>
            <button
              @click="adjustTime(-10, 'minute')"
              class="px-6 py-3 border rounded-lg text-lg mx-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              -10분
            </button>
          </div>
        </div>
      </div>

      <!-- 할 일 텍스트 박스 -->
      <div class="w-full mt-6">
        <label class="text-xl font-semibold mb-4">어떤 일을 하실 건가요?</label>
        <textarea
          v-model="state.taskDescription"
          placeholder="ex: API 명세서 작성하기, 디자인 시스템 만들기 ..."
          class="border p-4 rounded w-full h-32 text-lg dark:text-black mt-4"
        ></textarea>
      </div>

      <!-- 등록 및 취소 버튼 -->
      <div class="flex justify-center gap-6 mt-6">
        <button
          @click="clearForm"
          class="bg-secondary-light dark:bg-secondary-dark text-onSecondary-light dark:text-onSecondary-dark px-6 py-3 rounded-lg text-lg hover:bg-secondary-dark dark:hover:bg-secondary-light"
        >
          취소
        </button>
        <button
          @click="registerReservation"
          class="bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark px-6 py-3 rounded-lg text-lg hover:bg-primary-dark dark:hover:bg-primary-light"
        >
          등록
        </button>
      </div>
    </div>

    <!-- 상세 탭 -->
    <div
      v-if="state.currentTab === 'details'"
      class="p-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-10"
    >
      <div class="profiles w-full md:w-1/2 overflow-y-auto">
        <div
          v-for="profile in state.profiles"
          :key="profile.id"
          class="profile mb-5 flex flex-col items-center"
        >
          <img
            :src="profile.image"
            alt="Profile Image"
            class="w-20 h-20 rounded-full mb-2"
          />
          <p class="font-semibold text-lg">{{ profile.role }}</p>
          <p>{{ profile.time }}</p>
        </div>
      </div>
      <div class="reviews w-full md:w-1/2 overflow-y-auto">
        <div
          v-for="review in state.reviews"
          :key="review.id"
          class="review-card border p-4 rounded mb-3"
        >
          <p class="font-semibold text-lg">{{ review.date }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.comment }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Transition for sliding effect */
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s ease;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
.slide-down-enter,
.slide-down-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
