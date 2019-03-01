import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TipoLotacaoTributaria } from '../models/tipolotacaotributaria';
import { TipolotacaotributariaService } from './../tipolotacaotributaria.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-tipolotacaotributaria',
  templateUrl: './lista-tipolotacaotributaria.component.html',
  styleUrls: []
})
export class ListaTipolotacaotributariaComponent implements OnInit {

  public tipoLotacaoTributaria: TipoLotacaoTributaria[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public tipoLotacaoTributariaService: TipolotacaotributariaService,
    private router: Router, private toastr: ToastsManager,
    vcr: ViewContainerRef, private report: ReportService) { }

  ngOnInit() {
    this.tipoLotacaoTributariaService.obterTodosTipolotacaotributaria()
    .subscribe(resultado => {
        this.tipoLotacaoTributaria = resultado,
        this.data = resultado; },
      () => this.errors);
  }

  cadastrarTipolotacaotributaria() {
    this.router.navigate(['tipolotacaotributaria/adicionar']);
  }

  editarTipolotacaotributaria(id) {
    this.router.navigate(['tipolotacaotributaria/editar/' + id]);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "Tipos de Lotação Tributária", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Tipos de Lotação Tributária");
  }

}
