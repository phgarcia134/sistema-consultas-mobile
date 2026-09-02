import React, { useState } from "react";
import {
   View,
   Text,
   StyleSheet,
   TextInput,
   TouchableOpacity,
   ActivityIndicator,
   KeyboardAvoidingView,
   Platform,
   ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { buscarMedicoPorCrm } from "../../services/medicoService";

type Props = {
   navigation: NativeStackNavigationProp<RootStackParamList, "LoginMedico">;
};

export default function LoginMedicoScreen({ navigation }: Props) {
   const [crm, setCrm] = useState("");
   const [carregando, setCarregando] = useState(false);
   const [erro, setErro] = useState("");

   async function handleEntrar() {
      const crmLimpo = crm.trim().toUpperCase();
      if (!crmLimpo) {
         setErro("Digite seu CRM.");
         return;
      }
      try {
         setCarregando(true);
         setErro("");
         const medico = await buscarMedicoPorCrm(crmLimpo);
         if (medico.valorConsulta == null) {
            navigation.navigate("PerfilMedico", {
               medicoId: medico.id,
               medicoNome: medico.nome,
            });
         } else {
            navigation.navigate("ConsultasMedico", {
               medicoId: medico.id,
               medicoNome: medico.nome,
            });
         }
      } catch {
         setErro("CRM nao encontrado. Verifique e tente novamente.");
      } finally {
         setCarregando(false);
      }
   }

   return (
      <KeyboardAvoidingView
         style={styles.container}
         behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
         <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
         >
            <Text style={styles.titulo}>Acesso Medico</Text>
            <Text style={styles.subtitulo}>
               Digite seu CRM para acessar suas consultas
            </Text>

            <View style={styles.formulario}>
               <Text style={styles.label}>CRM</Text>
               <TextInput
                  style={styles.input}
                  placeholder="Digite seu CRM"
                  keyboardType="numeric"
                  value={crm}
                  onChangeText={(text) => {
                     setCrm(text);
                     setErro("");
                  }}
               />

               {erro !== "" && <Text style={styles.erroTexto}>{erro}</Text>}

               <TouchableOpacity
                  style={[styles.botao, carregando && styles.botaoDesabilitado]}
                  onPress={handleEntrar}
                  disabled={carregando}
               >
                  {carregando ? (
                     <ActivityIndicator color="#fff" />
                  ) : (
                     <Text style={styles.botaoTexto}>Entrar</Text>
                  )}
               </TouchableOpacity>

               <View style={styles.separador}>
                  <View style={styles.linha} />
                  <Text style={styles.separadorTexto}>ou</Text>
                  <View style={styles.linha} />
               </View>

               <TouchableOpacity
                  style={styles.botaoSecundario}
                  onPress={() => navigation.navigate("CadastroMedico")}
               >
                  <Text style={styles.botaoSecundarioTexto}>
                     Nao tenho cadastro - Criar conta
                  </Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </KeyboardAvoidingView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#79059C" },
   content: { flexGrow: 1, justifyContent: "center", padding: 24 },
   titulo: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#fff",
      textAlign: "center",
      marginBottom: 8,
   },
   subtitulo: {
      fontSize: 14,
      color: "rgba(255,255,255,0.8)",
      textAlign: "center",
      marginBottom: 32,
   },
   formulario: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 24,
   },
   label: { fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 6 },
   input: {
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      padding: 12,
      fontSize: 15,
      marginBottom: 8,
      color: "#333",
   },
   erroTexto: {
      color: "#c0392b",
      fontSize: 13,
      marginBottom: 12,
      textAlign: "center",
   },
   botao: {
      backgroundColor: "#79059C",
      borderRadius: 10,
      padding: 15,
      alignItems: "center",
      marginTop: 12,
      marginBottom: 20,
   },
   botaoDesabilitado: { opacity: 0.6 },
   botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
   separador: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
   },
   linha: { flex: 1, height: 1, backgroundColor: "#ddd" },
   separadorTexto: { marginHorizontal: 12, color: "#aaa", fontSize: 13 },
   botaoSecundario: {
      borderWidth: 1,
      borderColor: "#79059C",
      borderRadius: 10,
      padding: 15,
      alignItems: "center",
   },
   botaoSecundarioTexto: {
      color: "#79059C",
      fontWeight: "600",
      fontSize: 15,
   },
});
