import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { NaturezaLesao } from './models/naturezalesao';

@Injectable()
export class NaturezaLesaoService {

    constructor(private httpClient: HttpClient) { }

    obterNaturezaLesao(id: string): Observable<NaturezaLesao> {
        return this.httpClient.get<NaturezaLesao>(environment.url_folha + "/NaturezaLesao/" + id);
    }

    ObterTodosNaturezaLesao(): Observable<NaturezaLesao[]> {
        return this.httpClient.get<NaturezaLesao[]>(environment.url_folha + "/NaturezaLesao/");
    }

    AdicionarNaturezaLesao(naturezaLesao: NaturezaLesao): Observable<NaturezaLesao> {
        return this.httpClient.post<NaturezaLesao>(environment.url_folha + "/NaturezaLesao/", naturezaLesao);
    }

    AtualizarNaturezaLesao(naturezaLesao: NaturezaLesao): Observable<NaturezaLesao> {
        return this.httpClient.put<NaturezaLesao>(environment.url_folha + "/NaturezaLesao/", naturezaLesao);
    }

    RemoverNaturezaLesao(naturezaLesao: NaturezaLesao): Observable<NaturezaLesao> {
        return this.httpClient.put<NaturezaLesao>(environment.url_folha + "/NaturezaLesao/Remove/", naturezaLesao);
    }

    ReativarNaturezaLesao(naturezaLesao: NaturezaLesao): Observable<NaturezaLesao> {
        return this.httpClient.put<NaturezaLesao>(environment.url_folha + "/NaturezaLesao/Reactive/", naturezaLesao);
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }

}
