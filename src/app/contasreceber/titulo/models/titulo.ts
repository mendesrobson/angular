import { CobrancaContato } from "../../cobranca/models/cobranca";

export class Titulo {
    id: number;
    grupoEmpresaId: string;
    empresaId: string;
    clienteId: string;
    fornecedorId: string;
    tipoDocumentoId: string;
    naturezaId: number;
    contaCorrenteId: string;
    faturamentoId: string;
    origemId: string;
    configuracaoPagamentoId: string;
    historicoPadraoId: string;
    documento: string;
    valorBruto: number;
    valorDesconto: number;
    valorRetencoes: number;
    valorLiquido: number;
    dataPrimeiroVencimento: string;
    dataEmissao: string;
    manterDiaVencimento: string;
    diaUtil: string;
    posterga: string;
    antecipa: string;
    ultimoDiaMes: string;
    quantidadeParcela: number;
    periodicidade: number;
    sabadoUtil: string;
    domingoUtil: string;
    percentualJuros: number;
    percentualMulta: number;
    numeroDiaUtil: number;
    descricao: string;
    anexo: string;
    arquivoAnexo: string;
    observacao: string;
    excluido: string;
    tituloDesconto: TituloDesconto[];
    tituloCentro: TituloCentro[];
    parcela: Parcela[];  
    cliente: Cliente;
    fornecedor: Fornecedor;     
};

export class Cliente {
    id: number;    
    empresaId: number;
    grupoEmpresaId: number;
    pessoa: Pessoa;
};

export class Fornecedor {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    pessoa: Pessoa;
    constructor(){
        this.pessoa = new Pessoa();
    }
};

export class TipoDocumento {
    id: number;
    descricao: string;
};

export class Natureza {
    id: number;
    descricao: string;
};

export class ContaCorrente {
    id: number;
    descricao: string;
};

export class Origem {
    id: number;
    descricao: string;
};

export class HistoricoPadrao {
    id: number;
    descricao: string;
};

export class ConfiguracaoPagamento {
    id: number;
    descricao: string;
    quantidadeParcela: number;
    diaUtil: string;
    manterDiaVencimento: string;
    posterga: string;
    antecipa: string;
    ultimoDiaMes: string;
    periodicidade: number;
    sabadoUtil: string;
    domingoUtil: string;
    percentualJuros: number;
    percentualMulta: number;
    numeroDiaUtil: number;
    dataPrimeiroVencimento: string;
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

export class TituloCentro {
    id: number;
    tituloId: number;
    centroCustoId: number;
    centroResultadoId: number;
    percentual: number;
    excluido: string;
    centroResultado : CentroResultado;
    centroCusto: CentroCusto;
}

export class TituloDesconto {
    id: number;
    tituloId: number;
    descontoId: number;
    valorDesconto: number;
    desconto: Desconto;
    //percentualValor: string;
    //descricao: string;
}

export class Desconto {
    id: number;
    descricao: string;
    percentualDesconto: string;
    percentualValor: string;
}

export class TituloParcela {
    id: number;
    tituloId: number;
    parcelaId: number;
}

export class Parcela {
    id: number;
    empresaId: number;
    tituloId: number;
    numero: number;
    selecionado: string;
    documento: string;
    dataVencimento: string;
    dataPrevisao: string;    
    contaCorrenteId: number;
    valorBruto: number;
    valorPago: number;
    valorDesconto: number;
    valorLiquido: number;
    valorLiquidado: number;
    percentualJuros: number;
    percentualMulta: number; 
    sabadoUtil: string;
    domingoUtil: string;
    descricaoContaCorrente: string;
    quantidadeParcela: number;
    situacaoId: number;
    parcelaDesconto: ParcelaDesconto[];
    apropriacaoCentro: ApropriacaoCentro[];
    contaCorrente: ContaCorrente;
    situacao: string;   
    flagPagamentoRemessa: string;
    codigoBarra: string;
    nossoNumero: string;
    quantidadeMoeda: string;
    codigoMoeda: string;
    cobrancaContato: CobrancaContato[];
    boletoId: number;
    _Boleto: Boleto;
}

export class ParcelaDesconto{
    id: number;
    parcelaId: number;
    descontoId: number;
    valorDesconto: number;
    percentualDesconto: number;
    dataLimiteDesconto: string;
    dataPrevisaoDesconto: string;
    desconto: Desconto;
    parcela: Parcela;
}

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

}

export class Pessoa {
    id: number;
    codigo:string;
    nome: string;    
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

export class Boleto {
    id: number;
    status: string;    
};

export class Faturamento{
    id: number;
    valorTotalIRRF: number;        
    valorTotalPIS: number;
    valorTotalCOFINS: number;
    valorTotalCSLL: number;
    valorTotalCRF: number;
    valorTotalISS: number;
};

export class FornecedorModel{
    empresaId:number;
    grupoEmpresaId: number;
}
