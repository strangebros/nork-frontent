import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/keywords");

const keywordApi = {
  async findAll(success, error) {
    await client.get().then(success).catch(error);
  },
};

export default keywordApi;
