import { create } from "zustand";
import api from "../services/api";

export type Recipe = {
  id: string;
  title: string;
  description: string;
  category?: string;
  [key: string]: any;
};

type RecipesStore = {
  recipes: Recipe[];
  loading: boolean;
  fetchRecipes: (userId?: string) => Promise<void>;
  updateRecipe: (recipe: Recipe) => void;
  setRecipes: (recipes: Recipe[]) => void;
};

export const useRecipesStore = create<RecipesStore>((set, get) => ({
  recipes: [],
  loading: false,
  async fetchRecipes(userId?: string) {
    set({ loading: true });
    try {
      const res = await api.get("/recipes", { params: { userId } });
      set({ recipes: res.data });
    } catch {
      set({ recipes: [] });
    }
    set({ loading: false });
  },
  updateRecipe(recipe: Recipe) {
    set({
      recipes: get().recipes.map((r: Recipe) =>
        r.id === recipe.id ? recipe : r
      ),
    });
  },
  setRecipes(recipes: Recipe[]) {
    set({ recipes });
  },
}));
