export class Testemunha {
  id: string;
  codigo: string;
  nome: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  excluido: string;
  empresaId: string;
  grupoEmpresaId: string;
  ufId: string;
}


export interface Uf {
  id: string;
  descricao: string;
}

