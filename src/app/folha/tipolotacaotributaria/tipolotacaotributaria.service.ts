import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoLotacaoTributaria, Empresa, GrupoEmpresa } from './models/tipolotacaotributaria';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TipolotacaotributariaService {
    constructor(private httpClient: HttpClient) { }

    obterTipolotacaotributariaPorId(id: string): Observable<TipoLotacaoTributaria> {
        return this.httpClient.get<TipoLotacaoTributaria>(environment.url_folha + "/TipoLotacaoTributaria/" + id);
    }

    obterTodosTipolotacaotributaria(): Observable<TipoLotacaoTributaria[]> {
        return this.httpClient.get<TipoLotacaoTributaria[]>(environment.url_folha + "/TipoLotacaoTributaria/");
    }

    adicionarTipolotacaotributaria(tipolotacaotributaria: TipoLotacaoTributaria): Observable<TipoLotacaoTributaria> {
        return this.httpClient.post<TipoLotacaoTributaria>(environment.url_folha + "/TipoLotacaoTributaria/", tipolotacaotributaria);
    }

    atualizarTipolotacaotributaria(tipolotacaotributaria: TipoLotacaoTributaria): Observable<TipoLotacaoTributaria> {
        return this.httpClient.put<TipoLotacaoTributaria>(environment.url_folha + "/TipoLotacaoTributaria/", tipolotacaotributaria);
    }

    removerTipolotacaotributaria(tipolotacaotributaria: TipoLotacaoTributaria): Observable<TipoLotacaoTributaria> {
        return this.httpClient.put<TipoLotacaoTributaria>(environment.url_folha + "/TipoLotacaoTributaria/Remove/", tipolotacaotributaria);
    }

    reativarTipolotacaotributaria(tipolotacaotributaria: TipoLotacaoTributaria): Observable<TipoLotacaoTributaria> {
        return this.httpClient.put<TipoLotacaoTributaria>(environment.url_folha + "/TipoLotacaoTributaria/Reactive/", tipolotacaotributaria);
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }
}