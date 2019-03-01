import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Uf } from './models/uf';
import { Pais } from '../../cadastros/pessoa/models/pessoa';

@Injectable()
export class UfService {

  constructor(private httpClient: HttpClient) { }

  ObterUfPorId(id: string): Observable<Uf> {
    return this.httpClient.get<Uf>(environment.url_contas_receber + "/Uf/ObterUfPorId/" + id);
  };

  ObterTodosUf(): Observable<Uf[]> {
    return this.httpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
  };

  AdicionarUf(uf: Uf): Observable<Uf> {
    return this.httpClient.post<Uf>(environment.url_contas_receber + "/Uf/AdicionarUf", uf);
  };

  AtualizarUf(uf: Uf): Observable<Uf> {
    return this.httpClient.post<Uf>(environment.url_contas_receber + "/Uf/AtualizarUf", uf);
  };

  RemoverUf(uf: Uf): Observable<Uf> {
    return this.httpClient.post<Uf>(environment.url_contas_receber + "/Uf/RemoverUf", uf);
  };

  ReativarUf(uf: Uf): Observable<Uf> {
    return this.httpClient.post<Uf>(environment.url_contas_receber + "/Uf/ReativarUf", uf);
  }

  obterTodosPaisEndereco(): Observable<Pais[]> {
    return this.httpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
  }
}
