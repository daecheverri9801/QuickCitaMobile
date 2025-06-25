// import { Ionicons } from "@expo/vector-icons";
// import { Picker } from "@react-native-picker/picker";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// import { loginUser, registerUser } from "../services/authService";

// // Regex para validar contraseña
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

// export default function RegisterScreen() {
//   const router = useRouter();

//   // datos del registro nuevo
//   const [form, setForm] = useState({
//     nombre: "",
//     email: "",
//     telefono: "+57",
//     password: "",
//     confirmPassword: "",
//     red_social: "",
//     rol: "paciente",
//   });

//   // credenciales del admin existente
//   const [adminCreds, setAdminCreds] = useState({
//     adminEmail: "",
//     adminPassword: "",
//   });

//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [showAdminPassword, setShowAdminPassword] = useState(false);

//   const onChange = (name, value) => {
//     if (name === "adminEmail" || name === "adminPassword") {
//       setAdminCreds((c) => ({ ...c, [name]: value }));
//     } else if (name === "telefono") {
//       // Solo números después del +57
//       const numericValue = value.replace(/\D/g, "");
//       setForm((f) => ({ ...f, telefono: "+57" + numericValue }));
//     } else {
//       setForm((f) => ({ ...f, [name]: value }));
//     }
//     setError("");
//   };

//   const onSubmit = async () => {
//     setError("");

//     // 1) Validar contraseña
//     if (!passwordRegex.test(form.password)) {
//       setError(
//         "La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un carácter especial."
//       );
//       return;
//     }
//     if (form.password !== form.confirmPassword) {
//       setError("La confirmación de contraseña no coincide.");
//       return;
//     }

//     setSubmitting(true);

//     // 2) Si quieren crear un Admin, primero autenticamos al Admin existente
//     if (form.rol === "administrador") {
//       if (!adminCreds.adminEmail || !adminCreds.adminPassword) {
//         setError(
//           "Debes ingresar email y contraseña de un Administrador existente."
//         );
//         setSubmitting(false);
//         return;
//       }
//       try {
//         await loginUser({
//           email: adminCreds.adminEmail,
//           password: adminCreds.adminPassword,
//         });
//       } catch (err) {
//         setError(err.message || "Autenticación de Admin fallida.");
//         setSubmitting(false);
//         return;
//       }
//     }

//     // 3) Ya validado (o rol != admin), procedemos a registrar
//     try {
//       await registerUser({
//         nombre: form.nombre,
//         email: form.email,
//         telefono: form.telefono,
//         password: form.password,
//         red_social: form.red_social,
//         rol: form.rol,
//       });

//       setSuccess(
//         "Registro creado con éxito. En breve serás redirigido al inicio de sesión..."
//       );
//       setTimeout(() => router.replace("/login"), 3000);
//     } catch (err) {
//       setError(err.message || "Ocurrió un error al registrar.");
//       setSubmitting(false);
//     }
//   };

//   const showAlert = (message, type = "error") => {
//     Alert.alert(type === "error" ? "Error" : "Éxito", message, [
//       { text: "OK" },
//     ]);
//   };

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.contentContainer}
//     >
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => router.back()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color="#0d6efd" />
//         </TouchableOpacity>
//         <View style={styles.headerContent}>
//           <Ionicons name="person-add" size={48} color="#0d6efd" />
//           <Text style={styles.title}>Crear Cuenta</Text>
//           <Text style={styles.subtitle}>
//             Únete a QuickCita y gestiona tus citas médicas
//           </Text>
//         </View>
//       </View>

//       {/* Alertas */}
//       {error ? showAlert(error, "error") : null}
//       {success ? showAlert(success, "success") : null}

//       {!success && (
//         <View style={styles.form}>
//           {/* Nombre y Teléfono */}
//           <View style={styles.row}>
//             <View style={styles.halfInput}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Nombre completo"
//                 value={form.nombre}
//                 onChangeText={(value) => onChange("nombre", value)}
//                 editable={!submitting}
//               />
//             </View>
//             <View style={styles.halfInput}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="3001234567"
//                 value={form.telefono.replace("+57", "")}
//                 onChangeText={(value) => onChange("telefono", value)}
//                 keyboardType="numeric"
//                 maxLength={10}
//                 editable={!submitting}
//               />
//             </View>
//           </View>

