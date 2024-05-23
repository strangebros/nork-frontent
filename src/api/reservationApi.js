import { norkAxios } from "@/util/http-commons";

const client = norkAxios("/reservations");

const reservationApi = {
  async createReservation(data, success, error) {
    await client.post("", data).then(success).catch(error);
  },
  async findOne(reservationId, success, error) {
    await client.get(`/${reservationId}`).then(success).catch(error);
  },
  async updateOne(reservationId, updateDto, success, error) {
    await client
      .put(`/${reservationId}`, JSON.stringify(updateDto))
      .then(success)
      .catch(error);
  },
  async deleteOne(reservationId, success, error) {
    await client.delete(`/${reservationId}`).then(success).catch(error);
  },
  async findAll(requestDto, success, error) {
    await client
      .get(``, {
        params: requestDto,
      })
      .then(success)
      .catch(error);
  },
  async delete(reservationId, success, error) {
    await client.delete(`/${reservationId}`).then(success).catch(error);
  },
};

export default reservationApi;
