import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import api from "../../services/api";
import MobileNavbar from "../../components/Navbar";
import { Picker } from "@react-native-picker/picker";

export default function ConfigureRolesScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUser, setModalUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // obtener usuarios desde la API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/usuarios");
      setUsers(data);
    } catch (error) {
      showAlert("Error al cargar los usuarios", "danger");
    }
    setLoading(false);
  };

  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(
      () => setAlert({ show: false, message: "", type: "info" }),
      3000
    );
  };

  // Cambiar el rol del usuario
  const changeRole = async (id, rol) => {
    try {
      await api.put(`/admin/usuarios/${id}/rol`, { rol });
      showAlert("Rol actualizado correctamente", "success");
      setUsers((u) => u.map((x) => (x.id_usuario === id ? { ...x, rol } : x)));
    } catch (error) {
      showAlert("Error al actualizar el rol", "danger");
    }
  };

  // Eliminar usuario
  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/usuarios/${id}`);
      showAlert("Usuario eliminado correctamente", "success");
      setUsers((u) => u.filter((x) => x.id_usuario !== id));
    } catch (error) {
      showAlert("Error al eliminar el usuario", "danger");
    }
  };

  // Confirmar eliminación de usuario
  const confirmDelete = (user) => {
    setModalUser(user);
    setModalVisible(true);
  };

  // Manejar confirmación de eliminación
  const handleDeleteConfirm = () => {
    if (modalUser) {
      deleteUser(modalUser.id_usuario);
      setModalVisible(false);
      setModalUser(null);
    }
  };

  // Obtener color del rol
  const getRoleColor = (rol) => {
    switch (rol) {
      case "administrador":
        return "#dc3545"; // rojo
      case "medico":
        return "#198754"; // verde
      case "paciente":
        return "#0d6efd"; // azul
      default:
        return "#6c757d"; // gris
    }
  };

  // Renderizar cada usuario
  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.nombre}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>

      <View style={styles.roleContainer}>
        <Text
          style={[
            styles.roleBadge,
            { backgroundColor: getRoleColor(item.rol) },
          ]}
        >
          {item.rol}
        </Text>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={item.rol}
          style={styles.picker}
          onValueChange={(value) => changeRole(item.id_usuario, value)}
        >
          <Picker.Item label="Paciente" value="paciente" />
          <Picker.Item label="Médico" value="medico" />
          <Picker.Item label="Administrador" value="administrador" />
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item)}
      >
        <MaterialIcons name="delete" size={24} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="user-cog" size={24} color="#198754" />
        <Text style={styles.title}>Configurar Roles de Usuario</Text>
      </View>

      {alert.show && (
        <View
          style={[
            styles.alertBox,
            alert.type === "success"
              ? styles.alertSuccess
              : alert.type === "danger"
              ? styles.alertDanger
              : styles.alertInfo,
          ]}
        >
          <Text style={styles.alertText}>{alert.message}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#198754" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay usuarios registrados.</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id_usuario.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Modal de confirmación */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Eliminar Usuario</Text>
            <Text style={styles.modalBody}>
              ¿Estás seguro de que deseas eliminar al usuario "
              {modalUser?.nombre}"? Esta acción no se puede deshacer.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDeleteConfirm}
              >
                <Text style={styles.modalButtonText}>Sí, eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <MobileNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8f9fa" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 8, color: "#198754" },
  alertBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  alertSuccess: { backgroundColor: "#d1e7dd" },
  alertDanger: { backgroundColor: "#f8d7da" },
  alertInfo: { backgroundColor: "#cff4fc" },
  alertText: { color: "#0f5132", textAlign: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#6c757d" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#6c757d", fontSize: 16 },
  userItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  userName: { fontWeight: "bold", fontSize: 16 },
  userEmail: { color: "#6c757d", marginBottom: 4 },
  roleContainer: { marginHorizontal: 8 },
  roleBadge: {
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  picker: { height: 40, width: "100%" },
  deleteButton: { padding: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalBody: { fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: { backgroundColor: "#6c757d" },
  confirmButton: { backgroundColor: "#dc3545" },
  modalButtonText: { color: "white", fontWeight: "bold" },
});
