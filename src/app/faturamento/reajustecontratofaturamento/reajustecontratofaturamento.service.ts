import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { Cliente, FiltroContratosReajuste, ContratoFaturamento, ReajusteValores } from './models/contratofaturamento';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReajusteContratoFaturamentoService {

  constructor(private httpClient: HttpClient) { }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_faturamento + "/Empresa/ObterTodosGrupoEmpresa");
  };

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_faturamento + "/Empresa/ObterTodosEmpresa");
  };

  obterTodosCliente(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_faturamento + "/Faturamento/ObterTodosCliente");
  };

  obterTodosContratoParaReajustar(filtroParcelasAVencer: FiltroContratosReajuste, clientes: string): Observable<ContratoFaturamento[]> {
    let searchParams = new URLSearchParams();
    for (let param in filtroParcelasAVencer) {
      if (param != "clientes")
        searchParams.set(param, filtroParcelasAVencer[param]);

    }

    return this.httpClient.get<ContratoFaturamento[]>(environment.url_faturamento + "/Faturamento/ObterTodosContratoParaReajustar?" + searchParams.toString() + "&" + clientes);
  }

  reajustarContratos(reajusteValores: ReajusteValores, contratosFaturamento: ContratoFaturamento[]): Observable<ContratoFaturamento[]> {

    let searchParams = new URLSearchParams();
    for (let param in reajusteValores) {
        searchParams.set(param, reajusteValores[param]);

    }

    return  this.httpClient.post<ContratoFaturamento[]>(environment.url_faturamento + "/Faturamento/ReajustarContrato?" + searchParams.toString(), contratosFaturamento);
  }
}