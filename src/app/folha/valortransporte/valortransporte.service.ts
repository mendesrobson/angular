import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValorTransporte, TipoTransporte } from './models/valortransporte';
import { environment } from '../../../environments/environment';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ValortransporteService {
    constructor(private httpClient: HttpClient) { }

    obterValortransportePorId(id: string): Observable<ValorTransporte> {
        return this.httpClient.get<ValorTransporte>(environment.url_folha + "/ValorTransporte/" + id);
    }

    obterTodosValortransporte(): Observable<ValorTransporte[]> {
        return this.httpClient.get<ValorTransporte[]>(environment.url_folha + "/ValorTransporte/");
    }

    adicionarValortransporte(valortransporte: ValorTransporte): Observable<ValorTransporte> {
        return this.httpClient.post<ValorTransporte>(environment.url_folha + "/ValorTransporte/", valortransporte);
    }

    atualizarValortransporte(valortransporte: ValorTransporte): Observable<ValorTransporte> {
        return this.httpClient.put<ValorTransporte>(environment.url_folha + "/ValorTransporte/", valortransporte);
    }

    removerValortransporte(valortransporte: ValorTransporte): Observable<ValorTransporte> {
        return this.httpClient.put<ValorTransporte>(environment.url_folha + "/ValorTransporte/Remove/", valortransporte);
    }

    reativarValortransporte(valortransporte: ValorTransporte): Observable<ValorTransporte> {
        return this.httpClient.put<ValorTransporte>(environment.url_folha + "/ValorTransporte/Reactive/", valortransporte);
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }

    getTipotransporte() {
        return this.httpClient.get<TipoTransporte[]>('assets/dados/tipotransporte.json');
    };
}