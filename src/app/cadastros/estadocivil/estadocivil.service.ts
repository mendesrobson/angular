import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent'
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EstadoCivil } from './models/estadocivil';

@Injectable()
export class EstadocivilService {

  constructor(private httpClient: HttpClient) { }

  obterEstadoCivil(id: string): Observable<EstadoCivil> {
    return this.httpClient.get<EstadoCivil>(environment.url_contas_receber + "/EstadoCivil/ObterEstadoCivilPorId/" + id);
  };

  ObterTodosEstadoCivil(): Observable<EstadoCivil[]> {
    return this.httpClient.get<EstadoCivil[]>(environment.url_contas_receber + "/EstadoCivil/ObterTodosEstadoCivil");
  };

  ObterCodigoEstadoCivil(codigo: string): Observable<EstadoCivil> {
    return this.httpClient.get<EstadoCivil>(environment.url_contas_receber + "/EstadoCivil/ObterCodigoEstadoCivil/" + codigo);
  };

  AdicionarEstadoCivil(EstadoCivil: EstadoCivil): Observable<EstadoCivil> {
    return this.httpClient.post<EstadoCivil>(environment.url_contas_receber + "/EstadoCivil/AdicionarEstadoCivil", EstadoCivil);
  };

  AtualizarEstadoCivil(EstadoCivil: EstadoCivil): Observable<EstadoCivil> {
    return this.httpClient.post<EstadoCivil>(environment.url_contas_receber + "/EstadoCivil/AtualizarEstadoCivil", EstadoCivil);
  };

  RemoverEstadoCivil(EstadoCivil: EstadoCivil): Observable<EstadoCivil> {
    return this.httpClient.post<EstadoCivil>(environment.url_contas_receber + "/EstadoCivil/RemoverEstadoCivil", EstadoCivil);
  };

  ReativarEstadoCivil(EstadoCivil: EstadoCivil): Observable<EstadoCivil> {
    return this.httpClient.post<EstadoCivil>(environment.url_contas_receber + "/EstadoCivil/ReativarEstadoCivil", EstadoCivil);
  };

}
