<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const loginForm = ref({
  id: "",
  password: "",
});

const login = async () => {
  try {
    await authStore.login(loginForm.value);
    router.push("/");
  } catch (error) {
    console.error("에러:", error);
    alert("로그인 실패");
  }
};
</script>

<template>
  <main class="login-container">
    <div class="login-box">
      <img
        src="@/assets/img/logo/웹페이지용-1(컨텐츠).svg"
        alt="Logo"
        class="login-logo"
      />
      <h1 class="login-title">로그인</h1>
      <form @submit.prevent="login" class="login-form">
        <label>
          <input
            type="text"
            v-model.trim="loginForm.id"
            required
            placeholder="아이디"
            class="login-input"
          />
        </label>
        <label>
          <input
            type="password"
            v-model.trim="loginForm.password"
            required
            placeholder="비밀번호"
            class="login-input"
          />
        </label>
        <input type="submit" value="로그인" class="login-button" />
      </form>
      <p class="signup-ment">
        아직 계정이 없으신가요?
        <router-link to="/signUp" class="signup-link">회원가입하기</router-link>
      </p>
    </div>
  </main>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-logo {
  width: 100px;
  margin-bottom: 20px;
}

.login-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.login-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #5271ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-button:hover {
  background-color: #405bdb;
}

.signup-ment {
  margin-top: 20px;
  color: #666;
}

.signup-link {
  color: #5271ff;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}
</style>
