import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { Fornecedor, FornecedorModel } from './models/fornecedor';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';

@Injectable()
export class FornecedorService {

  constructor(private httpClient: HttpClient) { }

  ObterTodosFornecedor(): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Pessoa/ObterTodosFornecedors");
  }

  ObterTodosFornecedorPorEmpresa(idempresa: string): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Fornecedor/ObterTodosFornecedorPorEmpresa/"+idempresa);
  }
  
  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }

  obterTodosFornecedorPorGrupo(idGrupo: string): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Fornecedor/ObterTodosFornecedorPorGrupoId/" + idGrupo);
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosFornecedorPorGrupoEmpresa(ifornecedor: FornecedorModel): Observable<Fornecedor[]> {
    return this.httpClient.post<Fornecedor[]>(environment.url_contas_receber + "/Fornecedor/ObterTodosFornecedorPorGrupoEmpresa", ifornecedor);
  }
}