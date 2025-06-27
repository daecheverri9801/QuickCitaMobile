import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import socket, { connectSocket, disconnectSocket } from "../mobileSocket"; // Importa cliente de socket
import { searchDoctors } from "../services/doctorService";
import {
  createAppointment,
  getAvailableSlots,
} from "../services/appointmentService";
import { getPerfilFilters } from "../services/filterService";
import MobileNavbar from "../components/Navbar";
import CustomAlert from "../components/CustomAlert";
import CustomModal from "../components/CustomModal";

export default function DashboardScreen() {
  const router = useRouter();

  // Usuario autenticado
  const [user, setUser] = useState(null);

  // Filtros seleccionados
  const [filters, setFilters] = useState({
    especialidad: "",
    ubicacion: "",
    seguro_medico: "",
  });

  // Listas dinámicas de filtros
  const [especialidades, setEspecialidades] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [seguros, setSeguros] = useState([]);

  // Resultados de búsqueda
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Slots disponibles por médico
  const [slotsByDoctor, setSlotsByDoctor] = useState({});

  // Modal de agendamiento
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [fechaHora, setFechaHora] = useState("");
  const [notiMethod, setNotiMethod] = useState("email");

  // Alertas personalizadas
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });

  // Modal personalizado para confirmación
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    body: "",
    onConfirm: null,
  });

  // Cargar usuario y conectar socket
  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) {
        const usuario = JSON.parse(data);
        setUser(usuario);
        // Conectar socket
        connectSocket();
      }
    });
    return () => {
      // Desconectar socket al salir
      disconnectSocket();
    };
  }, []);

  // Escuchar evento de cita creada
  useEffect(() => {
    if (!user) return;
    const room = `user_${user.id_usuario}`;
    socket.on("appointmentCreated", ({ fecha_hora, medico }) => {
      setAlert({
        show: true,
        message: `📅 Cita con Dr(a). ${medico} para ${fecha_hora} creada exitosamente.`,
        type: "success",
      });
    });
    return () => {
      socket.off("appointmentCreated");
    };
  }, [user]);

  // Cargar filtros
  useEffect(() => {
    getPerfilFilters()
      .then(({ especialidades: esp, ubicaciones: ubi, seguros: seg }) => {
        setEspecialidades(Array.isArray(esp) ? esp : []);
        setUbicaciones(Array.isArray(ubi) ? ubi : []);
        setSeguros(Array.isArray(seg) ? seg : []);
      })
      .catch(() => {
        setAlert({ show: true, message: "Error al cargar filtros", type: "danger" });
      });
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setDoctors([]);
    setSlotsByDoctor({});
    try {
      const docs = await searchDoctors(filters);
      setDoctors(Array.isArray(docs) ? docs : []);
      if (!docs || docs.length === 0) {
        setAlert({ show: true, message: "No se encontraron médicos", type: "warning" });
        return;
      }
      const map = {};
      await Promise.all(
        docs.map(async (doc) => {
          const slots = await getAvailableSlots(doc.id_usuario);
          map[doc.id_usuario] = Array.isArray(slots) ? slots : [];
        })
      );
      setSlotsByDoctor(map);
      setAlert({ show: true, message: `Se encontraron ${docs.length} médicos`, type: "success" });
    } catch (err) {
      setAlert({ show: true, message: err.message || "Error buscando médicos", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (doctor, slot) => {
    setSelectedDoctor(doctor);
    setFechaHora(slot);
    setShowModal(true);
  };

  const handleAppointment = () => {
    if (!fechaHora) {
      setAlert({ show: true, message: "Selecciona fecha y hora", type: "warning" });
      return;
    }
    setConfirmModal({
      show: true,
      title: "Confirmar cita médica",
      body: `¿Agendar cita con Dr(a). ${selectedDoctor.nombre} el ${new Date(fechaHora).toLocaleString()}?`,
      onConfirm: confirmAppointment,
    });
  };

  const confirmAppointment = async () => {
    setConfirmModal({ show: false, title: "", body: "", onConfirm: null });
    try {
      await createAppointment({
        id_paciente: user.id_usuario,
        id_medico: selectedDoctor.id_usuario,
        fecha_hora: fechaHora,
        metodo_notificacion: notiMethod,
        seguro_medico: selectedDoctor.PerfilMedico?.seguro_medico || "",
      });
      setShowModal(false);
      // actualizar slots
      const updated = await getAvailableSlots(selectedDoctor.id_usuario);
      setSlotsByDoctor((prev) => ({
        ...prev,
        [selectedDoctor.id_usuario]: Array.isArray(updated) ? updated : [],
      }));
      setAlert({ show: true, message: "Cita agendada exitosamente", type: "success" });
    } catch (err) {
      setAlert({ show: true, message: err.message || "Error al agendar cita", type: "danger" });
    }
  };

  const handleConfirmModalCancel = () => {
    setConfirmModal({ show: false, title: "", body: "", onConfirm: null });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.header}>Buscar médicos y agendar cita</Text>
        <CustomAlert
          show={alert.show}
          message={alert.message}
          variant={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "info" })}
        />
        {/* Filtros */}
        <View style={styles.filters}>
          <Picker
            selectedValue={filters.especialidad}
            onValueChange={(value) => handleFilterChange("especialidad", value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Especialidad --" value="" />
            {especialidades.map((sp) => (
              <Picker.Item key={sp} label={sp} value={sp} />
            ))}
          </Picker>

          <Picker
            selectedValue={filters.ubicacion}
            onValueChange={(value) => handleFilterChange("ubicacion", value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Ubicación --" value="" />
            {ubicaciones.map((loc) => (
              <Picker.Item key={loc} label={loc} value={loc} />
            ))}
          </Picker>

          <Picker
            selectedValue={filters.seguro_medico}
            onValueChange={(value) =>
              handleFilterChange("seguro_medico", value)
            }
            style={styles.picker}
          >
            <Picker.Item label="-- Seguro médico --" value="" />
            {seguros.map((sg) => (
              <Picker.Item key={sg} label={sg} value={sg} />
            ))}
          </Picker>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.searchButtonText}>Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Resultados */}
        <View style={styles.results}>
          {doctors.map((doc) => (
            <View key={doc.id_usuario} style={styles.card}>
              <Text style={styles.cardTitle}>{doc.nombre}</Text>
              <Text style={styles.cardText}>
                <Text style={{ fontWeight: "bold" }}>Especialidad:</Text>{" "}
                {doc.PerfilMedico?.especialidad || "N/A"}
                {"\n"}
                <Text style={{ fontWeight: "bold" }}>Ubicación:</Text>{" "}
                {doc.PerfilMedico?.ubicacion || "N/A"}
              </Text>

              <View style={styles.slotsContainer}>
                {slotsByDoctor[doc.id_usuario]?.length > 0 ? (
                  slotsByDoctor[doc.id_usuario].map((slot) => (
                    <View key={slot} style={styles.slotRow}>
                      <Text style={styles.slotText}>
                        {new Date(slot).toLocaleString()}
                      </Text>
                      <TouchableOpacity
                        style={styles.reserveButton}
                        onPress={() => openModal(doc, slot)}
                      >
                        <Text style={styles.reserveButtonText}>Reservar</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noSlots}>
                    No hay horarios disponibles
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Modal de agendamiento */}
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Agendar con {selectedDoctor?.nombre}
              </Text>
              <Text style={styles.modalLabel}>Fecha y hora</Text>
              <TextInput
                style={styles.input}
                value={fechaHora ? new Date(fechaHora).toLocaleString() : ""}
                editable={false}
              />
              <Text style={styles.modalLabel}>Método de notificación</Text>
              <Picker
                selectedValue={notiMethod}
                onValueChange={setNotiMethod}
                style={styles.picker}
              >
                <Picker.Item label="Email" value="email" />
                <Picker.Item label="SMS" value="sms" />
                <Picker.Item label="Email y SMS" value="ambos" />
              </Picker>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleAppointment}
                >
                  <Text style={styles.confirmButtonText}>Confirmar Cita</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal personalizado para confirmación */}
        <CustomModal
          show={confirmModal.show}
          title={confirmModal.title}
          body={confirmModal.body}
          onConfirm={confirmModal.onConfirm}
          onCancel={handleConfirmModalCancel}
        />
      </ScrollView>
      <MobileNavbar />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#198754",
    marginBottom: 20,
    textAlign: "center",
  },

  alert: { padding: 12, borderRadius: 8, marginBottom: 15 },
  alertSuccess: { backgroundColor: "#d1e7dd" },
  alertDanger: { backgroundColor: "#f8d7da" },
  alertWarning: { backgroundColor: "#fff3cd" },
  alertText: { color: "#333", textAlign: "center" },
  filters: { marginBottom: 20 },
  picker: { backgroundColor: "#fff", borderRadius: 8, marginBottom: 10 },
  searchButton: {
    backgroundColor: "#0d6efd",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  searchButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  results: { marginTop: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#198754",
    marginBottom: 6,
  },
  cardText: { fontSize: 15, color: "#333", marginBottom: 10 },
  slotsContainer: { maxHeight: 120 },
  slotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  slotText: { fontSize: 14, color: "#555" },

  reserveButton: {
    backgroundColor: "#198754",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  reserveButtonText: { color: "#fff", fontWeight: "bold" },
  noSlots: { color: "#888", fontStyle: "italic" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#198754",
    marginBottom: 10,
  },
  modalLabel: { fontWeight: "600", color: "#6c757d", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: { color: "#fff", fontWeight: "bold" },
  confirmButton: {
    backgroundColor: "#0d6efd",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  confirmButtonText: { color: "#fff", fontWeight: "bold" },
});
