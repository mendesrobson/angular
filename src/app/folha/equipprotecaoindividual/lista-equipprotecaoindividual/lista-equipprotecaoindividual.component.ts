import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { EquipProtecaoIndividual } from '../models/equipprotecaoindividual';
import { EquipprotecaoindividualService } from './../equipprotecaoindividual.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-equipprotecaoindividual',
  templateUrl: './lista-equipprotecaoindividual.component.html',
  styleUrls: []
})
export class ListaEquipprotecaoindividualComponent implements OnInit {

  public equipprotecaoindividual: EquipProtecaoIndividual[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public equipprotecaoindividualService: EquipprotecaoindividualService,
    private router: Router, private toastr: ToastsManager,
    vcr: ViewContainerRef, private report: ReportService) { }

  ngOnInit() {
    this.equipprotecaoindividualService.obterTodosEquipprotecaoindividual()
    .subscribe(resultado => {
        this.equipprotecaoindividual = resultado,
        this.data = resultado; },
      () => this.errors);
  }

  cadastrarEquipprotecaoindividual() {
    this.router.navigate(['equipprotecaoindividual/adicionar']);
  }

  editarEquipprotecaoindividual(id) {
    this.router.navigate(['equipprotecaoindividual/editar/' + id]);
  }

  gerarExcel(model, id?)  {
    if (!this.report.gerarExcel(model, "EPI", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "EPI");
  }

}
