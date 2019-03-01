import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MovimentoConta, TipoOperacao, ContaCorrente } from './models/movimentoconta';
import { GrupoEmpresa, Empresa } from '../cadastros/empresa/models/empresa';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConciliacaoBancariaService {

  constructor(private httpClient: HttpClient) { }

  obterTodosConciliacaoBancaria(): Observable<MovimentoConta[]> {
    return this.httpClient.get<MovimentoConta[]>(environment.url_contas_receber + "/Titulo/ObterTodosConciliacaoBancaria");
  };

  conciliacaoBancariaDataCompensacao(movimentoConta: MovimentoConta): Observable<MovimentoConta> {
    console.log(movimentoConta);
    return this.httpClient.post<MovimentoConta>(environment.url_contas_receber + "/Titulo/ConciliacaoBancariaDataCompensacao", movimentoConta);
  }

  obterMovimentoContaPorId(id: number): Observable<MovimentoConta> {
    return this.httpClient.get<MovimentoConta>(environment.url_contas_receber + "/Titulo/ObterMovimentoContaPorId/" + id);
  };

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  };

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  };

  getTipoOperacao() {
    return this.httpClient.get<TipoOperacao[]>('assets/dados/tipooperacao.json');
  };

  obterTodosContaCorrente(): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrente");
  };

  AtualizarMovimento(movimentoconta: MovimentoConta): Observable<MovimentoConta> {
    return this.httpClient.post<MovimentoConta>(environment.url_contas_receber + "/Titulo/AtualizarMovimento", movimentoconta);
  };
}


