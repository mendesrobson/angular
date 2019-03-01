import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { CategoriaContaPagar, TipoCategoria } from './models/categoriacontapagar';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CategoriaContaPagarService {

  constructor(private httpClient: HttpClient) { }

  obterCategoriaContaPagar(id: string): Observable<CategoriaContaPagar> {
    return this.httpClient.get<CategoriaContaPagar>(environment.url_faturamento + "/Faturamento/ObterCategoriaContaPagarPorId/" + id);
  }

  obterTodosCategoriaContaPagar(): Observable<CategoriaContaPagar[]> {
    return this.httpClient.get<CategoriaContaPagar[]>(environment.url_faturamento + "/Faturamento/ObterTodosCategoriaContaPagar");
  }

  ObterCategoriaContaPagarPorCodigo(codigo: string): Observable<CategoriaContaPagar>{
    return this.httpClient.get<CategoriaContaPagar>(environment.url_faturamento + "/Faturamento/ObterCategoriaContaPagarPorCodigo/" + codigo);
  }

  adicionarCategoriaContaPagar(categoriacontapagar: CategoriaContaPagar): Observable<CategoriaContaPagar> {
    return this.httpClient.post<CategoriaContaPagar>(environment.url_faturamento + "/Faturamento/AdicionarCategoriaContaPagar", categoriacontapagar);
  };

  atualizarCategoriaContaPagar(categoria: CategoriaContaPagar): Observable<CategoriaContaPagar> {
    return this.httpClient.post<CategoriaContaPagar>(environment.url_faturamento + "/Faturamento/AtualizarCategoriaContaPagar", categoria);
  };

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_faturamento + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosCategoriaContaPagarPai(): Observable<CategoriaContaPagar[]> {
    return this.httpClient.get<CategoriaContaPagar[]>(environment.url_faturamento + "/Faturamento/ObterTodosCategoriaContaPagarPai");
  }


  removerCategoriaContaPagar(categoria: CategoriaContaPagar): Observable<CategoriaContaPagar> {
    return this.httpClient.post<CategoriaContaPagar>(environment.url_faturamento + "/Faturamento/RemoverCategoriaContaPagar", categoria);
  };

  reativarCategoriaContaPagar(categoria: CategoriaContaPagar): Observable<CategoriaContaPagar> {
    return this.httpClient.post<CategoriaContaPagar>(environment.url_faturamento + "/Faturamento/ReativarCategoriaContaPagar", categoria);
  };

  buscaTipoCategoria() {
    return this.httpClient.get<TipoCategoria[]>('assets/dados/tipocategoria.json');
  }

  obterTodosEmpresaPorGrupo(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }
}