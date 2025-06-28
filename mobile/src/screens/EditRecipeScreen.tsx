import React, { useEffect, useState } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import RecipeForm from "../components/RecipeForm";

const categorias = ["CAFE", "ALMOCO", "JANTA", "SOBREMESA", "BEBIDA", "LANCHE"];

export default function EditRecipeScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState(categorias[0]);
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, []);

  async function fetchRecipe() {
    setLoading(true);
    try {
      const res = await api.get(`/recipes/${id}`);
      setTitle(res.data.title || "");
      setDescription(res.data.description || "");
      setInstructions(res.data.instructions || "");
      setCategory(res.data.category || categorias[0]);
      setIngredients(
        res.data.ingredients && res.data.ingredients.length > 0
          ? res.data.ingredients.map((ing: any) => ({
              name: ing.name,
              quantity: ing.quantity,
            }))
          : [{ name: "", quantity: "" }]
      );
    } catch {
      Alert.alert("Erro", "Erro ao carregar receita");
      navigation.goBack();
    }
    setLoading(false);
  }

  async function handleSave() {
    if (
      !title ||
      !category ||
      !ingredients[0].name ||
      !ingredients[0].quantity
    ) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/recipes/${id}`, {
        title,
        description,
        instructions,
        category,
        ingredients,
      });
      Alert.alert("Sucesso", "Receita atualizada com sucesso!");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert(
        "Erro",
        "Erro ao atualizar receita",
        e?.response?.data?.message || ""
      );
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <RecipeForm
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      instructions={instructions}
      setInstructions={setInstructions}
      category={category}
      setCategory={setCategory}
      ingredients={ingredients}
      setIngredients={setIngredients}
      onSubmit={handleSave}
      submitLabel="Salvar"
      loading={saving}
    />
  );
}
