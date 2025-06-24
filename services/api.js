import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.64:4000/api", 
});

// Cambio 2: AsyncStorage en lugar de localStorage
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
