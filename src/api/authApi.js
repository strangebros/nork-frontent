import axios from "axios";

const authApi = axios.create({
  baseURL: "/api/members",
});

export default authApi;
