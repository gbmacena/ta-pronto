import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChangeText,
  placeholder,
}: Props) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Buscar..."}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#222",
    backgroundColor: "transparent",
  },
});
