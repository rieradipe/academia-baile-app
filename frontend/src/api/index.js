import { API } from "../config/api";

const API_URL = `${API}/api`;

export const getAlumnas = async () => {
  const res = await fetch(`${API_URL}/alumnas`);
  return res.json();
};
