import api from "./api";
import { Medico } from "../interfaces/medico";

export async function listarMedicos(): Promise<Medico[]> {
    const response = await api.get<Medico[]>("/medicos");
    return response.data;
}

export async function buscarMedicoPorId(id: number): Promise<Medico> {
    const response = await api.get<Medico>(`/medicos/${id}`);
    return response.data;
}
