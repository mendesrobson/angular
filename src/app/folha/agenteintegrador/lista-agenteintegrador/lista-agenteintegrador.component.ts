import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { AgenteIntegrador } from '../models/agenteintegrador';
import { AgenteintegradorService } from '../agenteintegrador.service';

@Component({
  selector: 'app-lista-agenteintegrador',
  templateUrl: './lista-agenteintegrador.component.html',
  styleUrls: []
})
export class ListaAgenteintegradorComponent implements OnInit {
  
  public agenteIntegradors: AgenteIntegrador[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public agenteIntegradorService: AgenteintegradorService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.agenteIntegradorService.obterTodosAgenteIntegrador()
      .subscribe(agenteIntegradors => {
        this.agenteIntegradors = agenteIntegradors
        this.data = agenteIntegradors
      },
        () => this.errors);
  }

  editarAgenteIntegrador(id) {
    this.router.navigate(['agenteintegrador/editar/' + id]);
  }

  cadastrarAgenteIntegrador() {
    this.router.navigate(['agenteintegrador/adicionar']);
  }

  gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "Agente Integrador",id))
      this.toastr.error("Não Possui Informações");
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Agente Integrador");
  }

}
