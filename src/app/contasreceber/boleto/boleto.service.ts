import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';

import { ContaCorrenteCobranca, FiltroBoleto, Parcela, Boleto, Cliente } from './models/boleto';
import { Empresa, GrupoEmpresa } from '../../cadastros/empresa/models/empresa';
import { environment } from '../../../environments/environment';


@Injectable()
export class BoletoService  {

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

  obterTodosPorContaVencimento(filtroBoleto: FiltroBoleto, clientes: string): Observable<Parcela[]> {
    let searchParams = new URLSearchParams();
    for (let param in filtroBoleto) {
      if (param != "clientes")
        searchParams.set(param, filtroBoleto[param]);

    }
    
    return this.httpClient.get<Parcela[]>(environment.url_contas_receber + "/Boleto/ObterTodosPorContaVencimento?" + searchParams.toString()+"&"+clientes);
  }

  gerarBoletos(contaCorrenteCobrancaId: string, parcelas: Parcela[]): Observable<Boleto[]> {
    let parametro = new URLSearchParams();
    parametro.set('contaCorrenteCobrancaId', contaCorrenteCobrancaId);

    return this.httpClient.post<Boleto[]>(environment.url_contas_receber + "/Boleto/CriarBoleto?" + parametro.toString(), parcelas);

  }

  obterTodosBoletosGerados(filtroBoleto: FiltroBoleto,  clientes: string): Observable<Boleto[]> {
    let searchParams = new URLSearchParams();
    for (let param in filtroBoleto) {
      if (param != "clientes")
        searchParams.set(param, filtroBoleto[param]);

    }

    return this.httpClient.get<Boleto[]>(environment.url_contas_receber + "/Boleto/ObterTodosBoletosGerados?" + searchParams.toString()+"&"+clientes);
  }

  cancelarBoletos(parcelas: Parcela[]): Observable<string> {
    return this.httpClient.post<string>(environment.url_contas_receber + "/Boleto/CancelarBoleto", parcelas);
  }

  obterTodosCliente(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Boleto/ObterTodosCliente");
  } 
}