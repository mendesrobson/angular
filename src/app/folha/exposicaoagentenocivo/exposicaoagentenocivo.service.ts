import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { Observable } from '../../../../node_modules/rxjs';
import { ExposicaoAgenteNocivo } from './models/exposicaoAgenteNocivo';
import { environment } from '../../../environments/environment';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';

@Injectable()
export class ExposicaoagentenocivoService {

  constructor(private httpClient: HttpClient) { }

  obterExposicaoAgenteNocivo(id: string): Observable<ExposicaoAgenteNocivo> {
    return this.httpClient.get<ExposicaoAgenteNocivo>(environment.url_folha + "/ExposicaoAgenteNocivo/" + id);
  }

  obterTodosExposicaoAgenteNocivo(): Observable<ExposicaoAgenteNocivo[]> {
    return this.httpClient.get<ExposicaoAgenteNocivo[]>(environment.url_folha + "/ExposicaoAgenteNocivo/");
  }

  adicionarExposicaoAgenteNocivo(exposicaoagentenocivo: ExposicaoAgenteNocivo): Observable<ExposicaoAgenteNocivo> {
    return this.httpClient.post<ExposicaoAgenteNocivo>(environment.url_folha + "/ExposicaoAgenteNocivo/", exposicaoagentenocivo);
  }

  atualizarExposicaoAgenteNocivo(exposicaoagentenocivo: ExposicaoAgenteNocivo): Observable<ExposicaoAgenteNocivo> {
    return this.httpClient.put<ExposicaoAgenteNocivo>(environment.url_folha + "/ExposicaoAgenteNocivo/", exposicaoagentenocivo);
  }

  removerExposicaoAgenteNocivo(exposicaoagentenocivo: ExposicaoAgenteNocivo): Observable<ExposicaoAgenteNocivo> {
    return this.httpClient.put<ExposicaoAgenteNocivo>(environment.url_folha + "/ExposicaoAgenteNocivo/Remove/", exposicaoagentenocivo);
  }

  reativarExposicaoAgenteNocivo(exposicaoagentenocivo: ExposicaoAgenteNocivo): Observable<ExposicaoAgenteNocivo> {
    return this.httpClient.put<ExposicaoAgenteNocivo>(environment.url_folha + "/ExposicaoAgenteNocivo/Reactive/", exposicaoagentenocivo);
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }

}
