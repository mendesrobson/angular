import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { CentroResultado, CentroResultadoPai, ClassificacaoCentroResultado, TipoCentro } from './models/centroresultado';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CentroResultadoService {

    constructor(private httpClient: HttpClient) {  }
    
    obterCentroResultado(id: string): Observable<CentroResultado> {
        return this.httpClient.get<CentroResultado>(environment.url_contas_receber + "/Titulo/ObterCentroResultadoPorId/" + id);
    };
    
    ObterTodosCentroResultado(): Observable<CentroResultado[]> {
        return this.httpClient.get<CentroResultado[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroResultado");
    };
    
    obterTodosCentroResultadoPorEmpresaId(idEmpresa:string): Observable<CentroResultado[]> {
        return this.httpClient.get<CentroResultado[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroResultadoPorEmpresaId/"+idEmpresa);
    };

    ObterCodigoCentroResultado(codigo: string): Observable<CentroResultado> {
        return this.httpClient.get<CentroResultado>(environment.url_contas_receber + "/Titulo/ObterCodigoCentroResultado/" + codigo);
    };

    AdicionarCentroResultado(centroResultado: CentroResultado): Observable<CentroResultado> {
        return this.httpClient.post<CentroResultado>(environment.url_contas_receber + "/Titulo/AdicionarCentroResultado", centroResultado);
    };

    AtualizarCentroResultado(centroResultado: CentroResultado): Observable<CentroResultado> {
        return this.httpClient.post<CentroResultado>(environment.url_contas_receber + "/Titulo/AtualizarCentroResultado", centroResultado);
    };

    RemoverCentroResultado(centroResultado: CentroResultado): Observable<CentroResultado> {
        return this.httpClient.post<CentroResultado>(environment.url_contas_receber + "/Titulo/RemoverCentroResultado", centroResultado);
    };

    ReativarCentroResultado(centroResultado: CentroResultado): Observable<CentroResultado> {
        return this.httpClient.post<CentroResultado>(environment.url_contas_receber + "/Titulo/ReativarCentroResultado", centroResultado);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
      };
      
      obterTodosEmpresa(): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
      };

      obterTodosCentroResultadoPai(): Observable<CentroResultadoPai[]> {
        return this.httpClient.get<CentroResultadoPai[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroResultadoPai");
      };

      obterTodosCentroResultadoPaiPorEmpresaId(idEmpresa:string): Observable<CentroResultadoPai[]> {
        return this.httpClient.get<CentroResultadoPai[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroResultadoPaiPorEmpresaId/"+idEmpresa);
      }

      obterTodosClassificacaoCentroResultado(): Observable<ClassificacaoCentroResultado[]> {
        return this.httpClient.get<ClassificacaoCentroResultado[]>(environment.url_contas_receber + "/Titulo/ObterTodosClassificacaoCentroResultado");
      };

      obterTodosTipoCentro(): Observable<TipoCentro[]> {
        return this.httpClient.get<TipoCentro[]>(environment.url_contas_receber + "/Titulo/ObterTodosTipoCentro");
      };

      obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };
    

}