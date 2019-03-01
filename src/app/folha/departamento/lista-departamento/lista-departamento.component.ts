import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Departamento } from '../models/departamento';
import { DepartamentoService } from './../departamento.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-departamento',
  templateUrl: './lista-departamento.component.html',
  styleUrls: []
})
export class ListaDepartamentoComponent implements OnInit {

  public departamento: Departamento[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public departamentoService: DepartamentoService,
    private router: Router, private toastr: ToastsManager,
    vcr: ViewContainerRef, private report: ReportService) { }

  ngOnInit() {
    this.departamentoService.obterTodosDepartamento()
    .subscribe(resultado => {
        this.departamento = resultado,
        this.data = resultado; },
      () => this.errors);
  }

  cadastrardepartamento() {
    this.router.navigate(['departamento/adicionar']);
  }

  editardepartamento(id) {
    this.router.navigate(['departamento/editar/' + id]);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "Departamento", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Departamento");
  }

}
