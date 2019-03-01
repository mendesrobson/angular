import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ContribuicaoSindicalPatronal, ContrSindPatNumeroAlunos, ContrSindPatReceitaBruta, ContrSindPatCapitalSocial } from './models/contribuicaosindicalpatronal';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { Sindicato } from '../sindicato/models/sindicato';

@Injectable()
export class ContribuicaoSindicalPatronalService {

    constructor(private httpClient: HttpClient) { }
    
    obterContribuicaoSindicalPatronal(id: string): Observable<ContribuicaoSindicalPatronal> {
        return this.httpClient.get<ContribuicaoSindicalPatronal>(environment.url_folha + "/ContribuicaoSindicalPatronal/" + id);
    };

    obterTodosContribuicaoSindicalPatronal(): Observable<ContribuicaoSindicalPatronal[]> {
        return this.httpClient.get<ContribuicaoSindicalPatronal[]>(environment.url_folha + "/ContribuicaoSindicalPatronal/");
    };

    adicionarContribuicaoSindicalPatronal(contribuicaoSindicalPatronal: ContribuicaoSindicalPatronal): Observable<ContribuicaoSindicalPatronal> {
        return this.httpClient.post<ContribuicaoSindicalPatronal>(environment.url_folha + "/ContribuicaoSindicalPatronal/", contribuicaoSindicalPatronal);
    };

    atualizarContribuicaoSindicalPatronal(contribuicaoSindicalPatronal: ContribuicaoSindicalPatronal): Observable<ContribuicaoSindicalPatronal> {
        return this.httpClient.put<ContribuicaoSindicalPatronal>(environment.url_folha + "/ContribuicaoSindicalPatronal/", contribuicaoSindicalPatronal);
    };

    removerContribuicaoSindicalPatronal(contribuicaoSindicalPatronal: ContribuicaoSindicalPatronal): Observable<ContribuicaoSindicalPatronal> {
        return this.httpClient.put<ContribuicaoSindicalPatronal>(environment.url_folha + "/ContribuicaoSindicalPatronal/Remove/", contribuicaoSindicalPatronal);
    };

    reativarContribuicaoSindicalPatronal(contribuicaoSindicalPatronal: ContribuicaoSindicalPatronal): Observable<ContribuicaoSindicalPatronal> {
        return this.httpClient.put<ContribuicaoSindicalPatronal>(environment.url_folha + "/ContribuicaoSindicalPatronal/Reactive/", contribuicaoSindicalPatronal);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };

    // CONTRIBUIÇÃO SINDICAL PATRONAL RECEITA BRUTA
    obterTodosContribuicaoSindicalPatronalReceitaBruta(): Observable<ContrSindPatReceitaBruta[]> {
        return this.httpClient.get<ContrSindPatReceitaBruta[]>(environment.url_folha + "/ContribuicaoSindicalPatronalReceitaBruta/");
    }
    excluirContrSindPatReceitaBruta(id: string): Observable<ContrSindPatReceitaBruta> {
        return this.httpClient.delete<ContrSindPatReceitaBruta>(environment.url_folha + "/ContribuicaoSindicalPatronalReceitaBruta/" + id);
    }

