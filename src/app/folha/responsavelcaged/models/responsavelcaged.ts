export class ResponsavelCaged{
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    tipoPessoaId: number;
    codigo: string;
    sigla: string;
    cnpj: string;
    cpf:string;
    nome:string;
    cep:string;
    tipoLogradouroId: number;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    tipoEnderecoId: number;
    localidadeId: number;
    codigoMunicipioIbge: number;
    ufId: number;
    paisId: number;
    telefone: string;
    ramal: string;
    numeroAutorizacao: string;
    email: string;
    excluido: string;
};

export interface TipoPessoa{
    id: number;
    descricao: string;
};

export interface TipoLogradouro{
    id: number;
    descricao: string;
};

export interface TipoEndereco{
    id: number;
    descricao: string;
};

export interface Localidade{
    id: number;
    descricao: string;
};

export interface Uf{
    id: number;
    descricao: string;
};

export interface Pais{
    id: number;
    descricao: string;
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