import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.50.98:3000/",
});

export default api;
