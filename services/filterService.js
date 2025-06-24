import api from "./api";

export async function getPerfilFilters() {
  const res = await api.get("/perfiles_medicos/filters");
  return res.data;
}
