import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ParametroFaturamento, ConfiguracaoPagamento, ContaCorrente } from './models/parametrofaturamento';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ParametroFaturamentoService {

  constructor(private httpClient: HttpClient) { }

  obterTodosParametroFaturamento(): Observable<ParametroFaturamento[]> {
    return this.httpClient.get<ParametroFaturamento[]>(environment.url_faturamento + "/Faturamento/ObterTodosParametroFaturamento");
  };

  obterParametroFaturamento(id: string): Observable<ParametroFaturamento> {
    return this.httpClient.get<ParametroFaturamento>(environment.url_faturamento + "/Faturamento/ObterParametroFaturamentoPorId/" + id);
  };

  adicionarParametroFaturamento(parametrofaturamento: ParametroFaturamento): Observable<ParametroFaturamento> {
    return this.httpClient.post<ParametroFaturamento>(environment.url_faturamento + "/Faturamento/AdicionarParametroFaturamento", parametrofaturamento);
  };

  atualizarParametroFaturamento(parametrofaturamento: ParametroFaturamento): Observable<ParametroFaturamento> {
    return this.httpClient.post<ParametroFaturamento>(environment.url_faturamento + "/Faturamento/AtualizarParametroFaturamento", parametrofaturamento);
  };

  removerParametroFaturamento(parametrofaturamento: ParametroFaturamento): Observable<ParametroFaturamento> {
    return this.httpClient.post<ParametroFaturamento>(environment.url_faturamento + "/Faturamento/RemoverParametroFaturamento", parametrofaturamento);
  };

  reativarParametroFaturamento(parametrofaturamento: ParametroFaturamento): Observable<ParametroFaturamento> {
    return this.httpClient.post<ParametroFaturamento>(environment.url_faturamento + "/Faturamento/ReativarParametroFaturamento", parametrofaturamento);
  };

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  };

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  };

  obterTodosConfiguracaoPagamento(): Observable<ConfiguracaoPagamento[]> {
    return this.httpClient.get<ConfiguracaoPagamento[]>(environment.url_contas_receber + "/Titulo/ObterTodosConfiguracaoPagamento");
  };

  obterTodosContaCorrente(): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrente");
  };

  obterTodosEmpresaPorGrupo(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  };

  obterTodosConfiguracaoPagamentoPorEmpresa(idEmpresa: string): Observable<ConfiguracaoPagamento[]> {
    return this.httpClient.get<ConfiguracaoPagamento[]>(environment.url_contas_receber + "/Titulo/ObterTodosConfiguracaoPagamentoPorEmpresa/" + idEmpresa);
  };  

  obterTodosContaCorrentePorEmpresa(idEmpresa: string): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrentePorEmpresaId/" + idEmpresa);
  };

}
