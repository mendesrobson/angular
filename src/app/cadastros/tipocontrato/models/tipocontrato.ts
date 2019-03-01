export class TipoContrato {
    id : string;
    codigo: string;
    sigla: string;
    descricao: string;
    excluido : string;
    proporcionalDataInicio: string;
    indexadorSigla: string;
    mesBaseSigla: string;
    periodicidadeSigla: string;
    tipoReajusteSigla: string;
    grupoEmpresaId: string;
    empresaId: string;
    indiceId: string
}


export interface Indice {
    id: string;
    descricao: string;
}

export interface Mes {
    id: string;
    valor: string;
}

export interface Periodicidade {
    id: string;
    valor: string;
}

export interface TipoReajuste {
    id: string;
    valor: string;
}

export interface Indexador {
    id: string;
    valor: string;
}