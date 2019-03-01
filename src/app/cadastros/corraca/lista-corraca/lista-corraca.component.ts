import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { CorRaca } from '../models/corraca';
import { CorRacaService } from '../corraca.service';

@Component({
  selector: 'app-lista-corraca',
  templateUrl: './lista-corraca.component.html',
  styleUrls: []
})
export class ListaCorRacaComponent implements OnInit {

  public coresracas: CorRaca[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];
  
  constructor(
    public corRacaService: CorRacaService, 
    private toastr: ToastsManager,
    vcr: ViewContainerRef, 
    private router: Router, 
    private report: ReportService) { 

      this.toastr.setRootViewContainerRef(vcr);

    }

  ngOnInit(): void {
      this.corRacaService.ObterTodosCorRaca()
        .subscribe(coresracas => {
          this.coresracas = coresracas
          this.data = coresracas
        },
          () => this.errors);
    }

    editarCorRaca(id) {
      this.router.navigate(['corraca/editar/' + id]);
    }
  
    cadastrarCorRaca() {
      this.router.navigate(['corraca/adicionar']);
    }
    
    gerarExcel(model,id?)  {
      if (!this.report.gerarExcel(model, "COR/RAÇA",id))
        this.toastr.error("Não Possui Informações");
    }
    
    gerarPDF(model: string) {
      this.report.pdfFile(model, "COR/RAÇA");
    }

}
