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
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption,
} from "@headlessui/vue";

import {
  TransitionRoot,
  TransitionChild,
  DialogTitle,
  DialogPanel,
  Dialog,
} from "@headlessui/vue";

// model start
const isOpen = ref(false);

function closeModal() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}
// model end

import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/vue/20/solid";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const { member } = storeToRefs(authStore);
const themeStore = useThemeStore();
const router = useRouter();
const { darkMode } = storeToRefs(themeStore);

// searchbar start
let selectedQuery = ref("");
let query = ref("");

const realResults = ref([]);
const results = ref([query, realResults]);

const search = async (newValue) => {
  if (query.value == "") {
    selectedQuery.value = "";
  }

  realResults.value = await tmapApi.getResultNames(newValue);
};

// searchbar end

// options start
const distanceOptions = [
  {
    value: "0",
    label: "어디든 갈 수 있어요",
  },
  {
    value: "2",
    label: "우리 동네였으면 좋겠어요",
  },
  {
    value: "1",
    label: "집 앞도 가기 힘들어요",
  },
];

const keywordOptions = [
  {
    value: "0",
    label: "조용한",
  },
  {
    value: "1",
    label: "시끄러운",
  },
  {
    value: "2",
    label: "신나는",
  },
];

const selectedDistance = ref(distanceOptions[0]);
const selectedKeyword = ref(keywordOptions[0]);
// options end

const toMap = () => {
  if (selectedQuery.value == "") {
    isOpen.value = true;
    return;
  }
  router.push({
    name: "Map",
    query: {
      query: selectedQuery.value,
      radius: selectedDistance.value.value,
      keyword: selectedKeyword.value.label,
    },
  });
};
</script>

