import { ContaCorrente, Boleto, ApropriacaoCentro, ParcelaDesconto, Parcela } from "../../titulo/models/titulo";
import { ChequeFolha } from "../../../cadastros/chequeproprio/models/chequeproprio";
import { CobrancaContato } from "../../cobranca/models/cobranca";

export class BaixaPagarReceber {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    contaCorrenteId: number;
    clienteId: number;
    fornecedorId: number;
    codigo: string;    
    data: string;
    valor: number;
    flagPagarReceber: string;
    observacao: string;    
    excluido: string;
    parcelasPagasBaixa: ParcelasPagasBaixa[];
    baixaPagarReceberPgto: BaixaPagarReceberPgto[];
};

export class ParcelasPagasBaixa {
    id: number;
    parcelaId: number;
    baixaPagarReceberId: number;
    percentualJuros: number;
    valorJuros: number;
    percentualMulta: number;
    valorMulta: number;
    percentualDesconto: number;
    valorDesconto: number;
    valorPago: number;
    valorParcela: number;
    empresaId: number;
    grupoEmpresaId: number;
    excluido: String;
    parcela: Parcela;
};

export class BaixaPagarReceberPgto{
    id: number;
    baixaPagarReceberId: number;
    siglaTipoPagamento: string;
    tipoPagamento: string;
    valor: number;
    historicoPadraoId: number;
    movimentoContaId: number;
    empresaId: number;
    grupoEmpresaId: number;    
    excluido: string;
    contaCorrenteId: number;
    cartaoId: number;
    chequeFolhaId: number;
    contaCorrente: ContaCorrente; // limpar
    historicoPadrao: HistoricoPadrao; // limpar
    chequeFolha: ChequeFolha;  
    controleCartao: ControleCartao; 
} 

export class ControleCartao{             
    id: number;
    empresaId: number;
    baixaPagarReceberPgtoId: number;
    administradoraCartaoId: number;
    codigo: string;
    siglaDebitoCredito: string;
    dataLancamento: string;
    valorVenda: number;
    percTaxaAdministrativa: number; 
    valorReceber: number;
    qtdeDiasRepasse: number;
    codigoAprovacao: string;
    qtdeParcelas: number;
    flagParceladoPeloAdmin: string;
    flagPagarReceber: string;
    observacao: string;
    excluido: string;
  };


export class FiltroBaixa {
    empresaId: number;
    grupoEmpresaId: number;
    dataEmissaoInicial: string;
    dataEmissaoFinal: string;
    clienteId: number;
    fornecedorId: number;
    vencer: string;
    vencido: string;
    naturezaId: number;
};

export interface TipoPagamento {
    id: string;
    sigla: string;
    descricao: string;
};

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
    historicoPadraoId: string;
    excluido: string;
    movimentoContaCentro: MovimentoContaCentro[];
    descricaoHistoricoPadrao: string;
    movimentoContaPaiId: string;
    dataCompensacao: string; 
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

/*export interface ContaCorrente {
    id : number;
    descricao : string;

};*/

/*export interface TipoOperacao {
    id: string;
    valor: string;
};*/

export class LoteMovimentoCaixa {
    
}

export class DadosSangriaCaixa {
    valorDinheiro : string;
    valorCheque : string;
    valorCartao : string;        
    movimentoConta : MovimentoConta[];
    contaCorrenteUsuarioId: string;
    contaCorrenteDestinoId: string;
}
