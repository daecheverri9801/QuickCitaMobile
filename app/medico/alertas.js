import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import MobileNavbar from "../../components/Navbar";

export default function AlertasScreen() {
  const [user, setUser] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuario
  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) setUser(JSON.parse(data));
    });
  }, []);

  // Cargar alertas
  useEffect(() => {
    if (!user?.id_usuario) return;

    api
      .get(`/citas/medico/${user.id_usuario}`)
      .then((res) => {
        const now = new Date();
        const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
        const próximas = res.data.filter((c) => {
          const citaDate = new Date(c.fecha_hora);
          return citaDate > now && citaDate <= inOneHour;
        });
        setAlertas(próximas);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id_usuario]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#198754" />
        <Text style={styles.loadingText}>Cargando alertas...</Text>
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
          <Ionicons name="notifications" size={24} color="#f39c12" />
          <Text style={styles.headerTitle}>Alertas (Próximas en 1 hora)</Text>
        </View>

        <View style={styles.card}>
          {alertas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No tienes citas en la próxima hora.
              </Text>
            </View>
          ) : (
            alertas.map((c) => (
              <View key={c.id_cita} style={styles.alertItem}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertDate}>
                    {new Date(c.fecha_hora).toLocaleString()}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Próxima</Text>
                  </View>
                </View>
                <Text style={styles.alertPatient}>
                  Paciente:{" "}
                  <Text style={styles.patientName}>{c.Paciente?.nombre}</Text>
                </Text>
              </View>
            ))
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
    color: "#f39c12",
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
  alertItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  alertDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  badge: {
    backgroundColor: "#fff3cd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f39c12",
  },
  badgeText: {
    color: "#856404",
    fontSize: 12,
    fontWeight: "bold",
  },
  alertPatient: {
    fontSize: 14,
    color: "#6c757d",
  },
  patientName: {
    fontWeight: "bold",
    color: "#333",
  },
});
