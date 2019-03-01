import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { MascaraService } from '../mascara.service';
import { Mascara } from '../models/mascara';
import { ReportService } from '../../../utils/report.service';


@Component({
    selector: 'app-lista-mascara',
    templateUrl: './lista-mascara.component.html',
    styleUrls: []
  })

export class ListaMascaraComponent implements OnInit {
    public mascaras: Mascara[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";
    
    public errors: any[] = [];
    public data: any[];

    constructor(public mascaraService: MascaraService,
        private report: ReportService,
        private router: Router) {
           
        }

    ngOnInit (): void {
        this.mascaraService.ObterTodosMascara()
        .subscribe(mascaras => {
            this.mascaras = mascaras
            this.data = mascaras}, 
         () => this.errors);
    }

    editarMascara(id) {
        this.router.navigate(['mascara/editar/' + id]);
    }

    cadastrarMascara() {
        this.router.navigate(['mascara/adicionar']);
    }  
      gerarExcel(model,id?)  {
        this.report.gerarExcel(model, "Mascara",id);
      }
      gerarPDF(model:string) {
        this.report.pdfFile(model, "Mascara");
      }
}
