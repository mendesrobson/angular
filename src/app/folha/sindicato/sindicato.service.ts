import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { Sindicato, Localidade, TipoLogradouro, TipoEndereco, Uf, Pais, TipoEntidade, TipoSindicato, Cnpj, SindicatoCargo, Cargo, SindicatoConvencao, Convencao, DiretoriaSindical, BaseTerritorialSindicato } from './models/sindicato';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { invoke } from 'q';


@Injectable()
export class SindicatoService {

    constructor(private httpClient: HttpClient) { }

    obterSindicato(id: string): Observable<Sindicato> {
        return this.httpClient.get<Sindicato>(environment.url_folha + "/Sindicato/" + id);
    };

    obterTodosSindicato(): Observable<Sindicato[]> {
        return this.httpClient.get<Sindicato[]>(environment.url_folha + "/Sindicato/")
    }

    adicionarSindicato(sindicato: Sindicato): Observable<Sindicato> {
        return this.httpClient.post<Sindicato>(environment.url_folha + "/Sindicato/", sindicato);
    };

    atualizarSindicato(sindicato: Sindicato): Observable<Sindicato> {
        return this.httpClient.put<Sindicato>(environment.url_folha + "/Sindicato/", sindicato);
    };

    removerSindicato(sindicato: Sindicato): Observable<Sindicato> {
        return this.httpClient.put<Sindicato>(environment.url_folha + "/Sindicato/Remove/", sindicato);
    };

    reativarSindicato(sindicato: Sindicato): Observable<Sindicato> {
        return this.httpClient.put<Sindicato>(environment.url_folha + "/Sindicato/Reactive/", sindicato);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };

    obterTodosLocalidade(): Observable<Localidade[]> {
        return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
    }

    obterTodosTipoLogradouro(): Observable<TipoLogradouro[]> {
        return this.httpClient.get<TipoLogradouro[]>(environment.url_contas_receber + "/TipoLogradouro/ObterTodosTipoLogradouro")
    }

    obterTodosTipoEndereco(): Observable<TipoEndereco[]> {
        return this.httpClient.get<TipoEndereco[]>(environment.url_contas_receber + "/TipoEndereco/ObterTodosTipoEndereco");
    }

    obterTodosUf(): Observable<Uf[]> {
        return this.httpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
    };

    obterTodosPais(): Observable<Pais[]> {
        return this.httpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
    };

    getTipoEntidade() {
        return this.httpClient.get<TipoEntidade[]>('assets/dados/tipoentidade.json');
    };

