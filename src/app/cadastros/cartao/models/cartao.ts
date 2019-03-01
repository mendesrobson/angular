import { Pessoa } from "../../pessoa/models/pessoa";

export class Cartao{             
  id: number;
  empresaId: number;
  grupoEmpresaId: number;
  cartaoBandeiraId: number;
  numero: string;
  dataEmissao: string;
  dataValidade: string;
  dataFechamentoFatura: string;
  diaVencimentoFatura: string; 
  limiteCartao: number;
  excluido: string;

};



export interface CartaoBandeira {
  id: number;
  descricao: string;
};
