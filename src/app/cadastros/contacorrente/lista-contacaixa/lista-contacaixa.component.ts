import { Component, OnInit } from '@angular/core';
import { ContaCorrente } from '../models/contacorrente';
import { ContaCorrenteService } from '../contacorrente.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-contacaixa',
  templateUrl: './lista-contacaixa.component.html',
  styleUrls: []
})
export class ListaContaCaixaComponent implements OnInit {

  public contaCorrente: ContaCorrente[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public contaCorrenteService: ContaCorrenteService,
    private report: ReportService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.contaCorrenteService.obterTodosContaCaixa()
      .subscribe(contaCorrente => {
        this.contaCorrente = contaCorrente
        this.data = contaCorrente
      },
      () => this.errors);
  }

  editarContaCorrente(id) {
    this.router.navigate(['conta/editar/caixa/' + id]);
  }

  cadastrarContaCorrente() {
    this.router.navigate(['conta/adicionar/conta/caixa']);
  }
    gerarExcel(model,id?)  {
    this.report.gerarExcel(model, "Conta Caixa",id);
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Conta Caixa");
  }

}
