import { Pessoa } from "../../pessoa/models/pessoa";

export class Observacao {
    id: string;
    codigo: string;
    descricao: string;
    observacaoComplementar: string;
    empresaId: string;
    grupoEmpresaId: string;
    excluido: string;
}