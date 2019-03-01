import { Component, OnInit } from '@angular/core';
import { ParametroFaturamento } from '../../parametrofaturamento/models/parametrofaturamento';
import { Router } from '@angular/router';
import { ParametroFaturamentoService } from '../parametrofaturamento.service';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-parametrofaturamento',
  templateUrl: './lista-parametrofaturamento.component.html',
  styleUrls: []
})

export class ListaParametroFaturamentoComponent implements OnInit {


  public parametrosFaturamento: ParametroFaturamento[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public parametroFaturamentoService: ParametroFaturamentoService,
    private router: Router, private report: ReportService) {
  }

  ngOnInit(): void {
    this.parametroFaturamentoService.obterTodosParametroFaturamento()
      .subscribe(parametros => {
        this.parametrosFaturamento = parametros
        this.data = parametros
      },
        () => this.errors);
  }

  editarParametroFaturamento(id) {
    this.router.navigate(['parametrofaturamento/editar/' + id]);
  }

  cadastrarParametroFaturamento() {
    this.router.navigate(['parametrofaturamento/adicionar']);
  }

    gerarExcel(model,id?)  {
    this.report.gerarExcel(model, "Parâmetro Faturamento",id);
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Parâmetro Faturamento");
  }
}
