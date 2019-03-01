import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { Observable } from '../../../../node_modules/rxjs';
import { ParteCorpoAtingida } from './models/partecorpoatingida';
import { environment } from '../../../environments/environment';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';


@Injectable()
export class PartecorpoatingidaService {

  constructor(private httpClient: HttpClient) { }

  obterParteCorpoAtingida(id: string): Observable<ParteCorpoAtingida> {
    return this.httpClient.get<ParteCorpoAtingida>(environment.url_folha + "/ParteCorpoAtingida/" + id);
  }

  obterTodosParteCorpoAtingida(): Observable<ParteCorpoAtingida[]> {
    return this.httpClient.get<ParteCorpoAtingida[]>(environment.url_folha + "/ParteCorpoAtingida/");
  }

  adicionarParteCorpoAtingida(parteCorpoAtingida: ParteCorpoAtingida): Observable<ParteCorpoAtingida> {
    return this.httpClient.post<ParteCorpoAtingida>(environment.url_folha + "/ParteCorpoAtingida/", parteCorpoAtingida);
  }

  atualizarParteCorpoAtingida(parteCorpoAtingida: ParteCorpoAtingida): Observable<ParteCorpoAtingida> {
    return this.httpClient.put<ParteCorpoAtingida>(environment.url_folha + "/ParteCorpoAtingida/", parteCorpoAtingida);
  }

  removerParteCorpoAtingida(parteCorpoAtingida: ParteCorpoAtingida): Observable<ParteCorpoAtingida> {
    return this.httpClient.put<ParteCorpoAtingida>(environment.url_folha + "/ParteCorpoAtingida/Remove/", parteCorpoAtingida);
  }

  reativarParteCorpoAtingida(parteCorpoAtingida: ParteCorpoAtingida): Observable<ParteCorpoAtingida> {
    return this.httpClient.put<ParteCorpoAtingida>(environment.url_folha + "/ParteCorpoAtingida/Reactive/", parteCorpoAtingida);
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }

}
