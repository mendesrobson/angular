import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CboService } from '../cbo.service';
import { Cbo } from '../models/cbo';

import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';


@Component({
  selector: 'app-lista-cbo',
  templateUrl: './lista-cbo.component.html',
  styleUrls: []
})

export class ListaCboComponent implements OnInit {
  public cbos: Cbo[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public cboService: CboService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.cboService.obterTodosCbo()
      .subscribe(cbos => {
        this.cbos = cbos
        this.data = cbos
      },
        () => this.errors);
  }

  editarCbo(id) {
    this.router.navigate(['cbo/editar/' + id]);
  }

  cadastrarCbo() {
    this.router.navigate(['cbo/adicionar']);
  }
    gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "CBO",id))
      this.toastr.error("Não Possui Informações");
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "CBO");
  }
}

