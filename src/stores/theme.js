import { ref } from "vue";
import { defineStore } from "pinia";

export const useThemeStore = defineStore('theme', () => {
    const darkMode = ref(true);

    function toggleTheme() {
        this.darkMode = !this.darkMode;
    }

    return {
        darkMode,
        toggleTheme,
    };
});