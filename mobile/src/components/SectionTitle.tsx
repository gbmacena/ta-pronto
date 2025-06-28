import React from "react";
import { Text, StyleSheet } from "react-native";

export default function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.section}>{children}</Text>;
}

const styles = StyleSheet.create({
  section: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
    alignSelf: "flex-start",
    marginBottom: 16,
    marginTop: 8,
  },
});
