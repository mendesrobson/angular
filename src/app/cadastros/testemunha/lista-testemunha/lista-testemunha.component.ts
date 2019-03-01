import { Component, OnInit } from '@angular/core';
import { Testemunha } from '../models/testemunha';
import { TestemunhaService } from '../testemunha.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-testemunha',
    templateUrl: './lista-testemunha.component.html',
    styleUrls: []
})

export class ListaTestemunhaComponent implements OnInit {
    public testemunhas: Testemunha[];

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    constructor(public testemunhaService: TestemunhaService,
        private router: Router, private report: ReportService) {
    }

    ngOnInit(): void {
        this.testemunhaService.obterTodosTestemunha()
            .subscribe(testemunhas => {
                this.testemunhas = testemunhas
                this.data = testemunhas
            },
                () => this.errors);
    }

    editarTestemunha(id) {
        this.router.navigate(['testemunha/editar/' + id]);
    }

    cadastrarTestemunha() {
        this.router.navigate(['testemunha/adicionar']);
    }

      gerarExcel(model,id?)  {
        this.report.gerarExcel(model, "Testemunha",id);

    }
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Testemunha");
    }

}