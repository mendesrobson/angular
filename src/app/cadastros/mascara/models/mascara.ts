import { Pessoa } from "../../pessoa/models/pessoa";

export class Mascara {
    id: string;
    grupoEmpresaId: string;
    empresaId: string;
    tarefaId: string;
    codigo: string;
    sigla: string;
    descricao: string;
    prefixo: string;
    sufixo: string;
    separadorNiveis: string;
    quantidadeNiveis: number;
    siglaAdicionaGrava: string;
    sequencial: string;
    mascaraFormatada: string;
    mascaraExpression: (string | RegExp)[];
    excluido: string;
    tarefa: Tarefa;
    mascaraNivel: MascaraNivel[];
};

export interface Tarefa {
    id: number;
    descricao: string;
};

export interface MascaraNivel {
    id: number;
    mascaraId: number;
    quantidadeNivel: number;
    sequencia: number;
};

export interface SeparadorNivel {
    id: string;
    valor: string;
};

export interface GravaOrAdiciona {
    id: string;
    valor: string;
}