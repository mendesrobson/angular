import { Injectable } from '@angular/core';
import { Pais } from './models/pais';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PaisService {

  constructor(private httpClient: HttpClient) { }

  ObterPais(id: string): Observable<Pais> {
    return this.httpClient.get<Pais>(environment.url_contas_receber + "/Pais/ObterPaisPorId/" + id);
  };

  ObterTodosPaises(): Observable<Pais[]> {
    return this.httpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
  };

  AdicionarPais(pais: Pais): Observable<Pais> {
    return this.httpClient.post<Pais>(environment.url_contas_receber + "/Pais/AdicionarPais", pais);
  };

  AtualizarPais(pais: Pais): Observable<Pais> {
    return this.httpClient.post<Pais>(environment.url_contas_receber + "/Pais/AtualizarPais", pais);
  };

  RemoverPais(pais: Pais): Observable<Pais> {
    return this.httpClient.post<Pais>(environment.url_contas_receber + "/Pais/RemoverPais", pais);
  };

  ReativarPais(pais: Pais): Observable<Pais> {
    return this.httpClient.post<Pais>(environment.url_contas_receber + "/Pais/ReativarPais", pais);
  }
}
