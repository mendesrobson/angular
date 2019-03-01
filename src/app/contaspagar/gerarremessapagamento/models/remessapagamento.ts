import { LeiauteArquivoBancario } from "../../../cadastros/leiautearquivobancario/models/leiautearquivobancario";

export class FiltroRemessaPagamento {
    empresaId: string;
    grupoEmpresaId: string;
    contaCorrenteId : string;
    dataVencimentoInicial: string;
    dataVencimentoFinal: string;
};

export interface ContaCorrente {
    id: string;
    descricao: string;
};

export interface Fornecedor {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    pessoa: Pessoa;
};

export class Pessoa {
    id: number;
    nome: string;    
};

export class VwCamposLeiauteArqBancario {
    dataPagamento : string;
    
}

export class LeiauteArquivoBancarioParcelas {
    leiauteArquivoBancario : LeiauteArquivoBancario;
    parcelas: VwCamposLeiauteArqBancario[];
}

export class ArquivoRemessa {
    
}