    getTipoSindicato() {
        return this.httpClient.get<TipoSindicato[]>('assets/dados/tiposindicato.json');
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

    excluirSindicatoCargo(id: string): Observable<SindicatoCargo> {
        return this.httpClient.delete<SindicatoCargo>(environment.url_folha + "/SindicatoCargo/" + id);
    };

    obterTodosSindicatoCargos() {
        return this.httpClient.get<SindicatoCargo[]>(environment.url_folha + "/SindicatoCargo"); 
    };

    obterTodosCargo(): Observable<Cargo[]> {
        return this.httpClient.get<Cargo[]>(environment.url_folha + "/Cargo/");
    };

    adicionarSindicatoCargo(sindicatoCargo: SindicatoCargo): Observable<SindicatoCargo> {
        return this.httpClient.post<SindicatoCargo>(environment.url_folha + "/SindicatoCargo/", sindicatoCargo);
    };

    obterTodosConvencao(): Observable<Convencao[]> {
        return this.httpClient.get<Convencao[]>(environment.url_folha + "/Convencao/");
    }

    excluirSindicatoConvencao(id: string): Observable<SindicatoConvencao> {
        return this.httpClient.delete<SindicatoConvencao>(environment.url_folha + "/SindicatoConvencao/" + id);
    }

    adicionarSindicatoConvencao(sindicatoConvencao: SindicatoConvencao): Observable<SindicatoConvencao> {
        return this.httpClient.post<SindicatoConvencao>(environment.url_folha + "/SindicatoConvencao/", sindicatoConvencao);
    }

    atualizarSindicatoConvencao(sindicatoConvencao: SindicatoConvencao): Observable<SindicatoConvencao> {
        return this.httpClient.put<SindicatoConvencao>(environment.url_folha + "/SindicatoConvencao/", sindicatoConvencao);
    }


    obterTodosDiretoriaSindical(): Observable<DiretoriaSindical[]> {
        return this.httpClient.get<DiretoriaSindical[]>(environment.url_folha + "/DiretoriaSindical");
    };

    obterDiretoriaSindical(id: string): Observable<DiretoriaSindical> {
        return this.httpClient.get<DiretoriaSindical>(environment.url_folha + "/DiretoriaSindical/" + id);
    };

    adicionarDiretoriaSindical(diretoriaSindical: DiretoriaSindical): Observable<DiretoriaSindical> {
        return this.httpClient.post<DiretoriaSindical>(environment.url_folha + "/DiretoriaSindical/", diretoriaSindical);
    };

    reativarDiretoriaSindical(diretoriaSindical: DiretoriaSindical): Observable<DiretoriaSindical> {
        return this.httpClient.put<DiretoriaSindical>(environment.url_folha + "/DiretoriaSindical/Reactive/", diretoriaSindical);
    };

    removerDiretoriaSindical(diretoriaSindical: DiretoriaSindical): Observable<DiretoriaSindical> {
        return this.httpClient.put<DiretoriaSindical>(environment.url_folha + "/DiretoriaSindical/Remove/", diretoriaSindical);
    };

    atualizarDiretoriaSindical(diretoriaSindical: DiretoriaSindical): Observable<DiretoriaSindical> {
        return this.httpClient.put<DiretoriaSindical>(environment.url_folha + "/DiretoriaSindical/", diretoriaSindical);
    };

    excluirDiretoriaSindical(id: string): Observable<DiretoriaSindical> {
        return this.httpClient.delete<DiretoriaSindical>(environment.url_folha + "/DiretoriaSindical/" + id);
    }


    adicionarBaseTerritorialSindicato(baseTerritorialSindicato: BaseTerritorialSindicato): Observable<BaseTerritorialSindicato> {
        return this.httpClient.post<BaseTerritorialSindicato>(environment.url_folha + "/BaseTerritorialSindicato/", baseTerritorialSindicato);
    }

    atualizarBaseTerritorialSindicato(baseTerritorialSindicato: BaseTerritorialSindicato): Observable<BaseTerritorialSindicato> {
        return this.httpClient.put<BaseTerritorialSindicato>(environment.url_folha + "/BaseTerritorialSindicato/", baseTerritorialSindicato);
    }

    excluirBaseTerritorialSindicato(id: string): Observable<BaseTerritorialSindicato> {
        return this.httpClient.delete<BaseTerritorialSindicato>(environment.url_folha + "/BaseTerritorialSindicato/" + id);
    }

    obterTodosBaseTerritorialSindicato(): Observable<BaseTerritorialSindicato[]> {
        return this.httpClient.get<BaseTerritorialSindicato[]>(environment.url_folha + "/BaseTerritorialSindicato/");
    }

    obterTodosLocalidades(id: string): Observable<Localidade[]> {
        return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterLocalidadesPorId/" + id);
    }

    obterTodosSindicatoCargoPorSindicatoId(id: string): Observable<SindicatoCargo[]>{
        return this.httpClient.get<SindicatoCargo[]>(environment.url_folha + "/SindicatoCargo/ObterTodosPorSindicatoId/" + id);
    }

    obterTodosDiretoriaSindicalPorSindicatoId(id: string): Observable<DiretoriaSindical[]>{
        return this.httpClient.get<DiretoriaSindical[]>(environment.url_folha + "/DiretoriaSindical/ObterTodosPorSindicatoId/" + id);
    }

    obterTodosSindicatoConvencaoPorSindicatoId(id: string): Observable<SindicatoConvencao[]>{
        return this.httpClient.get<SindicatoConvencao[]>(environment.url_folha + "/SindicatoConvencao/ObterTodosPorSindicatoId/" + id);
    }

    obterTodosBaseTerritorialSindicatoPorSindicatoId(id: string): Observable<BaseTerritorialSindicato[]>{
        return this.httpClient.get<BaseTerritorialSindicato[]>(environment.url_folha + "/BaseTerritorialSindicato/ObterTodosPorSindicatoId/" + id);
    }

}
