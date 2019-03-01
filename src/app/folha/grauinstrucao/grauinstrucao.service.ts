import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GrauInstrucao } from './models/grauinstrucao';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';


@Injectable()
export class GrauInstrucaoService {

    constructor(private httpClient: HttpClient) { }

    obterGrauInstrucao(id: string): Observable<GrauInstrucao> {
        return this.httpClient.get<GrauInstrucao>(environment.url_folha + "/GrauInstrucao/" + id);
    };

    obterTodosGrauInstrucao(): Observable<GrauInstrucao[]> {
        return this.httpClient.get<GrauInstrucao[]>(environment.url_folha + "/GrauInstrucao/");
    };

    adicionarGrauInstrucao(grauInstrucao: GrauInstrucao): Observable<GrauInstrucao> {
        return this.httpClient.post<GrauInstrucao>(environment.url_folha + "/GrauInstrucao/", grauInstrucao);
    };

    atualizarGrauInstrucao(grauInstrucao: GrauInstrucao): Observable<GrauInstrucao> {
        return this.httpClient.put<GrauInstrucao>(environment.url_folha + "/GrauInstrucao/", grauInstrucao);
    };

    removerGrauInstrucao(grauInstrucao: GrauInstrucao): Observable<GrauInstrucao> {
        return this.httpClient.put<GrauInstrucao>(environment.url_folha + "/GrauInstrucao/Remove/", grauInstrucao);
    };

    reativarGrauInstrucao(grauInstrucao: GrauInstrucao): Observable<GrauInstrucao> {
        return this.httpClient.put<GrauInstrucao>(environment.url_folha + "/GrauInstrucao/Reactive/", grauInstrucao);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
      return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(): Observable<Empresa[]> {
      return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
    };
    
}
