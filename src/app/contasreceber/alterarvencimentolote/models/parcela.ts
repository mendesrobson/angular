import { Pessoa } from "../../../cadastros/pessoa/models/pessoa";

export class Parcela {
    antecipa: string;
    apropriacaoCentro: string;
    boletoId: string;
    clienteId: number;
    contaCorrenteId: number;
    dataAlteracao: string;
    dataCadastro: string;
    dataCancelamento: string;
    dataEmissao: string;
    dataInativacao: string;
    dataPrevisao: string;
    dataPrimeiroVencimento: string;
    dataQuitacao: string;
    dataVencimento: string;
    diaUtil: string;
    documento: string;
    domingoUtil: string;
    empresa: string;
    empresaId: number;
    excluido: string;
    fornecedor: string;
    fornecedorId: number;
    grupoEmpresaId: number;
    guid: number;
    historicoPadraoId: number;
    id: number;
    manterDiaVencimento: string
    natureza: string;
    naturezaId: number;
    numero: number;
    numeroDiaUtil: number;
    parcelaDesconto: string;
    percentualJuros: number;
    percentualMulta: number;
    periocidade: number;
    posterga: string;
    quantidadeParcela: number;
    sabadoUtil: string;
    situacao: string;
    situacaoId: number;
    tipoDocumentoId: number;
    tituloId: number;
    ultimoDiaMes: string;
    usuarioAlteracaoId: string;
    usuarioCadastroId: string;
    usuarioInativacaoId: string;
    valorBruto: number;
    valorDesconto: number;
    valorLiquido: number;
    _Boleto: string;
    _Cliente: string;
    _ContaCorrente: string;
    _Situacao: string;

}

export interface GrupoEmpresa {

}

export interface Empresa {

}

export interface Cliente {
    id: string;
    empresaId: number;
    grupoEmpresaId: number;
    pessoa: Pessoa;
}

export interface Fornecedor {
    id: string;
    empresaId: number;
    grupoEmpresaId: number;
    pessoa: Pessoa;
}

export class FiltroParcelasAVencer {

}