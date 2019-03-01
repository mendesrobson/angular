import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Observacao } from './models/observacao';
import { Empresa, GrupoEmpresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ObservacaoService {

    constructor(private httpClient: HttpClient) { }
    
    obterObservacao(id: string): Observable<Observacao> {
        return this.httpClient.get<Observacao>(environment.url_faturamento + "/Faturamento/ObterPorIdObservacao/" + id);
      }
    
    obterTodosObservacao(): Observable<Observacao[]> {
        return this.httpClient.get<Observacao[]>(environment.url_faturamento + "/Faturamento/ObterTodosObservacao");
      }

    ObterObservacaoPorCodigo(codigo: string): Observable<Observacao>{
        return this.httpClient.get<Observacao>(environment.url_faturamento + "/Faturamento/ObterObservacaoPorCodigo/" + codigo);
    }

    adicionarObservacao(observacao: Observacao): Observable<Observacao> {
        return this.httpClient.post<Observacao>(environment.url_faturamento + "/Faturamento/AdicionarObservacao", observacao);
      };


    atualizarObservacao(observacao: Observacao): Observable<Observacao> {
        return this.httpClient.post<Observacao>(environment.url_faturamento + "/Faturamento/AtualizarObservacao", observacao);
    };

    removerObservacao(observacao: Observacao): Observable<Observacao> {
        return this.httpClient.post<Observacao>(environment.url_faturamento + "/Faturamento/RemoverObservacao", observacao);
    };

    reativarObservacao(observacao: Observacao): Observable<Observacao> {
        return this.httpClient.post<Observacao>(environment.url_faturamento + "/Faturamento/ReativarObservacao", observacao);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        console.log("obterTodosGrupoEmpresa");
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresaPorGrupo(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }

     
}