import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';
import { ReportService } from '../../../utils/report.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { PapelService } from '../papel.service';
import { Papel } from '../models/papel';

@Component({
  selector: 'app-lista-papel',
  templateUrl: './lista-papel.component.html',
  styleUrls: []
})

export class ListaPapelComponent implements OnInit {
  public papeis: Papel[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public papelService: PapelService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.papelService.obterTodosPapel()
      .subscribe(papeis => {
        this.papeis = papeis
        this.data = papeis
      },
        () => this.errors);
  }

  visualizarPapel(id) {
    this.router.navigate(['papel/visualizar/' + id]);
  }

  cadastrarPapel() {
    this.router.navigate(['papel/adicionar']);
  }

  gerarExcel(model, id?) {
    if (!this.report.gerarExcel(model, "PAPEL", id))
      this.toastr.error("Não Possui Informações");
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "PAPEL");
  }

}

