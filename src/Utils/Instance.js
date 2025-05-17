import axios from "axios";

const instance = axios.create({
  baseURL: "https://notes-management-system-backend.vercel.app", 
  withCredentials: true,
});

export default instance;
