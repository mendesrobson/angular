import { Injectable } from '@angular/core';
import { TipoEndereco } from './models/tipoEndereco';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class TipoEnderecoService {

  constructor(private httpClient: HttpClient) { }

  ObterTipoEnderecoPorId(id: string): Observable<TipoEndereco> {
    return this.httpClient.get<TipoEndereco>(environment.url_contas_receber + "/TipoEndereco/ObterTipoEnderecoPorId/" + id);
  };

  ObterTodosTipoEndereco(): Observable<TipoEndereco[]> {
    return this.httpClient.get<TipoEndereco[]>(environment.url_contas_receber + "/TipoEndereco/ObterTodosTipoEndereco");
  };

  AdicionarTipoEndereco(tipoEndereco: TipoEndereco): Observable<TipoEndereco> {
    return this.httpClient.post<TipoEndereco>(environment.url_contas_receber + "/TipoEndereco/AdicionarTipoEndereco", tipoEndereco);
  };

  AtualizarTipoEndereco(tipoEndereco: TipoEndereco): Observable<TipoEndereco> {
    return this.httpClient.post<TipoEndereco>(environment.url_contas_receber + "/TipoEndereco/AtualizarTipoEndereco", tipoEndereco);
  };

  RemoverTipoEndereco(tipoEndereco: TipoEndereco): Observable<TipoEndereco> {
    return this.httpClient.post<TipoEndereco>(environment.url_contas_receber + "/TipoEndereco/RemoverTipoEndereco", tipoEndereco);
  };

  ReativarTipoEndereco(tipoEndereco: TipoEndereco): Observable<TipoEndereco> {
    return this.httpClient.post<TipoEndereco>(environment.url_contas_receber + "/TipoEndereco/ReativarTipoEndereco", tipoEndereco);
  }
}
