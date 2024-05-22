<script setup>
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";

import tmapApi from "@/api/tmapApi";
import workspaceApi from "@/api/workspaceApi";

import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";

// tailwind
import { ref, computed } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/vue/20/solid";

const themeStore = useThemeStore();
const router = useRouter();
const { darkMode } = storeToRefs(themeStore);

// searchbar start
const results = ref([]);

const search = async () => {
  if (query.value == "") {
    selectedQuery.value = "";
  }

  results.value = [query.value, ...(await tmapApi.getResultNames(query.value))];
};

let selectedQuery = ref("");
let query = ref("");

const sidebarExpanded = ref(true);

const toggleSidebar = (button) => {
  sidebarExpanded.value = !sidebarExpanded.value;
  if (sidebarExpanded.value) {
    button.target.style.left = "350px";
    button.target.innerText = "<";
  } else {
    button.target.style.left = "0px";
    button.target.innerText = ">";
  }
};
// searchbar end

function checkImageSrc(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(true); // 이미지 로드 성공
    };

    img.onerror = () => {
      reject(false); // 이미지 로드 실패
    };

    img.src = url;
  });
}

function calculateRadius() {
  const { Ma: lat1, La: lon1 } = map.value.getBounds().getSouthWest();
  const { Ma: lat2, La: lon2 } = map.value.getBounds().getNorthEast();

  // 지구의 반지름 (미터 단위)
  const R = 6371000;

  // 라디안 단위로 변환
  const toRadians = (degree) => degree * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // 대원거리 계산 (두 점 사이의 거리)
  const distance = R * c;

  // 반경은 대각선의 절반
  const radius = distance / 2;

  return radius / 1000;
}

let workspaces = ref([]);
let nowLoading = ref(false);
const searchWorkspaces = async (move) => {
  nowLoading.value = true;
  await workspaceApi.searchAll(
    {
      query: selectedQuery.value,
      latitude: map.value.getCenter().getLat(),
      longitude: map.value.getCenter().getLng(),
      radius: Math.ceil(calculateRadius() >= 30 ? 0 : calculateRadius()),
      categoty: "",
      page: 1,
      count: 30,
    },
    (response) => {
      workspaces.value = response.data.data;
      if (workspaces.value == null) {
        // TODO 검색 결과가 없음을 표시
        workspaces.value = [];
        return;
      }
      refreshBoundsAndMarkers(workspaces.value, move);
    },
    (error) => {
      console.log(error);
    }
  );
  nowLoading.value = false;
};

const searchWorkspaceOne = async (poiId) => {
  let result;
  await workspaceApi.search(
    poiId,
    (response) => {
      if (response.data.data == null) {
        // TODO 검색 결과가 없음을 표시
        return;
      }
      result = response.data.data;
    },
    (error) => {
      console.log(error);
    }
  );
  return result;
};

// map options start
let currentMarkers = ref([]);
let currentBounds = ref([]);

const coordinate = {
  lat: 37.566826,
  lng: 126.9786567,
};

const map = ref();

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
  currentBounds.value = new kakao.maps.LatLngBounds();
};
// map options end
const refreshBoundsAndMarkers = (workspaces, move) => {
  currentMarkers.value = workspaces.map((workspace) => {
    // bound
    let bound = new kakao.maps.LatLng(workspace.latitude, workspace.longitude);
    currentBounds.value.extend(bound);
    workspace.bound = bound;

    // marker
    let marker = {
      lat: bound.getLat(),
      lng: bound.getLng(),
      poiId: workspace.poiId,
      content: "",
      visible: false,
    };

    workspace.marker = marker;
    return marker;
  });

  if (move) {
    map.value.setBounds(currentBounds.value);
  }
};

const markerMouseOut = (marker) => {
  marker.visible = false;
};

let jobs = [
  `<p class="mr-1 px-2 py-1 bg-primary-light rounded-3xl text-white">
          개발자
        </p>`,
  `<p class="mr-1 px-2 py-1 bg-yellow-500 rounded-3xl text-white">
          디자이너
        </p>`,
  `<p class="mr-1 px-2 py-1 bg-green-500 rounded-3xl text-white">
          기획자
        </p>`,
];

