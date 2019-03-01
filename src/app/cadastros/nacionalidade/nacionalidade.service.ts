import { Injectable } from '@angular/core';
import { Nacionalidade } from './models/nacionalidade';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { Pais } from '../../cadastros/pessoa/models/pessoa';

@Injectable()
export class NacionalidadeService {
  
  constructor(private httpClient: HttpClient) { }
    
  obterNacionalidade(id: string): Observable<Nacionalidade> {
      return this.httpClient.get<Nacionalidade>(environment.url_folha + "/Nacionalidade/" + id);
  };
  
  obterTodosNacionalidade(): Observable<Nacionalidade[]> {
      return this.httpClient.get<Nacionalidade[]>(environment.url_folha + "/Nacionalidade/");
  };

  adicionarNacionalidade(nacionalidade: Nacionalidade): Observable<Nacionalidade> {
      return  this.httpClient.post<Nacionalidade>(environment.url_folha + "/Nacionalidade/", nacionalidade);
  };

  atualizarNacionalidade(nacionalidade: Nacionalidade): Observable<Nacionalidade> {
      return  this.httpClient.put<Nacionalidade>(environment.url_folha + "/Nacionalidade/", nacionalidade);
  };

  removerNacionalidade(nacionalidade: Nacionalidade): Observable<Nacionalidade> {
      return  this.httpClient.put<Nacionalidade>(environment.url_folha + "/Nacionalidade/Remove/", nacionalidade);
  };

  reativarNacionalidade(nacionalidade: Nacionalidade): Observable<Nacionalidade> {
      return  this.httpClient.put<Nacionalidade>(environment.url_folha + "/Nacionalidade/Reactive/", nacionalidade);
  };

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  };
  
  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  };

  obterTodosPaisEndereco(): Observable<Pais[]> {
    return this.httpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
  }

}