import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { EventoFaturamento, ParametroFaturamento, UnidadeEvento, TipoMesVencimento, TipoVencimento, HistoricoPadrao } from './models/eventofaturamento';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EventoFaturamentoService {

  constructor(private httpClient: HttpClient) { }

  obterEventoFaturamento(id: string): Observable<EventoFaturamento> {
    return this.httpClient.get<EventoFaturamento>(environment.url_faturamento + "/Faturamento/ObterEventoFaturamentoPorId/" + id);
  };

  obterTodosEventoFaturamento(): Observable<EventoFaturamento[]> {
    return this.httpClient.get<EventoFaturamento[]>(environment.url_faturamento + "/Faturamento/ObterTodosEventoFaturamento");
  };

  ObterEventoFaturamentoPorCodigo(codigo: string): Observable<EventoFaturamento>{
    return this.httpClient.get<EventoFaturamento>(environment.url_faturamento + "/Faturamento/ObterEventoFaturamentoPorCodigo/" + codigo);
  }

  adicionarEventoFaturamento(eventofaturamento: EventoFaturamento): Observable<EventoFaturamento> {
   return this.httpClient.post<EventoFaturamento>(environment.url_faturamento + "/Faturamento/AdicionarEventoFaturamento", eventofaturamento);
  };

  atualizarEventoFaturamento(eventofaturamento: EventoFaturamento): Observable<EventoFaturamento> {
    return this.httpClient.post<EventoFaturamento>(environment.url_faturamento + "/Faturamento/AtualizarEventoFaturamento", eventofaturamento);
  };

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  };

  // obterTodosEmpresa(): Observable<Empresa[]> {
  //   return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  // }

  obterTodosEmpresaGrupo(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  };

  obterTodosHistoricoPadrao(): Observable<HistoricoPadrao[]> {
    return this.httpClient.get<HistoricoPadrao[]>(environment.url_contas_receber + "/Titulo/ObterTodosHistoricoPadrao");
  };

  removerEventoFaturamento(eventofaturamento: EventoFaturamento): Observable<EventoFaturamento> {
    return this.httpClient.post<EventoFaturamento>(environment.url_faturamento + "/Faturamento/RemoverEventoFaturamento", eventofaturamento);
  };

  reativarEventoFaturamento(eventofaturamento: EventoFaturamento): Observable<EventoFaturamento> {
    return this.httpClient.post<EventoFaturamento>(environment.url_faturamento + "/Faturamento/ReativarEventoFaturamento", eventofaturamento);
  };

  obterParametroPorEmpresaId(id: string): Observable<ParametroFaturamento> {
    return this.httpClient.get<ParametroFaturamento>(environment.url_faturamento + "/Faturamento/ObterParametroFaturamentoPorEmpresaId/" + id);
  };
  
  getUnidadeEvento() {
    return this.httpClient.get<UnidadeEvento[]>('assets/dados/unidadeevento.json');
  };

  getTipoMesVencimento() {
    return this.httpClient.get<TipoMesVencimento[]>('assets/dados/tipomesvencimento.json');
  };

  getTipoVencimento() {
    return this.httpClient.get<TipoVencimento[]>('assets/dados/tipovencimento.json');
  };

}