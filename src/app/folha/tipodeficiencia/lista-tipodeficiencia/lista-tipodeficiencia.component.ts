import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TipoDeficiencia } from '../models/tipodeficiencia';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import { TipoDeficienciaService } from '../tipodeficiencia.service';

@Component({
  selector: 'app-lista-tipodeficiencia',
  templateUrl: './lista-tipodeficiencia.component.html',
  styleUrls: []
})
export class ListaTipodeficienciaComponent implements OnInit {

  public tipoDeficiencia: TipoDeficiencia[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public tipoDeficienciaService: TipoDeficienciaService,
    private router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private report: ReportService) { }

  ngOnInit() {
    this.tipoDeficienciaService.obterTodosTipoDeficiencia()
    .subscribe(tipoDeficiencia => {
        this.tipoDeficiencia = tipoDeficiencia,
        this.data = tipoDeficiencia; },
      error => this.errors);
  }

  cadastrarTipoDeficiencia() {
    this.router.navigate(['tipodeficiencia/adicionar']);
  }

  editarTipoDeficiencia(id) {
    this.router.navigate(['tipodeficiencia/editar/' + id]);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "TIPO DEFICIÊNCIA", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "TIPO DEFICIÊNCIA");
  }

}
