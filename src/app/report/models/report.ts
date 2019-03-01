export class Report {
   grupoEmpresaId: string;
   empresaId: string;
   clienteId: string;
   statusId: string;
}

export class Status {
    id: string;
    valor: string;
}

export class Cliente {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    pessoaId: number;
    pessoa: Pessoa;
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

export class ContaCorrente { 
    id: number;
    descricao:string;
};

export class Evento {
    id: number;
    descricao: string;
};

export class ParametroFaturamento{
    id: number;
    bloqueioAcesso: string;
    fechamentoMes: string;
    emiteAvisosBoletosVencidos: string;
    emiteAvisosReajustes: string;
    quantidadeParcelasEmAberto: number;
    logoEmpresa: string;
    gerarComFaturasVencidas: string;
    calcularDescontosAdimplentes: string;
    considerarDescontoPara: string;
    quantidadeMesesDesconto: number;
    percentual: number;
    faturarInativos: string;
    faturarClientesConstituicao: string;
    calcularJuros: string;
    percentualJuros: number;
    calcularMulta: string;
    percentualMulta: number;
    dataVencimentoDefault: string;
    calcularJurosRenegociacao: string;
    percentualJurosRenegociacao: number;
    calcularMultaRenegociacao: string;
    percentualMultaRenegociacao: number;
    valorMinimoIRRF: number;
    fatoGeradorIRRF: string;
    valorMinimoINSSRetido: number;
    valorMinimoISSRetido: number;
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
    valorMinimoCalculo: number;
    fatoGeradorCRFPISCOFINS: string;
    deduzirIRRFCRFValorReceber: string;
    notaFiscal: string;
    serieRPS: string;
    servicoId: number;
    gerarValorAproxImpostosIBPT: string;
    aliquotaRetencaoFonte: number;
    aliquotaIBPTAte2014: number;
    aliquotaIBPTAPartir2015: number;
    aliquotaIBPTMunicipal: number;
    descricao: string;
    empresaId: number;
    grupoEmpresaId: number;
    configuracaoPagamentoId: number; 
    contaCorrenteId: number; 
    valorMinimoCRF: number;
    excluido: string;
};

export class ImpostoFaturamentoModel {
        empresaId: number;
        grupoEmpresaId : number;
        tipoImposto: number;
        dataVencimento? : string;
      //  mes: string;
        tipoGuia:number;
        multa?: number;
        juros?: number;
        codRecolhimento?: Array<string>;;
        clienteId?:Array<number>;

    constructor(){
        this.clienteId = new Array<number>();
        this.codRecolhimento = new Array<string>();
    }
}