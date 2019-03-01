import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CoordenadorDeEstagio } from '../models/coordenadordeestagio';
import { CoordenadorDeEstagioService } from '../coordenadordeestagio.service';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-coordenadordeestagio',
  templateUrl: './lista-coordenadordeestagio.component.html',
  styleUrls: []
})
export class ListaCoordenadorDeEstagioComponent implements OnInit {

  public coordenadorDeEstagio: CoordenadorDeEstagio[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public coordenadorDeEstagioService: CoordenadorDeEstagioService,
    private router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private report: ReportService) { }

    ngOnInit() {
      this.coordenadorDeEstagioService.obterTodosCoordenadorDeEstagio()
      .subscribe(coordenadorDeEstagio => {
          this.coordenadorDeEstagio = coordenadorDeEstagio,
          this.data = coordenadorDeEstagio;},
        error => this.errors);
    }

    cadastrarCoordenadorDeEstagio() {
      this.router.navigate(['coordenadordeestagio/adicionar']);
    }
  
    editarCoordenadorDeEstagio(id) {
      this.router.navigate(['coordenadordeestagio/editar/' + id]);
    }
  
    gerarExcel(model,id?)  {
      if (!this.report.gerarExcel(model, "COORDENADOR DE ESTÁGIO",id))
        this.toastr.error("Não Possui Informações");
    }
    
    gerarPDF(model: string) {
      this.report.pdfFile(model, "COORDENADOR DE ESTÁGIO");
    }
}
