import { Pessoa } from "../../../cadastros/cliente/models/cliente";

export class Lancamento {
    id: string;
    fixo: string = 'N';
    codigo: string;
    descricao: string;
    faturarContrato: string = 'N';
    dataLancamento: string;
    dataVencimento: string;
    dataEncerramento: string;
    quantidade: string;
    percentual: number;
    valorUnitario: number;
    valorTotal: number;
    geradoPeloContrato: string = 'N';
    excluido: string;
    grupoEmpresaId: string;
    empresaId: string;
    clienteId: string;
    eventoFaturamentoId: string;
    contratoFaturamentoId: string;
    faturamentoId: string;
    lancamentoPaiId: string;
    diaVencimento: string;
    qtdeDiaVencimento: string;
    aliquotaIRRF: number;
    aliquotaPIS: number;
    aliquotaCOFINS: number;
    aliquotaCSLL: number;
    aliquotaCRF: number;
    aliquotaISS: number;
    cliente: Cliente;
}

export interface Cliente {
    id: string;
    empresaId: number;
    grupoEmpresaId: number;
    pessoaId: number;
    pessoa: Pessoa;
}

export interface Evento {
    id: string;
    descricao: string;
    aliquotaIRRF: number;
    aliquotaISS: number;
    aliquotaPIS: number;
    aliquotaCOFINS: number;
    aliquotaCSLL: number; 
    faturarContrato: string;
    valorReferencia: number;
    diaVencimento: number;
    unidade: string; 
    diaVencimentoContrato: string;  
    qtdeDiaVencimento: number;
    valorContrato: string;
}

export interface Contrato {
    id: string;
    descricao: string;
    diaVencimento: number;    
    qtdeDiaVencimento: number;    
    valorContrato: number;
}

export interface Faturamento {
    id: string;
    descricao: string;
}

export interface ParametroFaturamento {
    aliquotaCRF: number;
    aliquotaPIS: number;
    aliquotaCOFINS: number;
    aliquotaCSLL: number;
    aliquotaINSS: number;
    aliquotaISS: number;
    aliquotaRetencaoFonte: number;
};

