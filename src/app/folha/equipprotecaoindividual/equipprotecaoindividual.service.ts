import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EquipProtecaoIndividual } from './models/equipprotecaoindividual';
import { environment } from '../../../environments/environment';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EquipprotecaoindividualService {
    constructor(private httpClient: HttpClient) { }

    obterEquipprotecaoindividualPorId(id: string): Observable<EquipProtecaoIndividual> {
        return this.httpClient.get<EquipProtecaoIndividual>(environment.url_folha + "/EquipProtecaoIndividual/" + id);
    }

    obterTodosEquipprotecaoindividual(): Observable<EquipProtecaoIndividual[]> {
        return this.httpClient.get<EquipProtecaoIndividual[]>(environment.url_folha + "/EquipProtecaoIndividual/");
    }

    adicionarEquipprotecaoindividual(Equipprotecaoindividual: EquipProtecaoIndividual): Observable<EquipProtecaoIndividual> {
        return this.httpClient.post<EquipProtecaoIndividual>(environment.url_folha + "/EquipProtecaoIndividual/", Equipprotecaoindividual);
    }

    atualizarEquipprotecaoindividual(Equipprotecaoindividual: EquipProtecaoIndividual): Observable<EquipProtecaoIndividual> {
        return this.httpClient.put<EquipProtecaoIndividual>(environment.url_folha + "/EquipProtecaoIndividual/", Equipprotecaoindividual);
    }

    removerEquipprotecaoindividual(Equipprotecaoindividual: EquipProtecaoIndividual): Observable<EquipProtecaoIndividual> {
        return this.httpClient.put<EquipProtecaoIndividual>(environment.url_folha + "/EquipProtecaoIndividual/Remove/", Equipprotecaoindividual);
    }

    reativarEquipprotecaoindividual(Equipprotecaoindividual: EquipProtecaoIndividual): Observable<EquipProtecaoIndividual> {
        return this.httpClient.put<EquipProtecaoIndividual>(environment.url_folha + "/EquipProtecaoIndividual/Reactive/", Equipprotecaoindividual);
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }
}