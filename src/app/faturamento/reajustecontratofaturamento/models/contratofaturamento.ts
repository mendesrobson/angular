import { Pessoa } from "../../../cadastros/pessoa/models/pessoa";

export class ContratoFaturamento{
    id: number;
    descricao: string;
    situacaoContratoId: number;      
    clienteId: number;
    tipoContratoId: number;
    codigo: string;
    sigla: string;
    empresaId: number;
    grupoEmpresaId: number;
    eventoFaturamentoId: number;
    dataEmissao: string;
    mesAnoInicio: string;
    diaVencimento: number;
    mesInicioFaturamento: string;
    mesVencimento: string;
    definirDataTermino: string;
    dataTermino: string;
    valorContrato: number;
    valorOriginal: number;
    descontoAdimplencia: string;
    percentual: number;
    cobrarAdicionalAnual: string;
    percentualValorContrato: string;
    percentualCobrado: number;
    valorFixo: string;
    valor: number;
    proporcionalDataInicio: string;
    valorUltimoFaturamento: string;
    faturarComContrato: string;
    iniciaEm: string;
    copiaContrato: string;
    arquivoCopiaContrato: String;
    documentoVinculado: string;
    arquivoDocumentoVinculado: String;
    adicionalFuncionarios: string;
    numeroContratado: number;
    valorAdicionalEmpregado: number;
    excluido: string;
    ultimoReajuste: string;
};

export interface Cliente {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    pessoa: Pessoa;
};

export class FiltroContratosReajuste {
//
}


export class ReajusteValores {
    //
}
// export interface GrupoEmpresa {

// }

// export interface Empresa {

// }