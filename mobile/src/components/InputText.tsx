import React from "react";
import { TextInput, StyleSheet, Text, View } from "react-native";

type Props = React.ComponentProps<typeof TextInput> & {
  label?: string;
  error?: string;
};

export default function InputText({ label, error, style, ...rest }: Props) {
  return (
    <View style={{ marginBottom: 14, width: "100%" }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#888"
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 15,
    color: "#2563eb",
  },
  input: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  error: { color: "#ef4444", fontSize: 13, marginTop: 4 },
});
