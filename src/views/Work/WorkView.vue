<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "@/stores/auth";

import { XCircleIcon } from "@heroicons/vue/20/solid";

import base64 from "@/util/base64";
import VueCropper from "@ballcat/vue-cropper";
import "cropperjs/dist/cropper.css";

import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

import workspaceApi from "@/api/workspaceApi";
import keywordApi from "@/api/keywordApi";
import workApi from "@/api/workApi";

let keywords = ref([]);

import reservationApi from "@/api/reservationApi";

import { storeToRefs } from "pinia";

import LvProgressBar from "lightvue/progress-bar";

const authStore = useAuthStore();
const { member } = storeToRefs(authStore);

let route = useRoute();
let router = useRouter();

// modal
const isConfirmOpen = ref(false);

function closeConfirmModal() {
  isConfirmOpen.value = false;
  toggleStatus();
}
function openConfirmModal() {
  isConfirmOpen.value = true;
  toggleStatus();
}

// 리뷰 관련 start
const isReviewOpen = ref(false);

function closeReviewModal() {
  isReviewOpen.value = false;
}

function openReviewModal() {
  isReviewOpen.value = true;
}

// crop 전 임시 이미지
const tempImage = ref("");
const vueCropperRef = ref(null);

const cropperOptions = reactive({
  // aspectRatio: 1 / 1,
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

const isImageOpen = ref(false);

function closeImageModal() {
  isImageOpen.value = false;
  openReviewModal();
}

function ImageConfirm() {
  isImageOpen.value = false;
  cropImage();
}

function openImageModal() {
  isImageOpen.value = true;
}

function cropImage() {
  reviewForm.value.images.push(
    vueCropperRef.value.getCroppedCanvas().toDataURL().split(",")[1]
  );
  openReviewModal();
}

const uploadImage = (files) => {
  base64(files[0], (e) => {
    tempImage.value = e.target.result.split(",")[1];
    openImageModal();
  });
};
// 리뷰 관련 end

// 현재 work에 대한 정보들
let reservationId = route.query.reservationId;
let reservation = ref({});
let activities = ref([]);

let workspace = ref({});

let currentWorkTime = ref(0);
let intervalId = ref(null);

const toggleStatus = () => {
  if (intervalId.value == null) {
    intervalId.value = setInterval(() => {
      currentWorkTime.value++;
    }, 1000);
    return;
  }

  clearInterval(intervalId.value);
  intervalId.value = null;
};

intervalId.value = setInterval(() => {
  currentWorkTime.value++;
}, 1000);

onMounted(async () => {
  // TODO 작업 시작 API 호출
  await workApi.start(
    reservationId,
    (response) => {},
    (error) => {
      console.log(error);
    }
  );

  // keyword 조회
  await keywordApi.findAll((response) => {
    keywords.value = response.data.data;
  });

  // reservation 조회
  await reservationApi.findOne(
    reservationId,
    (response) => {
      reservation.value = response.data.data;
      let activitySplit = reservation.value.activity.split(",");
      for (let index = 0; index < activitySplit.length; index++) {
        activities.value.push(activitySplit[index].trim());
      }
    },
    (error) => {
      console.log(error);
    }
  );

  // workspace 조회
  await workspaceApi.searchByWorkspaceId(
    reservation.value.workspaceId,
    (response) => {
      workspace.value = response.data.data;
    },
    (error) => {
      console.log(error);
    }
  );
});

const themeStore = useThemeStore();
const { darkMode } = storeToRefs(themeStore);

// 페이지 나가기 방지
window.addEventListener("beforeunload", (event) => {
  const alertMessage = `${member.nickname}님, 이 페이지를 떠나면 현재까지 진행한 작업이 저장되지 않습니다! 정말 작업을 종료할까요?`;
  event.returnValue = alertMessage;
  return alertMessage;
});

// 진행률
let percentage = computed(() => {
  return Math.min(
    (currentWorkTime.value / (reservation.value.activityDuration * 60)) * 100,
    100
  );
});

function sendReview() {
  reviewForm.value.reservationId = reservationId;
  reviewForm.value.workspaceId = workspace.value.id;
  reviewForm.value.endDatetime = new Date().toISOString().split(".")[0];
  reviewForm.value.startDatetime = new Date(
    new Date().getTime() - currentWorkTime.value * 1000
  )
    .toISOString()
    .split(".")[0];
  reviewForm.value.activity = reservation.value.activity;
  reviewForm.value.keywords = Array.from(reviewForm.value.keywords);

  workApi.end(
    reviewForm.value,
    (response) => {
      router.push({ name: "Mypage" });
    },
    (error) => {
      console.log(error);
    }
  );
}

const reviewForm = ref({
  reservationId: null,
  workspaceId: null,
  startDatetime: null,
  endDatetime: null,
  activity: null,

  rating: 3,
  reviewText: null,

  images: [],
  keywords: new Set(),
});
</script>

<template>
  <div
    :class="{ dark: darkMode }"
    style="height: calc(100vh - 70px)"
    class="flex flex-col dark:text-white text-black items-center justify-center"
  >
    <TransitionRoot appear :show="isConfirmOpen" as="template">
      <Dialog as="div" @close="closeConfirmModal" class="relative z-10">
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
                  오늘도 고생했어요!
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    현재까지
                    <span class="font-bold"
                      ><span v-if="currentWorkTime >= 3600"
                        >{{ Math.floor(currentWorkTime / 60 / 60) }}시간 </span
                      >{{ Math.floor((currentWorkTime / 60) % 60) }}분
                      {{ currentWorkTime % 60 }}초</span
                    >
                    일했어요.
                  </p>
                  <p class="text-sm text-gray-500">정말 작업을 종료할까요?</p>
                </div>

                <div class="mt-5">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-light dark:bg-primary-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="openReviewModal"
                  >
                    종료하기
                  </button>
                  <button
                    type="button"
                    class="ml-2 inline-flex justify-center rounded-md border border-transparent bg-error-light dark:bg-error-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeConfirmModal"
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
    <!-- 리뷰 작성 모달 -->
    <TransitionRoot appear :show="isReviewOpen" as="template">
      <Dialog as="div" class="relative z-10">
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

        <div class="fixed inset-0">
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
                  방금 마친 일에 대해 회고해 보세요!
                </DialogTitle>
                <div class="mt-5">
                  <p class="mb-2">📝 여행은 즐거우셨나요?</p>
                  <textarea
                    rows="3"
                    v-model="reviewForm.reviewText"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="이번 여행에서 어떤 일이 있었는지 간단히 기록해 보세요."
                  ></textarea>
                </div>
                <hr class="mt-5" />
                <div class="mt-5">
                  <div class="mb-2 flex items-center">
                    <p class="mr-2">📷 여행에서 찍은 사진을 등록해 보세요.</p>
                  </div>
                  <div class="flex">
                    <template v-for="(image, index) in reviewForm.images">
                      <div class="relative">
                        <img
                          class="w-28 h-28 object-cover rounded-lg mr-2"
                          :src="`data:image/png;base64,${image}`"
                          alt="리뷰 이미지"
                        />
                        <p class="absolute top-1 right-3">
                          <XCircleIcon
                            style="cursor: pointer"
                            class="w-5 h-5 text-white opacity-80"
                            @click="reviewForm.images.splice(index, 1)"
                          />
                        </p>
                      </div>
                    </template>

                    <input
                      type="file"
                      id="reviewImage"
                      @change.prevent="uploadImage($event.target.files)"
                      hidden
                    />
                    <label
                      class="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center"
                      style="cursor: pointer"
                      for="reviewImage"
                      ><p class="text-2xl font-semibold text-gray-500">
                        +
                      </p></label
                    >
                  </div>
                </div>
                <hr class="mt-5" />
                <div class="mt-5">
                  <p class="mb-2">⭐️ 이 장소 평가하기</p>
                  <button
                    type="button"
                    v-for="i in 5"
                    :class="{ 'mr-0.5': i < 5 }"
                    @click="reviewForm.rating = i"
                  >
                    <svg
                      class="block h-8 w-8"
                      :class="[
                        reviewForm.rating >= i
                          ? 'text-primary-light'
                          : 'text-gray-400',
                      ]"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 55 55"
                    >
                      <path
                        xmlns="http://www.w3.org/2000/svg"
                        d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757  c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042  c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685  c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528  c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956  C22.602,0.567,25.338,0.567,26.285,2.486z"
                      />
                    </svg>
                  </button>
                </div>
                <hr class="mt-5" />
                <div class="mt-5">
                  <p class="mb-1">✅ 키워드 선택</p>
                  <p class="text-sm text-gray-500 mb-2">
                    이 장소를 가장 잘 나타내는 키워드들을 선택해 주세요! ({{
                      reviewForm.keywords.size
                    }}/3)
                  </p>
                  <div class="flex flex-wrap">
                    <template v-for="keyword in keywords">
                      <p
                        class="mr-1 mb-1 px-2 py-1 text-xs rounded-3xl"
                        :class="{
                          'bg-primary-light': reviewForm.keywords.has(
                            keyword.id
                          ),
                          'text-white': reviewForm.keywords.has(keyword.id),
                          'bg-white': !reviewForm.keywords.has(keyword.id),
                          'text-primary-light': !reviewForm.keywords.has(
                            keyword.id
                          ),
                          'border-px': !reviewForm.keywords.has(keyword.id),
                          'border-primary-light': !reviewForm.keywords.has(
                            keyword.id
                          ),
                        }"
                        :style="{
                          border: reviewForm.keywords.has(keyword.id)
                            ? '0px'
                            : '1px solid',
                        }"
                        @click="
                          reviewForm.keywords.has(keyword.id)
                            ? reviewForm.keywords.delete(keyword.id)
                            : reviewForm.keywords.size >= 3
                            ? null
                            : reviewForm.keywords.add(keyword.id)
                        "
                      >
                        {{ keyword.value }}
                      </p>
                    </template>
                  </div>
                </div>
                <div class="mt-5 w-full flex flex-col justify-center">
                  <button
                    type="button"
                    class="inline-flex mx-3 justify-center rounded-md border border-transparent bg-primary-light dark:bg-primary-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="sendReview"
                  >
                    등록
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <!-- 리뷰 사진 등록 모달 -->
    <TransitionRoot appear :show="isImageOpen" as="template">
      <Dialog as="div" @close="closeImageModal" class="relative z-10">
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
                  리뷰 이미지 등록
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 mb-3">
                    등록을 원하는 부분을 지정해 주세요.
                  </p>
                </div>
                <div>
                  <vue-cropper
                    ref="vueCropperRef"
                    :src="`data:image/png;base64,${tempImage}`"
                    v-bind="cropperOptions"
                  />
                </div>
                <div class="mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-light dark:bg-primary-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="ImageConfirm"
                  >
                    등록
                  </button>
                  <button
                    type="button"
                    class="ml-2 inline-flex justify-center rounded-md border border-transparent bg-error-light dark:bg-error-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeImageModal"
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
    <div class="past-infos flex font-semibold dark:text-white text-black">
      <div
        class="bg-header-light dark:bg-header-dark past-info rounded-3xl w-36 h-36 flex flex-col items-start justify-center pl-4 mr-4"
      >
        <div class="past-info-icon text-4xl mb-2">🕥</div>
        <p>
          '{{ workspace.name }}'에서<br />총
          <span class="text-primary-light mr-0.5">4</span>번 일했어요.
        </p>
      </div>

      <div
        class="bg-header-light dark:bg-header-dark past-info rounded-3xl w-36 h-36 flex flex-col items-start justify-center pl-4 mr-4"
      >
        <div class="past-info-icon text-4xl mb-2">🤜🏻🤛🏻</div>
        <p>
          {{
            workspace.currentWorkers == null
              ? 0
              : workspace.currentWorkers.length
          }}마리의<br />카피바라🦫가<br />함께 일 하는 중.
        </p>
      </div>

      <div
        class="bg-header-light dark:bg-header-dark past-info rounded-3xl w-36 h-36 flex flex-col items-start justify-center pl-4"
      >
        <div class="past-info-icon text-4xl mb-2 mt-3">🚀</div>
        <div class="overflow-auto w-full">
          <p v-for="(activity, index) in activities" :key="index">
            # {{ activity }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-10">
      <div class="relative w-96">
        <p
          class="text-5xl font-bold text-center"
          :class="{ 'text-gray-400 dark:text-gray-500': intervalId == null }"
        >
          <span v-if="currentWorkTime >= 3600"
            >{{ Math.floor(currentWorkTime / 60 / 60) }}시간 </span
          >{{ Math.floor((currentWorkTime / 60) % 60) }}분
          {{ currentWorkTime % 60 }}초
        </p>
        <p
          class="absolute top-1/2 transform translate-y-1/2 font-semibold"
          style="bottom: 40%"
          :style="{ right: currentWorkTime < 3600 ? '-0%' : '-5%' }"
        >
          <span class="mr-2">/</span>
          <span
            :class="{
              'dark:text-primary-dark':
                currentWorkTime >= reservation.activityDuration * 60,
              'text-primary-light':
                currentWorkTime >= reservation.activityDuration * 60,
            }"
            ><span v-if="reservation.activityDuration >= 60"
              >{{
                Math.floor((reservation.activityDuration / 60) % 60)
              }}시간 </span
            >{{ Math.floor(reservation.activityDuration % 60) }}분</span
          >
        </p>
      </div>
    </div>

    <div class="w-96 mt-5 progress-bar">
      <LvProgressBar
        style="border-radius: 15px; height: 25px"
        :value="percentage"
        :showValue="false"
        color="#5271FF"
      />
    </div>

    <div class="buttons flex justify-between mt-10 text-white">
      <button
        @click="toggleStatus"
        class="mr-3 bg-error-light dark:bg-error-dark font-bold text-lg px-8 py-3 rounded-xl"
      >
        {{ intervalId == null ? "재개" : "일시정지" }}
      </button>
      <button
        @click="openConfirmModal"
        class="bg-primary-light dark:bg-primary-dark font-bold text-lg px-8 py-3 rounded-xl"
      >
        <span
          class="mr-1"
          v-if="currentWorkTime >= reservation.activityDuration * 60"
          >🙌</span
        >
        {{
          currentWorkTime >= reservation.activityDuration * 60
            ? "종료"
            : "여기까지만 할래요"
        }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
