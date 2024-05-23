<script setup>
import { reactive, onMounted, watch } from "vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import workspaceApi from "@/api/workspaceApi";
import reviewsApi from "@/api/reviewsApi";
import reservationApi from "@/api/reservationApi"; // 예약 API 임포트
import cafeImage from "@/assets/img/workspace/cafe_1.jpg";
import draggable from "vuedraggable"; // 추가: vuedraggable import

const themeStore = useThemeStore();
const { darkMode } = storeToRefs(themeStore);
const route = useRoute();

const state = reactive({
  currentTab: "reservation",
  poiId: route.params.poiId || "10533498",
  workspaceId: null,
  officeImage: cafeImage,
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
  reviewPage: 1,
  reviewCount: 5,
  hasMoreReviews: true,
  keywords: [], // 추가: keywords 상태
  currentKeyword: "" // 추가: currentKeyword 상태
});

async function fetchWorkspaceData() {
  console.log("poiID 값:", state.poiId);
  workspaceApi.search(
    state.poiId,
    (response) => {
      const data = response.data.data;

      console.log("Workspace data:", data);

      state.officeName = data.name || "Unknown";
      state.roadAddress = data.roadAddress || "No address";
      state.category = data.category || "No category";
      state.rating = data.rating != null ? data.rating : "No rating";
      state.workspaceId = data.id;

      if (Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
        state.officeImage = "data:image/png;base64," + data.imageUrls[0];
      } else {
        state.officeImage = cafeImage; // Use local cafe image as default
      }

      if (Array.isArray(data.currentWorkers)) {
        state.profiles = data.currentWorkers.map((worker) => ({
          id: worker.id,
          image: worker.imageUrl,
          role: worker.role,
          time: worker.time,
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

async function fetchReviews() {
  if (!state.workspaceId) {
    console.error("workspaceId is not set");
    return;
  }

  reviewsApi.getReviews(
    state.workspaceId,
    state.reviewPage,
    state.reviewCount,
    (response) => {
      const newReviews = response.data.data;
      if (newReviews.length < state.reviewCount) {
        state.hasMoreReviews = false;
      }
      state.reviews = [...state.reviews, ...newReviews];
      state.reviewPage++;
    },
    (error) => {
      console.error("Error fetching reviews:", error);
    }
  );
}

onMounted(() => {
  fetchWorkspaceData();
});

watch(
  () => state.workspaceId,
  (newVal) => {
    if (newVal) {
      fetchReviews();
    }
  }
);

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

function addKeyword() {
  if (state.currentKeyword.trim() !== "") {
    state.keywords.push(state.currentKeyword.trim());
    state.currentKeyword = "";
  }
}

function removeKeyword(index) {
  state.keywords.splice(index, 1);
}

async function registerReservation() {
  const reservationData = {
    workspaceId: state.workspaceId,
    visitStartDate: state.reservationDate,
    visitTimeslot: state.selectedTime,
    activity: state.keywords.join(", "),
    activityDuration: state.hours * 60 + state.minutes,
  };

  reservationApi.createReservation(
    reservationData,
    (response) => {
      console.log("Reservation created:", response.data);
      clearForm();
      alert("예약이 성공적으로 등록되었습니다.");
    },
    (error) => {
      console.error("Error creating reservation:", error);
      alert("예약 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  );
}

function clearForm() {
  state.reservationDate = "";
  state.selectedTime = "";
  state.hours = 1;
  state.minutes = 30;
  state.taskDescription = "";
}

function loadMoreReviews() {
  if (state.hasMoreReviews) {
    fetchReviews();
  }
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
    class="min-h-workspace"
  >
    <div class="relative text-center">
      <div
        :style="{ backgroundImage: `url(${state.officeImage || cafeImage})` }"
        class="w-full h-96 bg-cover bg-center relative"
      >
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="absolute bottom-5 left-5 text-white text-left">
          <h1 class="text-4xl font-bold">
            {{ state.officeName }}
            <span class="text-xl font-light">{{ state.category }}</span>
          </h1>
          <p class="text-2xl">{{ state.roadAddress }}</p>
          <p class="text-2xl">
            <i class="fas fa-star text-yellow-400"></i> {{ state.rating }}
          </p>
        </div>
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
          <label class="text-xl font-semibold mb-4">언제 떠나 볼까요?</label>
          <input
            type="date"
            v-model="state.reservationDate"
            class="border p-4 rounded mb-6 w-full text-lg dark:text-black"
          />
          <div class="flex justify-around mt-3">
            <button
              @click="selectTime('새벽')"
              :class="{
                'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark':
                  state.selectedTime === '새벽',
              }"
              class="px-6 py-3 rounded-lg text-lg mx-2 hover:bg-secondary-light dark:hover:bg-secondary-dark"
            >
              새벽
            </button>
            <button
              @click="selectTime('오전')"
              :class="{
                'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark':
                  state.selectedTime === '오전',
              }"
              class="px-6 py-3 rounded-lg text-lg mx-2 hover:bg-secondary-light dark:hover:bg-secondary-dark"
            >
              오전
            </button>
            <button
              @click="selectTime('오후')"
              :class="{
                'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark':
                  state.selectedTime === '오후',
              }"
              class="px-6 py-3 rounded-lg text-lg mx-2 hover:bg-secondary-light dark:hover:bg-secondary-dark"
            >
              오후
            </button>
            <button
              @click="selectTime('저녁')"
              :class="{
                'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark':
                  state.selectedTime === '저녁',
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
            >얼마 동안 일 할 예정인가요?</label
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

      <!-- 할 일 텍스트 및 키워드 -->
      <div class="w-full mt-6">
        <label class="text-xl font-semibold mb-4">어떤 일들을 하러 가는건가요?</label>
        <draggable v-model="state.keywords" class="flex flex-wrap gap-2 mb-4">
          <template #item="{ element, index }">
            <div
              class="bg-primary-light text-onPrimary-light px-3 py-1 rounded-full flex items-center"
            >
              <span>{{ element }}</span>
              <button
                @click="removeKeyword(index)"
                class="ml-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
              >
                x
              </button>
            </div>
          </template>
        </draggable>
        <input
          v-model="state.currentKeyword"
          @keyup.enter="addKeyword"
          placeholder="ex) 프로젝트 API 명세서 작성, 디자인 시스템 개발 ..."
          class="border p-4 rounded w-full text-lg dark:text-black mt-4"
        />
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
      <!-- 프로필 섹션 -->
      <div class="profiles w-full md:w-1/2 overflow-y-auto">
        <div
          v-if="state.profiles.length > 0"
          v-for="profile in state.profiles"
          :key="profile.id"
          class="profile mb-5 flex flex-col items-center"
        >
          <img
            :src="profile.image"
            alt="Profile Image"
            class="w-24 h-24 rounded-full mb-2"
          />
          <p class="font-semibold text-lg">{{ profile.role }}</p>
          <p>{{ profile.time }}</p>
        </div>
        <div v-else class="text-center text-lg">
          앗, 아직 아무도 이 워크스페이스에서 일하지 않고 있어요!
        </div>
      </div>

      <!-- 리뷰 섹션 -->
      <div class="reviews w-full md:w-1/2 overflow-y-auto">
        <div
          v-for="review in state.reviews"
          :key="review.id"
          class="review-card border p-4 rounded mb-3"
        >
          <div class="flex items-center mb-2">
            <p class="text-sm text-gray-500">
              {{ new Date(review.startDatetime).toLocaleString() }} - {{ new Date(review.endDatetime).toLocaleString() }}
            </p>
          </div>
          <p class="text-sm mb-2">
            <i class="fas fa-star text-yellow-400"></i> {{ review.rating }}
          </p>
          <p class="mb-2">{{ review.reviewText }}</p>
          <div class="flex flex-wrap">
            <span
              v-for="keyword in review.keywords"
              :key="keyword.reviewKeywordId"
              class="bg-primary-light text-white px-2 py-1 rounded-full text-xs mr-2 mb-2"
            >
              {{ keyword.value }}
            </span>
          </div>
        </div>
        <div v-if="state.hasMoreReviews" class="flex justify-center mt-4">
          <button
            @click="loadMoreReviews"
            class="px-4 py-2 bg-primary-light text-white rounded-lg"
          >
            더 보기
          </button>
        </div>
        <div v-else class="text-center text-lg mt-4">
          더 이상 리뷰가 없습니다.
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
