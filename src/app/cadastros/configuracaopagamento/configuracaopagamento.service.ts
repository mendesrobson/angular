import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { ConfiguracaoPagamento } from './models/configuracaopagamento';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfiguracaopagamentoService {

    constructor(private httpClient: HttpClient) { }
    
    obterConfiguracaoPagamento(id: string): Observable<ConfiguracaoPagamento> {
        return this.httpClient.get<ConfiguracaoPagamento>(environment.url_contas_receber + "/Titulo/ObterConfiguracaoPagamentoPorId/" + id);
    };
    
    ObterTodosConfiguracaoPagamento(): Observable<ConfiguracaoPagamento[]> {
        return this.httpClient.get<ConfiguracaoPagamento[]>(environment.url_contas_receber + "/Titulo/ObterTodosConfiguracaoPagamento");
    };

    AdicionarConfiguracaoPagamento(configuracaoPagamento: ConfiguracaoPagamento): Observable<ConfiguracaoPagamento> {
        return this.httpClient.post<ConfiguracaoPagamento>(environment.url_contas_receber + "/Titulo/AdicionarConfiguracaoPagamento", configuracaoPagamento);
    };


    AtualizarConfiguracaoPagamento(configuracaoPagamento: ConfiguracaoPagamento): Observable<ConfiguracaoPagamento> {
        return this.httpClient.post<ConfiguracaoPagamento>(environment.url_contas_receber + "/Titulo/AtualizarConfiguracaoPagamento", configuracaoPagamento);
    };

    RemoverConfiguracaoPagamento(configuracaoPagamento: ConfiguracaoPagamento): Observable<ConfiguracaoPagamento> {
        return this.httpClient.post<ConfiguracaoPagamento>(environment.url_contas_receber + "/Titulo/RemoverConfiguracaoPagamento", configuracaoPagamento);
    };

    ReativarConfiguracaoPagamento(configuracaoPagamento: ConfiguracaoPagamento): Observable<ConfiguracaoPagamento> {
        return this.httpClient.post<ConfiguracaoPagamento>(environment.url_contas_receber + "/Titulo/ReativarConfiguracaoPagamento", configuracaoPagamento);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
      };
    
      obterTodosEmpresa(): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
      };

    obterTodosEmpresaPorGrupo(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }

    ObterConfiguracaoPagamentoPorCodigo(codigo: string): Observable<ConfiguracaoPagamento>{
        return this.httpClient.get<ConfiguracaoPagamento>(environment.url_contas_receber + "/ConfiguracaoPagamento/ObterConfiguracaoPagamentoPorCodigo/" + codigo);
    }

}
