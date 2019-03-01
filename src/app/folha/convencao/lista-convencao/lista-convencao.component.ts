import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Convencao } from '../models/convencao';
import { ConvencaoService } from './../convencao.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-convencao',
  templateUrl: './lista-convencao.component.html',
  styleUrls: []
})
export class ListaConvencaoComponent implements OnInit {

  public convencao: Convencao[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public convencaoService: ConvencaoService,
    private router: Router, private toastr: ToastsManager,
    vcr: ViewContainerRef, private report: ReportService) { }

  ngOnInit() {
    this.convencaoService.obterTodosConvencao()
    .subscribe(resultado => {
        this.convencao = resultado,
        this.data = resultado; },
      () => this.errors);
  }

  cadastrarConvencao() {
    this.router.navigate(['convencao/adicionar']);
  }

  editarConvencao(id) {
    this.router.navigate(['convencao/editar/' + id]);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "Convenção", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Convenção");
  }

}
