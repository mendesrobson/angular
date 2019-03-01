import { Pessoa } from "../../../cadastros/pessoa/models/pessoa";

  export interface ContaCorrenteCobranca {
    id: number;
    descricao: string;
  };

  export class FiltroBoleto {
    empresaId: string;
    grupoEmpresaId: string;
    contaCorrenteCobrancaId: string;
    dataVencimentoInicial: string;
    dataVencimentoFinal: string;
   // clientes: {};
  };

  export class Parcela {
    id : number;
  }

  export class Boleto {
    
  }

  export interface Cliente {
    id: string;
    empresaId: number;
    grupoEmpresaId: number;
    pessoa: Pessoa;
}