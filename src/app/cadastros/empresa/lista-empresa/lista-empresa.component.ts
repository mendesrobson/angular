import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresaService } from '../empresa.service';
import { Empresa } from '../models/empresa';
import { ReportService } from '../../../utils/report.service';
@Component({
  selector: 'app-lista-empresa',
  templateUrl: './lista-empresa.component.html',
  styleUrls: []
})
export class ListaEmpresaComponent implements OnInit {

  public empresas: Empresa[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public empresaService: EmpresaService,
    private router: Router, private report: ReportService) {
    this.empresaService.ObterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
        this.data = empresas
      },
        () => this.errors);
  }

  ngOnInit(): void {
  }

  editarEmpresa(id) {
    this.router.navigate(['pessoa/editar/' + id]);
  }

  cadastrarEmpresa() {
    this.router.navigate(['pessoa/adicionar']);
  }

  gerarExcel(model,id) {
    this.report.gerarExcel(model, "Empresas",id);
  }
  gerarPDF(model:string) {
    this.report.pdfFile(model, "Empresas");
  }
}
