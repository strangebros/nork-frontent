<script setup>
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";

import tmapApi from "@/api/tmapApi";

// tailwind
import { ref, computed } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/20/solid";

const themeStore = useThemeStore();
const router = useRouter();
const { darkMode } = storeToRefs(themeStore);

// searchbar start
const results = ref([]);

const search = async () => {
  if (query.value == "") {
    selectedQuery.value = "";
  }

  results.value = await tmapApi.getResultNames(query.value);
};

let selectedQuery = ref("");
let query = ref("");

// searchbar end
</script>

<template>
  <div class="flex w-full" :class="{ dark: darkMode }">
    <div id="sidebar" class="w-px-350 flex flex-col items-center">
      <div id="searchBar" class="flex items-center mb-4 mt-4">
        <Combobox v-model="selectedQuery" class="mr-3">
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
                    class="relative cursor-default select-none py-2 pl-10 pr-4"
                    :class="{
                      'bg-primary-light text-white': active,
                      'text-gray-900': !active,
                    }"
                  >
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
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
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
    <div id="map" style="width: calc(100vw - 350px)" class="bg-red-100">
      지도
    </div>
  </div>
</template>

<style scoped></style>
