import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { AgenteCausadorAcidente } from './models/agentecausadosacidente';

@Injectable()
export class AgenteCausadorAcidenteService {

    constructor(private httpClient: HttpClient) { }

    obterAgenteCausador(id: string): Observable<AgenteCausadorAcidente> {
        return this.httpClient.get<AgenteCausadorAcidente>(environment.url_folha + "/AgenteCausadorAcidente/" + id);
    }

    ObterTodosAgenteCausador(): Observable<AgenteCausadorAcidente[]> {
        return this.httpClient.get<AgenteCausadorAcidente[]>(environment.url_folha + "/AgenteCausadorAcidente/");
    }

    ObterAgenteCausadorPorCodigo(codigo: string): Observable<AgenteCausadorAcidente>{
        return this.httpClient.get<AgenteCausadorAcidente>(environment.url_folha + "/AgenteCausadorAcidente/ObterPorCodigo/" + codigo);
    }

    AdicionarAgenteCausador(agenteCausadorAcidente: AgenteCausadorAcidente): Observable<AgenteCausadorAcidente> {
        return this.httpClient.post<AgenteCausadorAcidente>(environment.url_folha + "/AgenteCausadorAcidente/", agenteCausadorAcidente);
    }

    AtualizarAgenteCausador(agenteCausadorAcidente: AgenteCausadorAcidente): Observable<AgenteCausadorAcidente> {
        return this.httpClient.put<AgenteCausadorAcidente>(environment.url_folha + "/AgenteCausadorAcidente/", agenteCausadorAcidente);
    }

    RemoverAgenteCausador(agenteCausadorAcidente: AgenteCausadorAcidente): Observable<AgenteCausadorAcidente> {
        return this.httpClient.put<AgenteCausadorAcidente>(environment.url_folha + "/AgenteCausadorAcidente/Remove/", agenteCausadorAcidente);
    }

    ReativarAgenteCausador(agenteCausadorAcidente: AgenteCausadorAcidente): Observable<AgenteCausadorAcidente> {
        return this.httpClient.put<AgenteCausadorAcidente>(environment.url_folha + "/AgenteCausadorAcidente/Reactive/", agenteCausadorAcidente);
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    obterTodosEmpresa(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    }

}