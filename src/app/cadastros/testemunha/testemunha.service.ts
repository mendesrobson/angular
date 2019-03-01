import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Testemunha, Uf } from './models/testemunha';
import { URLSearchParams } from '@angular/http';
import { Empresa, GrupoEmpresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TestemunhaService {

    constructor(private httpClient: HttpClient) {  }
    
    obterTestemunha(id: string): Observable<Testemunha> {
        return this.httpClient.get<Testemunha>(environment.url_faturamento + "/Faturamento/ObterPorIdTestemunha/" + id);
      }
    
    obterTodosTestemunha(): Observable<Testemunha[]> {
        return this.httpClient.get<Testemunha[]>(environment.url_faturamento + "/Faturamento/ObterTodosTestemunha");
    }

    ObterTestemunhaPorCodigo(codigo: string): Observable<Testemunha>{
        return this.httpClient.get<Testemunha>(environment.url_faturamento + "/Faturamento/ObterTestemunhaPorCodigo/" + codigo);
    }

    TotalItens() {
        return this.httpClient.get<any[]>(environment.url_faturamento + "/Faturamento/TotalItens")
    }

    obterTodosEmpresaPorGrupo(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }

    /*obterTodosTestemunha(pagina, linhas, pesquisa): Observable<Testemunha[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let params: URLSearchParams = new URLSearchParams();
        params.set('pagina', pagina);
        params.set('linhas', linhas);
        params.set('pesquisa', pesquisa);
        options.search = params;
        let response =  this.http
            .get(environment.url_faturamento + "/Faturamento/ObterTodosTestemunha/", options)
            .map((res: Response) => <Testemunha[]>res.json())
            .catch(super.serviceError);
            return response;
    }*/

    adicionarTestemunha(testemunha: Testemunha): Observable<Testemunha> {
        return  this.httpClient.post<Testemunha>(environment.url_faturamento + "/Faturamento/AdicionarTestemunha", testemunha);
      };


    atualizarTestemunha(testemunha: Testemunha): Observable<Testemunha> {
        return  this.httpClient.post<Testemunha>(environment.url_faturamento + "/Faturamento/AtualizarTestemunha", testemunha);
    };

    removerTestemunha(testemunha: Testemunha): Observable<Testemunha> {
        return  this.httpClient.post<Testemunha>(environment.url_faturamento + "/Faturamento/RemoverTestemunha", testemunha);
    };

    reativarTestemunha(testemunha: Testemunha): Observable<Testemunha> {
        return  this.httpClient.post<Testemunha>(environment.url_faturamento + "/Faturamento/ReativarTestemunha", testemunha);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_faturamento + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_faturamento + "/Empresa/ObterTodosEmpresa");
    };

    obterTodosUf(): Observable<Uf[]> {
        return this.httpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
    };

}
