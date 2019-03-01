import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { MovimentoConta, ContaCorrente, HistoricoPadrao, MovimentoContaCentro, CentroCusto, CentroResultado, HistoricoPadraoCentro, TipoOperacao } from './models/movimentoconta';
import { ApropriacaoCentro } from '../../contasreceber/titulo/models/titulo';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class MovimentoContaService {

  constructor(private httpClient: HttpClient) { }

  obterTodosMovimentoConta(): Observable<MovimentoConta[]> {
    return this.httpClient.get<MovimentoConta[]>(environment.url_contas_receber + "/Titulo/ObterTodosMovimentoConta");
  };

  ObterMovimentoContaPorCodigo(codigo: string): Observable<MovimentoConta>{
    return this.httpClient.get<MovimentoConta>(environment.url_contas_receber + "/Titulo/ObterMovimentoContaPorCodigo/" + codigo);
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

  removerMovimentoConta(movimentoConta: MovimentoConta): Observable<MovimentoConta> {
    return this.httpClient.post<MovimentoConta>(environment.url_contas_receber + "/Titulo/RemoverMovimentoConta", movimentoConta);
  };

  obterTodosContaCorrenteCaixa(): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrenteCaixa");
  };

  obterTodosHistoricoPadrao(): Observable<HistoricoPadrao[]> {
    return this.httpClient.get<HistoricoPadrao[]>(environment.url_contas_receber + "/Titulo/ObterTodosHistoricoPadrao");
  };

  excluirMovimentoContaCentroId(id: string): Observable<MovimentoContaCentro> {
    return this.httpClient.get<MovimentoContaCentro>(environment.url_contas_receber + "/Titulo/ExcluirMovimentoContaCentroId/" + id);
  };

  validarPercentual(movimentoContaCentro: MovimentoContaCentro[]): boolean {
    var valorSomaPercentual = 0;
    for (var i = 0; i < movimentoContaCentro.length; i++) {

      valorSomaPercentual = valorSomaPercentual.valueOf() + movimentoContaCentro[i].percentual.valueOf();

    }

    return valorSomaPercentual > 100 ? false : true;

  };

  adicionarMovimentoContaCentro(movimentoContaCentro: MovimentoContaCentro): Observable<MovimentoContaCentro> {
    return this.httpClient.post<MovimentoContaCentro>(environment.url_contas_receber + "/Titulo/AdicionarMovimentoContaCentro", movimentoContaCentro);
  };

  obterTodosCentroCusto(): Observable<CentroCusto[]> {
    return this.httpClient.get<CentroCusto[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroCusto");
  };

  obterTodosCentroResultado(): Observable<CentroResultado[]> {
    return this.httpClient.get<CentroResultado[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroResultado");
  };

  obterHistoricoPadraoCentroPorId(id: string): Observable<HistoricoPadraoCentro[]> {
    return this.httpClient.get<HistoricoPadraoCentro[]>(environment.url_contas_receber + "/Titulo/ObterHistoricoPadraoCentroPorId/" + id);
  };

  adicionarMovimentoConta(movimentoConta: MovimentoConta): Observable<MovimentoConta> {
    return this.httpClient.post<MovimentoConta>(environment.url_contas_receber + "/Titulo/AdicionarMovimentoConta", movimentoConta);
  };

  obterMovimentosContaCentro(id: string): Observable<MovimentoContaCentro[]> {
    return this.httpClient.get<MovimentoContaCentro[]>(environment.url_contas_receber + "/Titulo/ObterMovimentosContaCentro/" + id);
  };


  getTipoOperacao() {
    return this.httpClient.get<TipoOperacao[]>('assets/dados/tipooperacao.json');
  };

  gerarApropriacaoCentroMovimentoConta(movimentoConta: MovimentoConta): Observable<ApropriacaoCentro[]> {
    return this.httpClient.post<ApropriacaoCentro[]>(environment.url_contas_receber + "/Titulo/GerarApropriacaoCentroMovimentoConta", movimentoConta);
  };

  obterMovimentoContaApropriacao(id: string): Observable<ApropriacaoCentro[]> {
    return this.httpClient.get<ApropriacaoCentro[]>(environment.url_contas_receber + "/Titulo/ObterMovimentoContaApropriacao/" + id);
  }

  obterTodosContaCorrentePorEmpresaId(idEmpresa: string): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrentePorEmpresaId/" + idEmpresa);
  }

  obterTodosHistoricoPadraoPorEmpresa(idEmpresa: string): Observable<HistoricoPadrao[]> {
    return this.httpClient.get<HistoricoPadrao[]>(environment.url_contas_receber + "/Titulo/ObterTodosHistoricoPadraoPorEmpresa/" + idEmpresa);
  }

  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }

  obterTodosContaCaixaPorEmpresaId(idEmpresa: string): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCaixaPorEmpresaId/" + idEmpresa);
  }

  obterTodasContas(): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Conta/ObterContasCorrente");
  }

  obterTodosContasPorEmpresaId(idEmpresa: string): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContasPorEmpresaId/" + idEmpresa);
  }
}