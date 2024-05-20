import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/members");

const authApi = {
  signUp(memberInfo, success, error) {
    client
      .post(`/signUp`, JSON.stringify(memberInfo))
      .then(success)
      .catch(error);
  },

  login(loginInfo, success, error) {
    client.post(`/login`, JSON.stringify(loginInfo)).then(success).catch(error);
  },

  guestLogin(success, error) {
    client.post(`/guest-login`).then(success).catch(error);
  },
};

export default authApi;
