import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import CustomStore from 'devextreme/data/custom_store';
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';

import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Status, Report } from '../models/report';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'report-viewer-extratofaturamento',
    templateUrl: './report-viewer-extratofaturamento.component.html',
    styleUrls: ['./report-viewer-extratofaturamento.component.css']
})

export class ReportViewerExtratoFaturamentoComponent implements OnInit {
    public filtroRelatorioExtratoFaturamentoForm: FormGroup;
    public report: Report;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    ordemClientes: string[];
    opcoes: string[];

    dropdownList = [];
    gridDataSource: any;
    _gridBoxValue: string[] = [];

    @ViewChild('scripts')
    scripts: ElementRef;

    public errors: any[] = [];

    @ViewChild("control")
    control: ElementRef

    constructor(private renderer: Renderer2,
        private fb: FormBuilder,
        private reportService: ReportService,
        private utilService: UtilService) {
        this.ordemClientes = [
            "Codigo", 
            "Nome"
        ];
        this.opcoes = [
            "Imprimir complemento de evento", 
            "Emitir resumo do faturamento",
            "Destacar linhas"
        ];
     }

    ngOnInit() {

        this.filtroRelatorioExtratoFaturamentoForm = this.fb.group({
            empresaId: null,
            grupoEmpresaId: null,
            clienteId: [],
            dataCompetenciaInicial: '',
            dataCompetenciaFinal:'',
            ordemClientes: 'Codigo'
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

    gerarRelatorioExtratoFaturamento() {

        let p = Object.assign({}, this.report, this.filtroRelatorioExtratoFaturamentoForm.value);

        let itens = [];
        if (this._gridBoxValue.length > 0) {
            for (var i = 0; i < this._gridBoxValue.length; i++) {
                itens.push(this._gridBoxValue[i]);
            }
        }

        p.clienteId = itens;   

        if (p.dataCompetenciaInicial === undefined || p.dataCompetenciaInicial === '' || p.dataCompetenciaInicial === null){
            p.dataCompetenciaFinal = new Date(9999, 12, 0);
            p.dataCompetenciaInicial = new Date(1899, 1, 1);
        }else{
            p.dataCompetenciaFinal = new Date(p.dataCompetenciaInicial.getFullYear(), p.dataCompetenciaInicial.getMonth() + 1, 0);
        }
            
        let param = null;
        param = this.reportService.EstruturarParamentrosDoRelatorio('ExtratoFaturamento?', p);
        console.log(param);

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