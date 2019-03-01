import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { TipoLogradouro } from './models/tipologradouro';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TipoLogradouroService {

    constructor(private httpClient: HttpClient) { }
    
    obterTipoLogradouro(id: string): Observable<TipoLogradouro> {
        return this.httpClient.get<TipoLogradouro>(environment.url_contas_receber + "/TipoLogradouro/ObterTipoLogradouroPorId/" + id);
      }
    
    ObterTodosTipoLogradouro(): Observable<TipoLogradouro[]> {
        return this.httpClient.get<TipoLogradouro[]>(environment.url_contas_receber + "/TipoLogradouro/ObterTodosTipoLogradouro");
      }

    AdicionarTipoLogradouro(tipologradouro: TipoLogradouro): Observable<TipoLogradouro> {
        return  this.httpClient.post<TipoLogradouro>(environment.url_contas_receber + "/TipoLogradouro/AdicionarTipoLogradouro", tipologradouro);
      };

    AtualizarTipoLogradouro(tipologradouro: TipoLogradouro): Observable<TipoLogradouro> {
        return  this.httpClient.post<TipoLogradouro>(environment.url_contas_receber + "/TipoLogradouro/AtualizarTipoLogradouro", tipologradouro);
    };

    RemoverTipoLogradouro(tipologradouro: TipoLogradouro): Observable<TipoLogradouro> {
        return  this.httpClient.post<TipoLogradouro>(environment.url_contas_receber + "/TipoLogradouro/RemoverTipoLogradouro", tipologradouro);
    };

    ReativarTipoLogradouro(tipologradouro: TipoLogradouro): Observable<TipoLogradouro> {
        return  this.httpClient.post<TipoLogradouro>(environment.url_contas_receber + "/TipoLogradouro/ReativarTipoLogradouro", tipologradouro);
    };
}

