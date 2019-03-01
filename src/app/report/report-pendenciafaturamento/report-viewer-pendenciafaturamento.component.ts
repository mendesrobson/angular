import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';
import CustomStore from 'devextreme/data/custom_store';
import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Report } from '../models/report';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'report-viewer-pendenciafaturamento',
    templateUrl: './report-viewer-pendenciafaturamento.component.html',
    styleUrls: ['./report-viewer-pendenciafaturamento.component.css']
})

export class ReportViewerPendenciafaturamentoComponent implements OnInit {
    public filtroPendenciaFaturamentoForm: FormGroup;
    public report: Report;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    ordens: string[];
    opcoes: string[];
    minDataMes: Date;
    minDataEmi: Date;
    minDataVenc: Date;

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

        this.ordens = [
            "Código do Cliente",
            "Nome do Cliente"
        ];
        this.opcoes = [
            "Destacar linhas"
        ];
    }

    ngOnInit() {

        this.filtroPendenciaFaturamentoForm = this.fb.group({
            empresaId: null,
            grupoEmpresaId: null,
            clienteId: [],
            destacarLinha: 'N',
            dataCompetencia: '',
            dataCompetenciaFinal: '',
            dataVencimentoInicial: '',
            dataVencimentoFinal: '',
            ordem: ''
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

    gerarPendenciaFaturamento() {

        //this.filtroPendenciaFaturamentoForm.get('destacarLinha').disable();

        let p = Object.assign({}, this.report, this.filtroPendenciaFaturamentoForm.value);

        switch (p.ordem) {
            default:
            case "Código do Cliente": p.ordem = "codigo"; break;
            case "Nome do Cliente": p.ordem = "nome"; break;
        }

        if ((p.dataCompetencia != undefined)) {
            if ((p.dataCompetencia != "")) {
                p.dataCompetenciaFinal = p.dataCompetencia;
                p.dataCompetenciaFinal = new Date(p.dataCompetenciaFinal.getFullYear(), p.dataCompetenciaFinal.getMonth() + 1, 0);
            }
        }

        let itens = [];
        if (this._gridBoxValue.length > 0) {
            for (var i = 0; i < this._gridBoxValue.length; i++) {
                itens.push(this._gridBoxValue[i]);
            }
        }

        p.clienteId = itens;

        let param = null;
        param = this.reportService.EstruturarParamentrosDoRelatorio('PendenciaFaturamento?', p);

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

        //this.filtroPendenciaFaturamentoForm.get('destacarLinha').enable();
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

    selectRadioButton(event) {
        // this.selecao = event.value;
        // if (this.selecao == 'Competência') {
        //     this.filtroPendenciaFaturamentoForm.controls['competencia'].patchValue('S');
        //     this.filtroPendenciaFaturamentoForm.controls['emissao'].patchValue('N');
        //     this.filtroPendenciaFaturamentoForm.controls['vencimento'].patchValue('N');
        //     if (this.filtroPendenciaFaturamentoForm.controls['dataEmissaoInicial'].value != '') {
        //         this.filtroPendenciaFaturamentoForm.controls['dataEmissaoInicial'].patchValue('');
        //     }
        //     if (this.filtroPendenciaFaturamentoForm.controls['dataEmissaoFinal'].value != '') {
        //         this.filtroPendenciaFaturamentoForm.controls['dataEmissaoFinal'].patchValue('');
        //     }
        // }
        // if (this.selecao == 'Emissão') {
        //     this.filtroPendenciaFaturamentoForm.controls['competencia'].patchValue('N');
        //     this.filtroPendenciaFaturamentoForm.controls['emissao'].patchValue('S');
        //     this.filtroPendenciaFaturamentoForm.controls['vencimento'].patchValue('N');
        //     if (this.filtroPendenciaFaturamentoForm.controls['dataCompetenciaInicial'].value != '') {
        //         this.filtroPendenciaFaturamentoForm.controls['dataCompetenciaInicial'].patchValue('');
        //     }
        //     if (this.filtroPendenciaFaturamentoForm.controls['dataCompetenciaFinal'].value != '') {
        //         this.filtroPendenciaFaturamentoForm.controls['dataCompetenciaFinal'].patchValue('');
        //     }
        // }
        // if (this.selecao == 'Vencimento') {
        //     this.filtroPendenciaFaturamentoForm.controls['competencia'].patchValue('N');
        //     this.filtroPendenciaFaturamentoForm.controls['emissao'].patchValue('N');
        //     this.filtroPendenciaFaturamentoForm.controls['vencimento'].patchValue('S');
        //     if (this.filtroPendenciaFaturamentoForm.controls['dataVencimentoInicial'].value != '') {
        //         this.filtroPendenciaFaturamentoForm.controls['dataVencimentoInicial'].patchValue('');
        //     }
        //     if (this.filtroPendenciaFaturamentoForm.controls['dataVencimentoFinal'].value != '') {
        //         this.filtroPendenciaFaturamentoForm.controls['dataVencimentoFinal'].patchValue('');
        //     }
        // }

    }

    definirDataMes(event) {
        this.minDataMes = event.value;
    }

    definirDataEmi(event) {
        this.minDataEmi = event.value;
    }

    definirDataVenc(event) {
        this.minDataVenc = event.value;
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