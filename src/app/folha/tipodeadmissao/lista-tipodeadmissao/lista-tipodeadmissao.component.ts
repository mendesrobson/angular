import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TipoDeAdmissao } from '../models/tipodeadmissao';
import { TipoDeAdmissaoService } from '../tipodeadmissao.service';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-tipodeadmissao',
  templateUrl: './lista-tipodeadmissao.component.html',
  styleUrls: []
})
export class ListaTipodeadmissaoComponent implements OnInit {

  public tipoDeAdmissao: TipoDeAdmissao[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public tipoDeAdmissaoService: TipoDeAdmissaoService,
    private router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private report: ReportService) { }

  ngOnInit() {
    this.tipoDeAdmissaoService.obterTodosTipoDeAdmissao()
    .subscribe(tipodeadmissao => {
        this.tipoDeAdmissao = tipodeadmissao,
        this.data = tipodeadmissao;},
      error => this.errors);
  }

  cadastrarTipoDeAdmissao() {
    this.router.navigate(['tipoadmissao/adicionar']);
  }

  editarTipoDeAdmissao(id) {
    this.router.navigate(['tipoadmissao/editar/' + id]);
  }

  gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "TIPO DE ADMISSÃO",id))
      this.toastr.error("Não Possui Informações");
  }
  
  gerarPDF(model: string) {
    this.report.pdfFile(model, "TIPO DE ADMISSÃO");
  }

}
