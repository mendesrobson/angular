import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GrupoEmpresa, Empresa, Status, Cliente, ContaCorrente, Evento, ParametroFaturamento, ImpostoFaturamentoModel } from './models/report';

@Injectable()
export class ReportService {

  constructor(private httpClient: HttpClient) { }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }

  obterTodosCliente(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Pessoa/ObterTodosClientes");
  }

  obterTodosClientePorEmpresa(idEmpresa: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Cliente/ObterTodosClientePorEmpresa/" + idEmpresa);
  }

  getStatus() {
    return this.httpClient.get<Status[]>('assets/dados/status.json');
  };

  obterTodosContaCorrentePorEmpresa(idEmpresa: string): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrentePorEmpresaId/" + idEmpresa);
  }

  obterEventoFaturamentoPorEmpresa(id: string): Observable<Evento[]> {
    return this.httpClient.get<Evento[]>(environment.url_faturamento + "/Faturamento/ObterEventoFaturamentoPorEmpresa/" + id);
  };

  obterParametroFaturamento(id: string): Observable<ParametroFaturamento> {
    return this.httpClient.get<ParametroFaturamento>(environment.url_faturamento + "/Faturamento/ObterParametroFaturamentoPorId/" + id);
  }

  obterTodosParametroFaturamento(): Observable<ParametroFaturamento[]> {
    return this.httpClient.get<ParametroFaturamento[]>(environment.url_faturamento + "/Faturamento/ObterTodosParametroFaturamento");
  }

  gerarGuias(impostoFaturamento: ImpostoFaturamentoModel): Observable<ImpostoFaturamentoModel> {
    return this.httpClient.post<ImpostoFaturamentoModel>(environment.url_faturamento + "/GuiaFaturamento/GerarGuia", impostoFaturamento);
  }

  private Reports: string = '';

  EstruturarParamentrosDoRelatorio(ParamentrosReport: string, arr: any[] | string[] | Date[] = []): string {

    let campo = ParamentrosReport;
    this.Reports = this.Reports == '' ? this.Reports = ParamentrosReport : this.Reports;

    for (var key in arr) {
      if (arr[key] === null || arr[key] === undefined || arr[key].length < 1) {
        if (campo == this.Reports)
          campo += key + "=";
        else
          campo += '&' + key + "=";
      } else {
        if (campo == this.Reports) {
          if (arr[key] instanceof Array)
            campo += key + '=,' + arr[key] + ',';
          else if (arr[key] instanceof Date)
            campo += key + '=' + arr[key].toISOString().split("T")[0]
          else
              campo += key + '=' + arr[key];
        } else {
          if (arr[key] instanceof Array)
            campo += '&' + key + '=,' + arr[key] + ',';
          else if (arr[key] instanceof Date)
            campo += '&' + key + '=' + arr[key].toISOString().split("T")[0]
          else
              campo += '&' + key + '=' + arr[key];
        }
      }
    }

    return campo.replace('?&', '?');
  }
}