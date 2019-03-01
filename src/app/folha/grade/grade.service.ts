import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Grade } from './models/grade';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { TipoJornada } from '../tipojornada/models/tipojornada';
import { Apontamento, Calendario } from '../grade/models/apontamento';


@Injectable()
export class GradeService {

  constructor(private httpClient: HttpClient) { }

  obterGrade(id: string): Observable<Grade> {
    return this.httpClient.get<Grade>(environment.url_folha + "/Grade/" + id);//ObterPorIdGrade/
  }

  ObterTodosGrade(): Observable<Grade[]> {
    return this.httpClient.get<Grade[]>(environment.url_folha + "/Grade");//ObterTodosGrade
  }

  AdicionarGrade(grade: Grade): Observable<Grade> {
    return this.httpClient.post<Grade>(environment.url_folha + "/Grade/AdicionarGrade", Grade);
  }

  AtualizarGrade(grade: Grade): Observable<Grade> {
    return this.httpClient.post<Grade>(environment.url_folha + "/Grade/AtualizarGrade", Grade);
  }

  RemoverGrade(grade: Grade): Observable<Grade> {
    return this.httpClient.post<Grade>(environment.url_folha + "/Grade/RemoverGrade", Grade);
  }

  ReativarGrade(grade: Grade): Observable<Grade> {
    return this.httpClient.post<Grade>(environment.url_folha + "/Grade/ReativarGrade", Grade);
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }
  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  }

  obterTipoJornadas(): Observable<TipoJornada[]> {
    return this.httpClient.get<TipoJornada[]>(environment.url_folha + "/TipoJornada/ObterTiposJornadas");
  }
  ObterApontamentos(calendario: Calendario, diaSemana: number): Apontamento[] {
    return this.DataCalendario(calendario, diaSemana);
  }

  ObterApontamentosInicioFim(calendario: Calendario, diaSemana: number): Apontamento[] {
    return this.DataCalendarioInicioFim(calendario, diaSemana);
  }

  ObterTodosApontamentos(): Apontamento[] {
    return apontamento;
  }

  private DataCalendario(calendario: Calendario, diaSemana: number): Apontamento[] {

    let dataFixa = new Date(2018, 6, diaSemana);
    var ArrayHorasInicio = calendario.horarioFim;  // calendario.horarioInicio.toString().split(':');
    console.log(ArrayHorasInicio);
    var ArrayHorasFim = calendario.horarioFim.toString().split(':');
    var ArrayHorasInterInicio = calendario.intervaloInicio.toString().split(':');
    var ArrayHorasInterFim = calendario.intervaloFim.toString().split(':');

    apontamento.push({
      text: "Horário de Trabalho",
      startDate: new Date(dataFixa.getFullYear(), dataFixa.getMonth(), dataFixa.getDate(), parseInt(ArrayHorasInicio[0]), parseInt(ArrayHorasInicio[1])),
      endDate: new Date(dataFixa.getFullYear(), dataFixa.getMonth(), dataFixa.getDate(), parseInt(ArrayHorasInterInicio[0]), parseInt(ArrayHorasInterInicio[1])),
    });

    apontamento.push({
      text: "Intervalo",
      startDate: new Date(dataFixa.getFullYear(), dataFixa.getMonth(), dataFixa.getDate(), parseInt(ArrayHorasInterInicio[0]), parseInt(ArrayHorasInterInicio[1])),
      endDate: new Date(dataFixa.getFullYear(), dataFixa.getMonth(), dataFixa.getDate(), parseInt(ArrayHorasInterFim[0]), parseInt(ArrayHorasInterFim[1]))
    });

    apontamento.push({
      text: "Horário de Trabalho",
      startDate: new Date(dataFixa.getFullYear(), dataFixa.getMonth(), dataFixa.getDate(), parseInt(ArrayHorasInterFim[0]), parseInt(ArrayHorasInterFim[1])),
      endDate: new Date(dataFixa.getFullYear(), dataFixa.getMonth(), dataFixa.getDate(), parseInt(ArrayHorasFim[0]), parseInt(ArrayHorasFim[1]))
    });

    return apontamento;
  }
  private DataCalendarioInicioFim(calendario: Calendario, diaSemana: number): Apontamento[] {

    let dataFixa = new Date(2018, 6, diaSemana);
    var ArrayHorasInicio = calendario.horarioInicio.toString().split(':');
    var ArrayHorasFim = calendario.horarioFim.toString().split(':');

    apontamento.push({
      text: "Horário de Trabalho",
      startDate: new Date(dataFixa.getFullYear(), dataFixa.getMonth(), dataFixa.getDate(), parseInt(ArrayHorasInicio[0]), parseInt(ArrayHorasInicio[1])),
      endDate: new Date(dataFixa.getFullYear(), dataFixa.getMonth(), dataFixa.getDate(), parseInt(ArrayHorasFim[0]), parseInt(ArrayHorasFim[1])),
    });

    return apontamento;
  }
}

let apontamento: Apontamento[] = [
  {
    text: "robson Teste",
    startDate: new Date(2018, 6, 15, 8, 0),
    endDate: new Date(2018, 6, 15, 9, 0)
  }
];