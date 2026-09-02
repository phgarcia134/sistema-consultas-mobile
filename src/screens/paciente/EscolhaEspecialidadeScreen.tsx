import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { listarEspecialidades } from "../../services/especialidadeService";
import { Especialidade } from "../../types/especialidade";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "EscolhaEspecialidade"
  >;
  route: RouteProp<RootStackParamList, "EscolhaEspecialidade">;
};

export default function EscolhaEspecialidadeScreen({
  navigation,
  route,
}: Props) {
  const { pacienteId, pacienteNome } = route.params;
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarEspecialidades()
      .then(setEspecialidades)
      .finally(() => setCarregando(false));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={especialidades}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.titulo}>Qual especialidade voce precisa?</Text>
        }
        ListEmptyComponent={
          carregando ? (
            <ActivityIndicator
              color="#fff"
              size="large"
              style={{ marginTop: 40 }}
            />
          ) : (
            <Text style={styles.vazio}>
              Nenhuma especialidade encontrada.
            </Text>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("EscolhaMedico", {
                pacienteId,
                pacienteNome,
                especialidadeId: item.id,
                especialidadeNome: item.nome,
              })
            }
            activeOpacity={0.8}
          >
            <Text style={styles.cardNome}>{item.nome}</Text>
            <Text style={styles.cardSeta}>-&gt;</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#79059C" },
  listContent: { padding: 20, paddingBottom: 40 },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  cardSeta: { fontSize: 18, color: "#79059C" },
  vazio: { color: "#fff", textAlign: "center", marginTop: 40, fontSize: 14 },
});
