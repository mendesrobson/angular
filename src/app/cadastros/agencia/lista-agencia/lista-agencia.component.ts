import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { AgenciaService } from '../agencia.service';
import { Agencia } from '../models/agencia';
import { ReportService } from '../../../utils/report.service';


@Component({
    selector: 'app-lista-agencia',
    templateUrl: './lista-agencia.component.html',
    styleUrls: []
  })

export class ListaAgenciaComponent implements OnInit {
    public agencias: Agencia[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";
    
    public errors: any[] = [];
    public data: any[];

    constructor(public agenciaService: AgenciaService,
        private report: ReportService,
        private router: Router) { }

    ngOnInit (): void {
        this.agenciaService.ObterTodosAgencia()
        .subscribe(agencias => {
            this.agencias = agencias
            this.data = agencias}, 
         () => this.errors);
    }

    editarAgencia(id) {
        this.router.navigate(['agencia/editar/' + id]);
    }

    cadastrarAgencia() {
        this.router.navigate(['agencia/adicionar']);
    }  

    gerarExcel(model,id?) {
        this.report.gerarExcel(model, "Agência",id);
    }
    
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Agência");
    }
}
