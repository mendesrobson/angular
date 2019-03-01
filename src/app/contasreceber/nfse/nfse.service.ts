import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';


import { ContaCorrente, Cliente, Nfse, FiltroNfse, Justificativa } from './models/nfse';
import { Parcela } from '../titulo/models/titulo';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { environment } from '../../../environments/environment';


@Injectable()
export class NfseService  {

    constructor(private httpClient: HttpClient) {  }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
    }

    obterContasCorrente(): Observable<ContaCorrente[]> {
        return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Conta/ObterContasCorrente");
    }

    obterTodosCliente(): Observable<Cliente[]> {
        return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Boleto/ObterTodosCliente");
    }

    obterTodosPorContaVencimento(filtroNfse: FiltroNfse, clientes: string): Observable<Parcela[]> {
        let searchParams = new URLSearchParams();
        for (let param in filtroNfse) {
            if (param != "clientes")
                searchParams.set(param, filtroNfse[param]);
        }

        return this.httpClient.get<Parcela[]>(environment.url_contas_receber + "/Nfse/ObterTodosPorContaVencimento?" + searchParams.toString() + "&" + clientes);

    }

    obterNfsePorFiltro(filtroNfse: FiltroNfse, clientes: string): Observable<Parcela[]> {
        let searchParams = new URLSearchParams();
        for (let param in filtroNfse) {
            if (param != "clientes")
                searchParams.set(param, filtroNfse[param]);
        }

        return this.httpClient.get<Parcela[]>(environment.url_contas_receber + "/Nfse/ObterNfsePorFiltro?" + searchParams.toString() + "&" + clientes);

    }

    AdicionarNfse(parcela: Parcela[]): Observable<Nfse> {
        return this.httpClient.post<Nfse>(environment.url_contas_receber + "/Nfse/AdicionarNfse", parcela);
      };

      CancelarNfse(nfse: Nfse[]): Observable<string> {
        return this.httpClient.post<string>(environment.url_contas_receber + "/Nfse/CancelarNfse", nfse);
      };

}