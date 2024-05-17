import { ref } from "vue";
import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", () => {
  const showHeader = ref(true);

  function toggleHeader(value) {
    showHeader.value = value;
  }

  return {
    showHeader,
    toggleHeader,
  };
});
