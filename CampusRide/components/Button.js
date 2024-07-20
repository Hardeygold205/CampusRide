import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native-paper";

const Button = ({ title, isLoading, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#228d5d",
    color: "#fff",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 2,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
    color: "#fff",
  },
});
