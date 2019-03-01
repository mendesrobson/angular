import { Pessoa } from "../../pessoa/models/pessoa";

export class CategoriaContaPagar { 
    id: number;
    codigo: string;
    descricao: string;
    tipo: string;
    excluido: string;
    empresaId: string;
    grupoEmpresaId: string;
    categoriaContaPagarPaiId: string;
    categoriaContaPagarPai: {
        id: number;
        descricao: string;
    };
}


export interface TipoCategoria {
    sigla: string,
    descricao: string;
}