<template>
  <div
    class="flex justify-center overflow-y-hidden"
    :class="{ dark: darkMode }"
    style="height: calc(100vh - 70px)"
  >
    <TransitionRoot appear :show="isOpen" as="template" class="z-50">
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
                  검색어를 입력해 주세요.
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    장소명 또는 카테고리로 검색이 가능합니다.
                  </p>
                </div>

                <div class="mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-light dark:bg-primary-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeModal"
                  >
                    확인
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <div class="flex flex-col w-5/6 sm:w-2/3 xl:w-1/2 justify-center">
      <div class="flex justify-center w-full overflow-y-hidden">
        <img
          class="mb-20 w-56"
          src="@/assets/img/logo/navbar_logo.svg"
          alt="Logo"
        />
      </div>
      <div
        id="recommendWrapper"
        class="flex justify-center items-center text-sm bg-gray-200 dark:bg-gray-700 rounded-lg mb-5 px-2 py-4 dark:text-white"
      >
        <p class="mr-3">
          <span v-if="member != null">{{ member.nickname }}님, </span>최근
          <span class="font-semibold">'개발자'</span> 직군에서 핫한 장소들
          어떠신가요?
        </p>
        <button class="bg-primary-light text-white px-3 py-2 rounded-lg">
          추천받기
        </button>
      </div>
      <div
        id="searchWrapper"
        class="flex items-center flex-col rounded-lg px-4 py-6 bg-gray-200 dark:bg-gray-700 dark:text-white"
      >
        <div id="searchBar" class="flex items-center mb-4">
          <Combobox v-model="selectedQuery" class="mr-3">
            <div class="relative sm:w-80 md:w-96">
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
                  placeholder="어떤 장소를 찾으시나요?"
                  @change="
                    query = $event.target.value;
                    search($event.target.value);
                  "
                  @keyup.enter="toMap"
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
                    v-for="(result, index) in [
                      results[0].value,
                      ...results[1].value,
                    ]"
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
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ComboboxOption>
                </ComboboxOptions>
              </TransitionRoot>
            </div>
          </Combobox>

          <button
            @click="toMap"
            class="bg-primary-light text-white px-5 py-1.5 rounded-lg"
          >
            검색
          </button>
        </div>
        <div id="searchOptions" class="flex justify-around">
          <div id="distanceOptions" class="w-48 max-w-md text-sm mr-3">
            <RadioGroup v-model="selectedDistance">
              <RadioGroupLabel class="ml-1 font-semibold"
                >현재 나의 체력은?</RadioGroupLabel
              >
              <div class="space-y-2 mt-2">
                <RadioGroupOption
                  as="template"
                  v-for="option in distanceOptions"
                  :key="option.radius"
                  :value="option"
                  v-slot="{ active, checked }"
                >
                  <div
                    :class="[
                      active
                        ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                        : '',
                      checked ? 'bg-primary-dark text-white ' : 'bg-white ',
                    ]"
                    class="relative flex cursor-pointer rounded-3xl px-4 py-3 shadow-md focus:outline-none"
                  >
                    <div class="flex w-full items-center justify-between">
                      <div class="flex items-center">
                        <div class="text-sm">
                          <RadioGroupLabel
                            as="p"
                            :class="checked ? 'text-white' : 'text-gray-900'"
                            class="font-medium text-xs"
                          >
                            {{ option.label }}
                          </RadioGroupLabel>
                          <RadioGroupDescription
                            as="span"
                            :class="checked ? 'text-sky-100' : 'text-gray-500'"
                            class="inline"
                          >
                          </RadioGroupDescription>
                        </div>
                      </div>
                      <div v-show="checked" class="shrink-0 text-white">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle
                            cx="12"
                            cy="12"
                            r="12"
                            fill="#fff"
                            fill-opacity="0.2"
                          />
                          <path
                            d="M7 13l3 3 7-7"
                            stroke="#fff"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </RadioGroupOption>
              </div>
            </RadioGroup>
          </div>
          <div
            style="border-width: 0.5px"
            class="border-gray-300 h-full mx-4"
          ></div>
          <div id="keywordeOptions" class="max-w-md text-sm">
            <RadioGroup v-model="selectedKeyword">
              <RadioGroupLabel class="ml-1 font-semibold"
                >어떤 장소에 가고 싶나요?</RadioGroupLabel
              >
              <div class="space-y-2 w-24 mt-2">
                <RadioGroupOption
                  as="template"
                  v-for="option in keywordOptions"
                  :key="option.radius"
                  :value="option"
                  v-slot="{ active, checked }"
                >
                  <div
                    :class="[
                      active
                        ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                        : '',
                      checked ? 'bg-primary-dark text-white ' : 'bg-white ',
                    ]"
                    class="relative flex cursor-pointer rounded-3xl px-4 py-3 shadow-md focus:outline-none"
                  >
                    <div class="flex w-full items-center justify-between">
                      <div class="flex items-center">
                        <div class="text-sm">
                          <RadioGroupLabel
                            as="p"
                            :class="checked ? 'text-white' : 'text-gray-900'"
                            class="font-medium text-xs"
                          >
                            {{ option.label }}
                          </RadioGroupLabel>
                          <RadioGroupDescription
                            as="span"
                            :class="checked ? 'text-sky-100' : 'text-gray-500'"
                            class="inline"
                          >
                          </RadioGroupDescription>
                        </div>
                      </div>
                      <div v-show="checked" class="shrink-0 text-white">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle
                            cx="12"
                            cy="12"
                            r="12"
                            fill="#fff"
                            fill-opacity="0.2"
                          />
                          <path
                            d="M7 13l3 3 7-7"
                            stroke="#fff"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </RadioGroupOption>
              </div>
            </RadioGroup>
          </div>
        </div>
        <p class="text-xs mt-4">
          아직 결정하지 못했다면,
          <RouterLink
            class="text-blue-700 dark:text-blue-300"
            :to="{ name: 'Mypage' }"
            >내 지난 기록에서 찾아보세요.</RouterLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
