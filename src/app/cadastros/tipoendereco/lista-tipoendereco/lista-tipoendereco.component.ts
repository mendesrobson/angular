import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { TipoEndereco } from '../models/tipoendereco';
import { TipoEnderecoService } from '../tipoendereco.service';

@Component({
  selector: 'app-lista-tipoendereco',
  templateUrl: './lista-tipoendereco.component.html',
  styleUrls: []
})
export class ListaTipoenderecoComponent implements OnInit {

  public tipoEnderecos: TipoEndereco[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public tipoEnderecoService: TipoEnderecoService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.tipoEnderecoService.ObterTodosTipoEndereco()
      .subscribe(tipoEnderecos => {
        this.tipoEnderecos = tipoEnderecos
        this.data = tipoEnderecos
      },
        () => this.errors);
  }

  editarTipoEndereco(id) {
    this.router.navigate(['tipoendereco/editar/' + id]);
  }

  cadastrarTipoEndereco() {
    this.router.navigate(['tipoendereco/adicionar']);
  }

  gerarExcel(model, id?) {
    if (!this.report.gerarExcel(model, "TipoEndereco", id))
      this.toastr.error("Não Possui Informações");
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "TipoEndereco");
  }
}
