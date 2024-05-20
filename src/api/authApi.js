import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/members");

const authApi = {
  async signUp(memberInfo, success, error) {
    await client
      .post(`/signUp`, JSON.stringify(memberInfo))
      .then(success)
      .catch(error);
  },

  async login(loginInfo, success, error) {
    await client
      .post(`/login`, JSON.stringify(loginInfo))
      .then(success)
      .catch(error);
  },

  guestLogin(success, error) {
    client.post(`/guest-login`).then(success).catch(error);
  },
};

export default authApi;
