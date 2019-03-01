import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { TipoHorarioTrabalho } from './models/tipohorariotrabalho';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { invoke } from 'q';


@Injectable()
export class TipoHorarioTrabalhoService {

    constructor(private httpClient: HttpClient) {}

    obterTipoHorarioTrabalho(id:string):Observable<TipoHorarioTrabalho>{

        return this.httpClient.get<TipoHorarioTrabalho>(environment.url_folha + "/TipoHorarioTrabalho/" + id);
    };

    obterTodosTipoHorarioTrabalho() : Observable<TipoHorarioTrabalho[]>{

        return this.httpClient.get<TipoHorarioTrabalho[]>(environment.url_folha + "/TipoHorarioTrabalho/")
    }

    adicionarTipoHorarioTrabalho(tipoHorarioTrabalho: TipoHorarioTrabalho): Observable<TipoHorarioTrabalho> {
        return this.httpClient.post<TipoHorarioTrabalho>(environment.url_folha + "/TipoHorarioTrabalho/", tipoHorarioTrabalho);
    };

    atualizarTipoHorarioTrabalho(tipoHorarioTrabalho: TipoHorarioTrabalho): Observable<TipoHorarioTrabalho> {
        return this.httpClient.put<TipoHorarioTrabalho>(environment.url_folha + "/TipoHorarioTrabalho/", tipoHorarioTrabalho);
    };

    removerTipoHorarioTrabalho(tipoHorarioTrabalho: TipoHorarioTrabalho): Observable<TipoHorarioTrabalho> {
        return this.httpClient.put<TipoHorarioTrabalho>(environment.url_folha + "/TipoHorarioTrabalho/Remove/", tipoHorarioTrabalho);
    };

    reativarTipoHorarioTrabalho(tipoHorarioTrabalho: TipoHorarioTrabalho): Observable<TipoHorarioTrabalho> {
        return this.httpClient.put<TipoHorarioTrabalho>(environment.url_folha + "/TipoHorarioTrabalho/Reactive/", tipoHorarioTrabalho);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };
   
}
