export class Convencao {
    id: string;
    grupoEmpresaId: number;
    empresaId: number;
    codigo: string;
    sigla: string;
    descricao: string;
    tipoConvencao: string;
    observacao: string;
    excluido: string;
}
export interface TipoConvencao {
    id: string;
    descricao: string;
};