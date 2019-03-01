import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { BancoService } from '../banco.service';
import { Banco } from '../models/banco';
import { ReportService } from '../../../utils/report.service';


@Component({
    selector: 'app-lista-banco',
    templateUrl: './lista-banco.component.html',
    styleUrls: []
  })

export class ListaBancoComponent implements OnInit {
    public bancos: Banco[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";
    
    public errors: any[] = [];
    public data: any[];

    constructor(public bancoService: BancoService,
        private report: ReportService,
        private router: Router) {}

    ngOnInit (): void {
        this.bancoService.ObterTodosBanco()
        .subscribe(bancos => {
            this.bancos = bancos
            this.data = bancos}, 
         () => this.errors);
    }

    editarBanco(id) {
        this.router.navigate(['banco/editar/' + id]);
    }

    cadastrarBanco() {
        this.router.navigate(['banco/adicionar']);
    }  
    gerarExcel(model,id?) {
        this.report.gerarExcel(model, "Banco",id);
    }
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Banco");
    }
}