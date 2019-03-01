import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartaoService } from '../cartao.service';
import { Cartao } from '../models/cartao';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-cartao',
    templateUrl: './lista-cartao.component.html',
    styleUrls: []
})
export class ListaCartaoComponent implements OnInit {

    public cartao: Cartao[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    constructor(public cartaoService: CartaoService,
        private report: ReportService,
        private router: Router) {

    }

    ngOnInit(): void {
        this.cartaoService.ObterTodosCartao()
            .subscribe(cartaos => {
                this.cartao = cartaos
                this.data = cartaos
            },
                error => this.errors);
    }

    editarCartao(id) {
        this.router.navigate(['cartao/editar/' + id]);
    }

    cadastrarCartao() {
        this.router.navigate(['cartao/adicionar']);
    }

    gerarExcel(model,id?) {
        this.report.gerarExcel(model, "Cartão",id);
    }

    gerarPDF(model: string) {
        this.report.pdfFile(model, "Cartão");
    }
}
