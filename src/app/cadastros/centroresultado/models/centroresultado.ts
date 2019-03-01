import { Pessoa } from "../../pessoa/models/pessoa";

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

export interface CentroResultadoPai {
  id: number;
  descricao: string;
  codigo: string;
};

export interface ClassificacaoCentroResultado {
  id: number;
  descricao: string;
};

export interface TipoCentro {
  id: number;
  descricao: string;
};