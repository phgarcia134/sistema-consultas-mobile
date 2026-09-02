import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { listarConsultasPorPaciente } from "../../services/consultaService";
import { Consulta } from "../../interfaces/consulta";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MinhasConsultas">;
  route: RouteProp<RootStackParamList, "MinhasConsultas">;
};

// Cores de fundo dos badges de status
const STATUS_FUNDO: Record<string, string> = {
  agendada: "#e3f2fd",
  confirmada: "#d4edda",
  realizada: "#e8f5e9",
  cancelada: "#f8d7da",
};

// Cores do texto dos badges de status
const STATUS_COR: Record<string, string> = {
  agendada: "#1565c0",
  confirmada: "#155724",
  realizada: "#1b5e20",
  cancelada: "#721c24",
};

// Texto amigavel para cada status
const STATUS_LABEL: Record<string, string> = {
  agendada: "AGUARDANDO CONFIRMACAO",
  confirmada: "CONFIRMADA",
  realizada: "REALIZADA",
  cancelada: "CANCELADA",
};

function formatarDataHora(dataHora: string): string {
  const data = new Date(dataHora);
  const dia = data.toLocaleDateString("pt-BR");
  const hora = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dia} as ${hora}`;
}

export default function MinhasConsultasScreen({ navigation, route }: Props) {
  const { pacienteId, pacienteNome } = route.params;
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  // useFocusEffect recarrega os dados cada vez que a tela fica visivel.
  // Isso garante que, ao voltar da tela de agendamento, a lista esta atualizada.
  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [pacienteId])
  );

  async function carregarConsultas(pullRefresh = false) {
    if (pullRefresh) setAtualizando(true);
    else setCarregando(true);

    try {
      const lista = await listarConsultasPorPaciente(pacienteId);
      setConsultas(lista);
    } catch {
      // falha silenciosa no pull-to-refresh
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  const primeiroNome = pacienteNome.split(" ")[0];

  return (
    <View style={styles.container}>
      <FlatList
        data={consultas}
        keyExtractor={(item) => String(item.id)}
        onRefresh={() => carregarConsultas(true)}
        refreshing={atualizando}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <View>
              <Text style={styles.titulo}>Ola, {primeiroNome}!</Text>
              <Text style={styles.subtitulo}>
                {consultas.length === 0 && !carregando
                  ? "Nenhuma consulta encontrada"
                  : `${consultas.length} consulta(s)`}
              </Text>
            </View>
            <View style={styles.cabecalhoAcoes}>
              <TouchableOpacity
                style={styles.botaoAgendar}
                onPress={() =>
                  navigation.navigate("EscolhaEspecialidade", {
                    pacienteId,
                    pacienteNome,
                  })
                }
              >
                <Text style={styles.botaoAgendarTexto}>+ Agendar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoSair}
                onPress={() =>
                  navigation.reset({ index: 0, routes: [{ name: "Home" }] })
                }
              >
                <Text style={styles.botaoSairTexto}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
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
                Voce ainda nao tem consultas.{"\n"}
                Toque em "+ Agendar" para marcar a sua primeira consulta!
              </Text>
            </View>
          )
        }
        renderItem={({ item: consulta }) => (
          <View style={styles.card}>
            {/* Badge de status */}
            <View
              style={[
                styles.badge,
                { backgroundColor: STATUS_FUNDO[consulta.status] ?? "#f0f0f0" },
              ]}
            >
              <Text
                style={[
                  styles.badgeTexto,
                  { color: STATUS_COR[consulta.status] ?? "#333" },
                ]}
              >
                {STATUS_LABEL[consulta.status] ?? consulta.status.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.cardMedico}>{consulta.medico?.nome}</Text>
            <Text style={styles.cardInfo}>
              {consulta.medico?.especialidade?.nome}
            </Text>
            <Text style={styles.cardInfo}>
              {formatarDataHora(consulta.dataHora)}
            </Text>
            <Text style={styles.cardInfo}>
              {Number(consulta.valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
            {consulta.observacoes && (
              <Text style={styles.cardObs}>{consulta.observacoes}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#79059C" },
  listContent: { padding: 20, paddingBottom: 40 },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  subtitulo: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  botaoAgendar: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  botaoAgendarTexto: { color: "#79059C", fontWeight: "bold", fontSize: 14 },
  cabecalhoAcoes: { flexDirection: "row", gap: 8, alignItems: "center" },
  botaoSair: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  botaoSairTexto: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardMedico: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardInfo: { fontSize: 14, color: "#666", marginBottom: 2 },
  cardObs: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
    marginTop: 4,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeTexto: { fontSize: 11, fontWeight: "bold" },
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
    lineHeight: 22,
  },
});
