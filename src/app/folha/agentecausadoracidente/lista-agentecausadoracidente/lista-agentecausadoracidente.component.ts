import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AgenteCausadorAcidente } from '../models/agentecausadosacidente';
import { AgenteCausadorAcidenteService } from '../agentecausadoracidente.service';
import { ToastsManager } from 'ng2-toastr';
import { ReportService } from '../../../utils/report.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-agentecausadoracidente',
  templateUrl: './lista-agentecausadoracidente.component.html',
  styleUrls: []
})
export class ListaAgentecausadoracidenteComponent implements OnInit {

  public agentecausadoracidentes: AgenteCausadorAcidente[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public agenteCausadorAcidenteService: AgenteCausadorAcidenteService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService) {
     this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.agenteCausadorAcidenteService.ObterTodosAgenteCausador()
    .subscribe(agentecausadoracidentes => {
      this.agentecausadoracidentes = agentecausadoracidentes;
      this.data = agentecausadoracidentes;
    },
      () => this.errors);
  }

  editarAgenteCausadorAcidente(id) {
    this.router.navigate(['agentecausadoracidente/editar/' + id]);
  }

  cadastrarAgenteCausadorAcidente() {
    this.router.navigate(['agentecausadoracidente/adicionar']);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "Agente Causador do Acidente", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Agente Causador do Acidente");
  }
  
}

