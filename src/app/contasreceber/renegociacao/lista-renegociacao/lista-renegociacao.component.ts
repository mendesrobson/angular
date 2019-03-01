import { Component, OnInit } from '@angular/core';

import { RenegociacaoService } from '../renegociacao.service';
import { Renegociacao } from '../models/renegociacao';
import { Router, ActivatedRoute } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Subscription } from 'rxjs';
import { RenegociacaoComponent } from '../renegociacao.component';
import { ReportService } from '../../../utils/report.service';


@Component({
  selector: 'app-lista-renegociacao',
  templateUrl: './lista-renegociacao.component.html',
  styleUrls: []
})
export class ListaRenegociacaoComponent implements OnInit {

  public renegociacoes: Renegociacao[];

  public sub: Subscription;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  public natureza: string = "";

  constructor(public renegociacaoService: RenegociacaoService,
    private router: Router, private report: ReportService,
    private renegociacaoComponent: RenegociacaoComponent,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.renegociacoes = new Array();
    this.data = new Array();

    this.sub = this.route.params.subscribe(
      params => {
        this.natureza = params['natureza'];

        if (this.natureza == "receber") {
          this.renegociacaoService.obterTodosRenegociacaoPorNaturezaId(1)
            .subscribe(renegociacoes => {
              this.renegociacoes = renegociacoes
              this.data = this.renegociacoes
            },
              error => this.errors);
        } else if (this.natureza == "pagar") {
          this.renegociacaoService.obterTodosRenegociacaoPorNaturezaId(2)
            .subscribe(renegociacoes => {
              this.renegociacoes = renegociacoes
              this.data = this.renegociacoes
            },
              error => this.errors);
        }
      });


  }

  editarRenegociacao(id) {
    this.renegociacaoComponent.Parcelas = new Array();
    if (this.natureza == 'receber') {
      this.router.navigate(['renegociacao/editar/receber/' + id]);
    } else {
      this.router.navigate(['renegociacao/editar/pagar/' + id]);
    }


  }

  cadastrarRenegociacao() {
    if (this.natureza == 'receber') {
      this.renegociacaoComponent.Parcelas = new Array();
      this.router.navigate(['renegociacao/adicionar/receber']);
    } else {
      this.renegociacaoComponent.Parcelas = new Array();
      this.router.navigate(['renegociacao/adicionar/pagar']);
    }

  }
    gerarExcel(model,id?)  {
    this.report.gerarExcel(model, "Renegociação",id);
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Renegociação");
  }
}

