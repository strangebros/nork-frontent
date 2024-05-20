import { ref } from "vue";
import { defineStore } from "pinia";
import authApi from "@/api/authApi";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const accessToken = ref(null);
    const member = ref(null);

    const signUp = async (memberInfo) => {
      await authApi.signUp(
        memberInfo,
        (response) => {
          let data = response.data["data"];
          accessToken.value = data["accessToken"];
          member.value = jwtDecode(accessToken.value);
        },
        (error) => {
          console.log(error);
        }
      );
    };

    const login = async (loginInfo) => {
      await authApi.login(
        loginInfo,
        (response) => {
          let data = response.data["data"];
          accessToken.value = data["accessToken"];
          member.value = jwtDecode(accessToken.value);
        },
        (error) => {
          console.log(error);
        }
      );
    };

    const logout = () => {
      accessToken.value = null;
      member.value = null;
    };

    return { member, accessToken, signUp, login, logout };
  },
  { persist: true }
);
