import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { jwtDecode } from "jwt-decode";

// Registro
export async function registerUser(data) {
  try {
    const response = await api.post("/usuarios/register", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

// Login
export async function loginUser(data) {
  const res = await api.post("/usuarios/login", data);

  if (res.data.token) {
    await AsyncStorage.setItem("token", res.data.token);

    // Decodifica el token para obtener el id_usuario
    const decoded = jwtDecode(res.data.token);
    const id_usuario = decoded.id_usuario;

    if (id_usuario) {
      try {
        const perfilRes = await api.get(`/usuarios/profile/${id_usuario}`, {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });
        const perfil = perfilRes.data;
        await AsyncStorage.setItem("user", JSON.stringify(perfil));
        console.log("Perfil guardado en AsyncStorage:", perfil);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      } 
    }
  }
  return res.data;
}
