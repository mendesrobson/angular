import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { TipoAfastamento } from './models/tipoafastamento';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { invoke } from 'q';


@Injectable()
export class TipoAfastamentoService {

    constructor(private httpClient: HttpClient) {}

    obterTipoAfastamento(id:string):Observable<TipoAfastamento>{
        return this.httpClient.get<TipoAfastamento>(environment.url_folha + "/TipoAfastamento/" + id);
    };

    obterTodosTipoAfastamento() : Observable<TipoAfastamento[]>{
        return this.httpClient.get<TipoAfastamento[]>(environment.url_folha + "/TipoAfastamento/")
    }

    adicionarTipoAfastamento(tipoAfastamento: TipoAfastamento): Observable<TipoAfastamento> {
        return this.httpClient.post<TipoAfastamento>(environment.url_folha + "/TipoAfastamento/", tipoAfastamento);
    };

    atualizarTipoAfastamento(tipoAfastamento: TipoAfastamento): Observable<TipoAfastamento> {
        return this.httpClient.put<TipoAfastamento>(environment.url_folha + "/TipoAfastamento/", tipoAfastamento);
    };

    removerTipoAfastamento(tipoAfastamento: TipoAfastamento): Observable<TipoAfastamento> {
        return this.httpClient.put<TipoAfastamento>(environment.url_folha + "/TipoAfastamento/Remove/", tipoAfastamento);
    };

    reativarTipoAfastamento(tipoAfastamento: TipoAfastamento): Observable<TipoAfastamento> {
        return this.httpClient.put<TipoAfastamento>(environment.url_folha + "/TipoAfastamento/Reactive/", tipoAfastamento);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };

    getTipoAfastamento() {
        return this.httpClient.get<TipoAfastamento[]>('assets/dados/tipoAfastamento.json');
    };
    
}
