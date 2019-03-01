import { Pessoa } from "../../pessoa/models/pessoa";

export class Desconto {             
  id: number;
  empresaId: number;
  grupoEmpresaId: number;
  grupoDescontoId: number;
  tipoDescontoId: number;
  codigo: string;
  sigla: string;
  descricao: string;
  ordemCalculo: number;
  quantidadeDiasAposVencimento: number;
  percentualValor: string;
  valorAplicar: string;
  progressivoFatorTempo: string;
  progressivoDias: number;
  progressivoDiaUtil: string;
  progressivoMesAnterior: string;
  exigeLiberacao: string;
  perdeAposVencimento: string;
  cumulativo: string;
  consideraCalculoDescCumulativo: string;
  excluido: string;
};

export interface GrupoDesconto {
  id: number;
  descricao: string;
};

export interface TipoDesconto {
  id: number;
  descricao: string;
};

export interface Tarefa {
  id: number;
  descricao: string;
};

