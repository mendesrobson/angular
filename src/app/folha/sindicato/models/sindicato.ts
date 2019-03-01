import { Cargo } from './sindicato';
export class SindicatoConvencao {
    id: number;
    sindicatoId: number;
    convencaoId: number;
    dataHomologacao: string;
    dataInicio: string;
    dataTermino: string;
    observacao: string;
    excluido: string;
    sindicato: Sindicato;
    convencao: Convencao;
}

export class BaseTerritorialSindicato {
    id: number;
    sindicatoId: number;
    localidadeId: number;
    baseTerritorialSindicatoId : number;
    ufId: number;
    localidade: Localidade;
    uf: Uf;
}

export class SindicatoCargo{
    id: number;
    sindicatoId: number;
    cargoId: number;
    excluido: string;   
    sindicato: Sindicato; 
    cargo: Cargo;
};

export class Sindicato{
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    codigo: string;
    sigla: string;
    descricao: string;
    cnpj: string;
    cep: string;
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
    email: string;
    site: string;
    tipoEntidade: string;
    codigoEntidade: string;
    nomeDocumentoProfissional: string;
    tipoSindicato: string;
    taxaHomologacao: number;
    excluido: string;
    sindicatoCargo: SindicatoCargo[];
    sindicatoConvencao : SindicatoConvencao[];
    diretoriaSindical : DiretoriaSindical[];
    baseTerritorialSindicato : BaseTerritorialSindicato[];
    sindicato: Sindicato[];
}

export interface Localidade{
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

export interface Uf{
    id: number;
    descricao: string;
};

export interface Pais{
    id: number;
    descricao: string;
};

export interface TipoEntidade{
    id: string;
    descricao: string;
};

export interface TipoSindicato{
    id: string;
    descricao: string;
};

export interface Cargo{
    id: number;
    descricao: string;
};

export class Convencao {
    id: number;
    descricao: string;
}

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
export class DiretoriaSindical{
    id: number;
    sindicatoId: number;
    cargoId: number;
    codigo: string;
    sigla: string;
    nome: string;
    telefone: string;
    celular: string;
    email: string;
    mandatoInicio: string;
    mandatoFim: string;
    excluido: string;
    cargo: Cargo;
};