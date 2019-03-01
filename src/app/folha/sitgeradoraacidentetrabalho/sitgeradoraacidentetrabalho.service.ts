import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { SitGeradoraAcidenteTrabalho } from './models/sitgeradoraacidentetrabalho';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';

@Injectable()
export class SitGeradoraAcidenteTrabalhoService {

    constructor(private httpClient: HttpClient) {}

    obterSitGeradoraAcidenteTrabalho(id:string):Observable<SitGeradoraAcidenteTrabalho>{
        return this.httpClient.get<SitGeradoraAcidenteTrabalho>(environment.url_folha + "/SitGeradoraAcidenteTrabalho/" + id);
    };

    obterTodosSitGeradoraAcidenteTrabalho() : Observable<SitGeradoraAcidenteTrabalho[]>{
        return this.httpClient.get<SitGeradoraAcidenteTrabalho[]>(environment.url_folha + "/SitGeradoraAcidenteTrabalho/")
    }

    adicionarSitGeradoraAcidenteTrabalho(sitGeradoraAcidenteTrabalho: SitGeradoraAcidenteTrabalho): Observable<SitGeradoraAcidenteTrabalho> {
        return this.httpClient.post<SitGeradoraAcidenteTrabalho>(environment.url_folha + "/SitGeradoraAcidenteTrabalho/", sitGeradoraAcidenteTrabalho);
    };

    atualizarSitGeradoraAcidenteTrabalho(sitGeradoraAcidenteTrabalho: SitGeradoraAcidenteTrabalho): Observable<SitGeradoraAcidenteTrabalho> {
        return this.httpClient.put<SitGeradoraAcidenteTrabalho>(environment.url_folha + "/SitGeradoraAcidenteTrabalho/", sitGeradoraAcidenteTrabalho);
    };

    removerSitGeradoraAcidenteTrabalho(sitGeradoraAcidenteTrabalho: SitGeradoraAcidenteTrabalho): Observable<SitGeradoraAcidenteTrabalho> {
        return this.httpClient.put<SitGeradoraAcidenteTrabalho>(environment.url_folha + "/SitGeradoraAcidenteTrabalho/Remove/", sitGeradoraAcidenteTrabalho);
    };

    reativarSitGeradoraAcidenteTrabalho(sitGeradoraAcidenteTrabalho: SitGeradoraAcidenteTrabalho): Observable<SitGeradoraAcidenteTrabalho> {
        return this.httpClient.put<SitGeradoraAcidenteTrabalho>(environment.url_folha + "/SitGeradoraAcidenteTrabalho/Reactive/", sitGeradoraAcidenteTrabalho);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };
    
}