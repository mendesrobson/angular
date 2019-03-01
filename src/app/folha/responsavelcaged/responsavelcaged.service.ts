import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { ResponsavelCaged, TipoPessoa, TipoLogradouro, TipoEndereco, Localidade, Uf, Pais, Cnpj } from './models/responsavelcaged';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { invoke } from 'q';


@Injectable()
export class ResponsavelCagedService {

    constructor(private httpClient: HttpClient) {}

    obterResponsavelCaged(id:string):Observable<ResponsavelCaged>{

        return this.httpClient.get<ResponsavelCaged>(environment.url_folha + "/ResponsavelCaged/" + id);
    };

    obterTodosResponsavelCaged() : Observable<ResponsavelCaged[]>{

        return this.httpClient.get<ResponsavelCaged[]>(environment.url_folha + "/ResponsavelCaged/")
    }

    adicionarResponsavelCaged(responsavelCaged: ResponsavelCaged): Observable<ResponsavelCaged> {
        return this.httpClient.post<ResponsavelCaged>(environment.url_folha + "/ResponsavelCaged/", responsavelCaged);
    };

    atualizarResponsavelCaged(responsavelCaged: ResponsavelCaged): Observable<ResponsavelCaged> {
        return this.httpClient.put<ResponsavelCaged>(environment.url_folha + "/ResponsavelCaged/", responsavelCaged);
    };

    removerResponsavelCaged(responsavelCaged: ResponsavelCaged): Observable<ResponsavelCaged> {
        return this.httpClient.put<ResponsavelCaged>(environment.url_folha + "/ResponsavelCaged/Remove/", responsavelCaged);
    };

    reativarResponsavelCaged(responsavelCaged: ResponsavelCaged): Observable<ResponsavelCaged> {
        return this.httpClient.put<ResponsavelCaged>(environment.url_folha + "/ResponsavelCaged/Reactive/", responsavelCaged);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };

    obterTodosTipoPessoa():Observable<TipoPessoa[]>{
        return this.httpClient.get<TipoPessoa[]>(environment.url_contas_receber + "/Pessoa/ObterTodosTipoPessoa");
    }

    obterTodosTipoLogradouro():Observable<TipoLogradouro[]>{
        return this.httpClient.get<TipoLogradouro[]>(environment.url_contas_receber + "/TipoLogradouro/ObterTodosTipoLogradouro")
    }

    obterTodosTipoEndereco():Observable<TipoEndereco[]>{
        return this.httpClient.get<TipoEndereco[]>(environment.url_contas_receber + "/TipoEndereco/ObterTodosTipoEndereco");
    }

    obterTodosLocalidade():Observable<Localidade[]>{
        return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
    }

    obterTodosUf():Observable<Uf[]>{
        return this.httpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
    };

    obterTodosPais():Observable<Pais[]>{
        return this.httpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
    };

    obterLocalidadePorDescricao(desc: string): Observable<Localidade> {
        return this.httpClient.get<Localidade>(environment.url_contas_receber + "/Localidade/ObterLocalidadePorDesc/" + desc);
      };
      
    obterUfPorDescricao(desc: string): Observable<Uf> {
    return this.httpClient.get<Uf>(environment.url_contas_receber + "/Uf/ObterUfPorDesc/" + desc);
    };

    obterTipoLogradouroPorDescricao(desc: string): Observable<TipoLogradouro> {
    return this.httpClient.get<TipoLogradouro>(environment.url_contas_receber + "/TipoLogradouro/ObterTipoLogradouroPorDesc/" + desc);
    };
   
    obterPaisPorDescricao(desc: string): Observable<Pais> {
    return this.httpClient.get<Pais>(environment.url_contas_receber + "/Pais/ObterPaisPorDesc/" + desc);
    };

    buscarDadosCnpj(id: string): Observable<Cnpj> {
        return this.httpClient.get<Cnpj>(environment.url_contas_receber + "/Pessoa/BuscarDadosCnpj/" + id);
    };
}
