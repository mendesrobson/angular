import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { HistoricoPadrao, HistoricoPadraoCentro, CentroCusto, CentroResultado } from './models/historicopadrao';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CentroCustoPai } from '../centrocusto/models/centrocusto';

@Injectable()
export class HistoricoPadraoService {

  constructor(private httpClient: HttpClient) { }

  obterHistoricoPadrao(id: string): Observable<HistoricoPadrao> {
    return this.httpClient.get<HistoricoPadrao>(environment.url_contas_receber + "/Titulo/ObterHistoricoPadraoPorId/" + id);
  };

  ObterCentroCustoPorHistoricoPadraoId(id: number): Observable<CentroCusto[]> {
    return this.httpClient.get<CentroCusto[]>(environment.url_contas_receber + "/Titulo/ObterCentroCustoPorHistoricoPadraoId/" + id);
  };

  ObterCentroResultadoPorHistoricoPadraoId(id: number): Observable<CentroResultado[]> {
    return this.httpClient.get<CentroResultado[]>(environment.url_contas_receber + "/Titulo/ObterCentroResultadoPorHistoricoPadraoId/" + id);
  };

  obterTodosHistoricoPadraoPorEmpresaId(idEmpresa:number): Observable<HistoricoPadrao[]> {
    return this.httpClient.get<HistoricoPadrao[]>(environment.url_contas_receber + "/Titulo/ObterTodosHistoricoPadraoPorEmpresaId/"+idEmpresa);
  };

  ObterTodosHistoricoPadrao(): Observable<HistoricoPadrao[]> {
    return this.httpClient.get<HistoricoPadrao[]>(environment.url_contas_receber + "/Titulo/ObterTodosHistoricoPadrao");
  };

  ObterTodosHistoricoPadraoPai(): Observable<HistoricoPadrao[]> {
    return this.httpClient.get<HistoricoPadrao[]>(environment.url_contas_receber + "/Titulo/ObterTodosHistoricoPadraoPai");
  };

  obterTodosHistoricoPadraoPaiPorEmpresaId(idEmpresa:number): Observable<HistoricoPadrao[]> {
    return this.httpClient.get<HistoricoPadrao[]>(environment.url_contas_receber + "/Titulo/ObterTodosHistoricoPadraoPaiPorEmpresaId/"+idEmpresa);
  };

  ObterTodosCentroCusto(): Observable<CentroCusto[]> {
    return this.httpClient.get<CentroCusto[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroCusto");
  }

  obterTodosCentroCustoPorEmpresaId(idEmpresa:number): Observable<CentroCusto[]> {
    return this.httpClient.get<CentroCusto[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroCustoPorEmpresaId/"+idEmpresa);
  }
  
  obterTodosCentroResultadoPorEmpresaId(idEmpresa:number): Observable<CentroCusto[]> {
    return this.httpClient.get<CentroCusto[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroResultadoPorEmpresaId/"+idEmpresa);
  }

  ObterTodosCentroResultado(): Observable<CentroResultado[]> {
    return this.httpClient.get<CentroResultado[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroResultado");
  };

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  }

  AdicionarHistoricoPadraoCentro(historicoPadraoCentro: HistoricoPadraoCentro): Observable<HistoricoPadraoCentro> {
    return this.httpClient.post<HistoricoPadraoCentro>(environment.url_contas_receber + "/Titulo/AdicionarHistoricoPadraoCentro", historicoPadraoCentro);
  };

  AtualizarHistoricoPadraoCentro(historicoPadraoCentro: HistoricoPadraoCentro): Observable<HistoricoPadraoCentro> {
    return this.httpClient.post<HistoricoPadraoCentro>(environment.url_contas_receber + "/Titulo/AtualizarHistoricoPadraoCentro", historicoPadraoCentro);
  };

  RemoverHistoricoPadraoCentro(historicoPadraoCentro: HistoricoPadraoCentro): Observable<HistoricoPadraoCentro> {
    return this.httpClient.post<HistoricoPadraoCentro>(environment.url_contas_receber + "/Titulo/RemoverHistoricoPadraoCentro", historicoPadraoCentro);
  };

  AdicionarHistoricoPadrao(historicoPadrao: HistoricoPadrao): Observable<HistoricoPadrao> {
    return this.httpClient.post<HistoricoPadrao>(environment.url_contas_receber + "/Titulo/AdicionarHistoricoPadrao", historicoPadrao);
  };

  AtualizarHistoricoPadrao(historicoPadrao: HistoricoPadrao): Observable<HistoricoPadrao> {
    return this.httpClient.post<HistoricoPadrao>(environment.url_contas_receber + "/Titulo/AtualizarHistoricoPadrao", historicoPadrao);
  };

  RemoverHistoricoPadrao(historicoPadrao: HistoricoPadrao): Observable<HistoricoPadrao> {
    return this.httpClient.post<HistoricoPadrao>(environment.url_contas_receber + "/Titulo/RemoverHistoricoPadrao", historicoPadrao);
  };

  ReativarHistoricoPadrao(historicoPadrao: HistoricoPadrao): Observable<HistoricoPadrao> {
    return this.httpClient.post<HistoricoPadrao>(environment.url_contas_receber + "/Conta/ReativarHistoricoPadrao", historicoPadrao);
  };

  validarPercentualNoBanco(historicoPadraoCentro: HistoricoPadraoCentro[], valor: number): boolean {
    var valorSomaPercentual = 0;

    for (var i = 0; i < historicoPadraoCentro.length; i++) {
      valorSomaPercentual += historicoPadraoCentro[i].percentual.valueOf();
    }

    valorSomaPercentual += valor;

    return valorSomaPercentual > 100 ? false : true;
  }
  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }

  obterTodosCentroCustoPaiPorEmpresaId(idEmpresa:string): Observable<CentroCustoPai[]> {
    return this.httpClient.get<CentroCustoPai[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroCustoPaiPorEmpresaId/"+idEmpresa);
};
}