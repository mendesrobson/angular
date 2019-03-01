import { Parcela } from "../../titulo/models/titulo";

export class CobrancaContato {
    id: number;
    empresaId: number;
    grupoEmpresaId: number;    
    parcelaId: number;
    tipoAtendimentoId: number;
    cobrancaAcaoId: number;
    codigo: string;
    dataContato: string;
    dataProximoContato: string;
    dataRealizacao: string;
    comentario: string;
    excluido: string;
    parcela: Parcela;
    tipoAtendimento: TipoAtendimento;
}

export class FiltroParcela {
    empresaId: number;
    grupoEmpresaId: number;
    clienteId: number;
    fornecedorId: number;
    dataReferencia: string;
};

export class TipoAtendimento {
    id: number;
    descricao: string;
};

export class CobrancaAcao {
    id: number;
    descricao: string;
};