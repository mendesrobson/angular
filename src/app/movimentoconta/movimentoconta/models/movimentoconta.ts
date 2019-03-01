export class MovimentoConta {
    id: number;
    codigo: string;
    grupoEmpresaId: string;
    empresaId: string;
    contaCorrenteId: string;
    documento: string;
    dataEmissao: string;
    valor: number;
    siglaDebitoCredito: string;
    siglaTipoOperacao: string;
    descricaoFornecedor: string
    flagCreditoNaoIdentificado: string;
    historicoPadraoId: string;
    excluido: string;
    movimentoContaCentro: MovimentoContaCentro[];
    descricaoHistoricoPadrao: string;
    movimentoContaPaiId: string;
    baixaPagarReceberPgtoId: string;
    controleCartaoBaixaId: string;
    controleChequeBaixaId: string;
    apropriacaoCentro: ApropriacaoCentro[];
    
};

export interface ContaCorrente {
    id: number;
    tipoContaId: number;
    empresaId: number;
    descricao: string;
};

export interface HistoricoPadrao {
    id: number;
    descricao: string;
    
};

export class MovimentoContaCentro {
    id: number;
    movimentoContaId: number;
    centroCustoId: number;
    centroResultadoId: number;
    percentual: number;
    excluido: string;
    centroResultado : CentroResultado;
    centroCusto: CentroCusto;
};

export interface CentroCusto {
    id: number;
    codigo: string;
    descricao: string;
    percentual: number;
};

export interface CentroResultado {
    id: number;
    codigo: string;
    descricao: string;
    percentual: number;
};

export class HistoricoPadraoCentro {
    id: number;
    historicoPadraoId: number;
    centroCustoId: number;
    centroResultadoId: number;
    percentual: number;
    centroCusto: CentroCusto[];
    centroResultado: CentroResultado[];
};

export interface TipoOperacao {
    id: string;
    valor: string;
};

export class ApropriacaoCentro{
    id: number;
    parcelaId: number;
    percentual: number;
    valor: number;
    dataApropriacao: string;
    valorRecebido: number;
    tituloId: number;
    CentroResultado : CentroResultado[];
    CentroCusto: CentroCusto[];
};