import { Injectable, EventEmitter } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';

import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { Cliente, FiltroParcelasAVencer, Parcela, Fornecedor } from './models/parcela';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AlterarVencimentoLoteService  {

  constructor(private httpClient: HttpClient) { }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  }

  obterTodosCliente(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Titulo/ObterTodosCliente");
  }
  
  obterParcelasReceberParaAlterar(filtroParcelasAVencer: FiltroParcelasAVencer,  clientes: string): Observable<Parcela[]> {
    let searchParams = new URLSearchParams();
    for (let param in filtroParcelasAVencer) {
      if (param != "clientes")
        searchParams.set(param, filtroParcelasAVencer[param]);

    }

    return this.httpClient.get<Parcela[]>(environment.url_contas_receber + "/Titulo/ObterParcelasReceberParaAlterar?" + searchParams.toString()+"&"+clientes);
  }

  alterarVencimentoParcelas(parcelas: Parcela[]): Observable<Parcela[]> {
   return this.httpClient.post<Parcela[]>(environment.url_contas_receber + "/Titulo/AlterarVencimentoParcelas", parcelas);
  }

  obterTodosFornecedor(): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Titulo/ObterTodosFornecedor");
  }

  obterParcelasPagarParaAlterar(filtroParcelasAVencer: FiltroParcelasAVencer,  fornecedores: string): Observable<Parcela[]> {
    let searchParams = new URLSearchParams();
    for (let param in filtroParcelasAVencer) {
      if (param != "fornecedores")
        searchParams.set(param, filtroParcelasAVencer[param]);
    }

    return this.httpClient.get<Parcela[]>(environment.url_contas_receber + "/Titulo/ObterParcelasPagarParaAlterar?" + searchParams.toString()+"&"+fornecedores);
  }
}