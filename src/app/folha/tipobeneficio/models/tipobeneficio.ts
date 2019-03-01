export class TipoBeneficio {
    id: string;
    empresaId: number;
    grupoEmpresaId: number;
    codigo: string;
    sigla: string;
    descricao: string;
    tipo: string;
    diasTrabalhados: string;
    descontaDiasFerias: string;
    descontaDiasAfastamento: string;
    aliquotaDesconto: string;
    valor: string;
    excluido: string;
}

export interface Tipo {
    id: string;
    valor: string;  
}