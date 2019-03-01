export class Usuario {
    usuarioId: string;
    usuarioNome: string;
    usuarioNomeNormalizado: string;
    email: string;
    emailNormalizado: string;
    emailConfirmado: string;
    senha: string;
    senhaConfirmacao: string;
    seloSeguranca: string;
    seloConcorrencia: string;
    telefone: string;
    telefoneConfirmado: string;
    doisFatoresHabilitado: string;
    bloqueioFinal: string;
    bloqueioHabilitado: string;
    falhaAcessoContador: string;
    primeiroNome: string;
    ultimoNome: string;
    token: string;
    excluido: string;

    papeis : Papel[];
};

export class Papel {
    papelId: number;
    nome: string;
    selecionado: boolean;
};

