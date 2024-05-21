import { createRouter, createWebHistory } from "vue-router";
import { useLayoutStore } from "@/stores/layout";
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

router.beforeEach((to, from, next) => {
  const layoutStore = useLayoutStore();
  if (to.meta.hideHeader) {
    layoutStore.toggleHeader(false);
  } else {
    layoutStore.toggleHeader(true);
  }
  next();
});

// 로그인 인터셉터
router.beforeEach((to, from) => {
  if (["/", "/login", "/signUp", "/map"].includes(to.path)) {
    // 로그인 필요 X
    return;
  }

  let auth = JSON.parse(localStorage.getItem("auth"));
  if (auth == null || auth.member == null || auth.member.role == "GUEST") {
    // 로그인 필요
    return { name: "Login" };
  }

  // 정상 작동
  return;
});

export default router;
