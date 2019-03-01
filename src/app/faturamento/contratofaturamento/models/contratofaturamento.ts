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
    qtdeDiaVencimento: number;
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
    cliente: Cliente;
};

export interface Cliente {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    pessoa: Pessoa;
};

export interface TipoContrato {
    id: number;
    descricao: string;
};

export interface SituacaoContrato {
    id: number;
    descricao: string;
};

export interface EventoFaturamento {
    id: number;
    empresaId: string;
    grupoEmpresaId: string;
    codigo: string;
    descricao: string;
    valorReferencia: number;
    categoriaContaReceberId: number;
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

export class Empresa {
    id : number;
    grupoEmpresaId: number;
    pessoaId: number;
    servicoId: number;
    discriminacao: string;
    tokenHomologacaoNfse: string;
    tokenProducaoNfse: string;
    rpsHomologacaoNfse: number;
    rpsProducaoNfse: string;
    numeroReferenciaNfse: string;
    codigoTributacaoMunicipio: string;
    emiteProducao: string;
    pessoa: Pessoa;
    excluido: string;
}

export interface GrupoEmpresa {
    id: number;
    pessoa: Pessoa;
};
