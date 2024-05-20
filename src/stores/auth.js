import { ref } from "vue";
import { defineStore } from "pinia";
import authApi from "@/api/authApi";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref(null);
    const user = ref(null);

    const signUp = async (memberInfo) => {
      // await authApi.signUp(memberInfo);
      // // 토큰 정보 및 유저 정보 세팅(회원 가입 후, 로그인 따로 할 필요 없음)
      // token.value = response.data.data.accessToken;
      // user.value = jwtDecode(token.value);
    };

    const login = async (loginInfo) => {
      await authApi.login(
        loginInfo,
        (response) => {
          let data = response.data["data"];
          console.log(data["accessToken"]);

          // token.value = response.data.data.accessToken;
          // user.value = jwtDecode(token.value);

          // console.log(user.value);
        },
        (error) => {
          console.log(error);
        }
      );
    };

    const logout = () => {
      // 토큰 정보 및 유저 정보 삭제
      token.value = null;
      user.value = null;
    };

    return { user, token, signUp, login, logout };
  },
  { persist: true }
);
