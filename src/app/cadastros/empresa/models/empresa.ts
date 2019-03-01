import { Pessoa } from "../../pessoa/models/pessoa";

export class Empresa {
    id : number;
    grupoEmpresaId: number;
    pessoaId: number;
    servicoId: number;
    discriminacao: string;
    tokenHomologacaoNfse: string;
    tokenProducaoNfse: string;
    rpsHomologacaoNfse: number;
    rpsProducaoNfse: string;
    numeroReferenciaNfse: string;
    codigoTributacaoMunicipio: string;
    emiteProducao: string;
    pessoa: Pessoa;
    excluido: string;
}

export interface GrupoEmpresa {
    id: number;
    pessoa: Pessoa;
};