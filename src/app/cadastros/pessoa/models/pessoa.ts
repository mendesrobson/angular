import { ClienteSindicato } from "../../cliente/models/cliente";

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
    endereco: Endereco[];
    pessoaContato: PessoaContato[];
    pessoaCnae: PessoaCnae[];
    empresaContaCorrente: EmpresaContaCorrente[];
    pessoaRegimeTributario: PessoaRegimeTributario[];
    //fornecedorContaCorrente:FornecedorContaCorrente[];
    excluido: string;
};

export class Fornecedor {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    pessoaId: number;
    pessoa: Pessoa;
    fornecedorContaCorrente: FornecedorContaCorrente[];
};

// export class FornecedorContaCorrente {
//     id: number;
//     fornecedorId: number;
//     bancoId: number;
//     agenciaNumero: string;
//     agenciaDigito: string;
//     contaCorrenteNumero: string;
//     contaCorrenteDigito: string;
//     excluido: string;
//     banco: Banco;
// };

export class FornecedorContaCorrente {
    id: number;
    fornecedorId: number;
    contaCorrenteId: number;
    excluido: string;
    contaCorrente: ContaCorrente;
};

export class Banco {
    id: number;
    descricao: string;
};
export class Cliente {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    pessoaId: number;
    pessoa: Pessoa;
    clienteSindicato: ClienteSindicato[];
    clienteContaCorrente: ClienteContaCorrente[];
};

export class Cnpj {
    nome: string;
    cnpj: string;
    fantasia: string;
    inscricaoEstadual: string;
    inscricaoMunicipal: string;
    abertura: string;
    logradouro: string;
    numero: string;
    complemento: string;
    cep: string;
    bairro: string;
    // tipoLogradouroId: number;
    // ufId: number;
    // localidadeId: number;   
    telefone: string;
    email: string;
};

export class PessoaCnae {
    id: number;
    pessoaId: number;
    codigo: string;
    descricao: string;
    dataInicio: string;
    dataFim: string;
    atividadePrincipal: string;
    atividadeSecundaria: string;
}

export class Cnae {
    id: number;
    descricao: string;
}

export class RegimeTributario {
    id: number;
    codigo: string;
    sigla: string;
    descricao: string;    
};

export class PessoaRegimeTributario {
    id: number;
    regimeTributarioId: number;
    pessoaId: number
    dataInicio: string;
    dataFim: string;
    motivo: string;   
    regimeTributario: RegimeTributario; 
};

export class Endereco { 
    id: number;
    pessoaId: number;
    cep: string;
    tipoLogradouroId: number;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    codigoMunicipio: string;
    localidadeId: number;
    ufId: number;
    paisId: number;
    enderecoPrincipal: string;
    enderecoCobranca: string;
    enderecoEntragaDocumento: string;
    enderecoFaturamento: string;
    excluido: string;
    tipoLogradouro: TipoLogradouro;
    localidade: Localidade;
    uf: Uf;
};

export class PessoaContato { 
    id: number;
    pessoaId: number;
    cargoId: number;
    departamentoId: number;
    tipoContatoId: number;
    nome: string;
    descricao: string;
    observacao: string;
    excluido: string;
    tipoContato: TipoContato;
};

// export class PessoaContaCorrente { 
//     id: number;
//     pessoaId: number;
//     contaCorrenteId: number;
//     descricao: string;
//     contaPrincipal: string;
//     excluido: string;   
//     contaCorrente: IContaCorrente;
// };

export class EmpresaContaCorrente{
    id: number;
    pessoaId: number;
    contaCorrenteId: number;
    descricao: string;
    contaPrincipal: string;
    excluido: string;   
    contaCorrente: IContaCorrente;
}

export interface TipoContato {
    id: number;
    descricao: string;
};

export interface TipoPessoa {
    id: string;
    valor: string;
};

export interface Sexo {
    id: string;
    valor: string;
};

export interface Localidade {
    id: string;
    descricao: string;
};

export interface Uf {
    id: string;
    descricao: string;
};

export interface EstadoCivil {
    id: string;
    descricao: string;
};

export interface Profissao {
    id: string;
    descricao: string;
};

export interface Religiao {
    id: string;
    descricao: string;
};

export interface Cor {
    id: string;
    descricao: string;
};

export interface TipoLogradouro {
    id: number;
    descricao: string;
};

export interface Pais {
    id: number;
    descricao: string;
};

export interface Cargo {
    id: number;
    descricao: string;
};

export interface Departamento {
    id: number;
    descricao: string;
};

export interface IContaCorrente {
    id: number;
    descricao: string;
};

export interface Cep {
    cidade: string;
    logradouro: string;
    tipoLogradouro: string;
    logradouroNormalizado: string;
    tipoLogradouroNormalizado: string;
    bairro: string;
    bairroNormalizado: string;
    cidadeNormalizada: string;
    uf: string;
    cep: string;
};
export class Servico {
    id: number;
    descricao: string;
}

export class ContaCorrente{
    id: number;
    bancoId: number;
    digitoAgencia: string;
    numeroAgencia: string;
    conta: string;
    digito: string;
    excluido: string;
    banco: Banco;
}

export class ClienteContaCorrente {
    id: number;
    clienteId: number;
    contaCorrenteId: number;
    excluido: string;
    contaCorrente: ContaCorrente;
};