const markerMouseOver = async (marker) => {
  currentMarkers.value.forEach((marker) => (marker.visible = false));

  let result = await searchWorkspaceOne(marker.poiId);

  // 몇명이 일하는가?
  let workerCount = Math.ceil(Math.random() * 4);

  let currentWorkersHtml = "";
  for (let index = 0; index < workerCount; index++) {
    currentWorkersHtml += `${jobs[Math.ceil(Math.random() * (jobs.length - 1))]}
      `;
  }

  // 유효한 이미지만 거르기
  let images = ref([]);
  for (let index = 0; index < result.imageUrls.length; index++) {
    let img = new Image();
    img.onload = function () {
      images.value.push(result.imageUrls[index]);
    };
    img.src = result.imageUrls[index];

    if (images.value.length >= 2) {
      break;
    }
  }

  marker.content = `
  <div id="markerInfo" class="flex flex-col p-5 w-72">
        <div class="images flex">
          <img
            src="${result.imageUrls[0]}"
            class="w-1/2 h-24 object-cover mr-0.5"
          />
          <img
            src="${result.imageUrls[1]}"
            class="w-1/2 h-24 object-cover"
          />
        </div>
        <div class="title font-bold mt-3">${result.name}</div>
        <p class="text-sm mt-2">익명의 카피바라 ${workerCount}마리가 일하고 있어요!</p>
        <div class="currentWorkerIcons flex text-xs mt-1 mb-2">
          ${currentWorkersHtml}
        </div>
        <div class="myPlace flex flex-col text-sm mt-1 mb-2">
          <p>내가 방문한 장소예요!</p>
          <p>
            <span class="font-semibold">최근 방문 일자</span> : 24.05.03/13:00
          </p>
        </div>
        <div class="ratingAndKeywords flex text-sm items-center flex-wrap">
          <p class="mr-2">⭐️ ${
            result.rating == null || result.rating == ""
              ? Math.round((3 + Math.random() * 2) * 100) / 100
              : result.rating
          }</p>
          <p
            class="mr-1 px-2 py-1 text-xs bg-primary-light rounded-3xl text-white"
          >
            사람이 많은
          </p>
          <p
            class="mr-1 px-2 py-1 text-xs bg-primary-light rounded-3xl text-white"
          >
            집중이 잘 되는
          </p>
          <p
            class="mr-1 px-2 py-1 text-xs bg-primary-light rounded-3xl text-white"
          >
            조용한
          </p>
        </div>
        <hr class="mt-3">
        <a href="./workspaces/${
          result.poiId
        }"><div class="px-2 mt-3 text-white rounded-full py-1 text-sm font-semibold text-center bg-primary-light">
        이 장소를 사용할래요!
        </div>
        </a>
      </div>
  `;

  marker.visible = true;

  setInterval(100, () => {
    document.getElementById(
      "markerInfo"
    ).parentNode.parentNode.style.borderRadius = "10px";
  });
};

const clickSearchBarWorkspace = (workspace) => {
  markerMouseOver(workspace.marker);

  map.value.panTo(
    new kakao.maps.LatLng(workspace.marker.lat, workspace.marker.lng)
  );
};
</script>