//           {/* Email */}
//           <TextInput
//             style={styles.input}
//             placeholder="Correo electrónico"
//             value={form.email}
//             onChangeText={(value) => onChange("email", value)}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             editable={!submitting}
//           />

//           {/* Contraseñas */}
//           <View style={styles.row}>
//             <View style={styles.halfInput}>
//               <View style={styles.passwordContainer}>
//                 <TextInput
//                   style={styles.passwordInput}
//                   placeholder="Contraseña"
//                   valu
//                   e={form.password}
//                   onChangeText={(value) => onChange("password", value)}
//                   secureTextEntry={!showPassword}
//                   editable={!submitting}
//                 />
//                 <TouchableOpacity
//                   onPress={() => setShowPassword(!showPassword)}
//                   style={styles.eyeIcon}
//                 >
//                   <Ionicons
//                     name={showPassword ? "eye-off" : "eye"}
//                     size={20}
//                     color="#6c757d"
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <View style={styles.halfInput}>
//               <View style={styles.passwordContainer}>
//                 <TextInput
//                   style={styles.passwordInput}
//                   placeholder="Confirmar contraseña"
//                   value={form.confirmPassword}
//                   onChangeText={(value) => onChange("confirmPassword", value)}
//                   secureTextEntry={!showConfirm}
//                   editable={!submitting}
//                 />
//                 <TouchableOpacity
//                   onPress={() => setShowConfirm(!showConfirm)}
//                   style={styles.eyeIcon}
//                 >
//                   <Ionicons
//                     name={showConfirm ? "eye-off" : "eye"}
//                     size={20}
//                     color="#6c757d"
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>

//           {/* Red Social y Rol */}
//           <View style={styles.row}>
//             <View style={styles.halfInput}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Red social (opcional)"
//                 value={form.red_social}
//                 onChangeText={(value) => onChange("red_social", value)}
//                 editable={!submitting}
//               />
//             </View>
//             <View style={styles.halfInput}>
//               <View style={styles.pickerContainer}>
//                 <Picker
//                   selectedValue={form.rol}
//                   onValueChange={(value) => onChange("rol", value)}
//                   enabled={!submitting}
//                   style={styles.picker}
//                 >
//                   <Picker.Item label="Paciente" value="paciente" />
//                   <Picker.Item label="Médico" value="medico" />
//                   <Picker.Item label="Administrador" value="administrador" />
//                 </Picker>
//               </View>
//             </View>
//           </View>

//           {/* Sección de Admin */}
//           {form.rol === "administrador" && (
//             <View style={styles.adminSection}>
//               <Text style={styles.adminTitle}>
//                 Verificación de Administrador
//               </Text>
//               <View style={styles.row}>
//                 <View style={styles.halfInput}>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Email del admin existente"
//                     value={adminCreds.adminEmail}
//                     onChangeText={(value) => onChange("adminEmail", value)}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     editable={!submitting}
//                   />
//                 </View>
//                 <View style={styles.halfInput}>
//                   <View style={styles.passwordContainer}>
//                     <TextInput
//                       style={styles.passwordInput}
//                       placeholder="Contraseña del admin"
//                       value={adminCreds.adminPassword}
//                       onChangeText={(value) => onChange("adminPassword", value)}
//                       secureTextEntry={!showAdminPassword}
//                       editable={!submitting}
//                     />
//                     <TouchableOpacity
//                       onPress={() => setShowAdminPassword(!showAdminPassword)}
//                       style={styles.eyeIcon}
//                     >
//                       <Ionicons
//                         name={showAdminPassword ? "eye-off" : "eye"}
//                         size={20}
//                         color="#6c757d"
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           )}

