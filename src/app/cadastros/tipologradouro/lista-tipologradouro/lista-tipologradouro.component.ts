import { Component, OnInit } from '@angular/core';
import { TipoLogradouroService } from '../tipologradouro.service';
import { TipoLogradouro } from '../models/tipologradouro';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';


@Component({
    selector: 'app-lista-tipologradouro',
    templateUrl: './lista-tipologradouro.component.html',
    styleUrls: []
  })

export class ListaTipoLogradouroComponent implements OnInit {
    public tiposlogradouros: TipoLogradouro[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";
    
    public errors: any[] = [];
    public data: any[];

    constructor(public tipoLogradouroService: TipoLogradouroService,
        private report: ReportService,
        private router: Router) { 
        }

    ngOnInit (): void {
        this.tipoLogradouroService.ObterTodosTipoLogradouro()
        .subscribe(tiposlogradouros => {
            this.tiposlogradouros = tiposlogradouros
            this.data = tiposlogradouros}, 
         () => this.errors);
    }

    editarTipoLogradouro(id) {
        this.router.navigate(['tipologradouro/editar/' + id]);
      }

      cadastrarTipoLogradouro() {
        this.router.navigate(['tipologradouro/adicionar']);
      }  
        gerarExcel(model,id?)  {
        this.report.gerarExcel(model, "Tipo de Logradouro",id);
      }
      gerarPDF(model:string) {
        this.report.pdfFile(model, "Tipo de Logradouro");
      }
}