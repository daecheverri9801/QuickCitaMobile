import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../services/api";
import MobileNavbar from "../../components/Navbar";

export default function ApproveDoctorsScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/medicos/pendientes");
      setList(data);
    } catch (e) {
      setMsg("Error al cargar la lista");
    }
    setLoading(false);
  };

  const handle = async (id_perfil, action) => {
    try {
      if (action === "aprobar") {
        await api.put(`/admin/medicos/${id_perfil}/aprobar`);
        setMsg("Médico aprobado");
      } else {
        await api.delete(`/admin/medicos/${id_perfil}/rechazar`);
        setMsg("Médico rechazado");
      }
      fetch();
    } catch (e) {
      console.error(e);
      setMsg("Error al procesar");
    }
    setTimeout(() => setMsg(""), 3000);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.Usuario.nombre}</Text>
        <Text style={styles.email}>{item.Usuario.email}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => handle(item.id_perfil, "aprobar")}
        >
          <Ionicons name="checkmark" size={16} color="white" />
          <Text style={styles.buttonText}> Aprobar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handle(item.id_perfil, "rechazar")}
        >
          <Ionicons name="close" size={16} color="white" />
          <Text style={styles.buttonText}> Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aprobación de Médicos Pendientes</Text>

      {msg ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{msg}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#198754" />
        </View>
      ) : list.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay médicos pendientes por aprobar.
          </Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id_perfil.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <MobileNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 64,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#198754",
    textAlign: "center",
  },
  messageBox: {
    backgroundColor: "#d1e7dd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageText: {
    color: "#0f5132",
    textAlign: "center",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#6c757d", fontSize: 16 },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  infoContainer: { flex: 1 },
  name: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  email: { color: "#6c757d" },
  actionsContainer: { flexDirection: "row" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  approveButton: { backgroundColor: "#198754" },
  rejectButton: { backgroundColor: "#dc3545" },
  buttonText: { color: "white", fontWeight: "600" },
});
