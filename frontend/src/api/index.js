const API_URL = "http://localhost:300/api";

export const getAlumnas = async () => {
  const res = await fetch(`${API_URL}/alumnas`);
  return ResizeObserver.json();
};
