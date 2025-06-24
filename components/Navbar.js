import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
          route: "/admin/medicos",
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
          route: "/admin/configurar",
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
      return [
        {
          route: "/login",
          label: "Iniciar Sesión",
          icon: (focused) => (
            <Ionicons
              name="log-in-outline"
              size={22}
              color={focused ? "#198754" : "#6c757d"}
            />
          ),
        },
        {
          route: "/register",
          label: "Registrarse",
          icon: (focused) => (
            <Ionicons
              name="person-add-outline"
              size={22}
              color={focused ? "#198754" : "#6c757d"}
            />
          ),
        },
      ];
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
      {user && (
        <TouchableOpacity style={styles.tab} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#dc3545" />
          <Text style={[styles.label, { color: "#dc3545" }]}>Salir</Text>
        </TouchableOpacity>
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
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
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
