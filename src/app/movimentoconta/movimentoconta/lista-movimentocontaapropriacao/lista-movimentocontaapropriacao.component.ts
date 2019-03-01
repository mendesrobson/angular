import { Component, OnInit } from "@angular/core";
import { MovimentoContaComponent } from "../movimentoconta.component";

@Component({
    selector: 'app-lista-movimentocontaapropriacao',
    templateUrl: './lista-movimentocontaapropriacao.component.html'
})
export class ListaMovimentoContaApropriacaoComponent implements OnInit {

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "descricao";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];
    public data1: any[];

    constructor(
        private movimentoContaComponent: MovimentoContaComponent
    ) { }

    ngOnInit(): void {
        this.data = [];
        console.log(this.movimentoContaComponent.MovimentoConta.apropriacaoCentro);
        this.data = this.movimentoContaComponent.MovimentoConta.apropriacaoCentro;
       
    }
}