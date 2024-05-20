import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/members");

const memberApi = {
  async getMemberInfo(memberId, success, error) {
    await client.get(`/${memberId}`).then(success).catch(error);
  },
};

export default memberApi;
