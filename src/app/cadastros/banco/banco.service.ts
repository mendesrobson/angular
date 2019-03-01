import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { Banco } from './models/banco';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BancoService {

    constructor(private httpClient : HttpClient) { }
    
    obterBanco(id: string): Observable<Banco> {
        return this.httpClient.get<Banco>(environment.url_contas_receber + "/Conta/ObterBancoPorId/" + id);
    };
    
    ObterTodosBanco(): Observable<Banco[]> {
        return this.httpClient.get<Banco[]>(environment.url_contas_receber + "/Conta/ObterTodosBanco");
    };

    ObterCodigoBanco(codigo: string): Observable<Banco> {
        return this.httpClient.get<Banco>(environment.url_contas_receber + "/Conta/ObterCodigoBanco/" + codigo);
    };

    ObterCodigoBancoCentral(codigo: string): Observable<Banco> {
        return this.httpClient.get<Banco>(environment.url_contas_receber + "/Conta/ObterCodigoBancoCentral/" + codigo);
    };

    AdicionarBanco(banco: Banco): Observable<Banco> {
        return this.httpClient.post<Banco>(environment.url_contas_receber + "/Conta/AdicionarBanco", banco);
    };


    AtualizarBanco(banco: Banco): Observable<Banco> {
        return this.httpClient.post<Banco>(environment.url_contas_receber + "/Conta/AtualizarBanco", banco);
    };

    RemoverBanco(banco: Banco): Observable<Banco> {
        return this.httpClient.post<Banco>(environment.url_contas_receber + "/Conta/RemoverBanco", banco);
    };

    ReativarBanco(banco: Banco): Observable<Banco> {
        return this.httpClient.post<Banco>(environment.url_contas_receber + "/Conta/ReativarBanco", banco);
    };
}


