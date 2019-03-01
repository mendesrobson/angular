import { Component, OnInit } from '@angular/core';
import { CategoriaContaPagar } from '../models/categoriacontapagar';
import { CategoriaContaPagarService } from '../categoriacontapagar.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-categoriacontapagar',
  templateUrl: './lista-categoriacontapagar.component.html',
  styleUrls: ['./lista-categoriacontapagar.component.css']
})


export class ListaCategoriaContaPagarComponent implements OnInit {
  public categorias: CategoriaContaPagar[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public categoriaContaPagarService: CategoriaContaPagarService,
    private router: Router, private report: ReportService) {

  }

  ngOnInit(): void {
    this.categoriaContaPagarService.obterTodosCategoriaContaPagar()
      .subscribe(categorias => {
        this.categorias = categorias
        console.log(this.categorias);
        this.data = categorias
      },
        () => this.errors);
  }

  editarCategoriaContaPagar(id) {
    this.router.navigate(['categoriacontapagar/editar/' + id]);
  }

  cadastrarCategoriaContaPagar() {
    this.router.navigate(['categoriacontapagar/adicionar']);
  }
  gerarExcel(model,id?) {
    this.report.gerarExcel(model, "Categoria - Contas a Pagar",id);

  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Categoria - Contas a Pagar");
  }
}
