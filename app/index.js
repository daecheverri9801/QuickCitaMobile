import { useRouter } from "expo-router";
import { View, Text, Button, StyleSheet, Image } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/Logo.png")} style={styles.logo} />
      <Text style={styles.title}>Bienvenido a QuickCita</Text>
      <Text style={styles.subtitle}>
        Tu Salud, Tu Tiempo, Tu Cita en un clic
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Iniciar Sesión" onPress={() => router.push("/login")} />
        <View style={{ height: 10 }} />
        <Button title="Registro" onPress={() => router.push("/register")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#198754",
  },
  subtitle: { fontSize: 16, color: "#6c757d", marginBottom: 30 },
  buttonContainer: { width: "80%" },
});
