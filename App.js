import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./app/index";
import LoginScreen from "./app/login";
import RegisterScreen from "./app/register";
import DashboardScreen from "./app/dashboard";
import AlertasScreen from "./app/medico/alertas";
import ValidarPerfilScreen from "./app/medico/validar";
import CalendarioScreen from "./app/medico/calendario";

const Stack = createNativeStackNavigator();

// Componente principal de la aplicación que define las rutas y pantallas
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Registro" }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "Dashboard" }}
        />
        <Stack.Screen
          name="Alertas"
          component={AlertasScreen}
          options={{ title: "Alertas" }}
        />
        <Stack.Screen
          name="ValidarPerfil"
          component={ValidarPerfilScreen}
          options={{ title: "Validar Perfil Médico" }}
        />
        <Stack.Screen
          name="Calendario"
          component={CalendarioScreen}
          options={{ title: "Calendario" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
