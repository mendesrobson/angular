import { Component, OnInit } from '@angular/core';
import { ContratoFaturamento, Empresa, GrupoEmpresa, Cliente } from '../models/contratofaturamento';
import { ContratoFaturamentoService } from '../contratofaturamento.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ContratoFaturamentoComponent } from '../contratofaturamento.component';

@Component({
  selector: 'app-lista-contratofaturamento',
  templateUrl: './lista-contratofaturamento.component.html',
  styleUrls: ['./lista-contratofaturamento.component.css']
})
export class ListaContratoFaturamentoComponent implements OnInit {


  public contratos: ContratoFaturamento[];
  public empresas: Empresa[];
  public grupoEmpresas: GrupoEmpresa[];
  public clientes : Cliente[];
  public contratoFaturamentoForm: FormGroup;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public contratoFaturamentoService: ContratoFaturamentoService,
    public contratoFaturamentoComponent: ContratoFaturamentoComponent, private router: Router,
    private report: ReportService) {

  }

  ngOnInit(): void {

    this.contratoFaturamentoForm = new FormGroup({
      grupoEmpresaId: new FormControl(),
      empresaId: new FormControl()
    });

    this.contratoFaturamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      }, () => { });

    // this.contratoFaturamentoService.obterTodosClientes()
    //   .subscribe(f => {
    //     this.clientes = f;
    //   }, () => { });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.contratoFaturamentoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }
  
  ConsultaSelectEmpresa(idEmpresa) {
    this.contratoFaturamentoComponent.ContratoFaturamentos = [];

    this.contratoFaturamentoService.obterTodosContratoFaturamentoEmpresaId(idEmpresa)
      .subscribe(contratos => {
        this.contratoFaturamentoComponent.ContratoFaturamentos = contratos;

      },() => {});
  }

  editarContratoFaturamento(id) {
    this.router.navigate(['contratofaturamento/editar/' + id]);
  }

  cadastrarContratoFaturamento() {
    this.router.navigate(['contratofaturamento/adicionar']);
  }

  gerarExcel(model, id?) {
    this.report.gerarExcel(model, "Contrato Faturamento", id);
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Contrato Faturamento");
  }

}
