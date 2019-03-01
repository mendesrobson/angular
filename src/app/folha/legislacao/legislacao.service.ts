import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { Cnpj } from '../../cadastros/pessoa/models/pessoa';
import { Legislacao } from './models/legislacao';


@Injectable()
export class LegislacaoService {

    constructor(private httpClient: HttpClient) { }

    obterLegislacao(id: string): Observable<Legislacao> {
        return this.httpClient.get<Legislacao>(environment.url_folha + "/Legislacao/" + id);
    }

    ObterTodosLegislacao(): Observable<Legislacao[]> {
        return this.httpClient.get<Legislacao[]>(environment.url_folha + "/Legislacao/");
    }

    AdicionarLegislacao(legislacao: Legislacao): Observable<Legislacao> {
        return this.httpClient.post<Legislacao>(environment.url_folha + "/Legislacao/", legislacao);
    }

    AtualizarLegislacao(legislacao: Legislacao): Observable<Legislacao> {
        return this.httpClient.put<Legislacao>(environment.url_folha + "/Legislacao/", legislacao);
    }

    RemoverLegislacao(legislacao: Legislacao): Observable<Legislacao> {
        return this.httpClient.put<Legislacao>(environment.url_folha + "/Legislacao/Remove/", legislacao);
    }

    ReativarLegislacao(legislacao: Legislacao): Observable<Legislacao> {
        return this.httpClient.put<Legislacao>(environment.url_folha + "/Legislacao/Reactive/", legislacao);
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }

}
