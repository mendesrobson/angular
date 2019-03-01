import { Pessoa } from "../../pessoa/models/pessoa";

export class ChequeTalao {
  id: number;
  empresaId: number;
  grupoEmpresaId: number;
  contaCorrenteId: number;
  numFolhaInicial: number;
  numFolhaFinal: number;
  excluido: string;
  contaCorrente: ContaCorrente;
  chequeFolha: ChequeFolha[];
};

export class ChequeFolha {
  id: number;
  chequeTalaoId: number;
  empresaId: number;
  grupoEmpresaId: number;
  banco: string;
  agencia: string;
  conta: string;
  numFolhaInicial: string;
  numCheque: string;
  bancoId: number;
  baixaPagarReceberPgtoId: number;
  clienteId: number;
  emitente: string;
  dataDeposito: string;
  flagPendente: string;
  valor: number;
  situacao: string;
  flagPagarReceber: string;
  excluido: string;
  chequeFolhaHistorico: ChequeFolhaHistorico[];
};

export class ChequeFolhaHistorico {
  id: number;
  chequeFolhaId: number;
  dataEmissao: string;
  situacaoChequeId: number;
  observacao: string;
  excluido: string;
  situacaoCheque: SituacaoCheque;  
};

export interface SituacaoCheque {
  id: number;
  sigla: string;
  descricao: string;
};

export class ContaCorrente {
  id: number;
  bancoId: number;
  agenciaId: number;
  empresaId: number;
  grupoEmpresaId: number;
  codigo: string;
  descricao: string;
  nomeEmpresa: string;
  cnpj: string;
  conta: string;
  digito: string;
  excluido: string;
  banco: Banco;
  agencia: Agencia;
};

export interface Banco {
  id: number;
  descricao: string;
};

export interface Agencia {
  id: number;
  descricao: string;
};