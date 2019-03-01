import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { CentroCusto } from '../models/centrocusto';
import { CentroCustoService } from '../centrocusto.service';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DxTreeViewComponent } from 'devextreme-angular';


@Component({
  selector: 'app-lista-centrocusto',
  templateUrl: './lista-centrocusto.component.html',
  styleUrls: []
})

export class ListaCentrocustoComponent implements OnInit {
  @ViewChild(DxTreeViewComponent) treeView;
  public centroCustos: CentroCusto[];
  public grupoEmpresas: GrupoEmpresa[];
  public centroCustoForm: FormGroup;
  public empresas: Empresa[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  tree = [];

  public errors: any[] = [];
  public data: any[];

  constructor(public centroCustoService: CentroCustoService,
    private report: ReportService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.centroCustoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

  ConsultaSelectEmpresa(idEmpresa) {
    this.centroCustos = [];
    this.centroCustoService.obterTodosCentroCustoPorEmpresaId(idEmpresa)
      .subscribe(centroCustos => {
        this.centroCustos = centroCustos;
      },
        () => { });
  }

  ngOnInit(): void {

    this.centroCustoForm = new FormGroup({
      grupoEmpresaId: new FormControl(),
      empresaId: new FormControl()
    });

    this.centroCustoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);
  }

  editarCentroCusto(id) {
    this.router.navigate(['centrocusto/editar/' + id]);
  }

  cadastrarCentroCusto() {
    this.router.navigate(['centrocusto/adicionar']);
  }

  montarTree(centroCustos) {
    var tree = [],
      mappedCentroCustos = {},
      centroCustosElem,
      mappedElem;


    for (var i = 0, len = centroCustos.length; i < len; i++) {
      centroCustosElem = centroCustos[i];
      mappedCentroCustos[centroCustosElem.id] = centroCustosElem;
      mappedCentroCustos[centroCustosElem.id]['data'] = {};
      mappedCentroCustos[centroCustosElem.id]['children'] = [];
    }

    for (var id in mappedCentroCustos) {
      if (mappedCentroCustos.hasOwnProperty(id)) {
        mappedElem = mappedCentroCustos[id];

        mappedElem.data.descricao = mappedElem.descricao;
        mappedElem.data.codigo = mappedElem.codigo;
        mappedElem.data.classificacao = mappedElem.classificacaoCentroCusto.descricao;

        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.centroCustoPaiId) {
          mappedCentroCustos[mappedElem['centroCustoPaiId']]['children'].push(mappedElem);
        }
        // If the element is at the root level, add it to first level elements array.
        else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

  oncellClick(event) {
    // console.log(event.selectedRowKeys[0]);
    if (event.selectedRowKeys != undefined) {
      this.router.navigate(['centrocusto/editar/' + event.selectedRowKeys]);
    }
  }

  gerarExcel(model, id?) {
    let header: string[] = ["Codigo","Descricao","Classificacao"];
    this.report.gerarExcelTreeTable(this.centroCustos, header, "Centro de Custo");
}

  gerarPDF(model: string) {
    //console.log(this.tre);
    //console.log(this.centroCustos);
    this.toastr.error("Ops! Ocorreu um erro", "Erro ao Gerar PDF");
    // this.report.gerarPDFTreeTable(this.centroCustos,"Centro de Custo");
    // this.report.pdfFile(model, "Centro de Custo");
  }

  nodesInitialized(event){
    // console.log(event.root.children);
    // let header: string[] = ["Codigo","Descricao","Classificacao"];
     this.outroTesteParaGerarExcelComTreeList(event.root)
  }

  outroTesteParaGerarExcelComTreeList(centroCustos){
    centroCustos.children.forEach(el => {
        for(let i = 0; el['children'].length > i;i++){
          var teste = el['children'][i].data;
        }
    });
  }
}