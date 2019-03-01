import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TipoAfastamento } from '../models/tipoafastamento';
import { TipoAfastamentoService } from '../tipoafastamento.service';

import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-tipoafastamento',
  templateUrl: './lista-tipoafastamento.component.html',
  styleUrls: []
})
export class ListaTipoafastamentoComponent implements OnInit {

  public tipoAfastamentos: TipoAfastamento[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(
    public tipoAfastamentoService: TipoAfastamentoService, 
    private toastr: ToastsManager,
    vcr: ViewContainerRef, 
    private router: Router, 
    private report: ReportService
  ) {
    this.toastr.setRootViewContainerRef(vcr);}

    ngOnInit(): void {
      this.tipoAfastamentoService.obterTodosTipoAfastamento()
        .subscribe(tipoAfastamentos => {
          this.tipoAfastamentos = tipoAfastamentos
          this.data = tipoAfastamentos
        },
          () => this.errors);
    }

    editarTipoAfastamento(id) {
      this.router.navigate(['tipoafastamento/editar/' + id]);
    }

    cadastrarTipoAfastamento() {
      this.router.navigate(['tipoafastamento/adicionar']);
    }
    
    gerarExcel(model,id?)  {
      if (!this.report.gerarExcel(model, "TIPO DE AFASTAMENTO",id))
        this.toastr.error("Não Possui Informações");
    }
    
    gerarPDF(model: string) {
      this.report.pdfFile(model, "TIPO DE AFASTAMENTO");
    }

}
