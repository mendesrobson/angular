import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';

import { ContaCorrenteCobranca, FiltroRemessa, Remessa } from './models/remessa';
import { Empresa, GrupoEmpresa } from '../../cadastros/empresa/models/empresa';
import { environment } from '../../../environments/environment';


@Injectable()
export class RemessaService {

  constructor(private httpClient: HttpClient) { }


  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  }

  obterTodosContaCorrenteCobranca(): Observable<ContaCorrenteCobranca[]> {
    return this.httpClient.get<ContaCorrenteCobranca[]>(environment.url_contas_receber + "/Conta/ObterTodosContaCorrenteCobranca");
  }

  gerarRemessas(filtroRemessa: FiltroRemessa): Observable<string> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let searchParams = new URLSearchParams();
    for (let param in filtroRemessa) {
      searchParams.set(param, filtroRemessa[param]);
    }
    let options = new RequestOptions({ headers: headers });

    return  this.httpClient.post<string>(environment.url_contas_receber + "/Boleto/GerarRemesssa?" + searchParams.toString(), '');
  }

  consultarRemessas(filtroRemessa: FiltroRemessa): Observable<Remessa[]> {
    let searchParams = new URLSearchParams();
    for (let param in filtroRemessa) {
      searchParams.set(param, filtroRemessa[param]);
    }

    return this.httpClient.get<Remessa[]>(environment.url_contas_receber + "/Boleto/ObterTodosRemessas?" + searchParams.toString());
  }
}
