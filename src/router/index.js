import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Home/HomeView.vue";
import MapView from "@/views/Map/MapView.vue";
import MypageView from "@/views/User/MypageView.vue";
import WorkView from "@/views/Work/WorkView.vue";
import WorkspaceView from "@/views/Workspace/WorkspaceView.vue";
import LoginView from "@/views/Auth/LoginView.vue";
import SignUpView from "@/views/Auth/SignUpView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/map",
      name: "Map",
      component: MapView,
    },
    {
      path: "/mypage",
      name: "Mypage",
      component: MypageView,
    },
    {
      path: "/work",
      name: "Work",
      component: WorkView,
    },
    {
      path: "/workspace",
      name: "Workspace",
      component: WorkspaceView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/signUp",
      name: "SignUp",
      component: SignUpView,
    },
  ],
});

export default router;
