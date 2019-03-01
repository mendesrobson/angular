import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TipoBeneficio, Tipo } from './models/tipobeneficio';
import { environment } from '../../../environments/environment';
import { Empresa, GrupoEmpresa } from '../../cadastros/empresa/models/empresa';

@Injectable()
export class TipoBeneficioService {

  constructor(private httpClient: HttpClient) { }

  obterTipoBeneficio(id: string): Observable<TipoBeneficio> {
    return this.httpClient.get<TipoBeneficio>(environment.url_folha + "/TipoBeneficio/" + id);
  };

  obterTodosTipoBeneficio(): Observable<TipoBeneficio[]> {
    return this.httpClient.get<TipoBeneficio[]>(environment.url_folha + "/TipoBeneficio/");
  };

  adicionarTipoBeneficio(tipoBeneficio: TipoBeneficio): Observable<TipoBeneficio> {
    return this.httpClient.post<TipoBeneficio>(environment.url_folha + "/TipoBeneficio/", tipoBeneficio);
  };

  atualizarTipoBeneficio(tipoBeneficio: TipoBeneficio): Observable<TipoBeneficio> {
    return this.httpClient.put<TipoBeneficio>(environment.url_folha + "/TipoBeneficio/", tipoBeneficio);
  };

  removerTipoBeneficio(tipoBeneficio: TipoBeneficio): Observable<TipoBeneficio> {
    return this.httpClient.put<TipoBeneficio>(environment.url_folha + "/TipoBeneficio/Remove/", tipoBeneficio);
  };

  reativarTipoBeneficio(tipoBeneficio: TipoBeneficio): Observable<TipoBeneficio> {
    return this.httpClient.put<TipoBeneficio>(environment.url_folha + "/TipoBeneficio/Reactive/", tipoBeneficio);
  };

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  };

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  };

  getTipo() {
    return this.httpClient.get<Tipo[]>('assets/dados/tipolancamento.json');
  };
  
}
