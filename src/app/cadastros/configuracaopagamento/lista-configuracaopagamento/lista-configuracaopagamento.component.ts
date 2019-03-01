import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ConfiguracaopagamentoService } from '../configuracaopagamento.service';
import { ConfiguracaoPagamento } from '../models/configuracaopagamento';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-configuracaopagamento',
    templateUrl: './lista-configuracaopagamento.component.html',
    styleUrls: []
})
export class ListaConfiguracaopagamentoComponent implements OnInit {

    public configuracaoPagamento: ConfiguracaoPagamento[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    constructor(public configuracaoPagamentoService: ConfiguracaopagamentoService,
        private router: Router, private report: ReportService) {

    }

    ngOnInit(): void {
        this.configuracaoPagamentoService.ObterTodosConfiguracaoPagamento()
            .subscribe(configuracaoPagamentos => {
                this.configuracaoPagamento = configuracaoPagamentos
                this.data = configuracaoPagamentos
            },
                () => this.errors);
    }

    editarConfiguracaoPagamento(id) {
        this.router.navigate(['configuracaopagamento/editar/' + id]);
    }

    cadastrarConfiguracaoPagamento() {
        this.router.navigate(['configuracaopagamento/adicionar']);
    }

      gerarExcel(model,id?)  {
        this.report.gerarExcel(model, "Configuração de Pagamento",id);
    }

    gerarPDF(model: string) {
        this.report.pdfFile(model, "Configuração de Pagamento");
    }

}


