import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/reviews");

const reviewsApi = {
  async getReviews(workspaceId, page, count, success, error) {
    await client
      .get("", {
        params: {
          workspaceId,
          page,
          count,
        },
      })
      .then(success)
      .catch(error);
  },
};

export default reviewsApi;
