import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ValorTransporte } from '../models/valortransporte';
import { ValortransporteService } from './../valortransporte.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-valortransporte',
  templateUrl: './lista-valortransporte.component.html',
  styleUrls: []
})
export class ListaValortransporteComponent implements OnInit {

  public valorTransporte: ValorTransporte[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public valorTransporteService: ValortransporteService,
    private router: Router, private toastr: ToastsManager,
    vcr: ViewContainerRef, private report: ReportService) { }

  ngOnInit() {
    this.valorTransporteService.obterTodosValortransporte()
    .subscribe(resultado => {
        this.valorTransporte = resultado,
        this.data = resultado; },
      () => this.errors);
  }

  cadastrarValortransporte() {
    this.router.navigate(['valortransporte/adicionar']);
  }

  editarValortransporte(id) {
    this.router.navigate(['valortransporte/editar/' + id]);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "Valores dos Transportes", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Valores dos Transportes");
  }

}
