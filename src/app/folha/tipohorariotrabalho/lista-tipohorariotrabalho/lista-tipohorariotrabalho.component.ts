import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TipoHorarioTrabalho } from '../models/tipohorariotrabalho';
import { TipoHorarioTrabalhoService } from '../tipohorariotrabalho.service';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-tipohorariotrabalho',
  templateUrl: './lista-tipohorariotrabalho.component.html',
  styleUrls: []
})
export class ListaTipohorariotrabalhoComponent implements OnInit {

  public tipoHorarioTrabalho: TipoHorarioTrabalho[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public tipoHorarioTrabalhoService: TipoHorarioTrabalhoService,
    private router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private report: ReportService) { }

  ngOnInit() {
    this.tipoHorarioTrabalhoService.obterTodosTipoHorarioTrabalho()
    .subscribe(tipohorariotrabalho => {
        this.tipoHorarioTrabalho = tipohorariotrabalho,
        this.data = tipohorariotrabalho;},
      error => this.errors);
  }

  cadastrarTipoHorarioTrabalho() {
    this.router.navigate(['tipohorariotrabalho/adicionar']);
  }

  editarTipoHorarioTrabalho(id) {
    this.router.navigate(['tipohorariotrabalho/editar/' + id]);
  }

  gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "TIPO HORÁRIO TRABALHO",id))
      this.toastr.error("Não Possui Informações");
  }
  
  gerarPDF(model: string) {
    this.report.pdfFile(model, "TIPO HORÁRIO TRABALHO");
  }

}
