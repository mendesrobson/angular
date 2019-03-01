export class EquipProtecaoIndividual {
    id: number;
    grupoEmpresaId: number;
    empresaId: number;
    codigo: string;
    sigla: string;
    descricao: string;
    certificadoAprovacao: string;
    especificacao: string;
    excluido: string;
}


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
export class Pessoa {
    id: number;
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
    codigo: string;
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