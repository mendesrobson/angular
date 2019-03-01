export class Administradoracartao {
    id: string;
    grupoEmpresaId: string;
    empresaId: string;
    codigo: string;    
    razaoSocial: string;
    nomeFantasia: string;    
    bancoId: string;
    agenciaId: string;
    contaCorrenteId: string;
    pagarReceber: string;
    diaLimite: number;
    diaVencimento: number;
    cartaoCredito: string;
    cartaoDebito: string;
    quantidadeDiasCredito: number;
    quantidadeDiasDebito: number;
    percTaxaCredito: number;
    percTaxaDebito: number;
    excluido: string;
    administradoraCartaoEndereco: AdministradoraCartaoEndereco[];
    administradoraCartaoContato: AdministradoraCartaoContato[];
  };

  export class AdministradoraCartaoEndereco { 
    id: number;
    administradoraCartaoId: number;
    cep: string;
    tipoLogradouroId: number;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    codigoMunicipio: string;
    localidadeId: number;
    ufId: number;
    paisId: number;
    enderecoPrincipal : string;
    excluido: string;
};

export class AdministradoraCartaoContato { 
    id: number;
    administradoraCartaoId: number;
    cargoId: number;
    departamentoId: number;
    tipoContatoId: number;
    nome: string;
    descricao: string;
    observacao: string;
    excluido: string;
    tipoContato: TipoContato;
};

export interface TipoContato {
  id: number;
  descricao: string;
};