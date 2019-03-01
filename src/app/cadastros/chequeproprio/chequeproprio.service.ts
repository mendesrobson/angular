import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { ChequeTalao, ChequeFolha, Banco, Agencia, ContaCorrente, SituacaoCheque, ChequeFolhaHistorico } from './models/chequeproprio';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ChequeProprioService {

    constructor(private httpClient: HttpClient) { }

    ObterTodosChequeTalao(): Observable<ChequeTalao[]> {
        return this.httpClient.get<ChequeTalao[]>(environment.url_contas_receber + "/Cheque/ObterTodosChequeTalao");
    };

    obterChequeTalao(id: string): Observable<ChequeTalao> {
        return this.httpClient.get<ChequeTalao>(environment.url_contas_receber + "/Cheque/ObterChequeTalaoPorId/" + id);
      };

    obterTodosContaCorrente(): Observable<ContaCorrente[]> {
        return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Conta/ObterTodosContaCorrente");
    }

    obterTodosSituacaoCheque(): Observable<SituacaoCheque[]> {
        return this.httpClient.get<SituacaoCheque[]>(environment.url_contas_receber + "/Cheque/ObterTodosSituacaoCheque");
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
    }

    AdicionarChequeTalao(chequeTalao: ChequeTalao): Observable<ChequeTalao> {
        return this.httpClient.post<ChequeTalao>(environment.url_contas_receber + "/Cheque/AdicionarChequeTalao", chequeTalao);
    };

    AdicionarChequeFolhaHistorico(chequeFolhaHistorico: ChequeFolhaHistorico): Observable<ChequeFolhaHistorico> {
        return this.httpClient.post<ChequeFolhaHistorico>(environment.url_contas_receber + "/Cheque/AdicionarChequeFolhaHistorico", chequeFolhaHistorico)
    };
}