<template>
  <div
    class="flex w-full overflow-hidden"
    :class="{ dark: darkMode }"
    style="height: calc(100vh - 70px)"
  >
    <div class="flex">
      <div
        id="sidebar"
        :class="[
          'transition-width duration-500',
          sidebarExpanded ? 'w-350px' : 'w-0',
        ]"
        class="flex relative flex-col items-center overflow-x-hidden"
      >
        <div id="searchBar" class="flex items-center mb-4 mt-4">
          <Combobox
            v-model="selectedQuery"
            class="mr-3"
            @enter.prevent="searchWorkspaces"
          >
            <div class="relative w-72">
              <div
                class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
              >
                <ComboboxInput
                  class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  :displayValue="
                    (q) => {
                      if (q != '') {
                        return q;
                      }
                      return null;
                    }
                  "
                  autocomplete="off"
                  placeholder="장소, 카테고리 검색"
                  @change="
                    query = $event.target.value;
                    search();
                  "
                  @keyup.enter="searchWorkspaces"
                />
                <ComboboxButton
                  class="absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <ChevronDownIcon
                    class="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </ComboboxButton>
              </div>
              <TransitionRoot
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                @after-leave="query = ''"
              >
                <ComboboxOptions
                  class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                >
                  <div
                    v-if="results.length === 0 && query !== ''"
                    class="relative cursor-default select-none px-4 py-2 text-gray-700"
                  >
                    검색 결과가 없습니다.
                  </div>

                  <ComboboxOption
                    v-for="(result, index) in results"
                    as="template"
                    :key="index"
                    :value="result"
                    v-slot="{ selectedQuery, active }"
                  >
                    <li
                      class="relative flex items-center cursor-default select-none py-2 pl-4 pr-4"
                      :class="{
                        'bg-primary-light text-white': active,
                        'text-gray-900': !active,
                      }"
                    >
                      <span class="mr-2">
                        <MagnifyingGlassIcon
                          v-if="index >= 1"
                          class="h-4 w-4"
                          aria-hidden="true"
                        />
                        <PencilSquareIcon
                          v-if="index == 0"
                          class="h-4 w-4"
                          aria-hidden="true"
                        />
                      </span>
                      <span
                        class="block truncate"
                        :class="{
                          'font-medium': selectedQuery,
                          'font-normal': !selectedQuery,
                        }"
                      >
                        {{ result }}
                      </span>
                      <span
                        v-if="selectedQuery"
                        class="absolute inset-y-0 left-0 flex items-center pl-3"
                        :class="{
                          'text-white': active,
                          'text-primary-light': !active,
                        }"
                      >
                      </span>
                    </li>
                  </ComboboxOption>
                </ComboboxOptions>
              </TransitionRoot>
            </div>
          </Combobox>
        </div>
        <div class="flex w-full">
          <p class="ml-6 mt-3 font-bold text-lg">검색 결과</p>
        </div>
        <div v-if="nowLoading" class="text-center my-3">
          <div role="status">
            <svg
              aria-hidden="true"
              class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <template v-for="workspace in workspaces" :key="workspace.id">
          <div class="searchResult flex flex-col items-start w-full px-6 py-3">
            <div class="flex items-end">
              <p
                style="cursor: pointer"
                class="text-primary-light font-bold"
                @click="clickSearchBarWorkspace(workspace)"
              >
                {{ workspace.name }}
              </p>
              <p class="ml-2 text-xs text-text">{{ workspace.category }}</p>
            </div>
            <p class="text-xs font-normal text-text mt-2">
              {{ workspace.roadAddress }}
            </p>
            <div class="flex items-end mt-1">
              <p class="text-xs font-semibold text-text">
                ⭐️
                {{
                  workspace.rating == null || workspace.rating == ""
                    ? Math.round((3 + Math.random() * 2) * 100) / 100
                    : workspace.rating
                }}
              </p>
              <p class="text-xs font-semibold ml-3 text-text">
                📍 {{ workspace.category }}
              </p>
            </div>
            <div class="sidebar-keywords text-xs w-72 mt-3 flex flex-wrap">
              <template v-for="keyword in workspace.keywords">
                <p
                  class="sidebar-keyword px-2.5 py-1.5 rounded-full bg-primary-light text-white mr-1 mb-1.5"
                >
                  {{ keyword }}
                </p>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div
        class="absolute font-bold text-text top-1/2 transform -translate-y-1/2 bg-background-light text-black px-1.5 py-4 rounded-l-none overflow-hidden rounded-r-md animate-move"
        @click="toggleSidebar($event)"
      >
        <
      </div>
    </div>
    <div style="width: calc(100vw - 350px)" class="map flex justify-center">
      <button
        @click="searchWorkspaces(false)"
        class="absolute z-50 text-xs px-4 py-2 opacity-90 mt-3 bg-primary-light rounded-full text-white"
      >
        현 위치에서 재검색
      </button>
      <KakaoMap
        :lat="coordinate.lat"
        :lng="coordinate.lng"
        :draggable="true"
        width="100vw"
        height="calc(100vh - 70px)"
        :class="['transition-width duration-500']"
        style="z-index: 0"
        @onLoadKakaoMap="onLoadKakaoMap"
      >
        <KakaoMapMarker
          v-for="(marker, index) in currentMarkers"
          :key="marker.poiId"
          :lat="marker.lat"
          :lng="marker.lng"
          :infoWindow="{
            content: marker.content,
            visible: marker.visible,
          }"
          :clickable="true"
          @on-click-kakao-map-marker="markerMouseOver(marker)"
        >
        </KakaoMapMarker>
      </KakaoMap>
    </div>
  </div>
</template>

<style scoped>
#sidebar {
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 5px 0px 15px 0px;
}

.animate-move {
  left: 350px;
  z-index: 200;
  transition: left 0.5s ease;

  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 1px 0px,
    rgba(0, 0, 0, 0.1) 5px 0px 15px 0px;
}
</style>
