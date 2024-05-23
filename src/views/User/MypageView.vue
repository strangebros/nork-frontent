<script setup>
import { ref, onMounted } from "vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
// import Swiper JS
import Swiper from "swiper";
// import Swiper styles
import "swiper/css";

import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

import { useAuthStore } from "@/stores/auth";
let authStore = useAuthStore();

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";

import memberApi from "@/api/memberApi";
import reviewApi from "@/api/reviewApi";
import reservationApi from "@/api/reservationApi";
const { member } = storeToRefs(authStore);

let memberInfo = ref({});

if (member.value != null && member.value.role != "GUEST") {
  memberApi.getMemberInfo(
    member.value.id,
    (response) => {
      memberInfo.value = response.data.data;
    },
    (error) => {}
  );
}

let reviews = ref([]);
let reservationIndex = ref(0);
let reservations = ref([]);

const prevCard = () => {
  if (reservationIndex.value > 0) {
    reservationIndex.value -= 1;
    reservations.value[reservationIndex.value].opacity = 100;
    setTimeout(() => {
      reservations.value[reservationIndex.value + 1].opacity = 0;
    }, 200);
  }
};

const nextCard = () => {
  if (reservationIndex.value < reservations.value.length - 1) {
    reservationIndex.value += 1;

    reservations.value[reservationIndex.value].opacity = 100;
    setTimeout(() => {
      reservations.value[reservationIndex.value - 1].opacity = 0;
    }, 200);
  }
};

const themeStore = useThemeStore();
const { darkMode } = storeToRefs(themeStore);

