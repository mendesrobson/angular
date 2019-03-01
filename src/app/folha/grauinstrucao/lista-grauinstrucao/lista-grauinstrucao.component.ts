import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GrauInstrucao } from '../models/grauinstrucao';
import { GrauInstrucaoService } from '../grauinstrucao.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-grauinstrucao',
  templateUrl: './lista-grauinstrucao.component.html',
  styleUrls: []
})
export class ListaGrauInstrucaoComponent implements OnInit {

  public grauinstrucao: GrauInstrucao[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];


  constructor(
    public grauinstrucaoService: GrauInstrucaoService,
    private router: Router, private report: ReportService, private toastr: ToastsManager,
    vcr: ViewContainerRef) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit(): void {
    this.grauinstrucaoService.obterTodosGrauInstrucao()
      .subscribe(grauinstrucao => {
        this.grauinstrucao = grauinstrucao,
          this.data = grauinstrucao;
      },
        () => this.errors);
  }
  editarGrauInstrucao(id) {
    this.router.navigate(['grauinstrucao/editar/' + id]);
  }

  cadastrarGrauinstrucao() {
    this.router.navigate(['grauinstrucao/adicionar']);
  }

  gerarExcel(model, id?) {
    if (!this.report.gerarExcel(model, "Grau de Instrução", id))
      this.toastr.error("Não Possui Informações");
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Grau de Instrução");
  }
  
}
