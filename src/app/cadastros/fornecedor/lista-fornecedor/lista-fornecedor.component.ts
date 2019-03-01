import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { FornecedorService } from '../fornecedor.service';
import { Fornecedor, FornecedorModel } from '../models/fornecedor';
import { ReportService } from '../../../utils/report.service';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-lista-fornecedor',
  templateUrl: './lista-fornecedor.component.html',
  styleUrls: []
})
export class ListaFornecedorComponent implements OnInit {

  public fornecedores: Fornecedor[];
  public empresas: Empresa[];
  public grupoEmpresas: GrupoEmpresa[];
  public fornecedorModel: FornecedorModel;
  fornecedorForm: FormGroup;
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public fornecedorService: FornecedorService,
    private report: ReportService,
    private router: Router) {
    this.fornecedorModel = new FornecedorModel();
  }

  ngOnInit(): void {

    this.fornecedorForm = new FormGroup({
      grupoEmpresaId: new FormControl(),
      empresaId: new FormControl()
    });

    this.fornecedorService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      }, () => { });
  }

  ConsultaEmpresa(idGrupo) {
    this.fornecedorModel.grupoEmpresaId = idGrupo;
    this.fornecedorService.obterTodosFornecedorPorGrupo(idGrupo)
      .subscribe(fornecedores => {
        this.fornecedores = fornecedores
        this.data = this.fornecedores
      }, () => { });

    this.empresas = [];
    this.fornecedorService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

  ConsultaSelectEmpresa(idEmpresa) {
    this.fornecedorModel.empresaId = idEmpresa;
  
    if (idEmpresa !== null){
      this.data = [];
      this.fornecedorService.obterTodosFornecedorPorGrupoEmpresa(this.fornecedorModel)
        .subscribe(result => {
          this.fornecedores = result;
          this.data = result;
        });
    }
  }

  editarFornecedor(id) {
    this.router.navigate(['pessoa/editar/' + id]);
  }

  cadastrarFornecedor() {
    this.router.navigate(['pessoa/adicionar']);
  }

  gerarExcel(model, id?) {
    this.report.gerarExcel(model, "Fornecedor", id);
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Fornecedor");
  }

}
