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

let workspaces = ref([]);
const searchWorkspaces = async () => {
  await workspaceApi.searchAll(
    {
      query: selectedQuery.value,
      latitude: map.value.getCenter().getLat(),
      longitude: map.value.getCenter().getLng(),
      radius: 2,
      categoty: "",
      page: 1,
      count: 10,
    },
    (response) => {
      workspaces.value = response.data.data;
      if (workspaces.value == null) {
        // TODO 검색 결과가 없음을 표시
        return;
      }
      refreshBoundsAndMarkers(workspaces.value);
    },
    (error) => {
      console.log(error);
    }
  );
};

// map options start
let currentMarkers = [];
let currentBounds;

const coordinate = {
  lat: 37.566826,
  lng: 126.9786567,
};

const map = ref();

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
  currentBounds = new kakao.maps.LatLngBounds();
};
// map options end
const refreshBoundsAndMarkers = (workspaces) => {
  currentMarkers = workspaces.map((workspace) => {
    // bound
    let bound = new kakao.maps.LatLng(workspace.latitude, workspace.longitude);
    currentBounds.extend(bound);

    // marker
    let marker = new kakao.maps.Marker({ position: bound });
    marker.setMap(map.value);
    return marker;
  });

  map.value.setBounds(currentBounds);
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
        <div
          class="searchResult flex flex-col items-start w-full px-6 py-3"
          v-for="i in 10"
        >
          <div class="flex items-end">
            <p class="text-primary-light font-bold">늘푸른목장 잠실본점</p>
            <p class="ml-2 text-xs text-text">소고기구이</p>
          </div>
          <p class="text-xs font-normal text-text mt-2">
            서울 송파구 백제고분로9길 34 1F
          </p>
          <div class="flex items-end mt-1">
            <p class="text-xs font-semibold text-text">⭐️ 3.5</p>
            <p class="text-xs font-semibold ml-3 text-text">
              📍 2024/05/21 10:30
            </p>
          </div>
          <div class="sidebar-keywords text-xs w-72 mt-3 flex flex-wrap">
            <p
              class="sidebar-keyword px-2.5 py-1.5 rounded-full bg-primary-light text-white mr-1 mb-1.5"
              v-for="i in Math.floor(Math.random() * 10)"
            >
              조용한
            </p>
          </div>
        </div>
      </div>
      <div
        class="absolute font-bold text-text top-1/2 transform -translate-y-1/2 bg-background-light text-black px-1.5 py-4 rounded-l-none overflow-hidden rounded-r-md animate-move"
        @click="toggleSidebar($event)"
      >
        <
      </div>
    </div>
    <div style="width: calc(100vw - 350px)" class="map">
      <KakaoMap
        :lat="coordinate.lat"
        :lng="coordinate.lng"
        :draggable="true"
        width="100vw"
        height="calc(100vh - 70px)"
        :class="['transition-width duration-500']"
        @onLoadKakaoMap="onLoadKakaoMap"
      >
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
