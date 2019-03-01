import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import { CategoriaContaReceber, TipoCategoria, ClassificacaoCategoria, CategoriaContaReceberPai } from "./models/categoriacontareceber";
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class CategoriaContaReceberService  {

  constructor(private httpClient : HttpClient) { }

  obterTodosCategoriaContaReceber(): Observable<CategoriaContaReceber[]> {
    return this.httpClient.get<CategoriaContaReceber[]>(environment.url_faturamento + "/Faturamento/ObterTodosCategoriaContaReceber");
  }

  ObterCategoriaContaReceberPorCodigo(codigo: string): Observable<CategoriaContaReceber>{
    return this.httpClient.get<CategoriaContaReceber>(environment.url_faturamento + "/Faturamento/ObterCategoriaContaReceberPorCodigo/" + codigo);
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_faturamento + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresaPorGrupo(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }

  adicionarCategoriaContaReceber(categoriacontareceber: CategoriaContaReceber): Observable<CategoriaContaReceber> {
    return this.httpClient.post<CategoriaContaReceber>(environment.url_faturamento + "/Faturamento/AdicionarCategoriaContaReceber", categoriacontareceber);
  };

  getTipoCategoria() {
    return this.httpClient.get<TipoCategoria[]>('assets/dados/tipocategoria.json');
  }

  getClassificacaoCategoria() {
    return this.httpClient.get<ClassificacaoCategoria[]>('assets/dados/classificacaocategoria.json');
  }

  obterTodosCategoriaContaReceberPai() {
    return this.httpClient.get<CategoriaContaReceberPai[]>(environment.url_faturamento + "/Faturamento/ObterTodosCategoriaContaReceberPai");
  }

  obterCategoriaContaReceber(id: string): Observable<CategoriaContaReceber> {
    return this.httpClient.get<CategoriaContaReceber>(environment.url_faturamento + "/Faturamento/ObterPorIdCategoriaContaReceber/" + id);
    //Retorno Antes era de list
  }

  atualizarCategoriaContaReceber(categoriacontareceber: CategoriaContaReceber): Observable<CategoriaContaReceber> {
    return this.httpClient.post<CategoriaContaReceber>(environment.url_faturamento + "/Faturamento/AtualizarCategoriaContaReceber", categoriacontareceber);
  }

  removerCategoriaContaReceber(categoriacontareceber: CategoriaContaReceber): Observable<CategoriaContaReceber> {
    return this.httpClient.post<CategoriaContaReceber>(environment.url_faturamento + "/Faturamento/RemoverCategoriaContaReceber", categoriacontareceber);
  };

  reativarCategoriaContaReceber(categoriacontareceber: CategoriaContaReceber): Observable<CategoriaContaReceber> {
    return this.httpClient.post<CategoriaContaReceber>(environment.url_faturamento + "/Faturamento/ReativarCategoriaContaReceber", categoriacontareceber);
  };

  

}