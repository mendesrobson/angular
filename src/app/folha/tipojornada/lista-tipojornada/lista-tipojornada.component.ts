import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TipoJornada } from '../models/tipojornada';
import { TipoJornadaService } from '../tipojornada.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-tipojornada',
  templateUrl: './lista-tipojornada.component.html',
  styleUrls: []
})
export class ListaTipojornadaComponent implements OnInit {

  public tipoJornadas: TipoJornada[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public tipoJornadaService: TipoJornadaService,
    private router: Router, private report: ReportService, private toastr: ToastsManager,
    vcr: ViewContainerRef) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit(): void {
    this.tipoJornadaService.obterTodosTipoJornada()
      .subscribe(tipoJornada => {
        this.tipoJornadas = tipoJornada,
          this.data = tipoJornada;
      },
        () => this.errors);
  }

  editarTipoJornada(id) {
    this.router.navigate(['tipojornada/editar/' + id]);
  }

  cadastrarTipoJornada() {
    this.router.navigate(['tipojornada/adicionar']);
  }

    gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "Tipo Jornada",id))
      this.toastr.error("Não Possui Informações");
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Tipo Jornada");
  }

}
