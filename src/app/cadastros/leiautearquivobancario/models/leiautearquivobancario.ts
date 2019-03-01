export class LeiauteArquivoBancario {
    id: number;
    grupoEmpresaId: number;
    empresaId: number;
    bancoId: number;
    codigo: string;
    descricao: string;
    nomeArquivo: string;
    tipoArquivo: string;
    excluido: string;
    regLeiauteArquivoBancario: RegLeiauteArquivoBancario[];

}

export interface Banco {
    id: number;
    descricao: string;
}

export class RegLeiauteArquivoBancario {
    id: number;
    leiauteArquivoBancarioId: number;
    codigo: string;
    descricao: string;
    iteRegLeiauteArquivoBancario: IteRegLeiauteArquivoBancario[];
}

export class IteRegLeiauteArquivoBancario {
    id: number;
    regLeiauteArquivoBancarioId: number;
    leiauteArquivoBancarioId: number;
    campo: string;
    tipo: string;
    valor: string;
    posicaoInicial: string;
    posicaoFinal: string;
    origemValor: string;
    flagCampoRetorno: string;

}

export class Campos {
    name : string;
    type : string;
}