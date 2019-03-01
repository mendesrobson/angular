export  interface  ContaCorrenteCobranca  {
  id:  number;
  descricao:  string;
};

export class FiltroRemessa {
  empresaId: string;
  grupoEmpresaId: string;
  contaCorrenteCobrancaId: string;
  dataProcessamentoInicial: string;
  dataProcessamentoFinal: string;
};

export class Remessa {
  id: string;
  remessaIntegracaoId: string;
  nomeArquivo: string;
  status: string;
  carteiraIntegracaoId: string;
  dataRemessa: string;
  dataProcessamento: string;
  url: string;
  numeroRemessa: string;
  dataEnvioBanco: string;
  boletoId: string;
}