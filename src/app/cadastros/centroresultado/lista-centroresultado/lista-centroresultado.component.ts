import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { CentroResultado } from '../models/centroresultado';
import { CentroResultadoService } from '../centroresultado.service';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DxTreeViewComponent } from 'devextreme-angular';

@Component({
    selector: 'app-lista-centroresultado',
    templateUrl: './lista-centroresultado.component.html',
    styleUrls: []
})

export class ListaCentroresultadoComponent implements OnInit {
    @ViewChild(DxTreeViewComponent) treeView;
    private _window: Window;


    public centroResultados: CentroResultado[];
    public grupoEmpresas: GrupoEmpresa[];
    public centroResultadoForm: FormGroup;
    public empresas: Empresa[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    tree = [];

    constructor(public centroResultadoService: CentroResultadoService,private fb: FormBuilder,
        private router: Router, private report: ReportService, private toastr: ToastsManager,
        vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit(): void {

        this.centroResultadoForm = new FormGroup({
            grupoEmpresaId: new FormControl(),
            empresaId: new FormControl()
         });

        this.centroResultadoService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
                () => { });
    }

    editarCentroResultado(id) {
        this.router.navigate(['centroresultado/editar/' + id]);
    }


    oncellClick(event) {
        if (event.selectedRowKeys != undefined) {
            this.router.navigate(['centroresultado/editar/' + event.selectedRowKeys]);
        }
    }

    cadastrarCentroResultado() {
        this.router.navigate(['centroresultado/adicionar']);
    }

    ConsultaEmpresa(idGrupo) {
        this.empresas = [];
        this.centroResultadoService.obterTodosEmpresaPorId(idGrupo)
            .subscribe(empresas => {
                this.empresas = empresas
            },
                () => { });
    }

    ConsultaSelectEmpresa(idEmpresa) {

        this.centroResultadoService.obterTodosCentroResultadoPorEmpresaId(idEmpresa)
            .subscribe(centroResultados => {
                this.centroResultados = centroResultados;
                this.tree = this.montarTree(this.centroResultados);
            },
                () => { });
    }

    montarTree(centroResultados) {
        var tree = [],
            mappedCentroResultados = {},
            centroResultadoElem,
            mappedElem;

        // First map the nodes of the array to an object -> create a hash table.
        for (var i = 0, len = centroResultados.length; i < len; i++) {
            centroResultadoElem = centroResultados[i];
            mappedCentroResultados[centroResultadoElem.id] = centroResultadoElem;
            mappedCentroResultados[centroResultadoElem.id]['data'] = {};
            mappedCentroResultados[centroResultadoElem.id]['children'] = [];
        }

        for (var id in mappedCentroResultados) {
            if (mappedCentroResultados.hasOwnProperty(id)) {
                mappedElem = mappedCentroResultados[id];

                mappedElem.data.descricao = mappedElem.descricao;
                mappedElem.data.codigo = mappedElem.codigo;
                mappedElem.data.classificacao = mappedElem.classificacaoCentroResultado.descricao;

                // If the element is not at the root level, add it to its parent array of children.
                if (mappedElem.centroResultadoPaiId) {
                    mappedCentroResultados[mappedElem['centroResultadoPaiId']]['children'].push(mappedElem);
                }
                // If the element is at the root level, add it to first level elements array.
                else {
                    tree.push(mappedElem);
                }
            }
        }
        return tree;
    }

    getNode(event) {

        if (event.node != undefined) {
            this.router.navigate(['centroresultado/editar/' + event.node.id]);
        }

    }
    gerarExcel(model, id?) {
        let header: string[] = ["Codigo","Descricao","Classificacao"];
        this.report.gerarExcelTreeTable(this.centroResultados, header, "Centro de Resultados");
    }

    gerarPDF(model: string) {
        //if (!this.treeView) return;
        //this.treeView.instance.print();
        //this.toastr.error("Ops! Ocorreu um erro", "Erro ao Gerar PDF");
       // this.report.gerarPDFTreeTable(this.centroResultados,"Centro de Custo");
         this.report.pdfFile(model, "Centro de Resultados");
    }
}

