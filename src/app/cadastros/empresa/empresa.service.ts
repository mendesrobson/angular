import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Empresa, GrupoEmpresa } from './models/empresa';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable()
export class EmpresaService {

  constructor(private httpClient: HttpClient) { }

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_faturamento+"/Empresa/ObterTodosEmpresa");
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_faturamento+"/Empresa/ObterTodosGrupoEmpresa");
  }

  adicionaEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.httpClient.post<Empresa>(environment.url_faturamento + "/Empresa/AdicionarEmpresa", empresa);
  }

  atualizarEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.httpClient.post<Empresa>(environment.url_faturamento + "/Empresa/AtualizarEmpresa", empresa);
  }

  removerEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.httpClient.post<Empresa>(environment.url_faturamento + "/Empresa/RemoverEmpresa", empresa);
  }

  obterEmpresa(id: string): Observable<Empresa> {
    return this.httpClient.get<Empresa>(environment.url_faturamento + "/Empresa/ObterEmpresaPorId/" + id);
  };

  reativarEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.httpClient.post<Empresa>(environment.url_faturamento+ "/Empresa/ReativarEmpresa", empresa);
  }

  ObterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_faturamento+"/Empresa/ObterTodosEmpresas");
  };

}
