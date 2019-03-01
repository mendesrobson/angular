import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';
import CustomStore from 'devextreme/data/custom_store';

import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Status, Report } from '../models/report';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'report-viewer-relacaofaturamento',
    templateUrl: './report-viewer-relacaofaturamento.component.html',
    styleUrls: ['./report-viewer-relacaofaturamento.component.css']
})

export class ReportViewerRelacaoFaturamentoComponent implements OnInit {
    public filtroRelatorioRelacaoFaturamentoForm: FormGroup;
    public report: Report;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    ordemClientes: string[];
    ordemEmpresas: string[];
    opcoes: string[];

    dropdownList = [];
    gridDataSource: any;
    _gridBoxValue: string[] = [];

    @ViewChild('scripts')
    scripts: ElementRef;

    public errors: any[] = [];

    @ViewChild("control")
    control: ElementRef

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private reportService: ReportService,
        private utilService: UtilService) { 
            this.ordemClientes = [
                "Codigo", 
                "Nome"
            ];
            this.ordemEmpresas = [
                "Codigo", 
                "Nome"
            ];
            this.opcoes = [
                "Destacar linhas", 
                "Emitir total de todas as empresas"
            ];
        }

    ngOnInit() {

        this.filtroRelatorioRelacaoFaturamentoForm = this.fb.group({
            empresaId: null,
            grupoEmpresaId: null,
            clienteId: null,
            dataCompetencia: null,
            destacarLinha: 'N',
            emitirTodasEmpresas: 'N',
            ordemClientes:'Codigo'
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

    gerarRelatorioRelacaoFaturamento() {

        this.filtroRelatorioRelacaoFaturamentoForm.get('destacarLinha').disable();
        this.filtroRelatorioRelacaoFaturamentoForm.get('emitirTodasEmpresas').disable();

        let p = Object.assign({}, this.report, this.filtroRelatorioRelacaoFaturamentoForm.value);

        
        if(p.dataCompetencia != undefined)
            if(p.dataCompetencia != '')
                p.dataCompetencia = this.utilService.ConvertDateExtensive(p.dataCompetencia).replace(/\//g, '');

        let param = null;
        param = this.reportService.EstruturarParamentrosDoRelatorio('RelacaoFaturamento?', p);
        
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

        this.filtroRelatorioRelacaoFaturamentoForm.get('destacarLinha').enable();
        this.filtroRelatorioRelacaoFaturamentoForm.get('emitirTodasEmpresas').enable();
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

}