import api from "./api";

// Servicio para obtener los filtros de especialidades médicas
export async function getPerfilFilters() {
  const res = await api.get("/perfiles_medicos/filters");
  return res.data;
}
