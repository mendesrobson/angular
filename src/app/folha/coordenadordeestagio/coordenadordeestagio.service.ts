import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { CoordenadorDeEstagio } from './models/coordenadordeestagio';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { invoke } from 'q';


@Injectable()
export class CoordenadorDeEstagioService {

    constructor(private httpClient: HttpClient) {}

    ObterCoordenadorDeEstagio(id:string):Observable<CoordenadorDeEstagio>{

        return this.httpClient.get<CoordenadorDeEstagio>(environment.url_folha + "/CoordenadorDeEstagio/" + id);
    };

    obterTodosCoordenadorDeEstagio() : Observable<CoordenadorDeEstagio[]>{

        return this.httpClient.get<CoordenadorDeEstagio[]>(environment.url_folha + "/CoordenadorDeEstagio/")
    }

    adicionarCoordenadorDeEstagio(coordenadorDeEstagio: CoordenadorDeEstagio): Observable<CoordenadorDeEstagio> {
        return this.httpClient.post<CoordenadorDeEstagio>(environment.url_folha + "/CoordenadorDeEstagio/", coordenadorDeEstagio);
    };

    atualizarCoordenadorDeEstagio(coordenadorDeEstagio: CoordenadorDeEstagio): Observable<CoordenadorDeEstagio> {
        return this.httpClient.put<CoordenadorDeEstagio>(environment.url_folha + "/CoordenadorDeEstagio/", coordenadorDeEstagio);
    };

    removerCoordenadorDeEstagio(coordenadorDeEstagio: CoordenadorDeEstagio): Observable<CoordenadorDeEstagio> {
        return this.httpClient.put<CoordenadorDeEstagio>(environment.url_folha + "/CoordenadorDeEstagio/Remove/", coordenadorDeEstagio);
    };

    reativarCoordenadorDeEstagio(coordenadorDeEstagio: CoordenadorDeEstagio): Observable<CoordenadorDeEstagio> {
        return this.httpClient.put<CoordenadorDeEstagio>(environment.url_folha + "/CoordenadorDeEstagio/Reactive/", coordenadorDeEstagio);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };
   
}
