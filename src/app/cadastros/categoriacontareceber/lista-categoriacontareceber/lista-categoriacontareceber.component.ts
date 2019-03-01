import { Component, OnInit } from '@angular/core';
import { CategoriaContaReceber } from "../models/categoriacontareceber";
import { CategoriaContaReceberService } from "../categoriacontareceber.service";
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-categoriacontareceber',
    templateUrl: './lista-categoriacontareceber.component.html',
    styleUrls: ['./lista-categoriacontareceber.component.css']
})


export class ListaCategoriaContaReceberComponent implements OnInit {
    public categoriasContaReceber: CategoriaContaReceber[];

    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "descricao";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];
    public toggle = false;


    constructor(public categoriaContaReceberService: CategoriaContaReceberService,
        private router: Router, private report: ReportService) {

    }

    ngOnInit(): void {
        this.categoriaContaReceberService.obterTodosCategoriaContaReceber()
            .subscribe(categoriasContaReceber => {
                this.categoriasContaReceber = categoriasContaReceber
                this.data = categoriasContaReceber
            },
                () => this.errors);

    }

    editarCategoriaContaReceber(id) {
        this.router.navigate(['categoriacontareceber/editar/' + id]);
    }

    cadastrarCategoriaContaReceber() {
        this.router.navigate(['categoriacontareceber/adicionar']);
    }

    /*toggleAll() {
        this.toggle = !this.toggle;
        this.data.forEach(item => item.checked = this.toggle);
    }

    toggleItem(item) {
        item.checked = !item.checked;
        this.toggle = this.data.every(item => item.checked);
    }*/
      gerarExcel(model,id?)  {
        this.report.gerarExcel(model, "Categoria - Contas a Receber",id);
    }
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Categoria - Contas a Receber");
    }

}
