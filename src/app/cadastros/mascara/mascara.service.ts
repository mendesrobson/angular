import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Mascara, SeparadorNivel, GravaOrAdiciona, MascaraNivel, Tarefa } from './models/mascara';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MascaraService {

  constructor(private httpClient: HttpClient) { }

  obterMascara(id: string): Observable<Mascara> {
    return this.httpClient.get<Mascara>(environment.url_contas_receber + "/Mascara/ObterMascaraPorId/" + id);
  };

  ObterTodosMascara(): Observable<Mascara[]> {
    return this.httpClient.get<Mascara[]>(environment.url_contas_receber + "/Mascara/ObterTodos");
  };

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  }

  obterTodosTarefa(): Observable<Tarefa[]> {
    return this.httpClient.get<Tarefa[]>(environment.url_contas_receber + "/Mascara/ObterTodosTarefa");
  }

  ObterCodigoMascara(codigo: string): Observable<Mascara> {
    return this.httpClient.get<Mascara>(environment.url_contas_receber + "/Mascara/ObterCodigoMascara/" + codigo);
  };

  obterMascaraPorId(id: string): Observable<Mascara> {
    return this.httpClient.get<Mascara>(environment.url_contas_receber + "/Mascara/ObterMascaraPorId/" + id);
  };

  obterMascaraNivelPorMascaraId(id: string): Observable<MascaraNivel> {
    return this.httpClient.get<MascaraNivel>(environment.url_contas_receber + "/Mascara/ObterMascaraNivelPorMascaraId/" + id);
  };

  AdicionarMascara(mascara: Mascara): Observable<Mascara> {
    return this.httpClient.post<Mascara>(environment.url_contas_receber + "/Mascara/Adicionar", mascara);
  };


  AtualizarMascara(mascara: Mascara): Observable<Mascara> {
    return this.httpClient.post<Mascara>(environment.url_contas_receber + "/Mascara/Atualizar", mascara);
  };

  RemoverMascara(mascara: Mascara): Observable<Mascara> {
    return this.httpClient.post<Mascara>(environment.url_contas_receber + "/Mascara/Remover", mascara);
  };

  ReativarMascara(mascara: Mascara): Observable<Mascara> {
    return this.httpClient.post<Mascara>(environment.url_contas_receber +"/Mascara/Reative", mascara);
  };

  getSeparadorNivel() {
    return this.httpClient.get<SeparadorNivel[]>('assets/dados/separadornivel.json');
  };

  getGravaOrAdiciona() {
    return this.httpClient.get<GravaOrAdiciona[]>('assets/dados/gravaoradiciona.json');
  }  

  obterMascaraPorEmpresaIdTarefaId(empresaId: number, tarefaId: number): Observable<Mascara>{
    return this.httpClient.get<Mascara>(environment.url_contas_receber + "/Mascara/ObterMascaraPorEmpresaIdTarefaId/" + empresaId + "&" + tarefaId);
  }
}