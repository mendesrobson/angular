import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';
import CustomStore from 'devextreme/data/custom_store';
import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Report, ContaCorrente } from '../models/report';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../environments/environment';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'report-viewer-boletosemitidos',
    templateUrl: './report-viewer-boletosemitidos.component.html',
    styleUrls: ['./report-viewer-boletosemitidos.component.css']
})

export class ReportViewerBoletosemitidosComponent implements OnInit {

    public filtroBoletosEmitidosForm: FormGroup;
    public report: Report;
    public agPorContas: boolean = false;
    public destLinhas: boolean = false;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    contaCorrentes: ContaCorrente[];
    ordem: string[];
    opcoes: string[];
    // public selecaoOrdem: string;

    dropdownList = [];
    gridDataSource: any;
    _gridBoxValue: string[] = [];

    dropdownListConta = [];
    gridDataSourceConta: any;
    _gridBoxValueConta: string[] = [];

    hoje = Date.now();

    @ViewChild('scripts') scripts: ElementRef;

    public errors: any[] = [];

    @ViewChild("control") control: ElementRef

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private reportService: ReportService,
        private utilService: UtilService) {
        this.ordem = [
            "Código do cliente",
            "Nome do Cliente",
            "Nosso número"
        ];
        this.opcoes = [
            "Agrupar por contas financeiras",
            "Destacar linhas"
        ];
    }

    ngOnInit() {

        this.filtroBoletosEmitidosForm = this.fb.group({
            empresaId: null,
            grupoEmpresaId: null,
            clienteId: [],
            contaCorrenteId: [],
            competenciaInicial: '',
            competenciaFinal: '',
            emissaoInicial: '',
            emissaoFinal:'',
            vencimentoInicial: '',
            vencimentoFinal: '',
            agruparPorContas: false, // esse nao passa
            destacarLinhas: false,// esse nao passa
            selecaoOrdem: 'Código do cliente'
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
        this.filtroBoletosEmitidosForm.get("agruparPorContas").disable();
        this.filtroBoletosEmitidosForm.get("destacarLinhas").disable();

        let p = Object.assign({}, this.report, this.filtroBoletosEmitidosForm.value);

        switch (p.selecaoOrdem) {
            default:
            case "Código do cliente":
                p.selecaoOrdem = "CodigoCliente";
                break;
            case "Nome do Cliente":
                p.selecaoOrdem = "NomeCliente";
                break;
            case "Nosso número":
                p.selecaoOrdem = "NossoNumero";
                break;
        }

        let itens = [];

        if (this._gridBoxValue.length > 0) {
            for (var i = 0; i < this._gridBoxValue.length; i++) {
                itens.push(this._gridBoxValue[i]);
            }
        }

        p.clienteId = itens;

        let contas = [];

        if (this._gridBoxValueConta.length > 0) {
            for (var i = 0; i < this._gridBoxValueConta.length; i++) {
                contas.push(this._gridBoxValueConta[i]);
            }
        }

        p.contaCorrenteId = contas;

        if (p.emissaoInicial === undefined || p.emissaoInicial === '' || p.emissaoInicial === null) {
            p.emissaoInicial = new Date(1899, 1, 1);
        } 

        if (p.emissaoFinal === undefined || p.emissaoFinal === '' || p.emissaoFinal === null) {
            p.emissaoFinal = new Date(9999, 12, 0);
        } 

        if (p.vencimentoInicial === undefined || p.vencimentoInicial === '' || p.vencimentoInicial === null) {
            p.vencimentoInicial = new Date(1899, 1, 1);
        } 

        if (p.vencimentoFinal === undefined || p.vencimentoFinal === '' || p.vencimentoFinal === null) {
            p.vencimentoFinal = new Date(9999, 12, 0);
        } 

        if (p.competenciaInicial === undefined || p.competenciaInicial === '' || p.competenciaInicial === null) {
            p.competenciaInicial = new Date(1899, 1, 1); 
        } 

        if (p.competenciaFinal === undefined || p.competenciaFinal === '' || p.competenciaFinal === null) {
            p.competenciaFinal = new Date(9999, 12, 0);
        } else {
            p.competenciaFinal = new Date(p.competenciaFinal.getFullYear(), p.competenciaFinal.getMonth() + 1, 0);
        }

        let param = null;
        param = this.reportService.EstruturarParamentrosDoRelatorio('BoletosEmitidos?', p);

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

        this.filtroBoletosEmitidosForm.get("agruparPorContas").enable();
        this.filtroBoletosEmitidosForm.get("destacarLinhas").enable();
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

        this.reportService.obterTodosContaCorrentePorEmpresa(idEmpresa)
            .subscribe(f => {
                this.contaCorrentes = f;
                this.contaCorrentes.forEach(el => {
                    this.dropdownListConta.push({ id: el.id, conta: el.descricao });
                });

                this.gridDataSourceConta = this.makeAsyncDataSource(this.dropdownListConta);

            }, () => { });
    }

    // selectRadioButton(event) {
    //     this.selecaoOrdem = event.value;
    // }

    // startDateSemanal(event) {
    //     this.startSemana = new Date(event.value);
    //     this.limitSemana = new Date(this.startSemana.getFullYear(), this.startSemana.getMonth(), this.startSemana.getDate() + (11 - this.startSemana.getDay()));
    // }

    // startDateDecendial(event) {
    //     this.startDecendial = new Date(event.value);
    //     this.limitDecendial = new Date(this.startDecendial.getFullYear(), this.startDecendial.getMonth(), this.startDecendial.getDate() + (14 - this.startDecendial.getDay()));
    // }

    makeAsyncDataSource(clientes) {
        return new CustomStore({
            loadMode: "raw",
            key: "id",
            load: function () {
                return clientes;
            }
        });
    };

    get gridBoxValue(): string[] {
        return this._gridBoxValue;
    }

    set gridBoxValue(value: string[]) {
        this._gridBoxValue = value || [];
    }

    get gridBoxValueConta(): string[] {
        return this._gridBoxValueConta;
    }

    set gridBoxValueConta(value: string[]) {
        this._gridBoxValueConta = value || [];
    }
}