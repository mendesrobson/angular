import { Pessoa } from "../../pessoa/models/pessoa";

export class ConfiguracaoPagamento {             
    id: number;
    empresaId: number;
    grupoEmpresaId: number;
    codigo: string;
    sigla: string;
    descricao: string;
    quantidadeParcela: number;
    periodicidade: number;
    dataPrimeiroVencimento: string;
    manterDiaVencimento: string;
    diaUtil: string;
    posterga: string;
    antecipa: string;
    ultimoDiaMes: string;
    sabadoUtil: string;
    domingoUtil: string;
    numeroDiaUtil: number;
    percentualJuros: number;
    percentualMulta: number;
    excluido: string;
  };
