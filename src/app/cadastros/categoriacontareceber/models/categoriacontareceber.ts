import { Pessoa } from "../../pessoa/models/pessoa";

export class CategoriaContaReceber {
    id: string;
    codigo: string;
    sigla: string;
    descricao: string;
    tipo: string;
    categoriaContaReceberPaiId: string;
    classificacao: string;
    considerarContratos: string;
    considerarAdicionalAnual: string;
    considerarEventosFixos: string;
    considerarEventosMensais: string;
    empresaId: string;
    grupoEmpresaId: string;
    excluido: string;
    
}

export interface TipoCategoria {
    id: string;
    valor: string;
}

export interface ClassificacaoCategoria {
    id: string;
    valor: string;
}

export interface CategoriaContaReceberPai {
    id: string;
    descricao: string;  
}