import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Desconto, GrupoDesconto, TipoDesconto, Tarefa } from './models/desconto';
import { Mascara } from '../mascara/models/mascara';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DescontoService  {

    constructor(private httpClient: HttpClient) { }
    
    obterDesconto(id: string): Observable<Desconto> {
        return this.httpClient.get<Desconto>(environment.url_contas_receber + "/Titulo/ObterDescontoPorId/" + id);
    };
    
    ObterTodosDesconto(): Observable<Desconto[]> {
        return this.httpClient.get<Desconto[]>(environment.url_contas_receber + "/Titulo/ObterTodosDesconto");
    };

    ObterDescontoPorCodigo(codigo: string): Observable<Desconto[]>{
        return this.httpClient.get<Desconto[]>(environment.url_contas_receber + "/Titulo/ObterDescontoPorCodigo/" + codigo);
    }

    AdicionarDesconto(desconto: Desconto): Observable<Desconto> {
       return this.httpClient.post<Desconto>(environment.url_contas_receber + "/Titulo/AdicionarDesconto", desconto);
    };

    AdicionarDescontoComSequenciaCodigo(desconto: Desconto): Observable<Desconto>{
        return this.httpClient.post<Desconto>(environment.url_contas_receber + "/Titulo/AdicionarDescontoComSequenciaCodigo", desconto);
    }


    AtualizarDesconto(desconto: Desconto): Observable<Desconto> {
        return this.httpClient.post<Desconto>(environment.url_contas_receber + "/Titulo/AtualizarDesconto", desconto);
    };

    RemoverDesconto(desconto: Desconto): Observable<Desconto> {
        return  this.httpClient.post<Desconto>(environment.url_contas_receber + "/Titulo/RemoverDesconto", desconto)
    };

    ReativarDesconto(desconto: Desconto): Observable<Desconto> {
        return this.httpClient.post<Desconto>(environment.url_contas_receber + "/Titulo/ReativarDesconto", desconto);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
      return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };
    
    // obterTodosEmpresa(): Observable<Empresa[]> {
    //   return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
    // };

    obterTodosGrupoDesconto(): Observable<GrupoDesconto[]> {
      return this.httpClient.get<GrupoDesconto[]>(environment.url_contas_receber + "/Titulo/ObterTodosGrupoDesconto");
    };

    obterTodosTipoDesconto(): Observable<TipoDesconto[]> {
      return this.httpClient.get<TipoDesconto[]>(environment.url_contas_receber + "/Titulo/ObterTodosTipoDesconto");
    };

    obterTarefaPorNome(id, tarefa: string): Observable<Tarefa[]> {
        return this.httpClient.get<Tarefa[]>(environment.url_contas_receber + "/Mascara/ObterTarefaPorNome/" + id + "&" +  tarefa);
    };

    obterMascaraPorTarefaId(id: string): Observable<Mascara> {
        return this.httpClient.get<Mascara>(environment.url_contas_receber + "/Mascara/ObterMascaraPorTarefaId/" + id);
    };

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };


}

