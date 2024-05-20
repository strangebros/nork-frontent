import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/members");

function signUp(memberInfo, success, error) {
  client.post(`/signUp`, JSON.stringify(memberInfo)).then(success).catch(error);
}

function login(loginInfo, success, error) {
  client.post(`/login`, JSON.stringify(loginInfo)).then(success).catch(error);
}

function guestLogin(success, error) {
  client.post(`/guest-login`).then(success).catch(error);
}

export { signUp, login, guestLogin };
