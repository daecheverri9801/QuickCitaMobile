import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import MobileNavbar from "../../components/Navbar";

export default function CalendarioScreen() {
  const [user, setUser] = useState(null);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuario
  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) setUser(JSON.parse(data));
    });
  }, []);

  // Cargar citas
  useEffect(() => {
    if (!user?.id_usuario) return;

    api
      .get(`/citas/medico/${user.id_usuario}`)
      .then((res) => setCitas(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id_usuario]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#198754" />
        <Text style={styles.loadingText}>Cargando calendario...</Text>
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
          <MaterialCommunityIcons name="calendar" size={24} color="#0d6efd" />
          <Text style={styles.headerTitle}>Mi Calendario de Citas</Text>
        </View>

        <View style={styles.card}>
          {citas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes citas programadas.</Text>
            </View>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Paciente
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Fecha y hora
                </Text>
              </View>
              {citas.map((c, index) => (
                <View
                  key={c.id_cita}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 && styles.tableRowEven,
                  ]}
                >
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {c.Paciente?.nombre}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {new Date(c.fecha_hora).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
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
    color: "#0d6efd",
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#6c757d",
    fontSize: 16,
    textAlign: "center",
  },
  table: {
    padding: 16,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#dee2e6",
    backgroundColor: "#f8f9fa",
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#495057",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  tableRowEven: {
    backgroundColor: "#f8f9fa",
  },
  tableCell: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 8,
  },
});
