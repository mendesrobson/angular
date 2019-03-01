import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';
import CustomStore from 'devextreme/data/custom_store';
import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Status, Report, Evento } from '../models/report';


@Component({
    selector: 'report-viewer-reajustecontratos',
    templateUrl: './report-viewer-reajustecontratos.component.html',
    styleUrls: ['./report-viewer-reajustecontratos.component.css']
})

export class ReportViewerReajustecontratos implements OnInit {
    public filtroReajustecontratosForm: FormGroup;
    public report: Report;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
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

        this.filtroReajustecontratosForm = this.fb.group({
            empresaId: null,
            grupoEmpresaId: null,
            clienteId: [],
            dataCompetenciaInicial: '',
            dataCompetenciaFinal: ''
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

    gerarReajustecontratos() {

       // this.filtroReajustecontratosForm.get('destacarLinha').disable();

        let p = Object.assign({}, this.report, this.filtroReajustecontratosForm.value);

        if (p.dataCompetenciaInicial === undefined || p.dataCompetenciaInicial === '' || p.dataCompetenciaInicial === null)
            p.dataCompetenciaInicial = new Date(1899, 1, 1);

        if (p.dataCompetenciaFinal === undefined || p.dataCompetenciaFinal === '' || p.dataCompetenciaFinal === null)
            p.dataCompetenciaFinal = new Date(9999, 12, 0);
        else
            p.dataCompetenciaFinal = new Date(p.dataCompetenciaFinal.getFullYear(), p.dataCompetenciaFinal.getMonth() + 1, 0);

        let itens = [];
        if (this._gridBoxValue.length > 0) {
            for (var i = 0; i < this._gridBoxValue.length; i++) {
                itens.push(this._gridBoxValue[i]);
            }
        }

        p.clienteId = itens;

        let param = null;
        param = this.reportService.EstruturarParamentrosDoRelatorio('ReajusteContratos?', p);

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

        //this.filtroReajustecontratosForm.get('destacarLinha').enable();
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


    definirDataMes(event) {
        this.minDataMes = event.value;
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