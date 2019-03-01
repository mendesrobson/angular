import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';
import CustomStore from 'devextreme/data/custom_store';
import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Status, Report, Evento } from '../models/report';


@Component({
    selector: 'report-viewer-lancamentoevento',
    templateUrl: './report-viewer-lancamentoevento.component.html',
    styleUrls: ['./report-viewer-lancamentoevento.component.css']
})

export class ReportViewerLancamentoeventoComponent implements OnInit {
    public filtroRelatorioLancamentoeventoForm: FormGroup;
    public report: Report;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    tipoLancamento: string[];
    minDataMes: Date;
    ordenseventos: string[];
    lancamentopor: string[];
    ordemLancamentos: string[];
    eventos: Evento[];

    dropdownList = [];
    gridDataSource: any;
    _gridBoxValue: string[] = [];

    @ViewChild('scripts')
    scripts: ElementRef;

    public errors: any[] = [];

    @ViewChild("control") control: ElementRef

    constructor(private renderer: Renderer2,
        private fb: FormBuilder,
        private reportService: ReportService
    ) {
        this.tipoLancamento = [
            "Mensais",
            "Fixos",
            "Informado no contrato"
        ];
        this.ordenseventos = [
            "Código",
            "Nome"
        ];
        this.lancamentopor = [
            "Competência",
            "Cliente",
            "Evento"
        ];
        this.ordemLancamentos = [
            "Competência",
            "Código do cliente",
            "Nome do Cliente"
        ];
    }

    ngOnInit() {

        this.filtroRelatorioLancamentoeventoForm = this.fb.group({
            empresaId: null,
            grupoEmpresaId: null,
            clienteId: [],
            dataCompetenciaInicial: '',
            dataCompetenciaFinal: '',
            ordernarLancamento: '',
            lancamentoPor: '',
            opMensais: false,
            opFixos: false,
            opContrato: false,
            ordernarEvento: '',
            eventoFaturamentoId: null
        });

        this.reportService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas;
            }, () => { });
    }

    ConsultaEmpresa(idGrupo) {
        this.empresas = [];
        this.reportService.obterTodosEmpresa(idGrupo)
            .subscribe(resultado => {
                this.empresas = resultado;
            }, () => { });
    }

    gerarRelatorioLancamentoevento() {

        // this.filtroRelatorioLancamentoeventoForm.get('destacarLinha').disable();

        let p = Object.assign({}, this.report, this.filtroRelatorioLancamentoeventoForm.value);

        if (p.dataCompetenciaInicial === undefined || p.dataCompetenciaInicial === '' || p.dataCompetenciaInicial === null)
            p.dataCompetenciaInicial = new Date(1899, 1, 1);

        if (p.dataCompetenciaFinal === undefined || p.dataCompetenciaFinal === '' || p.dataCompetenciaFinal === null)
            p.dataCompetenciaFinal = new Date(9999, 12, 0);
        else
            p.dataCompetenciaFinal = new Date(p.dataCompetenciaFinal.getFullYear(), p.dataCompetenciaFinal.getMonth() + 1, 0);

        switch (p.lancamentoPor) {
            default:
            case "Competência": p.lancamentoPor = "competencia"; break;
            case "Cliente": p.lancamentoPor = "cliente"; break;
            case "Evento": p.lancamentoPor = "evento"; break;
        }

        switch (p.ordernarEvento) {
            default:
            case "Código": p.ordernarEvento = "codigo"; break;
            case "Nome": p.ordernarEvento = "nome"; break;
        }

        switch (p.ordernarLancamento) {
            default:
            case "Competência": p.ordernarLancamento = "competencia"; break;
            case "Código do cliente": p.ordernarLancamento = "codigo"; break;
            case "Nome do Cliente": p.ordernarLancamento = "nome"; break;
        }

        let itens = [];
        if (this._gridBoxValue.length > 0) {
            for (var i = 0; i < this._gridBoxValue.length; i++) {
                itens.push(this._gridBoxValue[i]);
            }
        }

        p.clienteId = itens;

        let param = null;
        param = this.reportService.EstruturarParamentrosDoRelatorio('LancamentoEventos?', p);

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

        // this.filtroRelatorioLancamentoeventoForm.get('destacarLinha').enable();
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

        this.eventos = [];
        this.reportService.obterEventoFaturamentoPorEmpresa(idEmpresa)
            .subscribe(eventos => {
                this.eventos = eventos
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