export class InstituicaoEnsino {
    id: number;
    grupoEmpresaId: number;
    empresaId: number;
    tipoLogradouroId: number;
    ufId : number;
    paisId: number;
    localidadeId: number;
    tipoEnderecoId: number;
    codigo: string;
    sigla: string;
    nomeReitor: string;
    nome: string;
    cnpj: string;
    logradouro: string;
    numero: string;
    complemento: string;
    cep: string;
    bairro: string;
    codigoMunicipioIbge: number;
    telefone: string;
    ramal: string;
    email: string;
    excluido: string;
}

export interface TipoLogradouro {
    id: number;
    descricao: string;
}

export interface Uf {
    id: number;
    descricao: string;
}

export interface Pais {
    id: number;
    descricao: string;
}

export interface Localidade {
    id: number;
    descricao: string;
}