import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { MovimentoConta } from '../models/movimentoconta';
import { Subscription } from 'rxjs';
import { MovimentoContaService } from '../movimentoconta.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-movimentoconta',
    templateUrl: './lista-movimentoconta.component.html'
})
export class ListaMovimentoContaComponent implements OnInit {

    public movimentosConta: MovimentoConta[];

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public sub: Subscription;

    public errors: any[] = [];
    public data: any[];

    constructor(public movimentoContaService: MovimentoContaService,
        private router: Router, private report: ReportService) {

    }

    ngOnInit(): void {
        this.movimentosConta = new Array();
        this.data = new Array();

        this.movimentoContaService.obterTodosMovimentoConta()
            .subscribe(movimentosConta => {
                this.movimentosConta = movimentosConta
                this.data = movimentosConta
                console.log(this.data)
            },
                error => this.errors);
    }

    consultarMovimentoConta(id) {
        this.router.navigate(['movimentoconta/consultar/' + id]);
    }


    cadastrarMovimentoConta() {
        this.router.navigate(['movimentoconta/adicionar']);
    }

      gerarExcel(model,id?)  {
        this.report.gerarExcel(model, "Lançar Movimento",id);
    }
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Lançar Movimento");
    }
}