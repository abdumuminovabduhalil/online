import axios from "axios";

const url =  import.meta.env.VITE_API_URK

export const api = axios.create({
  baseURL: url,
  
});
