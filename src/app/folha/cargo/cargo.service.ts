import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Cargo, CargoCbo } from './models/cargo';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { Cbo } from '../cbo/models/cbo';

@Injectable()
export class CargoService {

    constructor(private httpClient: HttpClient) { }
    
    obterCargo(id: string): Observable<Cargo> {
        return this.httpClient.get<Cargo>(environment.url_folha + "/Cargo/" + id);
    };
    
    obterTodosCargo(): Observable<Cargo[]> {
        return this.httpClient.get<Cargo[]>(environment.url_folha + "/Cargo/");
    };

    adicionarCargo(cargo: Cargo): Observable<Cargo> {
        return  this.httpClient.post<Cargo>(environment.url_folha + "/Cargo/", cargo);
    };

    atualizarCargo(cargo: Cargo): Observable<Cargo> {
        return  this.httpClient.put<Cargo>(environment.url_folha + "/Cargo/", cargo);
    };

    removerCargo(cargo: Cargo): Observable<Cargo> {
        return  this.httpClient.put<Cargo>(environment.url_folha + "/Cargo/Remove/", cargo);
    };

    reativarCargo(cargo: Cargo): Observable<Cargo> {
        return  this.httpClient.put<Cargo>(environment.url_folha + "/Cargo/Reactive/", cargo);
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
      return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };
    
    obterTodosEmpresa(): Observable<Empresa[]> {
      return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
    };

    removerCargoCbo(cargoCbo: CargoCbo): Observable<CargoCbo> {
        return  this.httpClient.post<CargoCbo>(environment.url_folha + "/CargoCbo/Remove/", cargoCbo);
    };

    excluirCargoCbo(id: string): Observable<CargoCbo> {
        return this.httpClient.delete<CargoCbo>(environment.url_folha + "/CargoCbo/" + id);
    };

    atualizarCargoCbo(cargoCbo: CargoCbo): Observable<CargoCbo> {
        return  this.httpClient.put<CargoCbo>(environment.url_folha + "/CargoCbo/", cargoCbo);
    };

    adicionarCargoCbo(cargoCbo: CargoCbo): Observable<CargoCbo> {
        return  this.httpClient.post<CargoCbo>(environment.url_folha + "/CargoCbo/", cargoCbo);
    };

    obterTodosCbo(): Observable<Cbo[]> {
        return this.httpClient.get<Cbo[]>(environment.url_folha + "/Cbo/");
    };

    obterTodosCargoCboPorCargoId(id: string): Observable<CargoCbo[]> {
        return this.httpClient.get<CargoCbo[]>(environment.url_folha + "/CargoCbo/ObterTodosPorCargoId/" + id);
    };

}
