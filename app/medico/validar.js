import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import MobileNavbar from "../../components/Navbar";

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
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id_usuario]);

  const handleSave = async () => {
    if (!perfil.cedula_profesional || !perfil.especialidad) {
      Alert.alert(
        "Error",
        "La cédula profesional y especialidad son obligatorias"
      );
      return;
    }

    setSaving(true);
    try {
      await api.post("/perfiles_medicos", {
        id_usuario: user.id_usuario,
        ...perfil,
      });
      Alert.alert("Éxito", "Perfil guardado correctamente");
    } catch (error) {
      console.error("Error guardando perfil:", error);
      Alert.alert("Error", "No se pudo guardar el perfil");
    } finally {
      setSaving(false);
    }
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
        </View>

        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Cédula Profesional *</Text>
            <TextInput
              style={styles.input}
              value={perfil.cedula_profesional}
              onChangeText={(text) =>
                setPerfil((p) => ({ ...p, cedula_profesional: text }))
              }
              placeholder="Ingresa tu cédula profesional"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Especialidad *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={perfil.especialidad}
                onValueChange={(value) =>
                  setPerfil((p) => ({ ...p, especialidad: value }))
                }
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
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={perfil.ubicacion}
                onValueChange={(value) =>
                  setPerfil((p) => ({ ...p, ubicacion: value }))
                }
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
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={perfil.seguro_medico}
                onValueChange={(value) =>
                  setPerfil((p) => ({ ...p, seguro_medico: value }))
                }
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
        </View>
      </ScrollView>
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
