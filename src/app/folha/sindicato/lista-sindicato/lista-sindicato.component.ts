import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Sindicato } from '../models/sindicato';
import { SindicatoService } from '../sindicato.service';

import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-sindicato',
  templateUrl: './lista-sindicato.component.html',
  styleUrls: []
})
export class ListaSindicatoComponent implements OnInit {

  public sindicatos: Sindicato[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(
    public sindicatoService: SindicatoService, 
    private toastr: ToastsManager,
    vcr: ViewContainerRef, 
    private router: Router, 
    private report: ReportService) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.sindicatoService.obterTodosSindicato()
        .subscribe(sindicatos => {
          this.sindicatos = sindicatos
          this.data = sindicatos
        },
          () => this.errors);
  }

  editarSindicato(id) {
    
    this.router.navigate(['sindicato/editar/' + id]);
  }

  cadastrarSindicato() {
    this.router.navigate(['sindicato/adicionar']);
  }
  
  gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "SINDICATO",id))
      this.toastr.error("Não Possui Informações");
  }
  
  gerarPDF(model: string) {
    this.report.pdfFile(model, "SINDICATO");
  }

}
