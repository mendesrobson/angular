import { ConfiguracaoPagamento } from "../../../faturamento/faturamento/models/faturamento";
import { ContaCorrente } from "../../../cadastros/contacorrente/models/contacorrente";
import { Parcela, Titulo } from "../../titulo/models/titulo";
import { Cliente } from "../../../cadastros/cliente/models/cliente";

export class Renegociacao {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    clienteId: number;
    fornecedorId: number;
    configuracaoPagamentoId: number;
    contaCorrenteId: number;
    descontoId: number;
    naturezaId: number;
    tituloId: number;
    codigo: string;
    descricao: string;
    observacao: string;
    tipoCobrancaId: number;
    valorParcelasEmAtraso: number;
    valorJuros: number;
    valorMulta: number;
    valorTotalDevido: number;
    valorAbono: number;
    valorRenegociacao: number;
    valorDescontoPerdido: number;
    valorDesconto: number;
    valorCorrecao: number;
    valorDescontoParcela: number;
    valorAcrescimo: number;
    dataRenegociacao: string;
    cliente: Cliente;
    renegociacaoParcela: RenegociacaoParcela[];
    configuracaoPagamento: ConfiguracaoPagamento;
    quantidadeParcela: number;
    periodicidade: number;
    dataPrimeiroVencimento: string;
    manterDiaVencimento: string;
    diaUtil: string;
    posterga: string;
    antecipa: string;
    ultimoDiaMes: string;
    sabadoUtil: string;
    domingoUtil: string;
    numeroDiaUtil: number;
    percentualJuros: number;
    percentualMulta: number;
    contaCorrente: ContaCorrente;
    desconto: Desconto;
    tipoCobranca: TipoCobranca;
    titulo: Titulo;
}

export class RenegociacaoParcela {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    renegociacaoId: number;
    parcelaId: number;
    valorParcela: number;
    valorJuros: number;
    valorMulta: number;
    valorDevido: number;
    valorDescontoPerdido: number;
    valorDesconto: number;
    valorCorrecao: number;
    valorDescontoProgressivo: number;
    percentualDescontoProgressivo: number;
    dataLimiteDescontoProgressivo: string;
    parcela: Parcela;
}

export class FiltroRenegociacao {
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

export class TipoCobranca {
    id: number;
    descricao: string;
};

export class Desconto {
    id: number;
    descricao: string;
    percentualDesconto: string;
    percentualValor: string;
    valorAplicar: number;
}