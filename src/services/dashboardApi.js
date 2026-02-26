import axios from "axios";

const API_BASE = "http://localhost:3000/api";

export const getOverview = async () => {
  const res = await axios.get(`${API_BASE}/overview`);
  return res.data;
};