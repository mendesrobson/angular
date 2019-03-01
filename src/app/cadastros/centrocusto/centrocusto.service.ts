import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { CentroCusto, CentroCustoPai, ClassificacaoCentroCusto, TipoCentro } from './models/centrocusto';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CentroCustoService {

    constructor(private HttpClient: HttpClient) { }

    obterCentroCusto(id: string): Observable<CentroCusto> {
        return this.HttpClient.get<CentroCusto>(environment.url_contas_receber + "/Titulo/ObterCentroCustoPorId/" + id);
    };

    ObterTodosCentroCusto(): Observable<CentroCusto[]> {
        return this.HttpClient.get<CentroCusto[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroCusto");
    };

    obterTodosCentroCustoPorEmpresaId(idEmpresa: string): Observable<CentroCusto[]> {
        return this.HttpClient.get<CentroCusto[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroCustoPorEmpresaId/"+idEmpresa);
    };

    ObterCodigoCentroCusto(codigo: string): Observable<CentroCusto> {
        return this.HttpClient.get<CentroCusto>(environment.url_contas_receber + "/Titulo/ObterCodigoCentroCusto/" + codigo);
    };

    AdicionarCentroCusto(centroCusto: CentroCusto): Observable<CentroCusto> {
        return this.HttpClient.post<CentroCusto>(environment.url_contas_receber + "/Titulo/AdicionarCentroCusto", centroCusto);
    };

    AtualizarCentroCusto(centroCusto: CentroCusto): Observable<CentroCusto> {
        return this.HttpClient.post<CentroCusto>(environment.url_contas_receber + "/Titulo/AtualizarCentroCusto", centroCusto);
    };

    RemoverCentroCusto(centroCusto: CentroCusto): Observable<CentroCusto> {
        return this.HttpClient.post<CentroCusto>(environment.url_contas_receber + "/Titulo/RemoverCentroCusto", centroCusto);
    };

    ReativarCentroCusto(centroCusto: CentroCusto): Observable<CentroCusto> {
        return this.HttpClient.post<CentroCusto>(environment.url_contas_receber + "/Titulo/ReativarCentroCusto", centroCusto);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.HttpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(): Observable<Empresa[]> {
        return this.HttpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
    };

    obterTodosCentroCustoPai(): Observable<CentroCustoPai[]> {
        return this.HttpClient.get<CentroCustoPai[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroCustoPai");
    };

    obterTodosCentroCustoPaiPorEmpresaId(idEmpresa:string): Observable<CentroCustoPai[]> {
        return this.HttpClient.get<CentroCustoPai[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroCustoPaiPorEmpresaId/"+idEmpresa);
    };

    obterTodosClassificacaoCentroCusto(): Observable<ClassificacaoCentroCusto[]> {
        return this.HttpClient.get<ClassificacaoCentroCusto[]>(environment.url_contas_receber + "/Titulo/ObterTodosClassificacaoCentroCusto");
    };

    obterTodosTipoCentro(): Observable<TipoCentro[]> {
        return this.HttpClient.get<TipoCentro[]>(environment.url_contas_receber + "/Titulo/ObterTodosTipoCentro");
    };
    
    obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
        return this.HttpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };
}
