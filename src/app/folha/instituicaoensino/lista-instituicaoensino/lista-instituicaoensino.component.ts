
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { InstituicaoEnsino } from '../models/instituicaoensino';
import { InstituicaoEnsinoService } from '../instituicaoensino.service';

@Component({
  selector: 'app-lista-instituicaoensino',
  templateUrl: './lista-instituicaoensino.component.html',
  styleUrls: []
})
export class ListaInstituicaoensinoComponent implements OnInit {

  public instituicaoensinos: InstituicaoEnsino[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];



  constructor(public instituicaoEnsinoService: InstituicaoEnsinoService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService)
    {
     this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.instituicaoEnsinoService.ObterTodosInstituicaoEnsino()
    .subscribe(instituicaoensinos => {
      this.instituicaoensinos = instituicaoensinos;
      this.data = instituicaoensinos;
    },
      () => this.errors);
  }

  editarInstituicaoEnsino(id) {
    this.router.navigate(['instituicaoensino/editar/' + id]);
  }

  cadastrarInstituicaoEnsino() {
    this.router.navigate(['instituicaoensino/adicionar']);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "Instituição Ensino", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Instituição Ensino");
  }
}
