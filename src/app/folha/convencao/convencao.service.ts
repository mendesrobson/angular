import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Convencao, TipoConvencao } from './models/convencao';
import { environment } from '../../../environments/environment';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConvencaoService {
    constructor(private httpClient: HttpClient) { }

    obterConvencao(id: string): Observable<Convencao> {
        return this.httpClient.get<Convencao>(environment.url_folha + "/Convencao/" + id);
    }

    obterTodosConvencao(): Observable<Convencao[]> {
        return this.httpClient.get<Convencao[]>(environment.url_folha + "/Convencao/");
    }

    adicionarConvencao(convencao: Convencao): Observable<Convencao> {
        return this.httpClient.post<Convencao>(environment.url_folha + "/Convencao/", convencao);
    }

    atualizarConvencao(Convencao: Convencao): Observable<Convencao> {
        return this.httpClient.put<Convencao>(environment.url_folha + "/Convencao/", Convencao);
    }

    removerConvencao(convencao: Convencao): Observable<Convencao> {
        return this.httpClient.put<Convencao>(environment.url_folha + "/Convencao/Remove/", convencao);
    }

    reativarConvencao(convencao: Convencao): Observable<Convencao> {
        return this.httpClient.put<Convencao>(environment.url_folha + "/Convencao/Reactive/", convencao);
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }
    getTipoConvencao() {
        return this.httpClient.get<TipoConvencao[]>('assets/dados/tipoconvencao.json');
    };

}