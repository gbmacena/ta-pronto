import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import api from "../services/api";
import type { StackScreenProps } from "../types/navigation";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function RecipeDetailScreen({
  route,
}: StackScreenProps<"DetalheReceita">) {
  const { id } = route.params;
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    fetchRecipe();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipe();
    }, [userId])
  );

  async function fetchRecipe() {
    setLoading(true);
    try {
      const res = await api.get(`/recipes/${id}`, { params: { userId } });
      setRecipe(res.data);
    } catch (e) {
      setRecipe(null);
    }
    setLoading(false);
  }

  async function handleToggleFavorite(recipeId: string, userLiked: boolean) {
    if (!userId) {
      alert("Usuário não identificado.");
      return;
    }
    try {
      if (userLiked) {
        await api.delete(`/recipes/${recipeId}/favorite`, { data: { userId } });
      } else {
        await api.post(`/recipes/${recipeId}/favorite`, { userId });
      }
      fetchRecipe();
    } catch (e) {
      console.error("Erro ao atualizar favorito:", e);
      alert("Erro ao atualizar favorito. Tente novamente.");
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#888" }}>Receita não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.recipeCategory}>
        <Feather name="tag" size={14} color="#2563eb" />{" "}
        {recipe.category || "Sem categoria"}
      </Text>
      <Text style={styles.section}>Descrição</Text>
      <Text style={styles.text}>{recipe.description}</Text>
      <Text style={styles.section}>Ingredientes</Text>

      {recipe.ingredients && recipe.ingredients.length > 0 ? (
        recipe.ingredients.map((ing: any, idx: number) => (
          <Text key={idx} style={styles.text}>
            - {ing.name} ({ing.quantity})
          </Text>
        ))
      ) : (
        <Text style={styles.text}>Sem ingredientes cadastrados.</Text>
      )}
      <Text style={styles.section}>Modo de Preparo</Text>
      <Text style={styles.text}>
        {recipe.instructions
          ? recipe.instructions
          : "Sem modo de preparo cadastrado."}
      </Text>
      <TouchableOpacity
        onPress={() => handleToggleFavorite(recipe.id, recipe.userLiked)}
        style={{ position: "absolute", top: 20, right: 20, zIndex: 2 }}
      >
        {recipe.userLiked ? (
          <FontAwesome name="heart" size={28} color="#ef4444" />
        ) : (
          <Feather name="heart" size={28} color="#ef4444" />
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 8,
  },
  category: { fontSize: 16, color: "#2563eb", marginBottom: 16 },
  section: { fontSize: 17, fontWeight: "bold", marginTop: 18, marginBottom: 6 },
  text: { fontSize: 15, color: "#444", marginBottom: 4 },
  recipeCategory: {
    fontSize: 13,
    color: "#2563eb",
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
});
