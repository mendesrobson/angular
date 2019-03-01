import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ParteCorpoAtingida } from '../models/partecorpoatingida';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';
import { ReportService } from '../../../utils/report.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { PartecorpoatingidaService } from '../partecorpoatingida.service';

@Component({
  selector: 'app-lista-partecorpoatingida',
  templateUrl: './lista-partecorpoatingida.component.html',
  styleUrls: []
})
export class ListaPartecorpoatingidaComponent implements OnInit {

  public parteCorpoAtingida: ParteCorpoAtingida[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: ParteCorpoAtingida[];

  constructor(
    public parteCorpoAtingidaService: PartecorpoatingidaService,
    private router: Router, private toastr: ToastsManager,
    vcr: ViewContainerRef, private report: ReportService) { }

  ngOnInit() {
    this.parteCorpoAtingidaService.obterTodosParteCorpoAtingida()
    .subscribe(resultado => {
        this.data = resultado },
      (erro) => this.errors = erro);
  }

  cadastrarParteCorpoAtingida() {
    this.router.navigate(['partecorpoatingida/adicionar']);
  }

  editarParteCorpoAtingida(id) {
    this.router.navigate(['partecorpoatingida/editar/' + id]);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "Parte Corpo Atiginda", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Parte Corpo Atiginda");
  }

}
