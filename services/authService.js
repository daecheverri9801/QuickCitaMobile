// frontend/src/services/authService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { jwtDecode } from "jwt-decode";
import { connectSocket, disconnectSocket } from "../mobileSocket";

// Registro
export async function registerUser(data) {
  try {
    const response = await api.post("/usuarios/register", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Login
export async function loginUser(data) {
  const res = await api.post("/usuarios/login", data);

  if (res.data.token) {
    // 1) Guardar token
    const token = res.data.token;
    await AsyncStorage.setItem("token", token);

    // 2) Decodificar para obtener id_usuario
    const decoded = jwtDecode(token);
    const id_usuario = decoded.id_usuario;

    if (id_usuario) {
      // 3) Obtener perfil completo
      const perfilRes = await api.get(
        `/usuarios/profile/${id_usuario}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const perfil = perfilRes.data;

      // 4) Guardar perfil en storage
      await AsyncStorage.setItem("user", JSON.stringify(perfil));

      // 5) Conectar socket y unirse al room
      await connectSocket();

      // 6) Retornar perfil para quien llame
      return perfil;
    }
  }

  throw new Error("Error en login");
}

// Logout elimina storage y desconecta socket
export async function logoutUser() {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
  disconnectSocket();
}
// 