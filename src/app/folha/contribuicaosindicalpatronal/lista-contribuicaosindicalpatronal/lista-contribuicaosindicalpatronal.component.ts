import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ContribuicaoSindicalPatronal } from '../models/contribuicaosindicalpatronal';
import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';

import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-contribuicaosindicalpatronal',
  templateUrl: './lista-contribuicaosindicalpatronal.component.html',
  styleUrls: []
})
export class ListaContribuicaosindicalpatronalComponent implements OnInit {

  public contribuicaoSindicalPatronals: ContribuicaoSindicalPatronal[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.contribuicaoSindicalPatronalService.obterTodosContribuicaoSindicalPatronal()
      .subscribe(contribuicaoSindicalPatronals => {
        this.contribuicaoSindicalPatronals = contribuicaoSindicalPatronals
        this.data = contribuicaoSindicalPatronals
      },
        () => this.errors);
  }

  editarContribuicaoSindicalPatronal(id) {
    this.router.navigate(['contribuicaosindicalpatronal/editar/' + id]);
  }

  cadastrarContribuicaoSindicalPatronal() {
    this.router.navigate(['contribuicaosindicalpatronal/adicionar']);
  }

  gerarExcel(model, id?) {
    if (!this.report.gerarExcel(model, "Contribuição Sindical Patronal", id))
      this.toastr.error("Não Possui Informações");
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Contribuição Sindical Patronal");
  }

}
