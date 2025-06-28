import React from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PrimaryButton from "./PrimaryButton";

const categorias = ["CAFE", "ALMOCO", "JANTA", "SOBREMESA", "BEBIDA", "LANCHE"];

type Ingredient = {
  name: string;
  quantity: string;
};

interface Props {
  title: string;
  description: string;
  instructions: string;
  category: string;
  ingredients: Ingredient[];
  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setInstructions: (v: string) => void;
  setCategory: (v: string) => void;
  setIngredients: (v: Ingredient[]) => void;
  onSubmit: () => void;
  submitLabel: string;
  loading?: boolean;
}

export default function RecipeForm({
  title,
  description,
  instructions,
  category,
  ingredients,
  setTitle,
  setDescription,
  setInstructions,
  setCategory,
  setIngredients,
  onSubmit,
  submitLabel,
  loading = false,
}: Props) {
  function handleIngredientChange(
    idx: number,
    field: "name" | "quantity",
    value: string
  ) {
    const newIngredients = [...ingredients];
    newIngredients[idx][field] = value;
    setIngredients(newIngredients);
  }

  function addIngredient() {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  }

  function removeIngredient(idx: number) {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== idx));
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Título*</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Título da receita"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição"
        />

        <Text style={styles.label}>Categoria*</Text>
        <View style={styles.categoryRow}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                category === cat && styles.categoryBtnActive,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryBtnText,
                  category === cat && styles.categoryBtnTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Ingredientes*</Text>
        {ingredients.map((ing, idx) => (
          <View key={idx} style={styles.ingredientRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              value={ing.name}
              onChangeText={(v) => handleIngredientChange(idx, "name", v)}
              placeholder="Nome"
            />
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              value={ing.quantity}
              onChangeText={(v) => handleIngredientChange(idx, "quantity", v)}
              placeholder="Quantidade"
            />
            <TouchableOpacity onPress={() => removeIngredient(idx)}>
              <Text style={{ color: "#ef4444", fontSize: 18 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addIngredient} style={styles.addBtn}>
          <Text style={{ color: "#2563eb", fontWeight: "bold" }}>
            + Ingrediente
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Modo de Preparo</Text>
        <TextInput
          style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Descreva o modo de preparo"
          multiline
        />

        <PrimaryButton onPress={onSubmit} loading={loading}>
          {submitLabel}
        </PrimaryButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },
  label: { fontWeight: "bold", marginTop: 16, marginBottom: 6, fontSize: 15 },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
  },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  categoryBtn: {
    backgroundColor: "#e0e7ff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryBtnActive: { backgroundColor: "#2563eb" },
  categoryBtnText: { color: "#2563eb", fontWeight: "bold" },
  categoryBtnTextActive: { color: "#fff" },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addBtn: { marginBottom: 12 },
});
