import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { Cliente } from './models/cliente';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Empresa, GrupoEmpresa } from '../empresa/models/empresa';

@Injectable()
export class ClienteService {

  constructor(private httpClient: HttpClient) { }

  ObterTodosCliente(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Pessoa/ObterTodosClientes");
  }

  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }

  obterTodosClientePorEmpresa(idEmpresa: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Cliente/ObterTodosClientePorEmpresa/" + idEmpresa);
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }
}