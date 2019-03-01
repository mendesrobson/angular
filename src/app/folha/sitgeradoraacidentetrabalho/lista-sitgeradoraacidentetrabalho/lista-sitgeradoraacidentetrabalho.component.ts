import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';

import { SitGeradoraAcidenteTrabalho } from '../models/sitgeradoraacidentetrabalho';
import { SitGeradoraAcidenteTrabalhoService } from '../sitgeradoraacidentetrabalho.service';



@Component({
  selector: 'app-lista-sitgeradoraacidentetrabalho',
  templateUrl: './lista-sitgeradoraacidentetrabalho.component.html',
  styleUrls: []
})
export class ListaSitgeradoraacidentetrabalhoComponent implements OnInit {

  public arraySitGeradoraAcidenteTrabalho: SitGeradoraAcidenteTrabalho[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(
    public sitGeradoraAcidenteTrabalhoService: SitGeradoraAcidenteTrabalhoService, 
    private toastr: ToastsManager,
    vcr: ViewContainerRef, 
    private router: Router, 
    private report: ReportService) { 

      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() : void {

    this.sitGeradoraAcidenteTrabalhoService.obterTodosSitGeradoraAcidenteTrabalho()
    .subscribe(sitGeradoraAcidenteTrabalho => {
      this.arraySitGeradoraAcidenteTrabalho = sitGeradoraAcidenteTrabalho
      this.data = sitGeradoraAcidenteTrabalho
    },
      () => this.errors);

  }

  editarSitGeradoraAcidenteTrabalho(id) {
    this.router.navigate(['sitgeradoraacidentetrabalho/editar/' + id]);
  }

  cadastrarSitGeradoraAcidenteTrabalho() {
    this.router.navigate(['sitgeradoraacidentetrabalho/adicionar']);
  }
  
  gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "SITUACAO GERADORA DO ACIDENTE DE TRABALHO",id))
      this.toastr.error("Não Possui Informações");
  }
  
  gerarPDF(model: string) {
    this.report.pdfFile(model, "SITUACAO GERADORA DO ACIDENTE DE TRABALHO");
  }

}
