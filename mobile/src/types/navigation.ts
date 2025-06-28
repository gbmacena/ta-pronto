import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Receitas: undefined;
  Favoritos: undefined;
  "Criar Receita": undefined;
  Main: undefined;
  DetalheReceita: { id: string };
  EditarPerfil: undefined;
  EditarReceita: { id: string };
};

export type StackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
