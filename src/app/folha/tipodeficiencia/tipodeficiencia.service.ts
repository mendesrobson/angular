import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { TipoDeficiencia } from './models/tipodeficiencia';

import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { invoke } from 'q';



@Injectable()
export class TipoDeficienciaService {

    constructor(private httpClient: HttpClient) {}

    obterTipoDeficiencia(id: string): Observable<TipoDeficiencia>{
        return this.httpClient.get<TipoDeficiencia>(environment.url_folha + "/TipoDeficiencia/" + id);
    }

    obterTodosTipoDeficiencia() : Observable<TipoDeficiencia[]>{
        return this.httpClient.get<TipoDeficiencia[]>(environment.url_folha + "/TipoDeficiencia/");
    }

    adicionarTipoDeficiencia(tipoDeficiencia: TipoDeficiencia): Observable<TipoDeficiencia> {
        return this.httpClient.post<TipoDeficiencia>(environment.url_folha + "/TipoDeficiencia/", tipoDeficiencia);
    }

    atualizarTipoDeficiencia(tipoDeficiencia: TipoDeficiencia): Observable<TipoDeficiencia> {
        return this.httpClient.put<TipoDeficiencia>(environment.url_folha + "/TipoDeficiencia/", tipoDeficiencia);
    }

    removerTipoDeficiencia(tipoDeficiencia: TipoDeficiencia): Observable<TipoDeficiencia> {
        return this.httpClient.put<TipoDeficiencia>(environment.url_folha + "/TipoDeficiencia/Remove/", tipoDeficiencia);
    }

    reativarTipoDeficiencia(tipoDeficiencia: TipoDeficiencia): Observable<TipoDeficiencia> {
        return this.httpClient.put<TipoDeficiencia>(environment.url_folha + "/TipoDeficiencia/Reactive/", tipoDeficiencia);
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }
}