//           {/* Botón de registro */}
//           <TouchableOpacity
//             style={[styles.submitButton, submitting && styles.disabledButton]}
//             onPress={onSubmit}
//             disabled={submitting}
//           >
//             <Text style={styles.submitButtonText}>
//               {submitting ? "Procesando..." : "Crear Cuenta"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Link a Login */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
//         <TouchableOpacity onPress={() => router.push("/login")}>
//           <Text style={styles.footerLink}>Inicia sesión aquí</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   contentContainer: {
//     padding: 20,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   backButton: {
//     alignSelf: "flex-start",
//     marginBottom: 20,
//   },
//   headerContent: {
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#198754",
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#6c757d",
//     textAlign: "center",
//   },
//   form: {
//     backgroundColor: "white",
//     borderRadius: 15,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//     marginBottom: 20,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//   },
//   halfInput: {
//     flex: 0.48,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 15,
//     fontSize: 16,
//     backgroundColor: "#fff",
//     marginBottom: 15,
//   },

//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     backgroundColor: "#fff",
//     marginBottom: 15,
//   },
//   passwordInput: {
//     flex: 1,
//     padding: 15,
//     fontSize: 16,
//   },
//   eyeIcon: {
//     padding: 15,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     backgroundColor: "#fff",
//     marginBottom: 15,
//   },
//   picker: {
//     height: 50,
//   },
//   adminSection: {
//     backgroundColor: "#f8f9fa",
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   adminTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 15,
//     color: "#495057",
//   },
//   submitButton: {
//     backgroundColor: "#0d6efd",
//     borderRadius: 8,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   disabledButton: {
//     backgroundColor: "#6c757d",
//   },
//   submitButtonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   footer: {
//     flexDirection: "row",

//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
//   footerText: {
//     color: "#6c757d",
//     fontSize: 16,
//   },
//   footerLink: {
//     color: "#0d6efd",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginUser, registerUser } from "../services/authService";
import CustomAlert from "../components/CustomAlert"; // Asegúrate de tener este componente

// Regex para validar contraseña
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