const cancelReservation = async () => {
  isOpen.value = false;
  reservationIndex.value = 0;

  await reservationApi.delete(
    reservations.value[reservationIndex.value].id,

    async () => {
      await reservationApi.findAll(
        { all: true },
        (response) => {
          reservations.value = response.data.data;

          reservations.value.map((r) => {
            r.opacity = 0;
          });
          reservations.value = reservations.value.sort((r1, r2) => {
            return (
              new Date(r1.visitStartDate).getTime() -
              new Date(r2.visitStartDate).getTime()
            );
          });
          if (reservations.value.length >= 1) {
            reservations.value[0].opacity = 100;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  );
};

onMounted(async () => {
  await reviewApi.findAll(
    {
      page: 1,
      count: 5,
    },
    (response) => {
      reviews.value = response.data.data;
      console.log(reviews.value[0]);
    },
    (error) => {
      console.log(error);
    }
  );

  await reservationApi.findAll(
    { all: true },
    (response) => {
      reservations.value = response.data.data;

      reservations.value.map((r) => {
        r.opacity = 0;
      });
      reservations.value = reservations.value.sort((r1, r2) => {
        return (
          new Date(r1.visitStartDate).getTime() -
          new Date(r2.visitStartDate).getTime()
        );
      });
      if (reservations.value.length >= 1) {
        reservations.value[0].opacity = 100;
      }
    },
    (error) => {
      console.log(error);
    }
  );
});

const isOpen = ref(false);

function closeModal() {
  isOpen.value = false;
}

function openModal() {
  isOpen.value = true;
}
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-30">
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
                예약 취소
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500 mb-3">정말 취소할까요?</p>
              </div>
              <div class="mt-4">
                <button
                  type="button"
                  class="mr-2 inline-flex justify-center rounded-md border border-transparent bg-error-light dark:bg-error-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="cancelReservation"
                >
                  예약 취소
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-primary-light dark:bg-primary-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  닫기
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <div
    class="flex flex-col items-center justify-stretch overflow-x-hidden"
    :class="{ dark: darkMode }"
  >
    <div class="mt-5 w-4/5 lg:w-2/3 justify-center flex items-center py-7">
      <img
        class="rounded-full w-48 h-48 mr-6"
        :src="`data:image/png;base64,${
          memberInfo.profileImage == null || memberInfo.profileImage == ''
            ? defaultProfileImage
            : memberInfo.profileImage
        }`"
      />
      <p class="font-bold text-lg">
        {{ memberInfo.nickname }}님,<br />오늘 하루도 여행처럼 보내세요!
      </p>
    </div>
    <!--  -->
    <div class="w-4/5 lg:w-2/3 flex relative" v-if="reservations.length >= 1">
      <button
        v-if="reservationIndex > 0"
        @click="prevCard"
        class="p-3 text-black absolute left-0 z-30"
        style="top: 4.5rem"
      >
        <ChevronLeftIcon class="w-8 h-8" />
      </button>
      <button
        v-if="reservationIndex < reservations.length - 1"
        @click="nextCard"
        class="p-3 text-black absolute right-0 z-30"
        style="top: 4.5rem"
      >
        <ChevronRightIcon class="w-8 h-8" />
      </button>
      <div
        class="w-full flex z-10 transition-transform duration-500 bg-transparent"
        :style="{ transform: `translateX(-${reservationIndex * 100}%)` }"
      >
        <div
          class="w-full flex-shrink-0 z-20"
          v-for="(reservation, index) in reservations"
        >
          <div class="flex justify-center bg-transparent rounded-lg z-20">
            <div
              :class="`opacity-${reservation.opacity}`"
              class="z-20 border border-gray-200 rounded-lg shadow mt-5 px-11 py-5 w-full flex flex-col items-start bg-white"
            >
              <p>
                {{
                  Math.ceil(
                    Math.abs(
                      new Date() - new Date(reservation.visitStartDate)
                    ) /
                      (1000 * 60 * 60 * 24)
                  )
                }}일 후,
                <span class="font-bold">'{{ reservation.workspaceName }}'</span>
                에 예약된 일정이 있어요!
              </p>
              <p class="text-sm text-gray-500 mt-2">
                <span class="font-semibold">방문 예정 시간대</span> :
                {{ reservation.visitTimeslot }}
              </p>
              <p class="text-sm text-gray-500">
                <span class="font-semibold">예정된 할 일</span> :
                {{ reservation.activity }}
              </p>
              <div class="mt-3 z-20">
                <button
                  type="button"
                  class="z-20 inline-flex mr-2 justify-center rounded-md border border-transparent bg-primary-light dark:bg-primary-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="startWork"
                >
                  시작하기
                </button>
                <button
                  type="button"
                  class="z-20 inline-flex justify-center rounded-md border border-transparent bg-error-light dark:bg-error-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="openModal"
                >
                  취소하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->

    <hr class="mt-8 mb-6 w-4/5 lg:w-2/3" />
    <div class="flex flex-col w-4/5 lg:w-2/3 mb-20">
      <p class="font-bold">
        지난 기록들을 보면서, 나에게 맞는 워크스페이스를 찾아볼까요?
      </p>

      <template v-for="(review, index) in reviews" :key="review.id">
        <div
          class="flex w-full border border-gray-200 rounded-lg shadow mt-5 px-8 py-5 bg-white overflow-y-hidden h-max"
        >
          <div class="w-full flex flex-col items-start">
            <p class="">
              {{
                `${review.endDatetime
                  .split("-")[1]
                  .replace("0", "")}월 ${review.endDatetime
                  .split("-")[2]
                  .split("T")[0]
                  .replace("0", "")}일`
              }}, {{ review.workspaceName }}
            </p>

            <p class="text-sm text-gray-500 mt-3">
              <span class="font-semibold">평점</span> : ⭐️
              {{ review.rating }}.0
            </p>
            <p class="text-sm text-gray-500">
              <span class="font-semibold">리뷰</span> : {{ review.reviewText }}
            </p>
            <p class="text-sm text-gray-500">
              <span class="font-semibold">한 일</span> : {{ review.activity }}
            </p>
            <div class="mt-2 flex">
              <p
                v-for="keyword in review.keywords"
                class="mr-1 px-2 py-1 text-xs bg-primary-light rounded-3xl text-white"
              >
                {{ keyword.value }}
              </p>
            </div>
          </div>
          <div>
            <img
              v-if="review.images.length >= 1"
              class="w-28 h-28 object-cover rounded-lg mr-2"
              :src="`data:image/png;base64,${review.images[0].image}`"
              alt="리뷰 이미지"
            />
          </div>
        </div>
      </template>
      <p class="text-center text-sm mt-5" v-if="reviews.length == 0">
        아직 작성한 기록이 없네요.<br /><span
          class="text-blue-500 font-bold mr-0.5"
          @click="$router.push({ name: 'Map' })"
          style="cursor: pointer"
          >여기</span
        >에서 계획을 세워보는 건 어떤가요?
      </p>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  width: 300px; /* Adjust as necessary */
  overflow: hidden;
}

.card {
  width: 100%; /* Match the container width */
}
</style>
