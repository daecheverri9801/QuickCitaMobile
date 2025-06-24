import api from "./api";

/**
 * @param {{ id_paciente:number, id_medico:number, fecha_hora:string, metodo_notificacion:string, seguro_medico?:string }} data
 */

// Crea una nueva cita
export const createAppointment = async (data) => {
  const res = await api.post("/citas/create", data);
  return res.data;
};

// Obtiene slots libres
export const getAvailableSlots = async (id_medico) => {
  const res = await api.get(`/citas/${id_medico}/slots`);
  return res.data;
};
