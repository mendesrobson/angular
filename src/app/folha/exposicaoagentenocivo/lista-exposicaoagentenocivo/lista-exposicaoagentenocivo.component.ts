import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ExposicaoAgenteNocivo } from '../models/exposicaoAgenteNocivo';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';
import { ReportService } from '../../../utils/report.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { ExposicaoagentenocivoService } from '../exposicaoagentenocivo.service';

@Component({
  selector: 'app-lista-exposicaoagentenocivo',
  templateUrl: './lista-exposicaoagentenocivo.component.html',
  styleUrls: []
})
export class ListaExposicaoagentenocivoComponent implements OnInit {
  public exposicaoAgenteNocivo: ExposicaoAgenteNocivo[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: ExposicaoAgenteNocivo[];

  constructor(
    public exposicaoAgenteNocivoService: ExposicaoagentenocivoService,
    private router: Router, private toastr: ToastsManager,
    vcr: ViewContainerRef, private report: ReportService) { }

  ngOnInit() {
    this.exposicaoAgenteNocivoService.obterTodosExposicaoAgenteNocivo()
    .subscribe(resultado => {
        this.data = resultado },
      (erro) => this.errors = erro);
  }

  cadastrarExposicaoAgenteNocivo() {
    this.router.navigate(['exposicaoagentenocivo/adicionar']);
  }

  editarExposicaoAgenteNocivo(id) {
    this.router.navigate(['exposicaoagentenocivo/editar/' + id]);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "Exposição Agente Nocivo", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Exposição Agente Nocivo");
  }

}
