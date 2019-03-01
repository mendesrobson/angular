import { Injectable } from '@angular/core';
import { CorRaca } from './models/corraca';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class CorRacaService {

  constructor(private httpClient: HttpClient) { }

  ObterCorRaca(id: string): Observable<CorRaca> {
    return this.httpClient.get<CorRaca>(environment.url_contas_receber + "/CorRaca/ObterCorRacaPorId/" + id);
  };

  ObterTodosCorRaca(): Observable<CorRaca[]> {
    return this.httpClient.get<CorRaca[]>(environment.url_contas_receber + "/CorRaca/ObterTodosCorRaca");
  };

  AdicionarCorRaca(corRaca: CorRaca): Observable<CorRaca> {
    return this.httpClient.post<CorRaca>(environment.url_contas_receber + "/CorRaca/AdicionarCorRaca", corRaca);
  };

  AtualizarCorRaca(corRaca: CorRaca): Observable<CorRaca> {
    return this.httpClient.post<CorRaca>(environment.url_contas_receber + "/CorRaca/AtualizarCorRaca", corRaca);
  };

  RemoverCorRaca(corRaca: CorRaca): Observable<CorRaca> {
    return this.httpClient.post<CorRaca>(environment.url_contas_receber + "/CorRaca/RemoverCorRaca", corRaca);
  };

  ReativarCorRaca(corRaca: CorRaca): Observable<CorRaca> {
    return this.httpClient.post<CorRaca>(environment.url_contas_receber + "/CorRaca/ReativarCorRaca", corRaca);
  }
}
