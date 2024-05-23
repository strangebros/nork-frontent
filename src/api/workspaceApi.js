import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/workspaces");

const workspaceApi = {
  async search(poiId, success, error) {
    await client
      .get(`/search`, {
        params: {
          poiId,
        },
      })
      .then(success)
      .catch(error);
  },
  async searchByWorkspaceId(workspaceId, success, error) {
    await client.get(`/${workspaceId}`).then(success).catch(error);
  },
  async searchAll(request, success, error) {
    await client
      .get(`/search`, {
        params: request,
      })
      .then(success)
      .catch(error);
  },
  async searchPopulars(position, success, error) {
    await client
      .get(`/popular`, {
        position,
      })
      .then(success)
      .catch(error);
  },
};

export default workspaceApi;
