import { Component, OnInit } from '@angular/core';
import { Lancamento } from '../models/lancamento';
import { LancamentoService } from '../lancamento.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-lancamento',
    templateUrl: './lista-lancamento.component.html',
    styleUrls: []
})

export class ListaLancamentoComponent implements OnInit {
    public lancamentos: Lancamento[];

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    constructor(public lancamentoService: LancamentoService,
        private router: Router, private report: ReportService) {
    }

    ngOnInit(): void {
        this.lancamentoService.obterTodosLancamento()
            .subscribe(lancamentos => {
                this.lancamentos = lancamentos
                this.data = lancamentos
            },
                () => this.errors);
    }

    editarLancamento(id) {
        this.router.navigate(['lancamento/editar/' + id]);
    }

    cadastrarLancamento() {
        this.router.navigate(['lancamento/adicionar']);
    }

      gerarExcel(model,id?)  {
        this.report.gerarExcel(model, "Lançamento",id);    
    }

    gerarPDF(model: string) {
        this.report.pdfFile(model, "Lançamento");
    }
}