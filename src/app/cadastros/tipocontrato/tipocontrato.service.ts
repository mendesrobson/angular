import { TipoContrato, Periodicidade, TipoReajuste, Indice, Mes, Indexador } from './models/tipocontrato';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GrupoEmpresa, Empresa } from "../empresa/models/empresa";
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TipoContratoService {
    constructor(private httpClient: HttpClient) { }
    
    obterTodosTipoContrato(): Observable<TipoContrato[]> {
        return this.httpClient.get<TipoContrato[]>(environment.url_faturamento + "/Faturamento/ObterTodosTipoContrato");
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_faturamento + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresaPorGrupo(idGrupo: string): Observable<Empresa[]> {
      return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }

    obterTodosEmpresa(): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_faturamento + "/Empresa/ObterTodosEmpresa");
    }

    obterTodosIndice(): Observable<Indice[]> {
      return this.httpClient.get<Indice[]>(environment.url_faturamento + "/Faturamento/ObterTodosIndice");
    }

    getMes() {
      return this.httpClient.get<Mes[]>('assets/dados/mes.json');
    } 

    getPeriodicidade () {
      return this.httpClient.get<Periodicidade[]>('assets/dados/periodicidade.json')
    }

    getIndexador() {
      return this.httpClient.get<Indexador[]>('assets/dados/indexador.json');
    }

    getTipoReajuste() {
      return this.httpClient.get<TipoReajuste[]>('assets/dados/tiporeajuste.json');
    }

    adicionarTipoContrato(tipoContrato: TipoContrato): Observable<TipoContrato> {
      return this.httpClient.post<TipoContrato>(environment.url_faturamento + "/Faturamento/AdicionarTipoContrato", tipoContrato);
    };

    obterTipoContrato(id: string): Observable<TipoContrato> {
      return this.httpClient.get<TipoContrato>(environment.url_faturamento + "/Faturamento/ObterPorIdTipoContrato/" + id);
    }

    ObterTipoContratoPorCodigo(codigo: string): Observable<TipoContrato>{
      return this.httpClient.get<TipoContrato>(environment.url_faturamento + "/Faturamento/ObterTipoContratoPorCodigo/" + codigo);
    }

    atualizarTipoContrato(tipoContrato: TipoContrato): Observable<TipoContrato> {
      return this.httpClient.post<TipoContrato>(environment.url_faturamento + "/Faturamento/AtualizarTipoContrato", tipoContrato);
    };

    removerTipoContrato(tipoContrato: TipoContrato): Observable<TipoContrato> {
      return this.httpClient.post<TipoContrato>(environment.url_faturamento + "/Faturamento/RemoverTipoContrato", tipoContrato);
    };

    reativarTipoContrato(tipoContrato: TipoContrato): Observable<TipoContrato> {
      return this.httpClient.post<TipoContrato>(environment.url_faturamento + "/Faturamento/ReativarTipoContrato", tipoContrato);
  };
}
