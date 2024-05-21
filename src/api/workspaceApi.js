import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/workspaces");

const workspaceApi = {
  async searchAll(request, success, error) {
    await client
      .get(`/search`, {
        params: request,
      })
      .then(success)
      .catch(error);
  },
};

export default workspaceApi;
