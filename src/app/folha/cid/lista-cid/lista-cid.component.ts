import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Cid } from '../models/cid';
import { CidService } from '../cid.service';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-cid',
  templateUrl: './lista-cid.component.html',
  styleUrls: []
})
export class ListaCidComponent implements OnInit {

  public cids: Cid[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public cidService: CidService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.cidService.ObterTodosCid()
      .subscribe(cids => {
        this.cids = cids;
        this.data = cids;
      },
        () => this.errors);
  }

  editarCid(id) {
    this.router.navigate(['cid/editar/' + id]);
  }

  cadastrarCid() {
    this.router.navigate(['cid/adicionar']);
  }

  gerarExcel(model, id?) {
    if (!this.report.gerarExcel(model, "Cid", id)) {
      this.toastr.error("Não Possui Informações");
    }
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Cid");
  }

}

