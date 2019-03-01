import { Pessoa } from "../../pessoa/models/pessoa";

export class CentroCusto {
    id: number;
    grupoEmpresaId: string;
    empresaId: string;  
    centroCustoPaiId: string;
    classificacaoCentroCustoId: string;
    tipoCentroId: string;
    codigo: string;
    sigla: string;  
    descricao: string;
    excluido: string;
  };
  
  export interface CentroCustoPai {
    id: number;
    descricao: string;
    codigo: string;
  };
  
  export interface ClassificacaoCentroCusto {
    id: number;
    descricao: string;
  };
  
  export interface TipoCentro {
    id: number;
    descricao: string;
  };