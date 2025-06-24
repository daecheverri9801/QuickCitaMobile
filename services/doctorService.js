import api from "./api";

// Busca médicos con filtros
export async function searchDoctors(filters) {
  const params = {
    especialidad: filters.especialidad,
    ubicacion: filters.ubicacion,
    seguro_medico: filters.seguro_medico,
  };
  const res = await api.get("/usuarios/medicos", { params });
  return res.data;
}