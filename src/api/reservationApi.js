import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/reservations");

const reservationApi = {
  async createReservation(data, success, error) {
    await client.post("", data).then(success).catch(error);
  },
};

export default reservationApi;
