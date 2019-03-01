import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';
import CustomStore from 'devextreme/data/custom_store';
import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Report } from '../models/report';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'report-viewer-notasfiscaisemitidas',
    templateUrl: './report-viewer-notasfiscaisemitidas.component.html',
    styleUrls: ['./report-viewer-notasfiscaisemitidas.component.css']
})

export class ReportViewerNotasfiscaisemitidasComponent implements OnInit {

    public filtroBoletosEmitidosForm: FormGroup;
    public report: Report;
    public agPorContas: boolean = false;
    public destLinhas: boolean = false;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    ordem: string[];
    opcoes: string[];
    filtro: string[];

    dropdownList = [];
    gridDataSource: any;
    _gridBoxValue: string[] = [];

    hoje = Date.now();

    @ViewChild('scripts') scripts: ElementRef;

    public errors: any[] = [];

    @ViewChild("control") control: ElementRef

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private reportService: ReportService) {
        this.ordem = [
            "Código do cliente",
            "Nome do Cliente",
            "Número da nota"
        ];
        this.filtro = [
            "Notas",
            "Notas canceladas",
            "Todas"
        ];
        this.opcoes = [
            "Somente notas com CRF"
        ];
    }

    ngOnInit() {

        this.filtroBoletosEmitidosForm = this.fb.group({
            empresaId: null,
            grupoEmpresaId: null,
            clienteId: [],
            competenciaInicial: '',
            competenciaFinal: '',
            emissaoInicial: '',
            emissaoFinal: '',
            notascrf: false,
            selecaoOrdem: 'Código do cliente',
            selecaoFiltros: ''
        });

        this.reportService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas;
            },
                () => this.errors);
    }

    ConsultaEmpresa(idGrupo) {
        this.empresas = [];
        this.reportService.obterTodosEmpresa(idGrupo)
            .subscribe(resultado => {
                this.empresas = resultado;
            },
                () => this.errors);

    }
    gerarRelatorioBoletosEmitidos() {
        let p = Object.assign({}, this.report, this.filtroBoletosEmitidosForm.value);

        switch (p.selecaoOrdem) {
            default:
            case "Código do cliente": p.selecaoOrdem = "codigo"; break;
            case "Nome do Cliente": p.selecaoOrdem = "nome"; break;
            case "Número da nota": p.selecaoOrdem = "codNota"; break;
        }

        switch (p.selecaoFiltros) {
            default:
            case "Notas": p.selecaoFiltros = "notas"; break;
            case "Notas canceladas": p.selecaoFiltros = "canceladas"; break;
            case "Todas": p.selecaoFiltros = "all"; break;
        }

        //#region Tratamento Datas

        if(p.competenciaInicial === undefined || p.competenciaInicial === '' || p.competenciaInicial === null)
            p.competenciaInicial = new Date(1899, 1, 1);
        
        if(p.competenciaFinal === undefined || p.competenciaFinal === '' || p.competenciaFinal === null)
            p.competenciaFinal = new Date(2999, 12, 0);

        if(p.emissaoInicial === undefined || p.emissaoInicial === '' || p.emissaoInicial === null)
            p.emissaoInicial = new Date(1899, 1, 1);
        
        if(p.emissaoFinal === undefined || p.emissaoFinal === '' || p.emissaoFinal === null)
            p.emissaoFinal = new Date(2999, 12, 0);

        //#endregion
        let itens = [];
        if (this._gridBoxValue.length > 0) {
            for (var i = 0; i < this._gridBoxValue.length; i++) {
                itens.push(this._gridBoxValue[i]);
            }
        }

        p.clienteId = itens;

        let param = null;
        param = this.reportService.EstruturarParamentrosDoRelatorio('NotasFiscaisEmitidas?', p);

        this.renderer.destroy;
        ko.cleanNode(this.control.nativeElement);

        const reportUrl = param,
            host = `${environment.url_reportView}`,
            container = this.renderer.createElement("div");

        container.innerHTML = Html;
        this.renderer.appendChild(this.scripts.nativeElement, container);
        ko.applyBindings({
            reportUrl, // The URL of a report that is opened in the Document Viewer when the application starts.  
            requestOptions: { // Options for processing requests from the Web Document Viewer.  
                host, // URI of your backend project.  
                invokeAction: "/WebDocumentViewer/Invoke" // The URI path of the controller action that processes requests.  
            }
        }, this.control.nativeElement);

    }

    ConsultaSelectEmpresa(idEmpresa) {

        this.reportService.obterTodosClientePorEmpresa(idEmpresa)
            .subscribe(f => {
                this.clientes = f;
                this.clientes.forEach(el => {
                    this.dropdownList.push({ id: el.id, codigo: el.pessoa.codigo, cliente: el.pessoa.nome });
                });

                this.gridDataSource = this.makeAsyncDataSource(this.dropdownList);

            }, () => { });
    }

    makeAsyncDataSource(clientes) {
        return new CustomStore({
            loadMode: "raw",
            key: "id",
            load: function () {
                return clientes;
            }
        });
    }

    get gridBoxValue(): string[] {
        return this._gridBoxValue;
    }

    set gridBoxValue(value: string[]) {
        this._gridBoxValue = value || [];
    }
}