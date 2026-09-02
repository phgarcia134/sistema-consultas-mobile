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
import { listarMedicosPorEspecialidade } from "../../services/medicoService";
import { Medico } from "../../interfaces/medico";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "EscolhaMedico">;
  route: RouteProp<RootStackParamList, "EscolhaMedico">;
};

export default function EscolhaMedicoScreen({ navigation, route }: Props) {
  const { pacienteId, pacienteNome, especialidadeId, especialidadeNome } =
    route.params;
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Filtra apenas medicos ativos E com valor de consulta definido
    listarMedicosPorEspecialidade(especialidadeId)
      .then((lista) =>
        setMedicos(lista.filter((m) => m.ativo && m.valorConsulta != null))
      )
      .finally(() => setCarregando(false));
  }, [especialidadeId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={medicos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.titulo}>
            Medicos de {especialidadeNome}
          </Text>
        }
        ListEmptyComponent={
          carregando ? (
            <ActivityIndicator
              color="#fff"
              size="large"
              style={{ marginTop: 40 }}
            />
          ) : (
            <View style={styles.vazio}>
              <Text style={styles.vazioTexto}>
                Nenhum medico disponivel para esta especialidade no momento.
              </Text>
            </View>
          )
        }
        renderItem={({ item: medico }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("AgendarConsulta", {
                pacienteId,
                pacienteNome,
                medicoId: medico.id,
                medicoNome: medico.nome,
                medicoValor: medico.valorConsulta,
              })
            }
            activeOpacity={0.8}
          >
            <View style={styles.cardTextos}>
              <Text style={styles.cardNome}>{medico.nome}</Text>
              <Text style={styles.cardCrm}>CRM: {medico.crm}</Text>
              {medico.valorConsulta != null && (
                <Text style={styles.cardValor}>
                  R$ {medico.valorConsulta.toFixed(2).replace(".", ",")}
                </Text>
              )}
            </View>
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
  },
  cardTextos: { flex: 1 },
  cardNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardCrm: { fontSize: 13, color: "#888", marginTop: 2 },
  cardValor: { fontSize: 14, color: "#27ae60", fontWeight: "600", marginTop: 4 },
  cardSeta: { fontSize: 18, color: "#79059C", marginLeft: 8 },
  vazio: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
  },
  vazioTexto: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
