import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Nacionalidade } from '../models/nacionalidade';
import { NacionalidadeService } from '../nacionalidade.service';
import { ToastsManager } from 'ng2-toastr';
import { ReportService } from '../../../utils/report.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-nacionalidade',
  templateUrl: './lista-nacionalidade.component.html',
  styleUrls: []
})

export class ListaNacionalidadeComponent implements OnInit {
  public nacionalidades: Nacionalidade[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public nacionalidadeService: NacionalidadeService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.nacionalidadeService.obterTodosNacionalidade()
      .subscribe(nacionalidade => {
        this.nacionalidades = nacionalidade,
          this.data = nacionalidade;
      },
        () => this.errors);
  }

  editarNacionalidade(id) {
    this.router.navigate(['nacionalidades/editar/' + id]);
  }

  cadastrarNacionalidade() {
    this.router.navigate(['nacionalidades/adicionar']);
  }

  gerarExcel(model, id?) {
    if (!this.report.gerarExcel(model, "Nacionalidade", id))
      this.toastr.error("Não Possui Informações");
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Nacionalidade");
  }
}
