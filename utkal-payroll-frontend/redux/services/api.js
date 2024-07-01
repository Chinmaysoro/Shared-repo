import axios from "axios";
const instance = axios.create({
  // baseURL: process.env.baseURL,
  baseURL: "http://localhost:3030",
  headers: {
    "Content-Type": "application/json"
  }
});
export default instance;
