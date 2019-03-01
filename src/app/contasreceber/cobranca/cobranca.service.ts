import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';

import { Empresa, GrupoEmpresa } from '../../cadastros/empresa/models/empresa';
import { Cliente } from '../../cadastros/cliente/models/cliente';
import { Fornecedor } from '../../cadastros/fornecedor/models/fornecedor';
import { FiltroParcela, TipoAtendimento, CobrancaAcao, CobrancaContato } from './models/cobranca';
import { Parcela } from '../titulo/models/titulo';
import { environment } from '../../../environments/environment';


@Injectable()
export class CobrancaService {

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

  obterTodosFornecedor(): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Titulo/ObterTodosFornecedor");
  }

  obterParcelaPorFiltro(filtroParcela: FiltroParcela): Observable<Parcela[]> {
    let searchParams = new URLSearchParams();
    for (let param in filtroParcela) {
      searchParams.set(param, filtroParcela[param]);
    }

    return this.httpClient.get<Parcela[]>(environment.url_contas_receber + "/Titulo/ObterParcelasPorFiltroCobranca?" + searchParams.toString());

  }

  obterTodosTipoAtendimento(): Observable<TipoAtendimento[]> {
    return this.httpClient.get<TipoAtendimento[]>(environment.url_contas_receber + "/Titulo/ObterTodosTipoAtendimento");
  }

  obterTodosCobrancaAcao(): Observable<CobrancaAcao[]> {
    return this.httpClient.get<CobrancaAcao[]>(environment.url_contas_receber + "/Titulo/ObterTodosCobrancaAcao");
  }

  adicionarCobrancaContato(cobrancaContato: CobrancaContato): Observable<CobrancaContato> {
    return this.httpClient.post<CobrancaContato>(environment.url_contas_receber + "/Titulo/AdicionarCobrancaContato", cobrancaContato);
  }

  obterTodosClientePorEmpresa(idEmpresa: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Cliente/ObterTodosClientePorEmpresa/" + idEmpresa);
  }

  obterTodosFornecedorPorEmpresa(idEmpresa: string): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Titulo/ObterTodosFornecedorPorEmpresa/" + idEmpresa);
  }

  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }
}