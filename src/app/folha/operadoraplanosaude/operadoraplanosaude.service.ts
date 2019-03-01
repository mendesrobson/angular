import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OperadoraPlanoSaude } from './models/operadoraplanosaude';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { Localidade, Pais, Cep, Uf, TipoLogradouro, Cnpj } from '../../cadastros/pessoa/models/pessoa';

@Injectable()
export class OperadoraPlanoSaudeService {

  constructor(private httpClient: HttpClient) { }

  obterOperadoraPlanoSaude(id: string): Observable<OperadoraPlanoSaude> {
    return this.httpClient.get<OperadoraPlanoSaude>(environment.url_folha + "/OperadoraPlanoSaude/" + id);
  }

  obterTodosOperadoraPlanoSaude(): Observable<OperadoraPlanoSaude[]> {
    return this.httpClient.get<OperadoraPlanoSaude[]>(environment.url_folha + "/OperadoraPlanoSaude/");
  }

  adicionarOperadoraPlanoSaude(operadoraPlanoSaude: OperadoraPlanoSaude): Observable<OperadoraPlanoSaude> {
    return this.httpClient.post<OperadoraPlanoSaude>(environment.url_folha + "/OperadoraPlanoSaude/", operadoraPlanoSaude);
  }

  atualizarOperadoraPlanoSaude(operadoraPlanoSaude: OperadoraPlanoSaude): Observable<OperadoraPlanoSaude> {
    return this.httpClient.put<OperadoraPlanoSaude>(environment.url_folha + "/OperadoraPlanoSaude/", operadoraPlanoSaude);
  }

  removerOperadoraPlanoSaude(operadoraPlanoSaude: OperadoraPlanoSaude): Observable<OperadoraPlanoSaude> {
    return this.httpClient.put<OperadoraPlanoSaude>(environment.url_folha + "/OperadoraPlanoSaude/Remove/", operadoraPlanoSaude);
  }

  reativarOperadoraPlanoSaude(operadoraPlanoSaude: OperadoraPlanoSaude): Observable<OperadoraPlanoSaude> {
    return this.httpClient.put<OperadoraPlanoSaude>(environment.url_folha + "/OperadoraPlanoSaude/Reactive/", operadoraPlanoSaude);
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  };

  obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  };

  obterTodosTipoLogradouro(): Observable<TipoLogradouro[]> {
    return this.httpClient.get<TipoLogradouro[]>(environment.url_contas_receber + "/TipoLogradouro/ObterTodosTipoLogradouro");
  }

  obterTodosLocalidade(): Observable<Localidade[]> {
    return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
  }

  obterTodosUf(): Observable<Uf[]> {
    return this.httpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
  }

  obterTodosPais(): Observable<Pais[]> {
    return this.httpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
  }

  obterLocalidadePorDesc(desc: string): Observable<Localidade> {
    return this.httpClient.get<Localidade>(environment.url_contas_receber + "/Localidade/ObterLocalidadePorDesc/" + desc);
  };

  obterUfPorDesc(desc: string): Observable<Uf> {
    return this.httpClient.get<Uf>(environment.url_contas_receber + "/Uf/ObterUfPorDesc/" + desc);
  };

  obterTipoLogradouroPorDesc(desc: string): Observable<TipoLogradouro> {
    return this.httpClient.get<TipoLogradouro>(environment.url_contas_receber + "/TipoLogradouro/ObterTipoLogradouroPorDesc/" + desc);
  };

  obterPaisPorDesc(desc: string): Observable<Pais> {
    return this.httpClient.get<Pais>(environment.url_contas_receber + "/Pais/ObterPaisPorDesc/" + desc);
  };

  buscarDadosCnpj(id: string): Observable<Cnpj> {
    return this.httpClient.get<Cnpj>(environment.url_contas_receber + "/Pessoa/BuscarDadosCnpj/" + id);
  };

}
