import { Injectable } from '@angular/core';
import { Localidade } from './models/localidade';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Uf } from '../uf/models/uf';

@Injectable()
export class LocalidadeService {

  constructor(private httpClient: HttpClient) { }

  obterLocalidade(id: string): Observable<Localidade> {
    return this.httpClient.get<Localidade>(environment.url_contas_receber + "/Localidade/ObterLocalidadePorId/" + id);
  };

  ObterTodosLocalidade(): Observable<Localidade[]> {
    return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
  };

  ObterCodigoLocalidade(codigo: string): Observable<Localidade> {
    return this.httpClient.get<Localidade>(environment.url_contas_receber + "/Localidade/ObterCodigoLocalidade/" + codigo);
  };

  AdicionarLocalidade(localidade: Localidade): Observable<Localidade> {
    return this.httpClient.post<Localidade>(environment.url_contas_receber + "/Localidade/AdicionarLocalidade", localidade);
  };

  AtualizarLocalidade(localidade: Localidade): Observable<Localidade> {
    return this.httpClient.post<Localidade>(environment.url_contas_receber + "/Localidade/AtualizarLocalidade", localidade);
  };

  RemoverLocalidade(localidade: Localidade): Observable<Localidade> {
    return this.httpClient.post<Localidade>(environment.url_contas_receber + "/Localidade/RemoverLocalidade", localidade);
  };

  ReativarLocalidade(localidade: Localidade): Observable<Localidade> {
    return this.httpClient.post<Localidade>(environment.url_contas_receber + "/Localidade/ReativarLocalidade", localidade);
  }

  ObterTodosUf(): Observable<Uf[]> {
    return this.httpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
  };
}
