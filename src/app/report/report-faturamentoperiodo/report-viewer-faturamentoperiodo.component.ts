import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import CustomStore from 'devextreme/data/custom_store';
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';

import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Report } from '../models/report';
import { environment } from '../../../environments/environment';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'report-viewer-faturamentoperiodo',
    templateUrl: './report-viewer-faturamentoperiodo.component.html',
    styleUrls: ['./report-viewer-faturamentoperiodo.component.css']
})

export class ReportViewerFaturamentoperiodoComponent implements OnInit {

    public filtroBoletosEmitidosForm: FormGroup;
    public report: Report;
    public deduzirOpcoes: boolean = false;
    public destLinhas: boolean = false;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    ordem: string[];
    opcoes: string[];
    emitidoPor: string[];

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
        private reportService: ReportService,
        private utilService: UtilService) {
        this.ordem = [
            "Código do Cliente",
            "Nome do Cliente"
        ];
        this.emitidoPor = [
            "Cliente",
            "Classificação de cliente",
            "Tipo de cliente",
            "Categoria",
            "Classificação de categoria",
            "Tipo de contrato",
            "Evento"
        ];
        this.opcoes = [
            "Não deduzir retenções por emissão no faturamento",
            "Destacar linhas"
        ];
    }

    ngOnInit() {

        this.filtroBoletosEmitidosForm = this.fb.group({
            empresaId: null,
            grupoEmpresaId: null,
            clienteId: [],
            competenciaInicial: '',
            competenciaFinal: '',
            destacarLinha: false,
            deduzir: false,
            ordenarPor: 'Código do Cliente',
            emitidosPor: ''
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

        switch (p.ordenarPor) {
            default:
            case "Código do Cliente": p.ordenarPor = "codigo"; break;
            case "Nome do Cliente": p.ordenarPor = "nome"; break;
        }

        switch (p.emitidosPor) {
            default:
            case "Cliente": p.emitidosPor = "cliente"; break;
            case "Classificação de cliente": p.emitidosPor = "classificacaoCliente"; break;
            case "Tipo de cliente": p.emitidosPor = "tipoCliente"; break;
            case "Categoria": p.emitidosPor = "categoria"; break;
            case "Classificação de categoria": p.emitidosPor = "classificacaoCategoria"; break;
            case "Tipo de contrato": p.emitidosPor = "tipoContrato"; break;
            case "Evento": p.emitidosPor = "evento"; break;
        }

        //#region Tratamento Datas
        let itens = [];
        if (this._gridBoxValue.length > 0) {
            for (var i = 0; i < this._gridBoxValue.length; i++) {
                itens.push(this._gridBoxValue[i]);
            }
        }

        p.clienteId = itens;
        
        if(p.competenciaInicial === '' || p.competenciaInicial === undefined || p.competenciaInicial === null)
            p.competenciaInicial = '01011899';
        else
            p.competenciaInicial = this.utilService.ConvertDateExtensive(p.competenciaInicial).replace(/\//g, '');  

        if(p.competenciaFinal === '' || p.competenciaFinal === undefined || p.competenciaFinal === null)
            p.competenciaFinal = '27122999';
        else
            p.competenciaFinal = this.utilService.ConvertDateExtensive(new Date(p.competenciaFinal.getFullYear(), p.competenciaFinal.getMonth() + 1, 0)).replace(/\//g, '');
            
        //#endregion
    
        let param = null;
        param = this.reportService.EstruturarParamentrosDoRelatorio('FaturamentoPeriodo?', p);

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