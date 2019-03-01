import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { HistoricoPadraoService } from '../historicopadrao.service';
import { HistoricoPadrao, HistoricoPadraoCentro } from '../models/historicopadrao';
import { HistoricopadraoComponent } from '../historicopadrao.component';
import { ReportService } from '../../../utils/report.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-lista-historicopadrao',
  templateUrl: './lista-historicopadrao.component.html',
  styleUrls: []
})
export class ListaHistoricopadraoComponent implements OnInit {

  public historicosPadroes: HistoricoPadrao[];
  public historicoPadraoForm: FormGroup;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public historicoPadraoService: HistoricoPadraoService,
    private router: Router, private report: ReportService,
    private historicoPadraoComponent: HistoricopadraoComponent) {

  }

  ngOnInit(): void {
    this.historicoPadraoForm = new FormGroup({
      grupoEmpresaId: new FormControl(),
      empresaId: new FormControl()
    });

    this.historicoPadraoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        () => {});
  }

  cadastrarHistoricoPadrao() {
    this.historicoPadraoComponent.HistoricoPadrao = new HistoricoPadrao();
    this.historicoPadraoComponent.HistoricoPadraoCentro = new HistoricoPadraoCentro();
    this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro = new Array();
    this.router.navigate(['historicopadrao/adicionar']);
  }

  gerarExcel(model, id?) {
    this.report.gerarExcel(model, "Histórico Padrão", id);
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Histórico Padrão");
  }

  oncellClick(event) {
    if (event.selectedRowKeys != undefined) {
      this.router.navigate(['historicopadrao/editar/' + event.selectedRowKeys]);
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.historicoPadraoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

  ConsultaSelectEmpresa(idEmpresa) {
    this.historicoPadraoService.obterTodosHistoricoPadraoPorEmpresaId(idEmpresa)
      .subscribe(historicosPadroes => {
        this.historicosPadroes = historicosPadroes
        this.data = this.historicosPadroes
      }, () => { });
  }
}
