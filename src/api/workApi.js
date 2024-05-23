import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/works");

const workApi = {
  async start(reservationId, success, error) {
    await client
      .post("/start", {
        reservationId,
      })
      .then(success)
      .catch(error);
  },
  async end(dto, success, error) {
    await client.post("/end", JSON.stringify(dto)).then(success).catch(error);
  },
};

export default workApi;
