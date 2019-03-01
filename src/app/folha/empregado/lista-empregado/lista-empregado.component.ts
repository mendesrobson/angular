import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Empregado } from '../models/empregado';
import { EmpregadoService } from './../empregado.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-empregado',
  templateUrl: './lista-empregado.component.html',
  styleUrls: []
})
export class ListaEmpregadoComponent implements OnInit {

  public empregado: Empregado[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public empregadoService: EmpregadoService,
    private router: Router, private toastr: ToastsManager,
    vcr: ViewContainerRef, private report: ReportService) { }

  ngOnInit() {
    this.empregadoService.obterTodosEmpregados()
    .subscribe(resultado => {
        this.empregado = resultado,
        this.data = resultado;
      },
        () => this.errors);
  }

  cadastrarEmpregado() {
    this.router.navigate(['colaborador/adicionar']);
  }

  editarEmpregado(id) {
    this.router.navigate(['colaborador/editar/' + id]);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "Colaborador", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Colaborador");
  }

}
