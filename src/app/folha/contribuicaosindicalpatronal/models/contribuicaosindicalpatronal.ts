export class ContribuicaoSindicalPatronal {
    id: string;
    grupoEmpresaId: number;
    empresaId: number;
    codigo: string;
    sigla: string;
    descricao: string;
    sindicatoId: string;
    atividadeEnsino: string; 
    utilizarReceitaBruta: string;
    excluido: string;
    contrSindPatNumeroAluno: ContrSindPatNumeroAlunos[];
    contrSindPatReceitaBruta: ContrSindPatReceitaBruta[];
    contrSindPatCapitalSocial: ContrSindPatCapitalSocial[];
}

export class ContrSindPatReceitaBruta {
    id: string;
    contribuicaoSindicalPatronalId: string;
    receitaInicial: number;
    receitaFinal: number;
    percentual: number;
    valor: number;
    ano: number;
}

export class ReceitaBruta {
    id: string;
    receitaInicial: number;
    receitaFinal: number;
    percentual: number;
    valor: number;
}

export class ContrSindPatCapitalSocial{
    id: string;
    guid: number;
    contribuicaoSindicalPatronalId: string;
    ano: Date | number | string;
    capitalInicial: number;
    capitalFinal: number;
    percentual: number;
    valor: number;
    excluido: string;
    contribuicaoSindicalPatronal: ContribuicaoSindicalPatronal;

};

export class ContrSindPatNumeroAlunos {
    id: number;
    contribuicaoSindicalPatronalId: number;
    ano: number;
    numeroAlunosDe: number;
    numeroAlunosAte: number;
    percentual: number;
    valor: number;
    excluido: string;
};