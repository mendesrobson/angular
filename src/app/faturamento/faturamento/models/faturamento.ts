import { EventoFaturamento } from "../../eventofaturamento/models/eventofaturamento";
import { ContratoFaturamento } from "../../contratofaturamento/models/contratofaturamento";

export class Faturamento {
    id: string;
    codigo: string;
    sigla: string;
    descricao: string;
    competencia: string;
    dataEmissao: string;
    dataVencimento: string;
    valorDocumento: string;
    valorDesconto: string;
    valorRetencao: string;
    observacao: string;
    codigoServico: string;
    situacao: string;
    nfse: string;
    verificacaoNfse: string;
    chaveNfse: string;
    rps: string;
    observacaoTributo: string;
    tributacaoFederal: string;
    tributacaoEstadual: string;
    tributacaoMunicipal: string;
    excluido: string;
    cliente: Cliente;
}

export class FiltroLancamentoFaturamento {
    grupoEmpresaId: string;
    empresaId: string;
    dataVencimentoInicial: string;
    dataVencimentoFinal: string;
    lancamentoFixo: string;
    faturadoContrato: string;    
    optionsModelCliente: string;    
    dataEncerramento: string;
}

export interface Cliente {
    id: string;
    empresaId: number;
    grupoEmpresaId: number;
    pessoa: Pessoa;
}

export interface TipoFaturamento {
    id: string;
    valor: string;
}

export class ConfiguracaoPagamento {
    id: string;
    descricao: string;
    quantidadeParcela: string;
    periodicidade: string;
    dataPrimeiroVencimento: string;
    manterDiaVencimento: string;
    diaUtil: string;
    posterga: string;
    antecipa: string;
    ultimoDiaMes: string;
    sabadoUtil: string;
    domingoUtil: string;
    numeroDiaUtil: string;
    percentualJuros: string;
    percentualMulta: string;

}

export class Lancamento {
    selecionado: string;
    id : string;
    codigo : string;    
    valorUnitario: string;
    valorTotal: string;
    cliente: Cliente;
    eventoFaturamento: EventoFaturamento;
    contratoFaturamento: ContratoFaturamento;
}

export class LancamentoConfiguracaoPagamento {
    lancamento: any[];
    configuracaoPagamento: any[];
}

export interface Pessoa {
    id: number;
    codigo: string;
    tipoId: number;
    sexoId: number;
    tipoPessoaId: number;
    religiaoId: number;
    profissaoId: number;
    ufNascimentoId: number;
    corRacaId: number;
    localidadeId: number;
    nacionalidadeId: number;
    estadoCivilId: number;
    nome: string;
    fantasia: string;
    siglaTipoPessoa: string;
    cpf: string;
    cnpj: string;
    rg: string;
    orgEmissaoRg: string;
    dataEmissaoRg: string;
    rge: string;
    inscricaoEstadual: string;
    inscricaoMunicipal: string;
    dataNascimento: string;
    dataAbertura: string;
    dataFalecimento: string;
    dataEncerramento: string;
    dataCasamento: string;
    optanteSimplesNacional: string;
    empresaTrabalha: string;
    foto: string;
    site: string;
    tituloEleitoral: string;
    sessaoEleitoral: string;
    zonaEleitoral: string;
    dataEmissaoTitulo: string;
    nomeMae: string;
    nomePai: string;
    descricaoDeficiencia: string;
    descricaoCtps: string;
    numSerieCtps: number;
    ufCtps: string;
    dataEmissaoCtps: string;
    descricaoReservista: string;
    numRaReservista: number;
    categoriaReservista: string;
    dataEmissaoReservista: string;
    nomeSocial: string;
    grauInstrucaoId: number;
    deficiente: string;
    tipoDeficienciaId: number;
    reabilitado: string;
    pisPasep: string;
    dataCadastroPis: string;
    ric: string;
    orgaoEmissorRic: string;
    dataExpedicaoRic: string;
    dataEmissaoric: string;
    dataValidadeRic: string;
    cnh: string;
    categoriaCnh: string;
    orgaoEmissorCnh: string;
    dataEmissaoCnh: string;
    validadeCnh: string;
    ufCnhId: number;
    dataPrimeiraValidacaoCnh: string;
    dataChegadaBrasil: string;
    rne: string;
    orgaoEmissorRne: string;
    dataExpedicaoRne: string;
    casadoComBrasileiro: string;
    filhosComBrasileiro: string;
    naturalizado: string;
    tipoVisto: string;
    dataValidadeVisto: string;
    dataNaturalizacao: string;
    excluido: string;
};


