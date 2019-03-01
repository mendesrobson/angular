import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { ContaCorrente, Agencia, Banco, ContaCorrenteCobranca, TipoConta } from './models/contacorrente';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Pessoa } from '../fornecedor/models/fornecedor';

@Injectable()
export class ContaCorrenteService {

  constructor(private httpClient: HttpClient) { }

  obterTodosTipoContaCaixa(): Observable<TipoConta[]> {
    return this.httpClient.get<TipoConta[]>(environment.url_contas_receber + "/Conta/ObterTodosTipoContaCaixa");
  }
  obterTodosTipoContaBancaria(): Observable<TipoConta[]> {
    return this.httpClient.get<TipoConta[]>(environment.url_contas_receber + "/Conta/ObterTodosTipoContaBancaria");
  }

  obterTodosContaCaixa(): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Conta/ObterTodosContaCaixa");
  }

  obterTodosContaCorrente(): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Conta/ObterTodosContaCorrente");
  }

  ObterContaPorTipoContaeCodigo(tipo: number, codigo: string): Observable<ContaCorrente>{
    return this.httpClient.get<ContaCorrente>(environment.url_contas_receber + "/Conta/ObterContaPorTipoContaeCodigo/" + tipo + "&" + codigo);
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  }


  obterTodosAgencia(): Observable<Agencia[]> {
    return this.httpClient.get<Agencia[]>(environment.url_contas_receber + "/Conta/ObterTodosAgencia");
  }

  obterTodosTipoConta(): Observable<TipoConta[]> {
    return this.httpClient.get<TipoConta[]>(environment.url_contas_receber + "/Conta/ObterTodosTipoConta");
  }

  obterTodosBanco(): Observable<Banco[]> {
    return this.httpClient.get<Banco[]>(environment.url_contas_receber + "/Conta/ObterTodosBanco");
  }

  adicionarContaCorrente(contacorrente: ContaCorrente): Observable<ContaCorrente> {
    return this.httpClient.post<ContaCorrente>(environment.url_contas_receber + "/Conta/AdicionarContaCorrente", contacorrente);
  };

  obterContaCorrentePorId(id: string): Observable<ContaCorrente> {
    return this.httpClient.get<ContaCorrente>(environment.url_contas_receber + "/Conta/ObterContaCorrentePorId/" + id);
  };

  obterContaCorrenteCobrancaContaCorrenteId(id: string): Observable<ContaCorrenteCobranca[]> {
    return this.httpClient.get<ContaCorrenteCobranca[]>(environment.url_contas_receber + "/Conta/ObterContaCorrenteCobrancaContaCorrenteId/" + id);
  }

  removerContaCorrente(contacorrente: ContaCorrente): Observable<ContaCorrente> {
    return this.httpClient.post<ContaCorrente>(environment.url_contas_receber + "/Conta/RemoverContaCorrente", contacorrente);
  }

  reativarContaCorrente(contacorrente: ContaCorrente): Observable<ContaCorrente> {
    return this.httpClient.post<ContaCorrente>(environment.url_contas_receber + "/Conta/ReativarContaCorrente", contacorrente);
  }

  adicionarContaCorrenteCobranca(contacorrentecobranca: ContaCorrenteCobranca): Observable<ContaCorrenteCobranca> {
    return this.httpClient.post<ContaCorrenteCobranca>(environment.url_contas_receber + "/Conta/AdicionarContaCorrenteCobranca", contacorrentecobranca);
  };

  removerContaCorrenteCobranca(contacorrentecobranca: ContaCorrenteCobranca) {
    return this.httpClient.post<ContaCorrenteCobranca>(environment.url_contas_receber + "/Conta/RemoverContaCorrenteCobranca", contacorrentecobranca);
  };

  atualizarContaCorrenteCobranca(contacorrentecobranca: ContaCorrenteCobranca): Observable<ContaCorrenteCobranca> {
    return this.httpClient.post<ContaCorrenteCobranca>(environment.url_contas_receber + "/Conta/AtualizarContaCorrenteCobranca", contacorrentecobranca);
  };

  atualizarContaCorrente(contacorrente: ContaCorrente): Observable<ContaCorrente> {
    return this.httpClient.post<ContaCorrente>(environment.url_contas_receber + "/Conta/AtualizarContaCorrente", contacorrente);
  }

  obterPessoaPorId(id: string): Observable<Pessoa> {
    return this.httpClient.get<Pessoa>(environment.url_contas_receber + "/Pessoa/ObterPessoaPorId/" + id);
  }

  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  };

}