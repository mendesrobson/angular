import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { Cartao, CartaoBandeira } from './models/cartao';
import { Empresa, GrupoEmpresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CartaoService {

    constructor(private httpClient: HttpClient) {  }
    
    obterCartao(id: string): Observable<Cartao> {
        return this.httpClient.get<Cartao>(environment.url_contas_receber + "/Cartao/ObterCartaoPorId/" + id);
    };
    
    ObterTodosCartao(): Observable<Cartao[]> {
        return this.httpClient.get<Cartao[]>(environment.url_contas_receber + "/Cartao/ObterTodosCartao");
    };

    AdicionarCartao(cartao: Cartao): Observable<Cartao> {
        return this.httpClient.post<Cartao>(environment.url_contas_receber + "/Cartao/AdicionarCartao", cartao);
    };

    AtualizarCartao(cartao: Cartao): Observable<Cartao> {
        return this.httpClient.post<Cartao>(environment.url_contas_receber + "/Cartao/AtualizarCartao", cartao);
    };

    RemoverCartao(cartao: Cartao): Observable<Cartao> {
        return this.httpClient.post<Cartao>(environment.url_contas_receber + "/Cartao/RemoverCartao", cartao);
    };

    ReativarCartao(cartao: Cartao): Observable<Cartao> {
        return this.httpClient.post<Cartao>(environment.url_contas_receber + "/Cartao/ReativarCartao", cartao);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };
    
    obterTodosEmpresa(): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
    };

    ObterTodosCartaoBandeira(): Observable<CartaoBandeira[]> {
        return this.httpClient.get<CartaoBandeira[]>(environment.url_contas_receber + "/Cartao/ObterTodosCartaoBandeira");
    };

    obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };
}