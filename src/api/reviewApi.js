import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/reviews");

const reviewApi = {
  async findAll(dto, success, error) {
    await client.get("", { params: dto }).then(success).catch(error);
  },
};

export default reviewApi;
