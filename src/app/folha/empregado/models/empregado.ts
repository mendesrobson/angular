import { Pessoa } from "../../../cadastros/pessoa/models/pessoa";

export class Empregado {
    id: string;    
    grupoEmpresaId: number;
    empresaId: number;
    pessoaId: number;
    numeroRegistro: string;
    cotaDeficiencia: string;
    primeiroEmprego: string;
    qualificado: string;
    aposentado: string;
    recebeBeneficioPrevidencia: string;
    dataAposentadoria: string;
    bancoId: number;
    agenciaNumero: string;
    agenciaDigito: string;
    contaCorrenteNumero: string;
    contaCorrenteDigito: string;
    pessoa: Pessoa;
    banco: Banco;
    estagio: Estagio[];
    itinerario: Itinerario[];
	empregadoOrgaoClasse: EmpregadoOrgaoClasse[];
    dataAdmissao: Date | number | string;
    dataExameMedico: Date | number | string;
    valeTransporte: string;
    recebeSalarioHabitacao: string;
    recebeSeguroDesemprego: string;
    recebeAdiantamento: string;
    percentual: number;
    empregadoDependente: EmpregadoDependente[];
    empregadoLotacao: EmpregadoLotacao[];
    sindicalizado:string;
    descontaMensalidadeSindical:string;
    pagouContribuicaoSindical:string;
}

export class EmpregadoPessoaContato { 
    id: number;
    pessoaId: number;
    cargoId: number;
    departamentoId: number;
    tipoContatoId: number;
    nome: string;
    descricaoTel: string;
    descricaoCel: string;
    descricaoMail: string;
    observacao: string;
    excluido: string;
};

export interface Banco{
    id: number;
    descricao: string;
}

export class Estagio{
    id: number;
    empregadoId: number;
    natureza: string;
    nivel: string;
    areaAtuacao: string;
    coordenadorEstagioId: number;
    agenteIntegradorId: number;
    instituicaoEnsinoId: number;
    numeroApolice: string;
    dataInicio: Date | number | string;
    dataTermino: Date | number | string;
    excluido: string; 
    agenteIntegrador: AgenteIntegrador;
    coordenadorDeEstagio: CoordenadorDeEstagio;
    instituicaoEnsino: InstituicaoEnsino;
    empregado: Empregado;
}

export interface AgenteIntegrador{
    id: number;
    descricao: string;}

export interface CoordenadorDeEstagio{
    id: number;
    nome: string;}

export interface InstituicaoEnsino{
    id: number;
    nome: string;}

export interface Nivel{
    id: number;
    descricao: string;
}
export class Itinerario{
    id: number;
    grupoEmpresaId: number;
    empresaId: number;
    empregadoId: number;
    codigo: string;
    sigla: string;
    descricao: string;
    origem: string;
    destino: string;
    tipo: string;
    valorTransporteId: number;
    dataInicio: string;
    dataTermino: string;
    valorTransporte: ValorTransporte;
}
export interface ValorTransporte {
    id: number;
    descricao: string;
    tipoTransporte: string;
}
export interface TipoTransporte {
    id: string;
    descricao: string;
};

export class EmpregadoDependente{
    id: number;
    empregadoId: number;
    nomeDependente: string;
    parentescoId: number;
    dataNascimento: Date | number | string;
    invalido: string;
    dependenteIrrf: string;
    dependenteSalarioFamilia: string;
    nacionalidadeId: number;
    ufNascimentoId: number;
    localidadeId: number;
    certidaoNascimento: string;
    livro: string;
    folha: string;
    dataEntrega: Date | number | string;
    cartorio: string;
    cpf: string;
    excluido: string; 
    parentesco: Parentesco;
}

export interface Parentesco{
    id: number;
    descricao: string;
}

export interface Nacionalidade{
    id: string;
    descricao: string;
}

export interface Uf{
    id: string;
    descricao: string;
}

export interface Localidade{
    id: string;
    descricao: string;
}

export class EmpregadoOrgaoClasse{
    id: number;
    empregadoId : number;
    numeroInscricao: string;
    orgaoEmissor: string;
    ufId: number;
    dataExpedicao: string;
    dataValidade: string;
	uf: Uf;
}

export class EmpregadoLotacao{
    id: number;
    empregadoId: number;
    cargoId: number;
    departamentoId: number;
    tipoSalario: string;
    valorRemuneracao: number;
    dataInicio: Date | number | string;
    dataFim: Date | number | string;
    excluido: string; 
    cargo: Cargo;
    departamento: Departamento;
    tiposSalarios: TiposSalarios;
}

export interface Cargo{
    id: number;
    descricao: string;
}

export interface Departamento{
    id: number;
    descricao: string;
}

export interface TiposSalarios{
    id: string;
    descricao: string;
}