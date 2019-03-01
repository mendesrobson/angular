import { Pessoa } from "../../pessoa/models/pessoa";


export class HistoricoPadrao {
    id: number;
    historicoPadraoPaiId: number;
    grupoEmpresaId: number;
    empresaId: number;    
    codigo: string;
    sigla: string;
    descricao: string;
    excluido: string;
    historicoPadraoCentro: HistoricoPadraoCentro[];
};


export class HistoricoPadraoCentro {
    id: number;
    historicoPadraoId: number;
    centroCustoId: number;    
    centroResultadoId: number;
    percentual: number;
    excluido: string;
    centroCusto: CentroCusto;
    centroResultado: CentroResultado;
};

export class CentroCusto {
    id: string;
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

  export class CentroResultado {
    id: string;
    grupoEmpresaId: string;
    empresaId: string;  
    centroResultadoPaiId: string;
    classificacaoCentroResultadoId: string;
    tipoCentroId: string;
    codigo: string;
    sigla: string;  
    descricao: string;
    excluido: string;
  };