export class EventoFaturamento {
    id: number;
    empresaId: string;
    grupoEmpresaId: string;
    codigo: string;
    descricao: string;
    valorReferencia: number;
    historicoPadraoId: number;
    irrf: string;
    aliquotaIRRF: number;
    iss: string;
    aliquotaISS: number;
    retencaoFonte: string;
    inssRetido: string;
    aliquotaINSSRetido: number;
    issRetido: string;
    aliquotaISSRetido: number;
    lancamentoMensal: string;
    faturarContrato: string;
    aliquotaRetencaoFonte: number;
    vencimento: string;
    diaVencimento: number;
    mesVencimento: string;
    excluido: string;
    unidade: string;
    diaVencimentoContrato: string;
    valorContrato: string;
    historicoPadrao: {};
};

export interface ParametroFaturamento {
    crf: string;
    aliquotaCRF: number;
    pis: string;
    aliquotaPIS: number;
    cofins: string;
    aliquotaCOFINS: number;
    csll: string;
    aliquotaCSLL: number;
    inss: string;
    aliquotaINSS: number;
    iss: string;
    aliquotaISS: number;
    aliquotaRetencaoFonte: number;
};

export interface HistoricoPadrao {
    id: number;
    descricao: string;
}

export interface TipoMesVencimento {
    id: string;
    valor: string;
}

export interface TipoVencimento {
    id: string;
    valor: string;
}

export interface UnidadeEvento {
    id: string;
    valor: string;  
}