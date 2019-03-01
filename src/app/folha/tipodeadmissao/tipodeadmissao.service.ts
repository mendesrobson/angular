import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { TipoDeAdmissao } from './models/tipodeadmissao';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { invoke } from 'q';


@Injectable()
export class TipoDeAdmissaoService {

    constructor(private httpClient: HttpClient) {}

    obterTipoDeAdmissao(id:string):Observable<TipoDeAdmissao>{
        return this.httpClient.get<TipoDeAdmissao>(environment.url_folha + "/TipoDeAdmissao/" + id);
    };

    obterTodosTipoDeAdmissao() : Observable<TipoDeAdmissao[]>{
        return this.httpClient.get<TipoDeAdmissao[]>(environment.url_folha + "/TipoDeAdmissao/")
    }

    adicionarTipoDeAdmissao(tipoDeAdmissao: TipoDeAdmissao): Observable<TipoDeAdmissao> {
        return this.httpClient.post<TipoDeAdmissao>(environment.url_folha + "/TipoDeAdmissao/", tipoDeAdmissao);
    };

    atualizarTipoDeAdmissao(tipoDeAdmissao: TipoDeAdmissao): Observable<TipoDeAdmissao> {
        return this.httpClient.put<TipoDeAdmissao>(environment.url_folha + "/TipoDeAdmissao/", tipoDeAdmissao);
    };

    removerTipoDeAdmissao(tipoDeAdmissao: TipoDeAdmissao): Observable<TipoDeAdmissao> {
        return this.httpClient.put<TipoDeAdmissao>(environment.url_folha + "/TipoDeAdmissao/Remove/", tipoDeAdmissao);
    };

    reativarTipoDeAdmissao(tipoDeAdmissao: TipoDeAdmissao): Observable<TipoDeAdmissao> {
        return this.httpClient.put<TipoDeAdmissao>(environment.url_folha + "/TipoDeAdmissao/Reactive/", tipoDeAdmissao);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };
   
}
