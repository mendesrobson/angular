import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { Pais } from '../models/pais';
import { PaisService } from '../pais.service';

@Component({
  selector: 'app-lista-pais',
  templateUrl: './lista-pais.component.html',
  styleUrls: []
})
export class ListaPaisComponent implements OnInit {

  public paises: Pais[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(
    public paisService: PaisService, 
    private toastr: ToastsManager,
    vcr: ViewContainerRef, 
    private router: Router, 
    private report: ReportService) { 
      this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit(): void {
      this.paisService.ObterTodosPaises()
        .subscribe(paises => {
          this.paises = paises
          this.data = paises
        },
          () => this.errors);
    }

    editarPais(id) {
      this.router.navigate(['pais/editar/' + id]);
    }
  
    cadastrarPais() {
      this.router.navigate(['pais/adicionar']);
    }
    
    gerarExcel(model,id?)  {
      if (!this.report.gerarExcel(model, "PAÍSES",id))
        this.toastr.error("Não Possui Informações");
    }
    
    gerarPDF(model: string) {
      this.report.pdfFile(model, "PAÍSES");
    }

}
