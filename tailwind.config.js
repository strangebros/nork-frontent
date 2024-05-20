/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 다크 모드 클래스를 사용할 것임을 명시
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", "./src/App.vue"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#5271FF", // 밝은 모드의 primary 색상
          dark: "#4056B4", // 어두운 모드의 primary 색상 (조금 더 어둡게 조정)
        },
        secondary: {
          light: "#89B6FF", // 밝은 모드의 secondary 색상
          dark: "#6F91CC", // 어두운 모드의 secondary 색상 (조금 더 어둡게 조정)
        },
        background: {
          light: "#F5F5F5", // 밝은 모드의 background 색상 (neutral)
          dark: "#1E1E1E", // 어두운 모드의 background 색상 (어두운 회색으로 조정)
        },
        surface: {
          light: "#FFFFFF", // 밝은 모드의 surface 색상 (흰색)
          dark: "#121212", // 어두운 모드의 surface 색상 (아주 어두운 회색)
        },
        error: {
          light: "#FF5252", // 밝은 모드의 error 색상
          dark: "#CC4141", // 어두운 모드의 error 색상 (조금 더 어둡게 조정)
        },
        header: {
          light: "#F0F0F0",
          dark: "#2A2A2A",
        },
        onPrimary: {
          light: "#FFFFFF", // primary 배경에서의 텍스트 색상 (흰색)
          dark: "#FFFFFF", // 어두운 모드에서도 흰색으로 유지
        },
        onSecondary: {
          light: "#FFFFFF", // secondary 배경에서의 텍스트 색상 (흰색)
          dark: "#FFFFFF", // 어두운 모드에서도 흰색으로 유지
        },
        onBackground: {
          light: "#000000", // background 배경에서의 텍스트 색상 (검은색)
          dark: "#FFFFFF", // 어두운 모드의 background 배경에서의 텍스트 색상 (흰색)
        },
        onSurface: {
          light: "#000000", // surface 배경에서의 텍스트 색상 (검은색)
          dark: "#FFFFFF", // 어두운 모드의 surface 배경에서의 텍스트 색상 (흰색)
        },
        onError: {
          light: "#FFFFFF", // error 배경에서의 텍스트 색상 (흰색)
          dark: "#FFFFFF", // 어두운 모드에서도 흰색으로 유지
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
