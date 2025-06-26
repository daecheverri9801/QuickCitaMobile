import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

// Solicita permisos para acceder al calendario
export async function requestCalendarPermissions() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Se requieren permisos de calendario para agendar citas');
  }
  return true;
}

// Obtiene el calendario por defecto del dispositivo
export async function getDefaultCalendar() {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  
  // En iOS, buscar el calendario por defecto
  if (Platform.OS === 'ios') {
    return calendars.find(cal => cal.source.name === 'Default') || calendars[0];
  }
  
  // En Android, buscar un calendario local o el primero disponible
  return calendars.find(cal => cal.source.type === Calendar.SourceType.LOCAL) || calendars[0];
}

export async function 
addAppointmentToCalendar({
  doctorName,
  especialidad,
  ubicacion,
  fechaHora,
  duracionMinutos = 60,
  recordatorios = ['60', '15'] // ← NUEVO PARÁMETRO
}) {
  try {
    // Solicitar permisos
    await requestCalendarPermissions();
    
    // Obtener calendario por defecto
    const defaultCalendar = await getDefaultCalendar();
    
    if (!defaultCalendar) {
      throw new Error('No se encontró un calendario disponible');
    }

    // Crear fechas de inicio y fin
    const startDate = new Date(fechaHora);
    const endDate = new Date(startDate.getTime() + duracionMinutos * 60000);

    // Crear el evento
    const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
      title: `Cita médica - Dr(a). ${doctorName}`,
      startDate,
      endDate,
      location: ubicacion || 'Consultorio médico',
      notes: `Especialidad: ${especialidad}\nCita agendada a través de QuickCita`,
      alarms: recordatorios.map(minutes => ({ relativeOffset: -parseInt(minutes) })), // ← AQUÍ ESTÁ LA ACTUALIZACIÓN
    });

    return eventId;
  } catch (error) {
    console.error('Error agregando cita al calendario:', error);
    throw error;
  }
}

// Actualiza un evento del calendario
export async function updateCalendarEvent(eventId, updates) {
  try {
    await Calendar.updateEventAsync(eventId, updates);
    return true;
  } catch (error) {
    console.error('Error actualizando evento del calendario:', error);
    throw error;
  }
}

// Elimina un evento del calendario
export async function deleteCalendarEvent(eventId) {
  try {
    await Calendar.deleteEventAsync(eventId);
    return true;
  } catch (error) {
    console.error('Error eliminando evento del calendario:', error);
    throw error;
  }
}
