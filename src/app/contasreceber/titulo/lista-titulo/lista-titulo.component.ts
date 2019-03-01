import { Component, OnInit, enableProdMode } from '@angular/core';

import { Titulo } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReportService } from '../../../utils/report.service';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
import { FormGroup, FormControl } from '@angular/forms';
import { TituloComponent } from '../titulo.component';

// import { Pessoa, Cliente } from '../../../cadastros/pessoa/models/pessoa';

@Component({
  selector: 'app-lista-titulo',
  templateUrl: './lista-titulo.component.html',
  styleUrls: []
})
export class ListaTituloComponent implements OnInit {

  public titulos: Titulo[];
  public empresas: Empresa[];
  public grupoEmpresas: GrupoEmpresa[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public natureza: string = "";

  public sub: Subscription;
  public titulosForm: FormGroup;

  public errors: any[] = [];
  public data: any[];

  // public simpleProducts: string[];

  constructor(public tituloService: TituloService, public tituloComponent: TituloComponent,
    private router: Router, private report: ReportService,
    private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.titulos = new Array();
    this.data = new Array();

    this.titulosForm = new FormGroup({
      grupoEmpresaId: new FormControl(''),
      empresaId: new FormControl('')
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.natureza = params['natureza'];
      });

    this.grupoEmpresas = [];
    this.tituloService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      }, () => { });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.tituloService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

  ConsultaSelectEmpresa(idEmpresa) {
    this.tituloComponent.Titulos = [];
    if (this.natureza == "receber") {
      this.tituloService.obterTodosTituloReceberPorEmpresaId(idEmpresa)
        .subscribe(titulos => {
          this.tituloComponent.Titulos = titulos;
        }, () => { });

    } else if (this.natureza == "pagar") {
      this.tituloService.obterTodosTituloPagarPorEmpresaId(idEmpresa)
        .subscribe(titulos => {
          this.tituloComponent.Titulos = titulos;
        }, () => { });
    }
  }

  editarTitulo(id) {
    if (this.natureza == "receber") {
      this.router.navigate(['titulo/editar/receber/' + id]);
    } else if (this.natureza == "pagar") {
      this.router.navigate(['titulo/editar/pagar/' + id]);
    }
  }

  cadastrarTitulo() {
    if (this.natureza == "receber") {
      this.router.navigate(['titulo/adicionar/receber']);
    } else if (this.natureza == "pagar") {
      this.router.navigate(['titulo/adicionar/pagar']);
    }
  }

  gerarExcel(model, id?) {
    this.report.gerarExcel(model, "Titulos", id);
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Titulos");
  }
}
