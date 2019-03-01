import { Pessoa } from "../../pessoa/models/pessoa";

export class ContaCorrente { 
    id: number;
    bancoId: number;
    agenciaId: number;
    empresaId: number;
    grupoEmpresaId: number;
    tipoContaId: number;    
    codigo: string;
    descricao: string;
    nomeEmpresa: string;
    cnpj: string;
    conta: string;     
    digito: string;  
    dataInicial: String;
    saldoInicial: number;  
    saldoReal: number;  
    saldoConciliado: number;  
    saldoConciliadoEmissao: number;  
    dataUltimaConciliacao: String;
    sangria: string;
    caixaPrincipal: string;
    visualizaFluxoCaixa: string;
    excluido: string;
    contaCorrenteCobranca : ContaCorrenteCobranca[];
    contaCaixaBancoSaldo: ContaCaixaBancoSaldo[];
    codigoConvenioBanco: string;
};

export class ContaCorrenteCobranca {
    id: number; 
    codigo: string;
    sigla: string;
    descricao: string;    
    numeroConvenio: string;  
    codigoCedente: string; 
    numeroRemessa: string; 
    nossoNumero: string;
    numeroContrato: string;
    numeroCarteira: string;
    numeroVariacaoCarteira: string;
    localPagamento: string;
    aceite: string;
    contaCorrenteId: number;
    carteiraIntegracaoId: number;
    producao: string;
    instrucao: string;
    excluido: string;
    dataAlteracao: string;
    dataCadastro: string;
    dataInativacao: string;      
    usuarioAlteracao: string;
    usuarioCadastro: string;
    usuarioInativacao: string;  
    chaveSecretaWebhooks: string;
};

export interface ContaCaixaBancoSaldo {
    id: number;
    contaCorrenteId: number;      
    valorSaldoDiaReal: string;
    valorSaldoDiaConciliado: string;
    valorSaldoDiaConcEmissao: string;
    dataSaldo: string;
    excluido: string;
};

export interface Banco {
    id: number;
    nome: string;
};

export interface Agencia {
    id: number;
    nome: string;
};

export interface TipoConta {
    id: number;
    nome: string;
};