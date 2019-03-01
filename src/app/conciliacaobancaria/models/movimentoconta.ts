export class MovimentoConta {
    id: number;
    codigo: string;
    contaCorrenteId: string;
    documento: string;
    dataEmissao: string;
    dataCompensacao: string;
    valor: number;
    siglaDebitoCredito: string;
    siglaTipoOperacao: string;
    descricaoFornecedor: string
    flagCreditoNaoIdentificado: string;
    descricaoHistoricoPadrao: string;
    excluido: string;
    empresaId: number;
    grupoEmpresaId: number;
};

export interface ContaCorrente {
   id: number;
   descricao: string;
};

export interface TipoOperacao {
    id: string;
    valor: string;
};