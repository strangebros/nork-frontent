import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/members");

const memberApi = {
  getMemberInfo(memberId, success, error) {
    client.post(`/${memberId}`).then(success).catch(error);
  },
};

export default memberApi;
