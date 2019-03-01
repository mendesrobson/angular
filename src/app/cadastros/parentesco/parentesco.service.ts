import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Parentesco } from './models/Parentesco';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';


@Injectable()
export class ParentescoService {

    constructor(private httpClient: HttpClient) { }

    obterParentesco(id: string): Observable<Parentesco> {
        return this.httpClient.get<Parentesco>(environment.url_folha + "/Parentesco/" + id);
    };

    obterTodosParentesco(): Observable<Parentesco[]> {
        return this.httpClient.get<Parentesco[]>(environment.url_folha + "/Parentesco/");
    };

    adicionarParentesco(parentesco: Parentesco): Observable<Parentesco> {
        return this.httpClient.post<Parentesco>(environment.url_folha + "/Parentesco/", parentesco);
    };

    atualizarParentesco(parentesco: Parentesco): Observable<Parentesco> {
        return this.httpClient.put<Parentesco>(environment.url_folha + "/Parentesco/", parentesco);
    };

    removerParentesco(parentesco: Parentesco): Observable<Parentesco> {
        return this.httpClient.put<Parentesco>(environment.url_folha + "/Parentesco/Remove/", parentesco);
    };

    reativarParentesco(parentesco: Parentesco): Observable<Parentesco> {
        return this.httpClient.put<Parentesco>(environment.url_folha + "/Parentesco/Reactive/", parentesco);
    };
}
