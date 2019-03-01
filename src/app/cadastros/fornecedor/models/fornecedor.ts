export class Fornecedor {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    pessoaId: number;
    pessoa: Pessoa;
};

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
    empresaId: number;
    grupoEmpresaId: number;
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

export class FornecedorModel {
    empresaId: number;
    grupoEmpresaId: number;
}
