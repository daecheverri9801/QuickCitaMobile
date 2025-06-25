import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Devuelve las tabs según el rol
function getRoleTabs(role) {
  switch (role) {
    case "paciente":
      return [
        {
          route: "/dashboard",
          label: "Buscar Médicos",
          icon: (focused) => (
            <FontAwesome5
              name="stethoscope"
              size={22}
              color={focused ? "#198754" : "#6c757d"}
            />
          ),
        },
      ];
    case "medico":
      return [
        {
          route: "/medico/validar",
          label: "Mi Perfil",
          icon: (focused) => (
            <FontAwesome5
              name="user-md"
              size={22}
              color={focused ? "#198754" : "#6c757d"}
            />
          ),
        },
        {
          route: "/medico/calendario",
          label: "Calendario",
          icon: (focused) => (
            <MaterialCommunityIcons
              name="calendar"
              size={22}
              color={focused ? "#198754" : "#6c757d"}
            />
          ),
        },
        {
          route: "/medico/alertas",
          label: "Alertas",
          icon: (focused) => (
            <Ionicons
              name="notifications"
              size={22}
              color={focused ? "#198754" : "#6c757d"}
            />
          ),
        },
      ];
    case "administrador":
      return [
        {
          route: "/admin/ApproveDoctors",
          label: "Aprobar Médicos",
          icon: (focused) => (
            <FontAwesome5
              name="user-md"
              size={22}
              color={focused ? "#198754" : "#6c757d"}
            />
          ),
        },
        {
          route: "/admin/ConfigureRoles",
          label: "Configurar Roles",
          icon: (focused) => (
            <FontAwesome5
              name="user-shield"
              size={22}
              color={focused ? "#198754" : "#6c757d"}
            />
          ),
        },
      ];
    default:
      return [];
  }
}

export default function MobileNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) setUser(JSON.parse(data));
      else setUser(null);
    });
  }, []);

  const role = user?.rol;
  const tabs = getRoleTabs(role);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
    router.replace("/login");
  };

  return (
    <View style={styles.navbar}>
      {user ? (
        <>
          {/* Nombre de usuario */}
          <View style={styles.userSection}>
            <Ionicons name="person-circle" size={20} color="#198754" />
            <Text style={styles.userText}>
              {user.nombre || user.email || "Usuario"}
            </Text>
          </View>
          {/* Tabs según rol */}
          {tabs.map((tab) => {
            const focused = pathname.startsWith(tab.route);
            return (
              <TouchableOpacity
                key={tab.route}
                style={styles.tab}
                onPress={() => router.replace(tab.route)}
              >
                {tab.icon(focused)}
                <Text style={[styles.label, focused && styles.labelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
          {/* Botón salir */}
          <TouchableOpacity style={styles.tab} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#dc3545" />
            <Text style={[styles.label, { color: "#dc3545" }]}>Salir</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Solo mostrar cuando NO hay usuario */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => router.replace("/login")}
          >
            <Ionicons name="log-in-outline" size={22} color="#198754" />
            <Text style={styles.label}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => router.replace("/register")}
          >
            <Ionicons name="person-add-outline" size={22} color="#198754" />
            <Text style={styles.label}>Registrarse</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 64,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 10,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  userText: {
    marginLeft: 4,
    fontSize: 13,
    color: "#198754",
    fontWeight: "bold",
    maxWidth: 90,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 2,
  },
  labelActive: {
    color: "#198754",
    fontWeight: "bold",
  },
});