    adicionarContrSindPatReceitaBruta(contrSindPatReceitaBruta: ContrSindPatReceitaBruta) : Observable<ContrSindPatReceitaBruta> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post<ContrSindPatReceitaBruta>(environment.url_folha + "/ContribuicaoSindicalPatronalReceitaBruta/", contrSindPatReceitaBruta);
    }

    atualizarContrSindPatReceitaBruta(contrSindPatReceitaBruta: ContrSindPatReceitaBruta) : Observable<ContrSindPatReceitaBruta> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.put<ContrSindPatReceitaBruta>(environment.url_folha + "/ContribuicaoSindicalPatronalReceitaBruta/", contrSindPatReceitaBruta);
    }

    obterTodosContrSindPatNumeroAlunos(): Observable<ContrSindPatNumeroAlunos[]> {
        return this.httpClient.get<ContrSindPatNumeroAlunos[]>(environment.url_folha + "/ContrSindPatNumeroAlunos");
    };

    obterContrSindPatNumeroAlunos(id: string): Observable<ContrSindPatNumeroAlunos> {
        return this.httpClient.get<ContrSindPatNumeroAlunos>(environment.url_folha + "/ContrSindPatNumeroAlunos/" + id);
    };

    adicionarContrSindPatNumeroAlunos(contribuicaoSindicalPatronal: ContrSindPatNumeroAlunos): Observable<ContrSindPatNumeroAlunos> {
        return this.httpClient.post<ContrSindPatNumeroAlunos>(environment.url_folha + "/ContrSindPatNumeroAlunos/", contribuicaoSindicalPatronal);
    };

    reativarContrSindPatNumeroAlunos(contrSindPatNumeroAlunos: ContrSindPatNumeroAlunos): Observable<ContrSindPatNumeroAlunos> {
        return this.httpClient.put<ContrSindPatNumeroAlunos>(environment.url_folha + "/ContrSindPatNumeroAlunos/Reactive/", contrSindPatNumeroAlunos);
    };

    removerContrSindPatNumeroAlunos(contribuicaoSindicalPatronal: ContrSindPatNumeroAlunos): Observable<ContrSindPatNumeroAlunos> {
        return this.httpClient.put<ContrSindPatNumeroAlunos>(environment.url_folha + "/ContrSindPatNumeroAlunos/Remove/", contribuicaoSindicalPatronal);
    };

    atualizarContrSindPatNumeroAlunos(contribuicaoSindicalPatronal: ContrSindPatNumeroAlunos): Observable<ContrSindPatNumeroAlunos> {
        return this.httpClient.put<ContrSindPatNumeroAlunos>(environment.url_folha + "/ContrSindPatNumeroAlunos/", contribuicaoSindicalPatronal);
    };

    excluirContrSindPatNumeroAlunos(id: string): Observable<ContrSindPatNumeroAlunos> {
        return this.httpClient.delete<ContrSindPatNumeroAlunos>(environment.url_folha + "/ContrSindPatNumeroAlunos/" + id);
    }

    adicionarContrSindPatCapitalSocial(contrSindPatCapitalSocial: ContrSindPatCapitalSocial): Observable<ContrSindPatCapitalSocial> {
        return this.httpClient.post<ContrSindPatCapitalSocial>(environment.url_folha + "/ContrSindPatCapitalSocial/", contrSindPatCapitalSocial);
    };

    excluirContrSindPatCapitalSocial(id: string): Observable<ContrSindPatCapitalSocial> {
        return this.httpClient.delete<ContrSindPatCapitalSocial>(environment.url_folha + "/ContrSindPatCapitalSocial/" + id);
    }

    atualizarContrSindPatCapitalSocial(contrSindPatCapitalSocial: ContrSindPatCapitalSocial): Observable<ContrSindPatCapitalSocial> {
        return this.httpClient.put<ContrSindPatCapitalSocial>(environment.url_folha + "/ContrSindPatCapitalSocial/", contrSindPatCapitalSocial);
    };
    
    obterTodosSindicatos(): Observable<Sindicato[]> {
        return this.httpClient.get<Sindicato[]>(environment.url_folha + "/Sindicato");
    };

    obterTodosContrSindPatNumeroAlunosPorContribuicaoSindicalPatronalId(id: string): Observable<ContrSindPatNumeroAlunos[]> {
        return this.httpClient.get<ContrSindPatNumeroAlunos[]>(environment.url_folha + "/ContrSindPatNumeroAlunos/ObterTodosPorContribuicaoSindicalPatronalId/" + id);
    };

    obterTodosContrSindPatReceitaBrutaPorContribuicaoSindicalPatronalId(id: string): Observable<ContrSindPatReceitaBruta[]> {
        return this.httpClient.get<ContrSindPatReceitaBruta[]>(environment.url_folha + "/ContribuicaoSindicalPatronalReceitaBruta/ObterTodosPorContribuicaoSindicalPatronalId/" + id);
    };

    obterTodosContrSindPatCapitalSocialPorContribuicaoSindicalPatronalId(id: string): Observable<ContrSindPatCapitalSocial[]> {
        return this.httpClient.get<ContrSindPatCapitalSocial[]>(environment.url_folha + "/ContrSindPatCapitalSocial/ObterTodosPorContribuicaoSindicalPatronalId/" + id);
    };
    
}
