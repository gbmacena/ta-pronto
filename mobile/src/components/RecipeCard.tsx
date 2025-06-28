import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

type RecipeCardProps = {
  recipe: any;
  onPress: () => void;
};

export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {recipe.title}
      </Text>
      <Text style={styles.category} numberOfLines={1} ellipsizeMode="tail">
        <Feather name="tag" size={14} color="#2563eb" />{" "}
        {recipe.category || "Sem categoria"}
      </Text>
      <Text style={styles.desc} numberOfLines={2} ellipsizeMode="tail">
        {recipe.description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
    maxWidth: "100%",
  },
  category: {
    fontSize: 13,
    color: "#2563eb",
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
  },
  desc: {
    fontSize: 15,
    color: "#444",
    maxWidth: "100%",
    overflow: "hidden",
  },
});
