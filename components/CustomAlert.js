import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

export default function CustomAlert({
  show,
  message,
  variant = "info",
  onClose,
}) {
  if (!show) return null;

  const backgroundColors = {
    success: "#d1e7dd",
    danger: "#f8d7da",
    warning: "#fff3cd",
    info: "#cff4fc",
  };

  const textColors = {
    success: "#0f5132",
    danger: "#842029",
    warning: "#664d03",
    info: "#055160",
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColors[variant] || backgroundColors.info },
      ]}
    >
      <Text
        style={[
          styles.message,
          { color: textColors[variant] || textColors.info },
        ]}
      >
        {message}
      </Text>
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text
            style={[
              styles.closeText,
              { color: textColors[variant] || textColors.info },
            ]}
          >
            X
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
    elevation: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  closeButton: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  closeText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
