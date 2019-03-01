export class AgenteIntegrador {
    id: string;
    grupoEmpresaId: number;
    empresaId: number;
    tipoLogradouroId: number;
    ufId: number;
    paisId: number;
    localidadeId: number;
    codigo: string;
    sigla: string;
    descricao: string;
    nome: string;
    cnpj: string;
    logradouro: string;
    numero: string;
    complemento: string;
    cep: string;
    bairro: string;    
    codigoMunicipioIbge: string; 
    telefone: string; 
    excluido: string;
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

export interface Localidade{
    id: number;
    descricao: string;
};