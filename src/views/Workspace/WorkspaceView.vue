<script setup>
import { reactive, onMounted } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { storeToRefs } from 'pinia';
import axios from 'axios';

const themeStore = useThemeStore();
const { darkMode } = storeToRefs(themeStore);

const state = reactive({
  currentTab: 'reservation',
  officeImage: '/path/to/office-image.jpg', // Replace with the actual path
  officeName: '집무실 분당점',
  rating: 4.5,
  reservationDate: '',
  selectedTime: '',
  hours: 1,
  minutes: 30,
  taskDescription: '',
  profiles: [
    // Example data
    { id: 1, image: '/path/to/profile1.jpg', role: '개발자', time: '1:32:01' },
    { id: 2, image: '/path/to/profile2.jpg', role: '기획자', time: '18:03' },
  ],
  reviews: [],
});

function selectTab(tab) {
  state.currentTab = tab;
  if (tab === 'details') {
    fetchReviews();
  }
}

function selectTime(time) {
  state.selectedTime = time;
}

function adjustTime(amount, unit) {
  if (unit === 'hour') {
    state.hours = Math.max(0, state.hours + amount);
  } else if (unit === 'minute') {
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
  state.reservationDate = '';
  state.selectedTime = '';
  state.hours = 1;
  state.minutes = 30;
  state.taskDescription = '';
}

async function fetchReviews() {
  try {
    const response = await axios.get('/api/reviews'); // Replace with actual API endpoint
    state.reviews = response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
}

onMounted(() => {
  if (state.currentTab === 'details') {
    fetchReviews();
  }
});
</script>

<template>
  <div :class="{ 'dark:bg-background-dark': darkMode, 'bg-background-light': !darkMode, 'text-onBackground-light': !darkMode, 'text-onBackground-dark': darkMode }" class="min-h-screen">
    <div class="navbar bg-header-light dark:bg-header-dark"> <!-- This is the placeholder for the existing navbar --> </div>

    <div class="relative text-center">
      <img :src="state.officeImage" alt="Office Image" class="w-full h-auto" />
      <div class="absolute top-5 left-5 text-onSurface-light dark:text-onSurface-dark">
        <h1 class="text-4xl font-bold">{{ state.officeName }}</h1>
        <p class="text-2xl">Rating: {{ state.rating }}</p>
      </div>
    </div>

    <div class="flex justify-center mt-5">
      <button @click="selectTab('reservation')" :class="{ 'font-bold border-b-4 border-primary-light dark:border-primary-dark': state.currentTab === 'reservation' }" class="px-6 py-3 text-lg">예약</button>
      <button @click="selectTab('details')" :class="{ 'font-bold border-b-4 border-primary-light dark:border-primary-dark': state.currentTab === 'details' }" class="px-6 py-3 text-lg">상세조회</button>
    </div>

    <!-- 예약 탭 -->
    <div v-if="state.currentTab === 'reservation'" class="p-10 max-w-4xl mx-auto flex flex-col lg:flex-row gap-10">
      <!-- 예약 날짜 파트 -->
      <div class="flex flex-col w-full lg:w-1/2">
        <label class="text-xl font-semibold mb-2">예약 날짜</label>
        <input type="date" v-model="state.reservationDate" class="border p-4 rounded mb-4 w-full text-lg" />
        <div class="flex justify-around mt-3">
          <button @click="selectTime('dawn')" :class="{ 'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark': state.selectedTime === 'dawn' }" class="px-6 py-3 rounded-lg text-lg mx-1">새벽</button>
          <button @click="selectTime('morning')" :class="{ 'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark': state.selectedTime === 'morning' }" class="px-6 py-3 rounded-lg text-lg mx-1">오전</button>
          <button @click="selectTime('afternoon')" :class="{ 'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark': state.selectedTime === 'afternoon' }" class="px-6 py-3 rounded-lg text-lg mx-1">오후</button>
          <button @click="selectTime('evening')" :class="{ 'bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark': state.selectedTime === 'evening' }" class="px-6 py-3 rounded-lg text-lg mx-1">저녁</button>
        </div>
      </div>

      <!-- 예약 시간 파트 -->
      <div class="flex flex-col w-full lg:w-1/2">
        <label class="text-xl font-semibold mb-2">예약 시간</label>
        <p class="text-2xl font-bold mb-4">{{ state.hours }}시간 {{ state.minutes }}분</p>
        <div class="flex flex-wrap justify-center gap-4">
          <button @click="adjustTime(1, 'hour')" class="px-6 py-3 border rounded-lg text-lg">+1시간</button>
          <button @click="adjustTime(-1, 'hour')" class="px-6 py-3 border rounded-lg text-lg">-1시간</button>
          <button @click="adjustTime(10, 'minute')" class="px-6 py-3 border rounded-lg text-lg">+10분</button>
          <button @click="adjustTime(-10, 'minute')" class="px-6 py-3 border rounded-lg text-lg">-10분</button>
        </div>
      </div>

      <!-- 할 일 텍스트 박스 -->
      <div class="w-full mt-6">
        <label class="text-xl font-semibold mb-2">할 일</label>
        <textarea v-model="state.taskDescription" placeholder="할 일을 적어주세요" class="border p-4 rounded w-full h-32 text-lg"></textarea>
      </div>

      <!-- 등록 및 취소 버튼 -->
      <div class="flex justify-center gap-6 mt-6">
        <button @click="registerReservation" class="bg-primary-light dark:bg-primary-dark text-onPrimary-light dark:text-onPrimary-dark px-6 py-3 rounded-lg text-lg">등록</button>
        <button @click="clearForm" class="bg-secondary-light dark:bg-secondary-dark text-onSecondary-light dark:text-onSecondary-dark px-6 py-3 rounded-lg text-lg">취소</button>
      </div>
    </div>

    <!-- 상세 탭 -->
    <div v-if="state.currentTab === 'details'" class="p-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
      <div class="profiles w-full md:w-1/2 overflow-y-auto">
        <div v-for="profile in state.profiles" :key="profile.id" class="profile mb-5 flex flex-col items-center">
          <img :src="profile.image" alt="Profile Image" class="w-20 h-20 rounded-full mb-2" />
          <p class="font-semibold text-lg">{{ profile.role }}</p>
          <p>{{ profile.time }}</p>
        </div>
      </div>
      <div class="reviews w-full md:w-1/2 overflow-y-auto">
        <div v-for="review in state.reviews" :key="review.id" class="review-card border p-4 rounded mb-3">
          <p class="font-semibold text-lg">{{ review.date }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.comment }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add additional scoped styles if necessary */
</style>
