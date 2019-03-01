import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';
import CustomStore from 'devextreme/data/custom_store';

import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Status, Report, Evento } from '../models/report';


@Component({
    selector: 'report-viewer-resumofaturamento',
    templateUrl: './report-viewer-resumofaturamento.component.html',
    styleUrls: ['./report-viewer-resumofaturamento.component.css']
})

export class ReportViewerResumoFaturamentoComponent implements OnInit {
    public filtroRelatorioResumoFaturamentoForm: FormGroup;
    public report: Report;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    eventos: Evento[];
    opcoes: string[];
    minDataMes: Date;

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
        private reportService: ReportService
    ) {
        this.opcoes = [
            "Destacar linhas"
        ];
    }

    ngOnInit() {

        this.filtroRelatorioResumoFaturamentoForm = this.fb.group({
            empresaId: null,
            grupoEmpresaId: null,
            clienteId: null,
            eventoFaturamentoId: null,
            dataCompetenciaInicial: '',
            dataCompetenciaFinal: '',
            destacarLinha: 'N',
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

    gerarRelatorioResumoFaturamento() {

        this.filtroRelatorioResumoFaturamentoForm.get('destacarLinha').disable();

        let p = Object.assign({}, this.report, this.filtroRelatorioResumoFaturamentoForm.value);

        if(p.dataCompetenciaInicial === undefined || p.dataCompetenciaInicial === '' || p.dataCompetenciaInicial === null)
            p.dataCompetenciaInicial = '1899-01-01';

        if(p.dataCompetenciaFinal === undefined || p.dataCompetenciaFinal === '' || p.dataCompetenciaFinal === null)
            p.dataCompetenciaFinal = '9999-12-20';

        let param = this.reportService.EstruturarParamentrosDoRelatorio('ResumoFaturamentoMaster?', p);

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

        this.filtroRelatorioResumoFaturamentoForm.get('destacarLinha').enable();
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


    definirDataMes(event) {
        this.minDataMes = event.value;
    }

}