import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Lancamento, Cliente, Evento, Contrato, ParametroFaturamento } from './models/lancamento';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LancamentoService {

  constructor(private httpClient: HttpClient) { }

  obterTodosLancamento(): Observable<Lancamento[]> {
    return this.httpClient.get<Lancamento[]>(environment.url_faturamento + "/Faturamento/ObterTodosLancamento");
  };

  ObterLancamentoPorCodigo(codigo: string): Observable<Lancamento>{
    return this.httpClient.get<Lancamento>(environment.url_faturamento + "/Faturamento/ObterLancamentoPorCodigo/" + codigo);
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  };

  obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  };

  obterTodosCliente(idEmpresa: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_faturamento + "/Faturamento/ObterTodosClienteEmpresa/" + idEmpresa);
  };

  obterTodosContrato(): Observable<Contrato[]> {
    return this.httpClient.get<Contrato[]>(environment.url_faturamento + "/Faturamento/ObterTodosContratoFaturamento");
  };

  adicionarLancamento(lancamento: Lancamento): Observable<Lancamento> {
    return  this.httpClient.post<Lancamento>(environment.url_faturamento + "/Faturamento/AdicionarLancamento", lancamento);
  };

  obterTodosContratoPorCliente(clienteId: string): Observable<Contrato[]> {
    return this.httpClient.get<Contrato[]>(environment.url_faturamento + "/Faturamento/ObterTodosContratoPorCliente/" + clienteId);
  };

  obterLancamentoPorId(lancamentoId: string): Observable<Lancamento> {
    return this.httpClient.get<Lancamento>(environment.url_faturamento + "/Faturamento/ObterLancamentoPorId/" + lancamentoId);
  };

  obterTodosLancamentosFilho(lancamentoId: string): Observable<Lancamento[]> {
    return this.httpClient.get<Lancamento[]>(environment.url_faturamento + "/Faturamento/ObterTodosLancamentosFilho/" + lancamentoId);
  };

  atualizarLancamento(lancamento: Lancamento): Observable<Lancamento> {
    return  this.httpClient.post<Lancamento>(environment.url_faturamento + "/Faturamento/AtualizarLancamento", lancamento);
  };

  removerLancamento(lancamentoId: string): Observable<Lancamento> {
    return this.httpClient.get<Lancamento>(environment.url_faturamento + "/Faturamento/RemoverLancamento/" + lancamentoId);
  };

  reativarLancamento(lancamentoId: string): Observable<Lancamento> {
    return this.httpClient.get<Lancamento>(environment.url_faturamento + "/Faturamento/ReativarLancamento/" + lancamentoId);
  };

  obterParametroPorEmpresaId(id: string): Observable<ParametroFaturamento> {
    return this.httpClient.get<ParametroFaturamento>(environment.url_faturamento + "/Faturamento/ObterParametroFaturamentoPorEmpresaId/" + id);
  };

  obterEventoFaturamentoPorEmpresa(id: string): Observable<Evento[]> {
    return this.httpClient.get<Evento[]>(environment.url_faturamento + "/Faturamento/ObterEventoFaturamentoPorEmpresa/" + id);
  };
  
}