export default function RegisterScreen() {
  const router = useRouter();

  // datos del registro nuevo
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "+57",
    password: "",
    confirmPassword: "",
    red_social: "",
    rol: "paciente",
  });

  // credenciales del admin existente
  const [adminCreds, setAdminCreds] = useState({
    adminEmail: "",
    adminPassword: "",
  });

  // Estados para alertas personalizadas
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const onChange = (name, value) => {
    if (name === "adminEmail" || name === "adminPassword") {
      setAdminCreds((c) => ({ ...c, [name]: value }));
    } else if (name === "telefono") {
      // Solo números después del +57
      const numericValue = value.replace(/\D/g, "");
      setForm((f) => ({ ...f, telefono: "+57" + numericValue }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    setAlert({ show: false, message: "", type: "error" }); // Limpiar alerta al cambiar
  };

  const showAlert = (message, type = "error") => {
    setAlert({ show: true, message, type });
    setTimeout(
      () => setAlert({ show: false, message: "", type: "error" }),
      4000
    );
  };

  const onSubmit = async () => {
    setAlert({ show: false, message: "", type: "error" });

    // 1) Validar contraseña
    if (!passwordRegex.test(form.password)) {
      showAlert(
        "La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un carácter especial.",
        "error"
      );
      return;
    }
    if (form.password !== form.confirmPassword) {
      showAlert("La confirmación de contraseña no coincide.", "error");
      return;
    }

    setSubmitting(true);

    // 2) Si quieren crear un Admin, primero autenticamos al Admin existente
    if (form.rol === "administrador") {
      if (!adminCreds.adminEmail || !adminCreds.adminPassword) {
        showAlert(
          "Debes ingresar email y contraseña de un Administrador existente.",
          "error"
        );
        setSubmitting(false);
        return;
      }
      try {
        await loginUser({
          email: adminCreds.adminEmail,
          password: adminCreds.adminPassword,
        });
      } catch (err) {
        showAlert(err.message || "Autenticación de Admin fallida.", "error");
        setSubmitting(false);
        return;
      }
    }

    // 3) Ya validado (o rol != admin), procedemos a registrar
    try {
      await registerUser({
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        password: form.password,
        red_social: form.red_social,
        rol: form.rol,
      });

      showAlert(
        "Registro creado con éxito. En breve serás redirigido al inicio de sesión...",
        "success"
      );
      setTimeout(() => router.replace("/login"), 3000);
    } catch (err) {
      showAlert(err.message || "Ocurrió un error al registrar.", "error");
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#0d6efd" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="person-add" size={48} color="#0d6efd" />
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>
            Únete a QuickCita y gestiona tus citas médicas
          </Text>
        </View>
      </View>

      {/* Alertas personalizadas */}
      <CustomAlert
        show={alert.show}
        message={alert.message}
        variant={alert.type === "error" ? "danger" : alert.type}
        onClose={() => setAlert({ show: false, message: "", type: "error" })}
      />

      {!alert.show && (
        <>
          {/* Formulario */}
          <View style={styles.form}>
            {/* Nombre y Teléfono */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre completo"
                  value={form.nombre}
                  onChangeText={(value) => onChange("nombre", value)}
                  editable={!submitting}
                />
              </View>
              <View style={styles.halfInput}>
                <TextInput
                  style={styles.input}
                  placeholder="3001234567"
                  value={form.telefono.replace("+57", "")}
                  onChangeText={(value) => onChange("telefono", value)}
                  keyboardType="numeric"
                  maxLength={10}
                  editable={!submitting}
                />
              </View>
            </View>

            {/* Email */}
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={form.email}
              onChangeText={(value) => onChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!submitting}
            />

            {/* Contraseñas */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Contraseña"
                    value={form.password}
                    onChangeText={(value) => onChange("password", value)}
                    secureTextEntry={!showPassword}
                    editable={!submitting}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#6c757d"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.halfInput}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirmar contraseña"
                    value={form.confirmPassword}
                    onChangeText={(value) => onChange("confirmPassword", value)}
                    secureTextEntry={!showConfirm}
                    editable={!submitting}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirm ? "eye-off" : "eye"}
                      size={20}
                      color="#6c757d"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Red Social y Rol */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Red social (opcional)"
                  value={form.red_social}
                  onChangeText={(value) => onChange("red_social", value)}
                  editable={!submitting}
                />
              </View>
              <View style={styles.halfInput}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={form.rol}
                    onValueChange={(value) => onChange("rol", value)}
                    enabled={!submitting}
                    style={styles.picker}
                  >
                    <Picker.Item label="Paciente" value="paciente" />
                    <Picker.Item label="Médico" value="medico" />
                    <Picker.Item label="Administrador" value="administrador" />
                  </Picker>
                </View>
              </View>
            </View>

            {/* Sección de Admin */}
            {form.rol === "administrador" && (
              <View style={styles.adminSection}>
                <Text style={styles.adminTitle}>
                  Verificación de Administrador
                </Text>
                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email del admin existente"
                      value={adminCreds.adminEmail}
                      onChangeText={(value) => onChange("adminEmail", value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!submitting}
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Contraseña del admin"
                        value={adminCreds.adminPassword}
                        onChangeText={(value) =>
                          onChange("adminPassword", value)
                        }
                        secureTextEntry={!showAdminPassword}
                        editable={!submitting}
                      />
                      <TouchableOpacity
                        onPress={() => setShowAdminPassword(!showAdminPassword)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showAdminPassword ? "eye-off" : "eye"}
                          size={20}
                          color="#6c757d"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Botón de registro */}
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.disabledButton]}
              onPress={onSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? "Procesando..." : "Crear Cuenta"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Link a Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.footerLink}>Inicia sesión aquí</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#198754",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  form: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfInput: {
    flex: 0.48,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 15,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  adminSection: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#495057",
  },
  submitButton: {
    backgroundColor: "#0d6efd",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#6c757d",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#6c757d",
    fontSize: 16,
  },
  footerLink: {
    color: "#0d6efd",
    fontSize: 16,
    fontWeight: "600",
  },
});
