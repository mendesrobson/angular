import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { Uf } from '../models/uf';
import { UfService } from '../uf.service';

@Component({
  selector: 'app-lista-uf',
  templateUrl: './lista-uf.component.html',
  styleUrls: []
})
export class ListaUfComponent implements OnInit {

    public ufs: Uf[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";
  
    public errors: any[] = [];
    public data: any[];
  
    constructor(public ufService: UfService, private toastr: ToastsManager,
      vcr: ViewContainerRef, private router: Router, private report: ReportService) {
      this.toastr.setRootViewContainerRef(vcr);
    }
  
    ngOnInit(): void {
      this.ufService.ObterTodosUf()
        .subscribe(ufs => {
          this.ufs = ufs
          this.data = ufs
        },
          () => this.errors);
    }
  
    editarUf(id) {
      this.router.navigate(['uf/editar/' + id]);
    }
  
    cadastrarUf() {
      this.router.navigate(['uf/adicionar']);
    }
  
    gerarExcel(model, id?) {
      if (!this.report.gerarExcel(model, "Uf", id))
        this.toastr.error("Não Possui Informações");
    }
  
    gerarPDF(model: string) {
      this.report.pdfFile(model, "Uf");
    }
  }
