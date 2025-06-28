import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { Feather } from "@expo/vector-icons";
import api from "../services/api";
import RecipeCard from "../components/RecipeCard";

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const [myRecipes, setMyRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) fetchMyRecipes();
    }, [user?.id])
  );

  async function fetchMyRecipes() {
    setLoading(true);
    try {
      const res = await api.get(`/recipes/by-user/${user.id}`);
      setMyRecipes(res.data);
    } catch {
      setMyRecipes([]);
    }
    setLoading(false);
  }

  function handleEditProfile() {
    navigation.navigate("EditarPerfil");
  }

  function handleEditRecipe(recipeId: string) {
    navigation.navigate("EditarReceita", { id: recipeId });
  }

  async function handleDeleteRecipe(recipeId: string) {
    Alert.alert(
      "Remover Receita",
      "Tem certeza que deseja remover esta receita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/recipes/${recipeId}`);
              fetchMyRecipes();
            } catch {
              Alert.alert("Erro", "Erro ao remover receita");
            }
          },
        },
      ]
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Feather name="user" size={48} color="#2563eb" />
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
        <Feather name="edit" size={20} color="#fff" />
        <Text style={styles.editText}>Editar Perfil</Text>
      </TouchableOpacity>

      <Text style={styles.section}>Minhas Receitas</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={{ marginTop: 20 }}
        />
      ) : myRecipes.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Feather name="frown" size={40} color="#2563eb" />
          <Text style={{ color: "#888", marginTop: 10 }}>
            Você ainda não criou receitas.
          </Text>
        </View>
      ) : (
        <FlatList
          data={myRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 10,
                position: "relative",
                width: "100%",
              }}
            >
              <RecipeCard
                recipe={item}
                onPress={() =>
                  navigation.navigate("DetalheReceita", { id: item.id })
                }
              />
              <View
                style={{
                  flexDirection: "row",
                  position: "absolute",
                  right: 18,
                  top: 18,
                  zIndex: 2,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditarReceita", { id: item.id })
                  }
                  style={{ marginRight: 12, padding: 4 }}
                >
                  <Feather name="edit" size={18} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteRecipe(item.id)}
                  style={{ padding: 4 }}
                >
                  <Feather name="trash-2" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    padding: 24,
  },
  avatar: {
    backgroundColor: "#e0e7ff",
    borderRadius: 50,
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    marginTop: 24,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: "#444",
    marginBottom: 32,
  },
  editBtn: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  editText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  section: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
    alignSelf: "flex-start",
    marginBottom: 16,
    marginTop: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    color: "#888",
    fontSize: 16,
  },
});
