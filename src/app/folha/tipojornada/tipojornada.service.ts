import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TipoJornada } from './models/tipojornada';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';


@Injectable()
export class TipoJornadaService {

    constructor(private httpClient: HttpClient) { }

    obterTipoJornada(id: string): Observable<TipoJornada> {
        return this.httpClient.get<TipoJornada>(environment.url_folha + "/TipoJornada/" + id);
    };

    obterTodosTipoJornada(): Observable<TipoJornada[]> {
        return this.httpClient.get<TipoJornada[]>(environment.url_folha + "/TipoJornada/");
    };

    adicionarTipoJornada(tipoJornada: TipoJornada): Observable<TipoJornada> {
        return this.httpClient.post<TipoJornada>(environment.url_folha + "/TipoJornada/", tipoJornada);
    };

    atualizarTipoJornada(tipoJornada: TipoJornada): Observable<TipoJornada> {
        return this.httpClient.put<TipoJornada>(environment.url_folha + "/TipoJornada/", tipoJornada);
    };

    removerTipoJornada(tipoJornada: TipoJornada): Observable<TipoJornada> {
        return this.httpClient.put<TipoJornada>(environment.url_folha + "/TipoJornada/Remove/", tipoJornada);
    };

    reativarTipoJornada(tipoJornada: TipoJornada): Observable<TipoJornada> {
        return this.httpClient.put<TipoJornada>(environment.url_folha + "/TipoJornada/Reactive/", tipoJornada);
    };
    
    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };
      
    obterTodosEmpresa(): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
    };

}
