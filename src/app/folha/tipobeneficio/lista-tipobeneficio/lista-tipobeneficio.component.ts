import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TipoBeneficio } from '../models/tipobeneficio';
import { TipoBeneficioService } from '../tipobeneficio.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-tipobeneficio',
  templateUrl: './lista-tipobeneficio.component.html',
  styleUrls: []
})

export class ListaTipoBeneficioComponent implements OnInit {

  public tipoBeneficio: TipoBeneficio[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];


  constructor(
    public tipoBeneficioService: TipoBeneficioService,
    private router: Router, private report: ReportService, private toastr: ToastsManager,
    vcr: ViewContainerRef) { this.toastr.setRootViewContainerRef(vcr); }

  editarTipoBeneficio(id) {
    this.router.navigate(['tipobeneficio/editar/' + id]);
  }

  cadastrarTipoBeneficio() {
    this.router.navigate(['tipobeneficio/adicionar']);
  }

  gerarExcel(model, id?) {
    if (!this.report.gerarExcel(model, "Tipo de Benefício", id))
      this.toastr.error("Não Possui Informações");
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Tipo de Benefício");
  }

  ngOnInit(): void {
    this.tipoBeneficioService.obterTodosTipoBeneficio()
      .subscribe(tipoBeneficio => {
        this.tipoBeneficio = tipoBeneficio,
          this.data = tipoBeneficio;
      },
        () => this.errors);
  }
}
