import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ContratoFaturamento, Cliente, TipoContrato, SituacaoContrato, EventoFaturamento, ParametroFaturamento, Empresa, GrupoEmpresa } from './models/contratofaturamento';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Lancamento } from '../lancamento/models/lancamento';


@Injectable()
export class ContratoFaturamentoService {

  constructor(private httpClient: HttpClient) { }

  obterTodosContratoFaturamento(): Observable<ContratoFaturamento[]> {
    return this.httpClient.get<ContratoFaturamento[]>(environment.url_faturamento + "/Faturamento/ObterTodosContratoFaturamento");
  };

  obterTodosContratoFaturamentoEmpresaId(idEmpresa: string): Observable<ContratoFaturamento[]> {
    return this.httpClient.get<ContratoFaturamento[]>(environment.url_faturamento + "/Faturamento/ObterTodosContratoFaturamentoEmpresaId/"+idEmpresa);
  };

  obterContratoFaturamento(id: string): Observable<ContratoFaturamento> {
    return this.httpClient.get<ContratoFaturamento>(environment.url_faturamento + "/Faturamento/ObterContratoFaturamentoPorId/" + id);
  };

  ObterContratoFaturamentoPorCodigo(codigo: string): Observable<ContratoFaturamento>{
    return this.httpClient.get<ContratoFaturamento>(environment.url_faturamento + "/Faturamento/ObterContratoFaturamentoPorCodigo/" + codigo);
  }

  adicionarContratoFaturamento(contratofaturamento: ContratoFaturamento): Observable<ContratoFaturamento> {
    return this.httpClient.post<ContratoFaturamento>(environment.url_faturamento + "/Faturamento/AdicionarContratoFaturamento", contratofaturamento);
  };

  atualizarContratoFaturamento(contratofaturamento: ContratoFaturamento): Observable<ContratoFaturamento> {
    return this.httpClient.post<ContratoFaturamento>(environment.url_faturamento + "/Faturamento/AtualizarContratoFaturamento", contratofaturamento);
  };

  removerContratoFaturamento(contratofaturamento: ContratoFaturamento): Observable<ContratoFaturamento> {
    return this.httpClient.post<ContratoFaturamento>(environment.url_faturamento + "/Faturamento/RemoverContratoFaturamento", contratofaturamento);
  };

  reativarContratoFaturamento(contratofaturamento: ContratoFaturamento): Observable<ContratoFaturamento> {
    return this.httpClient.post<ContratoFaturamento>(environment.url_faturamento + "/Faturamento/ReativarContratoFaturamento", contratofaturamento);
  };

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  };

  obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  };

  obterTodosCliente(idEmpresa: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_faturamento + "/Faturamento/ObterTodosClienteEmpresa/" + idEmpresa);
  };

  obterTodosTipoContrato(): Observable<TipoContrato[]> {
    return this.httpClient.get<TipoContrato[]>(environment.url_faturamento + "/Faturamento/ObterTodosTipoContrato");
  };

  obterTodosSituacaoContrato(): Observable<SituacaoContrato[]> {
    return this.httpClient.get<SituacaoContrato[]>(environment.url_faturamento + "/Faturamento/ObterTodosSituacaoContrato");
  };

  adicionarLancamento(lancamento: Lancamento): Observable<Lancamento> {
    return this.httpClient.post<Lancamento>(environment.url_faturamento + "/Faturamento/AdicionarLancamento", lancamento);
  };

  obterParametroPorEmpresaId(id: string): Observable<ParametroFaturamento> {
    return this.httpClient.get<ParametroFaturamento>(environment.url_faturamento + "/Faturamento/ObterParametroFaturamentoPorEmpresaId/" + id);
  };

  obterEventoFaturamentoPorEmpresa(id: string): Observable<EventoFaturamento[]> {
    return this.httpClient.get<EventoFaturamento[]>(environment.url_faturamento + "/Faturamento/ObterEventoFaturamentoPorEmpresa/" + id);
  };

  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }

  obterTodosClientePorEmpresa(idEmpresa: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Cliente/ObterTodosClientePorEmpresa/" + idEmpresa);
  }
  
  obterTodosClientes(): Observable<Cliente[]>{
    return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Cliente/ObterTodosCliente/");
  }
}
