import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

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
    await AsyncStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
}
