import { Component, OnInit } from '@angular/core';
import { Observacao } from '../models/observacao';
import { ObservacaoService } from '../observacao.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-observacao',
    templateUrl: './lista-observacao.component.html',
    styleUrls: ['./lista-observacao.component.css']
})


export class ListaObservacaoComponent implements OnInit {
    public observacoes: Observacao[];

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    constructor(public observacaoService: ObservacaoService,
        private router: Router, private report: ReportService) {

    }

    ngOnInit(): void {
        this.observacaoService.obterTodosObservacao()
            .subscribe(observacoes => {
                this.observacoes = observacoes
                this.data = observacoes
            },
                () => this.errors);
    }

    editarObservacao(id) {
        this.router.navigate(['observacao/editar/' + id]);
    }

    cadastrarObservacao() {
        this.router.navigate(['observacao/adicionar']);
    }

      gerarExcel(model,id?)  {
        this.report.gerarExcel(model, "Observação",id);
    }

    gerarPDF(model: string) {
        this.report.pdfFile(model, "Observação");
    }
}