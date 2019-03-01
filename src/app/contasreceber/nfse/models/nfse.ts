import { Pessoa } from "../../../cadastros/pessoa/models/pessoa";

export class Nfse {
    id: number;
    dataEmissao: string;
    numeroNfse: number;
    numeroRps: number;
    status: string;
    naturezaOperacao: number;
    regimeEspecialTributacao: number;
    optanteSimplesNacional: string;
    incentivadorCultural: string;
    tributacaoRps: string;
    codigoObra: string;
    art: string;
    prestadorCnpj: string;
    prestadorCodigoMunicipio: string;
    prestadorInscricaoMunicipal: string;
    tomadorCpf: string;
    tomadorCnpj: string;
    tomadorInscricaoMunicipal: string
    tomadorRazaoSocial: string;//(115 caracteres)
    tomadorTelefone: string;//(11 caracteres)
    tomadorEmail: string;//(80 caracteres)
    tomadorEnderecoLogradouro: string;//(125 caracteres)
    tomadorEnderecoTipoLogradouro: string;//(3 caracteres)
    tomadorEnderecoNumero: string;//(10 caracteres)
    tomadorEnderecoComplemento: string;//(60 caracteres)
    tomadorEnderecoBairro: string;//(60 caracteres)
    tomadorEnderecoCodigoMunicipio: string;
    tomadorEnderecoUf: string;//(2 caracteres)
    tomadorEnderecoCep: string;
    servicoValorServicos: number;
    servicoValorDeducoes: number;
    servicoValorPis: number;
    servicoValorCofins: number;
    servicoValorInss: number;
    servicoValorIr: number;
    servicoValorCsll: number;
    servicoIssRetido: string;
    servicoValorIss: number;
    servicoValorIssRetido: number;
    servicoOutrasRetencoes: number;
    servicoBaseCalculo: number;
    servicoAliquota: number;
    servicoDescontoIncondicionado: number;
    servicoDescontoCondicionado: number;
    servicoItemListaServico: string;
    servicoCodigoCnae: string;
    servicoCodigoTributarioMunicipio: string;
    servicoDiscriminacao: string;//(2000 caracteres)
    servicoCodigoMunicipio: string;
    servicoPercentualTotalTributos: number;
    servicoFonteTotalTributos: string;
    intermediarioRazaoSocial: string;//(115 caracteres)
    intermediarioCpf: string;
    intermediarioCnpj: string;
    intermediarioInscricaoMunicipal: string;
    cliente: Cliente;
}

  export interface ContaCorrente {
    id: number;
    descricao: string;
  };

  export class Justificativa {
    justificativa: string;
  }

  export class FiltroNfse {
    empresaId: string;
    grupoEmpresaId: string;
    numeroNfse: string;
    dataVencimentoInicial: string;
    dataVencimentoFinal: string;
    numeroRps: string;
    clientes: Cliente[];
  };

  export class FiltroConsultaNfse {
    empresaId: string;
    grupoEmpresaId: string;
    numeroNfse: number;
    numeroRps: number;
    dataEmissaoInicial: string;
    dataEmissaoFinal: string;
    clientes: Cliente[];
  };


  export interface Cliente {
    id: string;
    empresaId: number;
    grupoEmpresaId: number;
    pessoa: Pessoa;
};