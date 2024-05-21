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
      let result = false;
      await authApi.signUp(
        memberInfo,
        (response) => {
          let data = response.data["data"];
          accessToken.value = data["accessToken"];
          member.value = jwtDecode(accessToken.value);
          result = true;
        },
        (error) => {
          console.log(error);
        }
      );
      return result;
    };

    const login = async (loginInfo) => {
      let result = false;
      await authApi.login(
        loginInfo,
        (response) => {
          let data = response.data["data"];
          accessToken.value = data["accessToken"];
          member.value = jwtDecode(accessToken.value);
          result = true;
        },
        (error) => {
          console.log(error);
        }
      );
      return result;
    };

    const logout = () => {
      accessToken.value = null;
      member.value = null;
    };

    return { member, accessToken, signUp, login, logout };
  },
  { persist: true }
);
