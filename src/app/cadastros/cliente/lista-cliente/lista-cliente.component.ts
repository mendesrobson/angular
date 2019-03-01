import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../models/cliente';
import { ReportService } from '../../../utils/report.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-lista-cliente',
  templateUrl: './lista-cliente.component.html',
  styleUrls: []
})
export class ListaClienteComponent implements OnInit {

  public clientes: Cliente[];
  public empresas: Empresa[];
  public grupoEmpresas: GrupoEmpresa[];
  public clienteForm: FormGroup;
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public clienteService: ClienteService,
    private report: ReportService,
    private router: Router) {
  }

  ngOnInit(): void {

    this.clienteForm = new FormGroup({
      grupoEmpresaId: new FormControl(),
      empresaId: new FormControl()
    });

    this.clienteService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas
    },() => {});
   
  }


  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.clienteService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

  ConsultaSelectEmpresa(idEmpresa) {
    this.clientes = [];
    this.clienteService.obterTodosClientePorEmpresa(idEmpresa)
      .subscribe(clientes => {
        this.clientes = clientes
        this.data = this.clientes
      }, () => { });
  }

  editarCliente(id) {
    this.router.navigate(['pessoa/editar/' + id]);
  }

  cadastrarCliente() {
    this.router.navigate(['pessoa/adicionar']);
  }

  gerarExcel(model, id?) {
    this.report.gerarExcel(model, "Clientes", id);
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Clientes");
  }

}

