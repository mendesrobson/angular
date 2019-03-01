import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Departamento } from './models/departamento';
import { environment } from '../../../environments/environment';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DepartamentoService {
    constructor(private httpClient: HttpClient) { }

    obterDepartamentoPorId(id: string): Observable<Departamento> {
        return this.httpClient.get<Departamento>(environment.url_folha + "/Departamento/" + id);
    }

    obterTodosDepartamento(): Observable<Departamento[]> {
        return this.httpClient.get<Departamento[]>(environment.url_folha + "/Departamento/");
    }

    adicionarDepartamento(Departamento: Departamento): Observable<Departamento> {
        return this.httpClient.post<Departamento>(environment.url_folha + "/Departamento/", Departamento);
    }

    atualizarDepartamento(Departamento: Departamento): Observable<Departamento> {
        return this.httpClient.put<Departamento>(environment.url_folha + "/Departamento/", Departamento);
    }

    removerDepartamento(Departamento: Departamento): Observable<Departamento> {
        return this.httpClient.put<Departamento>(environment.url_folha + "/Departamento/Remove/", Departamento);
    }

    reativarDepartamento(Departamento: Departamento): Observable<Departamento> {
        return this.httpClient.put<Departamento>(environment.url_folha + "/Departamento/Reactive/", Departamento);
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }
}