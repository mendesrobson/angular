import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Cliente, FiltroLancamentoFaturamento, TipoFaturamento, Faturamento, Lancamento, ConfiguracaoPagamento, LancamentoConfiguracaoPagamento } from './models/faturamento';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FaturamentoService {
  
  constructor(private httpClient: HttpClient) {  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  };

  obterTodosClientePorEmpresa(idEmpresa: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Cliente/ObterTodosClientePorEmpresa/" + idEmpresa);
  }
  
  obterTodosEmpresaGrupo(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  };

  obterTodosClienteEmpresa(idEmpresa: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_faturamento + "/Faturamento/ObterTodosClienteEmpresa/" + idEmpresa);
  };
  
  /*adicionarFaturamento(dadosFaturamento: FiltroLancamentoFaturamento): Observable<DadosFaturamento> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return  this.http
      .post(environment.url_faturamento + "/Faturamento/AdicionarFaturamento", dadosFaturamento);
      .map(super.extractData)
      .catch((super.serviceError));
    return response;
  }; */ 

  getTipoFaturamento() {
    return this.httpClient.get<TipoFaturamento[]>('assets/dados/tipofaturamento.json');
  } 

  obterTodosFaturamento() : Observable<Faturamento[]> {
    return this.httpClient.get<Faturamento[]>(environment.url_faturamento + "/Faturamento/ObterTodosFaturamento");
  }

  obterTodosLancamentoFaturamento(filtroLancamentoFaturamento: FiltroLancamentoFaturamento): Observable<Lancamento[]> {
    return  this.httpClient.post<Lancamento[]>(environment.url_faturamento + "/Faturamento/ObterTodosLancamentosAFaturar", filtroLancamentoFaturamento);
  } 
  
  obterTodosConfiguracaoPagamento() : Observable<ConfiguracaoPagamento[]> {
    return this.httpClient.get<ConfiguracaoPagamento[]>(environment.url_contas_receber + "/Titulo/ObterTodosConfiguracaoPagamento");    
  }

  gerarFaturamento(lancamentoConfiguracaoPagamento: LancamentoConfiguracaoPagamento) : Observable<Faturamento[]> {
    return  this.httpClient.post<Faturamento[]>(environment.url_faturamento + "/Faturamento/GerarFaturamento", lancamentoConfiguracaoPagamento);
  }

  obterFaturamentos(filtroLancamentoFaturamento: FiltroLancamentoFaturamento): Observable<Faturamento[]> {
    return  this.httpClient.post<Faturamento[]>(environment.url_faturamento + "/Faturamento/ObterFaturamentos", filtroLancamentoFaturamento);  
  }
  
  removerFaturamento(id : string): Observable<Faturamento> {
    return  this.httpClient.post<Faturamento>(environment.url_faturamento + "/Faturamento/ExcluirFaturamento/"+ id, {}); 
  }



}
