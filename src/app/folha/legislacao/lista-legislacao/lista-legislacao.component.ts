import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Legislacao } from '../models/legislacao';
import { LegislacaoService } from '../legislacao.service';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-legislacao',
  templateUrl: './lista-legislacao.component.html',
  styleUrls: []
})
export class ListaLegislacaoComponent implements OnInit {

  public legislacoes: Legislacao[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public legislacaoService: LegislacaoService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService) {
     this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.legislacaoService.ObterTodosLegislacao()
    .subscribe(legislacoes => {
      this.legislacoes = legislacoes;
      this.data = legislacoes;
    },
      () => this.errors);
  }

  editarLegislacao(id) {
    this.router.navigate(['legislacao/editar/' + id]);
  }

  cadastrarLegislacao() {
    this.router.navigate(['legislacao/adicionar']);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "Legislação", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Legislação");
  }
}
