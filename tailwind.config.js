/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 다크 모드 클래스를 사용할 것임을 명시
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#133DCF',
          dark: '#B9C3FF'
        },
        secondary: {
          light: '#2D5FA2',
          dark: '#C4D8FF'
        },
        background: {
          light: '#FBF8FF',
          dark: '#12131B'
        },
        surface: {
          light: '#FCF8F8',
          dark: '#141313'
        },
        error: {
          light: '#B81D27',
          dark: '#FFB3AE'
        },
        onPrimary: {
          light: '#FFFFFF',
          dark: '#00228B'
        },
        onSecondary: {
          light: '#FFFFFF',
          dark: '#003062'
        },
        onBackground: {
          light: '#1A1B23',
          dark: '#E2E1ED'
        },
        onSurface: {
          light: '#1C1B1B',
          dark: '#E5E2E1'
        },
        onError: {
          light: '#FFFFFF',
          dark: '#68000C'
        }
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

