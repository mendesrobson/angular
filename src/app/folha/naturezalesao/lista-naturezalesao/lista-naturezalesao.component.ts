import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NaturezaLesao } from './../models/naturezalesao';
import { NaturezaLesaoService } from '../naturezalesao.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-naturezalesao',
  templateUrl: './lista-naturezalesao.component.html',
  styleUrls: []
})
export class ListaNaturezalesaoComponent implements OnInit {

  public naturezadasLesoes: NaturezaLesao[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public naturezaLesaoService: NaturezaLesaoService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService) {
     this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.naturezaLesaoService.ObterTodosNaturezaLesao()
    .subscribe(naturezadasLesoes => {
      this.naturezadasLesoes = naturezadasLesoes;
      this.data = naturezadasLesoes;
    },
      () => this.errors);
  }

  editarNaturezaLesao(id) {
    this.router.navigate(['naturezalesao/editar/' + id]);
  }

  cadastrarNaturezaLesao() {
    this.router.navigate(['naturezalesao/adicionar']);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "Natureza da Lesão", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Natureza da Lesão");
  }
  
}
