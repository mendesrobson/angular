export class Cliente {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    pessoaId: number;
    pessoa: Pessoa;
    clienteSindicato: ClienteSindicato[];
};
export class ClienteSindicato {
    id: number;
    clienteId: number;
    sindicatoConvencaoId :number;
    excluido: string;
    sindicatoConvencao : SindicatoConvencao;
}

export class Sindicato{
    id: number;
    descricao: string;
}
export class SindicatoConvencao {
    id: number;
    convencaoId: number;
    sindicatoId: number;
    convencao : Convencao;
    sindicato: Sindicato;
    excluido: string;
}
export class Convencao {
    id: number;
    descricao: string;
}
export class Pessoa {
    id: number;
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
};