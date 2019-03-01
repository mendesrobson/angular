import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { ResponsavelCaged } from '../models/responsavelcaged';
import { ResponsavelCagedService } from '../responsavelcaged.service';

@Component({
  selector: 'app-lista-responsavelcaged',
  templateUrl: './lista-responsavelcaged.component.html',
  styleUrls: []
})
export class ListaResponsavelcagedComponent implements OnInit {

  public responsavelCaged: ResponsavelCaged[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(
    public responsavelCagedService: ResponsavelCagedService, 
    private toastr: ToastsManager,
    vcr: ViewContainerRef, 
    private router: Router, 
    private report: ReportService) {
      this.toastr.setRootViewContainerRef(vcr);
     }

     ngOnInit(): void {
      this.responsavelCagedService.obterTodosResponsavelCaged()
        .subscribe(responsavelCaged => {
          this.responsavelCaged = responsavelCaged
          this.data = responsavelCaged
        },
          () => this.errors);
    }

    editarResponsavelCaged(id) {
      this.router.navigate(['responsavelcaged/editar/' + id]);
    }
  
    cadastrarResponsavelCaged() {
      this.router.navigate(['responsavelcaged/adicionar']);
    }
  
    gerarExcel(model,id?)  {
      if (!this.report.gerarExcel(model, "RESPONSÁVEL CAGED",id))
        this.toastr.error("Não Possui Informações");
    }
  
    gerarPDF(model: string) {
      this.report.pdfFile(model, "RESPONSÁVEL CAGED");
    }
  

}
