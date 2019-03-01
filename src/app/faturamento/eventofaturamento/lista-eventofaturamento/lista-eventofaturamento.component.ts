import { Component, OnInit } from '@angular/core';
import { EventoFaturamento } from '../models/eventofaturamento';
import { EventoFaturamentoService } from '../eventofaturamento.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-eventofaturamento',
  templateUrl: './lista-eventofaturamento.component.html',
  styleUrls: []
})

export class ListaEventoFaturamentoComponent implements OnInit {

  public eventos: EventoFaturamento[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public eventoFaturamentoService: EventoFaturamentoService,
    private router: Router, private report: ReportService) {
  }

  ngOnInit(): void {
    this.eventoFaturamentoService.obterTodosEventoFaturamento()
      .subscribe(eventos => {
        this.eventos = eventos
        this.data = eventos
      },
        () => this.errors);
  }

  editarEventoFaturamento(id) {
    this.router.navigate(['eventofaturamento/editar/' + id]);
  }

  cadastrarEventoFaturamento() {
    this.router.navigate(['eventofaturamento/adicionar']);
  }

    gerarExcel(model,id?)  {
    this.report.gerarExcel(model, "Evento Faturamento",id);
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Evento Faturamento");
  }

}
