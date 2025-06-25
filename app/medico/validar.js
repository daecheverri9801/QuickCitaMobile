import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import MobileNavbar from "../../components/Navbar";
import CustomAlert from "../../components/CustomAlert"; // Asegúrate de tener este componente
import CustomModal from "../../components/CustomModal"; // Asegúrate de tener este componente

export default function ValidarPerfilScreen() {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState({
    cedula_profesional: "",
    especialidad: "",
    ubicacion: "",
    seguro_medico: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Estados para alertas y modales personalizados
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [modal, setModal] = useState({
    show: false,
    title: "",
    body: "",
    onConfirm: null,
  });

  // Cargar usuario
  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) setUser(JSON.parse(data));
    });
  }, []);

  // Cargar perfil médico
  useEffect(() => {
    if (!user?.id_usuario) return;

    api
      .get(`/perfiles_medicos/${user.id_usuario}`)
      .then((res) => {
        if (res.data) {
          setPerfil({
            cedula_profesional: res.data.cedula_profesional || "",
            especialidad: res.data.especialidad || "",
            ubicacion: res.data.ubicacion || "",
            seguro_medico: res.data.seguro_medico || "",
          });
          // Si perfil ya tiene cédula y especialidad, bloqueamos edición
          if (res.data.cedula_profesional && res.data.especialidad) {
            setDisabled(true);
            showAlert("Tu perfil ya está validado y completo", "success");
          }
        }
      })
      .catch(() => {
        showAlert("No se pudo cargar el perfil. Intenta nuevamente.", "danger");
      })
      .finally(() => setLoading(false));
  }, [user?.id_usuario]);

  // Funciones para alertas y modales
  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(
      () => setAlert({ show: false, message: "", type: "info" }),
      4000
    );
  };

  const showModal = ({ title, body, onConfirm }) => {
    setModal({ show: true, title, body, onConfirm });
  };

  const handleModalConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    setModal({ show: false, title: "", body: "", onConfirm: null });
  };

  const handleModalCancel = () => {
    setModal({ show: false, title: "", body: "", onConfirm: null });
  };

  // Manejo de cambios en inputs
  const handleChange = (field, value) => {
    setPerfil((p) => ({ ...p, [field]: value }));
  };

  // Guardar perfil con confirmación
  const handleSave = () => {
    if (!perfil.cedula_profesional || !perfil.especialidad) {
      showAlert(
        "La cédula profesional y especialidad son obligatorias",
        "warning"
      );
      return;
    }

    showModal({
      title: "Confirmar actualización",
      body: "¿Estás seguro de que deseas guardar los cambios en tu perfil médico?",
      onConfirm: saveProfile,
    });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put(`/perfiles_medicos/${user.id_usuario}`, {
        id_usuario: user.id_usuario,
        ...perfil,
      });
      showAlert("Perfil guardado correctamente", "success");
      setDisabled(true);
    } catch (error) {
      console.error("Error guardando perfil:", error);
      showAlert("No se pudo guardar el perfil", "danger");
    } finally {
      setSaving(false);
    }
  };

  // Habilitar edición con confirmación
  const handleEdit = () => {
    showModal({
      title: "Editar perfil",
      body: "¿Deseas habilitar la edición de tu perfil? Algunos campos podrían requerir nueva validación.",
      onConfirm: () => {
        setDisabled(false);
        showAlert("Modo de edición habilitado", "info");
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#198754" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.header}>
          <FontAwesome5 name="user-md" size={24} color="#198754" />
          <Text style={styles.headerTitle}>Validar Perfil Médico</Text>
          {disabled && (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Cédula Profesional *</Text>
            <TextInput
              style={[styles.input, disabled && styles.inputDisabled]}
              value={perfil.cedula_profesional}
              onChangeText={(text) => handleChange("cedula_profesional", text)}
              editable={!disabled}
              placeholder="Ingresa tu cédula profesional"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Especialidad *</Text>
            <View
              style={[styles.pickerContainer, disabled && styles.inputDisabled]}
            >
              <Picker
                selectedValue={perfil.especialidad}
                onValueChange={(value) => handleChange("especialidad", value)}
                enabled={!disabled}
                style={styles.picker}
              >
                <Picker.Item label="-- Selecciona especialidad --" value="" />
                <Picker.Item label="Oftalmología" value="Oftalmología" />
                <Picker.Item label="Cardiología" value="Cardiología" />
                <Picker.Item label="Dermatología" value="Dermatología" />
                <Picker.Item label="Pediatría" value="Pediatría" />
                <Picker.Item label="Neurología" value="Neurología" />
                <Picker.Item label="Oncología" value="Oncología" />
                <Picker.Item label="Ginecología" value="Ginecología" />
                <Picker.Item label="Psiquiatría" value="Psiquiatría" />
                <Picker.Item
                  label="Medicina General"
                  value="Medicina General"
                />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ubicación</Text>
            <View
              style={[styles.pickerContainer, disabled && styles.inputDisabled]}
            >
              <Picker
                selectedValue={perfil.ubicacion}
                onValueChange={(value) => handleChange("ubicacion", value)}
                enabled={!disabled}
                style={styles.picker}
              >
                <Picker.Item label="-- Selecciona ubicación --" value="" />
                <Picker.Item label="Norte" value="Norte" />
                <Picker.Item label="Sur" value="Sur" />
                <Picker.Item label="Oriente" value="Oriente" />
                <Picker.Item label="Occidente" value="Occidente" />
                <Picker.Item label="Centro" value="Centro" />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Seguro Médico</Text>
            <View
              style={[styles.pickerContainer, disabled && styles.inputDisabled]}
            >
              <Picker
                selectedValue={perfil.seguro_medico}
                onValueChange={(value) => handleChange("seguro_medico", value)}
                enabled={!disabled}
                style={styles.picker}
              >
                <Picker.Item label="-- Selecciona seguro --" value="" />
                <Picker.Item label="Sura" value="Sura" />
                <Picker.Item label="Nueva EPS" value="Nueva EPS" />
                <Picker.Item label="EPS Sanitas" value="EPS Sanitas" />
                <Picker.Item label="Salud Total EPS" value="Salud Total EPS" />
              </Picker>
            </View>
          </View>

          {!disabled && (
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar Perfil</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <CustomAlert
        show={alert.show}
        message={alert.message}
        variant={alert.type}
        onClose={() => setAlert({ show: false, message: "", type: "info" })}
      />

      <CustomModal
        show={modal.show}
        title={modal.title}
        body={modal.body}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      <MobileNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    color: "#6c757d",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#198754",
    marginLeft: 10,
    flex: 1,
  },
  editButton: {
    backgroundColor: "#0d6efd",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#e9ecef",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  saveButton: {
    backgroundColor: "#198754",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
