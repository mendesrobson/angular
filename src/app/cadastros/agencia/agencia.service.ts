import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { Agencia, Banco, TipoLogradouro, Localidade, Uf, Pais, Cep } from './models/agencia';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AgenciaService {

    constructor(private httpClient:HttpClient) { }
    
    obterAgencia(id: string): Observable<Agencia> {
      return this.httpClient.get<Agencia>(environment.url_contas_receber + "/Conta/ObterAgenciaPorId/" + id);
    };
    
    ObterAgenciaPorCodigo(codigo: string): Observable<Agencia>{
      return this.httpClient.get<Agencia>(environment.url_contas_receber + "/Conta/ObterAgenciaPorCodigo/" + codigo);
    }

    ObterTodosAgencia(): Observable<Agencia[]> {
      return this.httpClient.get<Agencia[]>(environment.url_contas_receber + "/Conta/ObterTodosAgencia");
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
      return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(): Observable<Empresa[]> {
      return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
    }

    obterTodosBanco(): Observable<Banco[]> {
      return this.httpClient.get<Banco[]>(environment.url_contas_receber + "/Conta/ObterTodosBanco");
    }
    
    obterTodosLocalidade(): Observable<Localidade[]> {
      return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
    }

    obterDadosCep(cep): Observable<Cep[]> {
      return this.httpClient.get<Cep[]>(environment.url_contas_receber + "//cepapi.delivoro.com.br/${cep}");        
    }

    obterLocalidadePorDesc(desc: string): Observable<Localidade> {
      return this.httpClient.get<Localidade>(environment.url_contas_receber + "/Localidade/ObterLocalidadePorDesc/" + desc);
    };

    obterUfPorDesc(desc: string): Observable<Uf> {
      return this.httpClient.get<Uf>(environment.url_contas_receber + "/Conta/ObterUfId/" + desc);
    };

    obterTipoLogradouroPorDesc(desc: string): Observable<TipoLogradouro> {
      return this.httpClient.get<TipoLogradouro>(environment.url_contas_receber + "/TipoLogradouro/ObterTipoLogradouroPorDesc/" + desc);
    };

    obterPaisPorDesc(desc: string): Observable<Pais> {
      return this.httpClient.get<Pais>(environment.url_contas_receber + "/Pais/ObterPaisPorDesc/" + desc);
    };


    AdicionarAgencia(agencia: Agencia): Observable<Agencia> {
      return this.httpClient.post<Agencia>(environment.url_contas_receber + "/Conta/AdicionarAgencia",agencia);
    };


    AtualizarAgencia(agencia: Agencia): Observable<Agencia> {
      return this.httpClient.post<Agencia>(environment.url_contas_receber + "/Conta/AtualizarAgencia",agencia);
    };

    RemoverAgencia(agencia: Agencia): Observable<Agencia> {
      return this.httpClient.post<Agencia>(environment.url_contas_receber + "/Conta/RemoverAgencia",agencia);
    };

    ReativarAgencia(agencia: Agencia): Observable<Agencia> {
      return this.httpClient.post<Agencia>(environment.url_contas_receber + "/Conta/ReativarAgencia",agencia);
    };

    obterLocalidade(): Observable<Localidade[]> {
      return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
    }
  
    obterLocalidadePorUf(id: string): Observable<Localidade[]> {
      return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterLocalidadesPorId/" + id);
    }
  
    obterTodosUf(): Observable<Uf[]> {
      return this.httpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
    }
  
    obterTodosPais() {
      return this.httpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
    }
  
    obterTodosTipoLogradouro(): Observable<TipoLogradouro[]> {
      return this.httpClient.get<TipoLogradouro[]>(environment.url_contas_receber + "/TipoLogradouro/ObterTodosTipoLogradouro");
    }
  
    obterTodosLocalidadeEndereco(): Observable<Localidade[]> {
      return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
    }
  
    obterTodosUfEndereco(): Observable<Uf[]> {
      return this.httpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
    }
  
    obterTodosPaisEndereco(): Observable<Pais[]> {
      return this.httpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
    }
  
    obterLocalidadeId(desc: string): Observable<Localidade> {
      return this.httpClient.get<Localidade>(environment.url_contas_receber + "/Localidade/ObterLocalidadePorDesc/" + desc);
    };
  
    obterUfId(desc: string): Observable<Uf> {
      return this.httpClient.get<Uf>(environment.url_contas_receber + "/Uf/ObterUfPorDesc/" + desc);
    };
  
    obterTipoLogradouroId(desc: string): Observable<TipoLogradouro> {
      return this.httpClient.get<TipoLogradouro>(environment.url_contas_receber + "/TipoLogradouro/ObterTipoLogradouroPorDesc/" + desc);
    };
  
    obterPaisId(desc: string): Observable<Pais> {
      return this.httpClient.get<Pais>(environment.url_contas_receber + "/Pais/ObterPaisPorDesc/" + desc);
    };

    obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
      return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  };
}


