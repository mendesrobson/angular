import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { Cid } from './models/cid';


@Injectable()
export class CidService {

    constructor(private httpClient: HttpClient) { }

    obterCid(id: string): Observable<Cid> {
        return this.httpClient.get<Cid>(environment.url_folha + "/Cid/" + id);
    }

    ObterTodosCid(): Observable<Cid[]> {
        return this.httpClient.get<Cid[]>(environment.url_folha + "/Cid/");
    }

    AdicionarCid(cid: Cid): Observable<Cid> {
        return this.httpClient.post<Cid>(environment.url_folha + "/Cid/", cid);
    }

    AtualizarCid(cid: Cid): Observable<Cid> {
        return this.httpClient.put<Cid>(environment.url_folha + "/Cid/", cid);
    }

    RemoverCid(cid: Cid): Observable<Cid> {
        return this.httpClient.put<Cid>(environment.url_folha + "/Cid/Remove/", cid);
    }

    ReativarCid(cid: Cid): Observable<Cid> {
        return this.httpClient.put<Cid>(environment.url_folha + "/Cid/Reactive/", cid);
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }

}