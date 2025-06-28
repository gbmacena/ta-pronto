import React, { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import RecipeForm from "../components/RecipeForm";

const categorias = ["CAFE", "ALMOCO", "JANTA", "SOBREMESA", "BEBIDA", "LANCHE"];

export default function CreateRecipeScreen({ navigation }: any) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState(categorias[0]);
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (
      !title ||
      !category ||
      !ingredients[0].name ||
      !ingredients[0].quantity
    ) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }
    setLoading(true);
    try {
      await api.post("/recipes", {
        title,
        description,
        instructions,
        category,
        createdById: user.id,
        ingredients,
      });
      setTitle("");
      setDescription("");
      setInstructions("");
      setCategory(categorias[0]);
      setIngredients([{ name: "", quantity: "" }]);
      Alert.alert("Sucesso", "Receita criada com sucesso!");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert(
        "Erro",
        "Erro ao criar receita",
        e?.response?.data?.message || ""
      );
    }
    setLoading(false);
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
      onSubmit={handleCreate}
      submitLabel="Criar Receita"
      loading={loading}
    />
  );
}
