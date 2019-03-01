import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Parentesco } from '../models/Parentesco';
import { ParentescoService } from '../parentesco.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-parentesco',
  templateUrl: './lista-parentesco.component.html',
  styleUrls: []
})
export class ListaParentescoComponent implements OnInit {

  public parentescos: Parentesco[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];


  constructor(
    public parentescoService: ParentescoService,
    private router: Router, private report: ReportService, private toastr: ToastsManager,
    vcr: ViewContainerRef) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit(): void {
    this.parentescoService.obterTodosParentesco()
      .subscribe(parentesco => {
        this.parentescos = parentesco,
          this.data = parentesco;
      },
        error => this.errors);
  }
  editarParentesco(id) {
    this.router.navigate(['parentesco/editar/' + id]);
  }

  cadastrarParentesco() {
    this.router.navigate(['parentesco/adicionar']);
  }

    gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "Parentesco",id))
      this.toastr.error("Não Possui Informações");
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Parentesco");
  }

}
