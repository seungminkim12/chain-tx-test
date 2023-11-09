import axios from "axios";

export const server = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

server.defaults.headers.common["x-eq-ag-api-key"] =
  process.env.REACT_APP_API_KEY;
