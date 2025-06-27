import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

// URL de tu backend (ajusta si usas IP o dominio)
const SOCKET_URL = "http://localhost:4000";

// Inicializamos el cliente de Socket.IO sin conectar todavía
const socket = io(SOCKET_URL, {
  autoConnect: false,
});

/**
 * Conecta el socket usando el token y une al room del usuario
 */
export const connectSocket = async () => {
  try {
    // Recuperar token y user desde AsyncStorage
    const token = await AsyncStorage.getItem("token");
    const userJson = await AsyncStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    if (!token || !user?.id_usuario) {
      console.warn("No hay token o user en storage, no se conecta el socket");
      return;
    }

    // Incluir auth en el handshake
    socket.auth = { token };
    socket.connect();

    // Unirse al room específico del usuario
    socket.emit("joinRoom", `user_${user.id_usuario}`);
  } catch (err) {
    console.error("Error conectando socket:", err);
  }
};

/**
 * Desconecta el socket del servidor
 */
export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
