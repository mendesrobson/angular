import { Pessoa } from "../../pessoa/models/pessoa";

export class Agencia {
    id: string;
    grupoEmpresaId: string;
    empresaId: string;
    bancoId: string;
    codigo: string;
    sigla: string;
    descricao: string;
    digito: string;
    tipoLogradouroId: String;
    logradouro: string;
    numero: string;
    complemento: string;
    cep: string;
    bairro: string;
    localidadeId: string;
    ufId: string;
    paisId: string;
    gerente: string;
    excluido: string;
  };

export interface Banco {
    id: number;
    descricao: string;
};

export interface TipoLogradouro {
    id: number;
    descricao: string;
};

export interface Uf {
    id: number;
    descricao: string;
};

export interface Pais {
    id: number;
    descricao: string;
};

export interface Localidade {
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
