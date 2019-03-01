import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { AgenteIntegrador, Localidade, Uf, TipoLogradouro, Pais } from './models/agenteintegrador';
import { Cnpj } from '../../cadastros/pessoa/models/pessoa';


@Injectable()
export class AgenteintegradorService {

    constructor(private httpClient: HttpClient) { }

    obterAgenteIntegrador(id: string): Observable<AgenteIntegrador> {
        return this.httpClient.get<AgenteIntegrador>(environment.url_folha + "/AgenteIntegrador/" + id);
    };

    obterTodosAgenteIntegrador(): Observable<AgenteIntegrador[]> {
        return this.httpClient.get<AgenteIntegrador[]>(environment.url_folha + "/AgenteIntegrador/");
    };

    adicionarAgenteIntegrador(agenteIntegrador: AgenteIntegrador): Observable<AgenteIntegrador> {
        return this.httpClient.post<AgenteIntegrador>(environment.url_folha + "/AgenteIntegrador/", agenteIntegrador);
    };

    atualizarAgenteIntegrador(agenteIntegrador: AgenteIntegrador): Observable<AgenteIntegrador> {
        return this.httpClient.put<AgenteIntegrador>(environment.url_folha + "/AgenteIntegrador/", agenteIntegrador);
    };

    removerAgenteIntegrador(agenteIntegrador: AgenteIntegrador): Observable<AgenteIntegrador> {
        return this.httpClient.put<AgenteIntegrador>(environment.url_folha + "/AgenteIntegrador/Remove/", agenteIntegrador);
    };

    reativarAgenteIntegrador(agenteIntegrador: AgenteIntegrador): Observable<AgenteIntegrador> {
        return this.httpClient.put<AgenteIntegrador>(environment.url_folha + "/AgenteIntegrador/Reactive/", agenteIntegrador);
    };

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
